// js/auth.js
const supabase = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);
let currentUser = null;
let viewingDesktopId = null;
let currentSort = 'popular'; // 'popular' | 'newest'

async function initAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) handleLoginSuccess(session.user);
    else { $('#guest-view').show(); $('#logged-view').hide(); }
}

function handleLoginSuccess(user) {
    currentUser = user;
    $('#guest-view').hide(); $('#logged-view').show();
    $('#user-nickname').text(user.email.split('@')[0]);
    $('#modal-overlay').addClass('hidden');
    // 登录后显示收藏夹按钮
    $('#fav-btn-container').removeClass('hidden');
    loadCloudDesktop();
}

$('#btn-do-login').click(async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email: $('#email').val(), password: $('#password').val() });
    if (error) alert("Error: " + error.message); else handleLoginSuccess(data.user);
});

$('#btn-do-signup').click(async () => {
    const { data, error } = await supabase.auth.signUp({ email: $('#email').val(), password: $('#password').val() });
    if (error) alert("Error: " + error.message); else alert(t("reg_check_email"));
});

$('#btn-logout').click(async () => { await supabase.auth.signOut(); location.reload(); });

// 保存
async function saveDesktopData(isPublic) {
    if (!currentUser) return alert("Please login");
    const os = window.desktopManager.currentOS;
    const layout = window.desktopManager.exportLayout();
    window.desktopManager.cachedLayouts[os].is_public = isPublic;

    const { error } = await supabase.from('desktops').upsert({ 
        user_id: currentUser.id, os_type: os, layout_data: layout, is_public: isPublic 
    }, { onConflict: 'user_id, os_type' });

    if (error) alert("Save Failed: " + error.message); else alert(t("save") + " Success!");
}
window.saveDesktopData = saveDesktopData;

// 加载
async function loadCloudDesktop() {
    if (!currentUser) return;
    const os = window.desktopManager.currentOS;
    $('#chk-public').prop('checked', false); 
    $('#count-likes').text('-'); $('#count-favs').text('-');

    const { data } = await supabase.from('desktops').select('id, layout_data, is_public, likes_count, favorites_count').eq('user_id', currentUser.id).eq('os_type', os).maybeSingle();
    
    if (data) {
        if (data.layout_data) window.desktopManager.loadLayout(data.layout_data);
        $('#chk-public').prop('checked', data.is_public);
        $('#count-likes').text(data.likes_count || 0);
        $('#count-favs').text(data.favorites_count || 0);
    }
}
window.loadCloudDesktop = loadCloudDesktop;

// === 世界 / 收藏夹 逻辑 ===

// Tab 切换
$('#tab-popular').click(() => { currentSort = 'popular'; switchTab('popular'); loadWorldData(); });
$('#tab-newest').click(() => { currentSort = 'newest'; switchTab('newest'); loadWorldData(); });

function switchTab(type) {
    $('.world-tabs button').removeClass('active');
    $(`#tab-${type}`).addClass('active');
}

// 打开世界
window.loadWorldData = async function() {
    $('#world-overlay').removeClass('hidden');
    $('#world-title').text(t('world'));
    $('.world-tabs').removeClass('hidden'); // 显示排序Tab
    renderGrid(null, 'world'); // 加载世界数据
}

// 打开收藏夹
$('#btn-my-favs').click(() => {
    $('#world-overlay').removeClass('hidden');
    $('#world-title').text("我的收藏");
    $('.world-tabs').addClass('hidden'); // 收藏夹不需要排序Tab
    renderGrid(null, 'favs'); // 加载收藏数据
});

async function renderGrid(data, type) {
    const grid = $('#world-grid');
    grid.html('<p>Loading...</p>');
    
    let query;
    if (type === 'world') {
        // 世界广场查询
        if (currentSort === 'popular') {
            // 使用我们创建的视图进行排序 (likes + favs)
            query = supabase.from('ranked_desktops').select('*').order('popularity', { ascending: false });
        } else {
            query = supabase.from('desktops').select('*, profiles(nickname)').eq('is_public', true).order('created_at', { ascending: false });
        }
    } else {
        // 收藏夹查询 (联表查询 favorites -> desktops)
        query = supabase.from('favorites').select('desktop:desktops(*, profiles(nickname))').eq('user_id', currentUser.id);
    }

    const { data: resData, error } = await query.limit(50);

    grid.empty();
    if (error) { console.log(error); grid.html('<p>Error loading.</p>'); return; }
    
    // 处理数据结构差异
    const items = type === 'favs' ? resData.map(f => f.desktop) : resData;

    if (!items || items.length === 0) { grid.html('<p>Empty.</p>'); return; }

    items.forEach(item => {
        if(!item) return;
        const name = item.profiles ? item.profiles.nickname : (item.author_name || 'User');
        const card = $(`<div class="world-card"><div class="card-preview" style="background:${getOSColor(item.os_type)}"><i class="fa-solid fa-desktop" style="font-size:40px; color:rgba(255,255,255,0.5)"></i></div><div class="card-info"><strong>${item.os_type}</strong><br><span>${name}</span><br><span style="color:red">❤️ ${item.likes_count||0}</span> <span style="color:orange">⭐ ${item.favorites_count||0}</span></div></div>`);
        card.click(() => enterViewMode(item, name));
        grid.append(card);
    });
}

function enterViewMode(item, name) {
    viewingDesktopId = item.id;
    $('#world-overlay').addClass('hidden');
    window.desktopManager.switchOS(item.os_type);
    window.desktopManager.loadLayout(item.layout_data);
    
    $('#os-tabs button').removeClass('active'); $(`#os-tabs button[data-os="${item.os_type}"]`).addClass('active');
    $('#btn-exit-view').removeClass('hidden');
    $('#logged-view').hide(); $('#visitor-view').removeClass('hidden'); $('#visitor-target-name').text(name);
    $('#sidebar .toolbox').addClass('hidden'); $('#comments-panel').removeClass('hidden'); $('#fav-btn-container').addClass('hidden');
    
    $('.app-icon').draggable('disable');
    loadComments(item.id);
}

// 留言/点赞/收藏 (切换逻辑)
async function toggleInteraction(table, btnId, activeText, inactiveText) {
    if(!currentUser) return alert("Login first");
    
    // 1. 先检查是否存在
    const { data } = await supabase.from(table).select('id').eq('user_id', currentUser.id).eq('desktop_id', viewingDesktopId).maybeSingle();
    
    if (data) {
        // 存在 -> 删除 (取消)
        if (table === 'likes') return alert("不能取消点赞 (设计如此)"); // 你的需求
        
        await supabase.from(table).delete().eq('id', data.id);
        alert("已取消");
    } else {
        // 不存在 -> 插入
        await supabase.from(table).insert({ user_id: currentUser.id, desktop_id: viewingDesktopId });
        alert(activeText);
    }
}

$('#btn-like').click(() => toggleInteraction('likes', 'btn-like', '点赞成功!', ''));
$('#btn-fav').click(() => toggleInteraction('favorites', 'btn-fav', '已收藏!', '已取消收藏'));

// 留言相关保持不变
async function loadComments(id) {
    const list = $('#comments-list'); list.empty();
    const { data } = await supabase.from('comments').select('content, profiles(nickname)').eq('desktop_id', id).order('created_at', {ascending:false});
    if(data) data.forEach(c => list.append(`<div class="comment-item"><strong>${c.profiles.nickname}:</strong> ${c.content}</div>`));
}
$('#btn-send-comment').click(async () => {
    if(!currentUser) return alert("Please login");
    const val = $('#inp-comment').val(); if(!val) return;
    await supabase.from('comments').insert({ desktop_id: viewingDesktopId, user_id: currentUser.id, content: val });
    $('#inp-comment').val(''); loadComments(viewingDesktopId);
});

function getOSColor(os) { switch(os) { case 'windows': return '#00a8e8'; case 'macos': return '#636e72'; default: return '#333'; } }

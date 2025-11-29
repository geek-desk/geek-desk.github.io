// js/auth.js
const supabase = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);
let currentUser = null;
let viewingDesktopId = null;

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
    loadCloudDesktop();
}

$('#btn-do-login').click(async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email: $('#email').val(), password: $('#password').val() });
    if (error) alert("Error: " + error.message); else handleLoginSuccess(data.user);
});

$('#btn-do-signup').click(async () => {
    const { data, error } = await supabase.auth.signUp({ email: $('#email').val(), password: $('#password').val() });
    if (error) alert("Error: " + error.message); else alert("注册成功！请登录");
});

$('#btn-logout').click(async () => { await supabase.auth.signOut(); location.reload(); });

// 保存
async function saveDesktopData(isPublic) {
    if (!currentUser) return alert("请先登录");
    const os = window.desktopManager.currentOS;
    const layout = window.desktopManager.exportLayout(); // 包含 wallpaper, icons, folders
    
    // 更新本地缓存状态
    window.desktopManager.cachedLayouts[os].is_public = isPublic;

    const { error } = await supabase.from('desktops').upsert({ 
        user_id: currentUser.id, os_type: os, layout_data: layout, is_public: isPublic 
    }, { onConflict: 'user_id, os_type' });

    if (error) alert("保存失败: " + error.message); else alert("保存成功！");
}
window.saveDesktopData = saveDesktopData;

// 加载 (核心：修复公开状态同步)
async function loadCloudDesktop() {
    if (!currentUser) return;
    const os = window.desktopManager.currentOS;
    
    // 1. 先重置公开状态为 false (默认)
    $('#chk-public').prop('checked', false);
    $('#count-likes').text('-'); $('#count-favs').text('-');

    const { data, error } = await supabase.from('desktops').select('id, layout_data, is_public').eq('user_id', currentUser.id).eq('os_type', os).maybeSingle();
    
    if (data) {
        if (data.layout_data) window.desktopManager.loadLayout(data.layout_data);
        // 2. 如果数据库说是公开的，再勾上
        $('#chk-public').prop('checked', data.is_public);
        
        loadStats(data.id);
    }
}
window.loadCloudDesktop = loadCloudDesktop;

async function loadStats(id) {
    if(!id) return;
    // 实时查表
    const { count: likes } = await supabase.from('likes').select('*', { count: 'exact', head: true }).eq('desktop_id', id);
    const { count: favs } = await supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('desktop_id', id);
    $('#count-likes').text(likes || 0);
    $('#count-favs').text(favs || 0);
}

// 世界
async function loadWorldData() {
    $('#world-overlay').removeClass('hidden');
    const grid = $('#world-grid'); grid.html('<p>加载中...</p>');
    const { data, error } = await supabase.from('desktops').select('id, layout_data, os_type, likes_count, user_id, profiles(nickname)').eq('is_public', true).order('likes_count', { ascending: false }).limit(20);
    
    grid.empty();
    if (!data || data.length === 0) { grid.html('<p>暂无公开桌面</p>'); return; }

    data.forEach(item => {
        const name = item.profiles ? item.profiles.nickname : '用户';
        // 使用 CSS 提取背景图颜色或默认色
        const card = $(`<div class="world-card"><div class="card-preview" style="background:#333;color:#fff;display:flex;align-items:center;justify-content:center;"><i class="fa-solid fa-desktop" style="font-size:40px;"></i></div><div class="card-info"><strong>${item.os_type}</strong><br><span>${name}</span><br><span style="color:red">❤️ ${item.likes_count||0}</span></div></div>`);
        card.click(() => enterViewMode(item, name));
        grid.append(card);
    });
}
window.loadWorldData = loadWorldData;

function enterViewMode(item, name) {
    viewingDesktopId = item.id;
    $('#world-overlay').addClass('hidden');
    window.desktopManager.switchOS(item.os_type);
    window.desktopManager.loadLayout(item.layout_data);
    
    $('#os-tabs button').removeClass('active'); $(`#os-tabs button[data-os="${item.os_type}"]`).addClass('active');
    $('#btn-exit-view').removeClass('hidden');
    $('#logged-view').hide(); $('#visitor-view').removeClass('hidden'); $('#visitor-target-name').text(name);
    $('#sidebar .toolbox').addClass('hidden'); $('#comments-panel').removeClass('hidden');
    
    $('.app-icon').draggable('disable'); // 禁拖动
    loadComments(item.id);
}

async function loadComments(id) {
    const list = $('#comments-list'); list.empty();
    const { data } = await supabase.from('comments').select('content, profiles(nickname)').eq('desktop_id', id).order('created_at', {ascending:false});
    if(data) data.forEach(c => list.append(`<div class="comment-item"><strong>${c.profiles.nickname}:</strong> ${c.content}</div>`));
}

$('#btn-send-comment').click(async () => {
    if(!currentUser) return alert("请先登录");
    const val = $('#inp-comment').val(); if(!val) return;
    await supabase.from('comments').insert({ desktop_id: viewingDesktopId, user_id: currentUser.id, content: val });
    $('#inp-comment').val(''); loadComments(viewingDesktopId);
});

$('#btn-like').click(async () => {
    if(!currentUser) return alert("请先登录");
    const { error } = await supabase.from('likes').insert({ user_id: currentUser.id, desktop_id: viewingDesktopId });
    if(!error) { alert("已点赞！"); } else { alert("您已赞过"); }
});

$('#btn-fav').click(async () => {
    if(!currentUser) return alert("请先登录");
    const { error } = await supabase.from('favorites').insert({ user_id: currentUser.id, desktop_id: viewingDesktopId });
    if(!error) { alert("已收藏！"); } else { alert("已收藏过"); }
});

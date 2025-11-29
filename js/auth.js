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
    if (error) alert("Error: " + error.message); else alert(t("reg_check_email"));
});

$('#btn-logout').click(async () => { await supabase.auth.signOut(); location.reload(); });

// 保存
async function saveDesktopData(isPublic) {
    if (!currentUser) return alert("Please login");
    const os = window.desktopManager.currentOS;
    const layout = window.desktopManager.exportLayout();
    
    // 更新本地缓存的公开状态
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
    
    // 1. 加载桌面数据
    const { data, error } = await supabase.from('desktops').select('id, layout_data, is_public').eq('user_id', currentUser.id).eq('os_type', os).maybeSingle();
    
    if (data) {
        if (data.layout_data) window.desktopManager.loadLayout(data.layout_data);
        // 关键：更新公开复选框
        $('#chk-public').prop('checked', data.is_public);
        
        // 2. 加载点赞/收藏数
        loadStats(data.id);
    } else {
        $('#chk-public').prop('checked', false);
        $('#count-likes').text(0); $('#count-favs').text(0);
    }
}
window.loadCloudDesktop = loadCloudDesktop;

async function loadStats(desktopId) {
    if(!desktopId) return;
    const { count: likes } = await supabase.from('likes').select('*', { count: 'exact', head: true }).eq('desktop_id', desktopId);
    const { count: favs } = await supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('desktop_id', desktopId);
    $('#count-likes').text(likes || 0);
    $('#count-favs').text(favs || 0);
}

// 世界
async function loadWorldData() {
    $('#world-overlay').removeClass('hidden');
    const grid = $('#world-grid'); grid.html('<p>Loading...</p>');
    // 这里简单查 desktops，likes_count 需通过 SQL 触发器更新，或者这里只展示大概
    const { data, error } = await supabase.from('desktops').select('id, layout_data, os_type, likes_count, user_id, profiles(nickname)').eq('is_public', true).order('created_at', { ascending: false }).limit(20);
    
    grid.empty();
    if (!data || data.length === 0) { grid.html('<p>No data.</p>'); return; }

    data.forEach(item => {
        const name = item.profiles ? item.profiles.nickname : 'User';
        const card = $(`<div class="world-card"><div class="card-preview" style="background:${getOSColor(item.os_type)}"><i class="fa-solid fa-desktop" style="font-size:40px; color:rgba(255,255,255,0.5)"></i></div><div class="card-info"><strong>${item.os_type}</strong><br><span>${name}</span><br><span style="color:red">❤️ ${item.likes_count||0}</span></div></div>`);
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
    $('.app-icon').draggable('disable');
    loadComments(item.id);
}

// 留言/点赞逻辑 (略，保持之前的即可)
async function loadComments(id) {
    const list = $('#comments-list'); list.empty();
    const { data } = await supabase.from('comments').select('content, profiles(nickname)').eq('desktop_id', id).order('created_at', {ascending:false});
    if(data) data.forEach(c => list.append(`<div class="comment-item"><strong>${c.profiles.nickname}:</strong> ${c.content}</div>`));
}
$('#btn-send-comment').click(async () => {
    if(!currentUser) return alert("Login first");
    const { error } = await supabase.from('comments').insert({ desktop_id: viewingDesktopId, user_id: currentUser.id, content: $('#inp-comment').val() });
    if(!error) { $('#inp-comment').val(''); loadComments(viewingDesktopId); }
});
$('#btn-like').click(async () => {
    if(!currentUser) return alert("Login first");
    await supabase.from('likes').insert({ user_id: currentUser.id, desktop_id: viewingDesktopId });
    alert("Liked!");
});
$('#btn-fav').click(async () => {
    if(!currentUser) return alert("Login first");
    await supabase.from('favorites').insert({ user_id: currentUser.id, desktop_id: viewingDesktopId });
    alert("Saved!");
});

function getOSColor(os) { switch(os) { case 'windows': return '#00a8e8'; case 'macos': return '#636e72'; default: return '#333'; } }
function t(key) { return CONFIG.i18n[navigator.language.startsWith('zh')?'zh':'en'][key] || key; }

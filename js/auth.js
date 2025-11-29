// js/auth.js
const supabase = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);
let currentUser = null;
let viewingDesktopId = null; 

async function initAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        handleLoginSuccess(session.user);
    } else {
        $('#guest-view').show();
        $('#logged-view').hide();
    }
}

function handleLoginSuccess(user) {
    currentUser = user;
    $('#guest-view').hide();
    $('#logged-view').show();
    $('#user-nickname').text(user.email.split('@')[0]);
    $('#modal-overlay').addClass('hidden');
    loadCloudDesktop(); 
}

$('#btn-do-login').click(async () => {
    const email = $('#email').val();
    const password = $('#password').val();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Error: " + error.message);
    else handleLoginSuccess(data.user);
});

$('#btn-do-signup').click(async () => {
    const email = $('#email').val();
    const password = $('#password').val();
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) alert("Error: " + error.message);
    else alert(t("reg_check_email"));
});

$('#btn-logout').click(async () => {
    await supabase.auth.signOut();
    location.reload();
});

// 保存 (仅当前OS)
async function saveDesktopData(isPublic) {
    if (!currentUser) return alert("Please login");
    const os = window.desktopManager.currentOS;
    const layout = window.desktopManager.exportLayout(); // 此时 layout 包含 icons 和 folders

    // 需要确保 layout 结构里有 icons 和 folders
    // 同时也更新本地缓存的 is_public 状态
    if (!window.desktopManager.cachedLayouts[os]) window.desktopManager.cachedLayouts[os] = {};
    window.desktopManager.cachedLayouts[os].is_public = isPublic;

    const { error } = await supabase.from('desktops').upsert({ 
        user_id: currentUser.id, 
        os_type: os, 
        layout_data: layout,
        is_public: isPublic
    }, { onConflict: 'user_id, os_type' });

    if (error) alert("Save Failed: " + error.message);
    else alert(t("save") + " Success!");
}
window.saveDesktopData = saveDesktopData;

// 加载当前OS
async function loadCloudDesktop() {
    if (!currentUser) return;
    const os = window.desktopManager.currentOS;
    const { data, error } = await supabase.from('desktops').select('layout_data, is_public').eq('user_id', currentUser.id).eq('os_type', os).maybeSingle();
    
    // 每次切换OS都要更新 Checkbox 状态
    if (data) {
        if (data.layout_data) window.desktopManager.loadLayout(data.layout_data);
        // 更新 UI
        $('#chk-public').prop('checked', data.is_public);
        // 更新内存缓存
        if (window.desktopManager.cachedLayouts[os]) {
            window.desktopManager.cachedLayouts[os].is_public = data.is_public;
        }
    } else {
        // 无存档，默认不公开
        $('#chk-public').prop('checked', false);
    }
}
window.loadCloudDesktop = loadCloudDesktop;

// 世界加载
async function loadWorldData() {
    $('#world-overlay').removeClass('hidden');
    const grid = $('#world-grid');
    grid.html('<p>Loading...</p>');

    const { data, error } = await supabase
        .from('desktops')
        .select('id, layout_data, os_type, likes_count, user_id, is_public, profiles(nickname)')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(20);

    grid.empty();
    if (!data || data.length === 0) { grid.html('<p>No public desktops.</p>'); return; }

    data.forEach(item => {
        const name = item.profiles ? item.profiles.nickname : 'User';
        const card = $(`
            <div class="world-card">
                <div class="card-preview" style="background:${getOSColor(item.os_type)}">
                    <i class="fa-solid fa-desktop" style="font-size:40px; color:rgba(255,255,255,0.5)"></i>
                </div>
                <div class="card-info">
                    <strong>${item.os_type}</strong><br>
                    <span>By: ${name}</span><br>
                    <span style="color:red">❤️ ${item.likes_count || 0}</span>
                </div>
            </div>
        `);
        card.click(() => enterViewMode(item, name));
        grid.append(card);
    });
}
window.loadWorldData = loadWorldData;

function enterViewMode(item, nickname) {
    viewingDesktopId = item.id;
    $('#world-overlay').addClass('hidden');
    
    window.desktopManager.switchOS(item.os_type);
    window.desktopManager.loadLayout(item.layout_data);
    
    // UI 变化
    $('#os-tabs button').removeClass('active');
    $(`#os-tabs button[data-os="${item.os_type}"]`).addClass('active');
    $('#btn-exit-view').removeClass('hidden');
    
    // 侧边栏：显示访客面板，隐藏编辑面板
    $('#logged-view').hide();
    $('#visitor-view').removeClass('hidden');
    $('#visitor-target-name').text(nickname);
    $('#sidebar .toolbox').addClass('hidden');
    $('#comments-panel').removeClass('hidden');
    
    loadComments(viewingDesktopId);
    $('.app-icon').draggable('disable'); // 禁用拖拽
}

// 留言与互动
async function loadComments(id) {
    const list = $('#comments-list');
    list.html('Loading...');
    const { data } = await supabase.from('comments').select('content, profiles(nickname)').eq('desktop_id', id).order('created_at', {ascending:false});
    list.empty();
    if(data) data.forEach(c => list.append(`<div class="comment-item"><strong>${c.profiles.nickname}:</strong> ${c.content}</div>`));
}

$('#btn-send-comment').click(async () => {
    if(!currentUser) return alert("Please login");
    const content = $('#inp-comment').val();
    if(!content) return;
    const { error } = await supabase.from('comments').insert({ desktop_id: viewingDesktopId, user_id: currentUser.id, content });
    if(!error) { $('#inp-comment').val(''); loadComments(viewingDesktopId); }
});

$('#btn-like').click(async () => {
    if(!currentUser) return alert("Login first");
    const { error } = await supabase.from('likes').insert({ user_id: currentUser.id, desktop_id: viewingDesktopId });
    if(error) alert("Already liked?");
    else alert("Liked!");
});

$('#btn-fav').click(async () => {
    if(!currentUser) return alert("Login first");
    const { error } = await supabase.from('favorites').insert({ user_id: currentUser.id, desktop_id: viewingDesktopId });
    if(error) alert("Already in favorites?");
    else alert("Collected!");
});

function getOSColor(os) { switch(os) { case 'windows': return '#00a8e8'; case 'macos': return '#636e72'; default: return '#333'; } }
function t(key) { return CONFIG.i18n[navigator.language.startsWith('zh')?'zh':'en'][key] || key; }

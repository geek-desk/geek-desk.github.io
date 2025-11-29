// js/auth.js
const supabase = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);
let currentUser = null;
let viewingDesktopId = null; // 当前正在查看的别人的桌面ID

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
    if(!email || !password) return alert("请输入完整信息");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("登录失败: " + error.message);
    else handleLoginSuccess(data.user);
});

$('#btn-do-signup').click(async () => {
    const email = $('#email').val();
    const password = $('#password').val();
    if(!email || !password) return alert("请输入完整信息");
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) alert("Error: " + error.message);
    else alert(t("reg_check_email")); // 使用配置里的提示
});

$('#btn-logout').click(async () => {
    await supabase.auth.signOut();
    location.reload();
});

// 保存 (支持公开设置)
async function saveDesktopData(isPublic) {
    if (!currentUser) return alert("请先登录！");
    const os = window.desktopManager.currentOS;
    const layout = window.desktopManager.exportLayout();

    const { error } = await supabase.from('desktops').upsert({ 
        user_id: currentUser.id, 
        os_type: os, 
        layout_data: layout,
        is_public: isPublic
    }, { onConflict: 'user_id, os_type' });

    if (error) alert("保存失败 (请确保已执行SQL): " + error.message);
    else alert("保存成功！");
}
window.saveDesktopData = saveDesktopData;

// 加载自己
async function loadCloudDesktop() {
    if (!currentUser) return;
    const os = window.desktopManager.currentOS;
    const { data, error } = await supabase.from('desktops').select('layout_data, is_public').eq('user_id', currentUser.id).eq('os_type', os).maybeSingle();
    
    if (data && data.layout_data) {
        window.desktopManager.loadLayout(data.layout_data);
        $('#chk-public').prop('checked', data.is_public);
    }
}
window.loadCloudDesktop = loadCloudDesktop;

// 世界加载
async function loadWorldData() {
    $('#world-overlay').removeClass('hidden');
    const grid = $('#world-grid');
    grid.html('<p>Loading...</p>');

    // 关联查询 profiles 获取昵称
    const { data, error } = await supabase
        .from('desktops')
        .select('id, layout_data, os_type, likes_count, user_id, is_public, profiles(nickname)')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(20);

    grid.empty();
    if (error) { grid.html('<p>Error loading world.</p>'); return; }
    if (!data || data.length === 0) { grid.html('<p>No public desktops yet.</p>'); return; }

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
        
        card.click(() => {
            enterViewMode(item);
        });
        grid.append(card);
    });
}
window.loadWorldData = loadWorldData;

// === 进入查看模式 ===
function enterViewMode(desktopItem) {
    viewingDesktopId = desktopItem.id;
    $('#world-overlay').addClass('hidden');
    
    // 1. 切换系统并加载数据
    window.desktopManager.switchOS(desktopItem.os_type);
    window.desktopManager.loadLayout(desktopItem.layout_data);
    
    // 2. 界面调整
    $('#os-tabs button').removeClass('active'); 
    $(`#os-tabs button[data-os="${desktopItem.os_type}"]`).addClass('active');
    $('#btn-exit-view').removeClass('hidden'); // 显示返回按钮
    
    // 3. 隐藏工具箱，显示留言
    $('#sidebar .toolbox').addClass('hidden');
    $('#comments-panel').removeClass('hidden');
    loadComments(viewingDesktopId);
    
    // 4. 禁用拖拽 (简单实现：给所有图标加 pointer-events: none 或移除 draggable)
    $('.app-icon').draggable('disable');
}

// 加载留言
async function loadComments(desktopId) {
    const list = $('#comments-list');
    list.html('Loading...');
    const { data } = await supabase.from('comments').select('content, profiles(nickname)').eq('desktop_id', desktopId).order('created_at', {ascending:false});
    
    list.empty();
    if(data) {
        data.forEach(c => {
            list.append(`<div class="comment-item"><strong>${c.profiles.nickname}:</strong> ${c.content}</div>`);
        });
    }
}

// 发送留言
$('#btn-send-comment').click(async () => {
    if(!currentUser) return alert("Please login to comment");
    const content = $('#inp-comment').val();
    if(!content) return;
    
    const { error } = await supabase.from('comments').insert({
        desktop_id: viewingDesktopId,
        user_id: currentUser.id,
        content: content
    });
    
    if(!error) {
        $('#inp-comment').val('');
        loadComments(viewingDesktopId);
    }
});

function getOSColor(os) {
    switch(os) { case 'windows': return '#00a8e8'; case 'macos': return '#636e72'; default: return '#333'; }
}
function t(key) { return CONFIG.i18n[navigator.language.startsWith('zh')?'zh':'en'][key] || key; }

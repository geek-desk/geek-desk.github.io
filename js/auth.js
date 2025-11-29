// js/auth.js
const supabase = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);
let currentUser = null;

// 初始化
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
    loadCloudDesktop(); // 登录后自动加载
}

// 登录按钮
$('#btn-do-login').click(async () => {
    const email = $('#email').val();
    const password = $('#password').val();
    if(!email || !password) return alert("请输入完整信息");
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("登录失败: " + error.message);
    else handleLoginSuccess(data.user);
});

// 注册按钮
$('#btn-do-signup').click(async () => {
    const email = $('#email').val();
    const password = $('#password').val();
    if(!email || !password) return alert("请输入完整信息");

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) alert("注册失败: " + error.message);
    else alert("注册成功！请直接登录。");
});

// 退出
$('#btn-logout').click(async () => {
    await supabase.auth.signOut();
    location.reload();
});

// === 保存桌面数据 ===
// 绑定在 app.js 的 #btn-save
async function saveDesktopData() {
    if (!currentUser) return alert("请先登录！");

    const os = window.desktopManager.currentOS;
    // 获取包含图标和文件夹的完整数据
    const layout = window.desktopManager.exportLayout();

    const { error } = await supabase
        .from('desktops')
        .upsert({ 
            user_id: currentUser.id, 
            os_type: os, 
            layout_data: layout,
            is_public: true 
        }, { onConflict: 'user_id, os_type' });

    if (error) alert("保存失败: " + error.message);
    else alert(`【${os}】桌面保存成功！`);
}
window.saveDesktopData = saveDesktopData; // 暴露给全局

// === 加载桌面数据 ===
async function loadCloudDesktop() {
    if (!currentUser) return;
    const os = window.desktopManager.currentOS;

    const { data, error } = await supabase
        .from('desktops')
        .select('layout_data')
        .eq('user_id', currentUser.id)
        .eq('os_type', os)
        .single();

    if (data && data.layout_data) {
        window.desktopManager.loadLayout(data.layout_data);
    }
}
window.loadCloudDesktop = loadCloudDesktop; // 暴露给全局

// === 世界功能 ===
// 绑定在 app.js 的 #btn-open-world
async function loadWorldData() {
    $('#world-overlay').removeClass('hidden');
    const grid = $('#world-grid');
    grid.html('<p style="width:100%;text-align:center;">正在加载世界频道...</p>');

    // 获取公开桌面，假设有 profiles 表关联昵称，如果没有则只显示 ID
    // 简单起见，我们直接查 desktops 表
    const { data, error } = await supabase
        .from('desktops')
        .select('layout_data, os_type, likes_count, created_at, user_id')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(20);

    if (error) {
        grid.html('<p>加载失败，请检查网络。</p>');
        return;
    }

    grid.empty();
    if (!data || data.length === 0) {
        grid.html('<p>暂无公开桌面。</p>');
        return;
    }

    data.forEach(item => {
        const card = $(`
            <div class="world-card">
                <div class="card-preview" style="background:${getOSColor(item.os_type)}">
                    <i class="fa-solid fa-desktop" style="font-size:40px; color:rgba(255,255,255,0.5)"></i>
                </div>
                <div class="card-info">
                    <strong>${item.os_type.toUpperCase()}</strong><br>
                    <span>ID: ${item.user_id.slice(0, 5)}...</span><br>
                    <span style="color:red">❤️ ${item.likes_count || 0}</span>
                </div>
            </div>
        `);
        
        // 点击卡片：加载该用户的桌面到本地查看
        card.click(() => {
            if(confirm(`确定要查看这个 ${item.os_type} 桌面吗？\n(这会覆盖你当前未保存的视图)`)) {
                // 切换系统
                if (window.desktopManager.currentOS !== item.os_type) {
                    window.desktopManager.switchOS(item.os_type);
                    // 修正 Tabs UI
                    $('#os-tabs button').removeClass('active');
                    $(`#os-tabs button[data-os="${item.os_type}"]`).addClass('active');
                }
                // 加载数据
                window.desktopManager.loadLayout(item.layout_data);
                $('#world-overlay').addClass('hidden');
            }
        });

        grid.append(card);
    });
}
window.loadWorldData = loadWorldData; // 暴露给全局

function getOSColor(os) {
    switch(os) {
        case 'windows': return '#00a8e8';
        case 'macos': return '#636e72';
        case 'ubuntu': return '#e17055';
        case 'android': return '#a4b0be';
        case 'ios': return '#2d3436';
        default: return '#333';
    }
}

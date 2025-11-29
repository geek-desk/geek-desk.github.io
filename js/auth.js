const supabase = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);
let currentUser = null;

// 初始化检查 Session
async function initAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        handleUserLogin(session.user);
    } else {
        // 尝试从 localStorage 读取游客存档
    }
}

function handleUserLogin(user) {
    currentUser = user;
    $('#guest-view').hide();
    $('#logged-view').show();
    $('#user-nickname').text(user.email.split('@')[0]); // 简易昵称
    // 加载云端数据
    loadCloudDesktop();
}

// 登录
$('#btn-do-login').click(async () => {
    const email = $('#email').val();
    const password = $('#password').val();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else {
        $('#modal-overlay').addClass('hidden');
        handleUserLogin(data.user);
    }
});

// 注册
$('#btn-do-signup').click(async () => {
    const email = $('#email').val();
    const password = $('#password').val();
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("注册成功，请登录！");
});

// 保存当前桌面
async function saveCurrentDesktop() {
    if (!currentUser) return alert("请先登录！");
    
    const layout = window.desktopManager.exportLayout();
    const os = window.desktopManager.currentOS;

    // Upsert (更新或插入)
    const { error } = await supabase
        .from('desktops')
        .upsert({ 
            user_id: currentUser.id, 
            os_type: os, 
            layout_data: layout,
            is_public: true // 默认公开，可改为由用户选择
        }, { onConflict: 'user_id, os_type' });

    if (error) console.error(error);
    else alert("桌面保存成功！");
}

async function loadCloudDesktop() {
    if (!currentUser) return;
    const os = window.desktopManager.currentOS;
    
    const { data, error } = await supabase
        .from('desktops')
        .select('layout_data')
        .eq('user_id', currentUser.id)
        .eq('os_type', os)
        .single();
        
    if(data) {
        window.desktopManager.loadLayout(data.layout_data);
    }
}

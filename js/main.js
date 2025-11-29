// =======================================================================
// !!! 必须替换 !!! 请用你的真实 Supabase URL 和 Anon Key 替换以下占位符
// =======================================================================
const SUPABASE_URL = 'https://rjhmezzyjntpcvlycece.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqaG1lenp5am50cGN2bHljZWNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MDAzMDIsImV4cCI6MjA3OTk3NjMwMn0.pi5M3kcu-CaJY0ryry8phi9E-SQdRKHGmxsJGIckANA';

// ** 修复 Uncaught ReferenceError **
// 使用全局加载的 'supabase' 对象来创建客户端，并将其结果赋值给新的变量 'supabaseClient'。
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// --- 桌面图标数据 (使用 CDN 图片作为示例) ---
const initialIcons = [
    { id: 'icon-my-pc', name: '此电脑', type: 'system', icon: 'https://cdn.jsdelivr.net/npm/@primer/octicons@19.8.0/build/svg/device-desktop-24.svg', x: 20, y: 20 },
    { id: 'icon-recycle-bin', name: '回收站', type: 'system', icon: 'https://cdn.jsdelivr.net/npm/@primer/octicons@19.8.0/build/svg/trash-24.svg', x: 20, y: 120 }
];

// 函数：创建图标的 HTML 元素
function createIconElement(iconData) {
    const $icon = $(`
        <div class="desktop-icon" id="${iconData.id}" data-x="${iconData.x}" data-y="${iconData.y}">
            <img src="${iconData.icon}" alt="${iconData.name}">
            <span>${iconData.name}</span>
        </div>
    `);
    
    // 设置初始位置
    $icon.css({
        top: iconData.y + 'px',
        left: iconData.x + 'px'
    });
    
    return $icon;
}

// 函数：处理登录/注册结果
function handleAuthResponse(error, session) {
    const $message = $('#auth-message');
    $message.text('');
    
    if (error) {
        $message.text(`认证失败: ${error.message}`);
        console.error('认证错误:', error);
    } else if (session) {
        // 登录成功
        $('#auth-modal').addClass('modal-hidden');
        alert(`登录成功！欢迎回来，用户ID: ${session.user.id}`);
        // TODO: loadUserDesktop(session.user.id);
    } else {
         // 注册成功，但可能需要验证邮箱
         $message.text('注册成功! 请检查你的邮箱进行验证。');
    }
}


$(document).ready(function() {
    console.log("桌面模拟器已启动！");
    
    const $iconArea = $('#icon-area');
    const $authModal = $('#auth-modal');
    
    // 检查当前会话状态
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
        if (session) {
            $authModal.addClass('modal-hidden');
            console.log('当前用户已登录:', session.user);
            // TODO: loadUserDesktop(session.user.id);
        } else {
            $authModal.removeClass('modal-hidden');
        }
    });

    // 1. 加载初始图标
    initialIcons.forEach(icon => {
        const $iconElement = createIconElement(icon);
        $iconArea.append($iconElement);
    });

    // 2. 图标交互：点击选中/取消选中
    $iconArea.on('click', '.desktop-icon', function(event) {
        event.stopPropagation(); 
        $('.desktop-icon').removeClass('selected');
        $(this).addClass('selected');
    });

    // 点击桌面背景时，取消所有选中状态
    $('#desktop-background').on('click', function() {
        $('.desktop-icon').removeClass('selected');
    });
    
    // --- 3. Supabase 认证事件处理 ---

    // 登录按钮点击事件
    $('#login-btn').on('click', async function() {
        const email = $('#auth-email').val();
        const password = $('#auth-password').val();
        
        // 使用 supabaseClient
        const { data: { session }, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });
        handleAuthResponse(error, session);
    });

    // 注册按钮点击事件
    $('#signup-btn').on('click', async function() {
        const email = $('#auth-email').val();
        const password = $('#auth-password').val();
        
        // 使用 supabaseClient
        const { error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
        });
        
        if (error) {
             handleAuthResponse(error, null);
        } else {
             handleAuthResponse(null, null); // 触发注册成功提示
        }
    });

    // 4. 登出事件处理
    $('#logout-btn').on('click', async function() {
        // 使用 supabaseClient
        const { error } = await supabaseClient.auth.signOut();
        if (error) {
            alert('登出失败: ' + error.message);
        } else {
            alert('您已成功登出。');
        }
    });


    // 5. 实时监听认证状态变化 (处理登出后模态框的显示)
    supabaseClient.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
            console.log('用户已登出或会话无效');
            $authModal.removeClass('modal-hidden');
        } else if (event === 'SIGNED_IN') {
             console.log('用户已登录');
             $authModal.addClass('modal-hidden');
        }
    });
});

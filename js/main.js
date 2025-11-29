// 初始化Supabase
const supabase = supabase.createClient('https://rjhmezzyjntpcvlycece.supabase.co', 'supabase-annon-key');

// 页面加载时
window.onload = () => {
    checkLogin();
}

// 检查用户登录状态
function checkLogin() {
    const user = supabase.auth.user();
    if (user) {
        loadDesktop(user.id);
    } else {
        window.location.href = 'login.html'; // 没登录就跳转到登录页面
    }
}

// 登出
async function logOut() {
    await supabase.auth.signOut();
    window.location.href = 'login.html'; // 登出后跳转到登录页面
}

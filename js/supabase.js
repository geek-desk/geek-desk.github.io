const supabaseUrl = 'https://rjhmezzyjntpcvlycece.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqaG1lenp5am50cGN2bHljZWNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MDAzMDIsImV4cCI6MjA3OTk3NjMwMn0.pi5M3kcu-CaJY0ryry8phi9E-SQdRKHGmxsJGIckANA';

const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

// 用户注册
async function signUp(email, password) {
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (error) {
        console.error(error.message);
    } else {
        console.log('User signed up:', user);
    }
}

// 用户登录
async function signIn(email, password) {
    const { user, error } = await supabase.auth.signIn({ email, password });
    if (error) {
        console.error(error.message);
    } else {
        console.log('User logged in:', user);
    }
}

// 保存桌面数据
async function saveDesktop(desktopData) {
    const { data, error } = await supabase.from('desktops').insert([{ user_id: supabase.auth.user().id, desktop: desktopData }]);
    if (error) {
        console.error(error.message);
    } else {
        console.log('Desktop saved:', data);
    }
}

// 获取用户桌面数据
async function loadDesktop(userId) {
    const { data, error } = await supabase.from('desktops').select('*').eq('user_id', userId);
    if (error) {
        console.error(error.message);
    } else {
        console.log('Loaded desktops:', data);
    }
}

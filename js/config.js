// js/config.js
const CONFIG = {
    supabaseUrl: 'https://rjhmezzyjntpcvlycece.supabase.co',
    supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqaG1lenp5am50cGN2bHljZWNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MDAzMDIsImV4cCI6MjA3OTk3NjMwMn0.pi5M3kcu-CaJY0ryry8phi9E-SQdRKHGmxsJGIckANA',

    // 1. 壁纸更新
    wallpapers: {
        // Windows: 自然风尘 (Nature/Dust)
        windows: 'url("https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
        macos: 'url("https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&w=1920&q=80")',
        ubuntu: 'url("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&w=1920&q=80")',
        android: 'url("https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&w=1080&q=80")',
        // iOS: 火星 (Mars)
        ios: 'url("https://images.unsplash.com/photo-1614730341194-75c6074065db?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80")'
    },

    limits: { desktopMax: 50, mobileScreenMax: 20, folderMax: 10 },

    // 2. 多语言字典
    i18n: {
        zh: {
            "title": "我的云桌面",
            "guest": "游客模式",
            "login_btn": "登录 / 注册",
            "logout": "退出",
            "save": "保存",
            "save_public": "公开分享",
            "save_private": "设为私有",
            "world": "世界广场",
            "my_computer": "我的电脑",
            "recycle_bin": "回收站",
            "game": "游戏",
            "office": "办公",
            "social": "社交",
            "tool": "工具",
            "dev": "开发",
            "login_success": "登录成功！",
            "reg_check_email": "注册成功！请前往邮箱确认验证邮件。",
            "view_mode": "正在查看",
            "back_home": "返回我的桌面",
            "comment_ph": "写下你的留言...",
            "send": "发送"
        },
        en: {
            "title": "Cloud Desktop",
            "guest": "Guest Mode",
            "login_btn": "Login / Sign Up",
            "logout": "Logout",
            "save": "Save",
            "save_public": "Share Publicly",
            "save_private": "Keep Private",
            "world": "World Plaza",
            "my_computer": "This PC",
            "recycle_bin": "Recycle Bin",
            "game": "Games",
            "office": "Office",
            "social": "Social",
            "tool": "Tools",
            "dev": "Dev",
            "login_success": "Login Successful!",
            "reg_check_email": "Success! Please check your email to confirm.",
            "view_mode": "Viewing",
            "back_home": "Back Home",
            "comment_ph": "Leave a comment...",
            "send": "Send"
        }
    },

    // 图标配置 (保持不变，省略以节省空间，请保留你原来的 defaultIcons 和 sidebarTools)
    // 务必保留 defaultIcons 和 sidebarTools 的完整内容！
    defaultIcons: {
        windows: [{ name: "my_computer", icon: "fa-solid fa-desktop", color: "#0984e3", x: 20, y: 20 }, { name: "recycle_bin", icon: "fa-solid fa-trash-can", color: "#636e72", x: 20, y: 120 }],
        macos: [{ name: "Macintosh HD", icon: "fa-solid fa-hard-drive", color: "#bdc3c7", x: 1100, y: 20 }],
        ubuntu: [{ name: "Home", icon: "fa-solid fa-house", color: "#e67e22", x: 20, y: 20 }],
        android: [{ name: "Phone", icon: "fa-solid fa-phone", color: "#2ecc71", x: 25, y: 520 }, { name: "Clock", icon: "fa-solid fa-clock", color: "#fff", x: 25, y: 100 }],
        ios: [{ name: "Settings", icon: "fa-solid fa-gear", color: "#bdc3c7", x: 25, y: 100 }, { name: "App Store", icon: "fa-brands fa-app-store-ios", color: "#0984e3", x: 110, y: 100 }]
    },
    sidebarTools: {
        windows: [{ title: "office", items: [{ name: "Word", icon: "fa-solid fa-file-word", color: "#0984e3" }] }],
        mobile: [{ title: "social", items: [{ name: "WeChat", icon: "fa-brands fa-weixin", color: "#2ecc71" }] }]
    }
};

// 辅助函数
function getToolsForOS(os) {
    if (os === 'android' || os === 'ios') return CONFIG.sidebarTools.mobile || [];
    return CONFIG.sidebarTools[os] || CONFIG.sidebarTools.windows || [];
}

// 翻译函数
function t(key) {
    const lang = navigator.language.startsWith('zh') ? 'zh' : 'en';
    const dict = CONFIG.i18n[lang] || CONFIG.i18n.en;
    return dict[key] || key;
}

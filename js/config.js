// js/config.js
const CONFIG = {
    supabaseUrl: 'https://rjhmezzyjntpcvlycece.supabase.co',
    supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqaG1lenp5am50cGN2bHljZWNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MDAzMDIsImV4cCI6MjA3OTk3NjMwMn0.pi5M3kcu-CaJY0ryry8phi9E-SQdRKHGmxsJGIckANA',

    // 默认壁纸
    wallpapers: {
        windows: 'url("https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&w=1920&q=80")',
        macos: 'url("https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&w=1920&q=80")',
        ubuntu: 'url("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&w=1920&q=80")',
        android: 'url("https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&w=1080&q=80")',
        ios: 'url("https://images.unsplash.com/photo-1614730341194-75c6074065db?ixlib=rb-4.0.3&w=1080&q=80")'
    },

    limits: { desktopMax: 50, mobileScreenMax: 20, folderMax: 10 },

    // 多语言
    i18n: {
        zh: { "title":"我的云桌面", "login_btn":"登录 / 注册", "logout":"退出", "save":"保存", "save_public":"公开", "world":"世界广场", "back_home":"返回我的桌面", "comment_ph":"写下你的留言...", "send":"发送", "reg_check_email":"注册成功！请检查邮箱验证。", "wallpaper":"更换壁纸" },
        en: { "title":"Cloud Desktop", "login_btn":"Login", "logout":"Logout", "save":"Save", "save_public":"Public", "world":"World", "back_home":"Back Home", "comment_ph":"Comment...", "send":"Send", "reg_check_email":"Check email.", "wallpaper":"Wallpapers" }
    },

    // 默认图标 (完整版)
    defaultIcons: {
        windows: [
            { name: "我的电脑", icon: "fa-solid fa-desktop", color: "#0984e3", x: 20, y: 20 },
            { name: "回收站", icon: "fa-solid fa-trash-can", color: "#636e72", x: 20, y: 120 }
        ],
        macos: [ { name: "Macintosh HD", icon: "fa-solid fa-hard-drive", color: "#bdc3c7", x: 1100, y: 20 } ],
        ubuntu: [ { name: "Home", icon: "fa-solid fa-house", color: "#e67e22", x: 20, y: 20 }, { name: "Trash", icon: "fa-solid fa-trash", color: "#bdc3c7", x: 20, y: 120 } ],
        android: [
            { name: "电话", icon: "fa-solid fa-phone", color: "#2ecc71", x: 25, y: 520 }, { name: "信息", icon: "fa-solid fa-comment", color: "#3498db", x: 95, y: 520 },
            { name: "Chrome", icon: "fa-brands fa-chrome", color: "#f1c40f", x: 165, y: 520 }, { name: "相机", icon: "fa-solid fa-camera", color: "#95a5a6", x: 235, y: 520 },
            { name: "时钟", icon: "fa-solid fa-clock", color: "#fff", x: 25, y: 100 }
        ],
        ios: [
            { name: "电话", icon: "fa-solid fa-phone", color: "#2ecc71", x: 25, y: 520 }, { name: "Safari", icon: "fa-brands fa-safari", color: "#3498db", x: 95, y: 520 },
            { name: "邮件", icon: "fa-solid fa-envelope", color: "#3498db", x: 165, y: 520 }, { name: "音乐", icon: "fa-solid fa-music", color: "#e74c3c", x: 235, y: 520 },
            { name: "设置", icon: "fa-solid fa-gear", color: "#bdc3c7", x: 25, y: 100 }, { name: "App Store", icon: "fa-brands fa-app-store-ios", color: "#0984e3", x: 110, y: 100 }
        ]
    },

    // 侧边栏 (新增壁纸项)
    sidebarTools: {
        windows: [
            { 
                title: "wallpaper", type: "wallpaper", // 特殊标记
                items: [
                    { img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200", url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&w=1920&q=80" },
                    { img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=200", url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&w=1920&q=80" },
                    { img: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=200", url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&w=1920&q=80" }
                ] 
            },
            { title: "办公", items: [ { name: "Word", icon: "fa-solid fa-file-word", color: "#0984e3" }, { name: "Excel", icon: "fa-solid fa-file-excel", color: "#00b894" } ] },
            { title: "系统", items: [ { name: "Chrome", icon: "fa-brands fa-chrome", color: "#fab1a0" }, { name: "VS Code", icon: "fa-solid fa-code", color: "#00a8e8" } ] }
        ],
        mobile: [
            { 
                title: "wallpaper", type: "wallpaper",
                items: [
                    { img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=200", url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&w=1080&q=80" },
                    { img: "https://images.unsplash.com/photo-1614730341194-75c6074065db?w=200", url: "https://images.unsplash.com/photo-1614730341194-75c6074065db?ixlib=rb-4.0.3&w=1080&q=80" }
                ] 
            },
            { title: "社交", items: [ { name: "微信", icon: "fa-brands fa-weixin", color: "#2ecc71" }, { name: "抖音", icon: "fa-brands fa-tiktok", color: "#2d3436" } ] }
        ]
    }
};

function getToolsForOS(os) {
    if (os === 'android' || os === 'ios') return CONFIG.sidebarTools.mobile;
    return CONFIG.sidebarTools.windows; // Mac/Ubuntu 复用 Windows 的工具列表简化
}

// js/config.js
const savedLang = localStorage.getItem('app_lang');
const browserLang = navigator.language || navigator.userLanguage;
window.currentLang = savedLang ? savedLang : (browserLang && browserLang.toLowerCase().startsWith('zh') ? 'zh' : 'en');

const CONFIG = {
    supabaseUrl: 'https://rjhmezzyjntpcvlycece.supabase.co',
    supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqaG1lenp5am50cGN2bHljZWNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MDAzMDIsImV4cCI6MjA3OTk3NjMwMn0.pi5M3kcu-CaJY0ryry8phi9E-SQdRKHGmxsJGIckANA',

    wallpapers: {
        windows: 'url("https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&w=1920&q=80")',
        macos: 'url("https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&w=1920&q=80")',
        ubuntu: 'url("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&w=1920&q=80")',
        android: 'url("https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&w=1080&q=80")',
        ios: 'url("https://images.unsplash.com/photo-1614730341194-75c6074065db?ixlib=rb-4.0.3&w=1080&q=80")'
    },

    limits: { desktopMax: 50, mobileScreenMax: 20, folderMax: 10 },

    i18n: {
        zh: { "title":"我的云桌面", "login_btn":"登录 / 注册", "logout":"退出", "save":"保存", "save_public":"公开", "world":"世界广场", "back_home":"返回我的桌面", "comment_ph":"写下你的留言...", "send":"发送", "reg_check_email":"注册成功！请检查邮箱验证。", "wallpaper":"更换壁纸", "like": "点赞", "fav": "收藏", "office": "办公软件", "system": "系统工具", "entertainment": "娱乐", "network": "网络 & 社交", "social": "社交生活", "tools": "工具", "games": "游戏", "viewing": "正在查看", "dev_tools": "开发工具", "go_apps": "围棋应用", "common": "常用软件" },
        en: { "title":"Cloud Desktop", "login_btn":"Login", "logout":"Logout", "save":"Save", "save_public":"Public", "world":"World", "back_home":"Back Home", "comment_ph":"Comment...", "send":"Send", "reg_check_email":"Check email.", "wallpaper":"Wallpapers", "like": "Like", "fav": "Collect", "office": "Office", "system": "System", "entertainment":"Entertainment", "network":"Network", "social":"Social", "tools":"Tools", "games":"Games", "viewing": "Viewing", "dev_tools": "Dev Tools", "go_apps": "Go Apps", "common": "Common" }
    },

    // 默认图标配置
    defaultIcons: {
        windows: [
            { name: "我的电脑", icon: "fa-solid fa-desktop", color: "#0984e3", x: 20, y: 20 },
            { name: "回收站", icon: "fa-solid fa-trash-can", color: "#636e72", x: 20, y: 120 }
        ],
        macos: [ { name: "Macintosh HD", icon: "fa-solid fa-hard-drive", color: "#bdc3c7", x: 1100, y: 20 } ],
        ubuntu: [ { name: "Home", icon: "fa-solid fa-house", color: "#e67e22", x: 20, y: 20 }, { name: "Trash", icon: "fa-solid fa-trash", color: "#bdc3c7", x: 20, y: 120 } ],
        android: [
            // Y=500 (防止遮挡), X间隔均匀 (8, 86, 164, 242)
            { name: "电话", icon: "fa-solid fa-phone", color: "#2ecc71", x: 8, y: 500 },
            { name: "信息", icon: "fa-solid fa-comment", color: "#3498db", x: 86, y: 500 },
            { name: "Chrome", icon: "fa-brands fa-chrome", color: "#f1c40f", x: 164, y: 500 },
            { name: "相机", icon: "fa-solid fa-camera", color: "#95a5a6", x: 242, y: 500 },
            // Top
            { name: "时钟", icon: "fa-solid fa-clock", color: "#fff", x: 20, y: 100 }
        ],
        ios: [
            // Y=500, X间隔均匀
            { name: "电话", icon: "fa-solid fa-phone", color: "#2ecc71", x: 8, y: 500 },
            { name: "Safari", icon: "fa-brands fa-safari", color: "#3498db", x: 86, y: 500 },
            { name: "邮件", icon: "fa-solid fa-envelope", color: "#3498db", x: 164, y: 500 },
            { name: "音乐", icon: "fa-solid fa-music", color: "#e74c3c", x: 242, y: 500 },
            // Top
            { name: "设置", icon: "fa-solid fa-gear", color: "#bdc3c7", x: 20, y: 100 },
            { name: "App Store", icon: "fa-brands fa-app-store-ios", color: "#0984e3", x: 110, y: 100 }
        ]
    },

    // 侧边栏工具库 (包含您要的海量软件)
    sidebarTools: {
        windows: [
            { 
                title: "wallpaper", type: "wallpaper",
                items: [
                    { img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200", url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&w=1920&q=80" },
                    { img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=200", url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&w=1920&q=80" },
                    { img: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=200", url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&w=1920&q=80" },
                    { img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200", url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&w=1920&q=80" }
                ] 
            },
            {
                title: "dev_tools", 
                items: [
                    { name: "VS Code", icon: "fa-solid fa-code", color: "#00a8e8" },
                    { name: "IntelliJ IDEA", icon: "fa-solid fa-laptop-code", color: "#FE315D" },
                    { name: "PyCharm", icon: "fa-brands fa-python", color: "#21D789" },
                    { name: "WebStorm", icon: "fa-brands fa-js", color: "#00CDD7" },
                    { name: "GoLand", icon: "fa-brands fa-golang", color: "#00ADD8" },
                    { name: "CLion", icon: "fa-solid fa-c", color: "#00a8e8" },
                    { name: "Rider", icon: "fa-solid fa-code-branch", color: "#DD1100" },
                    { name: "Android Studio", icon: "fa-brands fa-android", color: "#3DDC84" },
                    { name: "Sublime", icon: "fa-solid fa-align-left", color: "#FF9800" },
                    { name: "Vim", icon: "fa-solid fa-square-full", color: "#019733" },
                    { name: "Git", icon: "fa-brands fa-git-alt", color: "#F05032" }
                ]
            },
            {
                title: "go_apps",
                items: [
                    { name: "Fox Weiqi", icon: "fa-solid fa-paw", color: "#FF9800" },
                    { name: "Tygem", icon: "fa-solid fa-earth-asia", color: "#3498db" },
                    { name: "Yike", icon: "fa-solid fa-comments", color: "#2ecc71" },
                    { name: "Zen7", icon: "fa-solid fa-circle-notch", color: "#333" },
                    { name: "KataGo", icon: "fa-solid fa-brain", color: "#E91E63" },
                    { name: "MultiGo", icon: "fa-solid fa-layer-group", color: "#9C27B0" },
                    { name: "StoneBase", icon: "fa-solid fa-book-open", color: "#795548" },
                    { name: "GIGo19", icon: "fa-solid fa-microchip", color: "#607D8B" },
                    { name: "AlphaGo", icon: "fa-brands fa-google", color: "#4285F4" }
                ]
            },
            {
                title: "common",
                items: [
                    { name: "Chrome", icon: "fa-brands fa-chrome", color: "#fab1a0" },
                    { name: "WeChat", icon: "fa-brands fa-weixin", color: "#2ecc71" },
                    { name: "QQ", icon: "fa-brands fa-qq", color: "#3498db" },
                    { name: "Telegram", icon: "fa-brands fa-telegram", color: "#0088cc" },
                    { name: "Word", icon: "fa-solid fa-file-word", color: "#0984e3" },
                    { name: "Excel", icon: "fa-solid fa-file-excel", color: "#00b894" }
                ]
            }
        ],
        mobile: [
            { 
                title: "wallpaper", type: "wallpaper",
                items: [
                    { img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=200", url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&w=1080&q=80" },
                    { img: "https://images.unsplash.com/photo-1614730341194-75c6074065db?w=200", url: "https://images.unsplash.com/photo-1614730341194-75c6074065db?ixlib=rb-4.0.3&w=1080&q=80" },
                    { img: "https://images.unsplash.com/photo-1534237710431-e2fc698436d0?w=200", url: "https://images.unsplash.com/photo-1534237710431-e2fc698436d0?ixlib=rb-4.0.3&w=1080&q=80" }
                ] 
            },
            { title: "social", items: [ { name: "微信", icon: "fa-brands fa-weixin", color: "#2ecc71" }, { name: "抖音", icon: "fa-brands fa-tiktok", color: "#2d3436" }, { name: "小红书", icon: "fa-solid fa-book-open", color: "#e84393" }, { name: "微博", icon: "fa-brands fa-weibo", color: "#e74c3c" } ] },
            { title: "games", items: [ { name: "王者荣耀", icon: "fa-solid fa-shield-halved", color: "#f1c40f" }, { name: "和平精英", icon: "fa-solid fa-person-rifle", color: "#e67e22" }, { name: "原神", icon: "fa-solid fa-star", color: "#a29bfe" } ] }
        ]
    }
};

function getToolsForOS(os) {
    if (os === 'android' || os === 'ios') return CONFIG.sidebarTools.mobile || [];
    return CONFIG.sidebarTools[os] || CONFIG.sidebarTools.windows || [];
}
window.t = function(key) { const lang = navigator.language.startsWith('zh')?'zh':'en'; return (CONFIG.i18n[lang]||CONFIG.i18n['en'])[key]||key; };

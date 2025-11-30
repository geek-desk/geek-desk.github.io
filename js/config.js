// js/config.js
// 1. 定义全局语言变量
const savedLang = localStorage.getItem('app_lang');
const browserLang = navigator.language || navigator.userLanguage;
window.currentLang = savedLang ? savedLang : (browserLang && browserLang.toLowerCase().startsWith('zh') ? 'zh' : 'en');

const CONFIG = {
    supabaseUrl: 'https://rjhmezzyjntpcvlycece.supabase.co',
    supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqaG1lenp5am50cGN2bHljZWNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MDAzMDIsImV4cCI6MjA3OTk3NjMwMn0.pi5M3kcu-CaJY0ryry8phi9E-SQdRKHGmxsJGIckANA',

    // 壁纸配置
    wallpapers: {
        windows: 'url("https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")', // 自然风尘
        macos: 'url("https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")', // 雪山
        ubuntu: 'url("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")', // 科技
        android: 'url("https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80")', // 城市
        ios: 'url("https://images.unsplash.com/photo-1614730341194-75c6074065db?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80")' // 火星
    },

    // 限制设置
    limits: {
        desktopMax: 50,
        mobileScreenMax: 20,
        folderMax: 10
    },

    // 国际化字典
    i18n: {
        zh: {
            "title": "我的云桌面",
            "login_btn": "登录 / 注册",
            "logout": "退出",
            "save": "保存",
            "save_public": "公开",
            "world": "世界广场",
            "back_home": "返回我的桌面",
            "comment_ph": "写下你的留言...",
            "send": "发送",
            "reg_check_email": "注册成功！请检查邮箱验证。",
            "wallpaper": "更换壁纸",
            "like": "点赞",
            "fav": "收藏",
            "office": "办公软件",
            "system": "系统工具",
            "entertainment": "娱乐",
            "network": "网络 & 社交",
            "social": "社交生活",
            "tools": "工具",
            "games": "游戏",
            "viewing": "正在查看"
        },
        en: {
            "title": "Cloud Desktop",
            "login_btn": "Login / Sign Up",
            "logout": "Logout",
            "save": "Save",
            "save_public": "Public",
            "world": "World Plaza",
            "back_home": "Back Home",
            "comment_ph": "Leave a comment...",
            "send": "Send",
            "reg_check_email": "Success! Check email to confirm.",
            "wallpaper": "Wallpapers",
            "like": "Like",
            "fav": "Collect",
            "office": "Office",
            "system": "System",
            "entertainment": "Entertainment",
            "network": "Network",
            "social": "Social",
            "tools": "Tools",
            "games": "Games",
            "viewing": "Viewing"
        }
    },

    // 2. 默认图标 (修正：确保 Windows 有图标，手机图标居中)
    defaultIcons: {
        windows: [
            { name: "我的电脑", icon: "fa-solid fa-desktop", color: "#0984e3", x: 20, y: 20 },
            { name: "回收站", icon: "fa-solid fa-trash-can", color: "#636e72", x: 20, y: 120 }
        ],
        macos: [
            { name: "Macintosh HD", icon: "fa-solid fa-hard-drive", color: "#bdc3c7", x: 1100, y: 20 }
        ],
        ubuntu: [
            { name: "Home", icon: "fa-solid fa-house", color: "#e67e22", x: 20, y: 20 },
            { name: "Trash", icon: "fa-solid fa-trash", color: "#bdc3c7", x: 20, y: 120 }
        ],
        android: [
            // 底部 Dock (X坐标修正为 10, 90, 170, 250，完美填满 320px)
            { name: "电话", icon: "fa-solid fa-phone", color: "#2ecc71", x: 10, y: 480 },
            { name: "信息", icon: "fa-solid fa-comment", color: "#3498db", x: 90, y: 480 },
            { name: "Chrome", icon: "fa-brands fa-chrome", color: "#f1c40f", x: 170, y: 480 },
            { name: "相机", icon: "fa-solid fa-camera", color: "#95a5a6", x: 250, y: 480 },
            // 顶部
            { name: "时钟", icon: "fa-solid fa-clock", color: "#fff", x: 20, y: 100 }
        ],
        ios: [
            // 底部 Dock (X坐标修正为 10, 90, 170, 250)
            { name: "电话", icon: "fa-solid fa-phone", color: "#2ecc71", x: 10, y: 480 },
            { name: "Safari", icon: "fa-brands fa-safari", color: "#3498db", x: 90, y: 480 },
            { name: "邮件", icon: "fa-solid fa-envelope", color: "#3498db", x: 170, y: 480 },
            { name: "音乐", icon: "fa-solid fa-music", color: "#e74c3c", x: 250, y: 480 },
            // 顶部
            { name: "设置", icon: "fa-solid fa-gear", color: "#bdc3c7", x: 20, y: 100 },
            { name: "App Store", icon: "fa-brands fa-app-store-ios", color: "#0984e3", x: 110, y: 100 }
        ]
    },

    // 侧边栏工具库
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
            { title: "office", items: [ { name: "Word", icon: "fa-solid fa-file-word", color: "#0984e3" }, { name: "Excel", icon: "fa-solid fa-file-excel", color: "#00b894" }, { name: "PPT", icon: "fa-solid fa-file-powerpoint", color: "#e17055" }, { name: "WPS", icon: "fa-solid fa-file-pen", color: "#d63031" }, { name: "Outlook", icon: "fa-solid fa-envelope", color: "#0984e3" }, { name: "PDF", icon: "fa-solid fa-file-pdf", color: "#d63031" } ] },
            { title: "system", items: [ { name: "Chrome", icon: "fa-brands fa-chrome", color: "#fab1a0" }, { name: "Edge", icon: "fa-brands fa-edge", color: "#74b9ff" }, { name: "VS Code", icon: "fa-solid fa-code", color: "#00a8e8" }, { name: "Terminal", icon: "fa-solid fa-terminal", color: "#333" } ] },
            { title: "entertainment", items: [ { name: "Steam", icon: "fa-brands fa-steam", color: "#2c3e50" }, { name: "WeChat", icon: "fa-brands fa-weixin", color: "#2ecc71" }, { name: "QQ", icon: "fa-brands fa-qq", color: "#3498db" }, { name: "Spotify", icon: "fa-brands fa-spotify", color: "#2ecc71" } ] }
        ],
        macos: [
            { title: "office", items: [ { name: "Safari", icon: "fa-brands fa-safari", color: "#0984e3" }, { name: "Music", icon: "fa-solid fa-music", color: "#ff7675" }, { name: "Photos", icon: "fa-solid fa-images", color: "#e84393" }, { name: "TV", icon: "fa-solid fa-tv", color: "#2d3436" } ] },
            { title: "system", items: [ { name: "Photoshop", icon: "fa-solid fa-camera-retro", color: "#0984e3" }, { name: "Figma", icon: "fa-brands fa-figma", color: "#00b894" }, { name: "Sketch", icon: "fa-solid fa-diamond", color: "#f1c40f" } ] }
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
            { title: "tools", items: [ { name: "支付宝", icon: "fa-brands fa-alipay", color: "#0984e3" }, { name: "地图", icon: "fa-solid fa-map-location-dot", color: "#27ae60" }, { name: "天气", icon: "fa-solid fa-cloud-sun", color: "#f39c12" }, { name: "相机", icon: "fa-solid fa-camera", color: "#95a5a6" } ] },
            { title: "games", items: [ { name: "王者荣耀", icon: "fa-solid fa-shield-halved", color: "#f1c40f" }, { name: "和平精英", icon: "fa-solid fa-person-rifle", color: "#e67e22" }, { name: "原神", icon: "fa-solid fa-star", color: "#a29bfe" } ] }
        ]
    }
};

function getToolsForOS(os) {
    if (os === 'android' || os === 'ios') return CONFIG.sidebarTools.mobile || [];
    return CONFIG.sidebarTools[os] || CONFIG.sidebarTools.windows || [];
}

// 2. 翻译函数
window.t = function(key) {
    const dict = CONFIG.i18n[window.currentLang] || CONFIG.i18n['en'] || {};
    return dict[key] || key;
};

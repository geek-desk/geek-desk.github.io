// js/config.js
const CONFIG = {
    supabaseUrl: 'https://rjhmezzyjntpcvlycece.supabase.co',
    supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqaG1lenp5am50cGN2bHljZWNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MDAzMDIsImV4cCI6MjA3OTk3NjMwMn0.pi5M3kcu-CaJY0ryry8phi9E-SQdRKHGmxsJGIckANA',

    wallpapers: {
        windows: 'url("https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&w=1920&q=80")', // 自然风尘
        macos: 'url("https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&w=1920&q=80")',
        ubuntu: 'url("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&w=1920&q=80")',
        android: 'url("https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&w=1080&q=80")',
        ios: 'url("https://images.unsplash.com/photo-1614730341194-75c6074065db?ixlib=rb-4.0.3&w=1080&q=80")' // 火星
    },

    limits: { desktopMax: 50, mobileScreenMax: 20, folderMax: 10 },

    // 默认桌面图标
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

    // 侧边栏工具库 (海量)
    sidebarTools: {
        windows: [
            { title: "办公软件", items: [ { name: "Word", icon: "fa-solid fa-file-word", color: "#0984e3" }, { name: "Excel", icon: "fa-solid fa-file-excel", color: "#00b894" }, { name: "PPT", icon: "fa-solid fa-file-powerpoint", color: "#e17055" }, { name: "Outlook", icon: "fa-solid fa-envelope", color: "#0984e3" }, { name: "WPS", icon: "fa-solid fa-file-pen", color: "#d63031" } ] },
            { title: "开发工具", items: [ { name: "VS Code", icon: "fa-solid fa-code", color: "#00a8e8" }, { name: "GitHub", icon: "fa-brands fa-github", color: "#2d3436" }, { name: "Node.js", icon: "fa-brands fa-node", color: "#2ecc71" }, { name: "Terminal", icon: "fa-solid fa-terminal", color: "#333" }, { name: "Python", icon: "fa-brands fa-python", color: "#f1c40f" } ] },
            { title: "游戏娱乐", items: [ { name: "Steam", icon: "fa-brands fa-steam", color: "#2c3e50" }, { name: "LOL", icon: "fa-solid fa-gamepad", color: "#f1c40f" }, { name: "Spotify", icon: "fa-brands fa-spotify", color: "#2ecc71" }, { name: "Bilibili", icon: "fa-brands fa-bilibili", color: "#00a1d6" }, { name: "Discord", icon: "fa-brands fa-discord", color: "#7289da" } ] },
            { title: "系统网络", items: [ { name: "Chrome", icon: "fa-brands fa-chrome", color: "#fab1a0" }, { name: "Edge", icon: "fa-brands fa-edge", color: "#74b9ff" }, { name: "WeChat", icon: "fa-brands fa-weixin", color: "#2ecc71" }, { name: "QQ", icon: "fa-brands fa-qq", color: "#3498db" } ] }
        ],
        macos: [
            { title: "Apple Apps", items: [ { name: "Safari", icon: "fa-brands fa-safari", color: "#0984e3" }, { name: "Music", icon: "fa-solid fa-music", color: "#ff7675" }, { name: "Photos", icon: "fa-solid fa-images", color: "rainbow" }, { name: "TV", icon: "fa-solid fa-tv", color: "#2d3436" } ] },
            { title: "Creative", items: [ { name: "Photoshop", icon: "fa-solid fa-camera-retro", color: "#0984e3" }, { name: "Figma", icon: "fa-brands fa-figma", color: "#00b894" }, { name: "Sketch", icon: "fa-solid fa-diamond", color: "#f1c40f" } ] }
        ],
        mobile: [
            { title: "社交生活", items: [ { name: "WeChat", icon: "fa-brands fa-weixin", color: "#2ecc71" }, { name: "TikTok", icon: "fa-brands fa-tiktok", color: "#2d3436" }, { name: "Weibo", icon: "fa-brands fa-weibo", color: "#e74c3c" }, { name: "Taobao", icon: "fa-solid fa-bag-shopping", color: "#e67e22" } ] },
            { title: "工具", items: [ { name: "Alipay", icon: "fa-brands fa-alipay", color: "#0984e3" }, { name: "Maps", icon: "fa-solid fa-map-location-dot", color: "#27ae60" }, { name: "Weather", icon: "fa-solid fa-cloud-sun", color: "#f39c12" }, { name: "Camera", icon: "fa-solid fa-camera", color: "#95a5a6" } ] },
            { title: "游戏", items: [ { name: "Honor", icon: "fa-solid fa-shield-halved", color: "#f1c40f" }, { name: "PUBG", icon: "fa-solid fa-person-rifle", color: "#e67e22" }, { name: "Genshin", icon: "fa-solid fa-star", color: "#a29bfe" } ] }
        ],
        ubuntu: [ { title: "Dev", items: [ { name: "Terminal", icon: "fa-solid fa-terminal", color: "#333" }, { name: "Docker", icon: "fa-brands fa-docker", color: "#3498db" } ] } ]
    }
};

function getToolsForOS(os) {
    if (os === 'android' || os === 'ios') return CONFIG.sidebarTools.mobile || [];
    return CONFIG.sidebarTools[os] || CONFIG.sidebarTools.windows || [];
}

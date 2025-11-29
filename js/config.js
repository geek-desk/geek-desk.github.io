// js/config.js
const CONFIG = {
    supabaseUrl: 'https://rjhmezzyjntpcvlycece.supabase.co',
    supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqaG1lenp5am50cGN2bHljZWNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MDAzMDIsImV4cCI6MjA3OTk3NjMwMn0.pi5M3kcu-CaJY0ryry8phi9E-SQdRKHGmxsJGIckANA',

    // 壁纸设置
    wallpapers: {
        windows: 'url("https://images.unsplash.com/photo-1477346611705-65d1883cee1e?ixlib=rb-4.0.3&w=1920&q=80")',
        macos: 'url("https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&w=1920&q=80")',
        ubuntu: 'url("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&w=1920&q=80")',
        android: 'url("https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&w=1080&q=80")',
        ios: 'url("https://images.unsplash.com/photo-1512990414788-d97cb4a25db3?ixlib=rb-4.0.3&w=1080&q=80")'
    },

    limits: { desktopMax: 50, mobileScreenMax: 20, folderMax: 10 },

    // 默认图标 (调整了 x, y 坐标，增加 color)
    // 手机屏幕高度大概是 680px，底部 Dock 区域大概在 y=580 左右
    defaultIcons: {
        windows: [
            { name: "我的电脑", icon: "fa-solid fa-desktop", color: "#fff", x: 20, y: 20 },
            { name: "回收站", icon: "fa-solid fa-trash-can", color: "#dfe6e9", x: 20, y: 120 }
        ],
        macos: [
            { name: "Macintosh HD", icon: "fa-solid fa-hard-drive", color: "#dfe6e9", x: 1100, y: 20 },
        ],
        ubuntu: [
            { name: "Home", icon: "fa-solid fa-house", color: "#fff", x: 20, y: 20 },
            { name: "Trash", icon: "fa-solid fa-trash", color: "#dfe6e9", x: 20, y: 120 }
        ],
        android: [
            // 放在底部
            { name: "电话", icon: "fa-solid fa-phone", color: "#2ecc71", x: 20, y: 560 },
            { name: "信息", icon: "fa-solid fa-comment", color: "#3498db", x: 100, y: 560 },
            { name: "Chrome", icon: "fa-brands fa-chrome", color: "#f1c40f", x: 180, y: 560 },
            { name: "相机", icon: "fa-solid fa-camera", color: "#95a5a6", x: 260, y: 560 },
            // 放在上面几个
            { name: "时钟", icon: "fa-solid fa-clock", color: "#fff", x: 20, y: 80 }
        ],
        ios: [
            // 放在底部
            { name: "电话", icon: "fa-solid fa-phone", color: "#2ecc71", x: 20, y: 560 },
            { name: "Safari", icon: "fa-brands fa-safari", color: "#3498db", x: 100, y: 560 },
            { name: "邮件", icon: "fa-solid fa-envelope", color: "#3498db", x: 180, y: 560 },
            { name: "音乐", icon: "fa-solid fa-music", color: "#e74c3c", x: 260, y: 560 },
             // 放在上面
            { name: "设置", icon: "fa-solid fa-gear", color: "#95a5a6", x: 20, y: 80 }
        ]
    },

    // 工具栏分类数据 (Sidebar) - 增加了 color 字段
    sidebarTools: {
        windows: [
            {
                title: "系统应用",
                items: [
                    { name: "控制面板", icon: "fa-solid fa-sliders", color: "#0984e3" },
                    { name: "文件资源管理器", icon: "fa-solid fa-folder-open", color: "#f1c40f" },
                    { name: "Edge 浏览器", icon: "fa-brands fa-edge", color: "#74b9ff" }
                ]
            },
            {
                title: "常用软件",
                items: [
                    { name: "微信", icon: "fa-brands fa-weixin", color: "#2ecc71" },
                    { name: "QQ", icon: "fa-brands fa-qq", color: "#3498db" },
                    { name: "Chrome", icon: "fa-brands fa-chrome", color: "#fab1a0" }
                ]
            },
            {
                title: "大型游戏",
                items: [
                    { name: "英雄联盟", icon: "fa-solid fa-gamepad", color: "#f1c40f" },
                    { name: "Steam", icon: "fa-brands fa-steam", color: "#2c3e50" }
                ]
            }
        ],
        macos: [
            {
                title: "Applications",
                items: [
                    { name: "Safari", icon: "fa-brands fa-safari", color: "#0984e3" },
                    { name: "Music", icon: "fa-solid fa-music", color: "#ff7675" },
                    { name: "Messages", icon: "fa-solid fa-comment-dots", color: "#2ecc71" }
                ]
            },
            {
                title: "Productivity",
                items: [
                    { name: "Keynote", icon: "fa-solid fa-file-powerpoint", color: "#74b9ff" },
                    { name: "Pages", icon: "fa-solid fa-file-word", color: "#fab1a0" }
                ]
            }
        ],
        ubuntu: [
            {
                title: "Applications",
                items: [
                    { name: "Firefox", icon: "fa-brands fa-firefox-browser", color: "#e67e22" },
                    { name: "Terminal", icon: "fa-solid fa-terminal", color: "#333" },
                    { name: "Files", icon: "fa-solid fa-folder", color: "#e67e22" }
                ]
            },
            {
                title: "Dev Tools",
                items: [
                    { name: "VS Code", icon: "fa-solid fa-code", color: "#2980b9" },
                    { name: "Docker", icon: "fa-brands fa-docker", color: "#3498db" },
                    { name: "Git", icon: "fa-brands fa-git-alt", color: "#e74c3c" }
                ]
            }
        ],
        mobile: [
            {
                title: "社交",
                items: [
                    { name: "微信", icon: "fa-brands fa-weixin", color: "#2ecc71" },
                    { name: "抖音", icon: "fa-brands fa-tiktok", color: "#2d3436" },
                    { name: "小红书", icon: "fa-solid fa-book-open", color: "#e84393" }
                ]
            },
            {
                title: "工具",
                items: [
                    { name: "支付宝", icon: "fa-brands fa-alipay", color: "#0984e3" },
                    { name: "地图", icon: "fa-solid fa-map-location-dot", color: "#27ae60" },
                    { name: "天气", icon: "fa-solid fa-cloud-sun", color: "#f39c12" }
                ]
            },
            {
                title: "游戏",
                items: [
                    { name: "王者荣耀", icon: "fa-solid fa-shield-halved", color: "#f1c40f" },
                    { name: "和平精英", icon: "fa-solid fa-person-rifle", color: "#e67e22" }
                ]
            }
        ]
    }
};

function getToolsForOS(os) {
    if (os === 'android' || os === 'ios') return CONFIG.sidebarTools.mobile;
    return CONFIG.sidebarTools[os] || CONFIG.sidebarTools.windows;
}

// js/config.js
const CONFIG = {
    supabaseUrl: 'https://rjhmezzyjntpcvlycece.supabase.co',
    supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqaG1lenp5am50cGN2bHljZWNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MDAzMDIsImV4cCI6MjA3OTk3NjMwMn0.pi5M3kcu-CaJY0ryry8phi9E-SQdRKHGmxsJGIckANA',

    // 壁纸设置
    wallpapers: {
        windows: 'url("https://images.unsplash.com/photo-1477346611705-65d1883cee1e?ixlib=rb-4.0.3&w=1920&q=80")',
        macos: 'url("https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&w=1920&q=80")',
        ubuntu: 'url("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&w=1920&q=80")', // 橙紫色调
        android: 'url("https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&w=1080&q=80")',
        ios: 'url("https://images.unsplash.com/photo-1512990414788-d97cb4a25db3?ixlib=rb-4.0.3&w=1080&q=80")'
    },

    // 限制设置
    limits: {
        desktopMax: 50,
        mobileScreenMax: 20,
        folderMax: 10
    },

    // 各系统初始化时的默认桌面图标
    defaultIcons: {
        windows: [
            { name: "我的电脑", icon: "fa-solid fa-desktop", x: 20, y: 20 },
            { name: "回收站", icon: "fa-solid fa-trash-can", x: 20, y: 120 }
        ],
        macos: [
            { name: "Macintosh HD", icon: "fa-solid fa-hard-drive", x: 1100, y: 20 }, // Mac硬盘通常在右边
        ],
        ubuntu: [
            { name: "Home", icon: "fa-solid fa-house", x: 20, y: 20 },
            { name: "Trash", icon: "fa-solid fa-trash", x: 20, y: 120 }
        ],
        android: [
            { name: "时钟", icon: "fa-solid fa-clock", x: 20, y: 20 },
            { name: "设置", icon: "fa-solid fa-gear", x: 110, y: 20 },
            { name: "相机", icon: "fa-solid fa-camera", x: 200, y: 20 },
            { name: "相册", icon: "fa-solid fa-images", x: 290, y: 20 }
        ],
        ios: [
            { name: "App Store", icon: "fa-brands fa-app-store-ios", x: 20, y: 20 },
            { name: "设置", icon: "fa-solid fa-gear", x: 110, y: 20 },
            { name: "照片", icon: "fa-solid fa-images", x: 200, y: 20 }
        ]
    },

    // 工具栏分类数据 (Sidebar) - 按系统区分
    sidebarTools: {
        windows: [
            {
                title: "系统应用",
                items: [
                    { name: "控制面板", icon: "fa-solid fa-sliders" },
                    { name: "文件资源管理器", icon: "fa-solid fa-folder-open" },
                    { name: "Edge 浏览器", icon: "fa-brands fa-edge" }
                ]
            },
            {
                title: "常用软件",
                items: [
                    { name: "微信", icon: "fa-brands fa-weixin" },
                    { name: "QQ", icon: "fa-brands fa-qq" },
                    { name: "Chrome", icon: "fa-brands fa-chrome" }
                ]
            },
            {
                title: "大型游戏",
                items: [
                    { name: "英雄联盟", icon: "fa-solid fa-gamepad" },
                    { name: "Steam", icon: "fa-brands fa-steam" }
                ]
            }
        ],
        macos: [
            {
                title: "Applications",
                items: [
                    { name: "Safari", icon: "fa-brands fa-safari" },
                    { name: "Music", icon: "fa-solid fa-music" },
                    { name: "Messages", icon: "fa-solid fa-comment-dots" }
                ]
            },
            {
                title: "Productivity",
                items: [
                    { name: "Keynote", icon: "fa-solid fa-file-powerpoint" },
                    { name: "Pages", icon: "fa-solid fa-file-word" }
                ]
            }
        ],
        ubuntu: [
            {
                title: "Applications",
                items: [
                    { name: "Firefox", icon: "fa-brands fa-firefox-browser" },
                    { name: "Terminal", icon: "fa-solid fa-terminal" },
                    { name: "Files", icon: "fa-solid fa-folder" },
                    { name: "LibreOffice", icon: "fa-solid fa-file-lines" }
                ]
            },
            {
                title: "Dev Tools",
                items: [
                    { name: "VS Code", icon: "fa-solid fa-code" },
                    { name: "Docker", icon: "fa-brands fa-docker" },
                    { name: "Git", icon: "fa-brands fa-git-alt" }
                ]
            }
        ],
        // Android 和 iOS 共享类似的移动端应用
        mobile: [
            {
                title: "社交",
                items: [
                    { name: "微信", icon: "fa-brands fa-weixin" },
                    { name: "抖音", icon: "fa-brands fa-tiktok" },
                    { name: "小红书", icon: "fa-solid fa-book-open" }
                ]
            },
            {
                title: "工具",
                items: [
                    { name: "支付宝", icon: "fa-brands fa-alipay" },
                    { name: "地图", icon: "fa-solid fa-map-location-dot" },
                    { name: "天气", icon: "fa-solid fa-cloud-sun" }
                ]
            },
            {
                title: "游戏",
                items: [
                    { name: "王者荣耀", icon: "fa-solid fa-shield-halved" },
                    { name: "和平精英", icon: "fa-solid fa-person-rifle" }
                ]
            }
        ]
    }
};

// 辅助：获取当前系统的工具列表
function getToolsForOS(os) {
    if (os === 'android' || os === 'ios') return CONFIG.sidebarTools.mobile;
    return CONFIG.sidebarTools[os] || CONFIG.sidebarTools.windows;
}

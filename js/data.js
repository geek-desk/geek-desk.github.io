// js/data.js

// --- 1. 系统配置 ---
const SYSTEMS = {
    windows: { name: 'Windows 11', max_screens: 1, default_wallpaper: 'win11_default' },
    macos: { name: 'macOS Sonoma', max_screens: 1, default_wallpaper: 'macos_default' },
    android: { name: 'Android', max_screens: 6, default_wallpaper: 'android_default' },
    ios: { name: 'iOS', max_screens: 6, default_wallpaper: 'ios_default' },
    ubuntu: { name: 'Ubuntu', max_screens: 1, default_wallpaper: 'ubuntu_default' }
};

// --- 2. 壁纸列表 (使用 CDN/占位图) ---
const WALLPAPERS = {
    win11_default: { name: 'Win 11 Bloom', url: 'https://picsum.photos/1920/1080?random=1' },
    macos_default: { name: 'macOS Valley', url: 'https://picsum.photos/1920/1080?random=2' },
    android_default: { name: 'Android Abstract', url: 'https://picsum.photos/1080/1920?random=3' }, // 手机分辨率
    ios_default: { name: 'iOS Calm', url: 'https://picsum.photos/1080/1920?random=5' }, // 手机分辨率
    ubuntu_default: { name: 'Ubuntu Dark', url: 'https://picsum.photos/1920/1080?random=4' }
};

// --- 3. 应用/图标列表 (用于侧边栏和创建) ---
const APP_LIST = [
    // 系统应用 (System Apps)
    { id: 'app-thispc', name: 'This PC', icon_url: 'https://cdn.jsdelivr.net/npm/@primer/octicons@19.8.0/build/svg/device-desktop-24.svg', sys_category: ['windows', 'ubuntu'], func_category: 'system' },
    { id: 'app-finder', name: 'Finder', icon_url: 'https://cdn.jsdelivr.net/npm/@primer/octicons@19.8.0/build/svg/search-24.svg', sys_category: ['macos'], func_category: 'system' },
    { id: 'app-gallery', name: 'Gallery', icon_url: 'https://cdn.jsdelivr.net/npm/@primer/octicons@19.8.0/build/svg/image-24.svg', sys_category: ['android', 'ios'], func_category: 'system' },
    
    // 浏览器分类 (Browser Category)
    { id: 'app-chrome', name: 'Chrome', icon_url: 'https://cdn.jsdelivr.net/npm/@primer/octicons@19.8.0/build/svg/globe-24.svg', sys_category: ['windows', 'macos', 'android', 'ios', 'ubuntu'], func_category: 'browser' },
    { id: 'app-edge', name: 'Edge', icon_url: 'https://cdn.jsdelivr.net/npm/@primer/octicons@19.8.0/build/svg/browser-24.svg', sys_category: ['windows'], func_category: 'browser' },

    // 游戏分类 (Game Category)
    { id: 'app-steam', name: 'Steam', icon_url: 'https://cdn.jsdelivr.net/npm/@primer/octicons@19.8.0/build/svg/game-24.svg', sys_category: ['windows', 'macos', 'ubuntu'], func_category: 'game' },
    { id: 'app-clash', name: 'Clash of Clans', icon_url: 'https://cdn.jsdelivr.net/npm/@primer/octicons@19.8.0/build/svg/gear-24.svg', sys_category: ['android', 'ios'], func_category: 'game' },
    
    // 办公分类 (Office Category)
    { id: 'app-word', name: 'Word Editor', icon_url: 'https://cdn.jsdelivr.net/npm/@primer/octicons@19.8.0/build/svg/file-text-24.svg', sys_category: ['windows', 'macos'], func_category: 'office' },
];

// --- 4. 侧边栏分类标签 ---
const CATEGORIES = {
    system: 'System',
    browser: 'Browsers',
    game: 'Games',
    office: 'Office',
    // 更多分类...
};

// --- 5. 默认桌面状态 (由 core.js 初始化时填充) ---
const DEFAULT_DESKTOPS = {};

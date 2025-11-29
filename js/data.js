// js/data.js
// 静态数据定义：系统、壁纸、应用列表

// --- 1. System Configuration (系统配置) ---
const SYSTEMS = {
    windows: { name: 'Windows 11', max_screens: 1, default_wallpaper: 'win11_default' },
    macos: { name: 'macOS Sonoma', max_screens: 1, default_wallpaper: 'macos_default' },
    android: { name: 'Android', max_screens: 6, default_wallpaper: 'android_default' },
    ios: { name: 'iOS', max_screens: 6, default_wallpaper: 'ios_default' },
    ubuntu: { name: 'Ubuntu Linux', max_screens: 1, default_wallpaper: 'ubuntu_default' }
};

// --- 2. Wallpaper List (壁纸列表 - 保持不变) ---
const WALLPAPERS = {
    win11_default: { name: 'Win 11 Bloom', url: 'https://images.unsplash.com/photo-1632734185121-b3b320d32c02?q=80&w=2070&auto=format&fit=crop' }, 
    macos_default: { name: 'macOS Valley', url: 'https://images.unsplash.com/photo-1549497551-f76c5b76ed5a?q=80&w=2070&auto=format&fit=crop' },
    android_default: { name: 'Android Abstract', url: 'https://images.unsplash.com/photo-1623577319409-e85dfb9087c5?q=80&w=1887&auto=format&fit=crop' }, 
    ios_default: { name: 'iOS Calm', url: 'https://images.unsplash.com/photo-1594918732152-6e27435f9227?q=80&w=1887&auto=format&fit=crop' }, 
    ubuntu_default: { name: 'Ubuntu Dark', url: 'https://images.unsplash.com/photo-1510525000578-83b63297a7a5?q=80&w=2070&auto=format&fit=crop' }
};

// --- 3. App/Icon List (应用/图标列表 - 使用更具色彩的 Simple Icons 或替代方案) ---
const APP_LIST = [
    // 系统应用 (使用 Octicons 保证稳定性)
    { id: 'app-thispc', name: 'This PC', icon_url: 'https://cdn.jsdelivr.net/npm/@primer/octicons@19.8.0/build/svg/device-desktop-24.svg', sys_category: ['windows', 'ubuntu'], func_category: 'system' },
    { id: 'app-finder', name: 'Finder', icon_url: 'https://cdn.jsdelivr.net/npm/@primer/octicons@19.8.0/build/svg/search-24.svg', sys_category: ['macos'], func_category: 'system' },
    { id: 'app-gallery', name: 'Gallery', icon_url: 'https://cdn.jsdelivr.net/npm/@primer/octicons@19.8.0/build/svg/image-24.svg', sys_category: ['android', 'ios'], func_category: 'system' },
    
    // 浏览器分类 (Browser Category) - 使用 Simple Icons (彩色)
    { id: 'app-chrome', name: 'Chrome', icon_url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/googlechrome.svg', sys_category: ['windows', 'macos', 'android', 'ios', 'ubuntu'], func_category: 'browser' },
    { id: 'app-safari', name: 'Safari', icon_url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/safari.svg', sys_category: ['macos', 'ios'], func_category: 'browser' },

    // 游戏分类 (Game Category) - 使用 Simple Icons (彩色)
    { id: 'app-steam', name: 'Steam', icon_url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/steam.svg', sys_category: ['windows', 'macos', 'ubuntu'], func_category: 'game' },
    // 对于没有 Simple Icon 的，使用 Boxicons (默认黑色，但功能需要)
    { id: 'app-clash', name: 'Clash of Clans', icon_url: 'https://cdn.jsdelivr.net/npm/boxicons@2.1.4/svg/solid/bxs-castle.svg', sys_category: ['android', 'ios'], func_category: 'game' },
    
    // 办公分类 (Office Category) - 使用 Simple Icons (彩色)
    { id: 'app-word', name: 'Word Editor', icon_url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/microsoftword.svg', sys_category: ['windows', 'macos', 'ubuntu'], func_category: 'office' },
    // 对于没有 Simple Icon 的，使用 Boxicons (默认黑色，但功能需要)
    { id: 'app-notes', name: 'Notes', icon_url: 'https://cdn.jsdelivr.net/npm/boxicons@2.1.4/svg/solid/bxs-note.svg', sys_category: ['android', 'ios'], func_category: 'office' },
];

// --- 4. Sidebar Categories (侧边栏分类标签) ---
const CATEGORIES = {
    system: 'System',
    browser: 'Browsers',
    game: 'Games',
    office: 'Office',
};

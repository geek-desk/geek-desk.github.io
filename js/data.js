// js/data.js
// Static data definitions: Systems, Wallpapers, App List, and Categories

// --- 1. System Configuration (系统配置) ---
const SYSTEMS = {
    windows: { name: 'Windows 11', max_screens: 1, default_wallpaper: 'win11_default' },
    macos: { name: 'macOS Sonoma', max_screens: 1, default_wallpaper: 'macos_default' },
    android: { name: 'Android', max_screens: 6, default_wallpaper: 'android_default' },
    ios: { name: 'iOS', max_screens: 6, default_wallpaper: 'ios_default' },
    ubuntu: { name: 'Ubuntu Linux', max_screens: 1, default_wallpaper: 'ubuntu_default' }
};

// --- 2. Wallpaper List (壁纸列表 - 使用简化的 Unsplash URL) ---
const WALLPAPERS = {
    // 移除了复杂的查询参数，以提高加载稳定性
    win11_default: { name: 'Win 11 Bloom', url: 'https://images.unsplash.com/photo-1632734185121-b3b320d32c02' }, 
    macos_default: { name: 'macOS Valley', url: 'https://images.unsplash.com/photo-1549497551-f76c5b76ed5a' },
    android_default: { name: 'Android Abstract', url: 'https://images.unsplash.com/photo-1623577319409-e85dfb9087c5' }, 
    ios_default: { name: 'iOS Calm', url: 'https://images.unsplash.com/photo-1594918732152-6e27435f9227' }, 
    ubuntu_default: { name: 'Ubuntu Dark', url: 'https://images.unsplash.com/photo-1510525000578-83b63297a7a5' }
};

// --- 3. App/Icon List (应用/图标列表) ---
const APP_LIST = [
    // System Apps (系统应用 - 核心应用，通常出现在 Dock/Taskbar)
    { id: 'app-thispc', name: 'This PC', icon_url: 'https://cdn.jsdelivr.net/npm/@primer/octicons@19.8.0/build/svg/device-desktop-24.svg', sys_category: ['windows', 'ubuntu'], func_category: 'system' },
    { id: 'app-finder', name: 'Finder', icon_url: 'https://cdn.jsdelivr.net/npm/@primer/octicons@19.8.0/build/svg/search-24.svg', sys_category: ['macos'], func_category: 'system' },
    { id: 'app-gallery', name: 'Gallery', icon_url: 'https://cdn.jsdelivr.net/npm/@primer/octicons@19.8.0/build/svg/image-24.svg', sys_category: ['android', 'ios'], func_category: 'system' },
    
    // Browser Category (浏览器分类)
    { id: 'app-chrome', name: 'Chrome', icon_url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/googlechrome.svg', sys_category: ['windows', 'macos', 'android', 'ios', 'ubuntu'], func_category: 'browser' },
    { id: 'app-safari', name: 'Safari', icon_url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/safari.svg', sys_category: ['macos', 'ios'], func_category: 'browser' },

    // Game Category (游戏分类)
    { id: 'app-steam', name: 'Steam', icon_url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/steam.svg', sys_category: ['windows', 'macos', 'ubuntu'], func_category: 'game' },
    { id: 'app-clash', name: 'Clash of Clans', icon_url: 'https://cdn.jsdelivr.net/npm/boxicons@2.1.4/svg/solid/bxs-castle.svg', sys_category: ['android', 'ios'], func_category: 'game' },
    
    // Office Category (办公分类)
    { id: 'app-word', name: 'Word Editor', icon_url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/microsoftword.svg', sys_category: ['windows', 'macos', 'ubuntu'], func_category: 'office' },
    { id: 'app-notes', name: 'Notes', icon_url: 'https://cdn.jsdelivr.net/npm/boxicons@2.1.4/svg/solid/bxs-note.svg', sys_category: ['android', 'ios'], func_category: 'office' },
];

// --- 4. Sidebar Categories (侧边栏分类标签 - 用于折叠标题) ---
const CATEGORIES = {
    system: 'System Apps',
    browser: 'Browsers',
    game: 'Games & Entertainment',
    office: 'Productivity & Office',
    // 将来可以添加更多分类，例如:
    // media: 'Media & Photo',
    // tools: 'System Tools',
};

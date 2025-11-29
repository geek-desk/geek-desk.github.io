// js/config.js
const CONFIG = {
    supabaseUrl: 'https://rjhmezzyjntpcvlycece.supabase.co',
    supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqaG1lenp5am50cGN2bHljZWNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MDAzMDIsImV4cCI6MjA3OTk3NjMwMn0.pi5M3kcu-CaJY0ryry8phi9E-SQdRKHGmxsJGIckANA',

    // 修复：iOS 壁纸更新，确保都有默认值
    wallpapers: {
        windows: 'url("https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&w=1920&q=80")',
        macos: 'url("https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&w=1920&q=80")',
        ubuntu: 'url("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&w=1920&q=80")',
        android: 'url("https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&w=1080&q=80")',
        ios: 'url("https://images.unsplash.com/photo-1621257904006-23133842c83d?ixlib=rb-4.0.3&w=1080&q=80")' // 新的火星红
    },

    limits: { desktopMax: 50, mobileScreenMax: 20, folderMax: 10 },

    // ... (保留你原有的 i18n, defaultIcons, sidebarTools，不要删) ...
    // 为了节省篇幅，这里不重复粘贴 i18n 等代码，请保持原样。
    // 如果你之前的 config.js 坏了，请告诉我，我再发完整的。
    
    // 确保 i18n 存在 (防止报错)
    i18n: { zh: { "title":"我的云桌面" }, en: { "title":"Cloud Desktop" } } 
};

// ... 下面的 defaultIcons 和 sidebarTools 请务必保留上一版的完整内容 ...
// ... 此处为了突出修改重点省略 ...

// 必须保留这个辅助函数
function getToolsForOS(os) {
    if (os === 'android' || os === 'ios') return CONFIG.sidebarTools.mobile || [];
    return CONFIG.sidebarTools[os] || CONFIG.sidebarTools.windows || [];
}

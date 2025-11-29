// js/core.js

// 本地存储键
const STORAGE_KEY = 'DesktopShareSimData';
let userDesktops = {};
let currentSystemId = 'windows'; // 默认启动系统
let currentScreenIndex = 0; // 当前手机分屏索引 (仅用于手机系统)


// --- 本地存储功能 ---

/** 从 localStorage 加载所有桌面配置或使用默认值 */
const loadUserDesktops = () => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
        userDesktops = JSON.parse(savedData);
    } else {
        // 首次加载：为每个系统初始化一个最小桌面配置
        Object.keys(SYSTEMS).forEach(sysId => {
            const defaultApp = APP_LIST.find(app => app.sys_category.includes(sysId) && app.func_category === 'system');
            
            // 为每个手机分屏或电脑桌面创建配置
            const screenConfigs = [];
            for (let i = 0; i < SYSTEMS[sysId].max_screens; i++) {
                 // 只有第一个屏幕有默认图标
                 const icons = (i === 0 && defaultApp) ? [{ 
                    id: defaultApp.id, 
                    name: defaultApp.name, 
                    type: 'system', 
                    x: 20, 
                    y: 20,
                    is_folder: false
                }] : [];
                screenConfigs.push(icons);
            }

            userDesktops[sysId] = {
                is_public: false,
                wallpaper: SYSTEMS[sysId].default_wallpaper,
                screens: screenConfigs, // 存储所有分屏的图标配置
                folder_config: {}, // 文件夹配置
                metadata: { likes: 0, favorites: 0 }
            };
        });
    }
    console.log('Desktops loaded:', userDesktops);
};

/** 将当前状态保存到 localStorage */
const saveUserDesktops = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userDesktops));
    console.log('Desktops saved to localStorage.');
};

// --- UI 渲染和切换功能 ---

/** 渲染系统切换标签 */
const renderSystemTabs = () => {
    const $tabsContainer = $('#system-tabs');
    $tabsContainer.empty();
    
    Object.keys(SYSTEMS).forEach(sysId => {
        const sys = SYSTEMS[sysId];
        const $tab = $(`<div class="system-tab" data-system-id="${sysId}">${sys.name}</div>`);
        
        if (sysId === currentSystemId) {
            $tab.addClass('active');
        }
        
        $tab.on('click', () => switchSystem(sysId));
        $tabsContainer.append($tab);
    });
};

/** 切换活动桌面视图 */
const switchSystem = (newSystemId) => {
    if (newSystemId === currentSystemId) return;
    
    // 1. 更新当前状态
    currentSystemId = newSystemId;
    currentScreenIndex = 0; // 切换系统后，回到第一个屏幕
    
    // 2. 更新活动标签页
    $(`.system-tab.active`).removeClass('active');
    $(`.system-tab[data-system-id="${newSystemId}"]`).addClass('active');
    
    // 3. 根据新系统配置容器样式 (例如，手机系统需要窄屏)
    const isMobile = ['android', 'ios'].includes(newSystemId);
    $('#desktop-area').toggleClass('mobile-mode', isMobile);

    // 4. 加载和渲染新的桌面配置和侧边栏
    renderDesktop(currentSystemId, currentScreenIndex);
    renderSidebar(currentSystemId);
};

/** 切换手机分屏 (仅用于手机系统) */
const switchScreen = (index) => {
    const sys = SYSTEMS[currentSystemId];
    if (index >= 0 && index < sys.max_screens) {
        currentScreenIndex = index;
        renderDesktop(currentSystemId, currentScreenIndex);
    }
};


$(document).ready(function() {
    // 1. 加载数据并设置初始状态
    loadUserDesktops();
    renderSystemTabs();
    
    // 2. 初始渲染当前桌面和侧边栏
    switchSystem(currentSystemId);

    // 3. 'World' 按钮 (将来功能占位)
    $('#world-btn').on('click', () => {
        alert("Navigating to 'World' page (Future Feature)");
    });
    
    // 4. (TODO: 引入拖放事件处理后, 需要监听拖放结束事件，并调用 saveUserDesktops())
});

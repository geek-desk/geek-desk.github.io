// js/core.js
// 核心逻辑：状态管理、本地存储、系统切换

const STORAGE_KEY = 'DesktopShareSimData';
let userDesktops = {};
let currentSystemId = 'windows'; 
let currentScreenIndex = 0; 


// --- Local Storage Functions (本地存储功能) ---

/** 从 localStorage 加载所有桌面配置或使用默认值 */
const loadUserDesktops = () => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
        userDesktops = JSON.parse(savedData);
    } else {
        // 首次加载：为每个系统初始化一个最小桌面配置
        Object.keys(SYSTEMS).forEach(sysId => {
            const defaultApp = APP_LIST.find(app => app.sys_category.includes(sysId) && app.func_category === 'system');
            
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
                folder_config: {}, 
                metadata: { likes: 0, favorites: 0 }
            };
        });
        saveUserDesktops(); // 首次加载后保存默认状态
    }
    console.log('Desktops loaded:', userDesktops);
};

/** 将当前状态保存到 localStorage */
const saveUserDesktops = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userDesktops));
};

// --- UI Rendering and Switching Functions (UI 渲染和切换功能) ---

/** 渲染系统切换标签 */
const renderSystemTabs = () => {
    const $tabsContainer = $('#system-tabs');
    $tabsContainer.empty();
    
    // 遍历 SYSTEMS 对象，生成标签
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
    if (newSystemId === currentSystemId) {
         // 即使系统未切换，也要重新渲染以防万一
         renderDesktop(currentSystemId, currentScreenIndex);
         renderSidebar(currentSystemId);
         return;
    }
    
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
        // 更新指示器
        $('.screen-dot.active').removeClass('active');
        $(`.screen-dot[data-index="${index}"]`).addClass('active');
        // 重新渲染桌面
        renderDesktop(currentSystemId, currentScreenIndex);
    }
};

$(document).ready(function() {
    // 1. 加载数据并设置初始状态
    loadUserDesktops();
    renderSystemTabs();
    
    // 2. 初始渲染
    switchSystem(currentSystemId);

    // 3. 'World' 按钮 (占位)
    $('#world-btn').on('click', () => {
        alert("World view is under construction.");
    });
    
    // 4. 右键菜单阻止默认行为
    $('#desktop-area').on('contextmenu', function(e) {
        e.preventDefault();
        // TODO: 弹出自定义右键菜单
        console.log("Custom Context Menu Triggered.");
    });
});

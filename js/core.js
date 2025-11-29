// js/core.js
// 核心逻辑：状态管理、本地存储、系统切换

const STORAGE_KEY = 'DesktopShareSimData'; // 仅在此处声明 STORAGE_KEY
let userDesktops = {};
let currentSystemId = 'windows'; 
let currentScreenIndex = 0; 


// --- Local Storage Functions (本地存储功能) ---

/** 从 localStorage 加载所有桌面配置或使用默认值 */
const loadUserDesktops = () => {
    // 这里的 SYSTEMS, APP_LIST, WALLPAPERS 变量现在可以安全访问了，因为 data.js 已经加载
    const savedData = localStorage.getItem(STORAGE_KEY);
    // ... (loadUserDesktops 函数其余部分保持不变) ...
    if (savedData) {
        userDesktops = JSON.parse(savedData);
    } else {
        Object.keys(SYSTEMS).forEach(sysId => {
            const defaultApp = APP_LIST.find(app => app.sys_category.includes(sysId) && app.func_category === 'system');
            
            const screenConfigs = [];
            for (let i = 0; i < SYSTEMS[sysId].max_screens; i++) {
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
                screens: screenConfigs,
                folder_config: {}, 
                metadata: { likes: 0, favorites: 0 }
            };
        });
        saveUserDesktops();
    }
    console.log('Desktops loaded:', userDesktops);
};

/** 将当前状态保存到 localStorage */
const saveUserDesktops = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userDesktops));
};

// ... (renderSystemTabs, switchSystem, switchScreen 函数保持不变) ...
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

const switchSystem = (newSystemId) => {
    if (newSystemId === currentSystemId) {
         renderDesktop(currentSystemId, currentScreenIndex);
         renderSidebar(currentSystemId);
         return;
    }
    
    currentSystemId = newSystemId;
    currentScreenIndex = 0; 
    
    $(`.system-tab.active`).removeClass('active');
    $(`.system-tab[data-system-id="${newSystemId}"]`).addClass('active');
    
    const isMobile = ['android', 'ios'].includes(newSystemId);
    $('#desktop-area').toggleClass('mobile-mode', isMobile);
    
    renderDesktop(currentSystemId, currentScreenIndex);
    renderSidebar(currentSystemId);
};

const switchScreen = (index) => {
    const sys = SYSTEMS[currentSystemId];
    if (index >= 0 && index < sys.max_screens) {
        currentScreenIndex = index;
        $('.screen-dot.active').removeClass('active');
        $(`.screen-dot[data-index="${index}"]`).addClass('active');
        renderDesktop(currentSystemId, currentScreenIndex);
    }
};

$(document).ready(function() {
    // 确保 DOM 准备就绪后，才开始执行初始化逻辑
    loadUserDesktops();
    renderSystemTabs();
    
    switchSystem(currentSystemId);

    $('#world-btn').on('click', () => {
        alert("World view is under construction.");
    });
    
    $('#desktop-area').on('contextmenu', function(e) {
        e.preventDefault();
        console.log("Custom Context Menu Triggered.");
    });
});

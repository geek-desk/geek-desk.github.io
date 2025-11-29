// js/core.js
// 包含初始化、系统切换、桌面渲染、侧边栏渲染等核心逻辑

// --- 全局状态变量 (Global State Variables) ---
// 初始系统设置为 Windows
let currentSystemId = localStorage.getItem('currentSystemId') || 'windows'; 
let currentScreenIndex = parseInt(localStorage.getItem('currentScreenIndex')) || 0;
let userDesktops = {}; // 存储用户桌面图标配置

// --- 状态管理函数 ---

/**
 * 从本地存储加载用户桌面数据。
 */
function loadUserDesktops() {
    const savedData = localStorage.getItem('userDesktops');
    if (savedData) {
        userDesktops = JSON.parse(savedData);
    } else {
        // 初始化默认桌面配置 (确保至少有一个空的配置)
        userDesktops = {
            windows: { screens: [[]], mode: 'desktop' },
            macos: { screens: [[]], mode: 'desktop' },
            android: { screens: [[], [], [], [], [], []], mode: 'mobile' },
            ios: { screens: [[], [], [], [], [], []], mode: 'mobile' },
            ubuntu: { screens: [[]], mode: 'desktop' }
        };
    }
}

/**
 * 保存用户桌面数据到本地存储。
 */
function saveUserDesktops() {
    localStorage.setItem('userDesktops', JSON.stringify(userDesktops));
    localStorage.setItem('currentSystemId', currentSystemId);
    localStorage.setItem('currentScreenIndex', currentScreenIndex.toString());
}

// --- 渲染和初始化函数 ---

/**
 * 渲染顶部系统切换标签。
 */
function renderSystemTabs() {
    const $tabs = $('#system-tabs');
    $tabs.empty();
    
    for (const sysId in SYSTEMS) {
        if (!SYSTEMS.hasOwnProperty(sysId)) continue;
        const system = SYSTEMS[sysId];
        
        const $tab = $(`<div class="system-tab" data-system-id="${sysId}">${system.name}</div>`);
        if (sysId === currentSystemId) {
            $tab.addClass('active');
        }
        $tabs.append($tab);
    }
}

/**
 * 切换操作系统。
 */
function switchSystem(newSystemId) {
    if (currentSystemId === newSystemId) return;

    currentSystemId = newSystemId;
    currentScreenIndex = 0; // 切换系统后回到第一个屏幕

    // 1. 更新顶部标签状态
    $('.system-tab').removeClass('active');
    $(`.system-tab[data-system-id="${newSystemId}"]`).addClass('active');
    
    // 2. 渲染新系统内容
    renderSystem(newSystemId);
    
    // 3. 保存状态
    saveUserDesktops();
}

/**
 * 渲染当前系统的所有元素 (壁纸, 图标, 侧边栏)。
 */
function renderSystem(systemId) {
    // 确保桌面配置已初始化
    if (!userDesktops[systemId]) {
        userDesktops[systemId] = { screens: [[]], mode: 'desktop' };
    }

    // 1. 切换桌面模式 (桌面/手机)
    const system = SYSTEMS[systemId];
    const desktopMode = userDesktops[systemId].mode || (system.max_screens > 1 ? 'mobile' : 'desktop');
    const $desktopArea = $('#desktop-area');
    
    $desktopArea.toggleClass('mobile-mode', desktopMode === 'mobile');
    $('#screen-indicator').toggleClass('visible', desktopMode === 'mobile');
    
    // 2. 渲染壁纸
    renderWallpaper(systemId);
    
    // 3. 渲染桌面图标 (当前屏幕)
    renderDesktopIcons(systemId, currentScreenIndex);
    
    // 4. 渲染侧边栏
    renderSidebar(systemId);

    // 5. 渲染 Dock/任务栏
    renderDock(systemId);
}

/**
 * 渲染壁纸。
 */
function renderWallpaper(systemId) {
    const wallpaperId = SYSTEMS[systemId].default_wallpaper;
    const wallpaperUrl = WALLPAPERS[wallpaperId].url;

    $('#desktop-background').css('background-image', `url('${wallpaperUrl}')`);
}


/**
 * 渲染桌面图标 (特定屏幕)。
 */
function renderDesktopIcons(systemId, screenIndex) {
    const $iconArea = $('#icon-area');
    $iconArea.empty(); // 清空现有图标

    const screenIcons = userDesktops[systemId].screens[screenIndex];
    if (!screenIcons) return;

    screenIcons.forEach(iconData => {
        const appInfo = APP_LIST.find(app => app.id === iconData.id);
        if (!appInfo) return; // 避免渲染不存在的应用

        const $icon = $(`
            <div class="desktop-icon" data-id="${iconData.id}" style="left: ${iconData.x}px; top: ${iconData.y}px;">
                <img src="${appInfo.icon_url}" alt="${iconData.name}">
                <span>${iconData.name}</span>
            </div>
        `);
        $iconArea.append($icon);
    });

    // 渲染分屏指示器 (如果处于手机模式)
    renderScreenIndicator(systemId);
}

/**
 * 渲染分屏指示器。
 */
function renderScreenIndicator(systemId) {
    const system = SYSTEMS[systemId];
    const $indicator = $('#screen-indicator');
    $indicator.empty();

    if (system.max_screens > 1) {
        for (let i = 0; i < system.max_screens; i++) {
            const $dot = $(`<div class="screen-dot" data-screen-index="${i}"></div>`);
            if (i === currentScreenIndex) {
                $dot.addClass('active');
            }
            $indicator.append($dot);
        }
    }
}


/**
 * 渲染任务栏/Dock图标 (只显示系统应用)。
 */
function renderDock(systemId) {
    const $dock = $('#system-dock');
    $dock.empty();

    // 筛选出适用于当前系统的核心应用
    const dockApps = APP_LIST.filter(app => 
        app.sys_category.includes(systemId) && app.func_category === 'system'
    );

    dockApps.forEach(app => {
        // 使用一个简单的占位符或真实的 Dock 图标结构
        const $icon = $(`
            <div class="dock-icon" data-id="${app.id}">
                <img src="${app.icon_url}" alt="${app.name}">
            </div>
        `);
        $dock.append($icon);
    });
}

/**
 * 渲染侧边栏工具箱，使用可折叠的垂直分类。
 */
function renderSidebar(systemId) {
    const $sidebar = $('#toolbox-sidebar');
    $sidebar.empty(); 

    // 遍历 CATEGORIES 对象
    for (const catId in CATEGORIES) {
        if (!CATEGORIES.hasOwnProperty(catId)) continue;
        const catName = CATEGORIES[catId];

        // 1. 过滤出适用于当前系统和当前分类的应用
        const appsInCategory = APP_LIST.filter(app => 
            app.sys_category.includes(systemId) && app.func_category === catId
        );

        if (appsInCategory.length === 0) {
            continue; // 该系统在该分类下没有应用，跳过
        }

        // 2. 创建分类区块
        const $section = $(`<div class="category-section"></div>`);
        
        // 3. 创建分类头部 (默认展开)
        const $header = $(`
            <h4 class="category-header" data-category-id="${catId}">
                ${catName}
            </h4>
        `);

        // 4. 创建图标内容区域
        const $content = $(`
            <div class="icon-list-content" data-category-id="${catId}"></div>
        `);

        // 5. 渲染图标到内容区域
        appsInCategory.forEach(app => {
            const $icon = $(`
                <div class="sidebar-icon" data-app-id="${app.id}" draggable="true">
                    <img src="${app.icon_url}" alt="${app.name}">
                    <span>${app.name}</span>
                </div>
            `);
            $content.append($icon);
        });

        $section.append($header).append($content);
        $sidebar.append($section);
    }
    
    // 6. 绑定折叠/展开事件
    $('.category-header').off('click').on('click', function() {
        $(this).toggleClass('collapsed');
        $(this).next('.icon-list-content').slideToggle(200);
    });
}

// --- 事件绑定和初始化 ---

function setupEventListeners() {
    // 切换系统事件
    $('#system-tabs').on('click', '.system-tab', function() {
        const newSystemId = $(this).data('system-id');
        switchSystem(newSystemId);
    });
    
    // 切换分屏事件 (针对手机模式)
    $('#screen-indicator').on('click', '.screen-dot', function() {
        const newScreenIndex = $(this).data('screen-index');
        currentScreenIndex = newScreenIndex;
        renderDesktopIcons(currentSystemId, currentScreenIndex);
        saveUserDesktops();
    });

    // 取消选中桌面图标
    $('#icon-area').on('click', function(e) {
        if (!$(e.target).closest('.desktop-icon').length) {
            $('.desktop-icon').removeClass('selected');
        }
    });

    // 选中桌面图标
    $('#icon-area').on('click', '.desktop-icon', function(e) {
        $('.desktop-icon').removeClass('selected');
        $(this).addClass('selected');
        e.stopPropagation(); 
    });

    // Dock 图标点击事件
    $('#system-dock').on('click', '.dock-icon', function() {
        const appId = $(this).data('id');
        alert(`Launching application: ${appId}`);
    });
}

/**
 * 页面初始化入口。
 */
$(document).ready(function() {
    // 确保 APP_LIST 和 CATEGORIES 已在 data.js 中加载
    if (typeof APP_LIST === 'undefined' || typeof SYSTEMS === 'undefined') {
        console.error("Initialization failed: data.js might not be loaded or variables are missing.");
        return;
    }
    
    loadUserDesktops(); 
    renderSystemTabs();
    
    // 首次渲染页面
    renderSystem(currentSystemId); 

    setupEventListeners();
});

// js/core.js
// 包含初始化、系统切换、桌面渲染、侧边栏渲染等核心逻辑

// 全局变量 (假设它们已在 core.js 外部定义或在其他地方正确加载)
// let currentSystemId = 'windows';
// let currentScreenIndex = 0;
// let userDesktops = {}; // Must be initialized or loaded

// ... (loadUserDesktops, saveUserDesktops, switchSystem, renderSystemTabs, renderDesktop, setupEventListeners 等其他函数保持不变) ...

/**
 * 渲染任务栏/Dock图标。
 * 任务栏通常只显示系统级别的核心应用或已打开的应用。
 */
function renderDock(systemId) {
    const $dock = $('#system-dock');
    $dock.empty();

    // 筛选出适用于当前系统的核心应用 (例如，标记为 func_category: 'system' 的应用)
    const dockApps = APP_LIST.filter(app => 
        app.sys_category.includes(systemId) && app.func_category === 'system'
    );

    // 渲染 Dock 图标 (这里使用简单的渲染逻辑)
    dockApps.forEach(app => {
        const $icon = $(`
            <div class="dock-icon" data-id="${app.id}">
                <img src="${app.icon_url}" alt="${app.name}">
                <span>${app.name}</span>
            </div>
        `);
        // 注意：Dock 图标可能需要不同的 CSS 样式 (.dock-icon)
        $dock.append($icon);
    });

    // 额外的：Dock 还需要显示 Start/Home 按钮等，这里仅处理应用图标
}

/**
 * 重写：渲染侧边栏工具箱，使用可折叠的垂直分类。
 * 侧边栏图标必须与当前系统匹配 (sys_category)。
 */
function renderSidebar(systemId) {
    const $sidebar = $('#toolbox-sidebar');
    
    // 清空旧的分类和图标列表
    // 由于我们改变了结构，直接清空整个容器，只保留必要的子容器
    $sidebar.empty(); 

    // 遍历 CATEGORIES 对象，创建可折叠部分
    for (const catId in CATEGORIES) {
        if (!CATEGORIES.hasOwnProperty(catId)) continue;
        const catName = CATEGORIES[catId];

        // 1. 过滤出适用于当前系统和当前分类的应用
        const appsInCategory = APP_LIST.filter(app => 
            app.sys_category.includes(systemId) && app.func_category === catId
        );

        if (appsInCategory.length === 0) {
            // 如果该系统在该分类下没有应用，则跳过不渲染
            continue;
        }

        // 2. 创建分类区块
        const $section = $(`<div class="category-section"></div>`);
        
        // 3. 创建分类头部 (可点击折叠)
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

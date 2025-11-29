// js/desktop.js
// 桌面渲染、图标生成和侧边栏逻辑
// 依赖：data.js (常量), core.js (状态变量和切换函数)

/** * 渲染桌面图标 
 * @param {string} sysId - 当前系统 ID
 * @param {number} screenIndex - 当前手机分屏索引
 */
const renderDesktop = (sysId, screenIndex) => {
    // 确保数据结构存在，防止运行时错误
    const desktopConfig = userDesktops[sysId];
    if (!desktopConfig) return; 

    const wallpaper = WALLPAPERS[desktopConfig.wallpaper];
    const screenIcons = desktopConfig.screens[screenIndex]; // 获取当前屏幕的图标列表

    // 1. 设置壁纸
    $('#desktop-background').css('background-image', `url(${wallpaper.url})`);
    
    // 2. 清除并渲染图标
    const $iconArea = $('#icon-area');
    $iconArea.empty();
    
    if (screenIcons) {
        screenIcons.forEach(iconData => {
            // 从 APP_LIST 中查找应用信息，如果找不到则使用默认占位符
            const appInfo = APP_LIST.find(app => app.id === iconData.id) || { 
                name: 'Unknown App', 
                icon_url: 'https://cdn.jsdelivr.net/npm/boxicons@2.1.4/svg/solid/bxs-error.svg' 
            };
            
            const $icon = $(`
                <div class="desktop-icon" 
                     data-id="${iconData.id}" 
                     data-type="${iconData.is_folder ? 'folder' : 'app'}"
                     data-x="${iconData.x}" 
                     data-y="${iconData.y}">
                    <img src="${appInfo.icon_url}" alt="${appInfo.name}">
                    <span>${iconData.name || appInfo.name}</span>
                </div>
            `);

            $icon.css({
                top: iconData.y + 'px',
                left: iconData.x + 'px'
            });
            
            $iconArea.append($icon);
        });
    }

    // 3. 渲染分屏指示器 (仅手机系统)
    renderScreenIndicator(sysId);
    
    // 4. 绑定图标选中事件 (注意：使用 off() 清除旧事件，防止重复绑定)
    $iconArea.off('click', '.desktop-icon').on('click', '.desktop-icon', function(event) {
        event.stopPropagation(); 
        $('.desktop-icon').removeClass('selected');
        $(this).addClass('selected');
    });

    // 点击桌面背景时，取消所有选中状态
    $('#desktop-background, #icon-area').off('click').on('click', function(event) {
         if (!$(event.target).closest('.desktop-icon').length) {
            $('.desktop-icon').removeClass('selected');
        }
    });
};

/** * 渲染分屏指示器 
 * @param {string} sysId - 当前系统 ID
 */
const renderScreenIndicator = (sysId) => {
    const sys = SYSTEMS[sysId];
    const $indicator = $('#screen-indicator');
    $indicator.empty();
    $indicator.removeClass('visible');

    if (sys.max_screens > 1) {
        $indicator.addClass('visible');
        for (let i = 0; i < sys.max_screens; i++) {
            const $dot = $(`<div class="screen-dot" data-index="${i}"></div>`);
            if (i === currentScreenIndex) {
                $dot.addClass('active');
            }
            // 使用 switchScreen (来自 core.js) 切换屏幕
            $dot.on('click', () => switchScreen(i)); 
            $indicator.append($dot);
        }
    }
};

/** * 渲染应用库侧边栏 
 * @param {string} sysId - 当前系统 ID
 */
const renderSidebar = (sysId) => {
    const $categoryContainer = $('#sidebar-categories');
    $categoryContainer.empty();
    
    // 默认过滤器设置为第一个系统适用的分类 (如果存在)
    let initialCategory = 'system'; 
    let firstCategoryFound = false;

    // 1. 渲染分类按钮
    Object.keys(CATEGORIES).forEach(catId => {
        // 检查当前系统是否有应用属于这个分类
        const hasApps = APP_LIST.some(app => app.sys_category.includes(sysId) && app.func_category === catId);
        
        if (hasApps) {
            if (!firstCategoryFound) {
                initialCategory = catId;
                firstCategoryFound = true;
            }

            const $btn = $(`<button data-cat-id="${catId}">${CATEGORIES[catId]}</button>`);
            
            // 绑定点击事件，用于切换分类
            $btn.on('click', function() {
                // 重新渲染图标列表
                renderSidebarIcons(sysId, catId); 
                $('#sidebar-categories button').removeClass('active');
                $(this).addClass('active');
            });
            
            $categoryContainer.append($btn);
        }
    });
    
    // 2. 设置初始活动分类
    $(`button[data-cat-id="${initialCategory}"]`).addClass('active');

    // 3. 渲染初始图标
    renderSidebarIcons(sysId, initialCategory);
};

/** * 过滤并显示侧边栏图标 
 * @param {string} sysId - 当前系统 ID
 * @param {string} catId - 当前分类 ID
 */
const renderSidebarIcons = (sysId, catId) => {
    const $iconList = $('#sidebar-icon-list');
    $iconList.empty();

    const filteredApps = APP_LIST.filter(app => 
        // 筛选逻辑：适用系统 AND 功能分类
        app.sys_category.includes(sysId) && app.func_category === catId
    );

    filteredApps.forEach(app => {
        const $icon = $(`
            <div class="sidebar-icon" data-app-id="${app.id}" draggable="true">
                <img src="${app.icon_url}" alt="${app.name}">
                <span>${app.name}</span>
            </div>
        `);
        
        // 侧边栏图标的拖动逻辑将在 drag-handler.js 中处理
        $iconList.append($icon);
    });
};

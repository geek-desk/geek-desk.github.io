// js/desktop.js
// 桌面渲染、图标生成和侧边栏逻辑

/** 渲染桌面图标 */
const renderDesktop = (sysId, screenIndex) => {
    const desktopConfig = userDesktops[sysId];
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
    
    // 4. 绑定图标选中事件
    $iconArea.on('click', '.desktop-icon', function(event) {
        event.stopPropagation(); 
        $('.desktop-icon').removeClass('selected');
        $(this).addClass('selected');
    });

    // 点击桌面背景时，取消所有选中状态
    $('#desktop-background, #icon-area').on('click', function(event) {
         if (!$(event.target).closest('.desktop-icon').length) {
            $('.desktop-icon').removeClass('selected');
        }
    });
};

/** 渲染分屏指示器 */
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
            $dot.on('click', () => switchScreen(i));
            $indicator.append($dot);
        }
    }
};

/** 渲染应用库侧边栏 */
const renderSidebar = (sysId) => {
    const $categoryContainer = $('#sidebar-categories');
    $categoryContainer.empty();
    
    // 默认过滤器设置为第一个系统适用的分类 (这里默认用 'browser' 或 'system' 都可以)
    let initialCategory = 'system'; 
    
    // 1. 渲染分类按钮
    Object.keys(CATEGORIES).forEach(catId => {
        // 只有当前系统至少有一个应用属于这个分类时才显示
        const hasApps = APP_LIST.some(app => app.sys_category.includes(sysId) && app.func_category === catId);
        
        if (hasApps) {
            const $btn = $(`<button data-cat-id="${catId}">${CATEGORIES[catId]}</button>`);
            
            if (catId === initialCategory) {
                $btn.addClass('active');
            }
            
            $btn.on('click', function() {
                // 重新渲染图标列表
                renderSidebarIcons(sysId, catId); 
                $('#sidebar-categories button').removeClass('active');
                $(this).addClass('active');
            });
            
            $categoryContainer.append($btn);
        }
    });
    
    // 2. 渲染初始图标
    renderSidebarIcons(sysId, initialCategory);
};

/** 过滤并显示侧边栏图标 */
const renderSidebarIcons = (sysId, catId) => {
    const $iconList = $('#sidebar-icon-list');
    $iconList.empty();

    const filteredApps = APP_LIST.filter(app => 
        app.sys_category.includes(sysId) && app.func_category === catId
    );

    filteredApps.forEach(app => {
        const $icon = $(`
            <div class="sidebar-icon" data-app-id="${app.id}" draggable="true">
                <img src="${app.icon_url}" alt="${app.name}">
                <span>${app.name}</span>
            </div>
        `);
        
        // TODO: 绑定拖动事件的初始化逻辑
        $iconList.append($icon);
    });
};

// js/desktop.js

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
            const appInfo = APP_LIST.find(app => app.id === iconData.id) || { name: 'Unknown App', icon_url: '' };
            
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
    
    // 4. (TODO: 绑定右键菜单和图标选择事件)
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
    
    let activeCategory = 'system'; // 默认过滤器为系统应用
    
    // 1. 渲染分类按钮
    Object.keys(CATEGORIES).forEach(catId => {
        const $btn = $(`<button data-cat-id="${catId}">${CATEGORIES[catId]}</button>`);
        
        if (catId === activeCategory) {
            $btn.addClass('active');
        }
        
        $btn.on('click', function() {
            activeCategory = catId;
            // 重新渲染图标列表
            renderSidebarIcons(sysId, activeCategory); 
            $('#sidebar-categories button').removeClass('active');
            $(this).addClass('active');
        });
        
        $categoryContainer.append($btn);
    });
    
    // 2. 渲染初始图标
    renderSidebarIcons(sysId, activeCategory);
};

/** 过滤并显示侧边栏图标 */
const renderSidebarIcons = (sysId, catId) => {
    const $iconList = $('#sidebar-icon-list');
    $iconList.empty();

    const filteredApps = APP_LIST.filter(app => 
        // 过滤条件: 适用系统 AND 功能分类
        app.sys_category.includes(sysId) && app.func_category === catId
    );

    filteredApps.forEach(app => {
        const $icon = $(`
            <div class="sidebar-icon" data-app-id="${app.id}">
                <img src="${app.icon_url}" alt="${app.name}">
                <span>${app.name}</span>
            </div>
        `);
        
        // TODO: 绑定从侧边栏拖动到桌面的事件
        $iconList.append($icon);
    });
};

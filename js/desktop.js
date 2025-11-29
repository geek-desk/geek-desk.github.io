// js/desktop.js

class DesktopManager {
    constructor() {
        this.currentOS = 'windows';
        // 内存缓存：存储各系统的图标布局和文件夹数据
        this.cachedLayouts = { 
            windows: null, 
            macos: null, 
            ubuntu: null, 
            android: null, 
            ios: null 
        };
        this.folderData = {}; // 当前运行时的文件夹数据 { "folder-id": [iconList] }
        this.currentOpenFolderId = null;

        this.init();
    }

    init() {
        // 初始化各个模块
        this.initDragDrop();
        this.initContextMenu();
        this.initFolderWindow();
        
        // 启动时默认加载 Windows
        this.switchOS('windows');

        // 绑定侧边栏分类折叠事件 (事件委托)
        $(document).on('click', '.cat-title', function() {
            $(this).parent().toggleClass('collapsed');
        });
    }

    // === 核心：切换操作系统 ===
    switchOS(osName) {
        // 1. 切换前，保存当前桌面状态到内存
        this.saveToMemory(this.currentOS);

        this.currentOS = osName;
        console.log("Switched to:", osName);

        // 2. 更新壁纸和容器样式
        $('#desktop-area').removeClass().addClass(`os-${osName}`).css('background-image', CONFIG.wallpapers[osName]);
        
        // 3. 更新 UI (任务栏、Dock、手机壳)
        this.updateSystemUI(osName);
        
        // 4. 重新渲染侧边栏工具箱
        this.renderSidebar(osName);

        // 5. 清空舞台并尝试加载数据
        $('#desktop-stage').empty();
        
        const cached = this.cachedLayouts[osName];
        
        // 如果内存中有缓存（之前切过去过，或者从云端加载过）
        if (cached && cached.icons) {
            this.folderData = cached.folders || {}; // 恢复文件夹数据
            this.renderIcons(cached.icons);
        } else {
            // 首次加载：使用 Config 中的默认图标
            this.folderData = {};
            const defaults = CONFIG.defaultIcons[osName] || [];
            defaults.forEach(icon => {
                const id = 'def-' + Date.now() + Math.random();
                this.addIcon(id, icon.name, icon.icon, icon.x, icon.y, '#desktop-stage', 'app', icon.color);
            });
        }

        // 6. 触发云端同步 (如果已登录，会覆盖上面的默认/缓存，并更新“公开”复选框状态)
        if (window.loadCloudDesktop) {
            window.loadCloudDesktop();
        }
    }

    // === 侧边栏渲染 ===
    renderSidebar(os) {
        const container = $('#dynamic-toolbox');
        container.empty();

        let tools = [];
        try {
            tools = getToolsForOS(os); // 来自 config.js
        } catch (e) {
            console.error("Config Error:", e);
        }

        if (!tools || !Array.isArray(tools)) return;

        tools.forEach((cat, index) => {
            let itemsHtml = '';
            if (cat.items) {
                cat.items.forEach(tool => {
                    itemsHtml += `
                        <div class="tool-icon" data-name="${tool.name}" data-icon="${tool.icon}" data-color="${tool.color || '#555'}">
                            <i class="${tool.icon}" style="color:${tool.color || '#555'}"></i>
                            <span>${tool.name}</span>
                        </div>
                    `;
                });
            }

            container.append(`
                <div class="category ${index === 0 ? '' : 'collapsed'}">
                    <div class="cat-title">${cat.title}</div>
                    <div class="cat-content">${itemsHtml}</div>
                </div>
            `);
        });

        // 侧边栏图标生成后，必须重新绑定拖拽事件
        this.initToolDrag();
    }

    // === 系统 UI 显隐控制 ===
    updateSystemUI(os) {
        $('.sys-ui').addClass('hidden');
        $('body').removeClass('mobile-mode');

        if (os === 'windows') $('.taskbar-win11').removeClass('hidden');
        else if (os === 'macos') $('.dock-macos').removeClass('hidden');
        else if (os === 'ubuntu') $('.dock-ubuntu').removeClass('hidden');
        else if (os === 'android' || os === 'ios') {
            $('body').addClass('mobile-mode');
            $('.status-bar-mobile').removeClass('hidden');
            this.renderMobileScreens();
        }
    }

    renderMobileScreens() {
        // 生成手机的3个分屏
        for(let i=1; i<=3; i++) {
            const id = `screen-${i}`;
            $('#desktop-stage').append(`<div class="mobile-screen" id="${id}"></div>`);
            this.makeDroppable(`#${id}`);
        }
    }

    // === 图标管理 ===
    
    // 限制检查
    checkLimit(containerId) {
        const count = $(containerId).find('.app-icon').length;
        if (containerId.includes('screen') && count >= CONFIG.limits.mobileScreenMax) {
            alert("手机单屏已满！"); return false;
        }
        if (containerId === '#desktop-stage' && count >= CONFIG.limits.desktopMax) {
            alert("桌面图标已达上限！"); return false;
        }
        return true;
    }

    // 添加图标核心函数
    addIcon(id, name, iconClass, x, y, container, type='app', color=null) {
        if (!this.checkLimit(container)) return;

        const colorStyle = color ? `color:${color};` : '';
        const html = `
            <div class="app-icon" id="${id}" style="left:${x}px; top:${y}px" data-name="${name}" data-type="${type}" data-color="${color || ''}">
                <i class="${iconClass}" style="${colorStyle}"></i>
                <span>${name}</span>
            </div>
        `;
        $(container).append(html);
        
        // 绑定该图标的交互事件
        this.bindIconEvents(id);
    }

    bindIconEvents(id) {
        const el = $(`#${id}`);
        const isInsideFolder = el.parent().attr('id') === 'folder-content';

        // 文件夹内的图标不需要 absolute 拖拽
        if (!isInsideFolder) {
            el.draggable({
                containment: "parent",
                grid: [10, 10],
                scroll: false,
                start: function() { $(this).css('z-index', 100); },
                stop: function() { $(this).css('z-index', ''); }
            });
        }

        // 右键
        el.on('contextmenu', (e) => {
            e.stopPropagation(); 
            e.preventDefault();
            $('.app-icon').removeClass('selected'); 
            el.addClass('selected');
            $('#context-menu').data('target-id', id).css({top:e.pageY, left:e.pageX}).removeClass('hidden');
        });

        // 双击
        el.on('dblclick', () => {
            if (el.data('type') === 'folder') {
                this.openFolder(id, el.data('name'));
            } else {
                // 模拟打开动画
                el.animate({ opacity: 0.5 }, 100).animate({ opacity: 1 }, 100);
            }
        });
    }

    // === 拖拽逻辑 ===
    initToolDrag() {
        // 让侧边栏图标可拖拽
        $('.tool-icon').draggable({
            helper: function() {
                const icon = $(this).data('icon');
                const color = $(this).data('color');
                return $(`<div style="z-index:9999;width:50px;height:50px;background:white;border-radius:10px;display:flex;justify-content:center;align-items:center;box-shadow:0 5px 10px rgba(0,0,0,0.2)"><i class="${icon}" style="font-size:24px; color:${color}"></i></div>`);
            },
            appendTo: 'body',
            cursorAt: { top: 25, left: 25 },
            revert: 'invalid'
        });
    }

    makeDroppable(selector) {
        const self = this;
        $(selector).droppable({
            accept: '.tool-icon, .app-icon',
            drop: function(event, ui) {
                // 如果是内部移动 (已经存在于桌面上)，jQueryUI 会自动处理位置，不需要重新 addIcon
                if (ui.draggable.hasClass('app-icon')) return; 

                // 从侧边栏拖入
                const offset = $(this).offset();
                let left = event.pageX - offset.left + ($(this).scrollLeft() || 0);
                let top = event.pageY - offset.top;
                
                // 边界修正
                if (left < 0) left = 0; 
                if (top < 0) top = 0;

                const name = ui.draggable.data('name');
                const icon = ui.draggable.data('icon');
                const color = ui.draggable.data('color');
                const newId = 'icon-' + Date.now();
                
                self.addIcon(newId, name, icon, left, top, '#' + $(this).attr('id'), 'app', color);
            }
        });
    }

    initDragDrop() {
        this.makeDroppable('#desktop-stage');
    }

    // === 文件夹功能 ===
    initFolderWindow() {
        $('#btn-close-folder').click(() => {
            $('#folder-window').addClass('hidden');
            this.currentOpenFolderId = null;
        });

        // 允许拖入图标到文件夹窗口
        $('#folder-content').droppable({
            accept: '.tool-icon', 
            drop: (event, ui) => {
                if (ui.draggable.hasClass('tool-icon')) {
                    const name = ui.draggable.data('name');
                    const icon = ui.draggable.data('icon');
                    const color = ui.draggable.data('color');
                    const newId = 'in-folder-' + Date.now();

                    // UI 添加
                    this.addIcon(newId, name, icon, 0, 0, '#folder-content', 'app', color);
                    
                    // 数据保存
                    if (this.currentOpenFolderId) {
                        if (!this.folderData[this.currentOpenFolderId]) {
                            this.folderData[this.currentOpenFolderId] = [];
                        }
                        this.folderData[this.currentOpenFolderId].push({
                            id: newId, name, icon, color, type: 'app'
                        });
                    }
                }
            }
        });
    }

    openFolder(id, name) {
        this.currentOpenFolderId = id;
        $('#folder-title').text(name);
        $('#folder-window').removeClass('hidden');
        $('#folder-content').empty();
        
        // 从内存加载该文件夹的内容
        if (this.folderData[id]) {
            this.folderData[id].forEach(icon => {
                this.addIcon(icon.id, icon.name, icon.icon, 0, 0, '#folder-content', 'app', icon.color);
            });
        } else {
            this.folderData[id] = [];
        }
    }

    // === 右键菜单 ===
    initContextMenu() {
        // 背景右键
        $(document).on('contextmenu', '#desktop-area', (e) => {
            if ($(e.target).closest('.app-icon').length) return; // 图标右键单独处理
            e.preventDefault();
            $('#context-menu').data('target-id', null).css({top:e.pageY, left:e.pageX}).removeClass('hidden');
        });

        // 隐藏菜单
        $(document).on('click', () => $('#context-menu').addClass('hidden'));

        // 功能：新建文件夹
        $('#ctx-new-folder').click(() => {
            const menu = $('#context-menu');
            const offset = $('#desktop-stage').offset();
            let x = parseInt(menu.css('left')) - offset.left;
            let y = parseInt(menu.css('top')) - offset.top;
            
            // 防止负坐标
            if (x < 0) x = 20; if (y < 0) y = 20;

            const id = 'folder-' + Date.now();
            this.addIcon(id, 'New Folder', 'fa-solid fa-folder', x, y, '#desktop-stage', 'folder', null);
            this.folderData[id] = []; // 初始化数据
        });

        // 功能：重命名
        $('#ctx-rename').click(() => {
            const targetId = $('#context-menu').data('target-id');
            if(targetId) {
                const el = $(`#${targetId}`);
                const newName = prompt("Rename:", el.data('name'));
                if(newName) {
                    el.data('name', newName);
                    el.find('span').text(newName);
                }
            }
        });

        // 功能：删除
        $('#ctx-delete').click(() => {
            const targetId = $('#context-menu').data('target-id');
            if(targetId) {
                $(`#${targetId}`).remove();
                if(this.folderData[targetId]) delete this.folderData[targetId];
            }
        });
    }

    // === 数据存取 ===
    
    // 保存当前 UI 到内存对象
    saveToMemory(os) {
        if(!os) return;
        const icons = [];
        $('#desktop-stage .app-icon').each(function() {
            const el = $(this);
            icons.push({
                id: el.attr('id'),
                name: el.data('name'),
                icon: el.find('i').attr('class'),
                color: el.data('color'),
                x: parseFloat(el.css('left')),
                y: parseFloat(el.css('top')),
                type: el.data('type') || 'app',
                parent: el.parent().attr('id')
            });
        });
        
        // 还要保留之前的 is_public 状态（如果存在）
        let publicState = false;
        if(this.cachedLayouts[os] && this.cachedLayouts[os].is_public) {
            publicState = this.cachedLayouts[os].is_public;
        }

        this.cachedLayouts[os] = { 
            icons: icons, 
            folders: this.folderData,
            is_public: publicState
        };
    }

    // 导出给数据库 (auth.js 调用)
    exportLayout() {
        this.saveToMemory(this.currentOS);
        return this.cachedLayouts[this.currentOS];
    }
    
    // 从数据库加载 (auth.js 调用)
    loadLayout(data) {
        if(!data) return;
        this.cachedLayouts[this.currentOS] = data;
        
        // 恢复数据
        this.folderData = data.folders || {};
        
        // 恢复 UI
        $('#desktop-stage').empty();
        if(data.icons) {
            this.renderIcons(data.icons);
        }
    }
    
    // 辅助渲染
    renderIcons(icons) {
        icons.forEach(icon => {
            let container = '#' + icon.parent;
            // 容错：如果找不到父容器（比如切到PC但数据是Mobile的），放到默认层
            if ($(container).length === 0) container = '#desktop-stage';
            this.addIcon(icon.id, icon.name, icon.icon, icon.x, icon.y, container, icon.type, icon.color);
        });
    }
}

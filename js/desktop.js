// js/desktop.js
class DesktopManager {
    constructor() {
        this.currentOS = 'windows';
        this.cachedLayouts = { windows: [], macos: [], ubuntu: [], android: [], ios: [] };
        this.folderData = {}; // { "folder-id": [iconObj, iconObj...] }
        this.currentOpenFolderId = null;
        
        this.init();
    }

    init() {
        this.initDragDrop();
        this.initContextMenu();
        this.initFolderWindow();
        this.switchOS('windows');
        
        $(document).on('click', '.cat-title', function() {
            $(this).parent().toggleClass('collapsed');
        });
    }

    switchOS(osName) {
        this.saveToMemory(this.currentOS);
        this.currentOS = osName;
        
        $('#desktop-area').removeClass().addClass(`os-${osName}`).css('background-image', CONFIG.wallpapers[osName]);
        this.updateSystemUI(osName);
        this.renderSidebar(osName);

        $('#desktop-stage').empty();
        const cached = this.cachedLayouts[osName];
        
        if (cached && cached.length > 0) {
            this.renderIcons(cached);
        } else {
            // 加载默认图标
            const defaults = CONFIG.defaultIcons[osName] || [];
            defaults.forEach(icon => {
                const id = 'def-' + Date.now() + Math.random();
                this.addIcon(id, icon.name, icon.icon, icon.x, icon.y, '#desktop-stage', 'app', icon.color);
            });
            if (window.loadCloudDesktop) window.loadCloudDesktop();
        }
    }

    renderSidebar(os) {
        const tools = getToolsForOS(os);
        const container = $('#dynamic-toolbox');
        container.empty();

        tools.forEach((cat, index) => {
            let itemsHtml = '';
            cat.items.forEach(tool => {
                // 侧边栏图标直接显示颜色
                itemsHtml += `
                    <div class="tool-icon" data-name="${tool.name}" data-icon="${tool.icon}" data-color="${tool.color || '#555'}">
                        <i class="${tool.icon}" style="color:${tool.color || '#555'}"></i>
                        <span>${tool.name}</span>
                    </div>
                `;
            });

            const html = `
                <div class="category ${index === 0 ? '' : 'collapsed'}"> 
                    <div class="cat-title">${cat.title}</div>
                    <div class="cat-content">${itemsHtml}</div>
                </div>
            `;
            container.append(html);
        });

        this.initToolDrag();
    }

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
        for(let i=1; i<=3; i++) {
            const id = `screen-${i}`;
            $('#desktop-stage').append(`<div class="mobile-screen" id="${id}"></div>`);
            this.makeDroppable(`#${id}`);
        }
    }

    checkLimit(containerId) {
        const isMobile = $('body').hasClass('mobile-mode');
        const count = $(containerId).find('.app-icon').length;
        
        if (containerId.includes('screen') && count >= CONFIG.limits.mobileScreenMax) {
            alert(`手机单屏最多放 ${CONFIG.limits.mobileScreenMax} 个应用！`);
            return false;
        }
        if (containerId === '#desktop-stage' && count >= CONFIG.limits.desktopMax) {
            alert(`桌面最多放 ${CONFIG.limits.desktopMax} 个图标！`);
            return false;
        }
        if (containerId === '#folder-content' && count >= CONFIG.limits.folderMax) {
            alert(`文件夹最多放 ${CONFIG.limits.folderMax} 个图标！`);
            return false;
        }
        return true;
    }

    // color 参数默认 undefined，如果不传则不设置颜色
    addIcon(id, name, iconClass, x, y, container, type='app', color=null) {
        if (!this.checkLimit(container)) return;

        // 构建颜色样式字符串
        const colorStyle = color ? `color:${color};` : '';

        const html = `
            <div class="app-icon" id="${id}" style="left:${x}px; top:${y}px" data-name="${name}" data-type="${type}" data-color="${color || ''}">
                <i class="${iconClass}" style="${colorStyle}"></i>
                <span>${name}</span>
            </div>
        `;
        $(container).append(html);
        this.bindIconEvents(id);
    }

    bindIconEvents(id) {
        const el = $(`#${id}`);
        
        // 文件夹内的图标不需要 absolute 拖拽，只需要 sorting (这里简化为不可拖出)
        const isInsideFolder = el.parent().attr('id') === 'folder-content';

        if (!isInsideFolder) {
            el.draggable({
                containment: "parent",
                grid: [10, 10],
                scroll: false,
                start: function() { $(this).css('z-index', 100); },
                stop: function() { $(this).css('z-index', ''); }
            });
        }

        el.on('contextmenu', (e) => {
            e.stopPropagation();
            e.preventDefault();
            $('.app-icon').removeClass('selected');
            el.addClass('selected');
            $('#context-menu').data('target-id', id).css({top:e.pageY, left:e.pageX}).removeClass('hidden');
        });

        el.on('dblclick', () => {
            if (el.data('type') === 'folder') {
                this.openFolder(id, el.data('name'));
            } else {
                // 模拟打开效果
                el.animate({ opacity: 0.5 }, 100).animate({ opacity: 1 }, 100);
            }
        });
    }

    initToolDrag() {
        $('.tool-icon').draggable({
            helper: function() {
                const icon = $(this).data('icon');
                const color = $(this).data('color');
                // 拖拽时 Helper 也显示颜色
                return $(`<div style="z-index:9999;width:50px;height:50px;background:white;border-radius:10px;display:flex;justify-content:center;align-items:center;box-shadow:0 5px 10px rgba(0,0,0,0.2)"><i class="${icon}" style="font-size:24px; color:${color}"></i></div>`);
            },
            appendTo: 'body',
            cursorAt: { top: 25, left: 25 },
            revert: 'invalid'
        });
    }

    initDragDrop() {
        this.makeDroppable('#desktop-stage');
    }

    makeDroppable(selector) {
        const self = this;
        $(selector).droppable({
            accept: '.tool-icon, .app-icon',
            drop: function(event, ui) {
                if (ui.draggable.hasClass('app-icon')) return; // 内部移动略

                const offset = $(this).offset();
                let left = event.pageX - offset.left + ($(this).scrollLeft() || 0);
                let top = event.pageY - offset.top;
                
                if (left < 0) left = 0; if (top < 0) top = 0;

                const name = ui.draggable.data('name');
                const icon = ui.draggable.data('icon');
                const color = ui.draggable.data('color'); // 获取颜色
                const newId = 'icon-' + Date.now();
                
                // 将颜色传入 addIcon
                self.addIcon(newId, name, icon, left, top, '#' + $(this).attr('id'), 'app', color);
            }
        });
    }

    // === 文件夹功能修正 ===
    initFolderWindow() {
        $('#btn-close-folder').click(() => {
            $('#folder-window').addClass('hidden');
            this.currentOpenFolderId = null;
        });

        $('#folder-content').droppable({
            accept: '.tool-icon', 
            drop: (event, ui) => {
                if (ui.draggable.hasClass('tool-icon')) {
                    const name = ui.draggable.data('name');
                    const icon = ui.draggable.data('icon');
                    const color = ui.draggable.data('color');
                    const newId = 'in-folder-' + Date.now();

                    // 1. 在界面上添加
                    this.addIcon(newId, name, icon, 0, 0, '#folder-content', 'app', color);
                    
                    // 2. 关键修复：同步保存到 folderData
                    if (this.currentOpenFolderId) {
                        if (!this.folderData[this.currentOpenFolderId]) {
                            this.folderData[this.currentOpenFolderId] = [];
                        }
                        this.folderData[this.currentOpenFolderId].push({
                            id: newId,
                            name: name,
                            icon: icon,
                            color: color,
                            type: 'app'
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
        
        // 从内存加载图标
        if (this.folderData[id]) {
            this.folderData[id].forEach(icon => {
                this.addIcon(icon.id, icon.name, icon.icon, 0, 0, '#folder-content', 'app', icon.color);
            });
        } else {
            this.folderData[id] = [];
        }
    }

    // === 数据保存与加载 ===
    initContextMenu() {
        // ... (保持原样，略) ...
        $(document).on('contextmenu', '#desktop-area', (e) => {
            if ($(e.target).closest('.app-icon').length) return;
            e.preventDefault();
            $('#context-menu').data('target-id', null).css({top:e.pageY, left:e.pageX}).removeClass('hidden');
        });

        $(document).on('click', () => $('#context-menu').addClass('hidden'));

        $('#ctx-new-folder').click(() => {
            const menu = $('#context-menu');
            const offset = $('#desktop-stage').offset();
            let x = parseInt(menu.css('left')) - offset.left;
            let y = parseInt(menu.css('top')) - offset.top;
            if (x < 0) x = 20; if (y < 0) y = 20;

            const id = 'folder-' + Date.now();
            // 文件夹图标默认金色
            this.addIcon(id, '新建文件夹', 'fa-solid fa-folder', x, y, '#desktop-stage', 'folder', null);
            this.folderData[id] = [];
        });

        $('#ctx-rename').click(() => {
            const targetId = $('#context-menu').data('target-id');
            if (targetId) {
                const el = $(`#${targetId}`);
                const newName = prompt("重命名为：", el.data('name'));
                if (newName) {
                    el.data('name', newName);
                    el.find('span').text(newName);
                    // 如果是文件夹，还需要更新 folderData 里的引用吗？目前不需要，因为 folderData 是按 ID 存的
                }
            }
        });
        
        $('#ctx-delete').click(() => {
            const targetId = $('#context-menu').data('target-id');
            if (targetId) {
                $(`#${targetId}`).remove();
                if (this.folderData[targetId]) delete this.folderData[targetId];
                
                // 如果是在文件夹里删除了图标，也需要更新数据（这里暂略复杂逻辑，用户目前只能在外面删）
            }
        });
    }

    saveToMemory(os) {
        const icons = [];
        $('#desktop-stage .app-icon').each(function() {
            const el = $(this);
            icons.push({
                id: el.attr('id'),
                name: el.data('name'),
                icon: el.find('i').attr('class'),
                color: el.data('color'), // 保存颜色
                x: parseFloat(el.css('left')),
                y: parseFloat(el.css('top')),
                type: el.data('type') || 'app',
                parent: el.parent().attr('id')
            });
        });
        this.cachedLayouts[os] = icons;
        // 真实场景还需要把 this.folderData 也存到 layout_data 里
        // 这里仅演示内存逻辑，Supabase 保存逻辑在 auth.js，需要修改 saveDesktopData 传入 folderData
    }

    renderIcons(icons) {
        icons.forEach(icon => {
            let container = '#' + icon.parent;
            if ($(container).length === 0) container = '#desktop-stage';
            this.addIcon(icon.id, icon.name, icon.icon, icon.x, icon.y, container, icon.type, icon.color);
        });
    }
}

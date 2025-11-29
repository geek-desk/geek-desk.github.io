// js/desktop.js
class DesktopManager {
    constructor() {
        this.currentOS = 'windows';
        this.cachedLayouts = { windows: null, macos: null, ubuntu: null, android: null, ios: null };
        this.init();
    }

    init() {
        this.folderData = {}; // 当前运行时的文件夹数据 { "folder-id": [...] }
        this.currentOpenFolderId = null;

        this.initDragDrop();
        this.initContextMenu();
        this.initFolderWindow();
        this.switchOS('windows');

        $(document).on('click', '.cat-title', function() {
            $(this).parent().toggleClass('collapsed');
        });
    }

    switchOS(osName) {
        // 1. 保存当前状态到内存
        this.saveToMemory(this.currentOS);

        this.currentOS = osName;
        $('#desktop-area').removeClass().addClass(`os-${osName}`).css('background-image', CONFIG.wallpapers[osName]);
        this.updateSystemUI(osName);
        this.renderSidebar(osName);

        $('#desktop-stage').empty();
        
        // 2. 从内存或默认配置加载
        const cached = this.cachedLayouts[osName];
        if (cached) {
            // 恢复该系统的文件夹数据
            this.folderData = cached.folders || {}; 
            this.renderIcons(cached.icons);
        } else {
            // 首次加载
            this.folderData = {};
            const defaults = CONFIG.defaultIcons[osName] || [];
            defaults.forEach(icon => {
                const id = 'def-' + Date.now() + Math.random();
                this.addIcon(id, icon.name, icon.icon, icon.x, icon.y, '#desktop-stage', 'app', icon.color);
            });
            // 尝试云端加载
            if (window.loadCloudDesktop) window.loadCloudDesktop();
        }
    }

    // === 核心逻辑：导出完整状态（图标 + 文件夹） ===
    exportLayout() {
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
        
        // 返回包含图标和文件夹数据的对象
        return {
            icons: icons,
            folders: this.folderData
        };
    }

    saveToMemory(os) {
        if(!os) return;
        this.cachedLayouts[os] = this.exportLayout();
    }

    // 供 auth.js 调用：从云端 JSON 恢复桌面
    loadLayout(data) {
        if (!data) return;
        // 更新内存缓存
        this.cachedLayouts[this.currentOS] = data;
        
        // 立即渲染
        this.folderData = data.folders || {};
        $('#desktop-stage').empty();
        if (data.icons) {
            this.renderIcons(data.icons);
        }
    }

    renderIcons(icons) {
        icons.forEach(icon => {
            let container = '#' + icon.parent;
            if ($(container).length === 0) container = '#desktop-stage';
            this.addIcon(icon.id, icon.name, icon.icon, icon.x, icon.y, container, icon.type, icon.color);
        });
    }

    // === 图标添加与交互 ===
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
        this.bindIconEvents(id);
    }

    bindIconEvents(id) {
        const el = $(`#${id}`);
        const isInsideFolder = el.parent().attr('id') === 'folder-content';

        if (!isInsideFolder) {
            el.draggable({
                containment: "parent", grid: [10, 10], scroll: false,
                start: function() { $(this).css('z-index', 100); },
                stop: function() { $(this).css('z-index', ''); }
            });
        }

        el.on('contextmenu', (e) => {
            e.stopPropagation(); e.preventDefault();
            $('.app-icon').removeClass('selected'); el.addClass('selected');
            $('#context-menu').data('target-id', id).css({top:e.pageY, left:e.pageX}).removeClass('hidden');
        });

        el.on('dblclick', () => {
            if (el.data('type') === 'folder') {
                this.openFolder(id, el.data('name'));
            } else {
                el.animate({ opacity: 0.5 }, 100).animate({ opacity: 1 }, 100);
            }
        });
    }

    // === 文件夹功能 ===
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

                    this.addIcon(newId, name, icon, 0, 0, '#folder-content', 'app', color);
                    
                    if (this.currentOpenFolderId) {
                        if (!this.folderData[this.currentOpenFolderId]) this.folderData[this.currentOpenFolderId] = [];
                        this.folderData[this.currentOpenFolderId].push({ id: newId, name, icon, color, type: 'app' });
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
        
        if (this.folderData[id]) {
            this.folderData[id].forEach(icon => {
                this.addIcon(icon.id, icon.name, icon.icon, 0, 0, '#folder-content', 'app', icon.color);
            });
        } else {
            this.folderData[id] = [];
        }
    }

    // === 系统UI与工具 ===
    renderSidebar(os) {
        const tools = getToolsForOS(os);
        const container = $('#dynamic-toolbox');
        container.empty();
        tools.forEach((cat, index) => {
            let itemsHtml = '';
            cat.items.forEach(tool => {
                itemsHtml += `
                    <div class="tool-icon" data-name="${tool.name}" data-icon="${tool.icon}" data-color="${tool.color || '#555'}">
                        <i class="${tool.icon}" style="color:${tool.color || '#555'}"></i>
                        <span>${tool.name}</span>
                    </div>
                `;
            });
            container.append(`<div class="category ${index === 0 ? '' : 'collapsed'}"><div class="cat-title">${cat.title}</div><div class="cat-content">${itemsHtml}</div></div>`);
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
        const count = $(containerId).find('.app-icon').length;
        if (containerId.includes('screen') && count >= CONFIG.limits.mobileScreenMax) {
            alert("手机单屏已满！"); return false;
        }
        if (containerId === '#desktop-stage' && count >= CONFIG.limits.desktopMax) {
            alert("桌面图标已达上限！"); return false;
        }
        return true;
    }

    initToolDrag() {
        $('.tool-icon').draggable({
            helper: function() {
                const icon = $(this).data('icon');
                const color = $(this).data('color');
                return $(`<div style="z-index:9999;width:50px;height:50px;background:white;border-radius:10px;display:flex;justify-content:center;align-items:center;box-shadow:0 5px 10px rgba(0,0,0,0.2)"><i class="${icon}" style="font-size:24px; color:${color}"></i></div>`);
            },
            appendTo: 'body', cursorAt: { top: 25, left: 25 }, revert: 'invalid'
        });
    }

    makeDroppable(selector) {
        const self = this;
        $(selector).droppable({
            accept: '.tool-icon, .app-icon',
            drop: function(event, ui) {
                if (ui.draggable.hasClass('app-icon')) return; 
                const offset = $(this).offset();
                let left = event.pageX - offset.left + ($(this).scrollLeft() || 0);
                let top = event.pageY - offset.top;
                if (left < 0) left = 0; if (top < 0) top = 0;
                
                const name = ui.draggable.data('name');
                const icon = ui.draggable.data('icon');
                const color = ui.draggable.data('color');
                self.addIcon('icon-' + Date.now(), name, icon, left, top, '#' + $(this).attr('id'), 'app', color);
            }
        });
    }

    initDragDrop() { this.makeDroppable('#desktop-stage'); }
    
    initContextMenu() {
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
            this.addIcon(id, '新建文件夹', 'fa-solid fa-folder', x, y, '#desktop-stage', 'folder', null);
            this.folderData[id] = [];
        });

        $('#ctx-rename').click(() => {
            const targetId = $('#context-menu').data('target-id');
            if(targetId) {
                const newName = prompt("重命名为：");
                if(newName) $(`#${targetId}`).data('name', newName).find('span').text(newName);
            }
        });

        $('#ctx-delete').click(() => {
            const targetId = $('#context-menu').data('target-id');
            if(targetId) {
                $(`#${targetId}`).remove();
                if(this.folderData[targetId]) delete this.folderData[targetId];
            }
        });
    }
}

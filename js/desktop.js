// js/desktop.js
class DesktopManager {
    constructor() {
        this.currentOS = 'windows';
        this.cachedLayouts = { windows: [], macos: [], ubuntu: [], android: [], ios: [] };
        // 记录文件夹数据: { "folder-id": [icon1, icon2...] }
        this.folderData = {}; 
        this.currentOpenFolderId = null; // 当前打开的文件夹ID
        
        this.init();
    }

    init() {
        this.initDragDrop(); // 桌面拖拽
        this.initContextMenu();
        this.initFolderWindow(); // 初始化文件夹窗口逻辑
        this.switchOS('windows'); // 启动
        
        // 侧边栏折叠逻辑
        $(document).on('click', '.cat-title', function() {
            $(this).parent().toggleClass('collapsed');
        });
    }

    switchOS(osName) {
        this.saveToMemory(this.currentOS);
        this.currentOS = osName;
        
        // 1. 更新壁纸和样式
        $('#desktop-area').removeClass().addClass(`os-${osName}`).css('background-image', CONFIG.wallpapers[osName]);
        
        // 2. 更新系统 UI (Dock, Taskbar)
        this.updateSystemUI(osName);
        
        // 3. 动态渲染右侧工具栏
        this.renderSidebar(osName);

        // 4. 渲染桌面图标
        $('#desktop-stage').empty();
        const cached = this.cachedLayouts[osName];
        
        if (cached && cached.length > 0) {
            this.renderIcons(cached);
        } else {
            // 首次加载，使用 Config 中的默认图标
            const defaults = CONFIG.defaultIcons[osName] || [];
            defaults.forEach(icon => {
                const id = 'def-' + Date.now() + Math.random();
                this.addIcon(id, icon.name, icon.icon, icon.x, icon.y, '#desktop-stage');
            });
            if (window.loadCloudDesktop) window.loadCloudDesktop();
        }
    }

    // === 动态渲染侧边栏 ===
    renderSidebar(os) {
        const tools = getToolsForOS(os);
        const container = $('#dynamic-toolbox');
        container.empty();

        tools.forEach((cat, index) => {
            let itemsHtml = '';
            cat.items.forEach(tool => {
                itemsHtml += `
                    <div class="tool-icon" data-name="${tool.name}" data-icon="${tool.icon}">
                        <i class="${tool.icon}"></i>
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

        // 重新绑定侧边栏图标的拖拽事件
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

    // === 图标管理 ===
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

    addIcon(id, name, iconClass, x, y, container, type='app') {
        if (!this.checkLimit(container)) return;

        const html = `
            <div class="app-icon" id="${id}" style="left:${x}px; top:${y}px" data-name="${name}" data-type="${type}">
                <i class="${iconClass}"></i>
                <span>${name}</span>
            </div>
        `;
        $(container).append(html);
        
        // 绑定拖拽
        this.bindIconEvents(id);
    }

    bindIconEvents(id) {
        const el = $(`#${id}`);
        
        el.draggable({
            containment: "parent",
            grid: [10, 10],
            scroll: false,
            start: function() { $(this).css('z-index', 100); },
            stop: function() { $(this).css('z-index', ''); }
        });

        el.on('contextmenu', (e) => {
            e.stopPropagation();
            e.preventDefault();
            // 选中当前图标
            $('.app-icon').removeClass('selected');
            el.addClass('selected');
            
            // 如果是右键文件夹，改变菜单选项（暂略，用通用菜单）
            $('#context-menu').data('target-id', id).css({top:e.pageY, left:e.pageX}).removeClass('hidden');
        });

        // 双击打开文件夹
        el.on('dblclick', () => {
            if (el.data('type') === 'folder') {
                this.openFolder(id, el.data('name'));
            } else {
                // 模拟打开应用动画
                el.animate({ width: '60px', opacity: 0.5 }, 100).animate({ width: '70px', opacity: 1 }, 100);
            }
        });
    }

    // === 拖拽逻辑 ===
    initToolDrag() {
        $('.tool-icon').draggable({
            helper: function() {
                const icon = $(this).data('icon');
                return $(`<div style="z-index:9999;width:50px;height:50px;background:white;border-radius:10px;display:flex;justify-content:center;align-items:center;box-shadow:0 5px 10px rgba(0,0,0,0.2)"><i class="${icon}" style="font-size:24px;"></i></div>`);
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
                // 如果是内部拖拽，jQuery UI 已处理位置，只需更新数据结构（如果是跨文件夹拖拽需要额外处理，这里暂略）
                if (ui.draggable.hasClass('app-icon')) {
                     // 已经在桌面上了，不做额外处理，只让它移动
                     return;
                }

                // 从工具栏拖入
                const offset = $(this).offset();
                let left = event.pageX - offset.left + ($(this).scrollLeft() || 0);
                let top = event.pageY - offset.top;
                
                // 边界修正
                if (left < 0) left = 0; if (top < 0) top = 0;

                const name = ui.draggable.data('name');
                const icon = ui.draggable.data('icon');
                const newId = 'icon-' + Date.now();
                
                self.addIcon(newId, name, icon, left, top, '#' + $(this).attr('id'));
            }
        });
    }

    // === 文件夹功能 ===
    initFolderWindow() {
        // 关闭按钮
        $('#btn-close-folder').click(() => {
            $('#folder-window').addClass('hidden');
            this.currentOpenFolderId = null;
        });

        // 文件夹内容区域可放置
        $('#folder-content').droppable({
            accept: '.tool-icon', // 暂时只允许从工具栏拖入，如果要允许从桌面拖入需要更复杂逻辑
            drop: (event, ui) => {
                if (ui.draggable.hasClass('tool-icon')) {
                    const name = ui.draggable.data('name');
                    const icon = ui.draggable.data('icon');
                    // 文件夹内图标自动排列，不需要坐标 (使用 CSS Grid/Flex 自动排)
                    // 但为了统一 addIcon 接口，先给个 0,0，然后 CSS position: relative 覆盖
                    this.addIcon('in-folder-'+Date.now(), name, icon, 0, 0, '#folder-content');
                    // 修正样式
                    $('#folder-content .app-icon').css({position:'relative', left:'auto', top:'auto'});
                }
            }
        });
    }

    openFolder(id, name) {
        this.currentOpenFolderId = id;
        $('#folder-title').text(name);
        $('#folder-window').removeClass('hidden');
        $('#folder-content').empty(); // 实际应该从 this.folderData[id] 加载
        
        // 这里简化：每次打开是空的，演示“放入”功能
        // 真实项目需要把 folderData 存入 Supabase JSON
        if (this.folderData[id]) {
            this.folderData[id].forEach(icon => {
                this.addIcon(icon.id, icon.name, icon.icon, 0, 0, '#folder-content');
            });
             $('#folder-content .app-icon').css({position:'relative', left:'auto', top:'auto'});
        }
    }

    // === 右键菜单逻辑 ===
    initContextMenu() {
        // 绑定桌面右键
        $(document).on('contextmenu', '#desktop-area', (e) => {
            if ($(e.target).closest('.app-icon').length) return; // 如果点在图标上，在 bindIconEvents 里处理
            e.preventDefault();
            $('#context-menu').data('target-id', null).css({top:e.pageY, left:e.pageX}).removeClass('hidden');
        });

        $(document).on('click', () => $('#context-menu').addClass('hidden'));

        // 新建文件夹
        $('#ctx-new-folder').click(() => {
            const menu = $('#context-menu');
            const offset = $('#desktop-stage').offset();
            // 计算在桌面的相对位置
            let x = parseInt(menu.css('left')) - offset.left;
            let y = parseInt(menu.css('top')) - offset.top;
            
            if (x < 0) x = 20; if (y < 0) y = 20;

            const id = 'folder-' + Date.now();
            this.addIcon(id, '新建文件夹', 'fa-solid fa-folder', x, y, '#desktop-stage', 'folder');
            this.folderData[id] = []; // 初始化数据
        });

        // 重命名
        $('#ctx-rename').click(() => {
            const targetId = $('#context-menu').data('target-id');
            if (!targetId) return alert("请先右键点击一个图标");
            
            const el = $(`#${targetId}`);
            const oldName = el.data('name');
            const newName = prompt("重命名为：", oldName);
            
            if (newName && newName.trim() !== "") {
                el.data('name', newName);
                el.find('span').text(newName);
            }
        });
        
        // 删除
        $('#ctx-delete').click(() => {
            const targetId = $('#context-menu').data('target-id');
            if (targetId) {
                $(`#${targetId}`).remove();
                // 如果是文件夹，也删数据
                if (this.folderData[targetId]) delete this.folderData[targetId];
            }
        });
    }

    // === 保存/加载 (适配 Config) ===
    saveToMemory(os) {
        // 导出时，除了位置，还要保存 folderData
        // 简化版：仅导出桌面图标
        const icons = [];
        $('#desktop-stage .app-icon').each(function() {
            const el = $(this);
            icons.push({
                id: el.attr('id'),
                name: el.data('name'),
                icon: el.find('i').attr('class'),
                x: parseFloat(el.css('left')),
                y: parseFloat(el.css('top')),
                type: el.data('type') || 'app',
                parent: el.parent().attr('id')
            });
        });
        this.cachedLayouts[os] = icons;
    }

    renderIcons(icons) {
        icons.forEach(icon => {
            let container = '#' + icon.parent;
            if ($(container).length === 0) container = '#desktop-stage';
            this.addIcon(icon.id, icon.name, icon.icon, icon.x, icon.y, container, icon.type);
        });
    }
}

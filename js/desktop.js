// js/desktop.js
class DesktopManager {
    constructor() {
        this.currentOS = 'windows';
        
        // 内存缓存：用于在没保存到数据库前，在不同系统间切换时不丢失图标
        this.cachedLayouts = {
            windows: [],
            macos: [],
            ubuntu: [],
            android: [],
            ios: []
        };
        
        this.init();
    }

    init() {
        this.initDragDrop();
        this.initContextMenu();
        this.initDoubleClick(); // 新增双击功能
    }

    // 切换操作系统
    switchOS(osName) {
        // 1. 保存当前系统的状态到内存缓存
        this.saveToMemory(this.currentOS);

        // 2. 更新当前系统标记
        this.currentOS = osName;
        console.log("切换系统至:", osName);

        // 3. UI 更新
        $('#desktop-area').css('background-image', CONFIG.wallpapers[osName] || 'none');
        
        // 4. 清空舞台
        $('#desktop-stage').empty();

        // 5. 渲染新环境
        if (['android', 'ios'].includes(osName)) {
            $('body').addClass('mobile-mode');
            this.renderMobileScreens();
        } else {
            $('body').removeClass('mobile-mode');
        }

        // 6. 从内存恢复图标 (如果内存有数据，优先用内存的；内存空则说明是第一次加载)
        // 注意：loadCloudDesktop 会覆盖这个，所以逻辑是：切换时先显示内存的，随后异步请求云端如果没有改动则保持
        const cachedIcons = this.cachedLayouts[osName];
        if (cachedIcons && cachedIcons.length > 0) {
            this.renderIconsFromData(cachedIcons);
        } else {
            // 如果内存是空的，且是电脑系统，加个默认图标
            if (!['android', 'ios'].includes(osName)) {
                this.addIcon('my-computer', '我的电脑', 'fa-desktop', 20, 20, '#desktop-stage');
            }
            // 尝试触发云端加载 (app.js 或 auth.js 会调用)
            if (window.loadCloudDesktop) window.loadCloudDesktop();
        }
    }

    // 将当前屏幕上的图标保存到 cachedLayouts
    saveToMemory(os) {
        const layout = this.exportLayout();
        this.cachedLayouts[os] = layout.icons;
    }

    // 渲染手机的3个分屏
    renderMobileScreens() {
        for(let i=1; i<=3; i++) {
            const screenHtml = `<div class="mobile-screen" id="screen-${i}" data-index="${i}"></div>`;
            $('#desktop-stage').append(screenHtml);
            this.makeDroppable(`#screen-${i}`);
        }
    }

    // 初始化拖拽
    initDragDrop() {
        // 工具栏图标源
        $('.tool-icon').draggable({
            helper: function() {
                // 拖拽时显示一个克隆的图标，样式简化
                const clone = $(this).clone();
                clone.css({ width: '60px', height: '60px', opacity: 0.8, zIndex: 1000 });
                return clone;
            },
            appendTo: 'body',
            zIndex: 1000,
            cursorAt: { top: 30, left: 30 },
            revert: 'invalid'
        });

        this.makeDroppable('#desktop-stage');
    }

    makeDroppable(selector) {
        const self = this;
        $(selector).droppable({
            accept: '.tool-icon, .app-icon',
            drop: function(event, ui) {
                // 计算相对坐标
                const containerOffset = $(this).offset();
                // 考虑滚动条（手机分屏可能有滚动）
                const scrollLeft = $(this).scrollLeft() || 0;
                
                let left = event.pageX - containerOffset.left + scrollLeft;
                let top = event.pageY - containerOffset.top;

                // 边界保护
                if (left < 0) left = 0;
                if (top < 0) top = 0;

                // 新图标 vs 移动现有图标
                if (ui.draggable.hasClass('tool-icon')) {
                    const name = ui.draggable.data('name');
                    const iconClass = ui.draggable.data('icon');
                    const newId = 'icon-' + Date.now();
                    self.addIcon(newId, name, iconClass, left, top, '#' + $(this).attr('id'));
                } else {
                    const draggedItem = ui.draggable;
                    // 如果跨容器拖拽（比如手机屏幕1拖到屏幕2），需要 appendTo
                    draggedItem.appendTo($(this));
                    draggedItem.css({ left: left, top: top });
                }
            }
        });
    }

    addIcon(id, name, iconClass, x, y, containerSelector) {
        if(!iconClass) iconClass = 'fa-cube';
        
        // 修正：确保 y 坐标不小于 0 (因为 desktop-stage 现在有 padding-top， CSS left/top 是相对于 padding box 的左上角)
        // jQuery UI draggable 使用 absolute，相对于 positioned parent。
        // 父级 padding-top 可能会影响视觉。
        // 我们直接 append，css top 设置为相对数值。
        
        const html = `
            <div class="app-icon" id="${id}" style="left:${x}px; top:${y}px" data-name="${name}">
                <i class="fa-solid ${iconClass}"></i>
                <span>${name}</span>
            </div>
        `;
        $(containerSelector).append(html);

        $(`#${id}`).draggable({
            containment: "parent", 
            grid: [10, 10],
            scroll: false // 防止拖拽触发滚动条乱跳
        });
        
        // 阻止事件冒泡防止触发背景右键
        $(`#${id}`).on('contextmenu', (e) => e.stopPropagation());
    }

    // 双击打开应用 (增加游戏感)
    initDoubleClick() {
        $(document).on('dblclick', '.app-icon', function() {
            const name = $(this).data('name');
            alert(`正在启动 【${name}】...\n(这是一个模拟功能)`);
        });
        // 手机端双击模拟 (jQuery mobile event needed usually, but standard dblclick works on some)
    }

    initContextMenu() {
        $(document).on('contextmenu', '#desktop-area', function(e) {
            if($(e.target).closest('.app-icon').length) return; // 如果点在图标上忽略
            e.preventDefault();
            $('#context-menu').css({ top: e.pageY, left: e.pageX }).removeClass('hidden');
        });
        
        $(document).on('click', () => $('#context-menu').addClass('hidden'));
        
        $('#ctx-refresh').click(() => {
            $('#desktop-stage').fadeOut(100).fadeIn(100);
        });
        
        $('#ctx-delete').click(() => {
             // 简单的删除逻辑：删除最后添加的一个，或者做一个选中状态
             alert("请尝试将图标拖出屏幕外来删除 (开发中)");
        });
    }

    exportLayout() {
        const icons = [];
        $('.app-icon').each(function() {
            const el = $(this);
            const parentId = el.parent().attr('id');
            icons.push({
                id: el.attr('id'),
                name: el.data('name'),
                iconClass: el.find('i').attr('class').replace('fa-solid ', ''), 
                left: parseFloat(el.css('left')),
                top: parseFloat(el.css('top')),
                parent: parentId
            });
        });
        return { icons: icons };
    }

    // 供 loadCloudDesktop 或 switchOS 调用
    loadLayout(data) {
        if (!data || !data.icons) return;
        // 更新内存缓存
        // 注意：这里我们假设 loadLayout 是加载当前 OS 的数据
        this.cachedLayouts[this.currentOS] = data.icons;
        this.renderIconsFromData(data.icons);
    }

    renderIconsFromData(icons) {
        // 先清空
        $('.app-icon').remove();
        
        icons.forEach(item => {
            let container = '#' + item.parent;
            if ($(container).length === 0) container = '#desktop-stage';
            this.addIcon(item.id, item.name, item.iconClass, item.left, item.top, container);
        });
    }
}

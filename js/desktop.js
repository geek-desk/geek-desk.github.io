// js/desktop.js
class DesktopManager {
    constructor() {
        this.currentOS = 'windows';
        this.cachedLayouts = { windows: [], macos: [], ubuntu: [], android: [], ios: [] };
        this.init();
    }

    init() {
        this.initDragDrop();
        this.initContextMenu();
        // 初始显示 Windows UI
        this.updateSystemUI('windows');
    }

    switchOS(osName) {
        // 保存旧的
        this.saveToMemory(this.currentOS);

        this.currentOS = osName;
        console.log("切换系统至:", osName);

        // 更新壁纸
        $('#desktop-area').css('background-image', CONFIG.wallpapers[osName] || 'none');
        
        // 更新 UI 显隐 (Taskbar, Dock, Phone Frame)
        this.updateSystemUI(osName);

        // 清空并重新渲染图标
        $('#desktop-stage').empty();
        
        // 内存恢复逻辑
        const cachedIcons = this.cachedLayouts[osName];
        if (cachedIcons && cachedIcons.length > 0) {
            this.renderIconsFromData(cachedIcons);
        } else {
            // 默认图标
            if (!['android', 'ios'].includes(osName)) {
                this.addIcon('my-computer', '我的电脑', 'fa-desktop', 20, 20, '#desktop-stage');
            }
            if (window.loadCloudDesktop) window.loadCloudDesktop();
        }
    }

    // 控制系统拟真 UI 的显示与隐藏
    updateSystemUI(os) {
        // 1. 隐藏所有特定 UI
        $('.sys-ui').addClass('hidden');
        $('body').removeClass('mobile-mode');

        // 2. 根据系统显示
        if (os === 'windows') {
            $('.taskbar-win11').removeClass('hidden');
        } 
        else if (os === 'macos') {
            $('.dock-macos').removeClass('hidden');
        }
        else if (os === 'android' || os === 'ios') {
            $('body').addClass('mobile-mode');
            $('.status-bar-mobile').removeClass('hidden');
            this.renderMobileScreens();
        }
    }

    renderMobileScreens() {
        // 渲染 3 个手机屏
        for(let i=1; i<=3; i++) {
            $('#desktop-stage').append(`<div class="mobile-screen" id="screen-${i}"></div>`);
            this.makeDroppable(`#screen-${i}`);
        }
    }

    // === 解决问题2：拖动不流畅 ===
    initDragDrop() {
        // 工具栏图标拖出
        $('.tool-icon').draggable({
            // 使用 clone 但简化 DOM，减少重绘负担
            helper: function() {
                const iconClass = $(this).data('icon');
                const name = $(this).data('name');
                return $(`
                    <div style="width:60px; height:60px; background:rgba(255,255,255,0.8); border-radius:10px; display:flex; justify-content:center; align-items:center; z-index:9999; box-shadow:0 5px 15px rgba(0,0,0,0.2);">
                        <i class="fa-solid ${iconClass}" style="font-size:30px; color:#333;"></i>
                    </div>
                `);
            },
            appendTo: 'body',
            cursor: 'grabbing',
            cursorAt: { top: 30, left: 30 }, // 鼠标位于图标中心
            revert: 'invalid', // 如果没放对地方，飞回去
            zIndex: 9999
        });

        this.makeDroppable('#desktop-stage');
    }

    makeDroppable(selector) {
        const self = this;
        $(selector).droppable({
            accept: '.tool-icon, .app-icon',
            tolerance: 'pointer', // 鼠标指针对准了就算放进去，更灵敏
            drop: function(event, ui) {
                const containerOffset = $(this).offset();
                const scrollLeft = $(this).scrollLeft() || 0;
                
                let left = event.pageX - containerOffset.left + scrollLeft;
                let top = event.pageY - containerOffset.top;

                // 边界修正
                if(left < 0) left = 0; 
                if(top < 0) top = 0;

                // 如果是新拖进来的
                if (ui.draggable.hasClass('tool-icon')) {
                    const name = ui.draggable.data('name');
                    // 注意：这里读取的是 fontawesome class，如 "fa-brands fa-chrome"
                    const fullClass = ui.draggable.find('i').attr('class'); 
                    // 我们只取 fa- 之后的，或者直接存完整的
                    
                    const newId = 'icon-' + Date.now();
                    self.addIcon(newId, name, fullClass, left, top, '#' + $(this).attr('id'));
                } else {
                    // 现有图标移动
                    ui.draggable.appendTo($(this)).css({ left: left, top: top });
                }
            }
        });
    }

    addIcon(id, name, iconClass, x, y, container) {
        // 如果 iconClass 没传，给默认
        if(!iconClass) iconClass = 'fa-solid fa-cube';

        // 生成图标 HTML
        const html = `
            <div class="app-icon" id="${id}" style="left:${x}px; top:${y}px" data-name="${name}">
                <i class="${iconClass}"></i>
                <span>${name}</span>
            </div>
        `;
        $(container).append(html);

        // 让新图标可拖动
        $(`#${id}`).draggable({
            containment: "parent",
            grid: [5, 5], // 稍微细腻一点的网格
            scroll: false
        });

        $(`#${id}`).on('contextmenu', (e) => e.stopPropagation());
    }

    saveToMemory(os) {
        this.cachedLayouts[os] = this.exportLayout().icons;
    }

    exportLayout() {
        const icons = [];
        $('.app-icon').each(function() {
            const el = $(this);
            icons.push({
                id: el.attr('id'),
                name: el.data('name'),
                iconClass: el.find('i').attr('class'),
                left: parseFloat(el.css('left')),
                top: parseFloat(el.css('top')),
                parent: el.parent().attr('id')
            });
        });
        return { icons: icons };
    }

    renderIconsFromData(icons) {
        $('.app-icon').remove();
        icons.forEach(item => {
            let container = '#' + item.parent;
            if ($(container).length === 0) container = '#desktop-stage';
            this.addIcon(item.id, item.name, item.iconClass, item.left, item.top, container);
        });
    }
    
    initContextMenu() {
        $(document).on('contextmenu', '#desktop-area', (e) => {
            if($(e.target).closest('.app-icon').length) return;
            e.preventDefault();
            $('#context-menu').css({top:e.pageY, left:e.pageX}).removeClass('hidden');
        });
        $(document).on('click', ()=> $('#context-menu').addClass('hidden'));
        $('#ctx-refresh').click(()=> $('#desktop-stage').fadeOut(100).fadeIn(100));
        $('#ctx-delete').click(()=> alert('删除功能需要配合选中状态开发'));
    }
}

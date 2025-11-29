class DesktopManager {
    constructor() {
        this.currentOS = 'windows';
        this.layout = { ...CONFIG.defaultLayouts.windows }; // 当前内存中的布局
        this.initEvents();
    }

    // 切换系统
    switchOS(osName) {
        this.currentOS = osName;
        // 更新 UI 样式 class
        $('#desktop-area').removeClass().addClass(`os-${osName}`);
        
        // 手机模式判断
        if (['android', 'ios'].includes(osName)) {
            $('body').addClass('mode-mobile');
            this.renderMobileScreens();
        } else {
            $('body').removeClass('mode-mobile');
            $('#desktop-stage').html(''); // 清空
            // 重新添加默认图标
            this.addIconToStage('my-computer', '我的电脑', 'system', 20, 20);
        }

        // TODO: 从 auth.js 加载该系统的存档数据
    }

    // 渲染手机分屏
    renderMobileScreens() {
        const stage = $('#desktop-stage');
        stage.html('');
        for(let i=0; i<3; i++) {
            stage.append(`<div class="mobile-screen" id="screen-${i}"></div>`);
            // 让每个屏幕都能接收图标放置
            $(`#screen-${i}`).droppable({
                accept: '.app-icon, .tool-icon-clone',
                drop: (event, ui) => this.handleDrop(event, ui)
            });
        }
    }

    // 添加图标到桌面
    addIconToStage(id, name, type, x, y, container = '#desktop-stage') {
        const iconHtml = `
            <div class="app-icon" id="${id}" style="left:${x}px; top:${y}px" data-name="${name}">
                <i class="fa-solid ${this.getIconClass(name)}"></i>
                <span>${name}</span>
            </div>
        `;
        $(container).append(iconHtml);
        
        // 使其可拖拽
        $(`#${id}`).draggable({
            containment: "parent",
            grid: [10, 10], // 网格对齐
            stop: (e, ui) => {
                // 拖拽停止，更新数据位置 (暂存内存)
            }
        });
        
        // 右键事件
        $(`#${id}`).on('contextmenu', (e) => this.showContextMenu(e, id));
    }

    getIconClass(name) {
        if(name.includes('电脑')) return 'fa-desktop';
        if(name.includes('王者')) return 'fa-gamepad';
        if(name.includes('Chrome')) return 'fa-chrome';
        if(name.includes('Word')) return 'fa-file-word';
        return 'fa-cube';
    }

    // 处理从工具栏拖拽过来的逻辑
    initEvents() {
        const self = this;
        
        // 桌面背景可接受拖拽
        $('#desktop-stage').droppable({
            accept: '.tool-icon', // 这里需要修正逻辑，通常是用 helper
            drop: function(event, ui) {
                // 如果是从工具栏拖过来的
                if(ui.draggable.hasClass('tool-icon')) {
                    const name = ui.draggable.data('name');
                    // 计算相对位置
                    const offset = $(this).offset();
                    const x = event.pageX - offset.left;
                    const y = event.pageY - offset.top;
                    const id = 'icon-' + Date.now();
                    self.addIconToStage(id, name, 'app', x, y);
                }
            }
        });

        // 工具栏图标初始化为可拖拽源
        $('.tool-icon').draggable({
            helper: 'clone',
            revert: 'invalid'
        });

        // 右键菜单
        $(document).on('contextmenu', '#desktop-area', function(e) {
            e.preventDefault();
            // 如果点击的是背景
            if(e.target.id === 'desktop-stage' || $(e.target).hasClass('mobile-screen')) {
                $('#context-menu').css({top: e.pageY, left: e.pageX}).removeClass('hidden');
            }
        });
        
        // 点击别处隐藏菜单
        $(document).on('click', () => $('#context-menu').addClass('hidden'));
    }
    
    // 生成JSON用于保存
    exportLayout() {
        const icons = [];
        $('.app-icon').each(function() {
            const el = $(this);
            icons.push({
                id: el.attr('id'),
                name: el.data('name'),
                left: el.css('left'),
                top: el.css('top'),
                parent: el.parent().attr('id') // 用于区分手机分屏
            });
        });
        return { icons: icons, os: this.currentOS };
    }
    
    // 从JSON加载
    loadLayout(data) {
        if(!data || !data.icons) return;
        // 清理当前
        $('.app-icon').not('#my-computer').remove();
        
        data.icons.forEach(icon => {
             // 找到容器 (可能是 desktop-stage 或 screen-0, screen-1)
             let container = '#' + (icon.parent || 'desktop-stage');
             // 如果容器不存在(比如切到了PC但数据是Mobile的)，则放到默认
             if($(container).length === 0) container = '#desktop-stage';
             
             this.addIconToStage(icon.id, icon.name, 'app', parseFloat(icon.left), parseFloat(icon.top), container);
        });
    }
}

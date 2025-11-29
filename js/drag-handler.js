// js/drag-handler.js
// 图标拖放处理和位置保存 (已实现：现有图标移动 + 侧边栏拖动到桌面创建新图标)

$(document).ready(function() {
    let isDraggingExisting = false;
    let isDraggingNew = false;
    let $draggedIcon = null;
    let offsetX, offsetY;

    // --- 现有图标拖动逻辑 (桌面 -> 桌面) ---

    // 鼠标按下事件：开始拖动现有图标
    $('#icon-area').on('mousedown', '.desktop-icon', function(e) {
        if (e.button !== 0) return;
        
        isDraggingExisting = true;
        $draggedIcon = $(this);
        
        offsetX = e.clientX - $draggedIcon.offset().left;
        offsetY = e.clientY - $draggedIcon.offset().top;
        
        $draggedIcon.css({
            'z-index': 100, 
            'cursor': 'grabbing'
        }); 
        
        e.stopPropagation(); 
    });

    // 鼠标移动事件：拖动中 (适用于现有图标)
    $(document).on('mousemove', function(e) {
        if (!isDraggingExisting || !$draggedIcon) return;
        
        e.preventDefault(); 

        // 计算新位置 (边界检查)
        const $iconArea = $('#icon-area');
        const iconAreaOffset = $iconArea.offset();
        const iconAreaWidth = $iconArea.width();
        const iconAreaHeight = $iconArea.height();
        const iconWidth = $draggedIcon.outerWidth();
        const iconHeight = $draggedIcon.outerHeight();
        
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;

        let relativeX = newX - iconAreaOffset.left;
        let relativeY = newY - iconAreaOffset.top;

        relativeX = Math.max(0, Math.min(relativeX, iconAreaWidth - iconWidth));
        relativeY = Math.max(0, Math.min(relativeY, iconAreaHeight - iconHeight));

        $draggedIcon.css({
            left: relativeX + 'px',
            top: relativeY + 'px'
        });
    });

    // 鼠标松开事件：结束拖动并保存位置 (适用于现有图标)
    $(document).on('mouseup', function() {
        if (isDraggingExisting && $draggedIcon) {
            isDraggingExisting = false;
            $draggedIcon.css({'z-index': '', 'cursor': 'grab'}); 
            
            // 获取最终位置
            const finalX = parseInt($draggedIcon.css('left'));
            const finalY = parseInt($draggedIcon.css('top'));
            const iconId = $draggedIcon.data('id');

            // 更新 userDesktops 状态并保存
            if (userDesktops[currentSystemId]) {
                const screenIcons = userDesktops[currentSystemId].screens[currentScreenIndex];
                const iconIndex = screenIcons.findIndex(icon => icon.id === iconId);
                
                if (iconIndex !== -1) {
                    screenIcons[iconIndex].x = finalX;
                    screenIcons[iconIndex].y = finalY;
                    saveUserDesktops();
                }
            }
        }
        $draggedIcon = null;
    });

    // --- 新图标拖动逻辑 (侧边栏 -> 桌面) ---

    // 1. 侧边栏图标 dragstart 事件：存储应用ID
    $('#toolbox-sidebar').on('dragstart', '.sidebar-icon', function(e) {
        const dataTransfer = e.originalEvent.dataTransfer;
        const appID = $(this).data('app-id');
        
        dataTransfer.setData('text/plain', appID);
        dataTransfer.effectAllowed = "copy";
        
        isDraggingNew = true; // 标记正在拖动新图标
    });

    // 2. 桌面区域 dragover 事件：允许放下
    $('#desktop-area').on('dragover', function(e) {
        e.preventDefault(); 
        e.originalEvent.dataTransfer.dropEffect = "copy"; 
    });

    // 3. 桌面区域 drop 事件：创建新图标
    $('#desktop-area').on('drop', function(e) {
        e.preventDefault();
        
        const dataTransfer = e.originalEvent.dataTransfer;
        const appID = dataTransfer.getData('text/plain');

        if (appID && isDraggingNew && userDesktops[currentSystemId]) {
            const appInfo = APP_LIST.find(app => app.id === appID);
            if (!appInfo) return; 

            const $iconArea = $('#icon-area');
            const iconAreaOffset = $iconArea.offset();
            
            // 计算放置位置（相对桌面区域）
            let dropX = e.clientX - iconAreaOffset.left;
            let dropY = e.clientY - iconAreaOffset.top;
            
            // 考虑图标自身的宽度/高度，使鼠标落在图标中心附近
            dropX -= 40; 
            dropY -= 45; 

            // 边界限制
            const iconWidth = 80;
            const iconHeight = 90;
            const iconAreaWidth = $iconArea.width();
            const iconAreaHeight = $iconArea.height();

            dropX = Math.max(0, Math.min(dropX, iconAreaWidth - iconWidth));
            dropY = Math.max(0, Math.min(dropY, iconAreaHeight - iconHeight));

            
            // 创建新的图标数据结构
            const newIconData = {
                id: appID,
                name: appInfo.name, 
                type: 'app', 
                x: dropX, 
                y: dropY,
                is_folder: false
            };

            // 1. 更新数据状态
            userDesktops[currentSystemId].screens[currentScreenIndex].push(newIconData);
            saveUserDesktops();
            
            // 2. 重新渲染桌面以显示新图标
            renderDesktop(currentSystemId, currentScreenIndex);
        }
        
        isDraggingNew = false;
    });
});

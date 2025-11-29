// js/drag-handler.js
// 图标拖放处理和位置保存

$(document).ready(function() {
    let isDragging = false;
    let $draggedIcon = null;
    let offsetX, offsetY;

    // 鼠标按下事件：开始拖动
    $('#icon-area').on('mousedown', '.desktop-icon', function(e) {
        if (e.button !== 0) return;
        
        isDragging = true;
        $draggedIcon = $(this);
        
        // 计算鼠标点击点与图标左上角的偏移量
        offsetX = e.clientX - $draggedIcon.offset().left;
        offsetY = e.clientY - $draggedIcon.offset().top;
        
        $draggedIcon.css({
            'z-index': 100, 
            'cursor': 'grabbing'
        }); 
    });

    // 鼠标移动事件：拖动中
    $(document).on('mousemove', function(e) {
        if (!isDragging || !$draggedIcon) return;
        
        e.preventDefault(); 

        // 计算新位置
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;

        // 边界检查：确保图标不超出 #icon-area 范围
        const $iconArea = $('#icon-area');
        const iconAreaOffset = $iconArea.offset();
        const iconAreaWidth = $iconArea.width();
        const iconAreaHeight = $iconArea.height();
        const iconWidth = $draggedIcon.outerWidth();
        const iconHeight = $draggedIcon.outerHeight();
        
        // 相对 #icon-area 的坐标
        let relativeX = newX - iconAreaOffset.left;
        let relativeY = newY - iconAreaOffset.top;

        relativeX = Math.max(0, Math.min(relativeX, iconAreaWidth - iconWidth));
        relativeY = Math.max(0, Math.min(relativeY, iconAreaHeight - iconHeight));

        $draggedIcon.css({
            left: relativeX + 'px',
            top: relativeY + 'px'
        });
    });

    // 鼠标松开事件：结束拖动并保存位置
    $(document).on('mouseup', function() {
        if (isDragging && $draggedIcon) {
            isDragging = false;
            $draggedIcon.css({'z-index': '', 'cursor': 'grab'}); 
            
            // 获取最终位置
            const finalX = parseInt($draggedIcon.css('left'));
            const finalY = parseInt($draggedIcon.css('top'));
            const iconId = $draggedIcon.data('id');

            // === 核心：更新 userDesktops 状态并保存 ===
            if (userDesktops[currentSystemId]) {
                const screenIcons = userDesktops[currentSystemId].screens[currentScreenIndex];
                
                // 查找并更新图标在数据中的位置
                const iconIndex = screenIcons.findIndex(icon => icon.id === iconId);
                
                if (iconIndex !== -1) {
                    screenIcons[iconIndex].x = finalX;
                    screenIcons[iconIndex].y = finalY;
                    saveUserDesktops();
                    console.log(`Icon ${iconId} position updated and saved.`);
                }
            }
            // ============================================
        }
        $draggedIcon = null;
    });
});

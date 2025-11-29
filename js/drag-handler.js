$(document).ready(function() {
    let isDragging = false;
    let $draggedIcon = null;
    let offsetX, offsetY;

    // 鼠标按下事件：开始拖动
    $('#icon-area').on('mousedown', '.desktop-icon', function(e) {
        if (e.button !== 0) return;
        
        isDragging = true;
        $draggedIcon = $(this);
        
        offsetX = e.clientX - $draggedIcon.offset().left;
        offsetY = e.clientY - $draggedIcon.offset().top;
        
        // 提升 z-index
        $draggedIcon.css('z-index', 100); 
    });

    // 鼠标移动事件：拖动中
    $(document).on('mousemove', function(e) {
        if (!isDragging || !$draggedIcon) return;
        
        e.preventDefault(); 

        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;

        // 边界检查
        const $iconArea = $('#icon-area');
        const iconAreaWidth = $iconArea.width();
        const iconAreaHeight = $iconArea.height();
        const iconWidth = $draggedIcon.outerWidth();
        const iconHeight = $draggedIcon.outerHeight();
        
        newX = Math.max(0, Math.min(newX, iconAreaWidth - iconWidth));
        newY = Math.max(0, Math.min(newY, iconAreaHeight - iconHeight));

        // 更新图标位置
        $draggedIcon.css({
            left: newX + 'px',
            top: newY + 'px'
        });
    });

    // 鼠标松开事件：结束拖动
    $(document).on('mouseup', function() {
        if (isDragging && $draggedIcon) {
            isDragging = false;
            $draggedIcon.css('z-index', ''); 

            // 在这里添加保存位置到 Supabase 的代码 (后续步骤)
            const finalX = parseInt($draggedIcon.css('left'));
            const finalY = parseInt($draggedIcon.css('top'));
            
            console.log(`Icon ${$draggedIcon.attr('id')} moved to (${finalX}, ${finalY}). Needs to be saved to Supabase.`);
        }
        $draggedIcon = null;
    });
});
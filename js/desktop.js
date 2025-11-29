$(document).ready(function () {
    // 初始化桌面
    initDesktop();

    // 拖动桌面图标
    $(".desktop-icon").draggable({
        revert: "invalid",
        helper: "clone"
    });

    // 放置图标
    $("#desktop-area").droppable({
        accept: ".desktop-icon",
        drop: function (event, ui) {
            const iconId = ui.helper.attr("id");
            const newPosition = { top: ui.helper.position().top, left: ui.helper.position().left };
            saveIconPosition(iconId, newPosition);
        }
    });

    // 删除图标
    $(document).on('click', '.delete-icon', function () {
        const iconId = $(this).parent().attr("id");
        removeIcon(iconId);
    });
});

// 初始化桌面图标
function initDesktop() {
    // 示例桌面图标
    const icons = [
        { id: 'my_computer', name: 'My Computer', top: 50, left: 50 },
        { id: 'browser', name: 'Browser', top: 150, left: 150 },
    ];
    
    icons.forEach(icon => {
        $("#desktop-area").append(`<div id="${icon.id}" class="desktop-icon" style="top:${icon.top}px; left:${icon.left}px;">
            <img src="assets/icons/${icon.id}.png" alt="${icon.name}" />
            <button class="delete-icon">Delete</button>
        </div>`);
    });
}

// 保存图标位置
function saveIconPosition(iconId, position) {
    const desktopData = { iconId, position };
    saveDesktop(desktopData);
}

// 删除图标
function removeIcon(iconId) {
    $(`#${iconId}`).remove();
    saveDesktop({ iconId, removed: true });
}

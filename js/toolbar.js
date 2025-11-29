// 初始化工具栏，展示应用图标
$(document).ready(function () {
    const apps = [
        { id: 'word', name: 'Word' },
        { id: 'chrome', name: 'Chrome' },
        { id: 'games', name: 'Games' }
    ];

    apps.forEach(app => {
        $("#toolbar").append(`<div id="${app.id}" class="app-icon">
            <img src="assets/icons/${app.id}.png" alt="${app.name}" />
            <span>${app.name}</span>
        </div>`);
    });
});

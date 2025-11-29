// js/app.js
$(document).ready(function() {
    console.log("App Initialized.");
    
    // 1. 启动
    window.desktopManager = new DesktopManager();
    initAuth();

    // 2. 切换系统
    $('#os-tabs button').click(function() {
        $('#os-tabs button').removeClass('active');
        $(this).addClass('active');
        const os = $(this).data('os');
        window.desktopManager.switchOS(os);
    });

    // 3. 侧边栏折叠 (箭头按钮)
    $('#sidebar-toggle-btn').click(function() {
        $('#sidebar').toggleClass('collapsed');
        const icon = $(this).find('i');
        // 切换箭头方向
        if ($('#sidebar').hasClass('collapsed')) {
            icon.removeClass('fa-chevron-right').addClass('fa-chevron-left');
        } else {
            icon.removeClass('fa-chevron-left').addClass('fa-chevron-right');
        }
    });

    // 4. 弹窗控制
    $('#btn-login-modal').click(() => $('#modal-overlay').removeClass('hidden'));
    $('#btn-close-modal').click(() => $('#modal-overlay').addClass('hidden'));
    
    $('#btn-save').click(() => {
        if(window.saveDesktopData) window.saveDesktopData();
    });

    $('#btn-open-world').click(() => {
        if(window.loadWorldData) window.loadWorldData();
    });
    $('#btn-close-world').click(() => $('#world-overlay').addClass('hidden'));
});

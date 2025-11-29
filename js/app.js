// js/app.js
$(document).ready(function() {
    console.log("App Initialized.");
    
    // 初始化管理器
    window.desktopManager = new DesktopManager();
    // 初始化 Supabase
    initAuth();

    // 切换系统
    $('#os-tabs button').click(function() {
        $('#os-tabs button').removeClass('active');
        $(this).addClass('active');
        const os = $(this).data('os');
        window.desktopManager.switchOS(os);
    });

    // 侧边栏折叠
    $('#sidebar-toggle-btn').click(function() {
        $('#sidebar').toggleClass('collapsed');
        const icon = $(this).find('i');
        if ($('#sidebar').hasClass('collapsed')) {
            icon.removeClass('fa-chevron-right').addClass('fa-chevron-left');
        } else {
            icon.removeClass('fa-chevron-left').addClass('fa-chevron-right');
        }
    });

    // 弹窗逻辑
    $('#btn-login-modal').click(() => $('#modal-overlay').removeClass('hidden'));
    $('#btn-close-modal').click(() => $('#modal-overlay').addClass('hidden'));
    
    // 保存逻辑 (调用 auth.js 中的 saveDesktopData)
    $('#btn-save').click(() => {
        if(window.saveDesktopData) window.saveDesktopData();
    });

    // 世界逻辑 (调用 auth.js 中的 loadWorldData)
    $('#btn-open-world').click(() => {
        if(window.loadWorldData) window.loadWorldData();
    });
    $('#btn-close-world').click(() => $('#world-overlay').addClass('hidden'));
});

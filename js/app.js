// js/app.js
$(document).ready(function() {
    console.log("App Init.");
    
    window.desktopManager = new DesktopManager();
    initAuth();
    applyTranslations(); // 应用语言

    // 切换系统
    $('#os-tabs button[data-os]').click(function() {
        if($(this).attr('id') === 'btn-exit-view') return; // 排除退出按钮
        $('#os-tabs button[data-os]').removeClass('active');
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

    // 弹窗
    $('#btn-login-modal').click(() => $('#modal-overlay').removeClass('hidden'));
    $('#btn-close-modal').click(() => $('#modal-overlay').addClass('hidden'));
    
    // 保存
    $('#btn-save').click(() => {
        // 获取公开状态
        const isPublic = $('#chk-public').is(':checked');
        if(window.saveDesktopData) window.saveDesktopData(isPublic);
    });

    // 世界
    $('#btn-open-world').click(() => {
        if(window.loadWorldData) window.loadWorldData();
    });
    $('#btn-close-world').click(() => $('#world-overlay').addClass('hidden'));

    // 退出查看模式
    $('#btn-exit-view').click(() => {
        location.reload(); // 简单粗暴，刷新回自己主页
    });
});

function applyTranslations() {
    const lang = navigator.language.startsWith('zh') ? 'zh' : 'en';
    const dict = CONFIG.i18n[lang] || CONFIG.i18n.en;
    
    $('[data-i18n]').each(function() {
        const key = $(this).data('i18n');
        if (dict[key]) {
            if ($(this).is('input')) $(this).attr('placeholder', dict[key]);
            else $(this).text(dict[key]);
        }
    });
}

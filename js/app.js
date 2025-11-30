// js/app.js
$(document).ready(function() {
    console.log("App Init.");
    
    window.desktopManager = new DesktopManager();
    initAuth();
    
    // 初始化语言
    updateLangButton();
    applyTranslations();

    // 语言切换按钮事件
    $('#lang-toggle').click(function() {
        // 切换语言
        window.currentLang = window.currentLang === 'zh' ? 'en' : 'zh';
        // 存入本地，下次记住
        localStorage.setItem('app_lang', window.currentLang);
        
        // 更新界面
        updateLangButton();
        applyTranslations();
        
        // 重新渲染侧边栏（因为工具栏标题需要重新翻译）
        window.desktopManager.renderSidebar(window.desktopManager.currentOS);
    });

    // 切换系统
    $('#os-tabs button[data-os]').click(function() {
        if($(this).attr('id') === 'btn-exit-view') return;
        $('#os-tabs button[data-os]').removeClass('active');
        $(this).addClass('active');
        const os = $(this).data('os');
        window.desktopManager.switchOS(os);
    });

    $('#sidebar-toggle-btn').click(function() {
        $('#sidebar').toggleClass('collapsed');
        const icon = $(this).find('i');
        if ($('#sidebar').hasClass('collapsed')) {
            icon.removeClass('fa-chevron-right').addClass('fa-chevron-left');
        } else {
            icon.removeClass('fa-chevron-left').addClass('fa-chevron-right');
        }
    });

    $('#btn-login-modal').click(() => $('#modal-overlay').removeClass('hidden'));
    $('#btn-close-modal').click(() => $('#modal-overlay').addClass('hidden'));
    
    $('#btn-save').click(() => {
        const isPublic = $('#chk-public').is(':checked');
        if(window.saveDesktopData) window.saveDesktopData(isPublic);
    });

    $('#btn-open-world').click(() => {
        if(window.loadWorldData) window.loadWorldData();
    });
    $('#btn-close-world').click(() => $('#world-overlay').addClass('hidden'));

    $('#btn-exit-view').click(() => {
        location.reload();
    });
});

function updateLangButton() {
    // 按钮显示“切换到对方语言”的文字
    const nextLangText = window.currentLang === 'zh' ? 'English' : '中文';
    $('#lang-text').text(nextLangText);
}

function applyTranslations() {
    if (!CONFIG || !CONFIG.i18n) return;

    const lang = window.currentLang; // 使用全局变量
    const dict = CONFIG.i18n[lang] || CONFIG.i18n['en'];
    
    // 翻译带有 data-i18n 属性的元素
    $('[data-i18n]').each(function() {
        const key = $(this).data('i18n');
        if (dict[key]) {
            if ($(this).is('input')) $(this).attr('placeholder', dict[key]);
            else $(this).text(dict[key]);
        }
    });
}

$(document).ready(function() {
    // 1. 初始化桌面管理器
    window.desktopManager = new DesktopManager();

    // 2. 初始化 Supabase Auth
    initAuth();

    // 3. 绑定 UI 事件
    // 切换系统
    $('#os-tabs button').click(function() {
        $('#os-tabs button').removeClass('active');
        $(this).addClass('active');
        const os = $(this).data('os');
        window.desktopManager.switchOS(os);
        // 切换系统后，重新加载该系统的数据
        loadCloudDesktop();
    });

    // 登录弹窗开关
    $('#btn-login-modal').click(() => $('#modal-overlay').removeClass('hidden'));
    $('#btn-close-modal').click(() => $('#modal-overlay').addClass('hidden'));

    // 保存按钮
    $('#btn-save').click(() => saveCurrentDesktop());
    
    // 打开世界
    $('#btn-open-world').click(async () => {
        $('#world-overlay').removeClass('hidden');
        $('#world-grid').html('加载中...');
        
        // 获取所有公开桌面
        const { data, error } = await supabase
            .from('desktops')
            .select('id, os_type, likes_count, profiles(nickname)')
            .eq('is_public', true)
            .order('created_at', { ascending: false })
            .limit(20);
            
        if(data) {
            $('#world-grid').html('');
            data.forEach(d => {
                const nickname = d.profiles ? d.profiles.nickname : '无名氏';
                $('#world-grid').append(`
                    <div class="world-item">
                        <div class="thumb ${d.os_type}">
                            <i class="fa-solid fa-desktop" style="font-size:40px; color:#ddd;"></i>
                        </div>
                        <div class="info">
                            <strong>${nickname}</strong> 的 ${d.os_type}<br>
                            <span>❤️ ${d.likes_count}</span>
                        </div>
                    </div>
                `);
            });
        }
    });
    
    $('#btn-close-world').click(() => $('#world-overlay').addClass('hidden'));
});

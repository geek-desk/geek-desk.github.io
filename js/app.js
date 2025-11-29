// js/app.js
$(document).ready(function() {
    console.log("App Initialized.");

    window.desktopManager = new DesktopManager();
    initAuth();

    // 1. 系统切换
    $('#os-tabs button').click(function() {
        // 视觉激活状态
        $('#os-tabs button').removeClass('active');
        $(this).addClass('active');
        
        // 执行切换逻辑
        const os = $(this).data('os');
        window.desktopManager.switchOS(os);
    });

    // 2. 侧边栏折叠功能 (新功能)
    $('#sidebar-toggle-btn').click(function() {
        const sidebar = $('#sidebar');
        const icon = $(this).find('i');
        
        sidebar.toggleClass('collapsed');
        
        if (sidebar.hasClass('collapsed')) {
            icon.removeClass('fa-chevron-right').addClass('fa-chevron-left');
        } else {
            icon.removeClass('fa-chevron-left').addClass('fa-chevron-right');
        }
    });

    // 3. 弹窗控制
    $('#btn-login-modal').click(() => $('#modal-overlay').removeClass('hidden'));
    $('#btn-close-modal').click(() => $('#modal-overlay').addClass('hidden'));

    // 4. 保存
    $('#btn-save').click(() => {
        const os = window.desktopManager.currentOS;
        const layout = window.desktopManager.exportLayout();
        saveDesktopData(os, layout);
    });

    // 5. 世界
    $('#btn-open-world').click(loadWorldData);
    $('#btn-close-world').click(() => $('#world-overlay').addClass('hidden'));
    
    // 6. 移动端：点击菜单按钮唤出侧边栏 (如果之后加移动端汉堡菜单的话)
    // 目前使用 sidebar toggle btn 即可
});

// 世界数据加载逻辑 (保持不变)
async function loadWorldData() {
    $('#world-overlay').removeClass('hidden');
    const grid = $('#world-grid');
    grid.html('<p style="width:100%; text-align:center;">正在获取世界数据...</p>');

    const { data, error } = await supabase
        .from('desktops')
        .select('id, os_type, likes_count, user_id, profiles(nickname)') // 尝试关联查询昵称
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(20);

    grid.empty();
    
    if (error) {
        console.error(error);
        grid.html('<p>加载失败，请稍后再试。</p>');
        return;
    }

    if (!data || data.length === 0) {
        grid.html('<p>暂无数据。</p>');
        return;
    }

    data.forEach(item => {
        // 安全获取昵称
        const name = item.profiles ? item.profiles.nickname : '神秘黑客';
        const card = `
            <div class="world-card">
                <div class="card-preview" style="background:${getOSColor(item.os_type)}">
                    <i class="fa-solid fa-desktop" style="font-size:40px; color:rgba(255,255,255,0.5)"></i>
                </div>
                <div class="card-info">
                    <strong>${item.os_type.toUpperCase()}</strong><br>
                    <span>用户: ${name}</span><br>
                    <span style="color:red">❤️ ${item.likes_count || 0}</span>
                </div>
            </div>
        `;
        grid.append(card);
    });
}

function getOSColor(os) {
    switch(os) {
        case 'windows': return '#00a8e8';
        case 'macos': return '#636e72';
        case 'ubuntu': return '#e17055';
        case 'android': return '#a4b0be';
        case 'ios': return '#2d3436';
        default: return '#333';
    }
}

// js/desktop.js
class DesktopManager {
    constructor() {
        this.currentOS = 'windows';
        this.cachedLayouts = { windows: null, macos: null, ubuntu: null, android: null, ios: null };
        this.folderData = {}; 
        this.currentOpenFolderId = null;
        this.init();
    }

    init() {
        this.initDragDrop();
        this.initContextMenu();
        this.initFolderWindow();
        
        $(document).on('click', '.wallpaper-item', function() {
            const url = $(this).data('url');
            $('#desktop-area').css('background-image', `url(${url})`);
        });

        this.switchOS('windows');
        $(document).on('click', '.cat-title', function() { $(this).parent().toggleClass('collapsed'); });
    }

    switchOS(osName) {
        this.saveToMemory(this.currentOS);
        this.currentOS = osName;

        const bg = CONFIG.wallpapers[osName] || 'none';
        $('#desktop-area').removeClass().addClass(`os-${osName}`).css('background-image', bg);
        
        this.updateSystemUI(osName);
        this.renderSidebar(osName);
        $('#desktop-stage').empty();
        
        const cached = this.cachedLayouts[osName];
        
        // === 关键修复：检查缓存有效性 ===
        // 只有当缓存存在，且图标数组不为空时，才使用缓存
        // 否则强制加载 config.js 里的 defaults
        if (cached && cached.icons && cached.icons.length > 0) {
            this.folderData = cached.folders || {};
            if (cached.customWallpaper && cached.customWallpaper.indexOf('url') !== -1) {
                $('#desktop-area').css('background-image', cached.customWallpaper);
            }
            this.renderIcons(cached.icons);
        } else {
            this.folderData = {};
            const defaults = CONFIG.defaultIcons[osName] || [];
            defaults.forEach(icon => {
                this.addIcon('def-'+Date.now()+Math.random(), icon.name, icon.icon, icon.x, icon.y, '#desktop-stage', 'app', icon.color);
            });
            if (window.loadCloudDesktop) window.loadCloudDesktop();
        }
    }

    renderSidebar(os) {
        const container = $('#dynamic-toolbox');
        container.empty();
        
        let tools = [];
        try { tools = getToolsForOS(os); } catch(e) { console.log(e); }
        if(!tools || !Array.isArray(tools)) return;

        tools.forEach((cat, index) => {
            let itemsHtml = '';
            if (cat.items && Array.isArray(cat.items)) {
                if (cat.type === 'wallpaper') {
                    cat.items.forEach(wp => itemsHtml += `<div class="wallpaper-item" style="background-image:url(${wp.img})" data-url="${wp.url}"></div>`);
                    const title = window.t ? window.t('wallpaper') : 'Wallpapers';
                    container.append(`<div class="category"><div class="cat-title">${title}</div><div class="cat-content wallpapers">${itemsHtml}</div></div>`);
                } else {
                    cat.items.forEach(tool => itemsHtml += `<div class="tool-icon" data-name="${tool.name}" data-icon="${tool.icon}" data-color="${tool.color}"><i class="${tool.icon}" style="color:${tool.color}"></i><span>${tool.name}</span></div>`);
                    const title = window.t ? window.t(cat.title) : cat.title;
                    container.append(`<div class="category ${index>1?'collapsed':''}"><div class="cat-title">${title}</div><div class="cat-content">${itemsHtml}</div></div>`);
                }
            }
        });
        this.initToolDrag();
    }

    updateSystemUI(os) {
        $('.sys-ui').addClass('hidden');
        $('body').removeClass('mobile-mode');
        if(os==='windows') $('.taskbar-win11').removeClass('hidden');
        else if(os==='macos') $('.dock-macos').removeClass('hidden');
        else if(os==='ubuntu') $('.dock-ubuntu').removeClass('hidden');
        else if(['android','ios'].includes(os)) { $('body').addClass('mobile-mode'); $('.status-bar-mobile').removeClass('hidden'); this.renderMobileScreens(); }
    }

    renderMobileScreens() {
        for(let i=1; i<=3; i++) {
            const id = `screen-${i}`;
            $('#desktop-stage').append(`<div class="mobile-screen" id="${id}"></div>`);
            this.makeDroppable(`#${id}`);
        }
    }

    checkLimit(container) {
        const count = $(container).find('.app-icon').length;
        if(container.includes('screen') && count >= CONFIG.limits.mobileScreenMax) { alert("Full!"); return false; }
        if(container==='#desktop-stage' && count >= CONFIG.limits.desktopMax) { alert("Full!"); return false; }
        return true;
    }

    addIcon(id, name, icon, x, y, container, type='app', color=null) {
        if(!this.checkLimit(container)) return;
        const style = color ? `style="color:${color}"` : '';
        const html = `<div class="app-icon" id="${id}" style="left:${x}px;top:${y}px" data-name="${name}" data-type="${type}" data-color="${color}"><i class="${icon}" ${style}></i><span>${name}</span></div>`;
        $(container).append(html);
        this.bindIconEvents(id);
    }

    bindIconEvents(id) {
        const el = $(`#${id}`);
        if(el.parent().attr('id')!=='folder-content') {
            el.draggable({ containment: "parent", grid: [10,10], scroll:false, start: ()=>el.css('z-index',100), stop: ()=>el.css('z-index','') });
        }
        el.on('contextmenu', (e) => {
            e.stopPropagation(); e.preventDefault();
            $('.app-icon').removeClass('selected'); el.addClass('selected');
            $('#context-menu').data('target-id', id).css({top:e.pageY, left:e.pageX}).removeClass('hidden');
        });
        el.on('dblclick', () => {
            if(el.data('type')==='folder') this.openFolder(id, el.data('name'));
            else el.animate({opacity:0.5},100).animate({opacity:1},100);
        });
    }

    initToolDrag() {
        $('.tool-icon').draggable({
            helper: function() {
                const i = $(this).data('icon'), c = $(this).data('color');
                return $(`<div style="z-index:999;width:50px;height:50px;background:#fff;border-radius:10px;display:flex;align-items:center;justify-content:center;box-shadow:0 5px 10px rgba(0,0,0,0.2)"><i class="${i}" style="font-size:24px;color:${c}"></i></div>`);
            }, appendTo: 'body', cursorAt: {top:25,left:25}, revert: 'invalid'
        });
    }

    makeDroppable(sel) {
        const self = this;
        $(sel).droppable({
            accept: '.tool-icon, .app-icon',
            drop: function(e, ui) {
                if(ui.draggable.hasClass('app-icon')) return;
                const offset = $(this).offset();
                let l = e.pageX - offset.left + ($(this).scrollLeft()||0), t = e.pageY - offset.top;
                if(l<0)l=0; if(t<0)t=0;
                self.addIcon('icon-'+Date.now(), ui.draggable.data('name'), ui.draggable.data('icon'), l, t, '#'+$(this).attr('id'), 'app', ui.draggable.data('color'));
            }
        });
    }
    
    initDragDrop() { this.makeDroppable('#desktop-stage'); }

    initFolderWindow() {
        $('#btn-close-folder').click(() => { $('#folder-window').addClass('hidden'); this.currentOpenFolderId=null; });
        $('#folder-content').droppable({
            accept: '.tool-icon',
            drop: (e, ui) => {
                if(ui.draggable.hasClass('tool-icon')) {
                    const name=ui.draggable.data('name'), icon=ui.draggable.data('icon'), color=ui.draggable.data('color'), id='in-folder-'+Date.now();
                    this.addIcon(id, name, icon, 0, 0, '#folder-content', 'app', color);
                    if(this.currentOpenFolderId) {
                        if(!this.folderData[this.currentOpenFolderId]) this.folderData[this.currentOpenFolderId]=[];
                        this.folderData[this.currentOpenFolderId].push({id,name,icon,color,type:'app'});
                    }
                }
            }
        });
    }

    openFolder(id, name) {
        this.currentOpenFolderId = id;
        $('#folder-title').text(name);
        $('#folder-window').removeClass('hidden');
        $('#folder-content').empty();
        if(this.folderData[id]) this.folderData[id].forEach(i => this.addIcon(i.id, i.name, i.icon, 0, 0, '#folder-content', 'app', i.color));
        else this.folderData[id] = [];
    }

    initContextMenu() {
        $(document).on('contextmenu', '#desktop-area', (e) => {
            if($(e.target).closest('.app-icon').length) return;
            e.preventDefault();
            $('#context-menu').data('target-id', null).css({top:e.pageY, left:e.pageX}).removeClass('hidden');
        });
        $(document).on('click', () => $('#context-menu').addClass('hidden'));
        $('#ctx-new-folder').click(() => {
            const off = $('#desktop-stage').offset(), m = $('#context-menu');
            this.addIcon('folder-'+Date.now(), 'New Folder', 'fa-solid fa-folder', parseInt(m.css('left'))-off.left, parseInt(m.css('top'))-off.top, '#desktop-stage', 'folder', null);
        });
        $('#ctx-rename').click(() => {
            const tid = $('#context-menu').data('target-id');
            if(tid) { const n = prompt("Rename:"); if(n) $(`#${tid} span`).text(n); }
        });
        $('#ctx-delete').click(() => {
            const tid = $('#context-menu').data('target-id');
            if(tid) { $(`#${tid}`).remove(); if(this.folderData[tid]) delete this.folderData[tid]; }
        });
    }

    saveToMemory(os) {
        const icons = [];
        $('#desktop-stage .app-icon').each(function() {
            const el = $(this);
            icons.push({ id:el.attr('id'), name:el.data('name'), icon:el.find('i').attr('class'), color:el.data('color'), x:parseFloat(el.css('left')), y:parseFloat(el.css('top')), type:el.data('type'), parent:el.parent().attr('id') });
        });
        
        let isPublic = false;
        let currentBg = $('#desktop-area').css('background-image');
        
        if (this.cachedLayouts[os] && this.cachedLayouts[os].is_public) {
            isPublic = this.cachedLayouts[os].is_public;
        }

        this.cachedLayouts[os] = { 
            icons: icons, 
            folders: this.folderData, 
            is_public: isPublic,
            customWallpaper: currentBg 
        };
    }
    
    exportLayout() { this.saveToMemory(this.currentOS); return this.cachedLayouts[this.currentOS]; }
    
    loadLayout(data) {
        if(!data) return;
        this.cachedLayouts[this.currentOS] = data;
        this.folderData = data.folders || {};
        $('#desktop-stage').empty();
        if(data.customWallpaper && data.customWallpaper.indexOf('url') !== -1) {
            $('#desktop-area').css('background-image', data.customWallpaper);
        } else {
            $('#desktop-area').css('background-image', CONFIG.wallpapers[this.currentOS]);
        }
        if(data.icons) this.renderIcons(data.icons);
    }
    
    renderIcons(icons) {
        icons.forEach(i => {
            let c = '#'+i.parent; if($(c).length===0) c='#desktop-stage';
            this.addIcon(i.id, i.name, i.icon, i.x, i.y, c, i.type, i.color);
        });
    }
}

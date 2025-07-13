import dom from "../dom";
import dom from "../dom";
import { ICONS } from "../icons";
import { supabase } from "../supabase";
import { loadRightSidebar } from "./loadRightSidebar";

export async function updateNavAndSidebars() {
    const hash = window.location.hash || '#';
    const menuItems = [ { name: 'ホーム', hash: '#', icon: ICONS.home }, { name: '検索', hash: '#explore', icon: ICONS.explore } ];
    if (currentUser && !currentUser.notice_count_fetched_recently) {
        const { data: updatedUser, error } = await supabase.from('user').select('notice, notice_count').eq('id', currentUser.id).single();
        if (!error && updatedUser) {
            currentUser.notice = updatedUser.notice;
            currentUser.notice_count = updatedUser.notice_count;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
        currentUser.notice_count_fetched_recently = true;
        setTimeout(() => { if (currentUser) currentUser.notice_count_fetched_recently = false; }, 10000);
    }
        if (currentUser) {
        const { data: unreadDmCounts, error: unreadDmError } = await supabase.rpc('get_all_unread_dm_counts', { p_user_id: currentUser.id });
        let totalUnreadDmCount = 0;
        if (!unreadDmError && unreadDmCounts) {
            currentUser.unreadDmCountsData = unreadDmCounts;
            totalUnreadDmCount = unreadDmCounts.reduce((sum, item) => sum + item.unread_count, 0);
        }

        menuItems.push(
            { name: '通知', hash: '#notifications', icon: ICONS.notifications, badge: currentUser.notice_count }, 
            { name: 'いいね', hash: '#likes', icon: ICONS.likes }, 
            { name: 'お気に入り', hash: '#stars', icon: ICONS.stars }, 
            { name: 'メッセージ', hash: '#dm', icon: ICONS.dm, badge: totalUnreadDmCount },
            { name: 'プロフィール', hash: `#profile/${currentUser.id}`, icon: ICONS.profile }, 
            { name: '設定', hash: '#settings', icon: ICONS.settings }
        );
    }
    dom.navMenuTop.innerHTML = menuItems.map(item => {
        let isActive = false;
        if (item.hash === '#') {
            isActive = (hash === '#' || hash === '');
        } else {
            isActive = hash.startsWith(item.hash);
        }
        // ▼▼▼ このreturn文を、新しいHTML構造に差し替え ▼▼▼
        return `
            <a href="${item.hash}" class="nav-item ${isActive ? 'active' : ''}">
                <div class="nav-item-icon-container">
                    ${item.icon}
                    ${item.badge && item.badge > 0 ? `<span class="notification-badge">${item.badge > 99 ? '99+' : item.badge}</span>` : ''}
                </div>
                <span class="nav-item-text">${item.name}</span>
            </a>`;
        // ▲▲▲ HTML構造は前回と同じですが、CSSとの連携で重要なので再確認 ▲▲▲
    }).join('');
    // ▼▼▼ この行を修正 ▼▼▼
    if(currentUser) dom.navMenuTop.innerHTML += `<button class="nav-item nav-item-post"><span class="nav-item-text">ポスト</span><span class="nav-item-icon">${ICONS.send}</span></button>`;
    // ▲▲▲ 修正ここまで ▲▲▲
    // 未ログイン時は何も表示せず、ログインしている場合のみアカウントボタンを表示する
    dom.navMenuBottom.innerHTML = currentUser ? `<button id="account-button" class="nav-item account-button"> <img src="${getUserIconUrl(currentUser)}" class="user-icon" alt="${currentUser.name}'s icon"> <div class="account-info"> <span class="name">${escapeHTML(currentUser.name)}</span> <span class="id">#${currentUser.id}</span> </div> </button>` : '';
    dom.loginBanner.classList.toggle('hidden', !!currentUser);
    // ▼▼▼ [修正点2] preventDefaultを削除し、通常のhashchangeをトリガーさせる ▼▼▼
    dom.navMenuTop.querySelectorAll('a.nav-item').forEach(link => {
        (link as HTMLAnchorElement).onclick = (e) => {
            // hashchangeイベントに任せるため、preventDefaultはしない
        };
    });
    // ▲▲▲ [修正点2] ここまで ▼▼▼
    // ログアウトボタン（account-button）が存在する場合のみイベントリスナーを設定
    dom.navMenuBottom.querySelector('#account-button')?.addEventListener('click', handleLogout);
    dom.navMenuTop.querySelector('.nav-item-post')?.addEventListener('click', () => openPostModal());
    loadRightSidebar();
}
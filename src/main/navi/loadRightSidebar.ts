import dom from "../dom";
import { ICONS } from "../icons";
import { supabase } from "../supabase";

export async function loadRightSidebar() {
    if (dom.rightSidebar.searchWidget) {
        dom.rightSidebar.searchWidget.innerHTML = ` <div class="sidebar-search-widget"> ${ICONS.explore} <input type="search" id="sidebar-search-input" placeholder="検索"> </div>`;
        document.getElementById('sidebar-search-input')!.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = (e.target as HTMLInputElement).value.trim();
                if (query) { window.location.hash = `#search/${encodeURIComponent(query)}`; }
            }
        });
    }
    
    let query = supabase.from('user').select('id, name, scid, icon_data');
    if (currentUser) {
        query = query.neq('id', currentUser.id);
    }
    const { data, error } = await query.order('time', { ascending: false }).limit(3);

    if (error || !data || data.length === 0) { if(dom.rightSidebar.recommendations) DOM.rightSidebar.recommendations.innerHTML = ''; return; }
    let recHTML = '<div class="widget-title">おすすめユーザー</div>';
    recHTML += data.map(user => {
        const isFollowing = currentUser?.follow?.includes(user.id);
        const btnClass = isFollowing ? 'follow-button-following' : 'follow-button-not-following';
        const btnText = isFollowing ? 'フォロー中' : 'フォロー';
        return ` <div class="widget-item recommend-user"> <a href="#profile/${user.id}" class="profile-link" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:0.5rem;"> <img src="${getUserIconUrl(user)}" style="width:40px;height:40px;border-radius:50%;" alt="${user.name}'s icon"> <div> <span>${escapeHTML(user.name)}</span> <small style="color:var(--secondary-text-color); display:block;">#${user.id}</small> </div> </a> ${currentUser && currentUser.id !== user.id ? `<button class="${btnClass}" data-user-id="${user.id}">${btnText}</button>` : ''} </div>`;
    }).join('');
    if(dom.rightSidebar.recommendations) dom.rightSidebar.recommendations.innerHTML = `<div class="sidebar-widget">${recHTML}</div>`;
    dom.rightSidebar.recommendations?.querySelectorAll('.recommend-user button').forEach((button: HTMLButtonElement) => {
        const userId = parseInt(button.dataset.userId!);
        if (!isNaN(userId)) {
            const isFollowing = currentUser?.follow?.includes(userId);
            updateFollowButtonState(button, isFollowing);
            button.onclick = () => window.handleFollowToggle(userId, button);
        }
    });
}
import dom from "./dom";
import { showLoading } from "./utils/showloading";
import { showScreen } from "./utils/showscreen";

export async function router() {
    showLoading(true);
    isLoadingMore = false; // ページ遷移時に読み込み状態をリセット

    await updateNavAndSidebars();
    const hash = window.location.hash || '#';

    if (postLoadObserver) {
        postLoadObserver.disconnect();
    }

    try {
        if (hash.startsWith('#post/')) await showPostDetail(hash.substring(6));
        else if (hash.startsWith('#profile/')) {
            const path = hash.substring(9);
            const userId = parseInt(path, 10); // パスの先頭がユーザーID
            
            if (isNaN(userId)) {
                window.location.hash = '#'; return;
            }

            // URLからサブページ名を取得
            const subpageMatch = path.match(/\/(.+)/);
            const subpage = subpageMatch ? subpageMatch[1] : 'posts'; // サブページがなければ'posts'
            
            await showProfileScreen(userId, subpage);
        }
        // ▲▲▲ 修正ここまで ▲▲▲
        else if (hash.startsWith('#search/')) await showSearchResults(decodeURIComponent(hash.substring(8)));
        else if (hash.startsWith('#dm/')) await showDmScreen(hash.substring(4));
        else if (hash === '#dm') await showDmScreen();
        else if (hash === '#settings' && currentUser) await showSettingsScreen();
        else if (hash === '#explore') await showExploreScreen();
        else if (hash === '#notifications' && currentUser) await showNotificationsScreen();
        else if (hash === '#likes' && currentUser) await showLikesScreen();
        else if (hash === '#stars' && currentUser) await showStarsScreen();
        else await showMainScreen();
    } catch (error) {
        console.error("Routing error:", error);
        dom.pageHeader.innerHTML = `<h2>エラー</h2>`;
        showScreen('main-screen');
        dom.timeline.innerHTML = `<p class="error-message">ページの読み込み中にエラーが発生しました。</p>`;
        showLoading(false); // エラー発生時はローディングを止める
    }
    // ▼▼▼ [修正点1] finallyブロックのshowLoading(false)を削除し、各描画関数の最後に移動 ▼▼▼
    // finally {
    //     showLoading(false);
    // }
    // ▲▲▲ [修正点1] ここまで ▼▼▼
}
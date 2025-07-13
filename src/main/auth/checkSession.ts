import dom from "../dom";
import { router } from "../router";
import { supabase } from "../supabase";

export interface CurrentUser {
    admin: boolean,
    follow: number[],
    frieze: string | null,
    icon_data: string,
    id: number,
    like: string[],
    me: string,
    notice: {
        click: boolean,
        id: string,
        message: string,
        open: string,
    }[],
    notice_count: 0,
    notice_count_fetched_recently: boolean,
    pin: unknown | null,
    post: string[],
    scid: string,
    setting: {
        show_follow: boolean,
        show_follower: boolean,
        show_like: boolean,
        show_scid: boolean,
        show_star: boolean,
    },
    star: string[],
    time: string,
    unreadDmCountsData: unknown[],
    uuid: string,
    verify: boolean,
}
export let currentUser: CurrentUser | null = null;

export const setCurrentUserToNull = () => currentUser = null;

export async function checkSession() {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
        console.error(sessionError);
        dom.connectionErrorOverlay.classList.remove('hidden');
        return;
    }

    if (session) {
        try {
            const authUserId = session.user.id; // これはUUID
            
            // 取得した認証UUIDを使って、'uuid'カラムを検索する
            const { data, error } = await supabase
                .from('user')
                .select('*')
                .eq('uuid', authUserId) // 'id'ではなく'uuid'と比較する
                .single();

            if (error || !data) throw new Error('ユーザーデータの取得に失敗しました。');
            
            currentUser = data as CurrentUser;

            if (currentUser.frieze) {
                dom.friezeReason.textContent = currentUser.frieze;
                dom.friezeOverlay.classList.remove('hidden');
                return;
            }

            subscribeToChanges();
            router();

        } catch (error) {
            console.error(error);
            currentUser = null;
            dom.connectionErrorOverlay.classList.remove('hidden');
        }
    } else {
        currentUser = null;
        router();
    }
}
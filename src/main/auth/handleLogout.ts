import { router } from "../router";
import { supabase } from "../supabase";
import { setCurrentUserToNull } from "./checkSession";

export function handleLogout() {
    if(!confirm("ログアウトしますか？")) return;
    // supabase.auth.signOut()を呼び出してセッションを破棄
    supabase.auth.signOut().then(() => {
        setCurrentUserToNull();
        if (realtimeChannel) { supabase.removeChannel(realtimeChannel); realtimeChannel = null; }
        window.location.hash = '#';
        router();
    });
}
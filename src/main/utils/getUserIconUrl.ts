import { supabase } from "../supabase";

export function getUserIconUrl(user) {
    if (!user) return 'favicon.png';
    
    // icon_dataが存在するかチェック
    if (user.icon_data) {
        // Data URL形式か、それともファイルID(UUID)かを判別
        if (user.icon_data.startsWith('data:image')) {
            // 古い形式（Data URL）の場合はそのまま返す
            return user.icon_data;
        } else {
            // 新しい形式（ファイルID）の場合は、Supabase Storageの公開URLを生成して返す
            const { data } = supabase.storage.from('nyax').getPublicUrl(user.icon_data);
            return data.publicUrl;
        }
    }
    
    // icon_dataがなければ、デフォルトのScratchアバターURLを返す
    return `https://trampoline.turbowarp.org/avatars/by-username/${user.scid}`;
}

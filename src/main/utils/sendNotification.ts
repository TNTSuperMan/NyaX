import { supabase } from "../supabase";

export async function sendNotification(recipientId: number, message: string, openHash = '') {
    if (!currentUser || !recipientId || !message || recipientId === currentUser.id) return;
    
    try {
        const { error } = await supabase.rpc('send_notification_with_timestamp', {
            recipient_id: recipientId,
            message_text: message,
            open_hash: openHash
        });

        if (error) {
            console.error('通知の送信に失敗しました:', error);
        }
    } catch (e) {
        console.error('通知送信中にエラー発生:', e);
    }
}

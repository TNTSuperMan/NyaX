import { supabase } from "../supabase";
import { escapeHTML } from "./escapeHTML";
import { formatPostContent } from "./formatPostComment";
import { getUserIconUrl } from "./getUserIconUrl";

export function renderDmMessage(msg) {
    if (msg.type === 'system') {
        const formattedContent = formatPostContent(msg.content, allUsersCache);
        return `<div class="dm-system-message">${formattedContent}</div>`;
    }

    let attachmentsHTML = '';
    if (msg.attachments && msg.attachments.length > 0) {
        attachmentsHTML += '<div class="attachments-container">';
        for (const attachment of msg.attachments) {
            const { data: publicUrlData } = supabase.storage.from('nyax').getPublicUrl(attachment.id);
            const publicURL = publicUrlData.publicUrl;
            
            let itemHTML = '<div class="attachment-item">';
            if (attachment.type === 'image') {
                itemHTML += `<img src="${publicURL}" alt="${escapeHTML(attachment.name)}" class="attachment-image" onclick="event.stopPropagation(); window.openImageModal('${publicURL}')">`;
            } else if (attachment.type === 'video') {
                itemHTML += `<video src="${publicURL}" controls onclick="event.stopPropagation();"></video>`;
            } else if (attachment.type === 'audio') {
                itemHTML += `<audio src="${publicURL}" controls onclick="event.stopPropagation();"></audio>`;
            }
            
            itemHTML += `<a href="#" class="attachment-download-link" onclick="event.preventDefault(); event.stopPropagation(); window.handleDownload('${publicURL}', '${escapeHTML(attachment.name)}')">ダウンロード: ${escapeHTML(attachment.name)}</a>`;
            itemHTML += '</div>';
            attachmentsHTML += itemHTML;
        }
        attachmentsHTML += '</div>';
    }

    const formattedContent = msg.content ? formatPostContent(msg.content, allUsersCache) : '';
    const sent = msg.userid === currentUser.id;
    
    if (sent) {
        // 送信メッセージ
        return `<div class="dm-message-container sent" data-message-id="${msg.id}">
            <div class="dm-message-wrapper">
                <button class="dm-message-menu-btn">…</button>
                <div class="post-menu">
                    <button class="edit-dm-msg-btn">編集</button>
                    <button class="delete-dm-msg-btn delete-btn">削除</button>
                </div>
                <div class="dm-message">${formattedContent}${attachmentsHTML}</div>
            </div>
        </div>`;
    } else {
        // 受信メッセージ
        const user = allUsersCache.get(msg.userid) || {};
        const time = new Date(msg.time).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
        return `<div class="dm-message-container received">
            <a href="#profile/${user.id}" class="dm-user-link">
                <img src="${getUserIconUrl(user)}" class="dm-message-icon">
            </a>
            <div class="dm-message-wrapper">
                <div class="dm-message-meta">
                    <a href="#profile/${user.id}" class="dm-user-link">${escapeHTML(user.name || '不明')}</a>
                    ・${time}
                </div>
                <div class="dm-message">${formattedContent}${attachmentsHTML}</div>
            </div>
        </div>`;
    }
}

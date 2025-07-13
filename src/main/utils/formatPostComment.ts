import { escapeHTML } from "./escapeHTML";

export function formatPostContent(text: string, userCache = new Map()) { // ★★★ デフォルト値を追加
    let formattedText = escapeHTML(text);
    const urlRegex = /(https?:\/\/[^\s<>"'’]+)/g;
    formattedText = formattedText.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">$1</a>');
    const hashtagRegex = /#([a-zA-Z0-9_ぁ-んァ-ヶー一-龠]+)/g;
    formattedText = formattedText.replace(hashtagRegex, (match, tagName) => `<a href="#search/${encodeURIComponent(tagName)}" onclick="event.stopPropagation()">${match}</a>`);
    
    const mentionRegex = /@(\d+)/g;
    formattedText = formattedText.replace(mentionRegex, (match, userId) => {
        const numericId = parseInt(userId);
        if (userCache.has(numericId)) {
            const user = userCache.get(numericId); // ユーザーオブジェクトを取得
            const userName = user ? user.name : null; // nameプロパティを取得
            if (userName) {
                return `<a href="#profile/${numericId}" onclick="event.stopPropagation()">@${escapeHTML(userName)}</a>`;
            }
        }
        return match;
    });

    return formattedText;
}

export function updateFollowButtonState(buttonElement: HTMLButtonElement, isFollowing: boolean) {
    buttonElement.classList.remove('follow-button-not-following', 'follow-button-following');
    if (isFollowing) {
        buttonElement.textContent = 'フォロー中';
        buttonElement.classList.add('follow-button-following');
        buttonElement.onmouseenter = () => { buttonElement.textContent = 'フォロー解除'; };
        buttonElement.onmouseleave = () => { buttonElement.textContent = 'フォロー中'; };
    } else {
        buttonElement.textContent = 'フォロー';
        buttonElement.classList.add('follow-button-not-following');
        buttonElement.onmouseenter = null;
        buttonElement.onmouseleave = null;
    }
    buttonElement.disabled = false;
}

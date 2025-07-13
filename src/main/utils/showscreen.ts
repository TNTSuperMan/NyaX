import dom from "../dom";

export function showScreen(screenId: string) {
    dom.screens.forEach(screen => {
                if (!screen.classList.contains('hidden')) {
            screen.classList.add('hidden');
        }
    });
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.remove('hidden');
    }
}

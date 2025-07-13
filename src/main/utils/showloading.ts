import dom from "../dom";

export function showLoading(show: boolean) {
    dom.loadingOverlay?.classList.toggle('hidden', !show);
}

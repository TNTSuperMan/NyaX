export default {
    mainContent: document.getElementById('main-content')!,
    navMenuTop: document.getElementById('nav-menu-top')!,
    navMenuBottom: document.getElementById('nav-menu-bottom')!,
    pageHeader: document.getElementById('page-header')!,
    screens: document.querySelectorAll('.screen')!,
    postFormContainer: document.querySelector('.post-form-container')!,
    postModal: document.getElementById('post-modal')!,
    editPostModal: document.getElementById('edit-post-modal')!,
    editPostModalContent: document.getElementById('edit-post-modal-content')!,
    createDmModal: document.getElementById('create-dm-modal')!,
    createDmModalContent: document.getElementById('create-dm-modal-content')!,
    dmManageModal: document.getElementById('dm-manage-modal')!,
    dmManageModalContent: document.getElementById('dm-manage-modal-content')!,
    // ▼▼▼ この2行を追加 ▼▼▼
    editDmMessageModal: document.getElementById('edit-dm-message-modal')!,
    editDmMessageModalContent: document.getElementById('edit-dm-message-modal-content')!,
    // ▲▲▲ 追加ここまで ▲▲▲
    connectionErrorOverlay: document.getElementById('connection-error-overlay')!,
    retryConnectionBtn: document.getElementById('retry-connection-btn')!,
    friezeOverlay: document.getElementById('frieze-overlay')!, // ★★★ この行を追加
    friezeReason: document.getElementById('frieze-reason')!, // ★★★ この行を追加
    imagePreviewModal: document.getElementById('image-preview-modal')!,
    imagePreviewModalContent: document.getElementById('image-preview-modal-content')!,
    timeline: document.getElementById('timeline')!,
    exploreContent: document.getElementById('explore-content')!,
    notificationsContent: document.getElementById('notifications-content')!,
    likesContent: document.getElementById('likes-content')!,
    starsContent: document.getElementById('stars-content')!,
    postDetailContent: document.getElementById('post-detail-content')!,
    searchResultsScreen: document.getElementById('search-results-screen')!,
    searchResultsContent: document.getElementById('search-results-content')!,
    dmScreen: document.getElementById('dm-screen')!,
    dmContent: document.getElementById('dm-content')!,
    loadingOverlay: document.getElementById('loading-overlay')!,
    loginBanner: document.getElementById('login-banner')!,
    rightSidebar: {
        recommendations: document.getElementById('recommendations-widget-container')!,
        searchWidget: document.getElementById('right-sidebar-search-widget-container')!
    }
};

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Auth Check (Consistente con Dashboard)
    const checkAuth = () => {
        const token = localStorage.getItem("auravid-token");
        const userData = localStorage.getItem("auravid-user");

        if (!token || !userData) {
            window.location.href = "login.html";
            return;
        }

        const user = JSON.parse(userData);
        const nameEl = document.getElementById('user-name');
        const roleEl = document.getElementById('user-role');
        const avatarEl = document.getElementById('user-avatar');

        if(nameEl) nameEl.textContent = user.name || "User";
        if(roleEl) roleEl.textContent = user.role || "Viewer";
        if(avatarEl) avatarEl.textContent = (user.name || "U").substring(0, 2).toUpperCase();
    };

    // 2. Mobile Menu
    const initMenu = () => {
        const menuBtn = document.getElementById('mobile-menu-btn');
        const sidebar = document.getElementById('sidebar');

        if (menuBtn && sidebar) {
            menuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
            document.addEventListener('mousedown', (e) => {
                if (window.innerWidth < 768 && !sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
                    sidebar.classList.remove('active');
                }
            });
        }
    };

    checkAuth();
    initMenu();
});
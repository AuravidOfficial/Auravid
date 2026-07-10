document.addEventListener('DOMContentLoaded', () => {
    // --- 1. SESSION & AUTH LOGIC ---
    const checkAuth = () => {
        const token = localStorage.getItem("auravid-token");
        const userData = localStorage.getItem("auravid-user");

        if (!token || !userData) {
            window.location.href = "login.html";
            return;
        }

        const user = JSON.parse(userData);
        
        // Elementos a actualizar
        const nameEl = document.getElementById('user-name');
        const welcomeEl = document.getElementById('welcome-name');
        const roleEl = document.getElementById('user-role');
        const avatarEl = document.getElementById('user-avatar');

        if(nameEl) nameEl.textContent = user.name || user.email.split('@')[0];
        if(welcomeEl) welcomeEl.textContent = user.name || user.email.split('@')[0];
        if(roleEl) roleEl.textContent = user.role;
        
        const initials = (user.name || user.email).substring(0, 2).toUpperCase();
        if(avatarEl) avatarEl.textContent = initials;
    };

    // --- 2. MENU INTERACTIVITY ---
    const initMenu = () => {
        const menuBtn = document.getElementById('mobile-menu-btn');
        const sidebar = document.getElementById('sidebar');

        if (menuBtn && sidebar) {
            menuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });

            // Cerrar menú al hacer click fuera
            document.addEventListener('mousedown', (e) => {
                if (window.innerWidth < 768 && !sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
                    sidebar.classList.remove('active');
                }
            });
        }
    };

    /* --- 3. CHARTS SIMULATION (MOCK) --- */
    const initCharts = () => {
        // Configuraciones globales de Chart.js para estilo oscuro
        if (window.Chart) {
            Chart.defaults.color = '#9ca3af';
            Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.05)';
        } else {
            return;
        }

        // GRÁFICO 1: Emissions Trend (Line Chart)
        const ctx1 = document.getElementById('emissionsChart');
        if (ctx1) {
            new Chart(ctx1, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                    datasets: [{
                        label: 'Total Emissions (tCO2e)',
                        data: [150, 145, 130, 135, 120, 110, 95, 88], // Datos falsos descendentes
                        borderColor: '#22c55e', // Green 500
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 2,
                        pointBackgroundColor: '#000'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        }

        // GRÁFICO 2: Scope Breakdown (Doughnut)
        const ctx2 = document.getElementById('scopeChart');
        if (ctx2) {
            new Chart(ctx2, {
                type: 'doughnut',
                data: {
                    labels: ['Scope 1 (Direct)', 'Scope 2 (Energy)', 'Scope 3 (Supply Chain)'],
                    datasets: [{
                        data: [15, 25, 60],
                        backgroundColor: [
                            '#3b82f6', // Blue
                            '#a855f7', // Purple
                            '#22c55e'  // Green
                        ],
                        borderWidth: 0,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { usePointStyle: true, padding: 20 }
                        }
                    },
                    cutout: '70%' // Hace el anillo más fino
                }
            });
        }
    };

    // Inicializar todo
    checkAuth();
    initMenu();
    initCharts();
});

document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos del DOM
    const generateBtn = document.getElementById('generate-brief-btn');
    const modal = document.getElementById('brief-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');

    // 1. Abrir Modal
    if(generateBtn) {
        generateBtn.addEventListener('click', function(e) {
            e.preventDefault(); // Evita comportamiento por defecto si fuera un link
            modal.classList.remove('hidden');
            // Pequeño timeout para permitir que la transición CSS funcione
            setTimeout(() => {
                modal.classList.add('active');
            }, 10);
        });
    }

    // 2. Cerrar Modal (Botón X)
    if(closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // 3. Cerrar Modal (Click fuera del contenido)
    if(modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Función para cerrar con animación
    function closeModal() {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300); // Espera a que termine la animación CSS (0.3s)
    }

    // 4. Cerrar con tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

});

// Función simulada para cuando seleccionas una opción
function selectBrief(type) {
    const modal = document.getElementById('brief-modal');
    
    // Aquí iría tu lógica real (ej: redirigir o llamar a una API)
    console.log(`Generating ${type} brief...`);
    
    // Feedback visual (opcional)
    const content = modal.querySelector('.modal-content');
    content.innerHTML = `
        <div style="text-align:center; padding: 20px;">
            <i class="fas fa-circle-notch fa-spin" style="font-size: 30px; color: #22c55e; margin-bottom: 15px;"></i>
            <h3>Generating ${type} Report</h3>
            <p style="color: #9ca3af; font-size: 12px;">Please wait while AI compiles the data...</p>
        </div>
    `;

    // Simular cierre después de 2 segundos
    setTimeout(() => {
        location.reload(); // O cerrar el modal
    }, 2000);
}
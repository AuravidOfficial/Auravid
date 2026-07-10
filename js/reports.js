document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Auth Check
    const checkAuth = () => {
        const token = localStorage.getItem("auravid-token");
        if (!token) window.location.href = "login.html";
        
        const user = JSON.parse(localStorage.getItem("auravid-user") || "{}");
        const nameEl = document.getElementById('user-name');
        if(nameEl) nameEl.textContent = user.name || "User";
        
        const avatarEl = document.getElementById('user-avatar');
        if(avatarEl) avatarEl.textContent = (user.name || "U").substring(0, 2).toUpperCase();
    };
    checkAuth();

    /* ============================================================
       LOGIC DE HISTORIAL Y FILTROS
       ============================================================ */
    
    const tableBody = document.getElementById('history-table-body');
    const countDisplay = document.getElementById('count-display');
    const searchInput = document.getElementById('table-search');
    const filterBtn = document.getElementById('filter-btn');
    const filterDropdown = document.getElementById('filter-dropdown');
    const filterOptions = document.querySelectorAll('.filter-option');

    // Estado actual de los filtros
    let currentSearch = "";
    let currentStatusFilter = "All";

    // DATOS MOCKUP
    const MOCK_FILES = [
        { name: "electricity_bill_nov_2025.pdf", date: "2025-11-02", size: "2.4 MB", type: "pdf", status: "Processed" },
        { name: "logistics_fleet_data_q3.xlsx", date: "2025-10-28", size: "840 KB", type: "xls", status: "Processed" },
        { name: "factory_heating_logs.csv", date: "2025-10-25", size: "120 KB", type: "csv", status: "Processed" },
        { name: "pending_invoice_scan.pdf", date: "2025-10-24", size: "4.1 MB", type: "pdf", status: "Pending" },
        { name: "corrupted_dump_v2.csv", date: "2025-10-15", size: "12 KB", type: "csv", status: "Error" },
        { name: "supply_chain_manifest.xlsx", date: "2025-09-30", size: "1.2 MB", type: "xls", status: "Processed" },
        { name: "water_usage_report.pdf", date: "2025-09-28", size: "1.8 MB", type: "pdf", status: "Processed" },
        { name: "upload_error_log.txt", date: "2025-09-20", size: "4 KB", type: "csv", status: "Error" },
    ];

    // --- FUNCIÓN DE RENDERIZADO (CON FILTROS) ---
    function renderHistory() {
        tableBody.innerHTML = ""; 

        // 1. Filtrar Datos
        const filteredFiles = MOCK_FILES.filter(file => {
            const matchesSearch = file.name.toLowerCase().includes(currentSearch.toLowerCase());
            const matchesStatus = currentStatusFilter === "All" || file.status === currentStatusFilter;
            return matchesSearch && matchesStatus;
        });

        // 2. Si no hay resultados
        if (filteredFiles.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center" style="padding: 30px; color: #666;">
                        <i class="fas fa-search" style="margin-bottom: 8px; font-size: 20px;"></i><br>
                        No files found matching your filters.
                    </td>
                </tr>
            `;
            if(countDisplay) countDisplay.textContent = 0;
            return;
        }

        // 3. Generar Filas
        filteredFiles.forEach(file => {
            const row = document.createElement('tr');
            
            let iconClass = "fa-file";
            if(file.type === 'pdf') iconClass = "fa-file-pdf pdf";
            if(file.type === 'xls') iconClass = "fa-file-excel xls";
            if(file.type === 'csv') iconClass = "fa-file-csv csv";

            let statusClass = "status-processed";
            if(file.status === 'Pending') statusClass = "status-pending";
            if(file.status === 'Error') statusClass = "status-error";

            row.innerHTML = `
                <td>
                    <div class="file-name-cell">
                        <i class="fas ${iconClass} file-icon"></i>
                        ${file.name}
                    </div>
                </td>
                <td>${file.date}</td>
                <td>${file.type.toUpperCase()}</td>
                <td>${file.size}</td>
                <td><span class="status-badge ${statusClass}">${file.status}</span></td>
                <td class="text-right">
                    <button class="action-btn" title="Download"><i class="fas fa-download"></i></button>
                    <button class="action-btn delete" title="Delete"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        if(countDisplay) countDisplay.textContent = filteredFiles.length;
    }

    // --- EVENT LISTENERS ---

    // 1. Búsqueda (Search)
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        renderHistory();
    });

    // 2. Botón Filtro (Toggle Dropdown)
    filterBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar cerrar inmediatamente
        filterDropdown.classList.toggle('show');
        filterDropdown.classList.toggle('hidden'); // Si usas display:none
    });

    // 3. Seleccionar Opción de Filtro
    filterOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Actualizar estado visual
            filterOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            // Actualizar lógica
            currentStatusFilter = option.getAttribute('data-status');
            
            // Actualizar texto del botón
            const btnText = filterBtn.querySelector('span');
            if(btnText) btnText.textContent = currentStatusFilter === "All" ? "All Statuses" : currentStatusFilter;

            // Cerrar dropdown y renderizar
            filterDropdown.classList.remove('show');
            filterDropdown.classList.add('hidden');
            renderHistory();
        });
    });

    // 4. Cerrar dropdown al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!filterBtn.contains(e.target) && !filterDropdown.contains(e.target)) {
            filterDropdown.classList.remove('show');
            filterDropdown.classList.add('hidden');
        }
    });

    // Inicializar
    renderHistory();
});
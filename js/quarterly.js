document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('quarterly-table-body');
    const totalCountEl = document.getElementById('total-reports-count');
    const yearFilter = document.getElementById('year-filter');
    const refreshBtn = document.getElementById('refresh-btn');

    // DATOS MOCK: Reportes generados por la IA (Más datos dummy)
    const REPORTS_DB = [
        {
            id: "R-001",
            name: "Q4 2024 Sustainability Report",
            year: "2024",
            period: "Q4 (Oct - Dec)",
            generatedDate: "2025-01-15",
            status: "Ready",
            emissions: "1,240 tCO2e",
            fileSize: "2.4 MB"
        },
        {
            id: "R-002",
            name: "Q3 2024 Sustainability Report",
            year: "2024",
            period: "Q3 (Jul - Sep)",
            generatedDate: "2024-10-12",
            status: "Ready",
            emissions: "1,150 tCO2e",
            fileSize: "2.2 MB"
        },
        {
            id: "R-003",
            name: "Q2 2024 Sustainability Report",
            year: "2024",
            period: "Q2 (Apr - Jun)",
            generatedDate: "2024-07-10",
            status: "Ready",
            emissions: "1,100 tCO2e",
            fileSize: "2.1 MB"
        },
        {
            id: "R-004",
            name: "Q1 2024 Sustainability Report",
            year: "2024",
            period: "Q1 (Jan - Mar)",
            generatedDate: "2024-04-14",
            status: "Ready",
            emissions: "1,050 tCO2e",
            fileSize: "2.0 MB"
        },
        {
            id: "R-005",
            name: "Q1 2025 Preliminary Analysis",
            year: "2025",
            period: "Q1 (Jan - Mar)",
            generatedDate: "2025-02-10",
            status: "Ready",
            emissions: "1,103 tCO2e",
            fileSize: "-"
        },
        // --- DUMMY GENERATED DATA EXTRA ---
        {
            id: "R-006",
            name: "Annual Summary 2023",
            year: "2023",
            period: "Annual",
            generatedDate: "2024-01-20",
            status: "Ready",
            emissions: "4,500 tCO2e",
            fileSize: "5.5 MB"
        },
        {
            id: "R-007",
            name: "Q4 2023 Sustainability Report",
            year: "2023",
            period: "Q4 (Oct - Dec)",
            generatedDate: "2024-01-10",
            status: "Ready",
            emissions: "1,120 tCO2e",
            fileSize: "2.3 MB"
        },
        {
            id: "R-009",
            name: "Q2 2023 Sustainability Report",
            year: "2023",
            period: "Q2 (Apr - Jun)",
            generatedDate: "2023-07-12",
            status: "Ready",
            emissions: "1,150 tCO2e",
            fileSize: "2.0 MB"
        },
        {
            id: "R-010",
            name: "Q1 2023 Sustainability Report",
            year: "2023",
            period: "Q1 (Jan - Mar)",
            generatedDate: "2023-04-18",
            status: "Ready",
            emissions: "1,140 tCO2e",
            fileSize: "2.1 MB"
        }
    ];

    // Función para renderizar la tabla
    function renderReports(year = 'all') {
        tableBody.innerHTML = ''; // Limpiar tabla

        // Filtrar datos
        const filteredData = REPORTS_DB.filter(report => {
            if (year === 'all') return true;
            return report.year === year;
        });

        // Actualizar contador
        totalCountEl.textContent = filteredData.length;

        if (filteredData.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center" style="padding: 40px;">
                        No reports found for this period.
                    </td>
                </tr>
            `;
            return;
        }

        // Generar filas
        filteredData.forEach(report => {
            // Determinar clase del badge
            let badgeClass = 'status-draft';
            let btnHtml = '';

            if (report.status === 'Ready') {
                badgeClass = 'status-ready';
                btnHtml = `<a href="#" class="btn-download" onclick="downloadMock('${report.name}')">
                             <i class="fas fa-download"></i> PDF
                           </a>`;
            } else if (report.status === 'Processing') {
                badgeClass = 'status-processing';
                btnHtml = `<span style="color: #60a5fa; font-size: 11px;"><i class="fas fa-cog fa-spin"></i> Generating...</span>`;
            } else {
                // Draft
                btnHtml = `<span style="color: #fbbf24; font-size: 11px;">Editing</span>`;
            }

            const row = `
                <tr>
                    <td>
                        <div class="report-name-cell">
                            <i class="fas fa-file-pdf file-icon"></i>
                            <span>${report.name}</span>
                        </div>
                    </td>
                    <td>${report.period}</td>
                    <td>${formatDate(report.generatedDate)}</td>
                    <td>
                        <span class="status-badge ${badgeClass}">${report.status}</span>
                    </td>
                    <td>${report.emissions}</td>
                    <td class="text-right">
                        ${btnHtml}
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    }

    // Utilidad simple para fecha
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Event Listeners
    yearFilter.addEventListener('change', (e) => {
        renderReports(e.target.value);
    });

    refreshBtn.addEventListener('click', () => {
        const icon = refreshBtn.querySelector('i');
        icon.classList.add('fa-spin');
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center loading-state">
                    <i class="fas fa-circle-notch fa-spin"></i> Refreshing data...
                </td>
            </tr>
        `;
        setTimeout(() => {
            icon.classList.remove('fa-spin');
            renderReports(yearFilter.value);
        }, 800);
    });

    // Función global para simular descarga
    window.downloadMock = function(filename) {
        alert(`Downloading: ${filename}.pdf\n\n(This is a demo file generated by Auravid AI)`);
    };

    // Inicializar
    setTimeout(() => {
        renderReports();
    }, 500); 
});
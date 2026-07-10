document.addEventListener('DOMContentLoaded', () => {
    
    // Configuración del Gráfico de Dona
    const ctx = document.getElementById('scopesChart').getContext('2d');

    // Datos (Coinciden con el HTML estático)
    const dataValues = [186, 310, 744]; // S1, S2, S3
    const total = 1240;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Scope 1', 'Scope 2', 'Scope 3'],
            datasets: [{
                data: dataValues,
                backgroundColor: [
                    '#ef4444', // Scope 1 (Rojo/Naranja)
                    '#3b82f6', // Scope 2 (Azul)
                    '#22c55e'  // Scope 3 (Verde)
                ],
                borderWidth: 0,
                // Esto hace que el sector se agrande al pasar el mouse
                hoverOffset: 15 
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%', // Hace el agujero del centro más grande
            
            // --- AJUSTE CLAVE ---
            layout: {
                // El padding de 20px empuja el gráfico hacia adentro.
                // Esto permite que el gráfico tenga espacio para expandirse (hoverOffset)
                // sin que el contenedor lo corte, manteniendo el tamaño visual controlado.
                padding: 20 
            },
            // --------------------

            plugins: {
                legend: {
                    display: false // Ocultamos la leyenda por defecto de Chart.js
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    padding: 12,
                    bodyFont: { family: 'Inter', size: 13 },
                    callbacks: {
                        label: function(context) {
                            let val = context.raw;
                            let percentage = Math.round((val / total) * 100);
                            return ` ${val} tCO2e (${percentage}%)`;
                        }
                    }
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });

});
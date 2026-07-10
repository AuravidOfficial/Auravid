document.addEventListener('DOMContentLoaded', () => {
    
    /* --- CONFIGURACIÓN DE AZURE (COMENTADA PARA FUTURO USO) --- */
    /*
    const ACCOUNT_NAME = "tucuentaazure"; 
    const CONTAINER_NAME = "auravid-uploads"; 
    
    async function getSasToken() {
        // Aquí iría el fetch a tu backend
        return ""; 
    }
    */

    /* --- Referencias al DOM --- */
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const terminal = document.getElementById('terminal-content');
    const queueList = document.getElementById('file-queue-list');
    const queueCount = document.getElementById('queue-count');
    
    const addLog = (msg, type = 'info') => {
        const line = document.createElement('div');
        let className = 'log-line';
        if (type === 'success') className += ' log-success';
        if (type === 'error') className += ' log-error';
        
        line.className = className;
        line.innerHTML = `> ${msg}`;
        terminal.appendChild(line);
        terminal.scrollTop = terminal.scrollHeight;
    };

    addLog("System initialized. Waiting for files...");

    /* --- Event Listeners --- */
    dropZone.onclick = () => fileInput.click();
    
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#22c55e';
        dropZone.style.backgroundColor = 'rgba(34, 197, 94, 0.1)';
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'transparent';
        dropZone.style.backgroundColor = 'transparent';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'transparent';
        dropZone.style.backgroundColor = 'transparent';
        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    });

    fileInput.onchange = (e) => handleFiles(e.target.files);

    /* ============================================================
       CÓDIGO DE SUBIDA
       ============================================================ */

    /* --- OPCIÓN A: SIMULACIÓN (MOCK) - ACTIVO AHORA --- */
    async function handleFiles(files) {
        const totalFiles = files.length;
        queueCount.textContent = `${totalFiles} Active`;
        
        for (let file of files) {
            // UI: Crear item en la cola
            const item = document.createElement('div');
            item.className = 'queue-item';
            const statusSpan = document.createElement('span');
            statusSpan.className = 'text-processing';
            statusSpan.innerText = 'Analyzing...';
            
            item.innerHTML = `<span>${file.name}</span>`;
            item.appendChild(statusSpan);
            queueList.appendChild(item);

            try {
                addLog(`Reading file metadata: ${file.name}...`);
                
                // Simular tiempo de espera de red
                await new Promise(r => setTimeout(r, 800));
                
                addLog(`Starting upload (Simulated)...`);

                // Simular progreso 0% a 100%
                for (let i = 0; i <= 100; i += 20) {
                    statusSpan.innerText = `${i}%`;
                    await new Promise(r => setTimeout(r, 300)); // Pausa visual
                }

                // Éxito simulado
                statusSpan.innerText = 'Done';
                statusSpan.className = 'text-success';
                addLog(`Upload Complete: ${file.name}`, 'success');
                addLog(`AI Processing triggered automatically.`, 'info');

            } catch (error) {
                console.error(error);
                statusSpan.innerText = 'Error';
                statusSpan.className = 'text-error';
                addLog(`Failed: ${error.message}`, 'error');
            }
        }
    }

    /* --- OPCIÓN B: CÓDIGO REAL DE AZURE (COMENTADO) --- */
    /*
    async function handleFiles(files) {
        const totalFiles = files.length;
        queueCount.textContent = `${totalFiles} Active`;
        
        if (!window.AzureStorageBlob) {
            addLog("Error: Azure SDK not loaded.", 'error');
            return;
        }

        const { BlobServiceClient } = window.AzureStorageBlob;

        for (let file of files) {
            const item = document.createElement('div');
            item.className = 'queue-item';
            const statusSpan = document.createElement('span');
            statusSpan.className = 'text-processing';
            statusSpan.innerText = 'Auth...';
            
            item.innerHTML = `<span>${file.name}</span>`;
            item.appendChild(statusSpan);
            queueList.appendChild(item);

            try {
                addLog(`Requesting Secure Access (SAS) for: ${file.name}...`);
                const sasToken = await getSasToken();

                if (!sasToken) throw new Error("Missing SAS Token.");

                const blobServiceClient = new BlobServiceClient(
                    `https://${ACCOUNT_NAME}.blob.core.windows.net${sasToken}`
                );
                const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
                const blockBlobClient = containerClient.getBlockBlobClient(file.name);

                statusSpan.innerText = '0%';
                addLog(`Uploading to Blob Storage...`);

                await blockBlobClient.uploadBrowserData(file, {
                    maxSingleShotSize: 4 * 1024 * 1024,
                    onProgress: (ev) => {
                        const percent = Math.round((ev.loadedBytes / file.size) * 100);
                        statusSpan.innerText = `${percent}%`;
                    }
                });

                statusSpan.innerText = 'Done';
                statusSpan.className = 'text-success';
                addLog(`Upload Complete: ${file.name}`, 'success');
                addLog(`Triggering Azure Document Intelligence...`, 'info');

            } catch (error) {
                console.error(error);
                statusSpan.innerText = 'Error';
                statusSpan.className = 'text-error';
                addLog(`Failed: ${error.message}`, 'error');
            }
        }
    }
    */
});
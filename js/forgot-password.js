document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("forgot-form");
    const errorMsg = document.getElementById("error-msg");
    const successMsg = document.getElementById("success-msg");
    const submitBtn = document.querySelector('.btn-auth');
    const emailInput = document.getElementById("email");

    // Base de datos Mock
    const USERS = [
        { email: "admin@auravid.com" },
        { email: "user@auravid.com" }
    ];

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // 1. Aseguramos que todo esté oculto al iniciar el clic
        errorMsg.classList.add("hidden");
        successMsg.classList.add("hidden");
        
        // UI de carga
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = "Sending...";
        submitBtn.style.opacity = "0.7";
        submitBtn.disabled = true;
        
        const email = emailInput.value.trim();

        // 2. Simulamos espera (1.5s)
        setTimeout(() => {
            
            const userExists = USERS.some(u => u.email === email);

            if (userExists) {
                // Éxito: AQUÍ se muestra el mensaje
                successMsg.classList.remove("hidden");
                form.reset();
                submitBtn.innerText = "Sent";
            } else {
                // Error: Email no encontrado
                errorMsg.classList.remove("hidden");
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = "1";
            }

        }, 1500); 
    });
    
    // Resetear UI si el usuario escribe de nuevo
    emailInput.addEventListener('input', () => {
        if(submitBtn.innerText === "Sent") {
             submitBtn.innerText = "Send Reset Link";
             submitBtn.disabled = false;
             submitBtn.style.opacity = "1";
             successMsg.classList.add("hidden");
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("login-form");
    const errorMsg = document.getElementById("error-msg");
    const submitBtn = document.querySelector('.btn-auth');

    // Mockup de base de datos de usuarios
    const USERS = [
        {
            id: 1,
            email: "admin@auravid.com",
            password: "auravid123",
            role: "Admin",
            name: "Juan Blanco"
        },
        {
            id: 2,
            email: "user@auravid.com",
            password: "user123",
            role: "User",
            name: "Standard User"
        }
    ];

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Limpiar errores previos y UI de carga
        errorMsg.classList.add("hidden");
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = "Authenticating...";
        submitBtn.style.opacity = "0.7";
        
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        // Simular retraso de red (1 segundo)
        setTimeout(() => {
            
            // Buscar usuario en la base de datos local
            const user = USERS.find(
                u => u.email === email && u.password === password
            );

            if (!user) {
                // Mostrar error si no existe o clave incorrecta
                errorMsg.classList.remove("hidden");
                submitBtn.innerText = originalBtnText;
                submitBtn.style.opacity = "1";
                return;
            }

            // Crear un token falso (Base64)
            const token = btoa(JSON.stringify({
                id: user.id,
                email: user.email,
                role: user.role,
                loginAt: Date.now()
            }));

            // Guardar sesión en el navegador
            localStorage.setItem("auravid-token", token);
            localStorage.setItem("auravid-user", JSON.stringify(user));

            // Redirigir al dashboard
            window.location.href = "dashboard.html";

        }, 1000); // 1000ms de retraso
    });
});
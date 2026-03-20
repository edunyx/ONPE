// Navegación entre fases
const navButtons = document.querySelectorAll('.nav-btn');
const phaseSections = document.querySelectorAll('.phase-section');

navButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetPhase = button.dataset.phase;
        
        // Actualizar botones activos
        navButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Mostrar sección correspondiente
        phaseSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === targetPhase) {
                section.classList.add('active');
            }
        });
        
        // Scroll suave al inicio de la sección
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// Funcionalidad de acordeón para los pasos
const stepHeaders = document.querySelectorAll('.step-header');

stepHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const stepCard = header.parentElement;
        stepCard.classList.toggle('collapsed');
    });
});

// Expandir todos los pasos por defecto al cargar
document.addEventListener('DOMContentLoaded', () => {
    // Todos los pasos están expandidos por defecto
    // Si se desea que inicien colapsados, descomentar la siguiente línea:
    // document.querySelectorAll('.step-card').forEach(card => card.classList.add('collapsed'));
});

// Atajos de teclado para navegación rápida
document.addEventListener('keydown', (e) => {
    // Alt + 1, 2, 3 para cambiar de fase
    if (e.altKey) {
        if (e.key === '1') {
            navButtons[0].click();
        } else if (e.key === '2') {
            navButtons[1].click();
        } else if (e.key === '3') {
            navButtons[2].click();
        }
    }
});

// Animación suave al hacer scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar las tarjetas de pasos
document.querySelectorAll('.step-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});

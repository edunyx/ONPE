// ============================================
// SISTEMA DE TEMA CLARO/OSCURO
// ============================================
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeText = document.getElementById('themeText');

// Cargar tema guardado o usar modo claro por defecto
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeIcon.textContent = '☀️';
    themeText.textContent = 'Modo Claro';
} else {
    // Por defecto: Modo Claro
    document.body.classList.add('light-mode');
    themeIcon.textContent = '🌙';
    themeText.textContent = 'Modo Oscuro';
    localStorage.setItem('theme', 'light');
}

// Toggle de tema
themeToggle.addEventListener('click', () => {
    if (document.body.classList.contains('dark-mode')) {
        // Cambiar a modo claro
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
        themeIcon.textContent = '🌙';
        themeText.textContent = 'Modo Oscuro';
        localStorage.setItem('theme', 'light');
        vibrateDevice(10);
    } else {
        // Cambiar a modo oscuro
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Modo Claro';
        localStorage.setItem('theme', 'dark');
        vibrateDevice(10);
    }
});

// ============================================
// SISTEMA DE NAVEGACIÓN ENTRE FASES
// ============================================
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
        
        // Actualizar progreso
        updateProgress();
        
        // Scroll suave al inicio
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Guardar fase actual en localStorage
        localStorage.setItem('currentPhase', targetPhase);
    });
});

// ============================================
// SISTEMA DE CHECKLIST INTERACTIVO
// ============================================
const stepCheckboxes = document.querySelectorAll('.step-checkbox');

stepCheckboxes.forEach(checkbox => {
    // Restaurar estado desde localStorage
    const savedState = localStorage.getItem(checkbox.id);
    if (savedState === 'checked') {
        checkbox.checked = true;
        checkbox.closest('.step-card').classList.add('completed');
    }
    
    checkbox.addEventListener('change', function() {
        const stepCard = this.closest('.step-card');
        
        if (this.checked) {
            // Marcar como completado
            stepCard.classList.add('completed');
            
            // Guardar estado
            localStorage.setItem(this.id, 'checked');
            
            // Colapsar el paso actual después de 300ms
            setTimeout(() => {
                stepCard.classList.add('collapsed');
            }, 300);
            
            // Abrir el siguiente paso automáticamente
            setTimeout(() => {
                openNextStep(stepCard);
            }, 400);
            
        } else {
            // Desmarcar
            stepCard.classList.remove('completed');
            localStorage.removeItem(this.id);
        }
        
        // Actualizar progreso
        updateProgress();
    });
});

// Función para abrir el siguiente paso
function openNextStep(currentCard) {
    const allCards = Array.from(document.querySelectorAll('.phase-section.active .step-card:not(.hidden-by-filter)'));
    const currentIndex = allCards.indexOf(currentCard);
    
    if (currentIndex < allCards.length - 1) {
        const nextCard = allCards[currentIndex + 1];
        nextCard.classList.remove('collapsed');
        
        // Scroll suave al siguiente paso
        setTimeout(() => {
            nextCard.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 100);
    }
}

// ============================================
// SISTEMA DE ACORDEÓN (EXPANDIR/CONTRAER)
// ============================================
const stepHeaders = document.querySelectorAll('.step-header');

stepHeaders.forEach(header => {
    header.addEventListener('click', (e) => {
        // Evitar que el click en el checkbox active el acordeón
        if (e.target.classList.contains('step-checkbox') || 
            e.target.classList.contains('checkbox-label')) {
            return;
        }
        
        const stepCard = header.parentElement;
        stepCard.classList.toggle('collapsed');
    });
});

// ============================================
// SISTEMA DE FILTROS POR ROL
// ============================================
const filterToggle = document.getElementById('filterToggle');
const roleFilterPanel = document.getElementById('roleFilterPanel');
const applyFilterBtn = document.getElementById('applyFilter');
const filterMM = document.getElementById('filterMM');
const filterCM = document.getElementById('filterCM');
const filterCritical = document.getElementById('filterCritical');

// Toggle del panel de filtros
filterToggle.addEventListener('click', () => {
    roleFilterPanel.classList.toggle('active');
});

// Cerrar panel al hacer click fuera
document.addEventListener('click', (e) => {
    if (!e.target.closest('.role-filter-container')) {
        roleFilterPanel.classList.remove('active');
    }
});

// Aplicar filtros
applyFilterBtn.addEventListener('click', () => {
    applyRoleFilters();
    roleFilterPanel.classList.remove('active');
    
    // Guardar preferencias
    localStorage.setItem('filterMM', filterMM.checked);
    localStorage.setItem('filterCM', filterCM.checked);
    localStorage.setItem('filterCritical', filterCritical.checked);
});

function applyRoleFilters() {
    const showMM = filterMM.checked;
    const showCM = filterCM.checked;
    const showCritical = filterCritical.checked;
    
    const allStepCards = document.querySelectorAll('.step-card');
    
    allStepCards.forEach(card => {
        const roles = card.dataset.roles || '';
        const isCritical = card.dataset.critical === 'true';
        
        let shouldShow = false;
        
        // Verificar si debe mostrarse según los filtros
        if (isCritical && showCritical) {
            shouldShow = true;
        } else if (roles.includes('mm') && showMM) {
            shouldShow = true;
        } else if (roles.includes('cm') && showCM) {
            shouldShow = true;
        }
        
        // Aplicar visibilidad
        if (shouldShow) {
            card.classList.remove('hidden-by-filter');
        } else {
            card.classList.add('hidden-by-filter');
        }
    });
    
    updateProgress();
}

// Restaurar filtros guardados
function restoreFilters() {
    const savedMM = localStorage.getItem('filterMM');
    const savedCM = localStorage.getItem('filterCM');
    const savedCritical = localStorage.getItem('filterCritical');
    
    if (savedMM !== null) filterMM.checked = savedMM === 'true';
    if (savedCM !== null) filterCM.checked = savedCM === 'true';
    if (savedCritical !== null) filterCritical.checked = savedCritical === 'true';
    
    // Aplicar filtros si hay alguno guardado
    if (savedMM !== null || savedCM !== null || savedCritical !== null) {
        applyRoleFilters();
    }
}

// ============================================
// SISTEMA DE PROGRESO
// ============================================
function updateProgress() {
    const activePhase = document.querySelector('.phase-section.active');
    if (!activePhase) return;
    
    const visibleSteps = activePhase.querySelectorAll('.step-card:not(.hidden-by-filter)');
    const completedSteps = activePhase.querySelectorAll('.step-card:not(.hidden-by-filter).completed');
    
    const total = visibleSteps.length;
    const completed = completedSteps.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    document.getElementById('progressCurrent').textContent = completed;
    document.getElementById('progressTotal').textContent = total;
    document.getElementById('progressFill').style.width = percentage + '%';
}

// ============================================
// ATAJOS DE TECLADO
// ============================================
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
    
    // Espacio para expandir/contraer el paso enfocado
    if (e.key === ' ' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        const focusedCard = document.activeElement.closest('.step-card');
        if (focusedCard) {
            focusedCard.classList.toggle('collapsed');
        }
    }
});

// ============================================
// BOTÓN DE REINICIO (OPCIONAL)
// ============================================
function resetAllProgress() {
    if (confirm('¿Deseas reiniciar todo el progreso? Esta acción no se puede deshacer.')) {
        // Limpiar localStorage
        localStorage.clear();
        
        // Desmarcar todos los checkboxes
        stepCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
            checkbox.closest('.step-card').classList.remove('completed');
        });
        
        // Restaurar filtros por defecto
        filterMM.checked = true;
        filterCM.checked = true;
        filterCritical.checked = true;
        applyRoleFilters();
        
        // Actualizar progreso
        updateProgress();
        
        alert('Progreso reiniciado correctamente');
    }
}

// Agregar botón de reinicio al header (opcional)
// Descomentar si se desea esta funcionalidad
/*
const resetBtn = document.createElement('button');
resetBtn.textContent = '🔄 Reiniciar';
resetBtn.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 300; padding: 0.5rem 1rem; background: #dc2626; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;';
resetBtn.addEventListener('click', resetAllProgress);
document.body.appendChild(resetBtn);
*/

// ============================================
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Restaurar fase guardada
    const savedPhase = localStorage.getItem('currentPhase');
    if (savedPhase) {
        const phaseBtn = document.querySelector(`[data-phase="${savedPhase}"]`);
        if (phaseBtn) {
            phaseBtn.click();
        }
    }
    
    // Restaurar filtros
    restoreFilters();
    
    // Actualizar progreso inicial
    updateProgress();
    
    // Colapsar todos los pasos excepto el primero no completado
    const activePhase = document.querySelector('.phase-section.active');
    if (activePhase) {
        const steps = activePhase.querySelectorAll('.step-card:not(.hidden-by-filter)');
        let foundIncomplete = false;
        
        steps.forEach(step => {
            if (!step.classList.contains('completed') && !foundIncomplete) {
                step.classList.remove('collapsed');
                foundIncomplete = true;
            } else {
                step.classList.add('collapsed');
            }
        });
    }
});

// ============================================
// ANIMACIONES DE ENTRADA
// ============================================
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
    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    observer.observe(card);
});

// ============================================
// PREVENCIÓN DE PÉRDIDA DE DATOS
// ============================================
window.addEventListener('beforeunload', (e) => {
    // Guardar estado actual antes de cerrar
    const activePhase = document.querySelector('.phase-section.active');
    if (activePhase) {
        localStorage.setItem('currentPhase', activePhase.id);
    }
});

// ============================================
// MODO OFFLINE (PWA Ready)
// ============================================
if ('serviceWorker' in navigator) {
    // Preparado para implementar Service Worker si se necesita PWA
    // navigator.serviceWorker.register('/sw.js');
}

// ============================================
// FEEDBACK HÁPTICO (MÓVILES)
// ============================================
function vibrateDevice(duration = 10) {
    if ('vibrate' in navigator) {
        navigator.vibrate(duration);
    }
}

// Agregar vibración al marcar checkboxes
stepCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        vibrateDevice(10);
    });
});

// ============================================
// ESTADÍSTICAS DE USO (OPCIONAL)
// ============================================
function getUsageStats() {
    const stats = {
        instalacionCompleted: 0,
        sufragioCompleted: 0,
        escrutinioCompleted: 0,
        totalCompleted: 0
    };
    
    document.querySelectorAll('#instalacion .step-card.completed').forEach(() => stats.instalacionCompleted++);
    document.querySelectorAll('#sufragio .step-card.completed').forEach(() => stats.sufragioCompleted++);
    document.querySelectorAll('#escrutinio .step-card.completed').forEach(() => stats.escrutinioCompleted++);
    
    stats.totalCompleted = stats.instalacionCompleted + stats.sufragioCompleted + stats.escrutinioCompleted;
    
    return stats;
}

// Exponer función global para debugging
window.getStats = getUsageStats;

console.log('✅ Sistema de Guía Electoral ONPE 2026 cargado correctamente');
console.log('💡 Usa window.getStats() para ver estadísticas de progreso');

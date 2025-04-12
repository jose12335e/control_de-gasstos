// Elementos del DOM
const btnCambioTema = document.getElementById('btn-cambio-tema');
const iconoTema = document.querySelector('.icono-tema');
const modoOscuroCheckbox = document.getElementById('modo-oscuro');
const estadoModo = document.getElementById('estado-modo');

// Cargar el tema guardado al iniciar
document.addEventListener('DOMContentLoaded', () => {
    // Cargar configuración desde localStorage
    const configGuardada = localStorage.getItem('configuracion');
    const configuracion = configGuardada ? JSON.parse(configGuardada) : {
        modoOscuro: false
    };
    
    // Aplicar modo oscuro si está activado
    if (configuracion.modoOscuro) {
        document.body.classList.add('modo-oscuro');
        if (iconoTema) iconoTema.textContent = '☀️';
        if (estadoModo) estadoModo.textContent = 'Activado';
        if (modoOscuroCheckbox) modoOscuroCheckbox.checked = true;
    } else {
        document.body.classList.remove('modo-oscuro');
        if (iconoTema) iconoTema.textContent = '🌙';
        if (estadoModo) estadoModo.textContent = 'Desactivado';
        if (modoOscuroCheckbox) modoOscuroCheckbox.checked = false;
    }
});

// Función para cambiar el tema
function cambiarTema() {
    const modoOscuroActual = document.body.classList.contains('modo-oscuro');
    const nuevoModoOscuro = !modoOscuroActual;
    
    aplicarModoOscuro(nuevoModoOscuro);
    
    // Guardar preferencia en localStorage
    const configGuardada = localStorage.getItem('configuracion');
    const configuracion = configGuardada ? JSON.parse(configGuardada) : {};
    configuracion.modoOscuro = nuevoModoOscuro;
    localStorage.setItem('configuracion', JSON.stringify(configuracion));
}

// Función para aplicar el modo oscuro
function aplicarModoOscuro(activado) {
    if (activado) {
        document.body.classList.add('modo-oscuro');
        if (iconoTema) iconoTema.textContent = '☀️';
        if (estadoModo) estadoModo.textContent = 'Activado';
        if (modoOscuroCheckbox) modoOscuroCheckbox.checked = true;
    } else {
        document.body.classList.remove('modo-oscuro');
        if (iconoTema) iconoTema.textContent = '🌙';
        if (estadoModo) estadoModo.textContent = 'Desactivado';
        if (modoOscuroCheckbox) modoOscuroCheckbox.checked = false;
    }
}

// Event listener para el botón de cambio de tema
if (btnCambioTema) {
    btnCambioTema.addEventListener('click', cambiarTema);
}

// Event listener para el checkbox de modo oscuro
if (modoOscuroCheckbox) {
    modoOscuroCheckbox.addEventListener('change', () => {
        aplicarModoOscuro(modoOscuroCheckbox.checked);
        
        // Guardar preferencia en localStorage
        const configGuardada = localStorage.getItem('configuracion');
        const configuracion = configGuardada ? JSON.parse(configGuardada) : {};
        configuracion.modoOscuro = modoOscuroCheckbox.checked;
        localStorage.setItem('configuracion', JSON.stringify(configuracion));
    });
} 
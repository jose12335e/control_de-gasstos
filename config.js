// Clase para gestionar la configuración de la aplicación
class ConfiguracionApp {
    constructor() {
        this.configuracion = this.cargarConfiguracion();
        this.inicializarFormularios();
        this.inicializarEventos();
        this.actualizarInterfaz();
    }

    // Cargar configuración desde localStorage
    cargarConfiguracion() {
        const configGuardada = localStorage.getItem('configuracion');
        return configGuardada ? JSON.parse(configGuardada) : {
            limiteDiario: 0,
            diaInicioMes: 1,
            modoOscuro: false,
            nombreUsuario: '',
            correoUsuario: ''
        };
    }

    // Guardar configuración en localStorage
    guardarConfiguracion() {
        localStorage.setItem('configuracion', JSON.stringify(this.configuracion));
    }

    // Inicializar formularios con valores guardados
    inicializarFormularios() {
        // Formulario de límites
        const formLimites = document.getElementById('form-limites');
        const limiteDiario = document.getElementById('limite-diario');
        limiteDiario.value = this.configuracion.limiteDiario;

        // Formulario de mes financiero
        const formMesFinanciero = document.getElementById('form-mes-financiero');
        const diaInicioMes = document.getElementById('dia-inicio-mes');
        diaInicioMes.value = this.configuracion.diaInicioMes;

        // Modo oscuro
        const modoOscuro = document.getElementById('modo-oscuro');
        modoOscuro.checked = this.configuracion.modoOscuro;
        this.actualizarEstadoModoOscuro();

        // Formulario de perfil
        const formPerfil = document.getElementById('form-perfil');
        const nombreUsuario = document.getElementById('nombre-usuario');
        const correoUsuario = document.getElementById('correo-usuario');
        nombreUsuario.value = this.configuracion.nombreUsuario;
        correoUsuario.value = this.configuracion.correoUsuario;
    }

    // Inicializar eventos
    inicializarEventos() {
        // Evento para guardar límite diario
        const formLimites = document.getElementById('form-limites');
        formLimites.addEventListener('submit', (e) => {
            e.preventDefault();
            const limiteDiario = document.getElementById('limite-diario').value;
            this.configuracion.limiteDiario = parseFloat(limiteDiario);
            this.guardarConfiguracion();
            this.mostrarMensaje('Límite diario guardado correctamente');
        });

        // Evento para guardar día de inicio del mes financiero
        const formMesFinanciero = document.getElementById('form-mes-financiero');
        formMesFinanciero.addEventListener('submit', (e) => {
            e.preventDefault();
            const diaInicioMes = document.getElementById('dia-inicio-mes').value;
            this.configuracion.diaInicioMes = parseInt(diaInicioMes);
            this.guardarConfiguracion();
            this.mostrarMensaje('Configuración del mes financiero guardada');
        });

        // Evento para cambiar modo oscuro
        const modoOscuro = document.getElementById('modo-oscuro');
        modoOscuro.addEventListener('change', () => {
            this.configuracion.modoOscuro = modoOscuro.checked;
            this.guardarConfiguracion();
            this.actualizarEstadoModoOscuro();
            this.aplicarModoOscuro();
        });

        // Evento para actualizar perfil
        const formPerfil = document.getElementById('form-perfil');
        formPerfil.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombreUsuario = document.getElementById('nombre-usuario').value;
            const correoUsuario = document.getElementById('correo-usuario').value;
            
            this.configuracion.nombreUsuario = nombreUsuario;
            this.configuracion.correoUsuario = correoUsuario;
            
            this.guardarConfiguracion();
            this.mostrarMensaje('Perfil actualizado correctamente');
        });

        // Evento para reiniciar datos
        const btnReiniciar = document.getElementById('btn-reiniciar');
        btnReiniciar.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que deseas reiniciar todos los datos? Esta acción no se puede deshacer.')) {
                this.reiniciarDatos();
            }
        });
    }

    // Actualizar la interfaz según la configuración actual
    actualizarInterfaz() {
        this.aplicarModoOscuro();
    }

    // Aplicar modo oscuro
    aplicarModoOscuro() {
        if (this.configuracion.modoOscuro) {
            document.body.classList.add('modo-oscuro');
        } else {
            document.body.classList.remove('modo-oscuro');
        }
    }

    // Actualizar el texto del estado del modo oscuro
    actualizarEstadoModoOscuro() {
        const estadoModo = document.getElementById('estado-modo');
        estadoModo.textContent = this.configuracion.modoOscuro ? 'Activado' : 'Desactivado';
    }

    // Reiniciar todos los datos
    reiniciarDatos() {
        // Limpiar localStorage
        localStorage.clear();
        
        // Reiniciar configuración por defecto
        this.configuracion = {
            limiteDiario: 0,
            diaInicioMes: 1,
            modoOscuro: false,
            nombreUsuario: '',
            correoUsuario: ''
        };
        
        // Guardar configuración por defecto
        this.guardarConfiguracion();
        
        // Actualizar interfaz
        this.inicializarFormularios();
        this.actualizarInterfaz();
        
        // Mostrar mensaje
        this.mostrarMensaje('Todos los datos han sido reiniciados');
    }

    // Mostrar mensaje de confirmación
    mostrarMensaje(mensaje) {
        // Crear elemento de mensaje
        const mensajeElement = document.createElement('div');
        mensajeElement.className = 'mensaje-confirmacion';
        mensajeElement.textContent = mensaje;
        
        // Agregar al DOM
        document.body.appendChild(mensajeElement);
        
        // Eliminar después de 3 segundos
        setTimeout(() => {
            mensajeElement.remove();
        }, 3000);
    }
}

// Inicializar la configuración cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const configuracion = new ConfiguracionApp();
}); 
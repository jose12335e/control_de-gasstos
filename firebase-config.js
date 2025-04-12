// Configuración de Firebase
// Sistema local activado por defecto
const firebaseConfig = {
    apiKey: null,
    authDomain: null,
    projectId: null,
    storageBucket: null,
    messagingSenderId: null,
    appId: null
};

// Variables para los servicios de Firebase
let auth = null;
let db = null;
let isInitialized = false;

// Función para inicializar Firebase
function inicializarFirebase(config) {
    console.log('Usando sistema de autenticación local');
    return false;
}

// Exportar servicios y funciones de Firebase
window.db = null;
window.auth = null;
window.inicializarFirebase = inicializarFirebase;
window.isFirebaseAvailable = () => false;

// Intentar inicializar Firebase con la configuración actual
document.addEventListener('DOMContentLoaded', () => {
    inicializarFirebase(firebaseConfig);
}); 
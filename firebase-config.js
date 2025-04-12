// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAJwzOJaIw4uaVXldXEy84RdmTYr6-JkeA",
    authDomain: "control-de-gastos-e24a9.firebaseapp.com",
    projectId: "control-de-gastos-e24a9",
    storageBucket: "control-de-gastos-e24a9.firebasestorage.app",
    messagingSenderId: "257807922939",
    appId: "1:257807922939:web:b201cd09b2c574c58c625e",
    measurementId: "G-PJLKNEH7JQ"
};

// Variables globales para Firebase
let auth = null;
let db = null;
let analytics = null;

// Función para inicializar Firebase
function initializeFirebase() {
    try {
        // Verificar si Firebase ya está inicializado
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
            console.log('Firebase inicializado correctamente');
        }

        // Inicializar servicios
        auth = firebase.auth();
        db = firebase.firestore();
        analytics = firebase.analytics();
        
        return true;
    } catch (error) {
        console.error('Error al inicializar Firebase:', error);
        return false;
    }
}

// Función para sincronizar datos con Firestore
async function sincronizarDatos(usuarioId) {
    if (!db) return;

    try {
        // Sincronizar configuración
        const configLocal = JSON.parse(localStorage.getItem('configuracion') || '{}');
        await db.collection('usuarios').doc(usuarioId).collection('configuracion').doc('general').set(configLocal);

        // Sincronizar metas
        const metasLocal = JSON.parse(localStorage.getItem('metas') || '[]');
        await db.collection('usuarios').doc(usuarioId).collection('metas').doc('lista').set({ metas: metasLocal });

        // Sincronizar gastos
        const gastosLocal = JSON.parse(localStorage.getItem('gastos') || '[]');
        await db.collection('usuarios').doc(usuarioId).collection('gastos').doc('lista').set({ gastos: gastosLocal });

        console.log('Datos sincronizados correctamente');
    } catch (error) {
        console.error('Error al sincronizar datos:', error);
    }
}

// Función para cargar datos desde Firestore
async function cargarDatosDesdeFirestore(usuarioId) {
    if (!db) return;

    try {
        // Cargar configuración
        const configDoc = await db.collection('usuarios').doc(usuarioId).collection('configuracion').doc('general').get();
        if (configDoc.exists) {
            localStorage.setItem('configuracion', JSON.stringify(configDoc.data()));
        }

        // Cargar metas
        const metasDoc = await db.collection('usuarios').doc(usuarioId).collection('metas').doc('lista').get();
        if (metasDoc.exists) {
            localStorage.setItem('metas', JSON.stringify(metasDoc.data().metas));
        }

        // Cargar gastos
        const gastosDoc = await db.collection('usuarios').doc(usuarioId).collection('gastos').doc('lista').get();
        if (gastosDoc.exists) {
            localStorage.setItem('gastos', JSON.stringify(gastosDoc.data().gastos));
        }

        console.log('Datos cargados correctamente desde Firestore');
    } catch (error) {
        console.error('Error al cargar datos desde Firestore:', error);
    }
}

// Inicializar Firebase cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    if (initializeFirebase()) {
        console.log('Servicios de Firebase disponibles');
    } else {
        console.log('Usando sistema de autenticación local');
    }
}); 
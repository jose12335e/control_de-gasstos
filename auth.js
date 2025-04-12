// Sistema de autenticación para Control de Gastos

// Variables globales
let currentUser = null;
let auth = null;
let db = null;

// Elementos del DOM
const loginPanel = document.getElementById('loginPanel');
const registerPanel = document.getElementById('registerPanel');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginMessage = document.getElementById('loginMessage');
const registerMessage = document.getElementById('registerMessage');
const switchToRegister = document.getElementById('switchToRegister');
const switchToLogin = document.getElementById('switchToLogin');

// Funciones de utilidad
function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `message ${type}`;
    element.style.display = 'block';
}

function hideMessage(element) {
    element.style.display = 'none';
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });

    return isValid;
}

// Funciones de autenticación
async function register(event) {
    event.preventDefault();
    hideMessage(registerMessage);

    if (!validateForm(registerForm)) {
        showMessage(registerMessage, 'Por favor complete todos los campos', 'error');
        return;
    }

    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        showMessage(registerMessage, 'Las contraseñas no coinciden', 'error');
        return;
    }

    try {
        // Intentar usar Firebase si está disponible
        if (typeof auth !== 'undefined' && auth) {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            await db.collection('users').doc(user.uid).set({
                name: name,
                email: email,
                createdAt: new Date()
            });

            showMessage(registerMessage, 'Registro exitoso. Por favor inicie sesión.', 'success');
            setTimeout(() => {
                switchToLoginPanel();
            }, 2000);
        } else {
            // Usar almacenamiento local si Firebase no está disponible
            const users = JSON.parse(localStorage.getItem('users') || '[]');

            if (users.some(user => user.email === email)) {
                showMessage(registerMessage, 'Este email ya está registrado', 'error');
                return;
            }

            const newUser = {
                name,
                email,
                password,
                createdAt: new Date().toISOString()
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            showMessage(registerMessage, 'Registro exitoso. Por favor inicie sesión.', 'success');
            setTimeout(() => {
                switchToLoginPanel();
            }, 2000);
        }
    } catch (error) {
        console.error('Error al registrar:', error);
        showMessage(registerMessage, 'Error al registrar usuario. Por favor, intente nuevamente.', 'error');
    }
}

async function login(event) {
    event.preventDefault();
    hideMessage(loginMessage);

    if (!validateForm(loginForm)) {
        showMessage(loginMessage, 'Por favor complete todos los campos', 'error');
        return;
    }

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        // Intentar usar Firebase si está disponible
        if (typeof auth !== 'undefined' && auth) {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            const doc = await db.collection('users').doc(user.uid).get();
            
            if (doc.exists) {
                const userData = doc.data();
                sessionStorage.setItem('currentUser', JSON.stringify({
                    uid: user.uid,
                    name: userData.name,
                    email: userData.email
                }));
                showMessage(loginMessage, 'Inicio de sesión exitoso', 'success');
                setTimeout(() => {
                    window.location.href = 'app.html';
                }, 1000);
            }
        } else {
            // Usar almacenamiento local si Firebase no está disponible
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                sessionStorage.setItem('currentUser', JSON.stringify({
                    name: user.name,
                    email: user.email
                }));
                showMessage(loginMessage, 'Inicio de sesión exitoso', 'success');
                setTimeout(() => {
                    window.location.href = 'app.html';
                }, 1000);
            } else {
                showMessage(loginMessage, 'Email o contraseña incorrectos', 'error');
            }
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        showMessage(loginMessage, 'Error al iniciar sesión. Por favor, intente nuevamente.', 'error');
    }
}

function switchToRegisterPanel() {
    loginPanel.style.display = 'none';
    registerPanel.style.display = 'block';
    hideMessage(loginMessage);
    loginForm.reset();
}

function switchToLoginPanel() {
    registerPanel.style.display = 'none';
    loginPanel.style.display = 'block';
    hideMessage(registerMessage);
    registerForm.reset();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si hay una sesión activa
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
        window.location.href = 'app.html';
        return;
    }

    // Intentar inicializar Firebase si está disponible
    try {
        if (typeof firebase !== 'undefined') {
            auth = firebase.auth();
            db = firebase.firestore();
            console.log('Firebase inicializado correctamente');
        } else {
            console.log('Firebase no está disponible, usando almacenamiento local');
        }
    } catch (error) {
        console.log('Error al inicializar Firebase, usando almacenamiento local:', error);
    }

    // Inicializar formularios
    loginForm.addEventListener('submit', login);
    registerForm.addEventListener('submit', register);
    switchToRegister.addEventListener('click', switchToRegisterPanel);
    switchToLogin.addEventListener('click', switchToLoginPanel);
}); 
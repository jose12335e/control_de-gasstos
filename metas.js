// Verificar si el usuario está autenticado
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Mostrar nombre del usuario
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        const user = JSON.parse(currentUser);
        userNameElement.textContent = user.nombre;
    }

    // Cargar metas existentes
    loadSavingsGoals();
});

// Cargar metas de ahorro
function loadSavingsGoals() {
    const savings = JSON.parse(localStorage.getItem('savings') || '[]');
    const savingsList = document.getElementById('savingsList');
    
    if (savingsList) {
        if (savings.length === 0) {
            savingsList.innerHTML = '<p>No hay metas de ahorro activas</p>';
            return;
        }

        savingsList.innerHTML = savings.map((goal, index) => `
            <div class="saving-goal" data-id="${index}">
                <div class="goal-header">
                    <h3>${goal.name}</h3>
                    <div class="goal-actions">
                        <button onclick="markAsCompleted(${index})" class="btn-complete">
                            <i class="fas fa-check"></i>
                        </button>
                        <button onclick="deleteGoal(${index})" class="btn-delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="goal-progress">
                    <div class="progress-bar">
                        <div class="progress" style="width: ${(goal.currentAmount / goal.targetAmount) * 100}%"></div>
                    </div>
                    <span class="progress-text">
                        $${goal.currentAmount.toFixed(2)} / $${goal.targetAmount.toFixed(2)}
                    </span>
                </div>
                <div class="goal-date">
                    Fecha objetivo: ${new Date(goal.targetDate).toLocaleDateString()}
                </div>
                <div class="goal-contribution">
                    <input type="number" 
                           id="contribution-${index}" 
                           placeholder="Monto a contribuir" 
                           min="0" 
                           step="0.01">
                    <button onclick="addContribution(${index})" class="btn-contribute">
                        Contribuir
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Crear nueva meta de ahorro
function createSavingsGoal(event) {
    event.preventDefault();
    
    const name = document.getElementById('goalName').value;
    const targetAmount = parseFloat(document.getElementById('targetAmount').value);
    const targetDate = document.getElementById('targetDate').value;

    if (!name || !targetAmount || !targetDate) {
        alert('Por favor complete todos los campos');
        return;
    }

    const savings = JSON.parse(localStorage.getItem('savings') || '[]');
    savings.push({
        name,
        targetAmount,
        currentAmount: 0,
        targetDate,
        completed: false
    });

    localStorage.setItem('savings', JSON.stringify(savings));
    loadSavingsGoals();
    
    // Limpiar formulario
    document.getElementById('goalName').value = '';
    document.getElementById('targetAmount').value = '';
    document.getElementById('targetDate').value = '';
}

// Agregar contribución a una meta
function addContribution(index) {
    const contributionInput = document.getElementById(`contribution-${index}`);
    const contribution = parseFloat(contributionInput.value);

    if (!contribution || contribution <= 0) {
        alert('Por favor ingrese un monto válido');
        return;
    }

    const savings = JSON.parse(localStorage.getItem('savings') || '[]');
    savings[index].currentAmount += contribution;

    localStorage.setItem('savings', JSON.stringify(savings));
    loadSavingsGoals();
    
    // Limpiar input
    contributionInput.value = '';
}

// Marcar meta como completada
function markAsCompleted(index) {
    const savings = JSON.parse(localStorage.getItem('savings') || '[]');
    savings[index].completed = true;
    localStorage.setItem('savings', JSON.stringify(savings));
    loadSavingsGoals();
}

// Eliminar meta
function deleteGoal(index) {
    if (confirm('¿Está seguro de que desea eliminar esta meta?')) {
        const savings = JSON.parse(localStorage.getItem('savings') || '[]');
        savings.splice(index, 1);
        localStorage.setItem('savings', JSON.stringify(savings));
        loadSavingsGoals();
    }
}

// Manejar cierre de sesión
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
} 
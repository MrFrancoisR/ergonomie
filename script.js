function comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compareSync(plainPassword, hashedPassword);
}

// Fonction pour gérer la déconnexion
function logout() {
    localStorage.removeItem('username');
    updateUI(); 
}

function updateUI() {
    const username = localStorage.getItem('username');
    if (username) {
        document.getElementById("userName").textContent = username;
        document.getElementById("userWelcome").style.display = "inline";
        document.getElementById("loginButton").style.display = "none";
    } else {
        document.getElementById("userWelcome").style.display = "none";
        document.getElementById("loginButton").style.display = "inline";
    }
}

document.getElementById('loginForm').onsubmit = function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    login(username, password);
};

window.addEventListener('DOMContentLoaded', () => {
    fetch('check_session.php')
        .then(response => response.json())
        .then(data => {
            const loginLink = document.getElementById('loginButton');
            const userWelcome = document.getElementById('userWelcome');

            if (data.connected) {
                // L'utilisateur est connecté
                loginLink.style.display = 'none';
                userWelcome.style.display = 'inline';
                userWelcome.innerHTML = `Bienvenue, ${data.username} | <button class="logout-button" id="logoutButton" onclick="logout()" aria-label="Se déconnecter">Déconnexion</button>`;
            } else {
                // L'utilisateur est déconnecté
                loginLink.style.display = 'inline';
                userWelcome.style.display = 'none';
                userWelcome.innerHTML = '';
            }
        })
        .catch(error => console.error('Erreur :', error));
});

// Fonction de déconnexion
function logout() {
    fetch('logout.php')
        .then(() => {
            localStorage.removeItem('username'); 
            window.location.reload(); 
        })
        .catch(error => console.error('Erreur lors de la déconnexion :', error));
}


document.getElementById('registerForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('newUsername').value;
    const email = document.getElementById('newEmail').value;
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    const errorDiv = document.getElementById('passwordError');

    if (password !== confirmPassword) {
        errorDiv.textContent = "Le mot de passe et sa confirmation ne correspondent pas.";
        return;
    }

    errorDiv.textContent = "";
    fetch('register.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error(data.error);
            errorDiv.textContent = "Erreur : " + data.error;
        } else {
            console.log(data.message);
            window.location.href = 'index.html';
        }
    })
    .catch(error => console.error('Erreur :', error));
});

function registerUser(username, email, password) {
    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
            }
        })
        .catch(error => console.error('Erreur:', error));
}

function login(username, password) {
    fetch('login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }) 
    })
    .then(response => response.json())
    .then(data => {
        if (data.username) {
            localStorage.setItem('username', data.username);

            window.location.href = 'index.html';
        } else {
            const errorDiv = document.getElementById('LoginError');
            errorDiv.textContent = "Le couple login mot de passe ne correspond pas.";
        }
    })
    .catch(error => console.error('Erreur:', error));
}

window.onload = function () {
    updateUI();
    loadMarkdownFile('fichiers/accueil.txt');
};

function openLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = "block"; 
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = "none";
}

function toggleModalForm() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const toggleMessage = document.getElementById('toggleMessage');

    if (loginForm.style.display === "none") {
        loginForm.style.display = "block";
        registerForm.style.display = "none";
        toggleMessage.innerHTML = `Pas encore de compte ? <a href="#" onclick="toggleModalForm()">Créer un compte</a>`;
    } else {
        loginForm.style.display = "none";
        registerForm.style.display = "block";
        toggleMessage.innerHTML = `Vous avez déjà un compte ? <a href="#" onclick="toggleModalForm()">Se connecter</a>`;
    }
}

window.onclick = function(event) {
    const modal = document.getElementById('loginModal');
    if (event.target === modal) {
        closeLoginModal();
    }
};

async function loadMarkdownFile(filename) {
    try {
        const response = await fetch(filename);
        if (!response.ok) throw new Error(`Erreur lors du chargement de ${filename}`);
        const markdownText = await response.text();
        document.getElementById('markdown-content').innerHTML = marked(markdownText);
    } catch (error) {
        document.getElementById('markdown-content').innerHTML = `<p>${error.message}</p>`;
    }
}
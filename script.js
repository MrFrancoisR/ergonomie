// Fonction pour comparer un mot de passe en clair avec un hash bcrypt (utilisé côté serveur)
function comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compareSync(plainPassword, hashedPassword); // Comparaison synchronisée
}

// Fonction pour gérer la déconnexion
function logout() {
    localStorage.removeItem('username');
    updateUI(); // Met à jour l'interface pour cacher le nom de l'utilisateur et afficher "Connexion"
}

// Fonction pour mettre à jour l'interface utilisateur
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
                userWelcome.innerHTML = ''; // Réinitialise le contenu
            }
        })
        .catch(error => console.error('Erreur :', error));
});

// Fonction de déconnexion
function logout() {
    fetch('logout.php')
        .then(() => {
            localStorage.removeItem('username'); // Supprime les données locales
            window.location.reload(); // Recharge la page pour refléter l'état déconnecté
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

    errorDiv.textContent = ""; // Efface les erreurs

    // Envoyer les données au script PHP
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
            // Redirige l'utilisateur vers la page d'accueil
            window.location.href = 'index.html';
        }
    })
    .catch(error => console.error('Erreur :', error));
});

// Fonction pour enregistrer un utilisateur
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
        body: JSON.stringify({ username, password }) // Utilise le username au lieu de l'email
    })
    .then(response => response.json())
    .then(data => {
        if (data.username) {
            // Stocke le nom d'utilisateur dans le localStorage
            localStorage.setItem('username', data.username);

            // Redirige l'utilisateur vers la page d'accueil
            window.location.href = 'index.html';
        } else {
            const errorDiv = document.getElementById('LoginError');
            errorDiv.textContent = "Le couple login mot de passe ne correspond pas.";
        }
    })
    .catch(error => console.error('Erreur:', error));
}

// Charger la page d'accueil par défaut
window.onload = function () {
    updateUI(); // Vérifier si un utilisateur est déjà connecté au chargement de la page
    loadMarkdownFile('fichiers/accueil.txt');
};

// Fonction pour ouvrir la fenêtre modale de connexion
function openLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = "block"; // Afficher la fenêtre modale
}

// Fonction pour fermer la fenêtre modale de connexion
function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = "none"; // Cacher la fenêtre modale
}

// Fonction pour basculer entre les formulaires de connexion et d'inscription
function toggleModalForm() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const toggleMessage = document.getElementById('toggleMessage');

    // Bascule entre les formulaires
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

// Fermeture automatique de la modale si l'utilisateur clique en dehors de la fenêtre modale
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
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
        document.getElementById("loginLink").style.display = "none";
    } else {
        document.getElementById("userWelcome").style.display = "none";
        document.getElementById("loginLink").style.display = "inline";
    }
}

// Gestion des formulaires
document.getElementById('loginForm').onsubmit = function (event) {
    event.preventDefault();
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    login(email, password);
};

document.getElementById('registerForm').onsubmit = function (event) {
    event.preventDefault();
    const newUsername = document.getElementById('newUsername').value;
    const newEmail = document.getElementById('newEmail').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        alert('Les mots de passe ne correspondent pas.');
        return;
    }

    registerUser(newUsername, newEmail, newPassword);
};

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

// Fonction pour connecter un utilisateur
function login(email, password) {
    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.username) {
                alert(`Bienvenue, ${data.username} !`);
                localStorage.setItem('username', data.username);
                updateUI();
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Erreur:', error));
}

// Charger le contenu de la page
function changeContent(page, filePath) {
    const content = document.getElementById('content');

    // Charger le contenu depuis le fichier texte
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Impossible de charger le fichier : ${filePath}`);
            }
            return response.text();
        })
        .then(data => {
            content.innerHTML = `<h1>${page}</h1><p>${data}</p>`;
        })
        .catch(error => {
            content.innerHTML = `
                <h1>Erreur</h1>
                <p>${error.message}</p>
            `;
        });
}

// Charger la page d'accueil par défaut
window.onload = function () {
    updateUI(); // Vérifier si un utilisateur est déjà connecté au chargement de la page
    changeContent('Accueil', 'accueil.txt');
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
<?php
session_start();

// Paramètres de connexion PostgreSQL
$host = "localhost";
$dbname = "Users";
$user = "bheard";
$password = "lannion";

// Connexion à PostgreSQL
$conn = pg_connect("host=$host dbname=$dbname user=$user password=$password");

if (!$conn) {
    die(json_encode(["error" => "Échec de la connexion à la base de données."]));
}

// Récupérer les données envoyées depuis le frontend
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['username']) && isset($data['password'])) {
    $username = pg_escape_string($conn, $data['username']);
    $password = $data['password'];

    // Requête pour récupérer l'utilisateur par username
    $query = "SELECT * FROM users WHERE username = '$username'";
    $result = pg_query($conn, $query);

    if ($result && pg_num_rows($result) > 0) {
        $user = pg_fetch_assoc($result);
        // Vérifier le mot de passe
        if (password_verify($password, $user['password'])) {
            // Mot de passe correct : enregistrer les informations utilisateur dans la session
            $_SESSION['username'] = $user['username'];

            echo json_encode(["message" => "Connexion réussie.", "username" => $user['username']]);
        } else {
            echo json_encode(["error" => "Mot de passe incorrect."]);
        }
    } else {
        echo json_encode(["error" => "Nom d'utilisateur non trouvé."]);
    }
} else {
    echo json_encode(["error" => "Données manquantes."]);
}

// Fermer la connexion
pg_close($conn);
?>

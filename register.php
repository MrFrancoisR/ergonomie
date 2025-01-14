<?php
session_start();
// Paramètres de connexion PostgreSQL
$host = "localhost";
$dbname = "Users";
$user = "user"; 
$password = "lannion"; 

// Connexion à PostgreSQL
$conn = pg_connect("host=$host dbname=$dbname user=$user password=$password");

if (!$conn) {
    die(json_encode(["error" => "Échec de la connexion à la base de données."]));
}

// Récupérer les données envoyées depuis le frontend
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['username']) && isset($data['email']) && isset($data['password'])) {
    $username = pg_escape_string($conn, $data['username']);
    $email = pg_escape_string($conn, $data['email']);
    $password = password_hash($data['password'], PASSWORD_BCRYPT); // Hashage du mot de passe

    // Requête d'insertion
    $query = "INSERT INTO users (username, email, password) VALUES ('$username', '$email', '$password')";

    $result = pg_query($conn, $query);

    if ($result) {
        // Enregistrer les informations de l'utilisateur dans la session
        $_SESSION['username'] = $username;
        echo json_encode(["message" => "Utilisateur enregistré avec succès."]);
    } else {
        echo json_encode(["error" => "Erreur lors de l'insertion : " . pg_last_error($conn)]);
    }
    
} else {
    echo json_encode(["error" => "Données manquantes."]);
}

// Fermer la connexion
pg_close($conn);
?>

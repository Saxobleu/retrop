<?php
// Permettre à votre site GitHub d'interroger ce script PHP sans blocage de sécurité (CORS)
header("Access-Control-Allow-Origin: https://saxobleu.github.io");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// CONFIGURATION DE LA BASE DE DONNÉES FREE
$host = "sql.free.fr";
$user = "gfait";          // Votre identifiant Free
$password = "Fe961956!Gf!"; // /!\ À REMPLACER PAR VOTRE VRAI MOT DE PASSE PHPMYADMIN
$database = "gfait";      // Le nom de votre base de données

// Connexion à MySQL
$mysqli = new mysqli($host, $user, $password, $database);

// Vérification de la connexion
if ($mysqli->connect_error) {
    echo json_encode(["status" => "error", "message" => "Connexion à la base échouée"]);
    exit;
}

// Forcer le codage en UTF-8 pour éviter les problèmes d'accents
$mysqli->set_charset("utf8");

// Récupération des données envoyées par le JavaScript de GitHub
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['code'])) {
    // Sécurisation de la variable pour éviter les injections SQL
    $codeSaisi = $mysqli->real_escape_string($data['code']);
    
    // Recherche de l'utilisateur dans la table
    $query = "SELECT nom, role FROM utilisateurs WHERE code_acces = '$codeSaisi' LIMIT 1";
    $result = $mysqli->query($query);
    
    if ($result && $result->num_rows > 0) {
        $userRow = $result->fetch_assoc();
        // Le code est bon ! On renvoie le nom et le rôle
        echo json_encode([
            "status" => "success", 
            "nom" => $userRow['nom'],
            "role" => $userRow['role']
        ]);
    } else {
        // Le code n'existe pas
        echo json_encode(["status" => "error", "message" => "Code incorrect"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Données manquantes"]);
}

$mysqli->close();
?>
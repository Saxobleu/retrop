/* 0utils/js/retrop.js */
// Fonction pour vérifier le mot de passe
async function verifierMotDePasse() {
    const codeSaisi = document.getElementById("inputCode").value; // Assurez-vous d'avoir un input avec cet ID

    if (!codeSaisi) {
        alert("Veuillez entrer un code.");
        return;
    }

    try {
        const reponse = await fetch('https://gfait.free.fr/0utils/php/apiretrop.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code: codeSaisi })
        });

        const donnees = await reponse.json();

        if (donnees.status === "success") {
            // Succès : Masquer la connexion, afficher le contenu
            document.getElementById("zoneConnexion").style.display = "none";
            document.getElementById("zoneContenu").style.display = "block";
            document.getElementById("bienvenue").textContent = `Bienvenue, ${donnees.nom} (${donnees.role})`;
        } else {
            // Échec : Afficher le message d'erreur
            document.getElementById("erreur").textContent = donnees.message;
            document.getElementById("erreur").style.display = "block";
        }

    } catch (erreur) {
        console.error("Erreur de connexion :", erreur);
        document.getElementById("erreur").textContent = "Erreur de connexion au serveur.";
        document.getElementById("erreur").style.display = "block";
    }
}

// Appel de la fonction quand on clique sur un bouton (ex: "Valider")
// Vous devez ajouter un bouton dans votre HTML avec onclick="verifierMotDePasse()"
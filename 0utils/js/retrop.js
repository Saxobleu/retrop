/* 0utils/js/retrop.js */
function verifierCode(event) {
    // Empêche la page de se recharger lors de la soumission du formulaire
    event.preventDefault();
    
    // Récupère la valeur tapée par l'utilisateur
    const codeSaisi = document.getElementById('code-input').value;
    const ecranConnexion = document.getElementById('ecran-connexion');
    const pageApplication = document.getElementById('page-application');
    const blocErreur = document.getElementById('bloc-erreur');

    // Masquer le message d'erreur précédent s'il y en avait un
    blocErreur.style.display = "none";

    // APPEL DYNAMIQUE VERS LE SERVEUR FREE
    // (Notez le chemin exact vers votre dossier 0utils/php/)
    fetch('http://gfait.free.fr/retrop/0utils/php/api.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: codeSaisi }) // On envoie le code à Free
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            // Le code existe dans la table MySQL !
            // On cache l'écran de connexion
            ecranConnexion.style.display = "none";
            
            // On ajuste l'affichage pour l'application
            document.body.style.alignItems = "flex-start";
            
            // On modifie le message de bienvenue avec le vrai nom de la base de données
            // (Exemple : "Bravo ! Connexion réussie pour Testeur")
            const welcomeBox = document.querySelector('.welcome-box');
            if (welcomeBox) {
                welcomeBox.innerHTML = `Bravo ! Connexion réussie. Bienvenue, <strong>${data.nom}</strong> !`;
            }

            // On affiche enfin la zone sécurisée
            pageApplication.style.display = "block";
        } else {
            // Le code est inconnu ou une erreur est survenue
            blocErreur.style.display = "block";
            blocErreur.innerText = data.message || "Code d'accès incorrect.";
            
            // On réinitialise la case de saisie
            document.getElementById('code-input').value = "";
            document.getElementById('code-input').focus();
        }
    })
    .catch(error => {
        console.error("Erreur de liaison avec Free:", error);
        blocErreur.style.display = "block";
        blocErreur.innerText = "Erreur de connexion avec le serveur Free.";
    });
}
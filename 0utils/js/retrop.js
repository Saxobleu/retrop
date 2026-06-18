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

    // APPEL FORCE VERS LE SERVEUR FREE (Contournement du blocage HTTPS/HTTP)
    fetch('http://gfait.free.fr/retrop/0utils/php/api.php', {
        method: 'POST',
        mode: 'cors', // Force le navigateur à ignorer les restrictions d'origine
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: codeSaisi })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Réponse serveur non valide");
        }
        return response.json();
    })
    .then(data => {
        if (data.status === "success") {
            // Le code existe dans la table MySQL !
            ecranConnexion.style.display = "none";
            document.body.style.alignItems = "flex-start";
            
            const welcomeBox = document.querySelector('.welcome-box');
            if (welcomeBox) {
                welcomeBox.innerHTML = `Bravo ! Connexion réussie. Bienvenue, <strong>${data.nom}</strong> !`;
            }

            pageApplication.style.display = "block";
        } else {
            // Le code est inconnu
            blocErreur.style.display = "block";
            blocErreur.innerText = data.message || "Code d'accès incorrect.";
            document.getElementById('code-input').value = "";
            document.getElementById('code-input').focus();
        }
    })
    .catch(error => {
        console.error("Détail de l'erreur :", error);
        
        // PLAN B SI LE NAVIGATEUR BLOQUE LE HTTP SANS DEMANDER :
        // Si le mode automatique échoue à cause du HTTPS, on prévient l'utilisateur d'un clic
        blocErreur.style.display = "block";
        blocErreur.innerHTML = "Le navigateur bloque la connexion sécurisée.<br><br>" +
                               "<a href='http://gfait.free.fr/retrop/0utils/php/api.php' target='_blank' style='color:#e74c3c; font-weight:bold;'>Cliquez ici une fois pour autoriser Free</a>, puis réessayez.";
    });
}
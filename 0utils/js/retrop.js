/* 0utils/js/retrop.js */
function verifierCode(event) {
    event.preventDefault();
    
    const codeSaisi = document.getElementById('code-input').value;
    const ecranConnexion = document.getElementById('ecran-connexion');
    const pageApplication = document.getElementById('page-application');
    const blocErreur = document.getElementById('bloc-erreur');

    blocErreur.style.display = "none";

    // Envoi au format texte brut pour que le vieux PHP de Free ne panique pas
    fetch('http://gfait.free.fr/retrop/0utils/php/api.php', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({ code: codeSaisi })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            ecranConnexion.style.display = "none";
            document.body.style.alignItems = "flex-start";
            
            const welcomeBox = document.querySelector('.welcome-box');
            if (welcomeBox) {
                welcomeBox.innerHTML = `Bravo ! Connexion réussie. Bienvenue, <strong>${data.nom}</strong> !`;
            }

            pageApplication.style.display = "block";
        } else {
            blocErreur.style.display = "block";
            blocErreur.innerText = data.message || "Code d'accès incorrect.";
            document.getElementById('code-input').value = "";
            document.getElementById('code-input').focus();
        }
    })
    .catch(error => {
        console.error("Erreur :", error);
        blocErreur.style.display = "block";
        blocErreur.innerHTML = "Le navigateur bloque la connexion sécurisée.<br><br>" +
                               "<a href='http://gfait.free.fr/retrop/0utils/php/api.php' target='_blank' style='color:#e74c3c; font-weight:bold;'>Cliquez ici une fois pour autoriser Free</a>, puis réessayez.";
    });
}
/* 0utils/js/retrop.js */

// Cette fonction globale va recevoir la réponse directe de Free, sans blocage de sécurité
function gererReponseFree(data) {
    const ecranConnexion = document.getElementById('ecran-connexion');
    const pageApplication = document.getElementById('page-application');
    const blocErreur = document.getElementById('bloc-erreur');
    
    // On nettoie la balise temporaire de script
    const baliseTemp = document.getElementById('script-jsonp-free');
    if (baliseTemp) baliseTemp.remove();

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
}

function verifierCode(event) {
    event.preventDefault();
    
    const codeSaisi = document.getElementById('code-input').value;
    const blocErreur = document.getElementById('bloc-erreur');
    blocErreur.style.display = "none";

    // On crée une balise <script> magique pour interroger Free sans blocage HTTPS/HTTP
    const script = document.createElement('script');
    script.id = 'script-jsonp-free';
    script.src = 'http://gfait.free.fr/retrop/0utils/php/api.php?code=' + encodeURIComponent(codeSaisi);
    
    // En cas de panne totale du serveur Free
    script.onerror = function() {
        blocErreur.style.display = "block";
        blocErreur.innerHTML = "Impossible de joindre le serveur de validation Free.";
    };

    // On injecte le script dans la page pour lancer la vérification
    document.body.appendChild(script);
}
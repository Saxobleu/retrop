/* 0utils/js/retrop.js */

// 1. Fonction de navigation entre les onglets
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

// 2. Fonction magique GLOBALE qui reçoit la réponse de Free
function gererReponseFree(donnees) {
    const ecranConnexion = document.getElementById("ecran-connexion");
    const pageApplication = document.getElementById("page-application");
    const blocErreur = document.getElementById("bloc-erreur");
    const zoneMessageBienvenue = document.getElementById("bienvenue-message");

    // Nettoyage de la balise temporaire
    const baliseTemp = document.getElementById('script-jsonp-free');
    if (baliseTemp) baliseTemp.remove();

    if (donnees.status === "success") {
        // Connexion réussie ! On bascule l'affichage
        ecranConnexion.style.display = "none";
        document.body.style.alignItems = "flex-start";
        document.body.style.display = "block"; 
        
        if (zoneMessageBienvenue) {
            zoneMessageBienvenue.textContent = `Salut ${donnees.nom}, bienvenue !`;
        }
        
        pageApplication.style.display = "block";
    } else {
        // Erreur renvoyée par le PHP
        blocErreur.textContent = donnees.message || "Code d'accès incorrect.";
        blocErreur.style.display = "block";
    }
}

// 3. Déclencheur lors de la soumission du formulaire
function verifierCode(event) {
    event.preventDefault(); 
    
    const codeSaisi = document.getElementById("code-input").value;
    const blocErreur = document.getElementById("bloc-erreur");

    blocErreur.style.display = "none";

    // On crée une balise <script> dynamique pour contourner le blocage HTTPS -> HTTP
    const script = document.createElement('script');
    script.id = 'script-jsonp-free';
    script.src = 'http://gfait.free.fr/retrop/0utils/php/apiretrop.php?code=' + encodeURIComponent(codeSaisi);
    
    // Si Free est totalement en panne
    script.onerror = function() {
        blocErreur.style.display = "block";
        blocErreur.innerHTML = "Impossible de joindre le serveur Free.";
    };

    // Injection dans la page pour lancer la requête
    document.body.appendChild(script);
}
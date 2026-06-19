/* 0utils/js/retrop.js */

// Fonction de navigation entre les onglets de l'application
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

// Fonction de vérification du code au clic ou soumission du formulaire
async function verifierCode(event) {
    event.preventDefault(); // Empêche le rechargement de la page
    
    const codeSaisi = document.getElementById("code-input").value;
    const ecranConnexion = document.getElementById("ecran-connexion");
    const pageApplication = document.getElementById("page-application");
    const blocErreur = document.getElementById("bloc-erreur");
    const zoneMessageBienvenue = document.getElementById("bienvenue-message");

    blocErreur.style.display = "none";

    try {
        // Interrogation native en POST vers Free (PHP 5.6)
        const reponse = await fetch('https://gfait.free.fr/retrop/0utils/php/apiretrop.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code: codeSaisi })
        });

        const donnees = await reponse.json();

        if (donnees.status === "success") {
            // 1. Masquer l'écran de verrouillage
            ecranConnexion.style.display = "none";
            
            // 2. Modifier l'alignement global pour le menu persistant
            document.body.style.alignItems = "flex-start";
            document.body.style.display = "block"; 
            
            // 3. Injecter le message de bienvenue personnalisé
            if (zoneMessageBienvenue) {
                zoneMessageBienvenue.textContent = `Salut ${donnees.nom}, bienvenue !`;
            }
            
            // 4. Déployer l'application
            pageApplication.style.display = "block";
        } else {
            // Affichage de l'erreur renvoyée par PHP
            blocErreur.textContent = donnees.message || "Code d'accès incorrect.";
            blocErreur.style.display = "block";
        }

    } catch (erreur) {
        console.error("Erreur réseau :", erreur);
        blocErreur.innerHTML = "Le navigateur bloque le flux non sécurisé.<br><br>" +
                               "<a href='https://gfait.free.fr/retrop/0utils/php/apiretrop.php' target='_blank' style='color:#e74c3c; font-weight:bold;'>Cliquez ici pour accepter le certificat Free</a>, puis réessayez.";
        blocErreur.style.display = "block";
    }
}
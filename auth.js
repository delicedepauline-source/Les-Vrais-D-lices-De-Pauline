/*
=========================================================
LES DÉLICES DE PAULINE
SYSTÈME DE COMPTES
=========================================================
*/

// =======================================================
// CONFIGURATION SUPABASE
// =======================================================

const SUPABASE_URL = "TON_URL_SUPABASE";
const SUPABASE_ANON_KEY = "TA_CLE_PUBLIQUE_SUPABASE";


// =======================================================
// CLIENT SUPABASE
// =======================================================

let supabaseClient = null;


// =======================================================
// CHARGEMENT DE SUPABASE
// =======================================================

const supabaseScript = document.createElement("script");

supabaseScript.src =
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

supabaseScript.onload = async () => {

    console.log("Supabase chargé");

    supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true,
                storage: window.localStorage
            }
        }
    );

    console.log("Client Supabase créé");

    // On attend que le DOM soit chargé
    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initializeAuth
        );

    } else {

        initializeAuth();

    }

};


// =======================================================
// INITIALISATION
// =======================================================

async function initializeAuth() {

    if (!supabaseClient) {

        console.error(
            "Supabase n'est pas encore chargé."
        );

        return;

    }

    console.log("Initialisation du système de comptes");

    setupRegister();

    setupLogin();

    setupLogout();

    await loadAccount();

    updateNavigation();

}


// =======================================================
// INSCRIPTION
// =======================================================

function setupRegister() {

    const form =
        document.getElementById("registerForm");

    if (!form) return;

    // Évite de créer plusieurs événements
    if (form.dataset.initialized === "true") return;

    form.dataset.initialized = "true";


    form.addEventListener("submit", async (event) => {

        event.preventDefault();


        const prenom =
            document.getElementById("prenom").value.trim();

        const nom =
            document.getElementById("nom").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const telephone =
            document.getElementById("telephone").value.trim();

        const password =
            document.getElementById("password").value;

        const passwordConfirm =
            document.getElementById("passwordConfirm").value;

        const message =
            document.getElementById("registerMessage");


        if (password !== passwordConfirm) {

            message.textContent =
                "Les mots de passe ne correspondent pas.";

            message.className =
                "form-message error";

            return;

        }


        message.textContent =
            "Création de votre compte...";

        message.className =
            "form-message";


        const { data, error } =
            await supabaseClient.auth.signUp({

                email: email,

                password: password,

                options: {

                    data: {

                        prenom: prenom,

                        nom: nom,

                        telephone: telephone

                    }

                }

            });


        if (error) {

            console.error(error);

            message.textContent =
                error.message;

            message.className =
                "form-message error";

            return;

        }


        message.textContent =
            "Votre compte a été créé !";

        message.className =
            "form-message success";


        /*
        Si Supabase demande une confirmation
        par e-mail, l'utilisateur devra confirmer
        son adresse avant de pouvoir se connecter.
        */

        setTimeout(() => {

            window.location.href =
                "connexion.html";

        }, 1500);

    });

}


// =======================================================
// CONNEXION
// =======================================================

function setupLogin() {

    const form =
        document.getElementById("loginForm");

    if (!form) return;

    if (form.dataset.initialized === "true") return;

    form.dataset.initialized = "true";


    form.addEventListener("submit", async (event) => {

        event.preventDefault();


        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;

        const message =
            document.getElementById("loginMessage");


        message.textContent =
            "Connexion...";

        message.className =
            "form-message";


        const { data, error } =
            await supabaseClient.auth.signInWithPassword({

                email: email,

                password: password

            });


        if (error) {

            console.error(error);

            message.textContent =
                "Adresse e-mail ou mot de passe incorrect.";

            message.className =
                "form-message error";

            return;

        }


        console.log(
            "Connexion réussie :",
            data.user.email
        );


        message.textContent =
            "Connexion réussie !";

        message.className =
            "form-message success";


        /*
        La session est maintenant automatiquement
        sauvegardée dans le localStorage.
        */

        setTimeout(() => {

            window.location.href =
                "compte.html";

        }, 500);

    });

}


// =======================================================
// DÉCONNEXION
// =======================================================

function setupLogout() {

    const buttons = [

        document.getElementById("logoutButton"),

        document.getElementById("adminLogout")

    ];


    buttons.forEach(button => {

        if (!button) return;

        if (button.dataset.initialized === "true") return;

        button.dataset.initialized = "true";


        button.addEventListener("click", async () => {

            console.log("Déconnexion...");


            const { error } =
                await supabaseClient.auth.signOut();


            if (error) {

                console.error(
                    "Erreur de déconnexion :",
                    error
                );

                return;

            }


            // Nettoyage de la session locale
            localStorage.removeItem(
                "supabase.auth.token"
            );


            window.location.href =
                "index.html";

        });

    });

}


// =======================================================
// CHARGEMENT DU COMPTE
// =======================================================

async function loadAccount() {

    const userEmailElement =
        document.getElementById("userEmail");


    // Si ce n'est pas la page compte
    if (!userEmailElement)
        return;


    console.log("Recherche de la session...");


    /*
    IMPORTANT :
    getSession() récupère la session sauvegardée
    après un F5.
    */

    const {
        data: { session },
        error
    } = await supabaseClient.auth.getSession();


    if (error) {

        console.error(
            "Erreur récupération session :",
            error
        );

        window.location.href =
            "connexion.html";

        return;

    }


    if (!session || !session.user) {

        console.log(
            "Aucune session trouvée."
        );

        window.location.href =
            "connexion.html";

        return;

    }


    const user =
        session.user;


    console.log(
        "Session retrouvée :",
        user.email
    );


    const metadata =
        user.user_metadata || {};


    const prenom =
        metadata.prenom || "";

    const nom =
        metadata.nom || "";

    const telephone =
        metadata.telephone || "Non renseigné";


    const firstNameElement =
        document.getElementById("userFirstName");

    const fullNameElement =
        document.getElementById("userFullName");

    const phoneElement =
        document.getElementById("userPhone");


    if (firstNameElement) {

        firstNameElement.textContent =
            prenom || "client";

    }


    if (fullNameElement) {

        fullNameElement.textContent =
            `${prenom} ${nom}`.trim();

    }


    userEmailElement.textContent =
        user.email;


    if (phoneElement) {

        phoneElement.textContent =
            telephone;

    }

}


// =======================================================
// NAVIGATION
// =======================================================

async function updateNavigation() {

    if (!supabaseClient)
        return;


    const {
        data: { session }
    } = await supabaseClient.auth.getSession();


    const loginLinks =
        document.querySelectorAll(
            '[href="connexion.html"]'
        );


    const accountLinks =
        document.querySelectorAll(
            '[href="compte.html"]'
        );


    if (session) {

        console.log(
            "Utilisateur connecté :",
            session.user.email
        );


        loginLinks.forEach(link => {

            link.style.display = "none";

        });


        accountLinks.forEach(link => {

            link.style.display = "";

        });

    } else {

        loginLinks.forEach(link => {

            link.style.display = "";

        });


        accountLinks.forEach(link => {

            link.style.display = "none";

        });

    }

}


// =======================================================
// SURVEILLANCE DE LA SESSION
// =======================================================

function setupAuthListener() {

    if (!supabaseClient)
        return;


    supabaseClient.auth.onAuthStateChange(
        (event, session) => {

            console.log(
                "Événement auth :",
                event
            );


            if (session) {

                console.log(
                    "Session active :",
                    session.user.email
                );

            } else {

                console.log(
                    "Aucune session active"
                );

            }

        }
    );

}


// =======================================================
// AJOUT DU SCRIPT SUPABASE
// =======================================================

document.head.appendChild(supabaseScript);

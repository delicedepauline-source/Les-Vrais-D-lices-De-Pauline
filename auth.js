/*
=========================================================
LES DÉLICES DE PAULINE
SYSTÈME DE COMPTES
=========================================================

IMPORTANT :

Quand ton projet Supabase sera créé, tu remplaceras :

SUPABASE_URL
SUPABASE_ANON_KEY

par les informations fournies par Supabase.

NE METS JAMAIS ta clé "service_role" ici.
=========================================================
*/


// =======================================================
// CONFIGURATION SUPABASE
// =======================================================

const SUPABASE_URL = "TON_URL_SUPABASE";

const SUPABASE_ANON_KEY = "TA_CLE_PUBLIQUE_SUPABASE";


// =======================================================
// CHARGEMENT DE SUPABASE
// =======================================================

let supabaseClient = null;


/*
On charge automatiquement la bibliothèque Supabase.
*/

const supabaseScript = document.createElement("script");

supabaseScript.src =
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

supabaseScript.onload = () => {

    supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_ANON_KEY
        );

    initializeAuth();

};


// =======================================================
// INITIALISATION
// =======================================================

function initializeAuth() {

    setupRegister();

    setupLogin();

    setupLogout();

    loadAccount();

}


// =======================================================
// INSCRIPTION
// =======================================================

function setupRegister() {

    const form =
        document.getElementById("registerForm");

    if (!form) return;


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

            message.textContent =
                error.message;

            message.className =
                "form-message error";

            return;

        }


        message.textContent =
            "Votre compte a été créé ! Vous pouvez maintenant vous connecter.";

        message.className =
            "form-message success";


        setTimeout(() => {

            window.location.href =
                "connexion.html";

        }, 2000);

    });

}


// =======================================================
// CONNEXION
// =======================================================

function setupLogin() {

    const form =
        document.getElementById("loginForm");

    if (!form) return;


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


        const { data, error } =
            await supabaseClient.auth.signInWithPassword({

                email: email,

                password: password

            });


        if (error) {

            message.textContent =
                "Adresse e-mail ou mot de passe incorrect.";

            message.className =
                "form-message error";

            return;

        }


        message.textContent =
            "Connexion réussie !";

        message.className =
            "form-message success";


        /*
        Pour l'instant on redirige vers le compte client.
        L'espace admin sera protégé dans admin.js.
        */

        setTimeout(() => {

            window.location.href =
                "compte.html";

        }, 700);

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


        button.addEventListener("click", async () => {

            await supabaseClient.auth.signOut();

            window.location.href =
                "index.html";

        });

    });

}


// =======================================================
// COMPTE CLIENT
// =======================================================

async function loadAccount() {

    if (!document.getElementById("userEmail"))
        return;


    const {

        data: { user },

        error

    } = await supabaseClient.auth.getUser();


    if (error || !user) {

        window.location.href =
            "connexion.html";

        return;

    }


    const metadata =
        user.user_metadata || {};


    const prenom =
        metadata.prenom || "";

    const nom =
        metadata.nom || "";

    const telephone =
        metadata.telephone || "Non renseigné";


    document.getElementById("userFirstName")
        .textContent = prenom || "client";


    document.getElementById("userFullName")
        .textContent =
            `${prenom} ${nom}`.trim();


    document.getElementById("userEmail")
        .textContent =
            user.email;


    document.getElementById("userPhone")
        .textContent =
            telephone;

}


// =======================================================
// AJOUT DU SCRIPT SUPABASE
// =======================================================

document.head.appendChild(supabaseScript);

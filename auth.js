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

supabaseScript.onload = () => {

    console.log("Supabase chargé");


    // Création du client Supabase
    supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_ANON_KEY,
            {
                auth: {

                    // Garde la connexion après F5
                    persistSession: true,

                    // Renouvelle automatiquement la session
                    autoRefreshToken: true,

                    // Gestion des liens de confirmation
                    detectSessionInUrl: true

                }
            }
        );


    console.log("Client Supabase créé");


    // IMPORTANT :
    // On initialise le système seulement
    // après le chargement complet de Supabase.
    initializeAuth();

};


// =======================================================
// INITIALISATION
// =======================================================

async function initializeAuth() {

    if (!supabaseClient) {

        console.error(
            "Supabase n'est pas disponible."
        );

        return;

    }


    console.log(
        "Initialisation du système de comptes..."
    );


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


    if (!form)
        return;


    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const prenom =
                document
                    .getElementById("prenom")
                    .value
                    .trim();


            const nom =
                document
                    .getElementById("nom")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const telephone =
                document
                    .getElementById("telephone")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("password")
                    .value;


            const passwordConfirm =
                document
                    .getElementById("passwordConfirm")
                    .value;


            const message =
                document.getElementById(
                    "registerMessage"
                );


            // Vérification des mots de passe
            if (
                password !== passwordConfirm
            ) {

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


            // Création du compte
            const {
                data,
                error
            } =
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


            console.log(
                "Compte créé :",
                data
            );


            message.textContent =
                "Votre compte a été créé !";

            message.className =
                "form-message success";


            setTimeout(() => {

                window.location.href =
                    "connexion.html";

            }, 1500);

        }
    );

}


// =======================================================
// CONNEXION
// =======================================================

function setupLogin() {

    const form =
        document.getElementById("loginForm");


    if (!form)
        return;


    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const email =
                document
                    .getElementById("loginEmail")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("loginPassword")
                    .value;


            const message =
                document.getElementById(
                    "loginMessage"
                );


            message.textContent =
                "Connexion...";

            message.className =
                "form-message";


            // Connexion
            const {
                data,
                error
            } =
                await supabaseClient.auth
                    .signInWithPassword({

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
                "Utilisateur connecté :",
                data.user.email
            );


            message.textContent =
                "Connexion réussie !";

            message.className =
                "form-message success";


            /*
            Supabase sauvegarde automatiquement
            la session grâce à persistSession: true.
            */


            setTimeout(() => {

                window.location.href =
                    "compte.html";

            }, 500);

        }
    );

}


// =======================================================
// DÉCONNEXION
// =======================================================

function setupLogout() {

    const buttons = [

        document.getElementById(
            "logoutButton"
        ),

        document.getElementById(
            "adminLogout"
        )

    ];


    buttons.forEach(button => {

        if (!button)
            return;


        button.addEventListener(
            "click",
            async () => {

                console.log(
                    "Déconnexion..."
                );


                const {
                    error
                } =
                    await supabaseClient.auth
                        .signOut();


                if (error) {

                    console.error(
                        "Erreur de déconnexion :",
                        error
                    );

                    return;

                }


                /*
                IMPORTANT :
                On ne supprime PAS manuellement
                le localStorage.

                Supabase s'en occupe.
                */


                window.location.href =
                    "index.html";

            }
        );

    });

}


// =======================================================
// CHARGEMENT DU COMPTE
// =======================================================

async function loadAccount() {

    const userEmailElement =
        document.getElementById(
            "userEmail"
        );


    /*
    Si on n'est pas sur compte.html,
    on ne fait rien.
    */

    if (!userEmailElement)
        return;


    console.log(
        "Recherche de la session..."
    );


    /*
    getSession() récupère la session
    sauvegardée par Supabase.

    C'est cette partie qui permet
    de rester connecté après F5.
    */

    const {
        data: {
            session
        },
        error
    } =
        await supabaseClient.auth
            .getSession();


    // Erreur
    if (error) {

        console.error(
            "Erreur de session :",
            error
        );

        window.location.href =
            "connexion.html";

        return;

    }


    // Aucun utilisateur connecté
    if (
        !session ||
        !session.user
    ) {

        console.log(
            "Aucune session trouvée."
        );


        window.location.href =
            "connexion.html";

        return;

    }


    // Utilisateur trouvé
    const user =
        session.user;


    console.log(
        "Session retrouvée :",
        user.email
    );


    // Récupération des informations
    const metadata =
        user.user_metadata || {};


    const prenom =
        metadata.prenom || "";


    const nom =
        metadata.nom || "";


    const telephone =
        metadata.telephone ||
        "Non renseigné";


    // Prénom
    const firstName =
        document.getElementById(
            "userFirstName"
        );


    if (firstName) {

        firstName.textContent =
            prenom || "client";

    }


    // Nom complet
    const fullName =
        document.getElementById(
            "userFullName"
        );


    if (fullName) {

        fullName.textContent =
            `${prenom} ${nom}`.trim();

    }


    // E-mail
    userEmailElement.textContent =
        user.email;


    // Téléphone
    const phone =
        document.getElementById(
            "userPhone"
        );


    if (phone) {

        phone.textContent =
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
        data: {
            session
        }
    } =
        await supabaseClient.auth
            .getSession();


    /*
    Liens vers connexion.html
    */

    const loginLinks =
        document.querySelectorAll(
            'a[href="connexion.html"]'
        );


    /*
    Liens vers compte.html
    */

    const accountLinks =
        document.querySelectorAll(
            'a[href="compte.html"]'
        );


    if (session) {

        console.log(
            "Utilisateur connecté :",
            session.user.email
        );


        loginLinks.forEach(link => {

            link.style.display =
                "none";

        });


        accountLinks.forEach(link => {

            link.style.display =
                "";

        });

    } else {

        loginLinks.forEach(link => {

            link.style.display =
                "";

        });


        accountLinks.forEach(link => {

            link.style.display =
                "none";

        });

    }

}


// =======================================================
// SURVEILLANCE DE LA SESSION
// =======================================================

function setupAuthListener() {

    if (!supabaseClient)
        return;


    supabaseClient.auth
        .onAuthStateChange(
            (event, session) => {

                console.log(
                    "Événement authentification :",
                    event
                );


                if (session) {

                    console.log(
                        "Session active :",
                        session.user.email
                    );

                } else {

                    console.log(
                        "Aucune session active."
                    );

                }

            }
        );

}


// =======================================================
// LANCEMENT
// =======================================================

document.head.appendChild(
    supabaseScript
);

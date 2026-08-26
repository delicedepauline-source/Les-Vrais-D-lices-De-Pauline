/*
=========================================================
LES DÉLICES DE PAULINE
SYSTÈME DE COMPTES
=========================================================
*/


// =======================================================
// CONFIGURATION SUPABASE
// =======================================================

const SUPABASE_URL =
    "https://qyysftxupnnfikmrjjue.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_0FTC_yZFfch1S10KkDLGqA_pmZTxJMC";


// =======================================================
// CRÉATION DU CLIENT SUPABASE
// =======================================================

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        {
            auth: {

                // Conserver la connexion
                persistSession: true,

                // Renouveler automatiquement la session
                autoRefreshToken: true,

                // Détecter les sessions dans l'URL
                detectSessionInUrl: true

            }
        }
    );


// =======================================================
// INITIALISATION
// =======================================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "Les Délices De Pauline - système de comptes"
        );


        setupLogin();

        setupRegister();

        setupLogout();

        await checkSession();

    }
);


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


            console.log(
                "Tentative de connexion..."
            );


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

                console.error(
                    "Erreur de connexion :",
                    error
                );


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
            Supabase conserve automatiquement
            la session dans le stockage du navigateur.
            */


            setTimeout(
                () => {

                    window.location.href =
                        "compte.html";

                },
                500
            );

        }
    );

}


// =======================================================
// INSCRIPTION
// =======================================================

function setupRegister() {

    const form =
        document.getElementById(
            "registerForm"
        );


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
                    .getElementById(
                        "passwordConfirm"
                    )
                    .value;


            const message =
                document.getElementById(
                    "registerMessage"
                );


            // Vérification du mot de passe
            if (
                password !==
                passwordConfirm
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


            const {
                data,
                error
            } =
                await supabaseClient.auth
                    .signUp({

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

                console.error(
                    "Erreur inscription :",
                    error
                );


                message.textContent =
                    error.message;

                message.className =
                    "form-message error";

                return;

            }


            console.log(
                "Compte créé"
            );


            message.textContent =
                "Votre compte a été créé !";

            message.className =
                "form-message success";


            setTimeout(
                () => {

                    window.location.href =
                        "connexion.html";

                },
                1500
            );

        }
    );

}


// =======================================================
// VÉRIFICATION DE LA SESSION
// =======================================================

async function checkSession() {

    console.log(
        "Vérification de la session..."
    );


    const {
        data,
        error
    } =
        await supabaseClient.auth
            .getSession();


    if (error) {

        console.error(
            "Erreur récupération session :",
            error
        );

        return;

    }


    const session =
        data.session;


    // ===================================================
    // SESSION TROUVÉE
    // ===================================================

    if (session) {

        console.log(
            "Session trouvée :",
            session.user.email
        );


        /*
        Si l'utilisateur est sur la page
        de connexion alors qu'il est déjà
        connecté, on l'envoie directement
        sur son compte.
        */

        if (
            document.getElementById(
                "loginForm"
            )
        ) {

            window.location.href =
                "compte.html";

            return;

        }


        /*
        Si on est sur compte.html,
        on affiche les informations.
        */

        loadUser(
            session.user
        );


        return;

    }


    // ===================================================
    // PAS DE SESSION
    // ===================================================

    console.log(
        "Aucune session active."
    );


    /*
    Si on est sur compte.html
    sans être connecté,
    retour à connexion.html.
    */

    if (
        document.getElementById(
            "userEmail"
        )
    ) {

        window.location.href =
            "connexion.html";

    }

}


// =======================================================
// AFFICHER LES INFORMATIONS DU COMPTE
// =======================================================

function loadUser(user) {

    const metadata =
        user.user_metadata || {};


    const prenom =
        metadata.prenom || "client";


    const nom =
        metadata.nom || "";


    const telephone =
        metadata.telephone ||
        "Non renseigné";


    const firstName =
        document.getElementById(
            "userFirstName"
        );


    const fullName =
        document.getElementById(
            "userFullName"
        );


    const email =
        document.getElementById(
            "userEmail"
        );


    const phone =
        document.getElementById(
            "userPhone"
        );


    if (firstName) {

        firstName.textContent =
            prenom;

    }


    if (fullName) {

        fullName.textContent =
            `${prenom} ${nom}`.trim();

    }


    if (email) {

        email.textContent =
            user.email;

    }


    if (phone) {

        phone.textContent =
            telephone;

    }

}


// =======================================================
// DÉCONNEXION
// =======================================================

function setupLogout() {

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (!logoutButton)
        return;


    logoutButton.addEventListener(
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


            console.log(
                "Déconnexion réussie"
            );


            window.location.href =
                "index.html";

        }
    );

}


// =======================================================
// SURVEILLANCE DE LA SESSION
// =======================================================

supabaseClient.auth.onAuthStateChange(
    (event, session) => {

        console.log(
            "Événement Supabase :",
            event
        );


        if (session) {

            console.log(
                "Utilisateur connecté :",
                session.user.email
            );

        } else {

            console.log(
                "Utilisateur déconnecté"
            );

        }

    }
);

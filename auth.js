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
// CRÉATION DU CLIENT SUPABASE
// =======================================================

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        {
            auth: {

                // Garde la connexion après F5
                persistSession: true,

                // Renouvelle automatiquement la session
                autoRefreshToken: true,

                // Détecte les sessions dans l'URL
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
            "Système de comptes démarré"
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
        document.getElementById(
            "loginForm"
        );


    if (!form)
        return;


    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const email =
                document
                    .getElementById(
                        "loginEmail"
                    )
                    .value
                    .trim();


            const password =
                document
                    .getElementById(
                        "loginPassword"
                    )
                    .value;


            const message =
                document.getElementById(
                    "loginMessage"
                );


            message.textContent =
                "Connexion...";


            message.className =
                "form-message";


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
                    "Erreur connexion :",
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


            // Petite pause avant redirection
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
                    .getElementById(
                        "prenom"
                    )
                    .value
                    .trim();


            const nom =
                document
                    .getElementById(
                        "nom"
                    )
                    .value
                    .trim();


            const email =
                document
                    .getElementById(
                        "email"
                    )
                    .value
                    .trim();


            const telephone =
                document
                    .getElementById(
                        "telephone"
                    )
                    .value
                    .trim();


            const password =
                document
                    .getElementById(
                        "password"
                    )
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
                "Compte créé :",
                data
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
            "Erreur session :",
            error
        );

        return;

    }


    const session =
        data.session;


    // ===================================================
    // UTILISATEUR CONNECTÉ
    // ===================================================

    if (session) {

        console.log(
            "Session trouvée :",
            session.user.email
        );


        // Si on est sur connexion.html,
        // on peut directement aller au compte.

        if (
            document.getElementById(
                "loginForm"
            )
        ) {

            window.location.href =
                "compte.html";

            return;

        }


        // Si on est sur compte.html,
        // on affiche les informations.

        loadUser(
            session.user
        );


        return;

    }


    // ===================================================
    // AUCUNE SESSION
    // ===================================================

    console.log(
        "Aucune session active."
    );


    // Si on est sur compte.html
    // et qu'il n'y a aucune session,
    // retour à la connexion.

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
// AFFICHAGE DU COMPTE
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
                    "Erreur déconnexion :",
                    error
                );


                return;

            }


            console.log(
                "Utilisateur déconnecté"
            );


            window.location.href =
                "index.html";

        }
    );

}


// =======================================================
// SURVEILLANCE DES CHANGEMENTS DE SESSION
// =======================================================

supabaseClient.auth.onAuthStateChange(
    (event, session) => {

        console.log(
            "Auth event :",
            event
        );


        if (session) {

            console.log(
                "Session active :",
                session.user.email
            );

        } else {

            console.log(
                "Session inexistante"
            );

        }

    }
);

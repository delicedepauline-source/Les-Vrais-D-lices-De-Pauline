/* =====================================================
   LES DÉLICES DE PAULINE
   SYSTÈME DE COMPTES SUPABASE
===================================================== */


/* =====================================================
   CONFIGURATION SUPABASE
===================================================== */

const SUPABASE_URL =
    "https://qyysftxupnnfikmrjjue.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_0FTC_yZFfch1S10KkDLGqA_pmZTxJMC";


/* =====================================================
   CRÉATION DU CLIENT SUPABASE
===================================================== */

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true
            }
        }
    );


console.log("SUPABASE AUTH INITIALISÉ");


/* =====================================================
   INSCRIPTION
===================================================== */

function setupRegister() {

    const form =
        document.getElementById("registerForm");

    if (!form) return;


    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const prenom =
                document.getElementById("prenom")?.value.trim() || "";

            const nom =
                document.getElementById("nom")?.value.trim() || "";

            const email =
                document.getElementById("email")?.value.trim() || "";

            const telephone =
                document.getElementById("telephone")?.value.trim() || "";

            const password =
                document.getElementById("password")?.value || "";

            const passwordConfirm =
                document.getElementById("passwordConfirm")?.value || "";

            const message =
                document.getElementById("registerMessage");


            if (password !== passwordConfirm) {

                if (message) {

                    message.textContent =
                        "Les mots de passe ne correspondent pas.";

                    message.className =
                        "form-message error";

                }

                return;
            }


            if (message) {

                message.textContent =
                    "Création de votre compte...";

                message.className =
                    "form-message";

            }


            const { error } =
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

                console.error(
                    "Erreur inscription :",
                    error
                );


                if (message) {

                    message.textContent =
                        error.message;

                    message.className =
                        "form-message error";

                }

                return;

            }


            if (message) {

                message.textContent =
                    "Compte créé ! Vous pouvez maintenant vous connecter.";

                message.className =
                    "form-message success";

            }


            setTimeout(() => {

                window.location.href =
                    "connexion.html";

            }, 1500);

        }
    );

}


/* =====================================================
   CONNEXION
===================================================== */

function setupLogin() {

    const form =
        document.getElementById("loginForm");

    if (!form) return;


    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const email =
                document
                    .getElementById("loginEmail")
                    ?.value
                    .trim() || "";


            const password =
                document
                    .getElementById("loginPassword")
                    ?.value || "";


            const message =
                document.getElementById(
                    "loginMessage"
                );


            if (message) {

                message.textContent =
                    "Connexion...";

                message.className =
                    "form-message";

            }


            const { data, error } =
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


                if (message) {

                    message.textContent =
                        "Adresse e-mail ou mot de passe incorrect.";

                    message.className =
                        "form-message error";

                }

                return;

            }


            console.log(
                "Connexion réussie :",
                data.user.email
            );


            if (message) {

                message.textContent =
                    "Connexion réussie !";

                message.className =
                    "form-message success";

            }


            setTimeout(() => {

                window.location.href =
                    "compte.html";

            }, 500);

        }
    );

}


/* =====================================================
   DÉCONNEXION
===================================================== */

function setupLogout() {

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    const adminLogout =
        document.getElementById(
            "adminLogout"
        );


    const buttons = [
        logoutButton,
        adminLogout
    ];


    buttons.forEach(button => {

        if (!button) return;


        button.addEventListener(
            "click",
            async () => {

                const { error } =
                    await supabaseClient.auth.signOut();


                if (error) {

                    console.error(
                        "Erreur déconnexion :",
                        error
                    );

                    return;

                }


                window.location.href =
                    "index.html";

            }
        );

    });

}


/* =====================================================
   CHARGER LE COMPTE
===================================================== */

async function loadAccount() {

    const userEmail =
        document.getElementById(
            "userEmail"
        );


    /*
       Si on n'est pas sur compte.html,
       on ne fait rien.
    */

    if (!userEmail) return;


    const {
        data,
        error
    } =
        await supabaseClient.auth.getUser();


    if (error || !data.user) {

        console.log(
            "Aucun utilisateur connecté."
        );


        window.location.href =
            "connexion.html";

        return;

    }


    const user =
        data.user;


    const metadata =
        user.user_metadata || {};


    const prenom =
        metadata.prenom || "client";


    const nom =
        metadata.nom || "";


    const telephone =
        metadata.telephone ||
        "Non renseigné";


    const userFirstName =
        document.getElementById(
            "userFirstName"
        );


    const userFullName =
        document.getElementById(
            "userFullName"
        );


    const userPhone =
        document.getElementById(
            "userPhone"
        );


    if (userFirstName) {

        userFirstName.textContent =
            prenom;

    }


    if (userFullName) {

        userFullName.textContent =
            `${prenom} ${nom}`.trim();

    }


    userEmail.textContent =
        user.email;


    if (userPhone) {

        userPhone.textContent =
            telephone;

    }


    console.log(
        "Compte chargé :",
        user.email
    );

}


/* =====================================================
   INITIALISATION
===================================================== */

function initializeAuth() {

    setupRegister();

    setupLogin();

    setupLogout();

    loadAccount();

}


if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeAuth
    );

} else {

    initializeAuth();

}


console.log(
    "AUTH.JS EST BIEN CHARGÉ"
);

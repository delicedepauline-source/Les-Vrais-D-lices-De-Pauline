/* =====================================================
   LES DÉLICES DE PAULINE
   SCRIPT COMPLET
   SUPABASE + PRODUITS + PANIER + COMPTES + COMMANDES
===================================================== */


/* =====================================================
   SUPABASE
===================================================== */

const SUPABASE_URL =
    "https://qyysftxupnnfikmrjjue.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_0FTC_yZFfch1S10KkDLGqA_pmZTxJMC";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

console.log("Supabase :", typeof supabaseClient);


/* =====================================================
   PRODUITS
===================================================== */

const products = [

    {
        id: 1,
        name: "Tartelette citron",
        category: "patisseries",
        price: 4.20,
        description: "Une tartelette fraîche et délicatement acidulée.",
        image: "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: 2,
        name: "Éclair chocolat",
        category: "patisseries",
        price: 4.50,
        description: "Un grand classique tout en gourmandise.",
        image: "https://images.unsplash.com/photo-1614707267537-2b3a7e7f0e3b?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: 3,
        name: "Fraisier",
        category: "patisseries",
        price: 5.90,
        description: "Crème légère, fraises et biscuit moelleux.",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: 4,
        name: "Cookie maison",
        category: "patisseries",
        price: 2.80,
        description: "Croustillant à l'extérieur et fondant à l'intérieur.",
        image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: 5,
        name: "Jambon emmental",
        category: "sandwichs",
        price: 5.90,
        description: "Pain frais, jambon et emmental fondant.",
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: 6,
        name: "Poulet crudités",
        category: "sandwichs",
        price: 6.50,
        description: "Poulet, crudités croquantes et sauce maison.",
        image: "https://images.unsplash.com/photo-1553909489-cd47e0ef937f?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: 7,
        name: "Thon crudités",
        category: "sandwichs",
        price: 6.20,
        description: "Une recette fraîche et généreuse.",
        image: "https://images.unsplash.com/photo-1481070414801-51fd732d7184?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: 8,
        name: "Eau minérale",
        category: "boissons",
        price: 1.50,
        description: "La fraîcheur tout simplement.",
        image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: 9,
        name: "Jus d'orange",
        category: "boissons",
        price: 3.20,
        description: "Une pause fruitée et vitaminée.",
        image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: 10,
        name: "Café",
        category: "boissons",
        price: 2.20,
        description: "Un café pour accompagner votre gourmandise.",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: 11,
        name: "Thé",
        category: "boissons",
        price: 2.50,
        description: "Une boisson chaude et réconfortante.",
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: 12,
        name: "Part de flan",
        category: "patisseries",
        price: 3.80,
        description: "Crémeux, vanillé et généreux.",
        image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=85"
    }

];


/* =====================================================
   PANIER
===================================================== */

let cart =
    JSON.parse(
        localStorage.getItem(
            "les-delices-panier"
        )
    ) || [];


/* =====================================================
   ELEMENTS
===================================================== */

const productsGrid =
    document.getElementById(
        "productsGrid"
    );

const cartItems =
    document.getElementById(
        "cartItems"
    );

const cartTotal =
    document.getElementById(
        "cartTotal"
    );

const cartCount =
    document.getElementById(
        "cartCount"
    );

const toast =
    document.getElementById(
        "toast"
    );


/* =====================================================
   PRIX
===================================================== */

function formatPrice(price) {

    return price.toLocaleString(
        "fr-FR",
        {
            style: "currency",
            currency: "EUR"
        }
    );

}


/* =====================================================
   NOTIFICATION
===================================================== */

function showToast(message) {

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


/* =====================================================
   PANIER
===================================================== */

function saveCart() {

    localStorage.setItem(
        "les-delices-panier",
        JSON.stringify(cart)
    );

}


function addToCart(id) {

    const existing =
        cart.find(
            item => item.id === id
        );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            id: id,

            quantity: 1

        });

    }


    saveCart();

    renderCart();

    showToast(
        "Produit ajouté au panier ✓"
    );

}


function changeQuantity(
    id,
    amount
) {

    const item =
        cart.find(
            item => item.id === id
        );


    if (!item) return;


    item.quantity += amount;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                item => item.id !== id
            );

    }


    saveCart();

    renderCart();

}


function removeFromCart(id) {

    cart =
        cart.filter(
            item => item.id !== id
        );


    saveCart();

    renderCart();

}


/* =====================================================
   AFFICHER PRODUITS
===================================================== */

function renderProducts(
    filter = "all"
) {

    if (!productsGrid) return;


    const filteredProducts =
        filter === "all"

            ? products

            : products.filter(
                product =>
                    product.category === filter
            );


    productsGrid.innerHTML =
        filteredProducts
            .map(product => `

                <article class="product-card">

                    <div
                        class="product-image"
                        style="
                            background-image:
                            url('${product.image}');
                        ">
                    </div>

                    <div class="product-info">

                        <h3>
                            ${product.name}
                        </h3>

                        <p>
                            ${product.description}
                        </p>

                        <div class="product-bottom">

                            <span class="price">
                                ${formatPrice(product.price)}
                            </span>

                            <button
                                class="add-button"
                                data-add="${product.id}">
                                Ajouter
                            </button>

                        </div>

                    </div>

                </article>

            `)
            .join("");


    document
        .querySelectorAll("[data-add]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    addToCart(
                        Number(
                            button.dataset.add
                        )
                    );

                }
            );

        });

}


/* =====================================================
   AFFICHER PANIER
===================================================== */

function renderCart() {

    if (!cartItems) return;


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">
                Votre panier est vide.
            </div>

        `;

    } else {

        cartItems.innerHTML =
            cart
                .map(item => {

                    const product =
                        products.find(
                            p =>
                                p.id === item.id
                        );


                    if (!product)
                        return "";


                    return `

                        <div class="cart-row">

                            <div>

                                <strong>
                                    ${product.name}
                                </strong>

                                <div class="cart-meta">

                                    ${formatPrice(
                                        product.price
                                    )}

                                    ×

                                    ${item.quantity}

                                    =

                                    ${formatPrice(
                                        product.price *
                                        item.quantity
                                    )}

                                </div>

                            </div>


                            <div class="quantity">

                                <button
                                    data-minus="${product.id}">
                                    −
                                </button>

                                <span>
                                    ${item.quantity}
                                </span>

                                <button
                                    data-plus="${product.id}">
                                    +
                                </button>

                                <button
                                    class="remove-button"
                                    data-remove="${product.id}">
                                    Suppr.
                                </button>

                            </div>

                        </div>

                    `;

                })
                .join("");

    }


    let total = 0;

    let quantity = 0;


    cart.forEach(item => {

        const product =
            products.find(
                p =>
                    p.id === item.id
            );


        if (!product) return;


        total +=
            product.price *
            item.quantity;


        quantity +=
            item.quantity;

    });


    if (cartTotal) {

        cartTotal.textContent =
            formatPrice(total);

    }


    if (cartCount) {

        cartCount.textContent =
            quantity;

    }


    document
        .querySelectorAll("[data-minus]")
        .forEach(button => {

            button.onclick = () => {

                changeQuantity(
                    Number(
                        button.dataset.minus
                    ),
                    -1
                );

            };

        });


    document
        .querySelectorAll("[data-plus]")
        .forEach(button => {

            button.onclick = () => {

                changeQuantity(
                    Number(
                        button.dataset.plus
                    ),
                    1
                );

            };

        });


    document
        .querySelectorAll("[data-remove]")
        .forEach(button => {

            button.onclick = () => {

                removeFromCart(
                    Number(
                        button.dataset.remove
                    )
                );

            };

        });

}


/* =====================================================
   FILTRES
===================================================== */

document
    .querySelectorAll(".filter")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".filter")
                    .forEach(btn => {

                        btn.classList.remove(
                            "active"
                        );

                    });


                button.classList.add(
                    "active"
                );


                renderProducts(
                    button.dataset.filter
                );

            }
        );

    });


/* =====================================================
   MENU MOBILE
===================================================== */

const menuToggle =
    document.getElementById(
        "menuToggle"
    );

const navLinks =
    document.getElementById(
        "navLinks"
    );


if (
    menuToggle &&
    navLinks
) {

    menuToggle.addEventListener(
        "click",
        () => {

            navLinks.classList.toggle(
                "open"
            );

        }
    );

}


/* =====================================================
   LIGHTBOX
===================================================== */

const lightbox =
    document.getElementById(
        "lightbox"
    );

const lightboxImage =
    document.getElementById(
        "lightboxImage"
    );

const closeLightbox =
    document.getElementById(
        "closeLightbox"
    );


document
    .querySelectorAll(
        ".gallery-image"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const image =
                    button.querySelector(
                        "img"
                    );


                if (
                    !image ||
                    !lightbox ||
                    !lightboxImage
                )
                    return;


                lightboxImage.src =
                    image.src;

                lightboxImage.alt =
                    image.alt;

                lightbox.classList.add(
                    "open"
                );

            }
        );

    });


if (closeLightbox) {

    closeLightbox.addEventListener(
        "click",
        () => {

            if (lightbox) {

                lightbox.classList.remove(
                    "open"
                );

            }

        }
    );

}


/* =====================================================
   CRÉATION DE COMPTE
===================================================== */

const signupForm =
    document.getElementById(
        "signupForm"
    );

const loginForm =
    document.getElementById(
        "loginForm"
    );

const logoutButton =
    document.getElementById(
        "logoutButton"
    );

const accountMessage =
    document.getElementById(
        "accountMessage"
    );


/* =====================================================
   MESSAGE COMPTE
===================================================== */

function accountMsg(
    message
) {

    if (accountMessage) {

        accountMessage.textContent =
            message;

    }

}


/* =====================================================
   CRÉER UN COMPTE
===================================================== */

if (signupForm) {

    signupForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const email =
                document.getElementById(
                    "signupEmail"
                ).value.trim();


            const password =
                document.getElementById(
                    "signupPassword"
                ).value;


            accountMsg(
                "Création du compte..."
            );


            const {
                data,
                error
            } =
                await supabaseClient
                    .auth
                    .signUp({

                        email:
                            email,

                        password:
                            password

                    });


            if (error) {

                console.error(error);

                accountMsg(
                    "Erreur : " +
                    error.message
                );

                return;

            }


            console.log(
                "Compte créé :",
                data
            );


            accountMsg(
                "Compte créé avec succès ✓"
            );


            signupForm.reset();

        }
    );

}


/* =====================================================
   CONNEXION
===================================================== */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const email =
                document.getElementById(
                    "loginEmail"
                ).value.trim();


            const password =
                document.getElementById(
                    "loginPassword"
                ).value;


            accountMsg(
                "Connexion..."
            );


            const {
                data,
                error
            } =
                await supabaseClient
                    .auth
                    .signInWithPassword({

                        email:
                            email,

                        password:
                            password

                    });


            if (error) {

                console.error(error);

                accountMsg(
                    "Erreur : " +
                    error.message
                );

                return;

            }


            console.log(
                "Utilisateur connecté :",
                data.user
            );


            accountMsg(
                "Connexion réussie ✓"
            );


            loginForm.reset();

            updateAccountUI(
                data.user
            );

        }
    );

}


/* =====================================================
   DÉCONNEXION
===================================================== */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async () => {

            const {
                error
            } =
                await supabaseClient
                    .auth
                    .signOut();


            if (error) {

                accountMsg(
                    "Erreur : " +
                    error.message
                );

                return;

            }


            accountMsg(
                "Vous êtes déconnecté."
            );


            updateAccountUI(
                null
            );

        }
    );

}


/* =====================================================
   INTERFACE COMPTE
===================================================== */

function updateAccountUI(
    user
) {

    if (
        signupForm &&
        loginForm &&
        logoutButton
    ) {

        if (user) {

            signupForm.style.display =
                "none";

            loginForm.style.display =
                "none";

            logoutButton.style.display =
                "block";

        } else {

            signupForm.style.display =
                "block";

            loginForm.style.display =
                "block";

            logoutButton.style.display =
                "none";

        }

    }

}


/* =====================================================
   VÉRIFIER UTILISATEUR
===================================================== */

async function checkUser() {

    const {
        data
    } =
        await supabaseClient
            .auth
            .getUser();


    if (data.user) {

        console.log(
            "Utilisateur connecté :",
            data.user.email
        );


        updateAccountUI(
            data.user
        );

    } else {

        console.log(
            "Aucun utilisateur connecté."
        );

        updateAccountUI(
            null
        );

    }

}


/* =====================================================
   COMMANDES SUPABASE
===================================================== */

const orderForm =
    document.getElementById(
        "orderForm"
    );


if (orderForm) {

    orderForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            /* PANIER VIDE */

            if (cart.length === 0) {

                showToast(
                    "Votre panier est vide."
                );

                return;

            }


            /* UTILISATEUR */

            const {
                data:
                    userData
            } =
                await supabaseClient
                    .auth
                    .getUser();


            /*
             * Pour l'instant la commande
             * peut être passée sans compte.
             */


            /* FORMULAIRE */

            const formData =
                new FormData(
                    orderForm
                );


            /* TOTAL */

            const total =
                cart.reduce(
                    (
                        sum,
                        item
                    ) => {

                        const product =
                            products.find(
                                p =>
                                    p.id ===
                                    item.id
                            );


                        if (!product)
                            return sum;


                        return sum +
                            (
                                product.price *
                                item.quantity
                            );

                    },
                    0
                );


            /* COMMANDE */

            const order = {

                prenom:
                    formData.get(
                        "prenom"
                    ),

                nom:
                    formData.get(
                        "nom"
                    ),

                telephone:
                    formData.get(
                        "telephone"
                    ),

                email:
                    formData.get(
                        "email"
                    ),

                date_retrait:
                    formData.get(
                        "date"
                    ),

                heure_retrait:
                    formData.get(
                        "heure"
                    ),

                commentaire:
                    formData.get(
                        "commentaire"
                    ),

                produits:
                    cart,

                total:
                    total

            };


            console.log(
                "Commande envoyée :",
                order
            );


            /* ENVOI SUPABASE */

            const {
                data,
                error
            } =
                await supabaseClient
                    .from("orders")
                    .insert(
                        [order]
                    )
                    .select();


            /* ERREUR */

            if (error) {

                console.error(
                    "Erreur commande :",
                    error
                );


                showToast(
                    "Erreur : " +
                    error.message
                );


                return;

            }


            /* SUCCÈS */

            console.log(
                "Commande enregistrée :",
                data
            );


            showToast(
                "Commande enregistrée ✓"
            );


            /* VIDER PANIER */

            cart = [];

            saveCart();

            renderCart();

            orderForm.reset();

        }
    );

}


/* =====================================================
   FORMULAIRE PERSONNALISÉ
===================================================== */

const customForm =
    document.getElementById(
        "customForm"
    );


if (customForm) {

    customForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            showToast(
                "Demande personnalisée envoyée ✓"
            );


            customForm.reset();

        }
    );

}


/* =====================================================
   CONTACT
===================================================== */

const contactForm =
    document.getElementById(
        "contactForm"
    );


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            showToast(
                "Message envoyé ✓"
            );


            contactForm.reset();

        }
    );

}


/* =====================================================
   ANNÉE
===================================================== */

const year =
    document.getElementById(
        "year"
    );


if (year) {

    year.textContent =
        new Date().getFullYear();

}


/* =====================================================
   INITIALISATION
===================================================== */

renderProducts();

renderCart();

checkUser();


console.log(
    "LES DÉLICES DE PAULINE : SCRIPT OK ✓"
);

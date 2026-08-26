/*
=========================================================
ESPACE ADMINISTRATEUR
LES DÉLICES DE PAULINE
=========================================================
*/


// =======================================================
// ATTENDRE SUPABASE
// =======================================================

async function initializeAdmin() {

    if (!window.supabase)
        return;


    const client =
        supabaseClient;


    // ---------------------------------------------------
    // Vérifier que l'utilisateur est connecté
    // ---------------------------------------------------

    const {

        data: { user },

        error

    } = await client.auth.getUser();


    if (error || !user) {

        window.location.href =
            "connexion.html";

        return;

    }


    /*
    =====================================================
    IMPORTANT

    L'administrateur sera contrôlé avec la base
    Supabase.

    Nous allons mettre en place cette sécurité lors
    de la prochaine étape.
    =====================================================
    */


    loadProducts();

    loadOrders();

    setupProductModal();

}


// =======================================================
// PRODUITS
// =======================================================

async function loadProducts() {

    const container =
        document.getElementById(
            "productsAdminContainer"
        );


    if (!container) return;


    const { data, error } =
        await supabaseClient
            .from("products")
            .select("*")
            .order("created_at", {
                ascending: false
            });


    if (error) {

        container.innerHTML = `
            <p class="form-message error">
                Impossible de charger les produits.
            </p>
        `;

        console.error(error);

        return;

    }


    document.getElementById("totalProducts")
        .textContent =
            data.length;


    if (data.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-cookie-bite"></i>
                <p>Aucun produit pour le moment.</p>
            </div>
        `;

        return;

    }


    container.innerHTML = "";


    data.forEach(product => {

        const card =
            document.createElement("div");

        card.className =
            "admin-product-card";


        card.innerHTML = `

            <div class="admin-product-image">

                <img
                    src="${product.image || 'https://placehold.co/300x200'}"
                    alt="${escapeHtml(product.name)}"
                >

            </div>


            <div class="admin-product-info">

                <span class="product-category">
                    ${escapeHtml(product.category || "")}
                </span>

                <h3>
                    ${escapeHtml(product.name)}
                </h3>

                <p>
                    ${escapeHtml(product.description || "")}
                </p>

                <strong>
                    ${Number(product.price).toFixed(2)} €
                </strong>


                <div class="admin-product-actions">

                    <button
                        class="btn-secondary edit-product"
                        data-id="${product.id}"
                    >

                        <i class="fa-solid fa-pen"></i>

                        Modifier

                    </button>


                    <button
                        class="btn-danger delete-product"
                        data-id="${product.id}"
                    >

                        <i class="fa-solid fa-trash"></i>

                        Supprimer

                    </button>

                </div>

            </div>

        `;


        container.appendChild(card);

    });


    document
        .querySelectorAll(".edit-product")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => editProduct(button.dataset.id)
            );

        });


    document
        .querySelectorAll(".delete-product")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => deleteProduct(button.dataset.id)
            );

        });

}


// =======================================================
// SUPPRIMER PRODUIT
// =======================================================

async function deleteProduct(id) {

    if (!confirm(
        "Voulez-vous vraiment supprimer ce produit ?"
    )) {

        return;

    }


    const { error } =
        await supabaseClient
            .from("products")
            .delete()
            .eq("id", id);


    if (error) {

        alert(
            "Impossible de supprimer le produit."
        );

        console.error(error);

        return;

    }


    loadProducts();

}


// =======================================================
// MODIFIER PRODUIT
// =======================================================

async function editProduct(id) {

    const { data, error } =
        await supabaseClient
            .from("products")
            .select("*")
            .eq("id", id)
            .single();


    if (error) {

        console.error(error);

        return;

    }


    document.getElementById("productId")
        .value = data.id;


    document.getElementById("productName")
        .value = data.name;


    document.getElementById("productDescription")
        .value = data.description || "";


    document.getElementById("productPrice")
        .value = data.price;


    document.getElementById("productCategory")
        .value = data.category;


    document.getElementById("productImage")
        .value = data.image || "";


    document.getElementById("productModalTitle")
        .textContent =
            "Modifier le produit";


    document.getElementById("productModal")
        .classList.remove("hidden");

}


// =======================================================
// MODALE PRODUIT
// =======================================================

function setupProductModal() {

    const modal =
        document.getElementById("productModal");


    const addButton =
        document.getElementById("addProductButton");


    const closeButton =
        document.getElementById("closeProductModal");


    const form =
        document.getElementById("productForm");


    if (!modal || !form) return;


    addButton.addEventListener(
        "click",
        () => {

            form.reset();

            document.getElementById("productId")
                .value = "";

            document.getElementById("productModalTitle")
                .textContent =
                    "Ajouter un produit";

            modal.classList.remove("hidden");

        }
    );


    closeButton.addEventListener(
        "click",
        () => {

            modal.classList.add("hidden");

        }
    );


    form.addEventListener(
        "submit",
        saveProduct
    );

}


// =======================================================
// ENREGISTRER PRODUIT
// =======================================================

async function saveProduct(event) {

    event.preventDefault();


    const id =
        document.getElementById("productId")
            .value;


    const product = {

        name:
            document.getElementById("productName")
                .value.trim(),

        description:
            document.getElementById("productDescription")
                .value.trim(),

        price:
            Number(
                document.getElementById("productPrice")
                    .value
            ),

        category:
            document.getElementById("productCategory")
                .value,

        image:
            document.getElementById("productImage")
                .value.trim()

    };


    let result;


    if (id) {

        result =
            await supabaseClient
                .from("products")
                .update(product)
                .eq("id", id);

    } else {

        result =
            await supabaseClient
                .from("products")
                .insert(product);

    }


    if (result.error) {

        document.getElementById("productMessage")
            .textContent =
                "Une erreur est survenue.";

        console.error(result.error);

        return;

    }


    document.getElementById("productModal")
        .classList.add("hidden");


    loadProducts();

}


// =======================================================
// COMMANDES
// =======================================================

async function loadOrders() {

    const container =
        document.getElementById(
            "adminOrdersContainer"
        );


    if (!container) return;


    const { data, error } =
        await supabaseClient
            .from("orders")
            .select("*")
            .order("created_at", {
                ascending: false
            })
            .limit(20);


    if (error) {

        container.innerHTML = `
            <p>
                Impossible de charger les commandes.
            </p>
        `;

        return;

    }


    document.getElementById("totalOrders")
        .textContent =
            data.length;


    if (data.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-cart-shopping"></i>
                <p>Aucune commande pour le moment.</p>
            </div>
        `;

        return;

    }


    container.innerHTML = data.map(order => `

        <div class="admin-order">

            <div>

                <strong>
                    Commande #${order.id}
                </strong>

                <p>
                    ${order.customer_name || "Client"}
                </p>

            </div>


            <strong>
                ${Number(order.total || 0).toFixed(2)} €
            </strong>

        </div>

    `).join("");

}


// =======================================================
// PROTECTION HTML
// =======================================================

function escapeHtml(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}


// =======================================================
// DÉMARRAGE
// =======================================================

if (
    window.location.pathname
        .toLowerCase()
        .includes("admin.html")
) {

    const waitForSupabase =
        setInterval(() => {

            if (typeof supabaseClient !== "undefined"
                && supabaseClient) {

                clearInterval(waitForSupabase);

                initializeAdmin();

            }

        }, 100);

}

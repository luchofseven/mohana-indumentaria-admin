import {
  onGetProducts,
  getProduct,
  saveProduct,
  updateProduct,
  deleteProduct,
  getUserAuth,
  userSingOut,
} from "./firebase/firesbase.js";

const $productForm = document.getElementById("product-form");
const $productsContainer = document.getElementById("products-container");
const $loginModal = document.getElementById("login-modal");
const $userName = document.getElementById("user-name");
const $loginForm = document.getElementById("login-form");
const $btnLogin = document.getElementById("btn-login");
const $btnLogout = document.getElementById("btn-logout");

let editStatus = false;
let id = "";

addEventListener("DOMContentLoaded", async () => {
  $btnLogout.style.display = "none";

  onGetProducts((products) => {
    let html = "";

    products.forEach((el) => {
      const product = el.data();

      html += `<div>
                    <img src=${product.img} alt=${product.name}>
                    <p>${product.name}</p>
                    <h5>$${product.price}</h5>
                    <p>Stock: ${product.stock}</p>
                    <button class="btn-edit" data-id="${el.id}">Editar</button>
                    <button class="btn-delete" data-id="${el.id}">Eliminar</button>
                </div>`;
    });

    $productsContainer.innerHTML = html;

    const btnsDelete = $productsContainer.querySelectorAll(".btn-delete");

    btnsDelete.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        let deleting = confirm("¿Desea eliminar éste producto?");
        if (deleting) {
          deleteProduct(id);
        }
      });
    });

    const btnsEdit = $productsContainer.querySelectorAll(".btn-edit");

    btnsEdit.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const doc = await getProduct(e.target.dataset.id);
        const product = doc.data();

        $productForm["product-name"].value = product.name;
        $productForm["product-price"].value = product.price;
        $productForm["product-img"].value = product.img;
        $productForm["product-stock"].value = product.stock;

        editStatus = true;
        id = e.target.dataset.id;

        $productForm["btn-product-add"].innerText = "Actualizar";
        scrollTo(0, 0);
      });
    });
  });
});

$productForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = $productForm["product-name"].value.toUpperCase();
  const price = $productForm["product-price"].value;
  const img = $productForm["product-img"].value;
  const stock = $productForm["product-stock"].value;

  if (!editStatus) {
    if (name != "" && price >= 0 && img != "" && stock >= 0) {
      try {
        saveProduct(name, price, img, stock);
      } catch (error) {
        console.log(
          `Se produjo un error al intentar guardar el producto. Error: ${error}`
        );
      }
    }
  } else {
    if (id != "" && name != "" && price >= 0 && img != "" && stock >= 0) {
      try {
        updateProduct(id, {
          name: name,
          price: price,
          img: img,
          stock: stock,
        });
        editStatus = false;
        $productForm["btn-product-add"].innerText = "Agregar";
      } catch (error) {
        console.log(
          `Se produjo un error al intentar guardar el producto. Error: ${error}`
        );
      }
    }
  }

  $productForm.reset();
});

document.addEventListener("click", (e) => {
  if (e.target === $btnLogin) {
    $loginModal.classList.add("is-active");
  }

  if (e.target.matches("#close-modal")) {
    e.preventDefault();
    $loginModal.classList.remove("is-active");
  }

  if (e.target.matches("#login-form input[type=submit]")) {
    e.preventDefault();

    const email = $loginForm["email"].value;
    const password = $loginForm["password"].value;

    let userAuth = getUserAuth(email, password);
    userAuth
      .then((userCredential) => {
        const user = userCredential.user;
        if (user.uid) {
          $btnLogout.style.display = "block";
          $btnLogin.style.display = "none";
          $userName.textContent = `Hola ${user.email}`;
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });

    $loginForm.reset();
    $loginModal.classList.remove("is-active");
  }

  if (e.target === $btnLogout) {
    let singOut = userSingOut();
    singOut
      .then(() => {
        $btnLogout.style.display = "none";
        $btnLogin.style.display = "block";
        $userName.textContent = `¡Estás deslogueado!`;
      })
      .catch((error) => {
        console.log(error);
      });
  }
});

let allProjects = []; //Test pour acceder aux projects et filtrer

const linkApi = "http://localhost:5678/api/works";

const response = fetch(linkApi).then((res) => {
  if (res.ok) {
    return res.json().then(function (data) {
      allProjects = data; //Réutiliser pour le filtre Tous
      generateWorks(data);
      generateCategories(data);
      generateWorksModal(data);
      generateCategoriesModal(data);
    });
  } else {
    returnToLogin(res.status);
    console.log(
      "Erreur de connexion avec le serveur - Impossible d'afficher les projects"
    );
  }
});

//Création des buttons de filtrage
function generateCategories(data) {
  const categoriesSet = new Set();
  const categories = document.querySelector("#filtres");

  //Création de button Tous
  let btnTous = document.createElement("button");
  btnTous.innerText = "Tous";
  btnTous.classList.add("btn-tous", "filter");
  categories.appendChild(btnTous);

  //Création des autres buttons
  for (let i = 0; i < data.length; i++) {
    const currentCategorie = data[i].category.name;
    if (!categoriesSet.has(currentCategorie)) {
      const btn = document.createElement("button");
      btn.innerText = currentCategorie;
      btn.setAttribute("class", "filter");
      categories.appendChild(btn);
      categoriesSet.add(currentCategorie);
    }
  }
}

//Génération des projets à afficher
function generateWorks(works) {
  // Récupération de l'élément du DOM qui accueillera les fiches
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  for (let i = 0; i < works.length; i++) {
    const article = works[i];

    // Création d’une balise dédiée à un projet
    const figure = document.createElement("figure");
    gallery.appendChild(figure);
    //Création des balises
    const imageElement = document.createElement("img");
    imageElement.src = article.imageUrl;
    imageElement.alt = article.title;
    figure.appendChild(imageElement);

    //Création de l'élement figcaption
    const figcaption = document.createElement("figcaption");
    figcaption.innerText = article.title;
    figure.appendChild(figcaption);
  }
}

setTimeout(() => {
  worksFilter();
}, "500");

//Filtrer les works en fonction du nom
function worksFilter() {
  //Je récupère tous les filtres
  let filters = document.getElementsByClassName("filter");
  for (let i = 0; i < filters.length; i++) {
    filters[i].addEventListener("click", () => {
      console.log(filters[i]);
      let currentFilterName = filters[i].innerText;

      let filteredProjects = [];
      if ("Tous" == currentFilterName) {
        filteredProjects = allProjects;
      } else {
        filteredProjects = allProjects.filter((work) => {
          return work.category.name === currentFilterName;
        });
      }

      console.log(filteredProjects);
      const gallery = document.querySelector(".gallery");
      gallery.innerHTML = "";
      generateWorks(filteredProjects);
    });
  }
}

// Verifier l'existence du token dans le local Storage

const logout = document.querySelector(".logout");
const unloggedHidden = document.querySelectorAll(".unlogged-hidden");
const loggedHidden = document.querySelectorAll(".logged-hidden");

logout.addEventListener("click", function () {
  checkIfTokenExit();
  window.localStorage.removeItem("token");
  window.localStorage.removeItem("userId");
  location.reload();
});

//Function pour vérifier l'existence du Token
function checkIfTokenExit() {
  return !(localStorage.getItem("token") === null);
}

//Cacher éléments du DOM selon conection
if (checkIfTokenExit()) {
  for (var i = 0; i < loggedHidden.length; i++) {
    loggedHidden[i].style.display = "none";
  }
} else {
  for (var i = 0; i < unloggedHidden.length; i++) {
    unloggedHidden[i].style.display = "none";
  }
}

//Visualisation des boites modales
let modal1 = null;
const focusableSelector = "button, a, input, select, textarea";
let focusables = [];
//Modal 1 (Galerie)
galleryHidden = document.querySelector(".gallery-hidden");
//Modal 2 (Formulaire)
formHidden = document.querySelector(".form-hidden");

const openModal = function (e) {
  e.preventDefault();
  modal1 = document.querySelector(e.target.getAttribute("href"));

  focusables = Array.from(modal1.querySelectorAll(focusableSelector));
  modal1.style.display = null;
  modal1.removeAttribute("aria-hidden");
  modal1.setAttribute("aria-modal", "true");
  formHidden.style.display = "none";

  //Appel function fermeture de la boite
  modal1.addEventListener("click", closeModal);
  modal1.querySelector(".close-modal").addEventListener("click", closeModal);
  modal1
    .querySelector(".modal-stop")
    .addEventListener("click", stopPropagation);

  //Visualisation de la modal 2 (Formulaire)
  const buttonAddPhoto = document.querySelector(".gallery-hidden .btn-vert");
  buttonAddPhoto.addEventListener("click", function () {
    displayModal2();
  });

  //Revenir à la modal 1 (galerie)
  const goBack = document.querySelector(".fa-arrow-left-long");
  goBack.addEventListener("click", function () {
    // Réinitialiser les valeurs
    if (inputTitle || selectCategory) {
      inputTitle.value = "";
      previewInput.style.opacity = "1";
      selectCategory.value = "";
    }

    // Cacher le preview de l'image
    if (document.querySelector(".nouvelle-image")) {
      document.querySelector(".nouvelle-image").style.display = "none";
    }

    // Appel a function afficher la modal 1 et cacher la modal 2
    displayModal1();
  });
};

function displayModal1() {
  galleryHidden.style.display = null;
  formHidden.style.display = "none";
}

function displayModal2() {
  galleryHidden.style.display = "none";
  formHidden.style.display = null;
}

//Function pour fermeture de la boite modale
const closeModal = function (e) {
  if (modal1 === null) return;
  e.preventDefault();
  modal1.style.display = "none";
  modal1.setAttribute("aria-hidden", "true");
  modal1.removeAttribute("aria-modal");
  modal1.removeEventListener("click", closeModal);
  modal1.querySelector(".close-modal").removeEventListener("click", closeModal);
  modal1
    .querySelector(".modal-stop")
    .removeEventListener("click", stopPropagation);
  modal1 = null;
};

//Evite que la boite se ferme quand on click dessous
const stopPropagation = function (e) {
  e.stopPropagation();
};

//Tab sur les différents éléments de la modale
const focusInModal = function (e) {
  e.preventDefault();
  let index = focusables.findIndex((f) => f === modal1.querySelector(":focus"));
  if (e.shiftKey === true) {
    index--;
  } else {
    index++;
  }
  if (index >= focusables.length) {
    index = 0;
  }
  if (index < 0) {
    index = focusables.length - 1;
  }
  focusables[index].focus();
};

//Ouverture de la modal
document.querySelector(".open-modal").addEventListener("click", openModal);

//Fermeture de la boite avec la touche Escape
window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }
  if (e.key === "Tab" && modal1 !== null) {
    focusInModal(e);
  }
});

//Création de la galerie dans la boite modale
const galleryModal = document.querySelector("#galerie-modal");

function generateWorksModal(works) {
  galleryModal.innerHTML = "";
  for (let i = 0; i < works.length; i++) {
    const article = works[i];

    const figure = document.createElement("figure");
    galleryModal.appendChild(figure);

    const trash = document.createElement("i");
    trash.className = "fa-regular fa-trash-can";
    figure.appendChild(trash);

    const image = document.createElement("img");
    image.src = article.imageUrl;
    figure.appendChild(image);

    //function pour faire apparaitre l'icone d'expansion de l'image
    let expand;
    image.addEventListener("pointerover", function () {
      expand = document.createElement("i");
      expand.className = "fa-solid fa-arrows-up-down-left-right";
      figure.appendChild(expand);
    });

    image.addEventListener("pointerout", function () {
      figure.removeChild(expand);
    });

    const figcaption = document.createElement("figcaption");
    figcaption.innerText = "éditer";
    figure.appendChild(figcaption);

    //Delete d'un projet
    trash.addEventListener("click", function () {
      if (confirm("Êtes-vous sûr de vouloir supprimer le projet?")) {
        galleryModal.removeChild(figure);
        let id = works[i].id;
        fetch(linkApi + "/" + id, {
          method: "DELETE",
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${window.localStorage.token}`,
          },
        }).then((res) => {
          console.log(res);
          if (res.ok) {
            // Mettre à jour le tableau "works" en supprimant le projet
            works.splice(i, 1);
            generateWorksModal(works);
            generateWorks(works);
          } else {
            returnToLogin(res.status);
            alert("Le projet n'a pas pu etre supprimé. Veuillez réessayer");
          }
        });
      }
    });
  }
}

//On cache le button par default de l'input "file"
const inputFile = document.querySelector('input[type = "file"]');
inputFile.style.display = "none";

//Création des balises pour le formulaire modal2
const formElement = document.querySelector(".form-hidden form");
const formModal = document.querySelector("#form-modal");
//Balise Titre
const labelTitle = document.createElement("label");
labelTitle.innerText = "Titre";
labelTitle.setAttribute("for", "title");
const inputTitle = document.createElement("input");
inputTitle.setAttribute("required", true);
inputTitle.id = "title";
inputTitle.name = "title";
inputTitle.type = "text";
formModal.appendChild(labelTitle);
formModal.appendChild(inputTitle);

//Ajout de la balise Categorie
const labelCategory = document.createElement("label");
labelCategory.innerText = "Catégorie";
labelCategory.setAttribute("for", "category");
const selectCategory = document.createElement("select");
selectCategory.setAttribute("required", true);
selectCategory.id = "category";
selectCategory.name = "category";
formModal.appendChild(labelCategory);
formModal.appendChild(selectCategory);

//Ajout du button Submit
const buttonValider = document.createElement("input");
buttonValider.classList.add("btn-vert");
buttonValider.type = "button";
buttonValider.value = "Valider";
buttonValider.disabled = true;
buttonValider.setAttribute("id", "valid-form");
formElement.appendChild(buttonValider); //

//Récuperation des catégories depuis l'API
function generateCategoriesModal(data) {
  const categoriesSet = new Set();

  for (let i = 0; i < data.length; i++) {
    const currentCategorie = data[i].category.name;
    let categoryId = data[i].category.id;
    if (!categoriesSet.has(currentCategorie)) {
      const option = document.createElement("option");
      option.innerText = currentCategorie;
      option.setAttribute("value", categoryId);
      selectCategory.appendChild(option);
      categoriesSet.add(currentCategorie);
    }
  }
}

//Ajouter une nouvelle photo
//Container button + image
const previewImage = document.querySelector("#preview-image");
//Container button et icone pour selectionner le fichier
const previewInput = document.querySelector(".preview-input");
const inputImage = document.querySelector(".preview-input input");

//Utiliser le container pour choisir le fichier
previewInput.addEventListener("click", function () {
  document.getElementById("file").click();
});

// Faire apparaitre l'image selectionnée
inputImage.addEventListener("change", function () {
  const image = inputImage.files[0];
  const reader = new FileReader();
  //Vérification de la taille de fichier
  const fileSize = image.size;
  const maxSize = 4 * 1024 * 1024;

  if (fileSize > maxSize) {
    alert(
      "Le fichier sélectionné est trop volumineux. Le poids maximum autorisé est de 4 Mo"
    );
    inputImage.value = "";
  }
  let allowedExtension = ["image/png", "image/jpeg", "image/jpg"];
  if (!allowedExtension.includes(image.type)) {
    alert(
      "Le format de fichier choisi n'est pas autorisé. Veuillez choisir un fichier en format .JPG, .JPEG ou .PNG"
    );
    inputImage.value = "";
  } else {
    reader.onload = function (e) {
      const img = new Image();
      img.src = e.target.result;
      img.classList.add("nouvelle-image");

      // Supprime l'ancienne image de la zone d'aperçu
      const ancienneImage = document.querySelector(".nouvelle-image");
      if (ancienneImage) {
        ancienneImage.remove();
      }

      previewImage.appendChild(img);
    };
    //On cache le button mais reste cliquable
    previewImage.style.position = "relative";
    previewInput.style.position = "absolute";
    previewInput.style.opacity = "0";
    previewInput.style.zIndex = "1";

    reader.readAsDataURL(image);
  }
});

//Activer le button Valider quand le formulaire est rempli
function verifierValidForm() {
  if (
    document.querySelector("#file").files.length === 0 ||
    document.querySelector("#title").value === "" ||
    document.querySelector("#category").value === ""
  ) {
    buttonValider.disabled = true;
  } else {
    buttonValider.disabled = false;
  }
}

document.querySelector("#file").addEventListener("change", verifierValidForm);
document.querySelector("#title").addEventListener("input", verifierValidForm);
document
  .querySelector("#category")
  .addEventListener("change", verifierValidForm);

buttonValider.addEventListener("click", function (e) {
  e.preventDefault();
  let formData = new FormData();

  let newProjetImage = document.querySelector("#file").files[0];
  let newProjetTitle = document.querySelector("#title").value;
  let newProjetCategory = document.querySelector("#category").value;

  formData.append("image", newProjetImage);
  formData.append("title", newProjetTitle);
  formData.append("category", newProjetCategory);

  console.log(formData);

  console.log(formData.get("image"));
  console.log(formData.get("title"));
  console.log(formData.get("category"));

  //Envoyer la requete à l'API
  fetch(linkApi, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${window.localStorage.token}`,
    },
  }).then((res) => {
    console.log(res);
    if (res.ok) {
      return res.json().then((data) => {
        displayModal1();
      });
    } else {
      returnToLogin(res.status);
      alert("Une erreur s'est produite");
      console.log(res);
    }
  });
});

function returnToLogin(errorCode) {
  if (errorCode == 401) {
    alert("Veuillez vous reconecter");
    document.location = "./login.html";
  }
}

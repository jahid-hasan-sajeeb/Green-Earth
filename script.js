console.log("script connected");

// API 
const API = {
  allPlants: "https://openapi.programming-hero.com/api/plants",
  categories: "https://openapi.programming-hero.com/api/categories",
  category: id => `https://openapi.programming-hero.com/api/category/${id}`,
  plant: id => `https://openapi.programming-hero.com/api/plant/${id}`
};

let plants = [];
let categories = [];
let cart = {};

// Price
const priceText = n => "৳" + n;

const $ = sel => document.querySelector(sel);

let categoriesList, plantsGrid, plantsStatus, cartItems, cartTotal;
let plantModal, modalImage, modalName, modalCategory, modalDesc, modalPrice, modalBuyNow, modalCloseBtn, modalXBtn;

// All Plants 
async function loadPlants() {
  plantsStatus.textContent = "Loading plants...";

  const res = await fetch(API.allPlants);
  const data = await res.json();

  plants = data.plants;
  renderPlants(plants);

  plantsStatus.textContent = "";
}

// loading categories
async function loadCategories() {
  try {
    const res = await fetch(API.categories);
    const data = await res.json();
    categories = data.categories ?? [];
  } catch (err) {
    console.error('Failed to load categories', err);
    categories = [];
  }
  renderCategories();
}

function renderCategories() {
  if (!categoriesList) return;

  let html = `
    <li>
      <button data-cat="all" class="w-full px-3 py-2 rounded bg-emerald-700 text-white">All Trees</button>
    </li>
  `;

  categories.forEach(cat => {
    html += `
      <li>
        <button data-cat="${cat.id}" class="w-full px-3 py-2 rounded hover:bg-emerald-50 text-left">
          ${cat.category_name}
        </button>
      </li>
    `;
  });

  categoriesList.innerHTML = html;


  const buttons = categoriesList.querySelectorAll('button[data-cat]');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      
      buttons.forEach(b => b.classList.remove('bg-emerald-700','text-white'));
      btn.classList.add('bg-emerald-700','text-white');

      const id = btn.getAttribute('data-cat');
      filterByCategory(id);
    });
  });
}



// Filter by Category
async function filterByCategory(id) {
  if (id === "all") {
    renderPlants(plants);
    return;
  }

  plantsStatus.textContent = "Loading...";
  const res = await fetch(API.category(id));
  const data = await res.json();

  renderPlants(data.plants);
  plantsStatus.textContent = "";
}
// Rendering Plants
function renderPlants(list) {
  plantsGrid.innerHTML = "";

  list.forEach(p => {
    plantsGrid.innerHTML += `
      <div class="bg-white border rounded-lg overflow-hidden">
        <img src="${p.image}" class="h-40 w-full object-cover" />

        <div class="p-4">
          <button class="viewPlantBtn text-left font-semibold w-full" data-id="${p.id}">
            ${p.name}
          </button>

          <p class="text-xs text-gray-500 mt-2">${p.description}</p>

          <div class="flex justify-between mt-3">
            <span class="text-xs bg-emerald-100 px-2 py-1 rounded">${p.category}</span>
            <span class="font-semibold">${priceText(p.price)}</span>
          </div>

          <button class="addBtn w-full mt-3 bg-emerald-700 text-white py-2 rounded" data-id="${p.id}">
            Add to Cart
          </button>
        </div>
      </div>
    `;
  });
}

// Add to Cart
function addToCart(plant) {
  if (!cart[plant.id]) {
    cart[plant.id] = { plant, qty: 1 };
  } else {
    cart[plant.id].qty++;
  }
  renderCart();
}

// Remove from Cart
function removeFromCart(id) {
  delete cart[id];
  renderCart();
}

// Render Cart
function renderCart() {
  cartItems.innerHTML = "";

  let total = 0;

  Object.values(cart).forEach(item => {
    cartItems.innerHTML += `
      <div class="flex justify-between">
        <div>
          <div class="font-medium">${item.plant.name}</div>
          <div class="text-xs text-gray-500">
            ${priceText(item.plant.price)} × ${item.qty}
          </div>
        </div>
        <button class="text-red-500 removeBtn" data-id="${item.plant.id}">✕</button>
      </div>
    `;

    total += item.plant.price * item.qty;
  });

  cartTotal.textContent = priceText(total);

  document.querySelectorAll(".removeBtn").forEach(btn => {
    btn.onclick = () => removeFromCart(btn.dataset.id);
  });
}

// Open Plant Modal
async function openPlantModal(id) {
  plantModal.classList.remove("hidden");
  plantModal.classList.add("flex");

  modalName.textContent = "Loading...";
  modalDesc.textContent = "";
  modalCategory.textContent = "";
  modalImage.src = "";

  const res = await fetch(API.plant(id));
  const data = await res.json();
  const p = data.plants; 

  modalImage.src = p.image;
  modalName.textContent = p.name;
  modalCategory.textContent = p.category;
  modalDesc.textContent = p.description;
  modalPrice.textContent = priceText(p.price);

  modalBuyNow.onclick = () => {
    addToCart(p);
    closeModal();
  };
}

function closeModal() {
  plantModal.classList.add("hidden");
  plantModal.classList.remove("flex");
}

function setupEvents() {
  plantsGrid.addEventListener("click", e => {
    if (e.target.classList.contains("viewPlantBtn")) {
      openPlantModal(e.target.dataset.id);
    }

    if (e.target.classList.contains("addBtn")) {
      const plant = plants.find(p => p.id == e.target.dataset.id);
      addToCart(plant);
    }
  });

  modalCloseBtn.onclick = closeModal;
  modalXBtn.onclick = closeModal;

  plantModal.addEventListener("click", e => {
    if (e.target === plantModal) closeModal();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  categoriesList = $("#categoriesList");
  plantsGrid = $("#plantsGrid");
  plantsStatus = $("#plantsStatus");
  cartItems = $("#cartItems");
  cartTotal = $("#cartTotal");

  plantModal = $("#plantModal");
  modalImage = $("#modalImage");
  modalName = $("#modalName");
  modalCategory = $("#modalCategory");
  modalDesc = $("#modalDesc");
  modalPrice = $("#modalPrice");
  modalBuyNow = $("#modalBuyNow");
  modalCloseBtn = $("#modalCloseBtn");
  modalXBtn = $("#closePlantModal");

  setupEvents();
  loadPlants();
  loadCategories();
  renderCart();
});

const overlay = document.getElementById("overlay");
const menu = document.getElementById("menu");
let sections = document.getElementById("product-sect");

function openModal(id){
  document.getElementById(id).classList.add("active");
  overlay.classList.add("active");
}

function closeModal(id){
  document.getElementById(id).classList.remove("active");
  overlay.classList.remove("active");
}

overlay.addEventListener("click", () => {
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.classList.remove("active");
  });
  overlay.classList.remove("active");
});

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

console.log("script connected");
console.log("registerForm:", registerForm);
console.log("loginForm:", loginForm);


registerForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const firstName = document.getElementById("regFirstName").value.trim();
  const lastName = document.getElementById("regLastName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value.trim();
  const phone = document.getElementById("regPhone").value.trim();
  const zipcode = document.getElementById("regZip").value.trim();
  const address = document.getElementById("regAddress").value.trim();
  const age = Number(document.getElementById("regAge").value);
  const avatar = document.getElementById("regAvatar").value.trim();
  const gender = document.getElementById("regGender").value;

  const registerData = {
    firstName,
    lastName,
    email,
    password,
    phone,
    zipcode,
    address,
    age,
    avatar,
    gender
  };

  console.log("register data:", registerData);

  try {
    const response = await fetch("https://api.everrest.educata.dev/auth/sign_up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(registerData)
    });

    const data = await response.json();
    console.log("register response:", data);

    if (!response.ok) {
      alert(data.message || "რეგისტრაცია გავლილია");
      return;
    }

    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
    }

    if (data.refresh_token) {
      localStorage.setItem("refreshToken", data.refresh_token);
    }

    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    alert("Registration successful");
    registerForm.reset();
    closeModal("registerModal");
  } catch (error) {
    console.error("Register error:", error);
    alert("Something went wrong during registration");
  }
});


loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  const loginData = {
    email,
    password
  };

  console.log("login data:", loginData);

  try {
    const response = await fetch("https://api.everrest.educata.dev/auth/sign_in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(loginData)
    });

    const data = await response.json();
    console.log("login response:", data);

    if (!response.ok) {
      alert(data.message ||"წარმატებით შეხვედით");
      return;
    }

    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
    }

    if (data.refresh_token) {
      localStorage.setItem("refreshToken", data.refresh_token);
    }

    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    alert("Login successful");
    loginForm.reset();
    closeModal("loginModal");
  } catch (error) {
    console.error("Login error:", error);
    alert("Something went wrong during login");
  }
});


/* burger menu*/
document.getElementById("burger").onclick = () => {
  menu.classList.add("active");
  overlay.classList.add("active");
};

function closeMenu(){
  menu.classList.remove("active");
  overlay.classList.remove("active");
}

overlay.onclick = () => {
  document.querySelectorAll(".modal").forEach(m=>m.classList.remove("active"));
  menu.classList.remove("active");
  overlay.classList.remove("active");
};

//filtracia
function toggleFilter(el) {
  el.classList.toggle("active");
  let content = el.nextElementSibling;
  content.classList.toggle("active");
}

const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");

if (priceRange) {
  priceRange.addEventListener("input", () => {
    priceValue.textContent = priceRange.value;
  });
}

function selectRating(el) {
  document.querySelectorAll(".filter-content p").forEach(p => {
    p.style.fontWeight = "normal";
  });
  el.style.fontWeight = "bold";
}



let section = document.getElementById("product-sect");
let allProducts = []; 


function getAll() {
  fetch("https://api.everrest.educata.dev/shop/products/all?page_index=1&page_size=38")
    .then(res => res.json())
    .then(data => {
      allProducts = data.products;

      renderProducts(allProducts); 
    });
}

getAll();

function renderProducts(products) {
  section.innerHTML = "";

  products.forEach(product => {
    section.innerHTML += productCardHtml(product);
  });
}

function productCardHtml(product) {

  return `
    <div class="card" style="width: 18rem; box-shadow:0 4px 8px">
      <img src="${product.thumbnail}" class="card-img-top" style="max-width:200px;">
      <div class="card-body">
        <h5>${product.brand}</h5>

        <p>
          Price: ${product.price.current} ${product.price.currency} 
        </p>

        <p>
          Rating: ${product.rating} ⭐
        </p>

        <p>
          ${product.stock === 0 ? "Out of stock" : "In stock"}
        </p>

        <button onclick="addToCart('${product.id}')">
          Add to cart
        </button>
   <div onclick="openProduct('${product.id}')">
      </div>
    </div>
  `;

}




//filter
const checkboxes = document.querySelectorAll(".filter-content input[type='checkbox']");

checkboxes.forEach(checkbox => {
  checkbox.addEventListener("change", filterByCategory);
});

function filterByCategory() {
  let selected = [];

  checkboxes.forEach(cb => {
    if (cb.checked) {
      selected.push(cb.parentElement.textContent.trim().toLowerCase());
    }
  });

  let filtered = allProducts.filter(product => {
    if (selected.length === 0) return true;

    return selected.some(cat =>
      product.category?.name?.toLowerCase().includes(cat)
    );
  });

  renderProducts(filtered);
}

function filtration(category) {
  let filtered = allProducts.filter(product =>
    product.category?.name?.toLowerCase().includes(category.toLowerCase())
  );

  renderProducts(filtered);
}


//search
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

let sectione = document.getElementById("product-sect");

function searchProducts() {
  let query = searchInput.value.toLowerCase();

  fetch("https://api.everrest.educata.dev/shop/products/all?page_index=1&page_size=38")
    .then(res => res.json())
    .then(data => {

      let filtered = data.products.filter(product => {
        return (
          product.title?.toLowerCase().includes(query) ||
          product.brand?.toLowerCase().includes(query)
        );
      });

      renderProducts(filtered);
    });
}

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchProducts();
  }
});

function renderProducts(products) {
  section.innerHTML = "";

  products.forEach(product => {
    section.innerHTML += productCardHtml(product);
  });
}

function productCardHtml(product) {
  return `
    <div class="card">
      <img src="${product.thumbnail}" style="max-width:200px;">
      <h4>${product.title}</h4>
      <p>${product.price}$</p>
    </div>
  `;
}
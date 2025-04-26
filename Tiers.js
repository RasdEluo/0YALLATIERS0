window.onload = () => {
  setTimeout(() => {
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('main-content').classList.remove('hidden');
  }, 3000);
};

// Scroll to top
const scrollTopBtn = document.getElementById("scroll-top");
window.onscroll = () => {
  scrollTopBtn.style.display = window.scrollY > 200 ? "block" : "none";
};
scrollTopBtn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });

// Login
document.getElementById("login-btn").onclick = () => {
  document.getElementById("login-modal").style.display = "flex";
};
document.getElementById("close-login").onclick = () => {
  document.getElementById("login-modal").style.display = "none";
};
document.getElementById("submit-login").onclick = () => {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  if (user && pass) {
    localStorage.setItem("yallaUser", user);
    alert("Logged in!");
    document.getElementById("login-modal").style.display = "none";
  }
};

// Analysis Modal
document.getElementById("analysis-btn").onclick = () => {
  document.getElementById("analysis-modal").style.display = "flex";
};
document.getElementById("close-analysis").onclick = () => {
  document.getElementById("analysis-modal").style.display = "none";
};

// Year Dropdown
const yearSelect = document.getElementById("vehicle-year");
for (let y = new Date().getFullYear(); y >= 1900; y--) {
  let opt = document.createElement("option");
  opt.value = opt.text = y;
  yearSelect.add(opt);
}

// VPIC API for Make/Model
document.getElementById("vehicle-year").onchange = fetchMakes;
document.getElementById("vehicle-type").onchange = fetchMakes;
async function fetchMakes() {
  const year = yearSelect.value;
  const type = document.getElementById("vehicle-type").value;
  const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/${type}?format=json`);
  const data = await res.json();
  const makeSelect = document.getElementById("vehicle-make");
  makeSelect.innerHTML = '';
  data.Results.forEach(make => {
    const opt = document.createElement("option");
    opt.value = opt.text = make.MakeName;
    makeSelect.add(opt);
  });
}

document.getElementById("vehicle-make").onchange = async () => {
  const year = yearSelect.value;
  const make = document.getElementById("vehicle-make").value;
  const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${make}/modelyear/${year}?format=json`);
  const data = await res.json();
  const modelSelect = document.getElementById("vehicle-model");
  modelSelect.innerHTML = '';
  data.Results.forEach(model => {
    const opt = document.createElement("option");
    opt.value = opt.text = model.Model_Name;
    modelSelect.add(opt);
  });
};

// AI Search
document.getElementById("search-btn").onclick = async () => {
  const part = document.getElementById("part-search").value;
  const year = yearSelect.value;
  const make = document.getElementById("vehicle-make").value;
  const model = document.getElementById("vehicle-model").value;
  const vehicleInfo = `Year: ${year}, Make: ${make}, Model: ${model}`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer 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",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "mistral/mistral-7b-instruct",
      messages: [{
        role: "user",
        content: `Find ${part} for this vehicle: ${vehicleInfo}. Include product description, estimate price, condition rating (1-10), and links from Amazon, eBay, and OpenSooq.`
      }]
    })
  });
  const json = await response.json();
  document.getElementById("results").innerText = json.choices[0].message.content;
};

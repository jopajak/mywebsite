let currentLang = 'en';

// Language dictionary for static text
const translations = {
  en: {
    nav: ['Home','Buy','Rent','Services','Agents','Contact'],
    searchPlaceholder: 'Search offers...',
  },
  pl: {
    nav: ['Strona główna','Kupno','Wynajem','Usługi','Agenci','Kontakt'],
    searchPlaceholder: 'Szukaj ofert...',
  }
};

// Language toggle
document.querySelectorAll('.lang-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    currentLang = btn.dataset.lang;
    updateText();
    renderOffers(allBuyOffers || [], 'buy-listings');
    renderOffers(allRentOffers || [], 'rent-listings');
  });
});

function updateText(){
  document.querySelectorAll('[data-key]').forEach(el=>{
    const key = el.dataset.key;
    el.textContent = translations[currentLang][key];
  });
  // Update placeholder
  const searchInputs = document.querySelectorAll('.search-bar input');
  searchInputs.forEach(input=>{
    input.placeholder = translations[currentLang].searchPlaceholder;
  });
}

// Offers rendering
let allBuyOffers = [];
let allRentOffers = [];

function renderOffers(offers, containerId){
  const container = document.getElementById(containerId);
  if(!container) return;
  container.innerHTML = '';
  offers.forEach(o=>{
    const title = currentLang==='pl'?o.title_pl:o.title_en;
    const desc = currentLang==='pl'?o.description_pl:o.description_en;
    container.innerHTML += `
      <div class="offer-card">
        <img src="${o.image}" alt="${title}">
        <h3>${title}</h3>
        <p>${desc}</p>
        <span class="price">${o.price}</span>
      </div>
    `;
  });
}

// Load Buy offers
fetch('offers-buy.json')
  .then(res=>res.json())
  .then(data=>{
    allBuyOffers = data;
    renderOffers(allBuyOffers, 'buy-listings');
  });

// Load Rent offers
fetch('offers-rent.json')
  .then(res=>res.json())
  .then(data=>{
    allRentOffers = data;
    renderOffers(allRentOffers, 'rent-listings');
  });

// Search
document.querySelectorAll('#buy-search, #rent-search').forEach(input=>{
  input.addEventListener('input', e=>{
    const query = e.target.value.toLowerCase();
    let offers = input.id==='buy-search'?allBuyOffers:allRentOffers;
    const filtered = offers.filter(o=>{
      const title = currentLang==='pl'?o.title_pl:o.title_en;
      const desc = currentLang==='pl'?o.description_pl:o.description_en;
      return title.toLowerCase().includes(query) || desc.toLowerCase().includes(query);
    });
    renderOffers(filtered, input.id==='buy-search'?'buy-listings':'rent-listings');
  });
});

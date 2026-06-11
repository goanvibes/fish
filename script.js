const CONFIG = {
  panaji: {
    name: 'The Fish House Panaji',
    phone: '919588437107',
    displayPhone: '+91 95884 37107',
    address: "Gera's Imperium Green, Neugi Nagar, Panaji, Goa 403001"
  },
  riverside: {
    name: 'The Fish House Riverside',
    phone: '918806459881',
    displayPhone: '+91 88064 59881',
    address: 'Patto, Ilhas, Ribandar, Panaji, Goa 403006'
  }
};

const menuItems = [
  { name: 'Kingfish Thali', category: 'thali', price: 'Market fresh', desc: 'Fried kingfish, rice, curry, vegetables, pickle and homely Goan sides.' },
  { name: 'Prawns Thali', category: 'thali', price: 'Market fresh', desc: 'Prawn curry, rice and coastal accompaniments with balanced spice.' },
  { name: 'Chonak Thali', category: 'thali', price: 'Market fresh', desc: 'Sea bass thali for diners who want a richer, meaty local fish.' },
  { name: 'Goan Fish Bowl', category: 'thali', price: '₹150', desc: 'Prawns curry with white rice and salad for a quick comforting meal.' },
  { name: 'Whole Crab Special', category: 'seafood', price: 'Market fresh', desc: 'Riverside-style whole crab preparation, best checked before visiting.' },
  { name: 'Seafood Boil', category: 'seafood', price: 'Market fresh', desc: 'Fresh seafood boiled and seasoned for sharing across the table.' },
  { name: 'Fried Fish of the Day', category: 'seafood', price: 'Market fresh', desc: 'Seasonal catch fried with house masala and served crisp.' },
  { name: 'Burnt Garlic Prawns Fried Rice', category: 'chinese', price: '₹280', desc: 'A popular Indo-Chinese rice plate with prawns and burnt garlic.' },
  { name: 'Drums of Heaven', category: 'chinese', price: 'Ask', desc: 'Crispy chicken starter for groups and evening tables.' },
  { name: 'Chicken in Coriander Sauce', category: 'chinese', price: '₹250', desc: 'Saucy chicken dish with coriander notes and Indo-Chinese comfort.' },
  { name: 'Chicken in Chilli Lemon Sauce', category: 'chinese', price: '₹250', desc: 'Bright, spicy and tangy chicken plate for sharing.' },
  { name: 'Paneer Tikka', category: 'veg', price: '₹250', desc: 'Vegetarian tandoor-style starter listed for the Riverside menu.' },
  { name: 'Vegetarian Fried Rice', category: 'veg', price: 'Ask', desc: 'Simple Indo-Chinese vegetarian plate for mixed groups.' },
  { name: 'Family Drinks Table', category: 'drink', price: 'Ask', desc: 'Available at the riverside family bar depending on service hours.' }
];

const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const topbar = document.querySelector('#topbar');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}

window.addEventListener('scroll', () => {
  if (topbar) topbar.classList.toggle('scrolled', window.scrollY > 12);
});

const yearSpan = document.querySelector('#year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

function createWhatsAppUrl(branchKey, message) {
  const branch = CONFIG[branchKey] || CONFIG.panaji;
  return `https://wa.me/${branch.phone}?text=${encodeURIComponent(message)}`;
}

function openWhatsApp(branchKey, message) {
  window.open(createWhatsAppUrl(branchKey, message), '_blank', 'noopener');
}

document.querySelectorAll('[data-whatsapp]').forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.whatsapp;
    const branch = button.dataset.branch || 'panaji';
    if (action === 'branch') {
      const b = CONFIG[branch];
      openWhatsApp(branch, `Hello ${b.name}, I would like to enquire about a table / order today. Branch: ${b.address}`);
      return;
    }
    if (action === 'order') {
      openWhatsApp('panaji', 'Hello The Fish House, I would like to know today’s fish thali and seafood menu availability.');
      return;
    }
    openWhatsApp('panaji', 'Hello The Fish House, I would like to reserve a table / place an enquiry. Please share availability.');
  });
});

function menuCard(item) {
  return `
    <article class="menu-item reveal visible" data-category="${item.category}" data-name="${item.name.toLowerCase()} ${item.desc.toLowerCase()}">
      <span class="category-pill">${item.category}</span>
      <div class="menu-item-top">
        <h3>${item.name}</h3>
        <span class="price">${item.price}</span>
      </div>
      <p>${item.desc}</p>
      <button class="item-wa" type="button" data-dish="${item.name}">Ask on WhatsApp</button>
    </article>
  `;
}

function renderMenu(targetId, limit = null) {
  const grid = document.getElementById(targetId);
  if (!grid) return;
  const items = limit ? menuItems.slice(0, limit) : menuItems;
  grid.innerHTML = items.map(menuCard).join('');
  grid.querySelectorAll('[data-dish]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const dish = btn.dataset.dish;
      openWhatsApp('panaji', `Hello The Fish House, I would like to enquire about ${dish}. Please share availability and price.`);
    });
  });
}

renderMenu('homeMenuGrid', 6);
renderMenu('fullMenuGrid');

function applyMenuFilter(filter, scope = document) {
  const searchValue = (document.getElementById('menuSearch')?.value || '').toLowerCase().trim();
  scope.querySelectorAll('.menu-item').forEach((card) => {
    const matchesFilter = filter === 'all' || card.dataset.category === filter;
    const matchesSearch = !searchValue || card.dataset.name.includes(searchValue);
    card.style.display = matchesFilter && matchesSearch ? '' : 'none';
  });
}

let activeFilter = 'all';
document.querySelectorAll('.tab, .menu-filter').forEach((button) => {
  button.addEventListener('click', () => {
    const group = button.classList.contains('tab') ? '.tab' : '.menu-filter';
    document.querySelectorAll(group).forEach((b) => b.classList.remove('active'));
    button.classList.add('active');
    activeFilter = button.dataset.filter;
    applyMenuFilter(activeFilter);
  });
});

const menuSearch = document.getElementById('menuSearch');
if (menuSearch) menuSearch.addEventListener('input', () => applyMenuFilter(activeFilter));

const orderBuilder = document.getElementById('orderBuilder');
if (orderBuilder) {
  orderBuilder.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(orderBuilder);
    const branch = form.get('branch');
    const meal = form.get('meal');
    const people = form.get('people');
    openWhatsApp(branch, `Hello ${CONFIG[branch].name}, I would like to enquire about ${meal} for ${people} people. Please share availability, price and timing.`);
  });
}

const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(bookingForm);
    const branch = form.get('branch');
    const name = form.get('name');
    const phone = form.get('phone');
    const people = form.get('people');
    const datetime = form.get('datetime') || 'today / preferred time';
    const note = form.get('message') || 'Please share availability.';
    const message = `Hello ${CONFIG[branch].name}, my name is ${name}. I would like to book / enquire for ${people} people at ${datetime}. My number is ${phone}. ${note}`;
    openWhatsApp(branch, message);
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const restaurantSchema = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'The Fish House Goa',
  servesCuisine: ['Goan', 'Seafood', 'Indian', 'Indo-Chinese'],
  priceRange: '₹₹',
  hasMenu: 'menu.html',
  branchOf: { '@type': 'Restaurant', name: 'The Fish House' },
  department: [
    {
      '@type': 'Restaurant',
      name: 'The Fish House Panaji',
      telephone: CONFIG.panaji.displayPhone,
      address: CONFIG.panaji.address
    },
    {
      '@type': 'Restaurant',
      name: 'The Fish House Riverside Family Bar & Restaurant',
      telephone: CONFIG.riverside.displayPhone,
      address: CONFIG.riverside.address
    }
  ]
};

const schemaScript = document.createElement('script');
schemaScript.type = 'application/ld+json';
schemaScript.textContent = JSON.stringify(restaurantSchema);
document.head.appendChild(schemaScript);

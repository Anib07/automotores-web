const publicCarsContainer = document.getElementById('publicCarsContainer');
const searchInput = document.getElementById('searchInput');
const filterBrand = document.getElementById('filterBrand');
const filterModel = document.getElementById('filterModel');
const filterType = document.getElementById('filterType');
const filterYear = document.getElementById('filterYear');
const filterCondition = document.getElementById('filterCondition'); // select condición

// Renderizar autos públicos
function renderPublicCars() {
  const cars = JSON.parse(localStorage.getItem('adminCars')) || [];
  publicCarsContainer.innerHTML = "";

  const searchVal = searchInput.value.toLowerCase();
  const brandVal = filterBrand.value;
  const modelVal = filterModel.value;
  const typeVal = filterType.value;
  const yearVal = filterYear.value;
  const conditionVal = filterCondition.value;

  const filteredCars = cars.filter(car => {
    return (!brandVal || car.brand === brandVal) &&
           (!modelVal || car.model === modelVal) &&
           (!typeVal || car.type === typeVal) &&
           (!yearVal || car.year == yearVal) &&
           (!conditionVal || car.condition === conditionVal) &&
           (!searchVal || car.brand.toLowerCase().includes(searchVal) ||
                         car.model.toLowerCase().includes(searchVal) ||
                         car.type.toLowerCase().includes(searchVal));
  });

  // Mostrar solo los primeros 4 autos
  const carsToShow = filteredCars.slice(0, 4);

  carsToShow.forEach((car, index) => {
    const card = document.createElement("div");
    card.className = "card";

    // Carrusel de imágenes si hay varias
    let imagesHTML = '';
    if (car.images && car.images.length > 1) {
      imagesHTML = `<div class="card-carousel" style="position:relative;">
          <img src="${car.images[0]}" alt="${car.brand} ${car.model}" style="width:100%; height:180px; object-fit:cover; border-bottom:2px solid #ff8800;">
          <button class="prev-btn" style="position:absolute; top:50%; left:5px;">&#10094;</button>
          <button class="next-btn" style="position:absolute; top:50%; right:5px;">&#10095;</button>
        </div>`;
    } else {
      imagesHTML = `<img src="${car.images && car.images.length ? car.images[0] : car.img}" alt="${car.brand} ${car.model}" style="width:100%; height:180px; object-fit:cover; border-bottom:2px solid #ff8800;">`;
    }

    card.innerHTML = `
      ${imagesHTML}
      <div class="card-content">
        <h3>${car.brand} ${car.model} (${car.year})</h3>
        <p>Tipo: ${car.type}</p>
        <p>Condición: ${car.condition || 'N/A'}</p>
        <p>Colores: ${car.colors || 'N/A'}</p>
        <p class="price">${car.price.toLocaleString('es-PY')} Gs</p>
      </div>
    `;
    publicCarsContainer.appendChild(card);

    // Carrusel funcional
    if (car.images && car.images.length > 1) {
      const carouselImg = card.querySelector('img');
      let imgIndex = 0;
      const prevBtn = card.querySelector('.prev-btn');
      const nextBtn = card.querySelector('.next-btn');
      prevBtn.addEventListener('click', () => {
        imgIndex = (imgIndex - 1 + car.images.length) % car.images.length;
        carouselImg.src = car.images[imgIndex];
      });
      nextBtn.addEventListener('click', () => {
        imgIndex = (imgIndex + 1) % car.images.length;
        carouselImg.src = car.images[imgIndex];
      });
    }
  });

  // Botón "Ver catálogo completo"
  if (filteredCars.length > 4) {
    const moreBtn = document.createElement("div");
    moreBtn.style.textAlign = "center";
    moreBtn.style.marginTop = "30px";
    moreBtn.innerHTML = `
      <a href="catalogo.html" class="view-catalog-btn" style="
        display:inline-flex;
        align-items:center;
        gap:8px;
        padding:12px 25px;
        background:#ff8800;
        color:#000;
        font-weight:bold;
        border-radius:12px;
        text-decoration:none;
        transition:0.3s;
      ">
        Ver catálogo completo
        <i class="fas fa-arrow-right"></i>
      </a>
    `;
    publicCarsContainer.appendChild(moreBtn);
  }

  updatePublicFilters(cars);
  addExtraFeatures(filteredCars); // agregar botones info y whatsapp
}

// Actualizar filtros
function updatePublicFilters(cars){
  populateSelect(filterBrand, [...new Set(cars.map(c=>c.brand))], "Marca");
  populateSelect(filterModel, [...new Set(cars.map(c=>c.model))], "Modelo");
  populateSelect(filterType, [...new Set(cars.map(c=>c.type))], "Tipo");
  populateSelect(filterYear, [...new Set(cars.map(c=>c.year))].sort((a,b)=>b-a), "Año");
  populateSelect(filterCondition, [...new Set(cars.map(c=>c.condition))], "Condición");
}

// Poblar selects
function populateSelect(select, options, placeholder){
  const currentValue = select.value;
  select.innerHTML = `<option value="">${placeholder}</option>`;
  options.forEach(o=>{ 
    const opt = document.createElement('option'); 
    opt.value=o; 
    opt.textContent=o; 
    select.appendChild(opt); 
  });
  if(options.includes(currentValue)) select.value=currentValue;
}

// Eventos filtros y búsqueda
[filterBrand, filterModel, filterType, filterYear, filterCondition, searchInput].forEach(el=>el.addEventListener('input', renderPublicCars));

// Función para agregar botones "Información" y "WhatsApp" + zoom imagen
function addExtraFeatures(cars) {
  const cards = document.querySelectorAll('.card');

  cards.forEach((card, index) => {
    const car = cars[index];
    const cardContent = card.querySelector('.card-content');

    // Botón Información
    if (!card.querySelector('.info-btn')) {
      const infoBtn = document.createElement('button');
      infoBtn.innerHTML = `<i class="fas fa-info-circle"></i> Información`;
      infoBtn.className = "info-btn";
      infoBtn.style.cssText = `
        margin-top:10px;
        padding:10px 18px;
        border-radius:12px;
        background: linear-gradient(135deg, #ff8800, #ffaa33);
        color:#000;
        font-weight:bold;
        font-size:0.95rem;
        cursor:pointer;
        border:none;
        display:inline-flex;
        align-items:center;
        gap:8px;
        box-shadow: 0 4px 12px rgba(255,136,0,0.5);
        transition: all 0.3s ease;
      `;
      cardContent.appendChild(infoBtn);

      infoBtn.addEventListener('mouseenter', ()=>{ infoBtn.style.transform='scale(1.05)'; infoBtn.style.boxShadow='0 6px 20px rgba(255,165,0,0.7)'; });
      infoBtn.addEventListener('mouseleave', ()=>{ infoBtn.style.transform='scale(1)'; infoBtn.style.boxShadow='0 4px 12px rgba(255,136,0,0.5)'; });

      infoBtn.addEventListener('click', () => {
        document.getElementById('infoTitle').textContent = `${car.brand} ${car.model} (${car.year})`;
        document.getElementById('infoDesc').textContent = car.fullInfo || car.desc || 'Sin información adicional';
        document.getElementById('carInfoModal').style.display = 'flex';
      });
    }

    // Botón WhatsApp
    if (!card.querySelector('.whatsapp-btn')) {
      const waBtn = document.createElement('button');
      waBtn.innerHTML = `<i class="fab fa-whatsapp"></i> Solicitar por WhatsApp`;
      waBtn.className = "whatsapp-btn";
      waBtn.style.cssText = `
        margin-top:10px;
        padding:10px 18px;
        border-radius:12px;
        background: linear-gradient(135deg, #25D366, #1ebe5d);
        color:#fff;
        font-weight:bold;
        font-size:0.95rem;
        cursor:pointer;
        border:none;
        display:inline-flex;
        align-items:center;
        gap:8px;
        box-shadow: 0 4px 12px rgba(37,211,102,0.5);
        transition: all 0.3s ease;
      `;
      cardContent.appendChild(waBtn);

      waBtn.addEventListener('mouseenter', ()=>{ waBtn.style.transform='scale(1.05)'; waBtn.style.boxShadow='0 6px 20px rgba(37,211,102,0.7)'; });
      waBtn.addEventListener('mouseleave', ()=>{ waBtn.style.transform='scale(1)'; waBtn.style.boxShadow='0 4px 12px rgba(37,211,102,0.5)'; });

      waBtn.addEventListener('click', () => {
        const phone = "595XXXXXXXX"; // reemplazar con tu número
        const msg = `Hola, estoy interesado en el auto ${car.brand} ${car.model}`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
      });
    }

    // Zoom en imagen
    const img = card.querySelector('img');
    if(img){
      img.style.cursor = "pointer";
      img.addEventListener('click', ()=>{
        document.querySelector('#imageModal img').src = img.src;
        document.getElementById('imageModal').style.display = 'flex';
      });
    }
  });
}

// Cerrar modales
document.querySelector('#carInfoModal .close-modal').addEventListener('click', ()=>{ document.getElementById('carInfoModal').style.display='none'; });
document.getElementById('imageModal').addEventListener('click', ()=>{ document.getElementById('imageModal').style.display='none'; });

// Inicializar
renderPublicCars();

// Función para animar las cards al hacer scroll
function animateCardsOnScroll() {
  const cards = document.querySelectorAll('.card');

  cards.forEach(card => {
    const cardTop = card.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (cardTop < windowHeight - 100) { // cuando la card entra en viewport
      card.classList.add('visible');
    } else {
      card.classList.remove('visible'); // opcional si quieres animar al salir
    }
  });
}

// Escuchar scroll y ejecutar
window.addEventListener('scroll', animateCardsOnScroll);
window.addEventListener('load', animateCardsOnScroll); // también al cargar


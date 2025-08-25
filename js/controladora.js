const weatherContainer = document.getElementById("weather");
const refreshBtn = document.getElementById("refreshWeather");

const getWeatherData = async () => {
  const API_KEY = "e9d44e217be76a3c78194add9eba0de3";
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=-34.31667&lon=-57.35&units=metric&lang=es&appid=${API_KEY}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error en la solicitud del clima");
    const data = await response.json();
    return {
      ciudad: data.name,
      descripcion: data.weather[0].description,
      temperatura: data.main.temp,
      sensacion: data.main.feels_like,
      icono: data.weather[0].icon
    };
  } catch (error) {
    console.error("Error al obtener datos del clima:", error);
    throw error;
  }
};

const getWeatherForecast = async () => {
  const API_KEY = "e9d44e217be76a3c78194add9eba0de3";
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=-33.2825&lon=-57.6036&units=metric&lang=es&appid=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error en la solicitud del pronóstico");
    const data = await response.json();

    const dias = {};
    data.list.forEach(item => {
      const fecha = new Date(item.dt * 1000);
      const diaKey = fecha.toISOString().split('T')[0];
      if (!dias[diaKey]) dias[diaKey] = [];
      dias[diaKey].push(item);
    });

    const keys = Object.keys(dias).slice(0, 6);
    const pronostico = keys.map(key => {
      const dayData = dias[key];
      let medioDia = dayData.find(d => new Date(d.dt * 1000).getHours() === 12);
      if (!medioDia) medioDia = dayData[Math.floor(dayData.length / 2)];
      const temp_max = Math.max(...dayData.map(d => d.main.temp_max));
      const temp_min = Math.min(...dayData.map(d => d.main.temp_min));
      const descripcion = medioDia.weather[0].description;
      const icono = medioDia.weather[0].icon.replace('n','d');
      const fecha = new Date(medioDia.dt * 1000);
      return { fecha, temp_max, temp_min, descripcion, icono };
    });

    return pronostico.slice(1, 6);

  } catch (error) {
    console.error("Error al obtener pronóstico:", error);
    throw error;
  }
};

const renderWeatherCard = (clima) => {
  weatherContainer.innerHTML = `
    <div class="card bg-dark text-light p-3 mx-auto shadow-none" style="max-width: 400px;" tabindex="0" 
         aria-label="Clima actual en ${clima.ciudad}">
      <div class="d-flex align-items-center">
        <img src="https://openweathermap.org/img/wn/${clima.icono}@2x.png" 
             alt="${clima.descripcion}" class="me-3" />
        <div>
          <h3 class="h5 mb-1">${clima.ciudad}</h3>
          <p class="mb-0 text-capitalize">${clima.descripcion}</p>
          <p class="mb-0"><strong>${Math.round(clima.temperatura)}°C</strong> (sensación ${Math.round(clima.sensacion)}°C)</p>
        </div>
      </div>
    </div>
  `;
};

const renderForecast = (pronostico) => {
  const cards = pronostico.map(dia => `
    <div class="card bg-dark text-light p-2 m-1 shadow-none" style="width: 120px;" tabindex="0" 
         aria-label="Pronóstico para ${dia.fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' })}: ${dia.descripcion}, máxima ${Math.round(dia.temp_max)}°C, mínima ${Math.round(dia.temp_min)}°C">
      <p class="mb-1 text-center">${dia.fecha.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })}</p>
      <img src="https://openweathermap.org/img/wn/${dia.icono}@2x.png" alt="${dia.descripcion}" class="d-block mx-auto" />
      <p class="mb-0 text-center text-capitalize">${dia.descripcion}</p>
      <p class="mb-0 text-center"><strong>${Math.round(dia.temp_max)}°</strong> / ${Math.round(dia.temp_min)}°</p>
    </div>
  `).join("");

  weatherContainer.innerHTML += `
    <div class="d-flex justify-content-center flex-wrap mt-3" role="list">
      ${cards}
    </div>
  `;
};

const cargarClima = async () => {
  weatherContainer.innerHTML = `<p class="text-center">Cargando clima...</p>`;

  try {
    const clima = await getWeatherData();
    renderWeatherCard(clima);
  } catch {
    weatherContainer.innerHTML = `
      <div class="card bg-danger text-light p-3 mx-auto shadow-none" style="max-width: 400px;">
        <p class="mb-0 text-center">No se pudo cargar el clima actual.</p>
      </div>
    `;
    return;
  }

  const pronosticoContainer = document.createElement("div");
  pronosticoContainer.className = "text-center mt-3";
  pronosticoContainer.innerHTML = `<p>Cargando pronóstico...</p>`;
  weatherContainer.appendChild(pronosticoContainer);

  try {
    const pronostico = await getWeatherForecast();
    pronosticoContainer.innerHTML = "";
    renderForecast(pronostico);
  } catch {
    pronosticoContainer.innerHTML = `<p>No se pudo cargar el pronóstico.</p>`;
  }
};

cargarClima();
refreshBtn.addEventListener("click", cargarClima);
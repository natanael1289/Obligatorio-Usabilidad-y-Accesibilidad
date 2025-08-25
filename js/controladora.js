// Obtener referencias al contenedor del clima y al botón de refrescar
const weatherContainer = document.getElementById("weather");
const refreshBtn = document.getElementById("refreshWeather");

// Función asincrónica que obtiene los datos del clima
const getWeatherData = async () => {
  const API_KEY = "e9d44e217be76a3c78194add9eba0de3"; // Tu API key de OpenWeatherMap
  const url = `https://api.openweathermap.org/data/2.5/weather?q=Rosario,UY&units=metric&lang=es&appid=${API_KEY}`;

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
    console.error("Error al obtener los datos del clima:", error);
    throw error;
  }
};

// Función para renderizar la tarjeta del clima
const renderWeatherCard = (clima) => {
  weatherContainer.innerHTML = `
    <div class="card bg-dark text-light p-3 mx-auto" style="max-width: 400px;">
      <div class="d-flex align-items-center">
        <img src="https://openweathermap.org/img/wn/${clima.icono}@2x.png" 
             alt="${clima.descripcion}" class="me-3" />
        <div>
          <h3 class="h5 mb-1">${clima.ciudad}, Colonia</h3>
          <p class="mb-0">${clima.descripcion}</p>
          <p class="mb-0"><strong>${clima.temperatura}°C</strong> (sensación ${clima.sensacion}°C)</p>
        </div>
      </div>
    </div>
  `;
};

// Función principal para cargar el clima
const cargarClima = async () => {
  try {
    const clima = await getWeatherData();
    renderWeatherCard(clima);
  } catch {
    weatherContainer.textContent = "No se pudo cargar el clima.";
  }
};

// Carga inicial
cargarClima();

// Botón para refrescar manualmente
refreshBtn.addEventListener("click", cargarClima);
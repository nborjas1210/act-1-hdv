// main.js
import { createGrowthChart } from './growthChart.js';
import { createRetentionChart } from './retentionChart.js';
import { createProductImpactChart } from './productImpactChart.js';
import { createTemporalAnalysisChart } from './temporalAnalysisChart.js';
import { createCustomerVolumeChart } from './customerVolumeChart.js';
import { createServicesChart } from './servicesChart.js';
import { createGeolocationChart } from './geolocationChart.js'; // Nuevo archivo para georreferenciación
import { crearMapa } from './mapa.js'; 
import { customerSatisfaction } from './customerSatisfaction.js';
import { graficaDevolucion } from './devolucion.js'; 

d3.csv("data/SuperStore_Sales_dataset.csv").then(function(data) {
    data.forEach((d) => {
        d["Order Date"] = d3.timeParse("%Y-%m-%d")(d["Order Date"]?.trim());
        d.Month = d3.timeFormat("%Y-%m")(d["Order Date"]);
        d.Sales = +d.Sales || 0;
        d.CustomerID = d["Customer ID"];
        d.Product = d["Product Name"];
        d.Category = d["Category"];
        d.Price = +d.Price || 0;
        d.Latitude = +d.Latitude || null;   // Asume que existen coordenadas de latitud
        d.Longitude = +d.Longitude || null; // Asume que existen coordenadas de longitud
    });
    
    // Cargar gráficos
    createGrowthChart(data);
    createRetentionChart(data);
    createProductImpactChart(data);
    createTemporalAnalysisChart(data);
    createCustomerVolumeChart(data);
    createServicesChart(data);
    //createGeolocationChart(data); // Llamada a la función de georreferenciación
    crearMapa();
    graficaDevolucion();
    //funcion de satisfaccion de clientes
    //escucha del evento del mapa
    // Función para actualizar la gráfica según el estado seleccionado
    function updateChartForState(selectedState) {
        // Supón que `data` es tu conjunto de datos y `category` se refiere a la categoría que estás graficando
        const filteredData = data.filter(d => d.State === selectedState);
        customerSatisfaction(category, filteredData);  // Esta es tu función original que actualiza la gráfica
    }

    // Escuchar el evento 'stateSelected' que se emite desde el mapa
    window.addEventListener("stateSelected", function (event) {
        const selectedState = event.detail.state;  // Extraer el estado seleccionado
        console.log("Estado seleccionado:", selectedState);
        updateChartForState(selectedState);  // Actualizar la gráfica basada en el estado seleccionado
    });

    customerSatisfaction(data);
}).catch(error => console.error("Error al cargar el archivo:", error));


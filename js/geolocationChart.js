// geolocationChart.js
export function createGeolocationChart(data) {
    // Crear el mapa y centrarlo en una ubicación inicial
    const map = L.map('map').setView([0, 0], 2); // Ajusta la ubicación inicial y el nivel de zoom según tus necesidades

    // Agregar capa de mapa base desde OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Filtrar datos con coordenadas válidas y agregar puntos al mapa
    data.forEach(d => {
        const latitude = d.Latitude;
        const longitude = d.Longitude;
        const customerInfo = d.CustomerName || d["Customer ID"]; // Ajusta para mostrar el campo adecuado

        if (latitude && longitude) {
            const marker = L.circleMarker([latitude, longitude], {
                radius: 5,
                color: '#3388ff',
                fillColor: '#3388ff',
                fillOpacity: 0.6
            }).addTo(map);

            // Tooltip para cada marcador
            marker.bindPopup(`<strong>Cliente:</strong> ${customerInfo}<br><strong>Ubicación:</strong> [${latitude}, ${longitude}]`);
        }
    });
}

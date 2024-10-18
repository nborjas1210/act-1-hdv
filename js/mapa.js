export function crearMapa() {
    // Mapa de nombres de estados a identificadores FIPS y viceversa
    const stateNameToFIPS = {
        "Alabama": "01", "Alaska": "02", "Arizona": "04", "Arkansas": "05", "California": "06",
        "Colorado": "08", "Connecticut": "09", "Delaware": "10", "Florida": "12", "Georgia": "13",
        "Hawaii": "15", "Idaho": "16", "Illinois": "17", "Indiana": "18", "Iowa": "19", "Kansas": "20",
        "Kentucky": "21", "Louisiana": "22", "Maine": "23", "Maryland": "24", "Massachusetts": "25",
        "Michigan": "26", "Minnesota": "27", "Mississippi": "28", "Missouri": "29", "Montana": "30",
        "Nebraska": "31", "Nevada": "32", "New Hampshire": "33", "New Jersey": "34", "New Mexico": "35",
        "New York": "36", "North Carolina": "37", "North Dakota": "38", "Ohio": "39", "Oklahoma": "40",
        "Oregon": "41", "Pennsylvania": "42", "Rhode Island": "44", "South Carolina": "45",
        "South Dakota": "46", "Tennessee": "47", "Texas": "48", "Utah": "49", "Vermont": "50",
        "Virginia": "51", "Washington": "53", "West Virginia": "54", "Wisconsin": "55", "Wyoming": "56"
    };

    // Crear un mapeo inverso de FIPS a nombres de estado
    const fipsToStateName = Object.fromEntries(Object.entries(stateNameToFIPS).map(([k, v]) => [v, k]));

    // Cargar el CSV y los datos del mapa
    d3.csv("https://raw.githubusercontent.com/luisfelipe0724/unirIA/refs/heads/main/SuperStore_Sales_DataSet.csv").then(function (data) {
        d3.json("https://d3js.org/us-10m.v1.json").then(function (us) {

            // Agrupar ventas por estado y convertir a FIPS
            var salesByState = d3.rollups(
                data,
                v => d3.sum(v, d => +d.Sales),  // Sumar las ventas para cada estado
                d => stateNameToFIPS[d.State]   // Convertir el nombre del estado a FIPS
            );

            // Configuración de colores para el mapa
            const color = d3.scaleQuantize([1, d3.max(salesByState, d => d[1])], d3.schemeBlues[9]);

            // Crear un mapa de FIPS a ventas
            const valuemap = new Map(salesByState);

            // Crear el tooltip
            const tooltip = d3.select("body").append("div").attr("class", "tooltip2");

            // Configuración del SVG
            const mapa = d3.select("#map")
                .append("svg")
                .attr("width", 975)
                .attr("height", 610)
                .attr("viewBox", [0, 0, 975, 610])
                .attr("style", "max-width: 100%; height: auto;");

            // Dibujar los estados
            mapa.append("g")
                .selectAll("path")
                .data(topojson.feature(us, us.objects.states).features)
                .join("path")
                .attr("fill", d => color(valuemap.get(d.id) || 0))  // Asignar color según las ventas
                .attr("stroke", "#374fa8")  // Bordes color
                .attr("d", d3.geoPath())
            // Definir formato de moneda
            const formatCurrency = d3.format("$,.2f");
        
            mapa.selectAll("path")
                .on("mouseover", function (event, d) {
                    d3.select(this).attr("stroke-width", "2px");  // Resaltar el estado
                    tooltip.transition().duration(200).style("opacity", .9);
                    tooltip.html(`Estado: ${fipsToStateName[d.id]}<br>Ventas: ${formatCurrency(valuemap.get(d.id) || 0)}`)
                        .style("left", (event.pageX + 5) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function (d) {
                    d3.select(this).attr("stroke-width", "1px");  // Restablecer el borde
                    tooltip.transition().duration(500).style("opacity", 0);
                });

            // Dibujar las fronteras entre estados
            mapa.append("path")
                .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
                .attr("fill", "none")
                .attr("stroke", "#374fa8")  // Color Fronteras entre estados
                .attr("stroke-linejoin", "round")
                .attr("d", d3.geoPath());

            // Añadir leyenda de colores
            const legendWidth = 300;
            const legendHeight = 10;

            const legendSvg = mapa.append("g")
                .attr("class", "legend")
                .attr("transform", `translate(${(975 - legendWidth) / 2}, 20)`);

            const legendScale = d3.scaleLinear()
                .domain(color.domain())
                .range([0, legendWidth]);

            // Crear rectángulos de la leyenda
            legendSvg.selectAll("rect")
                .data(color.range().map(d => color.invertExtent(d)))
                .enter().append("rect")
                .attr("x", d => legendScale(d[0]))
                .attr("y", 0)
                .attr("width", d => legendScale(d[1]) - legendScale(d[0]))
                .attr("height", legendHeight)
                .attr("fill", d => color(d[0]));

            // Añadir texto a la leyenda
            legendSvg.append("text")
                .attr("class", "caption")
                .attr("x", legendWidth / 2)
                .attr("y", -10)
                .attr("text-anchor", "middle")
                .attr("font-size", "14px")
                .text("Ventas Totales (USD)");

            // Añadir los ticks de la leyenda
            const legendAxis = d3.axisBottom(legendScale)
                .ticks(5)
                .tickFormat(d3.format("$.2s"));

            legendSvg.append("g")
                .attr("transform", `translate(0, ${legendHeight})`)
                .call(legendAxis);

        }).catch(function (error) {
            console.error("Error al cargar los datos del mapa:", error);
        });
    }).catch(function (error) {
        console.error("Error al cargar el CSV:", error);
    });

}
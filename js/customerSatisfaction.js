export function customerSatisfaction(data) {
    // Calcular la tasa de devolución por cliente
    const returnRates = data.reduce((acc, curr) => {
        const { CustomerID, Quantity, Returns, Category } = curr;

        if (!acc[CustomerID]) {
            acc[CustomerID] = { total: 0, returned: 0, Category: Category }; // Añadimos la categoría
        }

        acc[CustomerID].total += Quantity;

        if (Returns === 'Yes') {
            acc[CustomerID].returned += Quantity;
        }

        return acc;
    }, {});

    const rates = Object.keys(returnRates).map(customer => ({
        CustomerID: customer,
        returnRate: returnRates[customer].returned / returnRates[customer].total,
        Category: returnRates[customer].Category // Añadimos la categoría a los datos procesados
    }));

    // Ordenar los clientes por tasa de devolución en orden descendente
    const sortedRates = rates.sort((a, b) => b.returnRate - a.returnRate);

    // Limitar a los 10 clientes con mayor tasa de devolución
    const topRates = sortedRates.slice(0, 10);

    // Configuración del gráfico
    const width = 450;
    const height = 450;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select("#customerSatisfaction")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    // Generar los datos para el diagrama de pastel
    const pie = d3.pie()
        .value(d => d.returnRate)(topRates);

    const arc = d3.arc()
        .innerRadius(0)  // Diagrama de pastel completo
        .outerRadius(radius);

    // Colores en tonos de azul, ajustados a la tasa de devolución
    const color = d3.scaleSequential(d3.interpolateBlues)
        .domain([0, 1]);  // La tasa de devolución estará entre 0 y 1

    // Dibujar los segmentos del pastel
    svg.selectAll("path")
        .data(pie)
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.returnRate))  // Usar la tasa de devolución para el color
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .on("mouseover", function(event, d) {
            tooltip.style("display", "block")
                .html(`Cliente: ${d.data.CustomerID}<br>Tasa: ${(d.data.returnRate * 100).toFixed(1)}%`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 25) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("display", "none");
        });

    // Tooltip
    const tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("background", "lightgray")
        .style("padding", "5px")
        .style("border-radius", "5px")
        .style("display", "none");

    // Añadir la tabla de leyenda en el nuevo contenedor
    const legend = d3.select("#legendContainer")
        .append("div")
        .attr("class", "legend")
        .style("font-size", "12px")
        .style("line-height", "1.5em");

    // Añadir filas de la tabla
    topRates.forEach((d, i) => {
        const row = legend.append("div").style("display", "flex").style("align-items", "center");

        // Cuadro de color
        row.append("div")
            .style("width", "12px")
            .style("height", "12px")
            .style("background-color", color(d.returnRate))  // Basar el color en la tasa de devolución
            .style("margin-right", "8px");

        // Texto con el nombre del cliente/producto, la categoría y la tasa de devolución
        row.append("span")
            .text(`${d.CustomerID} - ${d.Category || 'Sin categoría'}: ${(d.returnRate * 100).toFixed(1)}%`);
    });
}

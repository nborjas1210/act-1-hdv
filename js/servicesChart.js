// servicesChart.js
import { createTooltip, showTooltip, hideTooltip } from './tooltip.js';

export function createServicesChart(data) {
    // Agrupar los datos por tipo de servicio y contar la cantidad de cada uno
    const servicesData = d3.rollup(
        data,
        v => v.length, // Si no hay columna de cantidad, cuenta el número de registros
        d => d["Service Type"] || d["Category"] // Reemplaza con la columna adecuada si es diferente
    );

    // Convertir a un arreglo para ser usado en D3
    const formattedData = Array.from(servicesData, ([serviceType, count]) => ({ serviceType, count }))
                               .sort((a, b) => b.count - a.count); // Ordenar de mayor a menor

    const margin = { top: 60, right: 30, bottom: 120, left: 70 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#servicesChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Título del gráfico
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Cantidad y Clase de Servicios Prestados");

    // Escalas
    const x = d3.scaleBand()
        .domain(formattedData.map(d => d.serviceType))
        .range([0, width])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(formattedData, d => d.count)])
        .nice()
        .range([height, 0]);

    // Ejes
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-45)")
        .style("font-size", "10px");

    svg.append("g")
        .call(d3.axisLeft(y).ticks(10).tickFormat(d => d3.format(",")(d)));

    // Etiquetas de los ejes
    svg.append("text")
        .attr("transform", `translate(${width / 2}, ${height + 100})`)
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Tipo de Servicio");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -height / 2)
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Cantidad de Servicios");

    // Tooltip
    const tooltip = createTooltip();

    // Barras
    svg.selectAll(".bar")
        .data(formattedData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.serviceType))
        .attr("y", d => y(d.count))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.count))
        .attr("fill", "#4CAF50")
        .on("mouseover", (event, d) => {
            showTooltip(tooltip, event, d);
            tooltip.html("Clase: " + d.serviceType + "<br/>Cantidad: " + d3.format(",")(d.count))
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mousemove", (event) => tooltip.style("left", (event.pageX + 5) + "px").style("top", (event.pageY - 28) + "px"))
        .on("mouseout", () => hideTooltip(tooltip));
}

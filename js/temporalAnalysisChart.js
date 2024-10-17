// temporalAnalysisChart.js
import { createTooltip, showTooltip, hideTooltip } from './tooltip.js';

export function createTemporalAnalysisChart(data) {
    // Agrupar datos por mes y calcular ventas totales
    const salesByMonth = d3.rollup(
        data,
        v => d3.sum(v, d => d.Sales),
        d => d3.timeMonth.floor(d["Order Date"]) // Redondear al mes más cercano
    );

    // Convertir los datos agrupados en un arreglo para usar en el gráfico
    const salesData = Array.from(salesByMonth, ([month, sales]) => ({ month, sales }))
                           .sort((a, b) => a.month - b.month); // Ordenar por fecha

    const margin = { top: 60, right: 30, bottom: 80, left: 70 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#temporalAnalysisChart")
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
        .text("Análisis de Ventas por Periodo Temporal");

    // Escalas
    const x = d3.scaleTime()
        .domain(d3.extent(salesData, d => d.month))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(salesData, d => d.sales)])
        .nice()
        .range([height, 0]);

    // Ejes
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(d3.timeMonth.every(2)).tickFormat(d3.timeFormat("%Y-%m")))
        .selectAll("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-45)");

    svg.append("g")
        .call(d3.axisLeft(y).ticks(10).tickFormat(d => `$${d3.format(",")(d)}`));

    // Etiquetas de los ejes
    svg.append("text")
        .attr("transform", `translate(${width / 2}, ${height + 60})`)
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Mes");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -height / 2)
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Ventas Totales ($)");

    // Tooltip
    const tooltip = createTooltip();

    // Línea de Ventas
    svg.append("path")
        .datum(salesData)
        .attr("fill", "none")
        .attr("stroke", "#1f77b4")
        .attr("stroke-width", 2)
        .attr("d", d3.line()
            .x(d => x(d.month))
            .y(d => y(d.sales))
        );

    // Puntos en la Línea
    svg.selectAll(".dot")
        .data(salesData)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.month))
        .attr("cy", d => y(d.sales))
        .attr("r", 4)
        .attr("fill", "#1f77b4")
        .on("mouseover", (event, d) => {
            showTooltip(tooltip, event, d);
            tooltip.html("Fecha: " + d3.timeFormat("%Y-%m")(d.month) + "<br/>Ventas: $" + d3.format(",.2f")(d.sales))
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mousemove", (event) => tooltip.style("left", (event.pageX + 5) + "px").style("top", (event.pageY - 28) + "px"))
        .on("mouseout", () => hideTooltip(tooltip));
}

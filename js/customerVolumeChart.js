// customerVolumeChart.js
import { createTooltip, showTooltip, hideTooltip } from './tooltip.js';

export function createCustomerVolumeChart(data) {
    const margin = { top: 60, right: 30, bottom: 80, left: 70 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#customerVolumeChart")
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
        .attr("class", "chart-title")
        .text("Número de Clientes Atendidos por Período");

    // Crear las escalas
    const x = d3.scaleBand().range([0, width]).padding(0.2);
    const y = d3.scaleLinear().range([height, 0]);

    // Crear los ejes
    const xAxis = svg.append("g")
        .attr("transform", `translate(0, ${height})`);

    const yAxis = svg.append("g");

    // Crear el tooltip
    const tooltip = createTooltip();

    // Función para actualizar el gráfico
    function updateChart(period, startDate, endDate) {
        let filteredData = data;
        if (startDate && endDate) {
            const start = new Date(startDate + "-01");
            const end = new Date(endDate + "-01");
            filteredData = filteredData.filter(d => d["Order Date"] >= start && d["Order Date"] <= end);
        }

        let groupedData;
        if (period === "monthly") {
            groupedData = d3.rollup(
                filteredData,
                v => new Set(v.map(d => d.CustomerID)).size,
                d => d3.timeFormat("%Y-%m")(d["Order Date"])
            );
        } else if (period === "quarterly") {
            groupedData = d3.rollup(
                filteredData,
                v => new Set(v.map(d => d.CustomerID)).size,
                d => {
                    const date = d["Order Date"];
                    const quarter = Math.floor(date.getMonth() / 3) + 1;
                    return `${date.getFullYear()}-Q${quarter}`;
                }
            );
        } else if (period === "yearly") {
            groupedData = d3.rollup(
                filteredData,
                v => new Set(v.map(d => d.CustomerID)).size,
                d => d3.timeFormat("%Y")(d["Order Date"])
            );
        }

        const formattedData = Array.from(groupedData, ([time, count]) => ({ time, count }))
                                   .sort((a, b) => new Date(a.time) - new Date(b.time));

        // Actualizar las escalas
        x.domain(formattedData.map(d => d.time));
        y.domain([0, d3.max(formattedData, d => d.count)]);

        // Actualizar ejes
        xAxis.transition().duration(500).call(d3.axisBottom(x))
            .selectAll("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-45)") // Rotar etiquetas 45 grados
            .style("font-size", "10px");

        yAxis.transition().duration(500).call(d3.axisLeft(y));

        // Actualizar barras
        const bars = svg.selectAll(".bar")
            .data(formattedData);

        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .merge(bars)
            .transition().duration(500)
            .attr("x", d => x(d.time))
            .attr("y", d => y(d.count))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.count))
            .attr("fill", "#1f77b4");

        // Tooltip para las barras
        bars.on("mouseover", (event, d) => {
            showTooltip(tooltip, event, d);
            tooltip.html("Período: " + d.time + "<br/>Clientes: " + d.count)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mousemove", (event) => tooltip.style("left", (event.pageX + 5) + "px").style("top", (event.pageY - 28) + "px"))
        .on("mouseout", () => hideTooltip(tooltip));

        bars.exit().remove();
    }

    // Agregar etiquetas de los ejes
    svg.append("text")
        .attr("transform", `translate(${width / 2}, ${height + 60})`)
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Período (Mes / Trimestre / Año)");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -height / 2)
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Número de Clientes");

    // Escuchar cambios en el menú desplegable y en los campos de fecha
    d3.select("#timePeriod").on("change", function() {
        const selectedPeriod = d3.select(this).property("value");
        const startDate = d3.select("#startDate").property("value");
        const endDate = d3.select("#endDate").property("value");
        updateChart(selectedPeriod, startDate, endDate);
    });

    d3.selectAll("#startDate, #endDate").on("change", function() {
        const selectedPeriod = d3.select("#timePeriod").property("value");
        const startDate = d3.select("#startDate").property("value");
        const endDate = d3.select("#endDate").property("value");
        updateChart(selectedPeriod, startDate, endDate);
    });

    // Render inicial
    updateChart("monthly");
}

// growthChart.js
import { createTooltip, showTooltip, hideTooltip } from './tooltip.js';
import { createLegend } from './legend.js';

export function createGrowthChart(data) {
    const salesByMonth = d3.rollup(data, v => d3.sum(v, d => d.Sales), d => d.Month);
    const months = Array.from(salesByMonth.keys()).sort();
    const salesChange = [];

    for (let i = 1; i < months.length; i++) {
        const currentMonth = months[i];
        const previousMonth = months[i - 1];
        const currentSales = salesByMonth.get(currentMonth);
        const previousSales = salesByMonth.get(previousMonth);

        const change = previousSales !== 0 ? ((currentSales - previousSales) / previousSales) * 100 : 0;
        salesChange.push({ month: currentMonth, change: change, sales: currentSales });
    }

    const margin = { top: 60, right: 150, bottom: 50, left: 70 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#growthChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom + 40) // Espacio adicional para la leyenda
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Crecimiento/Decrecimiento de Ventas Mensuales");

    const x = d3.scaleBand().domain(salesChange.map(d => d.month)).range([0, width]).padding(0.1);
    const y = d3.scaleLinear().domain([d3.min(salesChange, d => d.change), d3.max(salesChange, d => d.change)]).range([height, 0]);

    svg.append("g").attr("transform", `translate(0, ${height})`).call(d3.axisBottom(x).tickValues(x.domain().filter((_, i) => !(i % 2))));
    svg.append("g").call(d3.axisLeft(y).tickFormat(d => d + "%"));

    svg.append("text")
        .attr("transform", `translate(${width / 2}, ${height + 40})`)
        .style("text-anchor", "middle")
        .text("Mes");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -50)
        .style("text-anchor", "middle")
        .text("Cambio Porcentual (%)");

    svg.append("path")
        .datum(salesChange)
        .attr("fill", "none")
        .attr("stroke", "#1f77b4")
        .attr("stroke-width", 2)
        .attr("d", d3.line()
            .x(d => x(d.month) + x.bandwidth() / 2)
            .y(d => y(d.change))
        );

    const tooltip = createTooltip();

    svg.selectAll(".dot")
        .data(salesChange)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.month) + x.bandwidth() / 2)
        .attr("cy", d => y(d.change))
        .attr("r", 4)
        .attr("fill", d => d.change > 0 ? "green" : "red")
        .on("mouseover", (event, d) => showTooltip(tooltip, event, d))
        .on("mousemove", (event) => tooltip.style("left", (event.pageX + 5) + "px").style("top", (event.pageY - 28) + "px"))
        .on("mouseout", () => hideTooltip(tooltip));

    createLegend(svg, width, [
        { label: "Crecimiento", color: "green" },
        { label: "Decrecimiento", color: "red" }
    ], height);
}

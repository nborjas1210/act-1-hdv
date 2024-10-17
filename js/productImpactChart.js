// productImpactChart.js
import { createTooltip, showTooltip, hideTooltip } from './tooltip.js';

export function createProductImpactChart(data) {
    const salesByProduct = d3.rollup(data, v => d3.sum(v, d => d.Sales), d => d.Product);
    const productData = Array.from(salesByProduct, ([product, sales]) => ({ product, sales }))
                             .sort((a, b) => b.sales - a.sales)
                             .slice(0, 10);

    const margin = { top: 60, right: 30, bottom: 130, left: 70 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#productImpactChart")
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
        .text("Impacto de Productos en Ventas (Top 10)");

    // Escalas
    const x = d3.scaleBand()
        .domain(productData.map(d => d.product))
        .range([0, width])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(productData, d => d.sales)])
        .range([height, 0]);

    // Ejes
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .each(function(d) {
            const element = d3.select(this);
            const words = d.split(" "); // Divide el texto en palabras
            element.text(''); // Limpia el texto original

            // Agrega cada palabra en una línea diferente con límite de caracteres por línea
            let line = '';
            let lineNumber = 0;
            const maxChars = 10; // Límite de caracteres por línea
            words.forEach((word) => {
                if ((line + word).length > maxChars) {
                    element.append("tspan")
                        .attr("x", 0)
                        .attr("y", lineNumber * 12) // Espacio entre líneas
                        .attr("dy", "1em")
                        .text(line.trim());
                    line = word + ' ';
                    lineNumber++;
                } else {
                    line += word + ' ';
                }
            });

            // Añadir la última línea
            element.append("tspan")
                .attr("x", 0)
                .attr("y", lineNumber * 12)
                .attr("dy", "1em")
                .text(line.trim());
        });

    svg.append("g")
        .call(d3.axisLeft(y));

    // Etiquetas de los ejes
    svg.append("text")
        .attr("transform", `translate(${width / 2}, ${height + 100})`)
        .style("text-anchor", "middle")
        .text("Producto");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -50)
        .style("text-anchor", "middle")
        .text("Ventas Totales ($)");

    // Tooltip
    const tooltip = createTooltip();

    // Barras
    svg.selectAll(".bar")
        .data(productData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.product))
        .attr("y", d => y(d.sales))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.sales))
        .attr("fill", "#4CAF50")
        .on("mouseover", (event, d) => {
            showTooltip(tooltip, event, d);
            tooltip.html("Producto: " + d.product + "<br/>Ventas: $" + d3.format(",.2f")(d.sales))
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mousemove", (event) => tooltip.style("left", (event.pageX + 5) + "px").style("top", (event.pageY - 28) + "px"))
        .on("mouseout", () => hideTooltip(tooltip));
}

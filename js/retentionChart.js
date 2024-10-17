// retentionChart.js
import { createTooltip, showTooltip, hideTooltip } from './tooltip.js';
import { createLegend } from './legend.js';

export function createRetentionChart(data) {
    const customersByMonth = {};
    const uniqueCustomers = new Set();

    data.forEach(d => {
        const month = d.Month;
        const customerID = d.CustomerID;

        if (!customersByMonth[month]) {
            customersByMonth[month] = { new: 0, returning: 0 };
        }

        if (uniqueCustomers.has(customerID)) {
            customersByMonth[month].returning += 1;
        } else {
            customersByMonth[month].new += 1;
            uniqueCustomers.add(customerID);
        }
    });

    const dataForChart = Object.keys(customersByMonth).sort().map(month => ({
        month: month,
        new: customersByMonth[month].new,
        returning: customersByMonth[month].returning
    }));

    const margin = { top: 60, right: 150, bottom: 50, left: 70 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#retentionChart")
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
        .text("Fidelización y Retención de Clientes");

    const x = d3.scaleBand()
        .domain(dataForChart.map(d => d.month))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(dataForChart, d => d.new + d.returning)])
        .range([height, 0]);

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickValues(x.domain().filter((_, i) => !(i % 2))));

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("transform", `translate(${width / 2}, ${height + 40})`)
        .style("text-anchor", "middle")
        .text("Mes");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -50)
        .style("text-anchor", "middle")
        .text("Número de Clientes");

    svg.selectAll(".bar.new")
        .data(dataForChart)
        .enter().append("rect")
        .attr("class", "bar new")
        .attr("x", d => x(d.month))
        .attr("y", d => y(d.new))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.new))
        .attr("fill", "#1f77b4");

    svg.selectAll(".bar.returning")
        .data(dataForChart)
        .enter().append("rect")
        .attr("class", "bar returning")
        .attr("x", d => x(d.month))
        .attr("y", d => y(d.new + d.returning))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.returning))
        .attr("fill", "#ff7f0e");

    const tooltip = createTooltip();

    svg.selectAll(".bar.new, .bar.returning")
        .on("mouseover", (event, d) => {
            showTooltip(tooltip, event, d);
            tooltip.html("Mes: " + d.month + "<br/>Nuevos: " + d.new + "<br/>Recurrentes: " + d.returning)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mousemove", (event) => tooltip.style("left", (event.pageX + 5) + "px").style("top", (event.pageY - 28) + "px"))
        .on("mouseout", () => hideTooltip(tooltip));

        createLegend(svg, width, [
            { label: "Nuevos Clientes", color: "#1f77b4" },
            { label: "Clientes Recurrentes", color: "#ff7f0e" }
        ], height);
    }
    

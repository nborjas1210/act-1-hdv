export function customerSatisfaction(data) {
    // Calcular la tasa de devolución por cliente
    const returnRates = data.reduce((acc, curr) => {
        const { CustomerID, Quantity, Returns } = curr;

        if (!acc[CustomerID]) {
            acc[CustomerID] = { total: 0, returned: 0 };
        }

        acc[CustomerID].total += Quantity;

        if (Returns === 'Yes') {
            acc[CustomerID].returned += Quantity;
        }

        return acc;
    }, {});

    const rates = Object.keys(returnRates).map(customer => ({
        CustomerID: customer,
        returnRate: returnRates[customer].returned / returnRates[customer].total
    }));

    // Ordenar los clientes por tasa de devolución en orden descendente
    const sortedRates = rates.sort((a, b) => b.returnRate - a.returnRate);

    // Limitar a los 10 clientes con mayor tasa de devolución
    const topRates = sortedRates.slice(0, 10);

    // Configuración del gráfico
    const margin = { top: 20, right: 30, bottom: 40, left: 120 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#customerSatisfaction")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Escalas
    const x = d3.scaleLinear()
        .domain([0, 1])  // La tasa de devolución estará entre 0 y 1
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(topRates.map(d => d.CustomerID))  // Usar los 10 clientes con mayor tasa
        .range([0, height])
        .padding(0.3);  // Aumentar el padding entre las barras

    // Ejes
    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format(".0%")));

    // Barras
    svg.selectAll("rect")
        .data(topRates)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", d => y(d.CustomerID))
        .attr("width", d => x(d.returnRate))
        .attr("height", y.bandwidth())
        .attr("fill", "steelblue");

    // Etiquetas de las barras (dentro de las barras si hay suficiente espacio)
    svg.selectAll("text")
        .data(topRates)
        .enter()
        .append("text")
        .attr("x", d => x(d.returnRate) + 5)  // Mover la etiqueta un poco fuera de la barra
        .attr("y", d => y(d.CustomerID) + y.bandwidth() / 2)
        .attr("dy", ".35em")
        .attr("font-size", "12px")  // Reduce el tamaño de la fuente para mayor claridad
        .attr("fill", "black")
        .text(d => d3.format(".1%")(d.returnRate));

    // Etiqueta para el eje Y
    svg.append("text")
        .attr("transform", "rotate(-90)")  // Gira el texto 90 grados para que sea vertical
        .attr("y", -margin.left + 20)      // Ajustar la posición según el margen
        .attr("x", -height / 2)            // Centra el texto en el eje Y
        .attr("dy", "1em")                 // Desplazamiento adicional
        .style("text-anchor", "middle")    // Alineación del texto al centro
        .text("Productos");
}
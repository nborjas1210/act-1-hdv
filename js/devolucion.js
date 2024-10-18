export function graficaDevolucion() { 
// Definimos el tamaño del gráfico
const width = 800;
const height = 500;
const margin = { top: 40, right: 20, bottom: 100, left: 70 };

// Crear el SVG para la primera gráfica (categorías)
const svg1 = d3.select("#devolucion")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Crear el tooltip
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Cargar los datos desde el archivo CSV del repositorio
d3.csv("https://raw.githubusercontent.com/luisfelipe0724/unirIA/refs/heads/main/SuperStore_Sales_DataSet.csv").then(function (data) {

    // Filtramos solo los elementos que han sido devueltos
    const returnedData = data.filter(d => d.Returns === "Yes");

    // Agrupar los datos por categoría y sumar las devoluciones
    const categoryReturns = d3.rollups(returnedData,
        v => v.length, // Cantidad de devoluciones por categoría
        d => d.Category
    ).map(d => ({ category: d[0], returns: d[1] }));

    // Crear escalas para la gráfica de categorías
    const x1 = d3.scaleBand()
        .domain(categoryReturns.map(d => d.category))
        .range([0, width])
        .padding(0.2);

    const y1 = d3.scaleLinear()
        .domain([0, d3.max(categoryReturns, d => d.returns)])
        .nice()
        .range([height, 0]);

    // Ejes para la gráfica de categorías
    svg1.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x1))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    svg1.append("g")
        .call(d3.axisLeft(y1));

    // Dibujar las barras de categorías con eventos de tooltip
    svg1.selectAll(".bar")
        .data(categoryReturns)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x1(d.category))
        .attr("y", d => y1(d.returns))
        .attr("width", x1.bandwidth())
        .attr("height", d => height - y1(d.returns))
        .attr("fill", "steelblue")
        .on("mouseover", function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Categoría: ${d.category}<br/>Devoluciones: ${d.returns}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", function(event, d) {
            // Al hacer clic en una barra, mostramos las subcategorías más devueltas
            showSubCategories(d.category, returnedData);
        });

    // Función para mostrar las subcategorías en una gráfica nueva
    function showSubCategories(category, data) {
        // Limpiar el contenedor si ya existe
        d3.select("#chart2").remove();
        d3.select("#subCategoryTitle").remove();

        // Agregar el nuevo contenedor dinámicamente
        d3.select("body").append("h2")
            .attr("id", "subCategoryTitle")
            .text(`Subcategorías más devueltas en ${category}`);

        d3.select("body").append("div")
            .attr("id", "chart2");

        const svg2 = d3.select("#chart2")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const subCategoryReturns = d3.rollups(data.filter(d => d.Category === category),
            v => v.length, 
            d => d["Sub-Category"]
        ).map(d => ({ subCategory: d[0], returns: d[1] }));

        // Crear escalas para la gráfica de subcategorías
        const x2 = d3.scaleBand()
            .domain(subCategoryReturns.map(d => d.subCategory))
            .range([0, width])
            .padding(0.2);

        const y2 = d3.scaleLinear()
            .domain([0, d3.max(subCategoryReturns, d => d.returns)])
            .nice()
            .range([height, 0]);

        // Ejes para la gráfica de subcategorías
        svg2.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x2))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        svg2.append("g")
            .call(d3.axisLeft(y2));

        // Dibujar las barras de subcategorías con eventos de tooltip
        svg2.selectAll(".bar")
            .data(subCategoryReturns)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => x2(d.subCategory))
            .attr("y", d => y2(d.returns))
            .attr("width", x2.bandwidth())
            .attr("height", d => height - y2(d.returns))
            .attr("fill", "orange")
            .on("mouseover", function(event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`Subcategoría: ${d.subCategory}<br/>Devoluciones: ${d.returns}`)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    }
});

}
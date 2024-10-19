export function graficaDevolucion() { 
    const width = 800;
    const height = 500;
    const margin = { top: 40, right: 20, bottom: 100, left: 150 };  // Aumenté el margen izquierdo para acomodar los nombres de categorías

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

    d3.csv("https://raw.githubusercontent.com/luisfelipe0724/unirIA/refs/heads/main/SuperStore_Sales_DataSet.csv").then(function (data) {

        // Filtrar datos por devoluciones
        const returnedData = data.filter(d => d.Returns === "Yes");

        // Agrupar los datos por categoría
        const categoryReturns = d3.rollups(returnedData,
            v => v.length, 
            d => d.Category
        ).map(d => ({ category: d[0], returns: d[1] }));

        // Crear escalas para la gráfica horizontal
        const x1 = d3.scaleLinear()
            .domain([0, d3.max(categoryReturns, d => d.returns)])  // El máximo de devoluciones
            .range([0, width]);  // Longitud de las barras

        const y1 = d3.scaleBand()
            .domain(categoryReturns.map(d => d.category))  // Las categorías en el eje Y
            .range([0, height])
            .padding(0.2);

        // Ejes
        svg1.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x1).ticks(10));  // Eje x para las devoluciones

        svg1.append("g")
            .call(d3.axisLeft(y1));  // Eje y para las categorías

        // Dibujar las barras de categorías horizontalmente
        svg1.selectAll(".bar")
            .data(categoryReturns)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("y", d => y1(d.category))  // Posición vertical (categoría)
            .attr("x", 0)  // Las barras comienzan en 0
            .attr("height", y1.bandwidth())  // Ancho de las barras
            .attr("width", d => x1(d.returns))  // Longitud de las barras
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
                // Mostrar subcategorías más devueltas
                showSubCategories(d.category, returnedData);
            });

            function showSubCategories(category, data) {
                d3.select("#chart2").remove();  // Remover el gráfico existente
                d3.select("#subCategoryTitle").remove();  // Remover el título existente
            
                // Agregar nuevo título para la subcategoría
                d3.select("body").append("h2")
                    .attr("id", "subCategoryTitle")
                    .text(`Subcategorías más devueltas en ${category}`);
            
                // Crear nuevo contenedor div con la clase 'chartHorizontal'
                d3.select("body").append("div")
                    .attr("id", "chart2")
                    .attr("class", "chartHorizontal");  // Aquí agregamos la clase
            
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
            
                const x2 = d3.scaleLinear()
                    .domain([0, d3.max(subCategoryReturns, d => d.returns)])
                    .range([0, width]);
            
                const y2 = d3.scaleBand()
                    .domain(subCategoryReturns.map(d => d.subCategory))
                    .range([0, height])
                    .padding(0.2);
            
                svg2.append("g")
                    .attr("transform", `translate(0,${height})`)
                    .call(d3.axisBottom(x2).ticks(10));
            
                svg2.append("g")
                    .call(d3.axisLeft(y2));
            
                svg2.selectAll(".bar")
                    .data(subCategoryReturns)
                    .enter()
                    .append("rect")
                    .attr("class", "bar")
                    .attr("y", d => y2(d.subCategory))
                    .attr("x", 0)
                    .attr("height", y2.bandwidth())
                    .attr("width", d => x2(d.returns))
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

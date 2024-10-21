export function gananciasPorTiendas() {

const csvUrl = "https://raw.githubusercontent.com/luisfelipe0724/unirIA/refs/heads/main/SuperStore_Sales_DataSet.csv"; // del git

        d3.csv(csvUrl).then(data => {
            const formattedData = data.map(d => {
                const orderDate = d["Order_Date"] ? d["Order_Date"].trim() : "";
                let year = "Unknown";

                if (orderDate && orderDate.match(/^\d{1,2}-\d{1,2}-\d{4}$/)) {
                    year = orderDate.split('-')[2]; // Obtener el año
                }

                return {
                    region: d.Region,
                    profit: +d.Profit, // Convertir a número
                    year: year
                };
            });

            // Filtrar por el año seleccionado
            function updateChart(selectedYear) {
                const filteredData = formattedData.filter(d => d.year === selectedYear);

                const nestedData = d3.groups(filteredData, d => d.region);
                
                const chartData = [];
                nestedData.forEach(([region, entries]) => {
                    const maxProfit = d3.max(entries, d => d.profit);
                    if (maxProfit > 0) {
                        chartData.push({
                            region: region,
                            maxProfit: maxProfit
                        });
                    }
                });

                // Limpiar el gráfico antes de redibujar
                d3.select("#chartV").selectAll("*").remove();

                const margin = {top: 20, right: 30, bottom: 40, left: 40},
                      width = 800 - margin.left - margin.right,
                      height = 500 - margin.top - margin.bottom;

                const x = d3.scaleBand()
                            .range([0, width])
                            .padding(0.1);

                const y = d3.scaleLinear()
                            .range([height, 0])
                            .domain([0, d3.max(chartData, d => d.maxProfit)]);

                const svg = d3.select("#chartV").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                // Definir el dominio de las escalas
                x.domain(chartData.map(d => d.region));

                // Dibujar las barras
                svg.selectAll(".bar")
                    .data(chartData)
                  .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", d => x(d.region))
                    .attr("width", x.bandwidth())
                    .attr("y", d => y(d.maxProfit))
                    .attr("height", d => height - y(d.maxProfit));

                // Añadir ejes
                svg.append("g")
                    .attr("class", "x-axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x));

                svg.append("g")
                    .attr("class", "y-axis")
                    .call(d3.axisLeft(y));
            }

            // Inicializar el gráfico con el año seleccionado por defecto
            const defaultYear = "2019";
            updateChart(defaultYear);

            // Manejar el evento de cambio en el select
            d3.select("#yearSelect").on("change", function() {
                const selectedYear = d3.select(this).property("value");
                updateChart(selectedYear);
            });
        }).catch(error => {
            console.error("Error al cargar el CSV:", error);
        });
    }
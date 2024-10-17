export function createLegend(svg, width, legendData, height) {
    const legend = svg.append("g")
        .attr("transform", `translate(${width / 2 - 50}, ${height + 50})`); // Mueve la leyenda a la parte inferior central del gráfico

    legendData.forEach((item, i) => {
        legend.append("rect")
            .attr("x", i * 100)
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", item.color);

        legend.append("text")
            .attr("x", i * 100 + 10)
            .attr("y", 5)
            .attr("dy", "0.35em")
            .style("font-size", "11px")
            .text(item.label);
    });
}

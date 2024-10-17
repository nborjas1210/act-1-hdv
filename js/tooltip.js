// tooltip.js
export function createTooltip() {
    return d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
}

export function showTooltip(tooltip, event, data) {
    tooltip.transition()
        .duration(200)
        .style("opacity", 0.9);
    tooltip.html("Mes: " + data.month + "<br/>Ventas: $" + d3.format(",.2f")(data.sales))
        .style("left", (event.pageX + 5) + "px")
        .style("top", (event.pageY - 28) + "px");
}

export function hideTooltip(tooltip) {
    tooltip.transition()
        .duration(500)
        .style("opacity", 0);
}
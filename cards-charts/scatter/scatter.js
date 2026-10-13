//1. Access Data
const dataset = [
    {x:10, y:5},
    {x:18, y:14},
    {x:22, y:50},
    {x:23, y:38},
    {x:12, y:26},
    {x:22, y:40},
    {x: 4, y: 20},
    {x: 8, y: 5},
    {x:17, y:14},
    {x:20, y:50},
    {x:30, y:25},
    {x:10, y:15},
    {x:20, y:40},
    {x:14, y:24},
    {x:8, y:20},
    {x:35, y:20},
    {x:30, y:35},
    {x:20, y:25},
    {x:50, y:10},
    {x:45, y:5},
]

const xAccessor = (d) => d.x
const yAccessor = (d) => d.y
const colorAccessor = (d) => d.x

//2. Create Dimensions
const scatterDimensions = {
    scatterWidth: d3.min([window.innerWidth * 1 , window.innerHeight * 1]),
    scatterHeight: d3.min([window.innerWidth * 1, window.innerHeight * 1]),
    marginLeft: 50,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 50,
}

const scatterBoundsWidth = scatterDimensions.scatterWidth - scatterDimensions.marginRight - scatterDimensions.marginLeft
const scatterBoundsHeight = scatterDimensions.scatterHeight - scatterDimensions.marginTop - scatterDimensions.marginBottom


//3. DrawCanvas 
const scatterWrapper = d3.select("#scatter-wrapper")
    .append("svg")
    .attr("viewBox", [0,0, scatterDimensions.scatterWidth, scatterDimensions.scatterHeight ])
    // .attr("width", scatterDimensions.scatterWidth)
    // .attr("height", scatterDimensions.scatterHeight)

const scatterBounds = scatterWrapper.append("g")
    .style("transform", `translate(${scatterDimensions.marginLeft}px, ${scatterDimensions.marginTop}px)`)

// 4. Create Scales
const xScale = d3.scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, scatterBoundsWidth])
    .nice()

const yScale = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([scatterBoundsHeight, 0])
    .nice()

const colorScale = d3.scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .range(["cornflowerblue", "blue"])

//5. Draw Data 


function drawDots(dataset, color) {
    const dots = scatterBounds.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(xAccessor(d)))
        .attr("cy", (d) => yScale(yAccessor(d)))
        .attr("r", 4)
        .attr("fill", color)
}

drawDots(dataset, (d) => colorScale(colorAccessor(d)))


// As part of step 5 I want to draw voronoi cells for hover tooltip
const delaunay = d3.Delaunay.from(
    dataset,
    (d) => xScale(xAccessor(d)),
    (d) => yScale(yAccessor(d))
)

const voronoi = delaunay.voronoi()

voronoi.xmax = scatterBoundsWidth
voronoi.ymax = scatterBoundsHeight

scatterBounds.selectAll(".voronoi")
    .data(dataset)
    .enter()
    .append("path")
        .attr("class", "voronoi")
        .attr("d", (d,i) => voronoi.renderCell(i))
        .attr("stroke", "maroon")
        .on("mousemove", onMouseMove)
        .on("mouseleave", onMouseLeave)

const tooltip = d3.select("#tooltip")

function onMouseMove(event, datum) {
    const dayDot = scatterBounds.append("circle")
        .attr("class", "tooltipDot")
        .attr("cx", xScale(xAccessor(datum)))
        .attr("cy", yScale(yAccessor(datum)))
        .attr("r", 7)


    const formatXPoint = d3.format(".2f")
    tooltip.select("#x-point")
        .text(formatXPoint(xAccessor(datum)))

    const formatYPoint = d3.format(".2f")
    tooltip.select("#y-point")
        .text(formatYPoint(yAccessor(datum)))

    const x = xScale(xAccessor(datum)) + scatterDimensions.marginLeft
    const y = yScale(yAccessor(datum)) + scatterDimensions.marginTop

    tooltip.style("transform", `translate(`
      + `calc( -50% + ${x}px),`
      + `calc(-100% + ${y}px)`
      + `)`)

    tooltip.style("opacity", 1)

}   

function onMouseLeave() {
    d3.selectAll(".tooltipDot")
        .remove()

    tooltip.style("opacity", 0)
}



// 6.Draw Peripherals
const xAxis = scatterBounds.append("g")
    .call(d3.axisBottom(xScale).ticks(5))
    .style("transform", `translateY(${scatterBoundsHeight}px)`) 
    .style("color", "black")
    .style("font-size", "10px")
    
const yAxis = scatterBounds.append("g")
    .call(d3.axisLeft(yScale).ticks(4))
    .style("color", "black")
    .style("font-size", "10px")

d3.select("#scatter-wrapper").append("text")
    .text("This is an example scatterplot for a portfolio idea I have, I want to display the charts in cards and when clicked it will lead to the actual report where the chart is used. ")
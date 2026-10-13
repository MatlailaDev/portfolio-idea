//1. Access Data
const dataset = [
    {x:10, y:5},
    {x:18, y:14},
    {x:22, y:50},
    {x:23, y:38},
    {x:12, y:26},
    {x:22, y:40}
]

const xAccessor = (d) => d.x
const yAccessor = (d) => d.y
const colorAccessor = (d) => d.x

//2. Create Dimensions
const scatterDimensions = {
    scatterWidth: d3.min([window.innerWidth * 0.9, window.innerHeight * 0.9]),
    scatterHeight: d3.min([window.innerWidth * 0.9, window.innerHeight * 0.9]),
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

const yScale = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([scatterBoundsHeight, 0])

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
        .attr("r", 7)
        .attr("fill", color)
}

drawDots(dataset, (d) => colorScale(colorAccessor(d)))

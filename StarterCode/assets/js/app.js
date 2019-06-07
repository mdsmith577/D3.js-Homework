var margin = {top: 20, right: 75, bottom: 95, left: 110},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// SVG canvas and margin
var svg = d3.select("#scatter").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);
var chartArea = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// scale y
var yAxisScale = d3.scaleLinear().range([height, 0]);

// scale x
var xAxisScale = d3.scaleLinear().range([0, width]);

var toolTips = d3.select("body").append("div")
.attr("class", "tooltip").style("opacity", 45);

// Define x and y variables
var xVariable = "age";
var yVariable = "smokes";

var xValue = function(d) { return d[xVariable];}
var yValue = function(d) { return d[yVariable];}


// Get data from CSV
d3.csv("assets/data/data.csv", function(error, dataFile) {

    dataFile.forEach(function(d) {
      d.abbr = d.abbr;
      d.age = +d.age;
      d.smokes = +d.smokes;
    });
    xAxisScale.domain([d3.min(dataFile, xValue)-1, d3.max(dataFile, xValue)+1]);
    yAxisScale.domain([d3.min(dataFile, yValue)-1, d3.max(dataFile, yValue)+1]);    
  
    // Create axis
    var xAxis = d3.axisBottom(xAxisScale);
    var yAxis = d3.axisLeft(yAxisScale);
    
    // Add x axis
    var addXaxis = chartArea.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

    // Add x axis labels
    var xLabels = chartArea.append("g")             
      .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 15) + ")")
      .style("text-anchor", "middle");

    // Age
    var ageLabel = xLabels.append("text")
      .attr("x",0)
      .attr("y",45)
      .attr("value", "age")
      .text("Age (Median)")
      .attr("font-size", 26);
      
    // Add y axis
    var yAxisDisplay = chartArea.append("g").call(yAxis);

    // Add y axis labels
    var addYaxis = chartArea.append("g")
      .attr("transform", "rotate(-90)")
      .style("text-anchor", "middle");

    // Smokers
    var smokesLabel = addYaxis.append("text")
        .attr("y", 0 - margin.left + 50)
        .attr("x",0 - (height / 2))
        .attr("value", "smokes")
        .text("Smokers (%)")
        .attr("font-size", 26);     

    // Add bubbles to graph
    var bubbleGroup = chartArea.selectAll(".stateBubble")
      .data(dataFile)
      .enter().append('g');
    
    bubbleGroup = bubbleGroup.append("circle")
      .attr("class", "stateBubble")
      .attr("r", 20)
      .attr("cx", function(d) { return xAxisScale(xValue(d))})
      .attr("cy", function(d) { return yAxisScale(yValue(d))})

    var bubbleTextGroup = chartArea.selectAll(".stateAbbr")
      .data(dataFile)
      .enter().append('g');

    bubbleTextGroup = bubbleTextGroup.append("text")
      .attr("class","stateAbbr")
      .text(function(d){ return d.abbr; })
      .attr("font-size",14)
      .attr("x", function (d) { return xAxisScale(xValue(d)); })
      .attr("y", function (d) { return yAxisScale(yValue(d))+5; });

    // ToolTips
    var toolTips = d3.tip()
      .attr("class", "d3-tip")
      .offset([100, -100])
      .html(function(d) {
        return (d.abbr + "<br>" 
        + xVariable + ": " + xValue(d) + "<br>" 
        + yVariable + ": " + yValue(d));
      });

    // Call toolTips
    chartArea.call(toolTips);

    // Mouseover for toolTips
    bubbleGroup.on("mouseover", function(d) {
      toolTips.show(d, this);
      })
    // Mouseout for toolTips
      .on("mouseout", function(d) {
        toolTips.hide(d);
      });
});
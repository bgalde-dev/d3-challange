
// Setup the SVG
var svgWidth = 900;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 80, left: 100 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create the SVG 
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Add the chart group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Do the initial parameters
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

d3.csv("resources/data/data.csv").then(function(demoData, err) {
    if (err) throw err;

  //Parse Data
  demoData.forEach(function(data) {
    data.poverty    = +data.poverty;
    data.healthcare = +data.healthcare;
    data.age        = +data.age;
    data.smokes     = +data.smokes;
    data.obesity    = +data.obesity;
    data.income     = +data.income;
    });
  
  console.log(demoData);
});
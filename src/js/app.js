
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

d3.csv("resources/data/data.csv").then(function (data, err) {
  if (err) throw err;

  //Convert data to numerics
  data.forEach(function (d) {
    d.poverty = +d.poverty;
    d.healthcare = +d.healthcare;
    d.age = +d.age;
    d.smokes = +d.smokes;
    d.obesity = +d.obesity;
    d.income = +d.income;
  });

  console.log(data);

  // Setup the scales
  var xLinearScale = xScale(data, chosenXAxis);
  var yLinearScale = yScale(data, chosenYAxis);

  // Setup the axes 
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Add Axes to the chart
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // Append yAxis to the Chart
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);
  // Create Circles
  var circlesGroup = chartGroup.selectAll("g circle")
    .data(data)
    .enter()
    .append("g");

  var circlesXY = circlesGroup.append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .classed("stateCircle", true)
    .attr("r", 15)

  var circlesText = circlesGroup.append("text")
    .text(d => d.abbr)
    .attr("dx", d => xLinearScale(d[chosenXAxis]))
    .attr("dy", d => yLinearScale(d[chosenYAxis] - 0.4))
    .classed("stateText", true)

  //Axis labels
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height})`);

  var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "poverty")
    .text("Below Poverty")
    .classed("active", true);

  var ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "age")
    .text("Age (Median)")
    .classed("inactive", true);

  var incomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 80)
    .attr("value", "income")
    .text("Household Income")
    .classed("inactive", true);

  // Y labels
  var ylabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height})`);

  var healthcareLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", (height / 2))
    .attr("y", - (width / 2) - 30)
    .attr("value", "healthcare")
    .text("Without Healthcare (%)")
    .classed("active", true);

  var smokesLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", (height / 2))
    .attr("y", - (width / 2) - 50)
    .attr("value", "smokes")
    .text("Smoker (%)")
    .classed("inactive", true);

  var obesityLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", (height / 2))
    .attr("y", - (width / 2) - 70)
    .attr("value", "obesity")
    .text("Obesity (%)")
    .classed("inactive", true);

  // Tool tips 
  circlesGroup = updateTooltip(circlesGroup, chosenYAxis, chosenXAxis);

  //listener for the labels
  xlabelsGroup.selectAll("text")
    .on("click", function () {

      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        chosenXAxis = value;
        //Pull values for selection
        xLinearScale = xScale(data, chosenXAxis);
        xAxis = renderXAxes(xLinearScale, xAxis);
        circlesXY = renderXCircles(circlesXY, xLinearScale, chosenXAxis);
        circlesText = renderXText(circlesText, xLinearScale, chosenXAxis);
        circlesGroup = updateTooltip(circlesGroup, chosenXAxis, chosenYAxis);

        if (chosenXAxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "age") {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });

  //Y Axis
  ylabelsGroup.selectAll("text")
    .on("click", function () {

      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        chosenYAxis = value;
        yLinearScale = yScale(data, chosenYAxis);
        yAxis = renderYAxes(yLinearScale, yAxis);
        circlesXY = renderYCircles(circlesXY, yLinearScale, chosenYAxis);
        circlesText = renderYText(circlesText, yLinearScale, chosenYAxis,);
        circlesGroup = updateTooltip(circlesGroup, chosenXAxis, chosenYAxis);

        if (chosenYAxis === "healthcare") {
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenYAxis === "obesity") {
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          obesityLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
      
    }
    );
});
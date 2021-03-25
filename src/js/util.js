
function xScale(data, xAxis) {
  return d3.scaleLinear()
    .domain([d3.min(data, d => d[xAxis]) * 0.9, d3.max(data, d => d[xAxis]) * 1.1])
    .range([0, width]);
}

function yScale(data, yAxis) {
  return d3.scaleLinear()
    .domain([d3.min(data, d => d[yAxis]) - 1, d3.max(data, d => d[yAxis]) + 1])
    .range([height, 0]);
}

function renderXAxes(newXScale, xAxis) {
  return xAxis.transition()
    .duration(1000)
    .call(d3.axisBottom(newXScale));
}

function renderYAxes(newYScale, yAxis) {
  return yAxis.transition()
    .duration(1000)
    .call(d3.axisLeft(newYScale));
}

function renderXCircles(circlesGroup, newXScale, chosenXAxis) {
  return circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));
}

function renderYCircles(circlesGroup, newYScale, chosenYAxis) {
  return circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));
}

function renderXText(circlesGroup, newXScale, chosenXAxis) {
  return circlesGroup.transition()
    .duration(1000)
    .attr("dx", d => newXScale(d[chosenXAxis]));
}

function renderYText(circlesGroup, newYScale, chosenYAxis) {
  return circlesGroup.transition()
    .duration(1000)
    .attr("dy", d => newYScale(d[chosenYAxis]));
}

// Format currency
var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

// function used for updating circles group with new tooltip
function updateTooltip(circlesGroup, chosenXAxis, chosenYAxis) {

  var xPercentSign = "";
  var xLabel = "";
  if (chosenXAxis === "poverty") {
    xLabel = "Poverty";
    xPercentSign = "%";
  } else if (chosenXAxis === "age") {
    xLabel = "Age";
  } else {
    xLabel = "Income";
  }

  var yPercentSign = "";
  var ylabel = "";
  if (chosenYAxis === "healthcare") {
    ylabel = "Healthcare";
    yPercentSign = "%";
  } else if (chosenYAxis === "smokes") {
    ylabel = "Smokes";
    yPercentSign = "%";
  } else {
    ylabel = "Obesity";
    yPercentSign = "%";
  }

  // Do the tooltips
  var tooltip = d3.tip()
    .attr("class", "d3-tip")
    .offset([50, -75])
    .html(function (d) {
      if (chosenXAxis === "income") {
        let incomelevel = formatter.format(d[chosenXAxis]);

        return (`${d.state}<br>${xLabel}: ${incomelevel.substring(0, incomelevel.length - 3)}${xPercentSign}<br>${ylabel}: ${d[chosenYAxis]}${yPercentSign}`)
      } else {
        return (`${d.state}<br>${xLabel}: ${d[chosenXAxis]}${xPercentSign}<br>${ylabel}: ${d[chosenYAxis]}${yPercentSign}`)
      };
    });

  circlesGroup.call(tooltip);

  // mouseover event
  circlesGroup.on("mouseover", function (data) {
    tooltip.show(data, this);

  });

  // onmouseout event
  circlesGroup.on("mouseout", function (data) {
    tooltip.hide(data, this);
  });

  return circlesGroup;
}




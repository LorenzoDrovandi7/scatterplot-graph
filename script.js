const svg = d3.select("svg");
const width = +svg.attr("width") - 80;
const height = +svg.attr("height") - 80;
const padding = 60;

const tooltip = d3.select("#tooltip");

const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

d3.json(url).then((data) => {
  data.forEach((d) => {
    let parsedTime = d.Time.split(":");
    d.Time = new Date(1970, 0, 1, 0, +parsedTime[0], +parsedTime[1]);
    d.Year = new Date(d.Year, 0, 1);
  });

  const xScale = d3
    .scaleTime()
    .domain([d3.min(data, (d) => d.Year), d3.max(data, (d) => d.Year)])
    .range([padding, width]);

  const yScale = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.Time))
    .range([padding, height]);

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y"));

  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

  svg.append("g").attr("id", "x-axis").attr("transform", `translate(0, ${height})`).call(xAxis);

  svg.append("g").attr("id", "y-axis").attr("transform", `translate(${padding},0)`).call(yAxis);

  svg
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => xScale(d.Year))
    .attr("cy", (d) => yScale(d.Time))
    .attr("r", 6)
    .attr("data-xvalue", (d) => d.Year.toISOString())
    .attr("data-yvalue", (d) => d.Time.toISOString())
    .attr("fill", (d) => (d.Doping ? "red" : "green"))
    .on("mouseover", (event, d) => {
      tooltip
        .attr("data-year", d.Year.toISOString())
        .html(
          `
      ${d.Name}: ${d.Nationality}<br>
      Year: ${d3.timeFormat("%Y")(d.Year)}, Time: ${d3.timeFormat("%M:%S")(d.Time)}<br>
      ${d.Doping ? d.Doping : "No allegations"}
    `
        )
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 28 + "px")
        .transition()
        .duration(200)
        .style("opacity", 0.9);
    })

    .on("mouseout", () => {
      tooltip.transition().duration(200).style("opacity", 0);
    });
});

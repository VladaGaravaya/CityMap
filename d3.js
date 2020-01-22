var width = 450
height = 450
margin = 40

var radius = Math.min(width, height) / 2 - margin

var svg = d3.select("#my_dataviz")
.append("svg")
.attr("width", width)
.attr("height", height)
.append("g")
.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var data = citiesMap.statesForD3();

var color = d3.scaleOrdinal()
.domain(data)
.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"])

var pie = d3.pie()
.value(function(d) {return d.value; })
var data_ready = pie(d3.entries(data))

svg
.selectAll('whatever')
.data(data_ready)
.enter()
.append('path')
.attr('d', d3.arc()
.innerRadius(0)
.outerRadius(radius)
)
.attr('fill', function(d){ return(color(d.data.key)) })
.attr("stroke", "black")
.style("stroke-width", "2px")
.style("opacity", 0.7)

const d3 = require('d3'); // Require d3 library
const margin = { top: 20, right: 30, bottom: 30, left: 40 },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

const x = d3.scale.ordinal()
  .rangeRoundBands([0, width], .1);

const y = d3.scale.linear()
  .range([height, 0]);

const chart = d3.select('.chart')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

const xAxis = d3.svg.axis()
  .scale(x)
  .orient('bottom');

const yAxis = d3.svg.axis()
  .scale(y)
  .orient('left')
  .ticks(10, '%');

d3.csv('data/bar.csv', type, (error, data) => {
  console.log(data);

  x.domain(data.map((d) => d.letter));
  y.domain([0, d3.max(data, (d) => d.value)]);

  chart.append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', `translate(0, ${height})`)
    .call(xAxis);

  chart.append('g')
    .attr('class', 'axis axis--y')
    .call(yAxis)
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '.71em')
    .style('text-anchor', 'end')
    .text('Frequency');

  var bars = chart.selectAll('.bar')
    .data(data)
    .enter();

  var groups = bars.append('g').attr('class', 'bar');

  var rects = groups.append('rect')
    .attr('class', 'bar-rect')
    .attr('y', height)
    .attr('height', 0);

  groups.append('text')
    .attr('class', 'bar-text')
    .attr('x', (d) => x(d.letter) +  (x.rangeBand() / 2))
    .attr('y', height)
    .attr('dy', '.71em')
    .style('text-anchor', 'middle')
    .text((d) => `${Math.round(d.value * 100, 1)}%`);

  rects.transition()
    .duration(500)
    .delay((d, i) => i / 10 * 250)
    .attr('x', (d) => x(d.letter))
    .attr('y', (d) => y(d.value))
    .attr('height', (d) => height - y(d.value))
    .attr('width', x.rangeBand())

});


function type(d) {
  d.value = +d.frequency;
  return d;
}
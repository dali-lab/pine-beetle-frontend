import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Histogram = () => {
  const chartRef = useRef();

  useEffect(() => {
    const margin = {
      top: 40,
      right: 20,
      bottom: 100,
      left: 100,
    }; // Adjusted for spacing
    const width = 700 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const bins = ['<2.5%', '2.5-5%', '5-15%', '15-25%', '25-40%', '>40%'];
    const categories = [
      '0',
      '1-9',
      '10-19',
      '20-49',
      '50-99',
      '100-249',
      '>249',
    ];

    const mockData = {
      '<2.5%': { 0: 80, '1-9': 20 },
      '2.5-5%': { 0: 60, '1-9': 30, '10-19': 10 },
      '5-15%': {
        0: 40,
        '1-9': 30,
        '10-19': 20,
        '20-49': 10,
      },
      '15-25%': {
        0: 20,
        '1-9': 30,
        '10-19': 30,
        '20-49': 20,
      },
      '25-40%': {
        0: 10,
        '1-9': 20,
        '10-19': 40,
        '20-49': 30,
      },
      '>40%': {
        '1-9': 10,
        '10-19': 30,
        '20-49': 40,
        '50-99': 20,
      },
    };

    d3.select(chartRef.current).selectAll('*').remove();

    const svg = d3
      .select(chartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    const mainGroup = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Main scales
    const xScaleMain = d3
      .scaleBand()
      .domain(bins)
      .range([0, width])
      .padding(0.2);
    const yScaleMain = d3
      .scaleBand()
      .domain([...categories.reverse(), ''])
      .range([0, height])
      .padding(0.1);

    // Big Y-axis
    mainGroup
      .append('g')
      .call(
        d3
          .axisLeft(yScaleMain)
          .tickSize(0)
          .tickFormat((d) => d),
      )
      .selectAll('text')
      .style('font-size', '12px');

    // Big X-axis
    mainGroup
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(
        d3
          .axisBottom(xScaleMain)
          .tickSize(0)
          .tickFormat((d) => d),
      );

    // Render each small chart
    bins.forEach((bin) => {
      const smallChartData = mockData[bin];

      const smallChartWidth = xScaleMain.bandwidth();
      const smallChartHeight = height - 90;

      const xScale = d3
        .scaleLinear()
        .domain([0, 100])
        .range([0, smallChartWidth]);
      const yScale = d3
        .scaleBand()
        .domain(categories)
        .range([0, smallChartHeight])
        .paddingInner(0.03)
        .paddingOuter(0.01);

      const smallGroup = mainGroup
        .append('g')
        .attr('transform', `translate(${xScaleMain(bin)}, ${20})`);

      // X-axis with major and minor ticks (no labels)
      const bigTicks = d3.range(0, 101, 12.5); // 8 big ticks from 0 to 100
      const smallTicks = d3.range(0, 101, 3.125); // 3 small ticks between big ticks

      // Add the custom axis for the smaller chart's x-axis
      smallGroup
        .append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${smallChartHeight})`)
        .call(
          d3
            .axisBottom(xScale)
            .tickValues(bigTicks) // Use custom big ticks
            .tickSize(6), // Big tick size
        )
        .selectAll('.tick text') // Remove text for ticks
        .remove();

      // Add minor ticks manually
      smallGroup
        .selectAll('.minor-tick')
        .data(smallTicks)
        .enter()
        .append('line')
        .attr('class', 'minor-tick')
        .attr('x1', (d) => xScale(d))
        .attr('x2', (d) => xScale(d))
        .attr('y1', smallChartHeight)
        .attr('y2', smallChartHeight + 3) // Shorter tick for minor lines
        .attr('stroke', 'black')
        .attr('stroke-width', 1);

      // Y-axis ticks
      smallGroup
        .append('g')
        .call(d3.axisLeft(yScale).tickSize(8).tickFormat(''));

      // Bars
      Object.keys(smallChartData).forEach((key) => {
        const barWidth = xScale(smallChartData[key]);
        const barHeight = yScale.bandwidth();
        const radius = 5; // Radius for rounding the corners

        // Define the path for a rounded rectangle (only top-right and bottom-right corners)
        const path = `
          M 0.7,0
          L ${barWidth - radius},0
          Q ${barWidth},0 ${barWidth},${radius}
          L ${barWidth},${barHeight - radius}
          Q ${barWidth},${barHeight} ${barWidth - radius},${barHeight}
          L 0.7,${barHeight}
          Z
        `;

        // Determine fill color based on the range
        const fillColor = ['50-99', '100-249', '>249'].includes(key)
          ? '#FFC148'
          : '#86CCFF';

        smallGroup
          .append('path')
          .attr('d', path)
          .attr('transform', `translate(0, ${yScale(key)})`)
          .attr('fill', fillColor);
      });

      // Frequency text - correctly inside the gap above the X-axis
      mainGroup
        .append('text')
        .attr('x', xScaleMain(bin) + smallChartWidth / 2)
        .attr('y', height - 30) // Positioned in the gap above X-axis
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('fill', '#555')
        .text(`Frequency (n = ${Math.floor(Math.random() * 100)})`);
    });

    // Labels
    svg
      .append('text')
      .attr('x', margin.left + width / 2)
      .attr('y', margin.top + height + 40)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('Predicted % chance of > 50 spots');

    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -(margin.top + height / 2))
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('Observed number of spots');
  }, []);

  return <div ref={chartRef} />;
};

export default Histogram;

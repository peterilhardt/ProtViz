function colorLegendCategorical(colorbar) {
    const margin = {top: 10, right: 60, bottom: 10, left: 2};
    const legendHeight = 300;
    const legendWidth = 85;

    d3.selectAll('svg > *').remove();

    let canvas = d3.select('#legend')
        .style("height", legendHeight + "px")
        .style("width", legendWidth + "px")
        .style("position", "relative")
        .append("canvas")
            .attr("height", legendHeight - margin.top - margin.bottom)
            .attr("width", 1)
            .style("height", (legendHeight - margin.top - margin.bottom) + "px")
            .style("width", (legendWidth - margin.left - margin.right) + "px")
            .style("border", "1px solid #000")
            .style("position", "fixed")
            .style("bottom", "calc(2vw + " + margin.bottom + "px)")
            .style("right", "calc(2vw + " + margin.right + "px)")
            //.style("bottom", (margin.bottom) + "px")
            //.style("right", (margin.right) + "px")
            .node();
    
    let ctx = canvas.getContext("2d");

    let legendScale = d3.scaleBand()
        .range([1, legendHeight - margin.top - margin.bottom])
        .domain(colorbar.domain());

    legendScale.invert = function(x) {
        let domain = this.domain();
        let range = this.range();
        let scale = d3.scaleQuantize().domain(range).range(domain);
        return scale(x);
    };

    let image = ctx.createImageData(1, legendHeight);
    d3.range(legendHeight).forEach(function(i) {
        let c = d3.rgb(colorbar(legendScale.invert(i)));
        image.data[4*i] = c.r;
        image.data[4*i + 1] = c.g;
        image.data[4*i + 2] = c.b;
        image.data[4*i + 3] = 255;
    });
    ctx.putImageData(image, 0, 0);

    let legendAxis = d3.axisRight()
        .scale(legendScale)
        .tickSize(6)
        .ticks(8);
    
    let svg = d3.select('#legend')
        .append("svg")
        .attr("height", (legendHeight) + "px")
        .attr("width", (legendWidth) + "px")
        .style("position", "fixed")
        //.style("bottom", "0px")
        //.style("right", "0px")
        .style("bottom", "2vw")
        .style("right", "2vw");
    
    svg.append('g')
        .attr('class', 'axis')
        .attr('class', 'legend')
        .attr('transform', 'translate(' + (legendWidth - margin.left - margin.right + 3) + ',' + (margin.top) + ')')
        .call(legendAxis);

    /*
    let svg = d3.select('#legend2')
        .style('position', 'absolute');
    const size = 20;
    
    svg.selectAll('rect')
        .data(colorbar.domain())
        .enter()
        .append('rect')
            .attr('x', 100)
            .attr('y', function(d,i) {return 100 + i * (size + 5)})
            .attr('width', size)
            .attr('height', size)
            .style('fill', function(d) {return colorbar(d)});

    svg.selectAll('text')
        .data(colorbar.domain())
        .enter()
        .append('text')
            .attr('x', 100 + size * 1.2)
            .attr('y', function(d,i) {return 100 + i * (size + 5) + (size / 2)})
            .style('fill', function(d) {return colorbar(d)})
            .text(function(d) {return d})
            .attr('text-anchor', 'left')
            .style('alignment-baseline', 'middle');
    */
};

function colorLegendContinuous(colorbar) {
    const margin = {top: 10, right: 60, bottom: 10, left: 2};
    const legendHeight = 300;
    const legendWidth = 85;

    d3.selectAll('svg > *').remove();

    let canvas = d3.select('#legend')
        .style("height", legendHeight + "px")
        .style("width", legendWidth + "px")
        .style("position", "relative")
        .append("canvas")
            .attr("height", legendHeight - margin.top - margin.bottom)
            .attr("width", 1)
            .style("height", (legendHeight - margin.top - margin.bottom) + "px")
            .style("width", (legendWidth - margin.left - margin.right) + "px")
            .style("border", "1px solid #000")
            .style("position", "fixed")
            .style("bottom", "calc(2vw + " + margin.bottom + "px)")
            .style("right", "calc(2vw + " + margin.right + "px)")
            //.style("bottom", (margin.bottom) + "px")
            //.style("right", (margin.right) + "px")
            .node();
    
    let ctx = canvas.getContext("2d");

    let legendScale = d3.scaleLinear()
        .range([1, legendHeight - margin.top - margin.bottom])
        .domain(colorbar.domain());

    let image = ctx.createImageData(1, legendHeight);
    d3.range(legendHeight).forEach(function(i) {
        let c = d3.rgb(colorbar(legendScale.invert(i)));
        image.data[4*i] = c.r;
        image.data[4*i + 1] = c.g;
        image.data[4*i + 2] = c.b;
        image.data[4*i + 3] = 255;
    });
    ctx.putImageData(image, 0, 0);

    let legendAxis = d3.axisRight()
        .scale(legendScale)
        .tickSize(6)
        .ticks(8);
    
    let svg = d3.select('#legend')
        .append("svg")
        .attr("height", (legendHeight) + "px")
        .attr("width", (legendWidth) + "px")
        .style("position", "fixed")
        //.style("bottom", "0px")
        //.style("right", "0px")
        .style("bottom", "2vw")
        .style("right", "2vw");
    
    svg.append('g')
        .attr('class', 'axis')
        .attr('class', 'legend')
        .attr('transform', 'translate(' + (legendWidth - margin.left - margin.right + 3) + ',' + (margin.top) + ')')
        .call(legendAxis);
};
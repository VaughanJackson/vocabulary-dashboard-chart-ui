const vocabularyChart = () => {

    // Set the default dimensions of the canvas / graph
    // Uses the Margin Convention https://bl.ocks.org/mbostock/3019563
    var width = 600; // default width
    var height = 270; // default height
    var margin = {top: 30, right: 20, bottom: 30, left: 50}; // default margin

    // Derived attributes
    var graphWidth, xRange, xAxis;
    var graphHeight, yRange, yAxis;

    const deriveXAxis = (width, margin) => {
        graphWidth = width - margin.left - margin.right;
        xRange = d3.scaleLinear().range([0, graphWidth]);
        xAxis = d3.axisBottom().scale(xRange).ticks(10);
    };

    const deriveYAxis = (height, margin) => {
        graphHeight = height - margin.top - margin.bottom;
        yRange = d3.scaleLinear().range([graphHeight, 0]);
        yAxis = d3.axisLeft().scale(yRange).ticks(10);
    };

    deriveXAxis(width, margin);
    deriveYAxis(height, margin);

    // Define the lines
    const cumulativeValueLine = d3.area()
        .x(character => xRange(character.frequencyRank))
        .y(character  => yRange(character.cumulativePercentage));

    const incrementalValueLine = d3.area()
        .x(character => xRange(character.frequencyRank))
        .y(character => yRange(character.frequencyPercentage));

    const addCumulativeCurve = (svg, characters) =>
        svg.append("path")
            .attr("d", cumulativeValueLine(characters))
            .attr("id", "cumulative");

    const addIncrementalLine = (svg, characters) =>
        svg.append("path")
            .attr("d", incrementalValueLine(characters))
            .attr("id", "incremental");

    const addXAxis = (svg, xAxis) =>
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + graphHeight + ")")
            .call(xAxis);

    const labelXAxis = (svg, width, height, margin, label) =>
        svg.append("text")
            .attr("transform",
                "translate(" + (width / 2) + " ," +
                (height + margin.top + 10) + ")")
            .style("text-anchor", "middle")
            .text(label);

    const addYAxis = (svg, yAxis) =>
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

    const labelYAxis = (svg, margin, height, label) =>
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(label);

    const labelCumulativeCurve = (svg, label) =>
        svg.append("text")
            .append("textPath")
            .attr("startOffset", "45%")
            .attr("baseline-shift", "80%")
            .attr("xlink:href", "#cumulative")
            .text(label);

    // characters refers to whole array of characters for the tactical reason of being a way to
    // get a reference to svg passed to it as part of invocation through forEach.
    const addLineUnderCurveForCharacter = (character, index, characters) => {

        const lineUnderCurve = [{x: xRange(character.frequencyRank), y: yRange(0)},
            {x: xRange(character.frequencyRank), y: yRange(character.cumulativePercentage)}];

        const lineAccessorFunction = d3.line()
            .x(character => character.x)
            .y(character => character.y)
            .curve(d3.curveLinear);

        characters.svg.append("path")
            .attr("d", lineAccessorFunction(lineUnderCurve))
            .attr("stroke", characters.cumulativeColourScale(character.cumulativePercentage))
            .attr("stroke-width", 0.1)
            .attr("fill", "none")
    };

    const fillUnderCumulativeCurve = (svg, characters, cumulativeColourScale) => {
        // 'Package' the svg element and colour scale references as characters attributes, so they are then accessible
        // in a forEach/map callback.
        characters.cumulativeColourScale = cumulativeColourScale;
        characters.svg = svg;
        characters.forEach(addLineUnderCurveForCharacter);
    };

    const labelIncrementalLine = (svg, label) =>
        svg.append("text")
            .append("textPath")
            .attr("startOffset", "43.5%")
            .attr("baseline-shift", "80%")
            .attr("xlink:href", "#incremental")
            .text(label);

    const addCumulativeTooltips = (svg, div, characters) =>

        svg.selectAll("dot")
            .data(characters)
            .enter().append("circle")
            .attr("class", "incremental")
            .attr("r", 0.5)
            .attr("cx", character => xRange(character.frequencyRank))
            .attr("cy", character => yRange(character.cumulativePercentage))
            .on("mouseover", character => {
                div.transition()
                    .duration(200)
                    .style("opacity", .9)
                    .style("background", characters.cumulativeColourScale(character.cumulativePercentage));
                div.html(character.character + "<br/>" +
                    character.cumulativePercentage + "%<br/>[" +
                    character.frequencyRank + "]")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 18) + "px");
            })
            .on("mouseout", () => div.transition().duration(500).style("opacity", 0));

    // We give the area that can be hovered over by the mouse a minimum height of 1 so that we still get tooltips
    // for anything beyond the first few characters!
    const addIncrementalTooltips = (svg, div, characters, colourScale, spacing) => {

        // Define colour scale for tooltip background.
        const incrementalColourScale = d3.scaleLinear()
            .domain(spacing(d3.max(characters, character => character.frequencyPercentage), 0, colourScale.length))
            .range(colourScale);

        svg.selectAll("dot")
            .data(characters)
            .enter().append("rect")
            .attr("class", "incremental")
            .attr("x", character => xRange(character.frequencyRank))
            .attr("y", character => yRange(character.frequencyPercentage))
            .attr("height", character => Math.max(1, (yRange(0) - yRange(character.frequencyPercentage))))
            .attr("width", 1)
            .on("mouseover", character => {
                div.transition()
                    .duration(200)
                    .style("opacity", .9)
                    .style("background", incrementalColourScale(character.frequencyPercentage));
                div.html(character.character + "<br/>" +
                    character.frequencyPercentage + "%<br/>[" +
                    character.frequencyRank + "]")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 18) + "px");
            })
            .on("mouseout", () => div.transition().duration(500).style("opacity", 0))
    };

    // Rebranded function linspace from https://bl.ocks.org/starcalibre/6cccfa843ed254aa0a0d.
    const linearSpacingAgainstScale = (domainStartValue, domainEndValue, numberOfStepValuesinScale) => {
        const scaleStepValuesCalibratedToDomainValues = [];
        const delta = (domainEndValue - domainStartValue) / (numberOfStepValuesinScale - 1);

        let i = 0;
        while (i < (numberOfStepValuesinScale - 1)) {
            scaleStepValuesCalibratedToDomainValues.push(domainStartValue + (i * delta));
            i++;
        }

        scaleStepValuesCalibratedToDomainValues.push(domainEndValue);
        return scaleStepValuesCalibratedToDomainValues;
    };

    // Spectral 8 colour scale as demoed at https://bl.ocks.org/starcalibre/6cccfa843ed254aa0a0d.
    const spectral8Scale = ['#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#e6f598', '#abdda4', '#66c2a5', '#3288bd'];

    // TODO called 'my' in https://bost.ocks.org/mike/chart/ - is 'implementation' any better?
    const implementation = (selection, characters) => {

        // Define the div for the tooltip
        const div = selection.append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // Add the svg canvas
        const svg = selection
            .append("svg")
            .attr("width", graphWidth + margin.left + margin.right)
            .attr("height", graphHeight + margin.top + margin.bottom + 30)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Scale the range of the data - use cumulative percentage covered to scale y axis
        xRange.domain([0, d3.max(characters, character => character.frequencyRank)]);
        yRange.domain([0, d3.max(characters, character => character.cumulativePercentage)]);

        // Define colour scale for cumulative tooltip and line under curve background.
        // TODO 1. Consider using this colour scale to represent a user's progress - they get the tooltip as some kind
        // of badge corresponding to the highest frequencyRank character that they know in an unbroken sequence from the
        // first character.
        const cumulativeColourScale = d3.scaleLinear()
            .domain(linearSpacingAgainstScale(0, d3.max(characters, character => character.cumulativePercentage), spectral8Scale.length))
            .range(spectral8Scale);

        addXAxis(svg, xAxis);
        labelXAxis(svg, graphWidth, graphHeight, margin, "Character inverse frequency ranking");
        addYAxis(svg, yAxis);
        labelYAxis(svg, margin, graphHeight, "Percentage of printed material covered");

        addCumulativeCurve(svg, characters);
        addCumulativeTooltips(svg, div, characters);
        labelCumulativeCurve(svg, "cumulative");
        fillUnderCumulativeCurve(svg, characters, cumulativeColourScale);

        addIncrementalLine(svg, characters);
        addIncrementalTooltips(svg, div, characters, spectral8Scale, linearSpacingAgainstScale);
        labelIncrementalLine(svg, "incremental");

    };

    implementation.margin = (value) => {
        margin = value;
        // Axes must be recalculated
        deriveXAxis(width, margin);
        deriveYAxis(height, margin);
        return implementation;
    };

    implementation.getMargin = () => margin;

    implementation.width = (value) => {
        width = value;
        // xAxis must be recalculated
        deriveXAxis(width, margin);
        return implementation;
    };

    implementation.getWidth = () => width;

    implementation.height = (value,) => {
        height = value;
        // yAxis must be recalculated
        deriveYAxis(height, margin);
        return implementation;
    };

    implementation.getHeight = () => height;

    return implementation;
};

const chart = vocabularyChart().margin({top: 300, right: 20, bottom: 200, left: 50})
    .height(800)
    .width(1600);

// Get the data
d3.json("http://localhost:8080/vocabulary").then((characters) => {
    return d3.select("body")
             .call(chart, characters);
}).catch((error) => {
   return console.log(error);
});
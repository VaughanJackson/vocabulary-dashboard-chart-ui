
// Spectral 8 colour scale as demoed at https://bl.ocks.org/starcalibre/6cccfa843ed254aa0a0d.
export const SPECTRAL_8_SCALE = ['#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#e6f598', '#abdda4', '#66c2a5', '#3288bd'];
export const DEFAULT_WIDTH = 600;
export const DEFAULT_HEIGHT = 270;
export const DEFAULT_MARGIN = {top: 30, right: 20, bottom: 30, left: 50};

export default class {

    constructor() {

        // Set the default dimensions of the canvas / graph
        // Uses the Margin Convention https://bl.ocks.org/mbostock/3019563
        this.width = DEFAULT_WIDTH;
        this.height = DEFAULT_HEIGHT;
        this.margin = DEFAULT_MARGIN;
        // Derived attributes
        this.graphWidth = this.xRange = this.xAxis = 0;
        this.graphHeight = this.yRange = this.yAxis = 0;

        this.colourScale = SPECTRAL_8_SCALE;

        this.deriveXAxis = (width, margin) => {
            this.graphWidth = width - margin.left - margin.right;
            this.xRange = d3.scaleLinear().range([0, this.graphWidth]);
            this.xAxis = d3.axisBottom().scale(this.xRange).ticks(10);
        };

        this.deriveYAxis = (height, margin) => {
            this.graphHeight = height - margin.top - margin.bottom;
            this.yRange = d3.scaleLinear().range([this.graphHeight, 0]);
            this.yAxis = d3.axisLeft().scale(this.yRange).ticks(10);
        };

        this.deriveXAxis(this.width, this.margin);
        this.deriveYAxis(this.height, this.margin);

        // Define the lines
        this.cumulativeValueLine = d3.area()
            .x(character => this.xRange(character.frequencyRank))
            .y(character => this.yRange(character.cumulativePercentage));

        this.incrementalValueLine = d3.area()
            .x(character => this.xRange(character.frequencyRank))
            .y(character => this.yRange(character.frequencyPercentage));

        this.addCumulativeCurve = (svg, characters) =>
            svg.append("path")
                .attr("d", this.cumulativeValueLine(characters))
                .attr("id", "cumulative");

        this.addIncrementalLine = (svg, characters) =>
            svg.append("path")
                .attr("d", this.incrementalValueLine(characters))
                .attr("id", "incremental");

        this.addXAxis = (svg, xAxis) =>
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + this.graphHeight + ")")
                .call(xAxis);

        this.labelXAxis = (svg, width, height, margin, label) =>
            svg.append("text")
                .attr("transform",
                    "translate(" + (width / 2) + " ," +
                    (height + margin.top + 10) + ")")
                .style("text-anchor", "middle")
                .text(label);

        this.addYAxis = (svg, yAxis) =>
            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis);

        this.labelYAxis = (svg, margin, height, label) =>
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x", 0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text(label);

        this.labelCumulativeCurve = (svg, label) =>
            svg.append("text")
                .append("textPath")
                .attr("startOffset", "45%")
                .attr("baseline-shift", "80%")
                .attr("xlink:href", "#cumulative")
                .text(label);

        // characters refers to whole array of characters for the tactical reason of being a way to
        // get a reference to svg passed to it as part of invocation through forEach.
        this.addLineUnderCurveForCharacter = (character, index, characters) => {

            const lineUnderCurve = [{x: this.xRange(character.frequencyRank), y: this.yRange(0)},
                {x: this.xRange(character.frequencyRank), y: this.yRange(character.cumulativePercentage)}];

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

        this.fillUnderCumulativeCurve = (svg, characters, cumulativeColourScale) => {
            // 'Package' the svg element and colour scale references as characters attributes, so they are then accessible
            // in a forEach/map callback.
            characters.cumulativeColourScale = cumulativeColourScale;
            characters.svg = svg;
            characters.forEach(this.addLineUnderCurveForCharacter);
        };

        this.labelIncrementalLine = (svg, label) =>
            svg.append("text")
                .append("textPath")
                .attr("startOffset", "43.5%")
                .attr("baseline-shift", "80%")
                .attr("xlink:href", "#incremental")
                .text(label);

        this.addCumulativeTooltips = (svg, div, characters) =>

            svg.selectAll("dot")
                .data(characters)
                .enter().append("circle")
                .attr("class", "incremental")
                .attr("r", 0.5)
                .attr("cx", character => this.xRange(character.frequencyRank))
                .attr("cy", character => this.yRange(character.cumulativePercentage))
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
        this.addIncrementalTooltips = (svg, div, characters, colourScale, spacing) => {

            // Define colour scale for tooltip background.
            const incrementalColourScale = d3.scaleLinear()
                .domain(spacing(d3.max(characters, character => character.frequencyPercentage), 0, colourScale.length))
                .range(colourScale);

            svg.selectAll("dot")
                .data(characters)
                .enter().append("rect")
                .attr("class", "incremental")
                .attr("x", character => this.xRange(character.frequencyRank))
                .attr("y", character => this.yRange(character.frequencyPercentage))
                .attr("height", character => Math.max(1, (this.yRange(0) - this.yRange(character.frequencyPercentage))))
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
        this.linearSpacingAgainstScale = (domainStartValue, domainEndValue, numberOfStepValuesinScale) => {
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

        // TODO called 'my' in https://bost.ocks.org/mike/chart/ - is 'draw' any better?
        this.draw = (selection, characters) => {

            // Define the div for the tooltip
            const div = selection.append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            // Add the svg canvas
            const svg = selection
                .append("svg")
                .attr("width", this.graphWidth + this.margin.left + this.margin.right)
                .attr("height", this.graphHeight + this.margin.top + this.margin.bottom + 30)
                .append("g")
                .attr("transform",
                    "translate(" + this.margin.left + "," + this.margin.top + ")");

            // Scale the range of the data - use cumulative percentage covered to scale y axis
            this.xRange.domain([0, d3.max(characters, character => character.frequencyRank)]);
            this.yRange.domain([0, d3.max(characters, character => character.cumulativePercentage)]);

            // Define colour scale for cumulative tooltip and line under curve background.
            // TODO 1. Consider using this colour scale to represent a user's progress - they get the tooltip as some kind
            // of badge corresponding to the highest frequencyRank character that they know in an unbroken sequence from the
            // first character.
            const cumulativeColourScale = d3.scaleLinear()
                .domain(this.linearSpacingAgainstScale(0, d3.max(characters, character => character.cumulativePercentage), this.colourScale.length))
                .range(this.colourScale);

            this.addXAxis(svg, this.xAxis);
            this.labelXAxis(svg, this.graphWidth, this.graphHeight, this.margin, "Character inverse frequency ranking");
            this.addYAxis(svg, this.yAxis);
            this.labelYAxis(svg, this.margin, this.graphHeight, "Percentage of printed material covered");

            this.addCumulativeCurve(svg, characters);
            this.addCumulativeTooltips(svg, div, characters);
            this.labelCumulativeCurve(svg, "cumulative");
            this.fillUnderCumulativeCurve(svg, characters, cumulativeColourScale);

            this.addIncrementalLine(svg, characters);
            this.addIncrementalTooltips(svg, div, characters, this.colourScale, this.linearSpacingAgainstScale);
            this.labelIncrementalLine(svg, "incremental");
        };

        this.setMargin = (value) => {
            this.margin = value;
            // Axes must be recalculated
            this.deriveXAxis(this.width, this.margin);
            this.deriveYAxis(this.height, this.margin);
            return this;
        };

        this.getMargin = () => this.margin;

        this.setWidth = (value) => {
            this.width = value;
            // xAxis must be recalculated
            this.deriveXAxis(this.width, this.margin);
            return this;
        };

        this.getWidth = () => this.width;

        this.setHeight = (value,) => {
            this.height = value;
            // yAxis must be recalculated
            this.deriveYAxis(this.height, this.margin);
            return this;
        };

        this.getHeight = () => this.height;

        this.setColourScale = (value,) => {
            this.colourScale = value;
            return this;
        };

        this.getColourScale = () => this.colourScale;
    }

}
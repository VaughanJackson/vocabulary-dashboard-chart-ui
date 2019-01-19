
// Spectral 8 and viridis colour scales as demoed at https://bl.ocks.org/starcalibre/6cccfa843ed254aa0a0d.
export const SPECTRAL_8_SCALE = ['#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#e6f598', '#abdda4', '#66c2a5', '#3288bd'];
export const VIRIDIS_SCALE = 
    ['#440154', '#440256', '#450457', '#450559', '#46075a', '#46085c', '#460a5d', '#460b5e', '#470d60', '#470e61', 
        '#471063', '#471164', '#471365', '#481467', '#481668', '#481769', '#48186a', '#481a6c', '#481b6d', '#481c6e', 
        '#481d6f', '#481f70', '#482071', '#482173', '#482374', '#482475', '#482576', '#482677', '#482878', '#482979', 
        '#472a7a', '#472c7a', '#472d7b', '#472e7c', '#472f7d', '#46307e', '#46327e', '#46337f', '#463480', '#453581',
        '#453781', '#453882', '#443983', '#443a83', '#443b84', '#433d84', '#433e85', '#423f85', '#424086', '#424186',
        '#414287', '#414487', '#404588', '#404688', '#3f4788', '#3f4889', '#3e4989', '#3e4a89', '#3e4c8a', '#3d4d8a',
        '#3d4e8a', '#3c4f8a', '#3c508b', '#3b518b', '#3b528b', '#3a538b', '#3a548c', '#39558c', '#39568c', '#38588c', 
        '#38598c', '#375a8c', '#375b8d', '#365c8d', '#365d8d', '#355e8d', '#355f8d', '#34608d', '#34618d', '#33628d',
        '#33638d', '#32648e', '#32658e', '#31668e', '#31678e', '#31688e', '#30698e', '#306a8e', '#2f6b8e', '#2f6c8e',
        '#2e6d8e', '#2e6e8e', '#2e6f8e', '#2d708e', '#2d718e', '#2c718e', '#2c728e', '#2c738e', '#2b748e', '#2b758e', 
        '#2a768e', '#2a778e', '#2a788e', '#29798e', '#297a8e', '#297b8e', '#287c8e', '#287d8e', '#277e8e', '#277f8e',
        '#27808e', '#26818e', '#26828e', '#26828e', '#25838e', '#25848e', '#25858e', '#24868e', '#24878e', '#23888e',
        '#23898e', '#238a8d', '#228b8d', '#228c8d', '#228d8d', '#218e8d', '#218f8d', '#21908d', '#21918c', '#20928c',
        '#20928c', '#20938c', '#1f948c', '#1f958b', '#1f968b', '#1f978b', '#1f988b', '#1f998a', '#1f9a8a', '#1e9b8a',
        '#1e9c89', '#1e9d89', '#1f9e89', '#1f9f88', '#1fa088', '#1fa188', '#1fa187', '#1fa287', '#20a386', '#20a486',
        '#21a585', '#21a685', '#22a785', '#22a884', '#23a983', '#24aa83', '#25ab82', '#25ac82', '#26ad81', '#27ad81',
        '#28ae80', '#29af7f', '#2ab07f', '#2cb17e', '#2db27d', '#2eb37c', '#2fb47c', '#31b57b', '#32b67a', '#34b679',
        '#35b779', '#37b878', '#38b977', '#3aba76', '#3bbb75', '#3dbc74', '#3fbc73', '#40bd72', '#42be71', '#44bf70',
        '#46c06f', '#48c16e', '#4ac16d', '#4cc26c', '#4ec36b', '#50c46a', '#52c569', '#54c568', '#56c667', '#58c765',
        '#5ac864', '#5cc863', '#5ec962', '#60ca60', '#63cb5f', '#65cb5e', '#67cc5c', '#69cd5b', '#6ccd5a', '#6ece58',
        '#70cf57', '#73d056', '#75d054', '#77d153', '#7ad151', '#7cd250', '#7fd34e', '#81d34d', '#84d44b', '#86d549',
        '#89d548', '#8bd646', '#8ed645', '#90d743', '#93d741', '#95d840', '#98d83e', '#9bd93c', '#9dd93b', '#a0da39',
        '#a2da37', '#a5db36', '#a8db34', '#aadc32', '#addc30', '#b0dd2f', '#b2dd2d', '#b5de2b', '#b8de29', '#bade28',
        '#bddf26', '#c0df25', '#c2df23', '#c5e021', '#c8e020', '#cae11f', '#cde11d', '#d0e11c', '#d2e21b', '#d5e21a',
        '#d8e219', '#dae319', '#dde318', '#dfe318', '#e2e418', '#e5e419', '#e7e419', '#eae51a', '#ece51b', '#efe51c',
        '#f1e51d', '#f4e61e', '#f6e620', '#f8e621', '#fbe723', '#fde725'];
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
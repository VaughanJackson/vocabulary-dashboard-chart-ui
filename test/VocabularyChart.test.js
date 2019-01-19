// TODO Is there a better way to manage this d3 dependency across both the browser and in these tests?
import * as d3 from "d3";
global.d3 = d3;

import VocabularyChart from '../VocabularyChart.js';
import {DEFAULT_WIDTH, DEFAULT_HEIGHT, DEFAULT_MARGIN, SPECTRAL_8_SCALE, VIRIDIS_SCALE} from '../VocabularyChart.js';

describe('Constructor', function() {

    it('Sets initial values', () => {

        const chart = new VocabularyChart();

        expect(chart.getWidth()).toBe(DEFAULT_WIDTH);
        expect(chart.getHeight()).toBe(DEFAULT_HEIGHT);
        expect(chart.getMargin()).toEqual(DEFAULT_MARGIN);
        expect(chart.getColourScale()).toBe(SPECTRAL_8_SCALE);
    });

});

describe('Setters', function() {

    it('Sets scale', () => {
        const chart = new VocabularyChart();

        chart.setColourScale(VIRIDIS_SCALE);

        expect(chart.getColourScale()).toBe(VIRIDIS_SCALE);
    });

    it('Sets margin, triggers graph recalculations', () => {
        const margin = {top: 100, right: 100, bottom: 100, left: 100};
        const chart = new VocabularyChart();
        const graphWidthBefore = chart.graphWidth;
        const xRangeBefore = chart.xRange;
        const xAxisBefore = chart.xAxis;
        const graphHeightBefore = chart.graphHeight;
        const yRangeBefore = chart.yRange;
        const yAxisBefore = chart.yAxis;

        chart.setMargin(margin);

        expect(chart.getMargin()).toBe(margin);

        expect(chart.graphWidth).not.toBe(graphWidthBefore);
        expect(chart.xRange).not.toBe(xRangeBefore);
        expect(chart.xAxis).not.toBe(xAxisBefore);
        expect(chart.graphHeight).not.toBe(graphHeightBefore);
        expect(chart.yRange).not.toBe(yRangeBefore);
        expect(chart.yAxis).not.toBe(yAxisBefore);
    });

    it('Sets width, triggers x-axis recalculations', () => {
        const width = 5000;
        const chart = new VocabularyChart();
        const graphWidthBefore = chart.graphWidth;
        const xRangeBefore = chart.xRange;
        const xAxisBefore = chart.xAxis;

        chart.setWidth(width);

        expect(chart.getWidth()).toBe(width);

        expect(chart.graphWidth).not.toBe(graphWidthBefore);
        expect(chart.xRange).not.toBe(xRangeBefore);
        expect(chart.xAxis).not.toBe(xAxisBefore);
    });

    it('Sets height, triggers y-axis recalculations', () => {
        const height = 5000;
        const chart = new VocabularyChart();
        const graphHeightBefore = chart.graphHeight;
        const yRangeBefore = chart.yRange;
        const yAxisBefore = chart.yAxis;

        chart.setHeight(height);

        expect(chart.getHeight()).toBe(height);

        expect(chart.graphHeight).not.toBe(graphHeightBefore);
        expect(chart.yRange).not.toBe(yRangeBefore);
        expect(chart.yAxis).not.toBe(yAxisBefore);
    });

});

describe('Graph functions', function() {

    it('Is what exactly?', () => {
        const chart = new VocabularyChart();
        console.log(chart.cumulativeValueLine);
    });

    it('It generates an area under a cumulative value line', () => {
        const characters = [{frequencyRank: 1, cumulativePercentage: 50},{frequencyRank: 2, cumulativePercentage: 100}];
        const chart = new VocabularyChart();

        const area = chart.cumulativeValueLine(characters);

        expect(area).not.toBe(null);
    });

    it('It generates an area under an incremental value line', () => {
        const characters = [{frequencyRank: 1, frequencyPercentage: 50},{frequencyRank: 2, frequencyPercentage: 50}];
        const chart = new VocabularyChart();

        const area = chart.incrementalValueLine(characters);

        expect(area).not.toBe(null);
    });

    it('It adds a cumulative curve', () => {
        const characters = [{frequencyRank: 1, frequencyPercentage: 50},{frequencyRank: 2, frequencyPercentage: 50}];
        const chart = new VocabularyChart();
        const selection = document.body;
        console.log("selection = " + selection);

        // Add the svg canvas
        // TODO SVG may not be supported in jsdom?
        // See https://stackoverflow.com/questions/44173754/jsdom-not-support-svg
        const svg = selection
            .append("svg");

        console.log("svg = " + svg);
        //     .attr("width", this.graphWidth + this.margin.left + this.margin.right)
        //     .attr("height", this.graphHeight + this.margin.top + this.margin.bottom + 30)
        //     .append("g")
        //     .attr("transform",
        //         "translate(" + this.margin.left + "," + this.margin.top + ")");
        //
        // const sth = chart.addCumulativeCurve(svg, characters);
        // console.log(sth);
        //
        // const area = chart.incrementalValueLine(characters);
        //
        // expect(sth).not.toBe(sth);
    });


});
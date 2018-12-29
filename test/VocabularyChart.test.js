// TODO Is there a better way to manage this d3 dependency across both the browser and in these tests?
import * as d3 from "d3";
global.d3 = d3;

import VocabularyChart from '../VocabularyChart.js';

test('Constructor sets initial values', () => {
    const chart = new VocabularyChart();
    expect(chart.getWidth()).toBe(600);
    expect(chart.getHeight()).toBe(270);
    expect(chart.getMargin()).toEqual({top: 30, right: 20, bottom: 30, left: 50});
});
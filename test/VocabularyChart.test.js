// TODO Is there a better way to manage this d3 dependency across both the browser and in these tests?
import * as d3 from "d3";
global.d3 = d3;

import VocabularyChart from '../VocabularyChart.js';
import {DEFAULT_WIDTH, DEFAULT_HEIGHT, DEFAULT_MARGIN, SPECTRAL_8_SCALE} from '../VocabularyChart.js';

describe('Constructor', function() {

    it('Sets initial values', () => {
        const chart = new VocabularyChart();
        expect(chart.getWidth()).toBe(DEFAULT_WIDTH);
        expect(chart.getHeight()).toBe(DEFAULT_HEIGHT);
        expect(chart.getMargin()).toEqual(DEFAULT_MARGIN);
        expect(chart.getColourScale()).toBe(SPECTRAL_8_SCALE);
    });

});
import VocabularyChart from './VocabularyChart.js';
import VIRIDIS_SCALE from './VocabularyChart.js';
const chart = new VocabularyChart().setMargin({top: 300, right: 20, bottom: 200, left: 50})
                                   .setHeight(800)
                                   .setWidth(1600)
    .setColourScale(VIRIDIS_SCALE);
chart.deriveXAxis(600, {top: 300, right: 20, bottom: 200, left: 50});

// Get the data
d3.json("http://localhost:8080/vocabulary").then((characters) => {
    return chart.draw(d3.select("body"), characters);
}).catch((error) => {
    return console.log(error);
});
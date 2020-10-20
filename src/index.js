import "ol/ol.css";

import Map from "ol/Map";
import View from "ol/View";
import Tile from "ol/layer/Tile";
import OSMSource from "ol/source/OSM";
import { MAP_PROJECTION, SEDAC_GEOSERVER_URL } from "./constants";
import { fromLonLat } from "ol/proj";
import IsBetween from "ol/src/format/filter/IsBetween";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import { createTileWmsSource } from "./modules/source-utils";
import { createWmsLayer } from "./modules/layer-utils";
import { equalTo, greaterThan, lessThan } from "ol/format/filter";
import { wfsSourceFromFilter } from "./modules/wfsRequests";
import registerToggleClick from "./modules/toggle-button-utils";
import { setupDateSelects, setupOperatorSelect } from "./modules/dom-setup";


const populationDataSource = createTileWmsSource(SEDAC_GEOSERVER_URL, MAP_PROJECTION, ['gpw-v4:gpw-v4-population-density-rev11_2015']);
const populationDataLayer = createWmsLayer(true, .50, populationDataSource);

const freshWaterDataSource = createTileWmsSource(SEDAC_GEOSERVER_URL, MAP_PROJECTION, ['sdei:sdei-trends-freshwater-availability-grace']);
const freshWaterDataLayer = createWmsLayer(true, .50, freshWaterDataSource);

const summerDaytimeTempMaxSource = createTileWmsSource(SEDAC_GEOSERVER_URL, MAP_PROJECTION, ['sdei:sdei-global-summer-lst-2013_day-max-global']);
const summerDaytimeTempMaxLayer = createWmsLayer(true, .50, summerDaytimeTempMaxSource);

let zikaLayer = new VectorLayer({
    source: new VectorSource(),
    style: new Style({
        stroke: new Stroke({
            color: 'white'
        }),
        fill: new Fill({
            color: 'red'
        })

    })
});

const map = new Map({
    target: "map",
    view: new View({
        zoom: 3,
        center: fromLonLat([-73.60791683207303, -15.595145902766419]),
    }),
    layers: [
        new Tile({ source: new OSMSource() }),
        populationDataLayer,
        freshWaterDataLayer,
        summerDaytimeTempMaxLayer,
        zikaLayer
    ],
});

// get initial report data
wfsSourceFromFilter(zikaLayer, equalTo("report_date", "2015-11-28"));

registerToggleClick(document.querySelector("#toggle-population-layer"), populationDataLayer);
registerToggleClick(document.querySelector("#toggle-freshwater-layer"), freshWaterDataLayer);
registerToggleClick(document.querySelector("#toggle-summermaxtemp-layer"), summerDaytimeTempMaxLayer);

const startDateSelect = document.querySelector("#start-date");
const endDateSelect = document.querySelector("#end-date");
const searchDateSelect = document.querySelector('#search-date');

setupDateSelects([
    startDateSelect,
    endDateSelect,
    searchDateSelect
]);

const dateSearchRangeButton = document.querySelector("#get-report-layer");

dateSearchRangeButton.addEventListener('click', () => {
    wfsSourceFromFilter(zikaLayer, new IsBetween("report_date", startDateSelect.value, endDateSelect.value));
})

const dateSearchButton = document.querySelector("#search-by-date-button");

dateSearchButton.addEventListener('click', () => {
    wfsSourceFromFilter(zikaLayer, equalTo("report_date", searchDateSelect.value));
})

const operatorSelect = document.querySelector("#search-operators");

setupOperatorSelect(operatorSelect);

const getCasesButton = document.querySelector("#get-cases");

getCasesButton.addEventListener("click", () => {
    let filterSelection;
    const numOfCases = document.querySelector("#cases").value;
    const selectOperator = operatorSelect.value;
    if(selectOperator === ">") {
        filterSelection = greaterThan("cases", numOfCases);
    }
    else if(selectOperator === "<") {
        filterSelection = lessThan("cases", numOfCases);
    }
    else if(selectOperator === "==") {
        filterSelection = equalTo("cases", numOfCases);
    }
    wfsSourceFromFilter(zikaLayer, filterSelection);
    
})

const clearButton = document.querySelector("#clear");

clearButton.addEventListener("click", () => {
    let newSource = new VectorSource();
    zikaLayer.setSource(newSource);
})
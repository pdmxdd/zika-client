// import in single expression
// import { Map, View } from "ol";

// import individually
import "ol/ol.css"; // import openlayers CSS file

import Map from "ol/Map";
import View from "ol/View";
import Tile from "ol/layer/Tile";
import OSMSource from "ol/source/OSM";
import { ImageWMS, Source, TileWMS, Vector } from "ol/source";
import { MAP_PROJECTION, SEDAC_GEOSERVER_URL } from "./constants";
import TileLayer from "ol/layer/Tile";
import { fromLonLat } from "ol/proj";
import { WFS, GeoJSON } from "ol/format";
import IsBetween from "ol/src/format/filter/IsBetween";
import TileSource from "ol/source/Tile";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import { validDates } from "./valid-dates";
import GreaterThan from "ol/format/filter/GreaterThan";
import EqualTo from "ol/format/filter/EqualTo";
import { operators } from "./search-operators";
import LessThan from "ol/format/filter/LessThan";

const map = new Map({
    target: "map",
    view: new View({
        zoom: 3,
        center: fromLonLat([-73.60791683207303, -15.595145902766419]),
    }),
    layers: [new Tile({ source: new OSMSource() })],
});

// creates a TileLayer from geoserver WMS request
const populationDataLayer = new TileLayer({
    visible: true,
    opacity: .50,
    source: new TileWMS({
        url: SEDAC_GEOSERVER_URL,
        projection: MAP_PROJECTION,
        params: { layers: ['gpw-v4:gpw-v4-population-density-rev11_2015'] }
    })
})

// creates a TileLayer from another geoserver WMS request (freshwater supply)
const freshWaterDataLayer = new TileLayer({
    visible: true,
    opacity: .50,
    source: new TileWMS({
        url: SEDAC_GEOSERVER_URL,
        projection: MAP_PROJECTION,
        params: {
            layers: ['sdei:sdei-trends-freshwater-availability-grace']
        }
    })
})

const cropLandsLayer = new TileLayer({
    visible: true,
    opacity: .50,
    source: new TileWMS({
        url: SEDAC_GEOSERVER_URL,
        projection: MAP_PROJECTION,
        params: {
            layers: [
                'gpw-v3:gpw-v3-population-density_2000'
            ]
        }
    })
})

const featureRequest = new WFS().writeGetFeature({
    srsName: MAP_PROJECTION,
    featureNS: 'https://zika.devops.launchcode.org',
    featurePrefix: 'zika',
    featureTypes: ['locations_with_cases_by_date'],
    outputFormat: 'application/json',
    filter: new EqualTo(
        "report_date",
        "2015-11-28"
    )
    // filter: new GreaterThan(
    //   "cases",
    //   500
    // )
    // filter: new IsBetween(
    //   "report_date",
    //   "2015-01-01",
    //   "2016-01-01"
    // ),
})

let vectorSource = new VectorSource();
let zikaLayer = new VectorLayer({
    source: vectorSource,
    style: new Style({
        stroke: new Stroke({
            color: 'white'
        }),
        fill: new Fill({
            color: 'red'
        })

    })
});

fetch('http://localhost:8080/geoserver/zika/wfs', {
    method: 'POST',
    body: new XMLSerializer().serializeToString(featureRequest)
}).then(resp => resp.json()).then(data => {
    vectorSource.addFeatures(new GeoJSON().readFeatures(data));
})

// creates a TileLayer from a geoserver WMS request
const summerDaytimeTempMaxLayer = new TileLayer({
    visible: true,
    opacity: .50,
    source: new TileWMS({
        url: SEDAC_GEOSERVER_URL,
        projection: MAP_PROJECTION,
        params: {
            layers: [
                'sdei:sdei-global-summer-lst-2013_day-max-global'
            ]
        }
    })
});

// adds the populationDataLayer to the map
map.addLayer(populationDataLayer);
map.addLayer(freshWaterDataLayer);
map.addLayer(summerDaytimeTempMaxLayer);
// map.addLayer(cropLandsLayer);
map.addLayer(zikaLayer);

// bind the toggle buttons to variables
const togglePopButton = document.getElementById('toggle-population-layer');

const toggleWaterButton = document.getElementById('toggle-freshwater-layer');

const toggleSummerMaxButton = document.getElementById('toggle-summermaxtemp-layer');

// register a new eventlistener to the toggle
togglePopButton.addEventListener('click', () => {
    populationDataLayer.setVisible(!populationDataLayer.getVisible());
})

toggleWaterButton.addEventListener('click', () => {
    freshWaterDataLayer.setVisible(
        !freshWaterDataLayer.getVisible()
    );
})

toggleSummerMaxButton.addEventListener('click', () => {
    summerDaytimeTempMaxLayer.setVisible(
        !summerDaytimeTempMaxLayer.getVisible()
    );
})

const dates = validDates;

dates.sort();

const startDateSelect = document.querySelector("#start-date");
const endDateSelect = document.querySelector("#end-date");
const searchDateSelect = document.querySelector('#search-date');

for (let i = 0; i < dates.length; i++) {
    const option = document.createElement("option");
    option.text = dates[i];
    startDateSelect.add(option);
    //   endDateSelect.add(option);
    //   searchDateSelect.add(option);
}

for (const date of dates) {
    const option = document.createElement("option");
    option.text = date;
    endDateSelect.add(option);
}

for (const date of dates) {
    const option = document.createElement("option");
    option.text = date;
    searchDateSelect.add(option);
}

const dateSearchRangeButton = document.querySelector("#get-report-layer");

dateSearchRangeButton.addEventListener('click', () => {
    const featureRequest = new WFS().writeGetFeature({
        srsName: MAP_PROJECTION,
        featureNS: 'https://zika.devops.launchcode.org',
        featurePrefix: 'zika',
        featureTypes: ['locations_with_cases_by_date'],
        outputFormat: 'application/json',
        // filter: new EqualTo(
        //   "report_date",
        //   "2015-11-28"
        // )
        // filter: new GreaterThan(
        //   "cases",
        //   500
        // )
        filter: new IsBetween(
            "report_date",
            startDateSelect.value,
            endDateSelect.value
        ),
    })
    fetch('http://localhost:8080/geoserver/zika/wfs', {
        method: 'POST',
        body: new XMLSerializer().serializeToString(featureRequest)
    }).then(resp => resp.json()).then(data => {
        let newSource = new VectorSource();
        newSource.addFeatures(new GeoJSON().readFeatures(data));
        zikaLayer.setSource(newSource);
    })

})

const dateSearchButton = document.querySelector("#search-by-date-button");

dateSearchButton.addEventListener('click', () => {
    const featureRequest = new WFS().writeGetFeature({
        srsName: MAP_PROJECTION,
        featureNS: 'https://zika.devops.launchcode.org',
        featurePrefix: 'zika',
        featureTypes: ['locations_with_cases_by_date'],
        outputFormat: 'application/json',
        // filter: new EqualTo(
        //   "report_date",
        //   "2015-11-28"
        // )
        // filter: new GreaterThan(
        //   "cases",
        //   500
        // )
        filter: new EqualTo(
            "report_date",
            searchDateSelect.value
        ),
    })

    fetch('http://localhost:8080/geoserver/zika/wfs', {
        method: 'POST',
        body: new XMLSerializer().serializeToString(featureRequest)
    }).then(resp => resp.json()).then(data => {
        let newSource = new VectorSource();
        newSource.addFeatures(new GeoJSON().readFeatures(data));
        zikaLayer.setSource(newSource);
    })
})

const operatorSelect = document.querySelector("#search-operators");

for (const operator in operators) {
    const option = document.createElement("option");
    option.text = operator;
    operatorSelect.add(option);
}

const getCasesButton = document.querySelector("#get-cases");

getCasesButton.addEventListener("click", () => {
    let filterSelection;
    if(operatorSelect.value === ">") {
        filterSelection = new GreaterThan(
            "cases",
            document.querySelector("#cases").value
        )
    }
    else if(operatorSelect.value === "<") {
        filterSelection = new LessThan(
            "cases",
            document.querySelector("#cases").value
        )
    }
    else if(operatorSelect.value === "==") {
        filterSelection = new EqualTo(
            "cases",
            document.querySelector('#cases').value
        )
    }
    const featureRequest = new WFS().writeGetFeature({
        srsName: MAP_PROJECTION,
        featureNS: 'https://zika.devops.launchcode.org',
        featurePrefix: 'zika',
        featureTypes: ['locations_with_cases_by_date'],
        outputFormat: 'application/json',
        // filter: new EqualTo(
        //   "report_date",
        //   "2015-11-28"
        // )
        // filter: new GreaterThan(
        //   "cases",
        //   document.querySelector("#cases").value
        // )
        // filter: new EqualTo(
        //     "report_date",
        //     searchDateSelect.value
        // ),
        filter: filterSelection
    })

    fetch('http://localhost:8080/geoserver/zika/wfs', {
        method: 'POST',
        body: new XMLSerializer().serializeToString(featureRequest)
    }).then(resp => resp.json()).then(data => {
        let newSource = new VectorSource();
        newSource.addFeatures(new GeoJSON().readFeatures(data));
        zikaLayer.setSource(newSource);
    })
})

const clearButton = document.querySelector("#clear");

clearButton.addEventListener("click", () => {
    let newSource = new VectorSource();
    zikaLayer.setSource(newSource);
})
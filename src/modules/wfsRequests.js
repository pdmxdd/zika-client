import { WFS, GeoJSON } from "ol/format";
import VectorSource from "ol/source/Vector";
import { MAP_PROJECTION } from "./constants";

const wfsFetch = async (featureRequest) => {
    const fetchResponse = await fetch('http://localhost:8080/geoserver/zika/wfs', {
        method: 'POST',
        body: new XMLSerializer().serializeToString(featureRequest)
    })
    const data = await fetchResponse.json();
    const vectorSource = new VectorSource();
    vectorSource.addFeatures(new GeoJSON().readFeatures(data));
    return vectorSource;

}

const wfsSourceFromFilter = async (layer, filter) => {
    const featureRequest = new WFS().writeGetFeature({
        srsName: MAP_PROJECTION,
        featureNS: 'https://zika.devops.launchcode.org',
        featurePrefix: 'zika',
        featureTypes: ['locations_with_cases_by_date'],
        outputFormat: 'application/json',
        filter: filter
    })

    const vectorSource = await wfsFetch(featureRequest);
    layer.setSource(vectorSource);
}

export { wfsSourceFromFilter };
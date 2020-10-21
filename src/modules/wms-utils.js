import TileLayer from "ol/layer/Tile"
import {TileWMS} from "ol/source";
import { MAP_PROJECTION, SEDAC_GEOSERVER_URL } from "./constants";

const createTileWmsSource = (layers) => {
    return new TileWMS({
        url: SEDAC_GEOSERVER_URL,
        projection: MAP_PROJECTION,
        params: {
            layers: layers
        }
    })
}

const createWmsLayer = (layers) => {
    const layerSource = createTileWmsSource(layers);
    return new TileLayer({
        visible: false,
        opacity: .4,
        source: layerSource
    })
}



export { createWmsLayer };
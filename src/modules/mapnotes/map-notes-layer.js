import VectorSource from "ol/src/source/Vector";

const { Vector } = require("ol/layer");
const { Draw, Snap } = require("ol/src/interaction");

/**
 * @typedef {Object} MapNotesLayerConfig
 * @property {import('ol/src/Map').default} map
 * @property {import('ol/layer/Vector').default} editableLayer
 */

const getEditableSource = (map, editableLayer) => {

    let editableSource = editableLayer && editableLayer.getSource();

    if (!editableSource) {
        editableSource = new VectorSource();
        const vectorLayer = new Vector();

        vectorLayer.setSource(editableSource);
        map.addLayer(vectorLayer);
    }

    return editableSource;
}

/**
 * Layer manager for capturing and loading MapNote features
 * @param {MapNotesLayerConfig} mapNotesLayerConfig
 */
function MapNotesLayer({ map, editableLayer }) { 

    const editableSource = getEditableSource(map, editableLayer);

    const snapInteraction = new Snap({source: editableSource}); // https://openlayers.org/workshop/en/vector/snap.html
    const drawInteraction = new Draw({source: editableSource, type: 'Polygon'}); // https://openlayers.org/workshop/en/vector/draw.html

    this.getDrawnFeatures = () => {
        return editableSource.getFeatures();
    }

    this.clearDrawnFeatures = () => {
        editableSource.clear();
    }

    this.renderFeatures = (featuresArray) => {
        // takes an array of features
        editableSource.addFeatures(featuresArray);
    }

    this.enableDrawing = () => {
        map.addInteraction(drawInteraction);
        map.addInteraction(snapInteraction);
    }

    this.disableDrawing = () => {
        map.removeInteraction(drawInteraction);
        map.removeInteraction(snapInteraction);
    }

}

export default MapNotesLayer;

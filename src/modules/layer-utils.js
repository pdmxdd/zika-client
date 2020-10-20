import TileLayer from "ol/layer/Tile";

const createWmsLayer = (visible, opacity, source) => {
    return new TileLayer({
        visible: visible,
        opacity: opacity,
        source: source
    })
}

const toggleLayerVisibility = (layer) => {
    layer.setVisible(!layer.getVisible());
}

export { createWmsLayer, toggleLayerVisibility };
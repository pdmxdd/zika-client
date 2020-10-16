const { TileWMS } = require("ol/source")

const createTileWmsSource = (url, projection, layers) => {
    return new TileWMS({
        url: url,
        projection: projection,
        params: {
            layers: layers
        }
    })
}

export { createTileWmsSource };
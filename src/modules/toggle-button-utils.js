import { toggleLayerVisibility } from "./layer-utils";

const registerToggleClick = (button, layer) => {
    button.addEventListener('click', () => {
        toggleLayerVisibility(layer)
    });
}

export default registerToggleClick;
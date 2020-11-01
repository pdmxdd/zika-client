import { GeoJSON } from "ol/format";
import { Draw, Snap } from "ol/src/interaction";

import Context from "../context";
import { DOMConstants, NoteSelector } from "../dom-components";

/**
 * Enables drawing features related to the MapNote note button handler of the active NewNoteForm component
 * - used when: the NewNoteForm draw features button is clicked
 *
 * behavior:
 * - enables the draw / snap interactions
 * - @see mapNotesLayer.enableDrawing
 * - @see mapNotesLayer.clearDrawnFeatures
 *
 * @param {Event} clickEvent click event of the save note button
 */
const drawFeatures = (clickEvent) => {
    const { mapNotesLayer } = Context.getContext();
    mapNotesLayer.enableDrawing();
};

/**
 * Saves a MapNote and its related features
 * - used when: the NewNoteForm save button is clicked
 *
 * behavior:
 * - sends a request to the MapNotes API to save the new MapNote
 * - sends a request to the MapNotes API to save the new MapNote's related features
 * - clears the title and body inputs of the form
 * - updates the NoteSelector by adding a NoteOption (@see NoteSelector.addNoteOption)
 *
 * MapNote payload: { title, body } (using the NewNoteForm title and body input values)
 * Features payload: GeoJSON feature collection (using the features from the editable source)
 *
 * @param {Event} clickEvent click event of the save note button
 */
const saveNote = async (clickEvent) => {
    const {mapNotesApi, mapNotesLayer} = Context.getContext()
    const titleInput = document.getElementById(DOMConstants.NEW_NOTE_FORM_IDs.titleInputId);
    const bodyInput = document.getElementById(DOMConstants.NEW_NOTE_FORM_IDs.bodyInputId);
    const partialNote = {title: titleInput.value, body: bodyInput.value};
    const mapNote = await mapNotesApi.createMapNote(partialNote);
    const features = mapNotesLayer.getDrawnFeatures();
    const geoFeatures = new GeoJSON().writeFeatures(features);
    mapNotesApi.putFeaturesToMapNote(mapNote.id, geoFeatures);
    titleInput.value = "";
    bodyInput.value = "";
    const noteSelector = document.getElementById(DOMConstants.NOTES_MANAGER_IDs.noteSelectorId);
    NoteSelector.addNoteOption(noteSelector, mapNote);
    mapNotesLayer.clearDrawnFeatures();
    mapNotesLayer.disableDrawing();

};

export { saveNote, drawFeatures };

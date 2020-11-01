import { click } from "ol/events/condition";
import { GeoJSON } from "ol/format";

import Context from "../context";
import { DOMConstants, NoteSelector } from "../dom-components";

/**
 * Loads the features associated with the active MapNote
 * - used when: the active NoteViewer load features button is clicked
 *
 * behavior:
 * - clears the features of the editable source
 * - adds the associated features to the editable source
 *
 * @param {Event} clickEvent click event of the load features button
 */
const loadFeatures = async (clickEvent) => {
  const { mapNotesLayer, mapNotesApi } = Context.getContext();
  // the MapNote's ID is available as the load features button's (event target) value attribute
  mapNotesLayer.clearDrawnFeatures();
  const mapNoteId = clickEvent.target.value;
  const features = await mapNotesApi.getMapNoteFeatures(mapNoteId);
  const geoFeatures = new GeoJSON().readFeatures(features);
  mapNotesLayer.renderFeatures(geoFeatures);
  
};

/**
 * Delete note button handler of the active NoteViewer component
 * - used when: the active NoteViewer delete note button is clicked
 *
 * behavior:
 * - sends a request to the MapNotes API to delete the active MapNote
 * - updates the NoteSelector by removing the corresponding NoteOption (@see NoteSelector.removeNoteOption)
 *
 *
 * @param {Event} clickEvent click event of the delete note button
 *
 */
const deleteNote = async (clickEvent) => {
  const { activeNoteTarget, mapNotesApi, mapNotesLayer } = Context.getContext();
  // the MapNote's ID is available as the delete button's (event target) value attribute
  const mapNoteId = clickEvent.target.value;
  mapNotesApi.deleteMapNote(mapNoteId);
  activeNoteTarget.removeChild(activeNoteTarget.firstChild);
  mapNotesLayer.clearDrawnFeatures();
  NoteSelector.removeNoteOption(document.getElementById(DOMConstants.NOTES_MANAGER_IDs.noteSelectorId), mapNoteId)
  
};

export { deleteNote, loadFeatures };

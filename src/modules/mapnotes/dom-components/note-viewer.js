import { deleteNote, loadFeatures } from "../event-handlers";
import { NOTE_VIEWER_IDs } from "./dom-constants";
import {
  buildHeader,
  buildParagraph,
  buildButton,
  buildForm,
} from "./generic-components";

/**
 * produces the following HTML:
<form id="map-notes-note-viewer">
  <h2 id="map-notes-note-viewer-title">Note Title</h2>
  <p id="map-notes-note-viewer-body">Note Body</p>
  <button id="map-notes-note-viewer-load-features">Load Features</button>
  <button id="map-notes-note-viewer-delete">Delete Note</button>
</form>
 */

const {
  noteViewerId,
  titleHeaderId,
  bodyParagraphId,
  deleteNoteButtonId,
  loadFeaturesButtonId,
} = NOTE_VIEWER_IDs;

/**
 * Builds a NoteViewer component for allowing the user to interact with a particular MapNote
 * - created when: a user selects a MapNote from the NoteSelector component
 * - rendered in: the ActiveNote container (replacing anything in the container)
 *
 * @listens Event click event on the delete note button
 * @listens Event click event on the load features button
 *
 * @param {{ id: Number, title: String, body: String, }} mapNote the selected note to view
 * @param {Object} noteViewerConfig
 * @param {(clickEvent: Event) => void} noteViewerConfig.loadFeaturesButtonClickHandler event handler for when the load features button is clicked
 * @param {(clickEvent: Event) => void} noteViewerConfig.deleteNoteButtonClickHandler event handler for when the delete note button is clicked
 * @returns {HTMLFormElement} a NoteViewer component
 *
 * @example
 *
 * ```js
 * const noteViewer = buildNoteViewer(userSelectedMapNote, {
 *  loadFeaturesButtonClickHandler: (clickEvent) => { ... },
 *  deleteNoteButtonClickHandler: (clickEvent) => { ... },
 * });
 * ```
 */
const buildNoteViewer = (mapNote, noteViewerConfig) => {
  const {
    deleteNoteButtonClickHandler,
    loadFeaturesButtonClickHandler,
  } = noteViewerConfig;

  const noteTitleHeader = buildHeader({
    headerText: mapNote.title,
    id: NOTE_VIEWER_IDs.titleHeaderId,
  });

  const noteBodyParagraph = buildParagraph({
    paragraphText: mapNote.body,
    id: NOTE_VIEWER_IDs.bodyParagraphId,
  }); // BONUS: allow markdown (SANITIZED!!) + rendering

  const deleteNoteButton = buildButton({
    buttonText: "Delete Note",
    id: NOTE_VIEWER_IDs.deleteNoteButtonId,
  });

  const loadFeaturesButton = buildButton({
    buttonText: "Load Features",
    id: NOTE_VIEWER_IDs.loadFeaturesButtonId,
  });

  // set the id as the value attribute of the delete button using the MapNote's id
  // set the id as the value attribute of the load features button using the MapNote's id
  // simplifies downstream usage in the button handlers
  deleteNoteButton.setAttribute("value", mapNote.id);
  loadFeaturesButton.setAttribute("value", mapNote.id);

  // register event listener for the click event using the deleteNoteButtonClickHandler function
  // register event listener for the click event using the loadFeaturesButtonClickHandler function
  deleteNoteButton.addEventListener("click", deleteNoteButtonClickHandler);
  loadFeaturesButton.addEventListener("click", loadFeaturesButtonClickHandler);

  const noteViewer = buildForm({
    id: NOTE_VIEWER_IDs.noteViewerId,
    children: [
      noteTitleHeader,
      noteBodyParagraph,
      loadFeaturesButton,
      deleteNoteButton,
    ],
  });

  return noteViewer;
};

export { buildNoteViewer };

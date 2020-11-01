import Context from "../context";
import { deleteNote, loadFeatures } from "./note-viewer-handlers";
import { DOMConstants, NoteSelector, NoteViewer } from "../dom-components";

/**
 * Renders a NewNoteForm component
 * - used when: the create note button of the NotesManager component is clicked
 *
 * behavior:
 * - ActiveNote is empty: appends the NewNoteForm component to the ActiveNote container
 * - ActiveNote is not empty: replaces the ActiveNote child with the NewNoteForm component
 *
 * @param {Event} clickEvent click event of the create note button
 */
const renderNewNoteForm = (clickEvent) => {
  const { activeNoteTarget, newNoteForm } = Context.getContext();
  const noteSelector = document.getElementById(DOMConstants.NOTES_MANAGER_IDs.noteSelectorId);
  noteSelector.selectedIndex = 0;
  if(!activeNoteTarget.firstChild) {
    activeNoteTarget.appendChild(newNoteForm);
  }
  else {
    activeNoteTarget.replaceChild(newNoteForm, activeNoteTarget.firstChild);
  }
};

/**
 * Renders a NoteViewer component for the selected MapNote
 * - used when: a MapNote is selected in the NoteSelector component
 *
 * behavior:
 * - sends a request to the MapNotes API to retrieve the data for the selected MapNote
 * - creates a NoteViewer component (@see NoteViewer.buildNoteViewer) using the MapNote retrieved from the API
 * - ActiveNote is empty: appends the NoteViewer component to the ActiveNote container
 * - ActiveNote is not empty: replaces the ActiveNote child element with the NoteViewer component
 *
 * @param {Event} changeEvent change event of the NoteSelector component's underlying <selector> element
 */
const renderNoteViewer = async (changeEvent) => {
  const { activeNoteTarget, mapNotesApi } = Context.getContext();

  const mapNoteId = changeEvent.target.value;
  const mapNote = await mapNotesApi.getMapNote(mapNoteId);
  const noteViewer = NoteViewer.buildNoteViewer(mapNote, {
    loadFeaturesButtonClickHandler: loadFeatures,
    deleteNoteButtonClickHandler: deleteNote
  })
  if(!activeNoteTarget.firstChild) {
    activeNoteTarget.appendChild(noteViewer);
  }
  else {
    activeNoteTarget.replaceChild(noteViewer, activeNoteTarget.firstChild);
  }
};

export { renderNoteViewer, renderNewNoteForm };

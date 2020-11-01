import { NEW_NOTE_FORM_IDs } from "./dom-constants";
import {
  buildForm,
  buildButton,
  buildInputWithLabel,
} from "./generic-components";

/**
 * produces the following HTML
<form id="mapnotes-new-note-form">
  <label for="mapnotes-new-note-form-title">
    Note Title
    <input type="text" id="mapnotes-new-note-form-title" />
  </label>

  <label for="mapnotes-new-note-form-body">
    Note Body
    <textarea id="mapnotes-new-note-form-body" />
  </label>

  <button id="mapnotes-new-note-form-draw-features">Draw Features</button>
  <button id="mapnotes-new-note-form-save">Save Note</button>
</form>
 */

const {
  bodyInputId,
  titleInputId,
  newNoteFormId,
  saveNoteButtonId,
  drawFeaturesButtonId,
} = NEW_NOTE_FORM_IDs;

/**
 * Builds a NewNoteForm component for a user to create a new MapNote
 * - created when: a user clicks the create note button in the NotesManager component
 * - rendered in: the ActiveNote container (replacing anything in the container)
 *
 * @listens Event click event on the save note button
 * @listens Event click event on the draw features button
 *
 * @param {Object} newNoteFormConfig
 * @param {(clickEvent: Event) => void} newNoteFormConfig.saveNoteButtonClickHandler event handler for when the save note button is clicked
 * @param {(clickEvent: Event) => void} newNoteFormConfig.drawFeaturesButtonClickHandler event handler for when the draw features button is clicked
 * @returns {HTMLFormElement} a NewNoteForm component
 *
 * @example
 *
 * ```js
 * const newNoteForm = buildNewNoteForm({
 *  saveNoteButtonClickHandler: (clickEvent) => { ... },
 *  drawFeaturesButtonClickHandler: (clickEvent) => { ... },
 * });
 * ```
 */
const buildNewNoteForm = (newNoteFormConfig) => {
  const {
    saveNoteButtonClickHandler,
    drawFeaturesButtonClickHandler,
  } = newNoteFormConfig;

  const noteBodyInput = buildInputWithLabel({
    labelText: "Details",
    inputType: "textarea",
    id: NEW_NOTE_FORM_IDs.bodyInputId,
  });

  const noteTitleInput = buildInputWithLabel({
    inputType: "text",
    labelText: "Title",
    id: NEW_NOTE_FORM_IDs.titleInputId,
  });

  const saveNoteButton = buildButton({
    id: NEW_NOTE_FORM_IDs.saveNoteButtonId,
    buttonText: "Save",
  });

  const drawFeaturesButton = buildButton({
    buttonText: "Draw Features",
    id: NEW_NOTE_FORM_IDs.drawFeaturesButtonId,
  });

  // register event listener for the click event using the saveNoteButtonClickHandler function
  // register event listener for the click event using the drawFeaturesButtonClickHandler function
  saveNoteButton.addEventListener("click", saveNoteButtonClickHandler);
  drawFeaturesButton.addEventListener("click", drawFeaturesButtonClickHandler);

  const newNoteForm = buildForm({
    id: NEW_NOTE_FORM_IDs.newNoteFormId,
    children: [
      noteTitleInput,
      noteBodyInput,
      drawFeaturesButton,
      saveNoteButton,
    ],
  });
  newNoteForm.addEventListener("submit", (event) => event.preventDefault());

  return newNoteForm;
};

export { buildNewNoteForm };

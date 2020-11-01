import { NoteSelector } from "..";
import { NOTES_MANAGER_IDs } from "../dom-constants";
import { buildOption, buildSelect } from "../generic-components";

/**
 * produces the following HTML:
<select id="mapnotes-notes-manager-note-selector">
  <option value="">Select a Note</option>
  <option value="namespace-{mapNote.id}">{mapNote.title}</option>
  ...
</select>
 */

const { noteSelectorId } = NOTES_MANAGER_IDs;

/**
 * @typedef {{ id: number, title: string, body: string}} MapNote
 */

/**
 * Builds a unique id attribute value (namespaced with the "map-note" prefix) for a NoteSelector option
 * - used when creating or selecting a specific NoteSelector option
 *
 * @param {number} mapNoteId id property of the MapNote the option represents
 * @returns {string} the unique id attribute value for a NoteOption component
 */
const buildNoteOptionId = (mapNoteId) => `mapnote-option-${mapNoteId}`;

/**
 * Builds a NoteOption component to represent a MapNote
 * - @see {buildNoteOptionId} is used to build the id attribute of the option element
 *
 * @param {MapNote} mapNote the MapNote to represent as an option
 * @returns {HTMLOptionElement} a NoteOption component
 */
const buildNoteOption = (mapNote) =>
  buildOption({
    value: mapNote.id,
    optionText: mapNote.title,
    id: buildNoteOptionId(mapNote.id),
  });

/**
 *  Builds and appends a new NoteOption to represent the MapNote
 * - used when: a new MapNote has been saved
 * - rendered in: the NoteSelector component
 *
 * @param {HTMLSelectElement} noteSelector the target NoteSelector component
 * @param {MapNote} mapNote the MapNote source
 */
const addNoteOption = (noteSelector, mapNote) => {
  const noteOption = buildNoteOption(mapNote);

  noteSelector.append(noteOption);
};

/**
 * Converts an array of MapNotes into NoteOptions and appends them to the NoteSelector
 * - used when: individually converting and appending each MapNote is inconvenient
 * - rendered in: the NoteSelector component
 *
 * @param {HTMLSelectElement} noteSelector the target NoteSelector component
 * @param {MapNote[]} mapNotes an array of MapNote objects
 */
const addNoteOptions = (noteSelector, mapNotes) => {
  const noteOptions = mapNotes.map(buildNoteOption);

  noteSelector.append(...noteOptions);
};

/**
 * Removes a NoteOption component from the NoteSelector using a deleted MapItem's id
 * - used when: a MapItem has been deleted
 *
 * - @see buildNoteOptionId is used to select the NoteOption by its value attribute
 *
 * @param {HTMLSelectElement} noteSelector the target NoteSelector component
 * @param {number} mapNoteId the id of the deleted MapItem
 */
const removeNoteOption = (noteSelector, mapNoteId) => {
  // select the option by finding the NoteOption child (<option> element) with id attribute
  // note we use querySelector on the parent (noteSelector) to narrow our search only to its children
  // as opposed to document.querySelector which refers to ALL the children of the HTML document itself

  // use the buildNoteOptionId to ensure consistency
  const noteOption = noteSelector.querySelector(
    `#${buildNoteOptionId(mapNoteId)}`
  );
  if (!noteOption) return; // exit early if the NoteOption is not found

  noteSelector.removeChild(noteOption);
};

/**
 * Builds a NoteSelector component
 * - created when: DOM content has loaded
 * - rendered in: the NotesManager component (as an argument to @see buildNotesManager)
 *
 * @listens Event <select> element change event
 *
 * @param {MapNote[]} mapNotes array of MapNotes requested from the MapNotes API
 * @param {Object} noteSelectorConfig
 * @param {(changeEvent: Event) => void} noteSelectorConfig.noteSelectHandler change event handler for when a user selects a MapNote to view
 *
 * @example
 *
 * ```js
 * const noteSelector = buildNoteSelector(mapNotesFromApi, {
 *   noteSelectHandler: (changeEvent) => { ... },
 * });
 * ```
 */
const buildNoteSelector = (mapNotes = [], noteSelectorConfig) => {
  const { noteSelectHandler } = noteSelectorConfig;

  const noteSelector = buildSelect({ id: NOTES_MANAGER_IDs.noteSelectorId });

  // populate the note selector
  noteSelector.append(
    buildOption({ value: "", optionText: "Select a MapNote" })
  );
  addNoteOptions(noteSelector, mapNotes);

  // register event listener for the change event using the noteSelectHandler function
  noteSelector.addEventListener("change", noteSelectHandler);

  return noteSelector;
};

export { addNoteOption, addNoteOptions, removeNoteOption, buildNoteSelector };

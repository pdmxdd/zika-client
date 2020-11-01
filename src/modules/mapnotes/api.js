export const DEFAULT_MAP_NOTES_API_URL = 'http://localhost:8008';

function MapNotesAPI(mapNotesApiUrl) {

  const notesPath = DEFAULT_MAP_NOTES_API_URL + "/notes";
  const noteByIdPathBuilder = (noteId) => {
    return notesPath + "/" + noteId;
  }
  const featuresByIdPathBuilder = (noteId) => {
    return noteByIdPathBuilder(noteId) + "/features";
  }

  this.getMapNotes = async () => {
    return fetch(notesPath).then(response => response.json());

  }

  this.getMapNote = async (noteId) => {
    return fetch(noteByIdPathBuilder(noteId)).then(response => response.json());
  }

  this.createMapNote = async (note) => {
    const jsonNote = JSON.stringify(note);
    return fetch(notesPath, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: jsonNote
    }).then(response => response.json());
  }

  this.deleteMapNote = async (noteId) => {
    fetch(noteByIdPathBuilder(noteId), {
      method: "DELETE"
    });
  }

  this.putFeaturesToMapNote = async (noteId, geoJsonFeatures) => {
    fetch(featuresByIdPathBuilder(noteId), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: geoJsonFeatures
    });
  }

  this.getMapNoteFeatures = async (noteId) => {
    return fetch(featuresByIdPathBuilder(noteId)).then(response => response.json());
  }

 }

export default MapNotesAPI;

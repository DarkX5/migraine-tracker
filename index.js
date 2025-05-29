const LOCAL_STORAGE_KEY = 'clusterMigraineLog';

const form = document.getElementById('migraineForm');
const inputs = form.elements;

// Precompletare data si ora curenta la load
window.addEventListener('DOMContentLoaded', () => {
  const now = new Date();
  inputs.date.value = now.toISOString().slice(0, 10);
  inputs.time.value = now.toTimeString().slice(0, 5);
});

form.addEventListener('submit', e => {
  e.preventDefault();

  const entry = {
    date: inputs.date.value,
    time: inputs.time.value,
    severity: inputs.severity.value,
    duration: inputs.duration.value,
    exercise: inputs.exercise.value,
    exerciseDetails: inputs.exerciseDetails.value,
    trigger: inputs.trigger.value,
    notes: inputs.notes.value,
    verapamil: inputs.verapamil.value || "6",
    medrol: inputs.medrol.value || "0",
    sumatriptan: inputs.severity.value, // Nr pastile sumatriptan
  };

  if (!entry.date || !entry.time || entry.severity === '') {
    return alert('Completează minim data, ora și numărul de pastile Sumatriptan.');
  }

  const saved = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
  saved.unshift(entry);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(saved));

  form.reset();

  // Re-prepopulate date and time
  const now = new Date();
  inputs.date.value = now.toISOString().slice(0, 10);
  inputs.time.value = now.toTimeString().slice(0, 5);
});

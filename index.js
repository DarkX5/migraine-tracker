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
    sumatriptan: inputs.severity.value, // redundant, dar explicit
  };

  if (!entry.date || !entry.time || entry.severity === '') {
    return alert('Completează minim data, ora și numărul de pastile Sumatriptan.');
  }

  const saved = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
  saved.unshift(entry);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(saved));

  alert("Episod adăugat cu succes!");
  exportData(); // Export automat după adăugare

  // Resetare formular și re-populare cu valorile implicite
  form.reset();

  // Re-prepopulate cu valori default
  const now = new Date();
  inputs.date.value = now.toISOString().slice(0, 10);
  inputs.time.value = now.toTimeString().slice(0, 5);
  inputs.severity.value = 1;
  inputs.duration.value = 15;
  inputs.exercise.value = "Da";
  inputs.verapamil.value = 6;
  inputs.medrol.value = 0;
});

const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importInput = document.getElementById('importInput');

// Exportare manuală sau automată
function exportData() {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) return alert('Nu există date de exportat.');
  
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `migrene_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// La click pe buton export
exportBtn.addEventListener('click', exportData);

// Importare din fișier
importBtn.addEventListener('click', () => importInput.click());

importInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      if (!Array.isArray(imported)) throw new Error('Fișierul nu este valid.');

      if (!confirm('Acest import va înlocui toate datele existente. Continuăm?')) return;

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(imported));
      alert('Import realizat cu succes!');
    } catch (err) {
      alert('Fișier invalid sau corupt.');
    }
  };
  reader.readAsText(file);
});

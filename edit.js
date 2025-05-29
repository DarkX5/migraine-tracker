const LOCAL_STORAGE_KEY = 'clusterMigraineLog';

const dateFilterInput = document.getElementById('dateFilter');
const episodesContainer = document.getElementById('episodesContainer');

let entries = [];

const todayStr = new Date().toISOString().split('T')[0];
dateFilterInput.value = todayStr;

function loadEntries() {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  entries = saved ? JSON.parse(saved) : [];
}

function saveEntries() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));
}

function renderEpisodes() {
  const selectedDate = dateFilterInput.value;
  episodesContainer.innerHTML = '';

  const filteredEntries = entries.filter(e => e.date === selectedDate);

  if (filteredEntries.length === 0) {
    episodesContainer.innerHTML = `<p>Nu există episoade pentru această zi.</p>`;
    return;
  }

  filteredEntries.forEach((episode, index) => {
    const div = document.createElement('div');
    div.style.border = '1px solid #ccc';
    div.style.padding = '10px';
    div.style.marginBottom = '10px';

    // Creez inputuri pentru fiecare camp
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.value = episode.date || '';
    dateInput.style.marginBottom = '4px';

    const timeInput = document.createElement('input');
    timeInput.type = 'time';
    timeInput.value = episode.time || '';
    timeInput.style.marginBottom = '4px';

    const severityInput = document.createElement('input');
    severityInput.type = 'number';
    severityInput.min = '0';
    severityInput.max = '5';
    severityInput.value = episode.severity ?? 0;
    severityInput.placeholder = 'Pastile Sumatripan (0-5)';
    severityInput.style.marginBottom = '4px';

    const durationInput = document.createElement('input');
    durationInput.type = 'number';
    durationInput.min = '0';
    durationInput.value = episode.duration || '';
    durationInput.placeholder = 'Durată atac (minute)';
    durationInput.style.marginBottom = '4px';

    const exerciseSelect = document.createElement('select');
    ['Da', 'Nu'].forEach(opt => {
      const option = document.createElement('option');
      option.value = opt;
      option.textContent = opt;
      if (episode.exercise === opt) option.selected = true;
      exerciseSelect.appendChild(option);
    });
    exerciseSelect.style.marginBottom = '4px';

    const exerciseDetailsInput = document.createElement('input');
    exerciseDetailsInput.type = 'text';
    exerciseDetailsInput.value = episode.exerciseDetails || '';
    exerciseDetailsInput.placeholder = 'Detalii exercițiu';
    exerciseDetailsInput.style.marginBottom = '4px';

    const triggerInput = document.createElement('input');
    triggerInput.type = 'text';
    triggerInput.value = episode.trigger || '';
    triggerInput.placeholder = 'Factor declanșator';
    triggerInput.style.marginBottom = '4px';

    const verapamilInput = document.createElement('input');
    verapamilInput.type = 'number';
    verapamilInput.min = '0';
    verapamilInput.max = '10';
    verapamilInput.value = episode.verapamil ?? 6;
    verapamilInput.placeholder = 'Pastile Verapamil (0-10)';
    verapamilInput.style.marginBottom = '4px';

    const medrolInput = document.createElement('input');
    medrolInput.type = 'number';
    medrolInput.min = '0';
    medrolInput.max = '10';
    medrolInput.value = episode.medrol ?? 0;
    medrolInput.placeholder = 'Pastile Medrol (0-10)';
    medrolInput.style.marginBottom = '4px';

    const notesTextarea = document.createElement('textarea');
    notesTextarea.value = episode.notes || '';
    notesTextarea.placeholder = 'Observații';
    notesTextarea.style.marginBottom = '4px';
    notesTextarea.rows = 3;
    notesTextarea.style.width = '100%';

    div.appendChild(dateInput);
    div.appendChild(timeInput);
    div.appendChild(severityInput);
    div.appendChild(durationInput);
    div.appendChild(exerciseSelect);
    div.appendChild(exerciseDetailsInput);
    div.appendChild(triggerInput);
    div.appendChild(verapamilInput);
    div.appendChild(medrolInput);
    div.appendChild(notesTextarea);

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.style.marginRight = '10px';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Șterge';

    div.appendChild(saveBtn);
    div.appendChild(deleteBtn);

    saveBtn.addEventListener('click', () => {
      // Validari minimale
      if (!dateInput.value) return alert('Data este obligatorie');
      if (!timeInput.value) return alert('Ora este obligatorie');

      episode.date = dateInput.value;
      episode.time = timeInput.value;
      episode.severity = Number(severityInput.value) || 0;
      episode.duration = durationInput.value;
      episode.exercise = exerciseSelect.value;
      episode.exerciseDetails = exerciseDetailsInput.value;
      episode.trigger = triggerInput.value;
      episode.verapamil = Number(verapamilInput.value) || 6;
      episode.medrol = Number(medrolInput.value) || 0;
      episode.notes = notesTextarea.value;

      saveEntries();
      renderEpisodes();
    });

    deleteBtn.addEventListener('click', () => {
      if (confirm('Ești sigur că vrei să ștergi acest episod?')) {
        const globalIndex = entries.indexOf(episode);
        if (globalIndex !== -1) {
          entries.splice(globalIndex, 1);
          saveEntries();
          renderEpisodes();
        }
      }
    });

    episodesContainer.appendChild(div);
  });
}

dateFilterInput.addEventListener('change', renderEpisodes);

loadEntries();
renderEpisodes();

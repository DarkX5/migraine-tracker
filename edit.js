// edit.js

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

    const contentDiv = document.createElement('div');
    const controlsDiv = document.createElement('div');

    function renderViewMode() {
      contentDiv.innerHTML = `
        <strong>${episode.date} ${episode.time}</strong><br>
        Severitate: ${episode.severity}<br>
        Durată: ${episode.duration} min<br>
        Pastile Sumatripan: ${episode.severity}<br>
        Exerciții: ${episode.exercise} (${episode.exerciseDetails})<br>
        Factor declanșator: ${episode.trigger}<br>
        Pastile Verapamil: ${episode.verapamil ?? 6}<br>
        Pastile Medrol: ${episode.medrol ?? 0}<br>
        Observații: ${episode.notes || ''}
      `;
      controlsDiv.innerHTML = '';

      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.classList.add('edit-btn');
      editBtn.addEventListener('click', () => renderEditMode());
      controlsDiv.appendChild(editBtn);

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Șterge';
      deleteBtn.classList.add('delete-btn');
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
      controlsDiv.appendChild(deleteBtn);
    }

    function renderEditMode() {
      contentDiv.innerHTML = '';
      controlsDiv.innerHTML = '';

      const dateInput = document.createElement('input');
      dateInput.type = 'date';
      dateInput.value = episode.date;

      const timeInput = document.createElement('input');
      timeInput.type = 'time';
      timeInput.value = episode.time;

      const severityInput = document.createElement('input');
      severityInput.type = 'number';
      severityInput.min = '0';
      severityInput.max = '5';
      severityInput.value = episode.severity ?? 0;

      const durationInput = document.createElement('input');
      durationInput.type = 'number';
      durationInput.value = episode.duration;

      const exerciseSelect = document.createElement('select');
      ['Da', 'Nu'].forEach(opt => {
        const option = document.createElement('option');
        option.value = opt;
        option.textContent = opt;
        if (episode.exercise === opt) option.selected = true;
        exerciseSelect.appendChild(option);
      });

      const exerciseDetailsInput = document.createElement('input');
      exerciseDetailsInput.type = 'text';
      exerciseDetailsInput.value = episode.exerciseDetails || '';

      const triggerInput = document.createElement('input');
      triggerInput.type = 'text';
      triggerInput.value = episode.trigger || '';

      const verapamilInput = document.createElement('input');
      verapamilInput.type = 'number';
      verapamilInput.min = '0';
      verapamilInput.max = '10';
      verapamilInput.value = episode.verapamil ?? 6;

      const medrolInput = document.createElement('input');
      medrolInput.type = 'number';
      medrolInput.min = '0';
      medrolInput.max = '10';
      medrolInput.value = episode.medrol ?? 0;

      const notesTextarea = document.createElement('textarea');
      notesTextarea.value = episode.notes || '';

      contentDiv.append(
        dateInput,
        timeInput,
        severityInput,
        durationInput,
        exerciseSelect,
        exerciseDetailsInput,
        triggerInput,
        verapamilInput,
        medrolInput,
        notesTextarea
      );

      const saveBtn = document.createElement('button');
      saveBtn.textContent = 'Save';
      saveBtn.classList.add('save-btn');
      saveBtn.addEventListener('click', () => {
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

      controlsDiv.appendChild(saveBtn);
    }

    renderViewMode();

    div.appendChild(contentDiv);
    div.appendChild(controlsDiv);
    episodesContainer.appendChild(div);
  });
}

dateFilterInput.addEventListener('change', renderEpisodes);

loadEntries();
renderEpisodes();

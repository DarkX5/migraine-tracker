const LOCAL_STORAGE_KEY = 'clusterMigraineLog';
const entriesContainer = document.getElementById('entriesContainer');
const paginationContainer = document.getElementById('pagination');

let entries = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');

const ITEMS_PER_PAGE = 5;
let currentPage = 1;

function renderPage(page = 1) {
  entriesContainer.innerHTML = '';
  paginationContainer.innerHTML = '';

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageItems = entries.slice(start, end);

  pageItems.forEach((e, idx) => {
    const globalIdx = start + idx;

    const card = document.createElement('div');
    card.className = 'card p-3';

    card.innerHTML = `
      <form data-index="${globalIdx}" class="edit-entry space-y-2">
        <div><strong>${e.date} ${e.time}</strong></div>
        <label>Număr pastile Sumatriptan (0-5): <input name="severity" type="number" min="0" max="5" value="${e.severity}" required></label>
        <label>Durată atac (minute): <input name="duration" type="number" value="${e.duration || ''}"></label>
        <label>Exerciții:
          <select name="exercise">
            <option value="Da" ${e.exercise === 'Da' ? 'selected' : ''}>Da</option>
            <option value="Nu" ${e.exercise === 'Nu' ? 'selected' : ''}>Nu</option>
          </select>
        </label>
        <label>Detalii exercițiu: <input name="exerciseDetails" type="text" value="${e.exerciseDetails || ''}"></label>
        <label>Factor declanșator: <input name="trigger" type="text" value="${e.trigger || ''}"></label>
        <label>Observații: <textarea name="notes">${e.notes || ''}</textarea></label>
        <label>Verapamil (0-10): <input name="verapamil" type="number" min="0" max="10" value="${e.verapamil || '6'}"></label>
        <label>Medrol (0-10): <input name="medrol" type="number" min="0" max="10" value="${e.medrol || '0'}"></label>
        <button type="submit">Salvează</button>
        <button type="button" class="delete-btn">Șterge</button>
      </form>
    `;

    entriesContainer.appendChild(card);

    const form = card.querySelector('form');
    form.addEventListener('submit', ev => {
      ev.preventDefault();
      const idx = parseInt(form.getAttribute('data-index'));
      const formData = new FormData(form);

      entries[idx] = {
        ...entries[idx],
        severity: formData.get('severity'),
        duration: formData.get('duration'),
        exercise: formData.get('exercise'),
        exerciseDetails: formData.get('exerciseDetails'),
        trigger: formData.get('trigger'),
        notes: formData.get('notes'),
        verapamil: formData.get('verapamil'),
        medrol: formData.get('medrol'),
        sumatriptan: formData.get('severity')
      };

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));
      alert('Episod salvat!');
    });

    form.querySelector('.delete-btn').addEventListener('click', () => {
      if (confirm('Ești sigur că vrei să ștergi acest episod?')) {
        const idx = parseInt(form.getAttribute('data-index'));
        entries.splice(idx, 1);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));
        renderPage(currentPage);
      }
    });
  });

  // Render pagination
  const totalPages = Math.ceil(entries.length / ITEMS_PER_PAGE);
  for(let i=1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.disabled = (i === page);
    btn.addEventListener('click', () => {
      currentPage = i;
      renderPage(currentPage);
    });
    paginationContainer.appendChild(btn);
  }
}

renderPage(currentPage);

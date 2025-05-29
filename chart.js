const LOCAL_STORAGE_KEY = 'clusterMigraineLog';

const ctx = document.getElementById('migraineChart').getContext('2d');
const entries = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');

// Sortare după dată și oră
entries.sort((a,b) => {
  const dtA = new Date(`${a.date}T${a.time}`);
  const dtB = new Date(`${b.date}T${b.time}`);
  return dtA - dtB;
});

const labels = entries.map(e => `${e.date} ${e.time}`);

const sumatriptanData = entries.map(e => Number(e.sumatriptan) || 0);
const verapamilData = entries.map(e => Number(e.verapamil) || 0);
const medrolData = entries.map(e => Number(e.medrol) || 0);

const migraineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels,
    datasets: [
      {
        label: 'Sumatriptan (pastile)',
        data: sumatriptanData,
        borderColor: 'red',
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        fill: false,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Verapamil (pastile)',
        data: verapamilData,
        borderColor: 'goldenrod',
        backgroundColor: 'rgba(218, 165, 32, 0.1)',
        fill: false,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Medrol (pastile)',
        data: medrolData,
        borderColor: 'darkorange',
        backgroundColor: 'rgba(255, 140, 0, 0.1)',
        fill: false,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  },
  options: {
    responsive: true,
    interaction: {
      mode: 'nearest',
      intersect: false,
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 1
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        enabled: true
      }
    }
  }
});

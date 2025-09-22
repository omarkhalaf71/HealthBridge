// JavaScript for responsive sidebar
document.addEventListener('DOMContentLoaded', function () {
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const mainContent = document.querySelector('.main-content');

  // Toggle sidebar on button click
  sidebarToggle.addEventListener('click', function () {
    sidebar.classList.toggle('active');
  });

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', function (event) {
    if (
      window.innerWidth <= 992 &&
      !sidebar.contains(event.target) &&
      !sidebarToggle.contains(event.target) &&
      sidebar.classList.contains('active')
    ) {
      sidebar.classList.remove('active');
    }
  });

  // Sample data for demonstration
  const prescriptionsData = [
    {
      id: '#RX-1025',
      hospital: 'King Faisal Hospital',
      doctor: 'Dr. Ahmed Al-Saadi',
      patient: 'Mohammed Al-Otaibi',
      date: '03/15/2023',
      status: 'pending',
    },
    {
      id: '#RX-1024',
      hospital: 'Specialized Medical Center',
      doctor: 'Dr. Sara Al-Fahad',
      patient: 'Fatima Al-Harbi',
      date: '03/15/2023',
      status: 'processing',
    },
    {
      id: '#RX-1023',
      hospital: 'Dr. Sulaiman Fakeeh Hospital',
      doctor: 'Dr. Khalid Al-Zahrani',
      patient: 'Abdullah Al-Qahtani',
      date: '03/14/2023',
      status: 'ready',
    },
  ];

  // Filter prescriptions based on selected filters
  function filterPrescriptions() {
    const statusFilter = document.getElementById('statusFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    const searchText = document
      .getElementById('prescriptionSearch')
      .value.toLowerCase();

    const rows = document.querySelectorAll('#prescriptionsTable tbody tr');

    rows.forEach((row) => {
      const status = row.querySelector('.status').textContent.toLowerCase();
      const date = row.cells[4].textContent;
      const rowText = row.textContent.toLowerCase();

      let showRow = true;

      if (statusFilter !== 'all') {
        if (statusFilter === 'pending' && !status.includes('pending'))
          showRow = false;
        if (statusFilter === 'processing' && !status.includes('processing'))
          showRow = false;
        if (statusFilter === 'ready' && !status.includes('ready'))
          showRow = false;
      }

      if (dateFilter && date !== dateFilter) showRow = false;

      if (searchText && !rowText.includes(searchText)) showRow = false;

      row.style.display = showRow ? '' : 'none';
    });
  }

  // Add event listeners to filter elements
  document
    .getElementById('statusFilter')
    .addEventListener('change', filterPrescriptions);
  document
    .getElementById('dateFilter')
    .addEventListener('change', filterPrescriptions);
  document
    .getElementById('prescriptionSearch')
    .addEventListener('input', filterPrescriptions);
  document
    .querySelector('.search-btn')
    .addEventListener('click', filterPrescriptions);

  // Table sorting functionality
  document.querySelectorAll('th[data-sort]').forEach((header) => {
    header.addEventListener('click', function () {
      const column = this.getAttribute('data-sort');
      const table = this.closest('table');
      const tbody = table.querySelector('tbody');
      const rows = Array.from(tbody.querySelectorAll('tr'));

      // Determine sort direction
      let direction = 'asc';
      if (this.classList.contains('sorted-asc')) {
        direction = 'desc';
      }

      // Remove existing sort indicators
      table.querySelectorAll('th').forEach((th) => {
        th.classList.remove('sorted-asc', 'sorted-desc');
      });

      // Add sort indicator to current column
      this.classList.add(direction === 'asc' ? 'sorted-asc' : 'sorted-desc');

      // Sort rows
      rows.sort((a, b) => {
        const aValue =
          a.cells[Array.from(this.parentElement.cells).indexOf(this)]
            .textContent;
        const bValue =
          b.cells[Array.from(this.parentElement.cells).indexOf(this)]
            .textContent;

        if (direction === 'asc') {
          return aValue.localeCompare(bValue, undefined, {
            numeric: true,
            sensitivity: 'base',
          });
        } else {
          return bValue.localeCompare(aValue, undefined, {
            numeric: true,
            sensitivity: 'base',
          });
        }
      });

      // Remove existing rows
      while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
      }

      // Add sorted rows
      rows.forEach((row) => tbody.appendChild(row));
    });
  });

  // Button interactions
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button) => {
    button.addEventListener('click', function () {
      const action = this.textContent;

      if (action.includes('Ready')) {
        this.textContent = 'Awaiting Delivery';
        this.classList.remove('btn-success');
        this.classList.add('btn-warning');
        this.innerHTML = '<i class="fas fa-truck"></i> Awaiting Delivery';
      } else if (action.includes('Confirm Delivery')) {
        this.textContent = 'Delivered';
        this.classList.remove('btn-warning');
        this.classList.add('btn-success');
        this.innerHTML = '<i class="fas fa-check-circle"></i> Delivered';
      } else if (action.includes('Logout')) {
        alert('You have been logged out successfully');
      }
    });
  });
});

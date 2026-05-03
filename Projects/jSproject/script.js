// State Management
let records = [];

// DOM Elements
const recordForm = document.getElementById('record-form');
const recordsBody = document.getElementById('records-body');
const clearAllBtn = document.getElementById('clear-all');

// Stats Elements
const totalLitersEl = document.querySelector('#stat-total-liters .value');
const totalRevenueEl = document.querySelector('#stat-total-revenue .value');
const totalCustomersEl = document.querySelector('#stat-total-customers .value');

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
    updateTime();
    setInterval(updateTime, 1000);
    await loadData();
    updateUI();
});

// Time Component
function updateTime() {
    const timeEl = document.getElementById('current-time');
    if (timeEl) {
        const now = new Date();
        timeEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
}

// Load Data from API
async function loadData() {
    try {
        const response = await fetch('/api/records');
        if (response.ok) {
            records = await response.json();
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Live Rate Calculation
const milkTypeInput = document.getElementById('milk-type');
const fatInput = document.getElementById('fat');
const rateInput = document.getElementById('rate');

function calculateRate() {
    const type = milkTypeInput.value;
    const fat = parseFloat(fatInput.value) || 0;
    
    let rate = 0;
    if (type === 'cow') {
        rate = fat * 9; // ₹9 per fat point for Cow
    } else {
        rate = fat * 11; // ₹11 per fat point for Buffalo
    }
    
    rateInput.value = rate.toFixed(1);
}

// Initial rate calculation on load
window.addEventListener('load', calculateRate);

// Update rate when type or fat changes
milkTypeInput.addEventListener('change', () => {
    // Set default fat for the type
    if (milkTypeInput.value === 'cow') {
        fatInput.value = 3.5;
    } else {
        fatInput.value = 6.0;
    }
    calculateRate();
});

fatInput.addEventListener('input', calculateRate);

recordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const farmerName = document.getElementById('farmer-name').value;
    const milkType = document.getElementById('milk-type').value;
    const fat = parseFloat(document.getElementById('fat').value);
    const quantity = parseFloat(document.getElementById('quantity').value);
    const rate = parseFloat(document.getElementById('rate').value);

    if (farmerName && quantity > 0 && fat > 0 && rate > 0) {
        const recordData = {
            farmer: farmerName,
            type: milkType.charAt(0).toUpperCase() + milkType.slice(1),
            fat: fat,
            quantity: quantity,
            rate: rate,
            amount: quantity * rate
        };

        try {
            const response = await fetch('/api/records', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(recordData)
            });

            if (response.ok) {
                const newRecord = await response.json();
                records.push(newRecord);
                updateUI();
                recordForm.reset();
                
                // Success Animation or feedback can be added here
                const submitBtn = document.getElementById('submit-btn');
                submitBtn.textContent = 'Added!';
                submitBtn.style.background = 'var(--success-color)';
                setTimeout(() => {
                    submitBtn.textContent = 'Add Collection';
                    submitBtn.style.background = 'var(--primary-gradient)';
                }, 1500);
            }
        } catch (error) {
            console.error('Error saving record:', error);
            alert('Failed to save record. Ensure server is running.');
        }
    }
});

// Update UI
function updateUI() {
    renderTable();
    calculateStats();
}

// Render Table Rows
function renderTable() {
    recordsBody.innerHTML = '';

    // Sort by ID descending (newest first)
    const sortedRecords = [...records].reverse();

    sortedRecords.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.date}</td>
            <td>${record.farmer}</td>
            <td style="color: ${record.type === 'Cow' ? '#4a90e2' : '#8b5cf6'}">${record.type}</td>
            <td>${(record.fat || 0).toFixed(1)}%</td>
            <td>${record.quantity} L</td>
            <td>₹${record.amount.toFixed(2)}</td>
            <td><button class="btn-delete" onclick="deleteRecord(${record.id})">Delete</button></td>
        `;
        recordsBody.appendChild(row);
    });

    if (records.length === 0) {
        recordsBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">No records found. Add one to get started!</td></tr>';
    }
}

// Calculate Stats
function calculateStats() {
    const totalLiters = records.reduce((sum, rec) => sum + rec.quantity, 0);
    const totalRevenue = records.reduce((sum, rec) => sum + rec.amount, 0);
    const uniqueFarmers = new Set(records.map(rec => rec.farmer)).size;

    totalLitersEl.textContent = totalLiters.toFixed(1);
    totalRevenueEl.textContent = `₹${Math.round(totalRevenue)}`;
    totalCustomersEl.textContent = uniqueFarmers;
}

// Delete Record
window.deleteRecord = async (id) => {
    try {
        const response = await fetch(`/api/records/${id}`, { method: 'DELETE' });
        if (response.ok) {
            records = records.filter(rec => rec.id !== id);
            updateUI();
        }
    } catch (error) {
        console.error('Error deleting record:', error);
    }
};

// Clear All Records
clearAllBtn.addEventListener('click', async () => {
    if (confirm('Are you sure you want to clear all records?')) {
        try {
            const response = await fetch('/api/records', { method: 'DELETE' });
            if (response.ok) {
                records = [];
                updateUI();
            }
        } catch (error) {
            console.error('Error clearing records:', error);
        }
    }
});

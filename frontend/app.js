let costChart = null;
let radarChart = null;

// Performans degeri guncelleme
document.getElementById('sub-perf').addEventListener('input', (e) => {
    document.getElementById('sub-perf-val').innerText = e.target.value;
});

document.getElementById('emp-perf').addEventListener('input', (e) => {
    document.getElementById('emp-perf-val').innerText = e.target.value;
});

// Is kalemleri ekleme mantigi
function setupTagInput(containerId) {
    const container = document.getElementById(containerId);
    const input = container.querySelector('input');
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && input.value.trim() !== '') {
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.innerText = input.value.trim();
            tag.onclick = () => tag.remove();
            container.insertBefore(tag, input);
            input.value = '';
        }
    });
}

setupTagInput('sub-tasks');
setupTagInput('emp-tasks');

document.getElementById('analyze-btn').addEventListener('click', async () => {
    const data = {
        sub_monthly_cost: parseFloat(document.getElementById('sub-cost').value),
        sub_annual_overhead: parseFloat(document.getElementById('sub-overhead').value),
        sub_performance: parseFloat(document.getElementById('sub-perf').value),
        sub_tasks: Array.from(document.querySelectorAll('#sub-tasks .tag')).map(t => t.innerText),
        
        emp_monthly_salary: parseFloat(document.getElementById('emp-salary').value),
        emp_benefits_cost: parseFloat(document.getElementById('emp-benefits').value),
        emp_hardware_cost: 2000, // Fixed assumption for hardware
        emp_performance: parseFloat(document.getElementById('emp-perf').value),
        emp_tasks: Array.from(document.querySelectorAll('#emp-tasks .tag')).map(t => t.innerText),
        emp_training_cost: 1000 // Fixed assumption for training
    };

    try {
        const response = await fetch('http://localhost:8004/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        renderResults(result);
    } catch (error) {
        console.error('Analysis failed:', error);
        alert('Backend bağlantısı kurulamadı. Lütfen sunucunun çalıştığından emin olun.');
    }
});

function renderResults(data) {
    const resultsSection = document.getElementById('results');
    resultsSection.classList.remove('hidden');

    // Recommendation
    document.getElementById('recommendation-text').innerText = data.recommendation;

    // Maliyet/Performans Oranı Bar
    const subCP = data.performance_analysis.subscription_cost_per_perf;
    const empCP = data.performance_analysis.employee_cost_per_perf;
    const totalCP = subCP + empCP;
    
    document.getElementById('sub-ratio-bar').style.width = `${(subCP / totalCP) * 100}%`;
    document.getElementById('emp-ratio-bar').style.width = `${(empCP / totalCP) * 100}%`;

    // Charts
    renderCostChart(data.projections);
    renderRadarChart(data.performance_analysis);
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function renderCostChart(projections) {
    const ctx = document.getElementById('costChart').getContext('2d');
    
    if (costChart) costChart.destroy();
    
    costChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: projections.months.map(m => `${m}. Ay`),
            datasets: [
                {
                    label: 'Abonelik (Kümülatif)',
                    data: projections.subscription_cumulative,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Çalışan (Kümülatif)',
                    data: projections.employee_cumulative,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' }
            }
        }
    });
}

function renderRadarChart(perf) {
    const ctx = document.getElementById('radarChart').getContext('2d');
    
    if (radarChart) radarChart.destroy();
    
    radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Maliyet Etkinliği', 'Yetenek Kapsamı', 'Performans', 'Süreklilik', 'Ölçeklenebilirlik'],
            datasets: [
                {
                    label: 'Abonelik',
                    data: [100 - (perf.subscription_cost_per_perf / 50), perf.subscription_coverage, 60, 40, 90],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)'
                },
                {
                    label: 'Çalışan',
                    data: [100 - (perf.employee_cost_per_perf / 50), perf.employee_coverage, 90, 80, 60],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.2)'
                }
            ]
        },
        options: {
            elements: {
                line: { borderWidth: 3 }
            }
        }
    });
}

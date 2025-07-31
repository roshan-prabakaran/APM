// Vitals monitoring functionality
document.addEventListener('DOMContentLoaded', function() {
    const startScanBtn = document.getElementById('start-scan');
    const scanAgainBtn = document.getElementById('scan-again');
    const proceedAnalysisBtn = document.getElementById('proceed-analysis');
    
    startScanBtn?.addEventListener('click', startVitalsScan);
    scanAgainBtn?.addEventListener('click', resetVitals);
    proceedAnalysisBtn?.addEventListener('click', () => navigateTo('/diagnosis'));
    
    function startVitalsScan() {
        // Switch to scanning state
        document.getElementById('ready-state')?.classList.remove('active');
        document.getElementById('scanning-state')?.classList.add('active');
        
        // Animate progress
        animateProgress('scan-progress', 5000);
        
        // Make API call
        makeRequest('/api/scan_vitals', {
            method: 'POST'
        })
        .then(data => {
            if (data.success) {
                displayVitals(data.vitals);
            }
        })
        .catch(error => {
            console.error('Vitals scan error:', error);
            alert('Error scanning vitals. Please try again.');
            resetVitals();
        });
    }
    
    function displayVitals(vitals) {
        // Switch to results state
        document.getElementById('scanning-state')?.classList.remove('active');
        document.getElementById('results-state')?.classList.add('active');
        
        // Update vital signs display
        document.getElementById('heart-rate').textContent = `${vitals.heart_rate} BPM`;
        document.getElementById('blood-pressure').textContent = `${vitals.blood_pressure} mmHg`;
        document.getElementById('temperature').textContent = `${vitals.temperature}°F`;
        document.getElementById('oxygen-saturation').textContent = `${vitals.oxygen_saturation}%`;
    }
    
    function resetVitals() {
        // Reset to ready state
        document.querySelector('.vitals-state.active')?.classList.remove('active');
        document.getElementById('ready-state')?.classList.add('active');
        
        // Reset progress
        updateProgress('scan-progress', 0);
    }
    
    // Declare variables
    function navigateTo(url) {
        window.location.href = url;
    }
    
    function animateProgress(elementId, duration) {
        const element = document.getElementById(elementId);
        let start = null;
        const width = 0;
        const end = 100;
        
        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percentage = Math.min((progress / duration) * 100, end);
            element.style.width = percentage + '%';
            if (percentage < end) {
                window.requestAnimationFrame(step);
            }
        }
        
        window.requestAnimationFrame(step);
    }
    
    function makeRequest(url, options) {
        return fetch(url, options)
            .then(response => response.json());
    }
    
    function updateProgress(elementId, width) {
        const element = document.getElementById(elementId);
        element.style.width = width + '%';
    }
});

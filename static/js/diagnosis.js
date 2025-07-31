// AI Diagnosis functionality
document.addEventListener('DOMContentLoaded', function() {
    const startAnalysisBtn = document.getElementById('start-analysis');
    const newAnalysisBtn = document.getElementById('new-analysis');
    const getMedicationsBtn = document.getElementById('get-medications');
    
    // Declare variables
    const navigateTo = (url) => {
        window.location.href = url;
    };
    
    const animateProgress = (elementId, duration) => {
        const element = document.getElementById(elementId);
        if (element) {
            let start = null;
            const step = (timestamp) => {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const percentage = Math.min((progress / duration) * 100, 100);
                element.style.width = percentage + '%';
                if (progress < duration) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }
    };
    
    const makeRequest = async (url, options) => {
        const response = await fetch(url, options);
        return await response.json();
    };
    
    const updateProgress = (elementId, value) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.width = value + '%';
        }
    };
    
    startAnalysisBtn?.addEventListener('click', startAIDiagnosis);
    newAnalysisBtn?.addEventListener('click', resetDiagnosis);
    getMedicationsBtn?.addEventListener('click', () => navigateTo('/medication'));
    
    function startAIDiagnosis() {
        // Switch to analyzing state
        document.getElementById('ready-state')?.classList.remove('active');
        document.getElementById('analyzing-state')?.classList.add('active');
        
        // Animate progress
        animateProgress('analysis-progress', 4000);
        
        // Make API call
        makeRequest('/api/ai_diagnosis', {
            method: 'POST'
        })
        .then(data => {
            if (data.success) {
                displayDiagnosis(data.diagnosis);
            }
        })
        .catch(error => {
            console.error('AI diagnosis error:', error);
            alert('Error performing AI diagnosis. Please try again.');
            resetDiagnosis();
        });
    }
    
    function displayDiagnosis(diagnosis) {
        // Switch to results state
        document.getElementById('analyzing-state')?.classList.remove('active');
        document.getElementById('results-state')?.classList.add('active');
        
        // Update diagnosis display
        document.getElementById('confidence-badge').textContent = `${diagnosis.confidence}% Confidence`;
        document.getElementById('condition-name').textContent = diagnosis.condition;
        
        // Update recommendations
        const recommendationsList = document.getElementById('recommendations-list');
        recommendationsList.innerHTML = '';
        diagnosis.recommendations.forEach(rec => {
            const li = document.createElement('li');
            li.textContent = rec;
            recommendationsList.appendChild(li);
        });
        
        // Update medications
        const medicationsList = document.getElementById('medications-list');
        medicationsList.innerHTML = '';
        diagnosis.medications.forEach(med => {
            const div = document.createElement('div');
            div.className = 'medication-item';
            div.innerHTML = `
                <div class="medication-name">${med.name}</div>
                <div class="medication-dosage">${med.dosage}</div>
            `;
            medicationsList.appendChild(div);
        });
        
        // Update follow-up
        document.getElementById('follow-up-text').textContent = diagnosis.follow_up;
    }
    
    function resetDiagnosis() {
        // Reset to ready state
        document.querySelector('.diagnosis-state.active')?.classList.remove('active');
        document.getElementById('ready-state')?.classList.add('active');
        
        // Reset progress
        updateProgress('analysis-progress', 0);
    }
});

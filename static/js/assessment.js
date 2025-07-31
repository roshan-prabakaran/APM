// Assessment page functionality
document.addEventListener('DOMContentLoaded', function() {
    let currentStep = 1;
    let selectedSymptoms = [];
    let selectedSeverity = '';
    
    // Function declarations
    function updateProgress(elementId, percentage) {
        const progressElement = document.getElementById(elementId);
        if (progressElement) {
            progressElement.style.width = `${percentage}%`;
        }
    }
    
    function showLoading(message) {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.textContent = message;
            loadingElement.style.display = 'block';
        }
    }
    
    function makeRequest(url, options) {
        return fetch(url, options)
            .then(response => response.json());
    }
    
    function navigateTo(path) {
        window.location.href = path;
    }
    
    function hideLoading() {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }
    
    // Symptom selection
    const symptomBtns = document.querySelectorAll('.symptom-btn');
    symptomBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const symptom = this.dataset.symptom;
            
            if (this.classList.contains('selected')) {
                this.classList.remove('selected');
                selectedSymptoms = selectedSymptoms.filter(s => s !== symptom);
            } else {
                this.classList.add('selected');
                selectedSymptoms.push(symptom);
            }
            
            updateContinueButton('continue-step-1', selectedSymptoms.length > 0);
        });
    });
    
    // Severity selection
    const severityBtns = document.querySelectorAll('.severity-btn');
    severityBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            severityBtns.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            selectedSeverity = this.dataset.severity;
            updateContinueButton('continue-step-2', true);
        });
    });
    
    // Step navigation
    document.getElementById('continue-step-1')?.addEventListener('click', () => goToStep(2));
    document.getElementById('back-step-2')?.addEventListener('click', () => goToStep(1));
    document.getElementById('continue-step-2')?.addEventListener('click', () => goToStep(3));
    document.getElementById('back-step-3')?.addEventListener('click', () => goToStep(2));
    document.getElementById('proceed-vitals')?.addEventListener('click', proceedToVitals);
    
    function goToStep(step) {
        // Hide current step
        document.querySelector('.assessment-step.active')?.classList.remove('active');
        
        // Show new step
        document.getElementById(`step-${step}`)?.classList.add('active');
        
        // Update step indicator
        document.getElementById('current-step').textContent = step;
        
        // Update progress
        updateProgress('progress-fill', (step / 3) * 100);
        
        currentStep = step;
        
        // Update summary if on step 3
        if (step === 3) {
            updateSummary();
        }
    }
    
    function updateSummary() {
        document.getElementById('selected-symptoms').textContent = selectedSymptoms.join(', ');
        document.getElementById('selected-severity').textContent = selectedSeverity;
    }
    
    function updateContinueButton(buttonId, enabled) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = !enabled;
        }
    }
    
    function proceedToVitals() {
        showLoading('Submitting assessment...');
        
        makeRequest('/api/submit_assessment', {
            method: 'POST',
            body: JSON.stringify({
                symptoms: selectedSymptoms,
                severity: selectedSeverity
            })
        })
        .then(data => {
            if (data.success) {
                navigateTo('/vitals');
            }
        })
        .catch(error => {
            console.error('Assessment submission error:', error);
            alert('Error submitting assessment. Please try again.');
        })
        .finally(() => {
            hideLoading();
        });
    }
});

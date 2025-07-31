// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Update time display
    updateTime();
    setInterval(updateTime, 1000);
    
    // Voice activation
    const voiceBtn = document.getElementById('voice-btn');
    const voiceIndicator = document.getElementById('voice-indicator');
    
    if (voiceBtn) {
        voiceBtn.addEventListener('click', toggleVoiceActivation);
    }
});

function updateTime() {
    const now = new Date();
    const timeElement = document.getElementById('current-time');
    const dateElement = document.getElementById('current-date');
    
    if (timeElement) {
        timeElement.textContent = now.toLocaleTimeString();
    }
    
    if (dateElement) {
        dateElement.textContent = now.toLocaleDateString();
    }
}

function toggleVoiceActivation() {
    const voiceBtn = document.getElementById('voice-btn');
    const voiceIndicator = document.getElementById('voice-indicator');
    
    if (voiceBtn.classList.contains('listening')) {
        // Stop listening
        voiceBtn.classList.remove('listening');
        voiceIndicator.classList.add('hidden');
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i><span>Voice</span>';
    } else {
        // Start listening
        voiceBtn.classList.add('listening');
        voiceIndicator.classList.remove('hidden');
        voiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i><span>Stop</span>';
        
        // Simulate voice recognition
        fetch('/api/voice_command', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(`Voice command recognized: "${data.command}"`);
                if (data.action === 'navigate_to_assessment') {
                    navigateTo('/assessment');
                }
            }
        })
        .catch(error => {
            console.error('Voice recognition error:', error);
        })
        .finally(() => {
            // Stop listening after processing
            setTimeout(() => {
                voiceBtn.classList.remove('listening');
                voiceIndicator.classList.add('hidden');
                voiceBtn.innerHTML = '<i class="fas fa-microphone"></i><span>Voice</span>';
            }, 3000);
        });
    }
}

function navigateTo(path) {
    window.location.href = path;
}

function showLoading(text = 'Processing...') {
    const overlay = document.getElementById('loading-overlay');
    const loadingText = document.getElementById('loading-text');
    
    if (overlay && loadingText) {
        loadingText.textContent = text;
        overlay.classList.remove('hidden');
    }
}

function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

// Utility functions
function makeRequest(url, options = {}) {
    return fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    }).then(response => response.json());
}

function updateProgress(elementId, percentage) {
    const progressFill = document.getElementById(elementId);
    if (progressFill) {
        progressFill.style.width = percentage + '%';
    }
}

function animateProgress(elementId, duration = 3000) {
    let progress = 0;
    const interval = setInterval(() => {
        progress += 2;
        updateProgress(elementId, progress);
        
        if (progress >= 100) {
            clearInterval(interval);
        }
    }, duration / 50);
}

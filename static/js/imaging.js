// Injury imaging functionality
document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('image-input');
    const uploadBtn = document.getElementById('upload-btn');
    const uploadArea = document.getElementById('upload-area');
    const uploadDifferentBtn = document.getElementById('upload-different');
    const analyzeImageBtn = document.getElementById('analyze-image');
    const newAssessmentBtn = document.getElementById('new-assessment');
    const getSuppliesBtn = document.getElementById('get-supplies');
    
    // Declare variables
    const navigateTo = (url) => window.location.href = url;
    const animateProgress = (elementId, duration) => {
        const element = document.getElementById(elementId);
        let start = null;
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            element.style.width = Math.min(progress / duration * 100, 100) + '%';
            if (progress < duration) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };
    const makeRequest = (url, options) => fetch(url, options).then(response => response.json());
    const updateProgress = (elementId, value) => {
        const element = document.getElementById(elementId);
        element.style.width = value + '%';
    };
    
    uploadBtn?.addEventListener('click', () => imageInput?.click());
    uploadArea?.addEventListener('click', () => imageInput?.click());
    imageInput?.addEventListener('change', handleImageUpload);
    uploadDifferentBtn?.addEventListener('click', resetUpload);
    analyzeImageBtn?.addEventListener('click', analyzeImage);
    newAssessmentBtn?.addEventListener('click', resetUpload);
    getSuppliesBtn?.addEventListener('click', () => navigateTo('/medication'));
    
    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // Switch to preview state
                document.getElementById('upload-state')?.classList.remove('active');
                document.getElementById('preview-state')?.classList.add('active');
                
                // Display image
                document.getElementById('preview-image').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }
    
    function analyzeImage() {
        // Switch to analyzing state
        document.getElementById('preview-state')?.classList.remove('active');
        document.getElementById('analyzing-state')?.classList.add('active');
        
        // Animate progress
        animateProgress('analysis-progress', 3000);
        
        // Make API call
        makeRequest('/api/analyze_image', {
            method: 'POST'
        })
        .then(data => {
            if (data.success) {
                displayAnalysis(data.analysis);
            }
        })
        .catch(error => {
            console.error('Image analysis error:', error);
            alert('Error analyzing image. Please try again.');
            resetUpload();
        });
    }
    
    function displayAnalysis(analysis) {
        // Switch to results state
        document.getElementById('analyzing-state')?.classList.remove('active');
        document.getElementById('results-state')?.classList.add('active');
        
        // Update analysis display
        document.getElementById('injury-type').textContent = analysis.injury_type;
        document.getElementById('severity-level').textContent = analysis.severity;
        
        // Update recommendations
        const recommendationsList = document.getElementById('treatment-recommendations');
        recommendationsList.innerHTML = '';
        analysis.recommendations.forEach(rec => {
            const li = document.createElement('li');
            li.textContent = rec;
            recommendationsList.appendChild(li);
        });
        
        // Update supplies
        const suppliesGrid = document.getElementById('required-supplies');
        suppliesGrid.innerHTML = '';
        analysis.supplies.forEach(supply => {
            const div = document.createElement('div');
            div.className = 'supply-item';
            div.innerHTML = `
                <i class="fas fa-first-aid"></i>
                <span>${supply}</span>
            `;
            suppliesGrid.appendChild(div);
        });
        
        // Update urgency
        document.getElementById('urgency-assessment').textContent = analysis.urgency;
    }
    
    function resetUpload() {
        // Reset to upload state
        document.querySelector('.imaging-state.active')?.classList.remove('active');
        document.getElementById('upload-state')?.classList.add('active');
        
        // Clear image input
        if (imageInput) {
            imageInput.value = '';
        }
        
        // Reset progress
        updateProgress('analysis-progress', 0);
    }
});

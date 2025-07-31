// Profile page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            
            // Remove active class from all tabs and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(`${tabName}-tab`)?.classList.add('active');
        });
    });
    
    // Setting toggles
    const settingToggles = document.querySelectorAll('.setting-toggle');
    settingToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            // Cycle through states: disabled -> enabled -> active -> disabled
            if (this.classList.contains('disabled')) {
                this.classList.remove('disabled');
                this.classList.add('enabled');
                this.textContent = 'Enabled';
            } else if (this.classList.contains('enabled')) {
                this.classList.remove('enabled');
                this.classList.add('active');
                this.textContent = 'Active';
            } else if (this.classList.contains('active')) {
                this.classList.remove('active');
                this.classList.add('disabled');
                this.textContent = 'Disabled';
            }
        });
    });
});

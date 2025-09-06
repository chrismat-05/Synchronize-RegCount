class EventRegistrationDashboard {
    constructor() {
        this.eventsGrid = document.getElementById('events-grid');
        this.errorMessage = document.getElementById('error-message');
        this.loading = document.getElementById('loading');
        this.currentData = {};
        
        this.init();
    }
    
    init() {
        this.fetchData();
        
        // Auto-refresh every 30 seconds
        setInterval(() => {
            this.fetchData();
        }, 30000);
    }
    
    async fetchData() {
        try {
            // Check if API URL is configured
            if (!CONFIG.API_URL || CONFIG.API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_API_URL_HERE') {
                throw new Error('API URL not configured. Please set your Google Apps Script URL in config.js');
            }
            
            const response = await fetch(CONFIG.API_URL);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.hideError();
            this.hideLoading();
            this.updateEvents(data);
            
        } catch (error) {
            console.error('Failed to fetch data:', error);
            this.showError();
            this.hideLoading();
            
            // If this is the first load and we have no data, show demo data
            if (Object.keys(this.currentData).length === 0) {
                this.loadDemoData();
            }
        }
    }
    
    loadDemoData() {
        console.log('Loading demo data...');
        const demoData = {
            "IT Manager": 8,
            "CodeSustain": 12,
            "Web Weavers": 5,
            "Anime Quiz": 20,
            "TechJar": 7,
            "Illustra": 10,
            "Sensorize": 6,
            "Chronoscape": 4
        };
        this.updateEvents(demoData);
    }
    
    updateEvents(data) {
        this.currentData = data;
        this.renderEvents();
    }
    
    renderEvents() {
        // Clear existing events
        this.eventsGrid.innerHTML = '';
        
        // Create event cards
        Object.entries(this.currentData).forEach(([eventName, count], index) => {
            const eventCard = this.createEventCard(eventName, count, index);
            this.eventsGrid.appendChild(eventCard);
        });
    }
    
    createEventCard(eventName, count, index) {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        const nameElement = document.createElement('div');
        nameElement.className = 'event-name';
        nameElement.textContent = eventName;
        
        const countElement = document.createElement('div');
        countElement.className = 'registration-count';
        countElement.textContent = count;
        
        card.appendChild(nameElement);
        card.appendChild(countElement);
        
        // Add click handler for visual feedback
        card.addEventListener('click', () => {
            this.animateCard(card);
        });
        
        return card;
    }
    
    animateCard(card) {
        const countElement = card.querySelector('.registration-count');
        countElement.classList.add('count-animation');
        
        setTimeout(() => {
            countElement.classList.remove('count-animation');
        }, 500);
    }
    
    showError() {
        this.errorMessage.classList.remove('hidden');
    }
    
    hideError() {
        this.errorMessage.classList.add('hidden');
    }
    
    hideLoading() {
        this.loading.style.display = 'none';
    }
    
    // Method to manually refresh data (can be called from console)
    refresh() {
        this.fetchData();
    }
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new EventRegistrationDashboard();
    
    // Make dashboard available globally for debugging
    window.dashboard = dashboard;
});

// Service Worker registration for better caching (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
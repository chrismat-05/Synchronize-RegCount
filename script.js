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
        setInterval(() => {
            this.fetchData();
        }, 30000);
    }
    async fetchData() {
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            if (!apiUrl) {
                throw new Error('API URL not configured. Please set VITE_API_URL in your environment variables.');
            }
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.hideError();
            this.hideLoading();
            this.updateEvents(data);
            this.updateLastUpdated();
        } catch (error) {
            console.error('Failed to fetch data:', error);
            this.showError();
            this.hideLoading();
            if (Object.keys(this.currentData).length === 0) {
                this.loadDemoData();
                this.updateLastUpdated();
            }
        }
    }

    updateLastUpdated() {
        const el = document.getElementById('last-updated');
        if (!el) return;
        const now = new Date();
        const pad = n => n.toString().padStart(2, '0');
        const formatted = `${pad(now.getDate())}-${pad(now.getMonth()+1)}-${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        el.textContent = `Last updated at ${formatted}`;
    }
    loadDemoData() {
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
        this.eventsGrid.innerHTML = '';
        Object.entries(this.currentData).forEach(([eventName, count], index) => {
            const eventCard = this.createEventCard(eventName, count, index);
            this.eventsGrid.appendChild(eventCard);
        });
    }
    createEventCard(eventName, count, index) {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.style.animationDelay = `${index * 0.1}s`;
        const logoElement = document.createElement('img');
        logoElement.className = 'event-logo';
        logoElement.alt = eventName + ' Logo';
        logoElement.src = this.getEventLogoPath(eventName);
        card.appendChild(logoElement);
        const nameElement = document.createElement('div');
        nameElement.className = 'event-name';
        nameElement.textContent = eventName;
        card.appendChild(nameElement);
        const countElement = document.createElement('div');
        countElement.className = 'registration-count';
        countElement.textContent = count;
        card.appendChild(countElement);
        card.addEventListener('click', () => {
            this.animateCard(card);
        });
        return card;
    }
    getEventLogoPath(eventName) {
        const map = {
            'IT Manager': 'IT Manager.png',
            'CodeSustain': 'Code Sustain.png',
            'Web Weavers': 'WebWeavers.png',
            'Anime Quiz': 'Anime Quest.png',
            'TechJar': 'TechJar.png',
            'Illustra': 'Illustra.png',
            'Sensorize': 'Sensorize.png',
            'Chronoscape': 'Chronoscape.png',
        };
        const file = map[eventName] || 'Logo.png';
        return `/${file}`;
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
    refresh() {
        this.fetchData();
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new EventRegistrationDashboard();
    window.dashboard = dashboard;
});
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
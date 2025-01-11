// Theme toggling
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

// Initialize charts
const ctx = document.getElementById('trendChart').getContext('2d');
const trendChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Will be populated with dates
        datasets: [{
            label: 'Followers',
            borderColor: '#1DA1F2',
            data: [] // Will be populated with follower counts
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: false
            }
        }
    }
});

// Function to update dashboard metrics
function updateMetrics(data) {
    document.getElementById('totalFollowers').textContent = data.followers;
    document.getElementById('totalFollowing').textContent = data.following;
    document.getElementById('netGrowth').textContent = data.netGrowth;
    document.getElementById('ratio').textContent = 
        (data.followers / data.following).toFixed(2);
}

// Function to add activity to feed
function addActivity(activity) {
    const feed = document.getElementById('activityFeed');
    const item = document.createElement('div');
    item.className = 'activity-item';
    item.innerHTML = `
        <div class="d-flex justify-content-between">
            <span>${activity.type}</span>
            <small>${activity.time}</small>
        </div>
        <div>@${activity.username}</div>
    `;
    feed.prepend(item);
}

// Mock data for testing
const mockData = {
    followers: 1234,
    following: 567,
    netGrowth: '+12'
};

// Initialize dashboard with mock data
updateMetrics(mockData); 
let markersData = []; // Global variable to hold marker data

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the map
    var map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Icons definition
    var icons = {
        default: L.icon({ iconUrl: '/static/icons/default.svg', iconSize: [30, 30], iconAnchor: [15, 30] }),
        food: L.icon({ iconUrl: '/static/icons/food.svg', iconSize: [30, 30], iconAnchor: [15, 30] }),
        cinema: L.icon({ iconUrl: '/static/icons/cinema.svg', iconSize: [30, 30], iconAnchor: [15, 30] }),
        education: L.icon({ iconUrl: '/static/icons/education.svg', iconSize: [30, 30], iconAnchor: [15, 30] }),
        cafe: L.icon({ iconUrl: '/static/icons/cafe.svg', iconSize: [30, 30], iconAnchor: [15, 30] }),
        health: L.icon({ iconUrl: '/static/icons/health.svg', iconSize: [30, 30], iconAnchor: [15, 30] }),
        hotel: L.icon({ iconUrl: '/static/icons/hotel.svg', iconSize: [30, 30], iconAnchor: [15, 30] }),
        museum: L.icon({ iconUrl: '/static/icons/museum.svg', iconSize: [30, 30], iconAnchor: [15, 30] }),
        park: L.icon({ iconUrl: '/static/icons/park.svg', iconSize: [30, 30], iconAnchor: [15, 30] }),
        religion: L.icon({ iconUrl: '/static/icons/religion.svg', iconSize: [30, 30], iconAnchor: [15, 30] }),
        shopping: L.icon({ iconUrl: '/static/icons/shopping.svg', iconSize: [30, 30], iconAnchor: [15, 30] }),
        sport: L.icon({ iconUrl: '/static/icons/sport.svg', iconSize: [30, 30], iconAnchor: [15, 30] }),
        transport: L.icon({ iconUrl: '/static/icons/transport.svg', iconSize: [30, 30], iconAnchor: [15, 30] }),
    };

    

    // Function to add a marker to the map
    function addMarker(latlng, selectedIcon) {
        var description = prompt("Please enter a description for this location:", "");
        if (description) {
            var marker = L.marker(latlng, { icon: selectedIcon }).addTo(map);
            marker.bindPopup(description);
            markersData.push({ 
                latlng: { lat: latlng.lat, lng: latlng.lng }, 
                icon: selectedIcon.options.iconUrl, 
                description: description 
            });
        } else {
            alert("You must enter a description to add a marker.");
        }
    }
// Check if 'icon-selector' exists and then add click event
var iconSelector = document.getElementById('icon-selector');
if (iconSelector) {
    map.on('click', function(e) {
        var selectedIconValue = iconSelector.value;
        var selectedIcon = icons[selectedIconValue] || icons['default'];
        addMarker(e.latlng, selectedIcon);
    });
}

// Check if 'search-button' and 'search-input' exist and then add search functionality
var searchButton = document.getElementById('search-button');
var searchInput = document.getElementById('search-input');
if (searchButton && searchInput) {
    searchButton.addEventListener('click', function() {
        var input = searchInput.value;
        if (input) {
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    var location = data[0];
                    map.setView([location.lat, location.lon], 13);
                } else {
                    console.log('Location not found');
                }
            })
            .catch(error => console.log('Error:', error));
        }
    });
}

    // Click event to add a marker
    map.on('click', function(e) {
        var selectedIconValue = document.getElementById('icon-selector').value;
        var selectedIcon = icons[selectedIconValue] || icons['default'];
        addMarker(e.latlng, selectedIcon);
    });

    // Location search functionality
    document.getElementById('search-button').addEventListener('click', function() {
        var input = document.getElementById('search-input').value;
        if (input) {
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    var location = data[0];
                    map.setView([location.lat, location.lon], 13);
                } else {
                    console.log('Location not found');
                }
            })
            .catch(error => console.log('Error:', error));
        }
    });
});

function getCSRFToken() {
    const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
    return csrfTokenMeta ? csrfTokenMeta.content : null;
}

const csrftoken = getCSRFToken();



// Function to save map state
function saveMapState() {
    // Define the data object
    let data = {
        name: "My Custom Map", 
        data: markersData, 
    };

    fetch('http://localhost:8000/api/mapstates/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        credentials: 'include',
        body: JSON.stringify(data), // Send the data object as JSON
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Map state saved:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function loadMapState(mapStateId) {
    fetch(`http://localhost:8000/api/mapstates/${mapStateId}/`, {
        method: 'GET',
        credentials: 'include', // Include session cookies
    })
    .then(response => response.json())
    .then(data => {
        data.data.forEach(markerInfo => {
            L.marker([markerInfo.latlng.lat, markerInfo.latlng.lng], { icon: L.icon({ iconUrl: markerInfo.icon }) })
            .addTo(map)
            .bindPopup(markerInfo.description);
        });
    })
    .catch((error) => console.error('Error:', error));
}


function loadUserMapStates() {
    fetch('http://localhost:8000/api/mapstates/', {
        method: 'GET',
        credentials: 'include', // Include session cookies
    })
    .then(response => response.json())
    .then(mapStates => {
        // Process and display the map states on the map
        mapStates.forEach(state => {
            // Add logic to display each state on the map
        });
    })
    .catch(error => console.error('Error:', error));
}
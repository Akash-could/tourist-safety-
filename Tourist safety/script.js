let map;
let userMarker;
let alertPlayed = false;

// 🚨 Danger Zones
const dangerZones = [
    { lat: 12.9716, lng: 77.5946, radius: 500 }, // Bangalore
    { lat: 12.2958, lng: 76.6394, radius: 400 },  // Mysore
    
    // Main Campus Area
    { lat: 13.1686, lng: 77.5360, radius: 300 },

    // Nearby road area (example unsafe zone simulation)
    { lat: 13.1705, lng: 77.5385, radius: 200 },

    // Slightly far zone (demo purpose)
    { lat: 13.1650, lng: 77.5320, radius: 250 }

];

// Initialize map
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 12.9716, lng: 77.5946 },
        zoom: 12
    });

    // Draw danger zones
    dangerZones.forEach(zone => {
        new google.maps.Circle({
            strokeColor: "red",
            fillColor: "red",
            fillOpacity: 0.2,
            map: map,
            center: { lat: zone.lat, lng: zone.lng },
            radius: zone.radius
        });
    });

    trackLocation();
}

// 📍 Track location
function trackLocation() {
    if (!navigator.geolocation) {
        alert("Geolocation not supported");
        return;
    }

    navigator.geolocation.watchPosition(
        position => {
            let lat = position.coords.latitude;
            let lng = position.coords.longitude;

            document.getElementById("lat").innerText = lat.toFixed(5);
            document.getElementById("lng").innerText = lng.toFixed(5);

            let userPos = { lat, lng };

            if (userMarker) userMarker.setMap(null);

            userMarker = new google.maps.Marker({
                position: userPos,
                map: map
            });

            map.setCenter(userPos);

            checkDangerZone(lat, lng);
        },
        () => alert("Location access denied")
    );
}

// ⚠️ Danger detection
function checkDangerZone(lat, lng) {
    let isInDanger = dangerZones.some(zone => {
        let distance = getDistance(lat, lng, zone.lat, zone.lng);
        return distance < zone.radius;
    });

    let status = document.getElementById("status");

    if (isInDanger) {
        status.innerText = "⚠️ Danger Zone!";
        status.style.color = "red";

        if (!alertPlayed) {
            document.getElementById("alertSound").play().catch(() => {});
            alertPlayed = true;
        }

    } else {
        status.innerText = "Status: Safe ✅";
        status.style.color = "green";
        alertPlayed = false;
    }
}

// 📏 Distance calculation
function getDistance(lat1, lon1, lat2, lon2) {
    let R = 6371000;
    let dLat = (lat2 - lat1) * Math.PI / 180;
    let dLon = (lon2 - lon1) * Math.PI / 180;

    let a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// 🚨 SOS Button
window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("sosBtn").addEventListener("click", () => {
    let audio = document.getElementById("alertSound");

    audio.play()
        .then(() => alert("Sound played ✅"))
        .catch(err => alert("Error: " + err));
});
});

let searchMarker;

function searchPlace() {
    let input = document.getElementById("searchBox").value;

    if (!input) {
        alert("Enter a location");
        return;
    }

    const service = new google.maps.places.PlacesService(map);

    const request = {
        query: input,
        fields: ["name", "geometry"]
    };

    service.findPlaceFromQuery(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results[0]) {

            let place = results[0];
            let location = place.geometry.location;

            let lat = location.lat();
            let lng = location.lng();

            // Move map
            map.setCenter(location);
            map.setZoom(15);

            // Remove old marker
            if (searchMarker) searchMarker.setMap(null);

            // Add marker
            searchMarker = new google.maps.Marker({
                map: map,
                position: location,
                title: place.name
            });

            // Check safety
            checkDangerZone(lat, lng);

        } else {
            alert("Location not found");
        }
    });
}


//document.getElementById("sosBtn").addEventListener("click", () => {
        navigator.geolocation.getCurrentPosition(pos => {
            let lat = pos.coords.latitude;
            let lng = pos.coords.longitude;

            alert(`🚨 SOS sent!\nLocation: ${lat}, ${lng}`);
        });
    //});
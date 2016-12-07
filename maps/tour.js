var map;
var waypoints = [];
var route;


initMap();
initRoute();

function initMap() {

    map = new L.Map('map');

    var osmUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}{r}.png';
    if (location.protocol === 'https:') {
        osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }

    L.tileLayer(osmUrl, {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    map.locate({setView: true, watch: true, enableHighAccuracy: true})
        .on('locationfound', function (e) {
            var marker = L.marker([e.latitude, e.longitude]).bindPopup('Your are here :)');
            var circle = L.circle([e.latitude, e.longitude], e.accuracy / 2, {
                weight: 1,
                color: 'blue',
                fillColor: '#cacaca',
                fillOpacity: 0.2
            });
            map.addLayer(marker);
            map.addLayer(circle);
            waypoints[1] = L.latLng(e.latitude, e.longitude);
        })
        .on('locationerror', function (e) {
            console.log(e);
            alert("Location access denied.");
        });

    map.on('mousemove', function (e) {
        waypoints[0] = e.latlng;
        route.setWaypoints(waypoints);
    });

    map.on('click', function (e) {
        // route.options.waypoints[1] = L.latLng(e.latlng.lat, e.latlng.lng);
    });
}

function initRoute() {
    route = L.Routing.control({
        waypoints: [],
        routeWhileDragging: true,
        autoRoute: true
    });
    route.addTo(map);
    console.log(route);
    console.log(route.options.waypoints);
}






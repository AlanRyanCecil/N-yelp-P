'use strict';

let API_KEY = 'pk.eyJ1IjoiYWxhbnJ5YW5jZWNpbCIsImEiOiJjam4xMXZtbzQ0ZzhtM3hxY2RkZTg0ZTRkIn0.TQM4BtDAX6tAh7LrIc99-A';

var streetMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: API_KEY
    });

var world = L.map('map', {
    center: [36.11, -115.17],
    zoom: 10,
    layers: [streetMap],
});

var markers = L.layerGroup();
world.addLayer(markers);
function setMapLocation(bid) {
    d3.json('/business/' + bid).then(function(budata) {
        let latlng = [budata.coordinates.latitude, budata.coordinates.longitude]
        world.flyTo(latlng, 16);
        markers.clearLayers();
        markers.addLayer(L.marker(latlng));
    });
}
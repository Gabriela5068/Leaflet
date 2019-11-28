const API_KEY = "pk.eyJ1IjoiZ2FieW1hcGJveCIsImEiOiJjazJocWhmZ2swY2ExM2NudHR0ajZpcTAxIn0.H1vrlxnyOUHJd727Zeqfrg";


// Creating map object
var map = L.map('map').setView([37.8, -96], 2);

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(map);

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


d3.json(url, function(data) {
  console.log(data);

  L.geoJson(data, {
    pointToLayer: function(feature, latLng) {
      var circlestyle = {
        radius: 2.5*feature.properties.mag,
        opacity: 0.6,
        color: "black",
        fillColor: colormagnitude(feature.properties.mag),
        fillOpacity: 0.6,
        weight: 0.8,
        stroke: true,
      }
      return L.circleMarker(latLng, circlestyle);
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup("<h5>" + feature.properties.place + "</h5>" + "<br>" + "Earthquake Mag:" + feature.properties.mag);
    }
  }).addTo(map);
});

function colormagnitude(msize) {
  switch (true) {
  case msize > 5:
    return "indianred";
  case msize > 4:
    return "sandybrown";
  case msize > 3:
    return "orange";
  case msize > 2:
    return "gold";
  case msize > 1:
    return "greenyellow";
  default:
    return "lime";
  } 
}

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        magnitude = [0, 1, 2, 3, 4, 5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < magnitude.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colormagnitude(magnitude[i] + 1) + '"></i> ' +
            magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
    }
    return div;
};

legend.addTo(map);


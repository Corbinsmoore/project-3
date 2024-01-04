// javascript here

// **** Jacob's part ************************

//get data 
url_cjj = "http://127.0.0.1:5000/cjj"
// Fetch the JSON data and console log it
d3.json(url_cjj).then(function(data) {
  console.log(data);
});
//filter Joseph

// ***** END Jacob's part *************************



// ***** START Joseph's Part **************************

// set up basemap layers
// might need to change geoJson to Json ?
var map = L.map('map').setView([37.8, -96], 4);

var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.geoJson(statesData).addTo(map);

// setting choropleth colors
// colors along with RANGES for number of applications for the chosen name can be reset as we see fit... might not populate any meaningful visuals yet
function getColor(number_app) {
  return number_app > 1000 ? '#980043' :
         number_app > 500  ? '#dd1c77' :
         number_app > 200  ? '#df65b0' :
         number_app > 100  ? '#d7b5d8' :
         number_app > 50   ? '#f1eef6' :
                            '#0a0a0a';
}
// define styling function for json so fillColor depends on feature.properties.density (relative density of chosen name in each state)
function style(feature) {
  return {
    fillColor: getColor(feature.properties.density),
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
  };
}

L.geoJson(statesData, {style: style}).addTo(map);

// create interactive hover element
function highlightFeature(hover) {
  var layer = hover.target;

  layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.7
  });
  layer.bringToFront();
}

// define style reset 
function resetHighlight(hover) {
  geojson.resetStyle(hover.target);
}

// ensure geojson layer is accessible through the geojson variable (definte it and assign layer later)
var geojson
geojson = L.geoJson(...); // assign layer later

// create zoom to state click function
function zoomToFeature(hover) {
  map.fitBounds(hover.target.getBounds());
}

// add interactive elements
function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature
  });
}

geojson = L.geoJson(statesData, {
  style: style,
  onEachFeature: onEachFeature
}).addTo(map);

// custom info control // don't forget to add CSS styling

// custom legend control
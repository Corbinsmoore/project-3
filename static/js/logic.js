// javascript here

// **** Jacob's part ************************

// Build graphs
function buildGraph(jo_y, jo_n, ja_y, ja_n, co_y, co_n) {
    // Trace for the Greek Data
    let trace_jo = {
        x: jo_y,
        y: jo_n,
        fill: 'tozeroy',
        type: 'scatter',
        name: 'Joseph',
        meta: "Year"
    };
    var trace_ja = {
        x: ja_y,
        y: ja_n,
        fill: 'tonexty',
        type: 'scatter',
        name: 'Jacob'
    };
    var trace_co = {
        x: co_y,
        y: co_n,
        fill: 'toself',
        type: 'scatter',
        name: 'Corbin'
    };
    var data = [trace_jo, trace_ja, trace_co];
    const layout = {
        title: "Number of Social Security Applications 1910-2021",
        margin: {
          l: 100,
          r: 100,
          t: 100,
          b: 100,
          pad: 4
        },
        xaxis: {
            title: {
              text: 'Year',
              font: {
                family: 'Courier New, monospace',
                size: 18
              }
            },
          },
          yaxis: {
            title: {
              text: 'Number Applications',
              font: {
                family: 'Courier New, monospace',
                size: 18,
              }
            }
          }
      };
    Plotly.newPlot('cjj', data, layout);
}

//get data 
url_cjj = "http://127.0.0.1:5000/cjj"
// Fetch the JSON data and console log it
d3.json(url_cjj).then(function(data) {
  console.log("loaded data");
  let joseph = {}, jacob = {}, corbin = {}
  for (const item of data) {
    if (item.name == "Corbin"){
        (item.year in corbin)? corbin[item.year] += item.number : corbin[item.year] = item.number
    } else if (item.name == "Joseph") {
        (item.year in joseph)? joseph[item.year] += item.number : joseph[item.year] = item.number
    } else {
        (item.year in jacob)? jacob[item.year] += item.number : jacob[item.year] = item.number
    }
  }
  // split objects onto arrays for the graph
  const joseph_year = Object.keys(joseph);
  const joseph_number = Object.values(joseph);
  const jacob_year = Object.keys(jacob);
  const jacob_number = Object.values(jacob);
  const corbin_year = Object.keys(corbin);
  const corbin_number = Object.values(corbin);
  buildGraph(joseph_year, joseph_number, jacob_year, jacob_number, corbin_year, corbin_number)
});

// ***** END Jacob's part *************************


// ***** START Joseph's Part **************************

// set up basemap layers
// might need to change geoJson to Json ?
var map = L.map('map').setView([37.8, -96], 4);

var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.geoJson(url_cjj).addTo(map); // is this how I link the data?

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

L.geoJson(url_cjj, {style: style}).addTo(map);

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

geojson = L.geoJson(url_cjj, {
  style: style,
  onEachFeature: onEachFeature
}).addTo(map);

// custom info control // don't forget to add CSS styling
var info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info'); //to create a div with a class "info"
  this.update();
  return this._div
};

// update the control based on feature properties passed
// need to reformat so its raw count instead of density
info.update = function (props) {
  this._div.innerHTML = '<h4>Density of Social Security Applications for Selected Name</h4>' + (props ?
    '<b>' + props.name + '</b><br />' + props.density + ' applications / mi<sup>2</sup>'
    : 'Hover over a state');
};

info.addTo(map);

// update control so when hovering over state functions are modified
function highlightFeature(hover) {
  info.update(layer.feature.properties);
}

function resetHighlight(hover) {
  info.update();
}

// custom legend control
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 50, 100, 200, 500, 1000], // edit these ranges along with the color ranges depending on what our counts are looking like for each name
      labels = [];

// loop through name count intervals and generate a label with a colored square for each interval
for (var i = 0; i < grades.length; i++) {
  div.innerHTML +=
      '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
}

return div;
};

legend.addTo(map);

// retrieve the data // all top 10 names or just corbin/joseph/jacob?

// ********* END Joseph's Part **************

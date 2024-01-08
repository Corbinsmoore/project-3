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
// get data
// url_cjj = "/cjj"
// // fetch and filter json data
// d3.json(url_cjj).then(function(data) {
//   console.log(data)
//   const result = data.filter((item) => (item.name == name && item.year == year))
//console.log(result)
let map = L.map('map').setView([37.8, -96], 4);

let tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let geoData = "static/data/state_boundaries.json"

// Defined outside function so this variable can be used in other places in the code
let geojson;

// Grab data with d3
d3.json(geoData).then(function(data) {
console.log(data)
geojson = L.geoJson(data,{
  style: customStyles,



}).addTo(map);
})


// sets the shape properties (colors, lines, etc)
// only runs once when the map loads
function customStyles(feature){
let nameSelected = document.querySelector('#names').value;
let yearSelected = document.querySelector('#years').value;
  return {
   // fillColor: getColor(eval(`feature.properties.${nameSelected}.${yearSelected}`)),
    fillColor: getColor(eval(`feature.properties.CENSUSAREA`)),
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '1',
    fillOpacity: 0.7
  };
}

// only chnages the color
// note scale does not change with dropdown change
function getColor(d) {
  return d > 200000   ? '#800026' :
          d > 100000   ? '#BD0026' :
          d > 50000   ? '#E31A1C' :
          d > 25000   ? '#FC4E2A' :
          d > 12500   ? '#FD8D3C' :
          d > 6250   ? '#FEB24C' :
          d > 3125   ? '#FED976' :
                    '#FFEDA0';
}



// // setting choropleth colors
// // colors along with RANGES for number of applications for the chosen name can be reset as we see fit... might not populate any meaningful visuals yet
// function getColor(name) {
//   return name > 1000 ? '#980043' :
//          name > 500  ? '#dd1c77' :
//          name > 200  ? '#df65b0' :
//          name > 100  ? '#d7b5d8' :
//          name > 50   ? '#f1eef6' :
//                             '#0a0a0a';
// }
// // add basemap layer






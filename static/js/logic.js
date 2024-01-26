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

// establish map and set view, add basemap, add to event listener so we can change map with dropdown selections
document.addEventListener('DOMContentLoaded', function(){
  let map = L.map('map').setView([37.8, -96], 4);

  let tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  
  // create function to load geojson data / store geojson data in a variable
  // defined outside function so this variable can be used in other places in the code
  function loadGeoJsonData(){
    let geoData_path = "./static/data/AllData.geojson" // ERIN said fix this line -- I changed from absolute path to relative path, console logged
    // fetch and filter data 
    d3.json(geoData_path).then(function (data) {
      console.log(data) // print data in console
      let geojson = L.geoJson(data, {
        style: customStyles,
        onEachFeature: onEachFeature
      }).addTo(map);
      populateYearDropDown(data);
    });
  }

  // create function to select year from drop down menu
  function populateYearDropDown(data){
  let years = new Set(); // use a set to avoid duplicate years
  data.features.forEach(feature =>{
  let name = feature.properties['Joseph'];
  if(name){
  Object.keys(name).forEach(year =>{
    years.add(year);
  });
  
  }
  });
  let yearsArray =  Array.from(years).sort(); // loop through each layer in the geojson and update
  let yearsDropDown = d3.select("#years"); // use d3 to grab values from drop down
  for (let i = 0; i < yearsArray.length; i++){
    yearsDropDown.append("option")
    .text(yearsArray[i])
    .attr("value", yearsArray[i]);
  }
  }
  
  // create function 
  function onEachFeature(feature, layer){ 
  let nameSelected = document.querySelector('#names').value;
  let yearSelected = document.querySelector('#years').value;
  // add conditional to establish what populates in dropdown before user selection 
  if (nameSelected === '' || yearSelected === ''){
    nameSelected = 'Joseph';
    yearSelected = '2022';
  }
  let count = 0;
  if(feature.properties[nameSelected] && feature.properties[nameSelected][yearSelected]){
    count = feature.properties[nameSelected][yearSelected];
  }
  // create pop-up so information is displayed and updated when hovering over each state
  layer.bindPopup("State: " + feature.properties.NAME + "<br>Application Count:<br>" + count);
  }
 
  
  // use function to set the shape properties (colors, lines, opacity, etc)
  function customStyles(feature) {
    // Grab the selected name and year from the dropdowns
    let nameSelected = document.querySelector('#names').value;
    let yearSelected = document.querySelector('#years').value;
    if (nameSelected === '' || yearSelected === ''){
      nameSelected = 'Joseph';
      yearSelected = '2022';
    }
  
    let count = 0;
    if(feature.properties[nameSelected] && feature.properties[nameSelected][yearSelected]){
    count = feature.properties[nameSelected][yearSelected];
    }
  
    return {
      fillColor: getColor(count),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '1',
      fillOpacity: 0.7
    };
  }
  
  // create function for choropleth color selections based on range of application rates
  // -- mess around with these, think what will work for the best visualization considering certain names are more popular than others in some years
  function getColor(count) {
    return count > 500 ? '#800026' :
    count > 200 ? '#BD0026' :
    count > 100 ? '#E31A1C' :
    count > 50 ? '#FC4E2A' :
    count > 20 ? '#FD8D3C' :
    count > 10 ? '#FEB24C' :
    count > 5 ? '#FED976' :
                  '#FFEDA0';
  }
  
// create legend 
  let legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
      let div = L.DomUtil.create('div', 'info legend'),
          applicant_count = [0, 5, 10, 20, 50, 100, 200, 500], // these are the breakpoints for the data
          labels = [],
          from, to;
  
      for (let i = 0; i < applicant_count.length; i++) {
          from = applicant_count[i];
          to = applicant_count[i + 1];
  
          labels.push(
              '<i style="background:' + getColor(from + 1) + '"></i> ' +
              from + (to ? '&ndash;' + to : '+'));
      }
  
      div.innerHTML = labels.join('<br>');
      return div;
  };
  // add legend to map
  legend.addTo(map);

  document.querySelector('#names').addEventListener('change', loadGeoJsonData);
  document.querySelector('#years').addEventListener('change', loadGeoJsonData);
  loadGeoJsonData();

});





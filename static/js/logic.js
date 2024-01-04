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
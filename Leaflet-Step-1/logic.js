//Create initial map object

var myMap = L.map("map", {
  center: [37.8283, -98.5795],
  zoom: 5
});

//Add a tile layer or background map image to our map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);



d3.json("all_week.geojson", function (data) {

  //Loop through the earthquake data array and create one marker for each object
  let alldata = data.features
  
  //console.log(alldata);

  //empty list for data
  let data_list = [];

  for (let i = 0; i < alldata.length; i++) {
  
  let datadict = {};
  let mag_value = alldata[i].properties.mag;
  datadict['Magnitude'] = mag_value;
  let long_value = alldata[i].geometry.coordinates[0];
  let lat_value = alldata[i].geometry.coordinates[1];
  datadict['Coordinates'] = [lat_value, long_value];
  let place_value = alldata[i].properties.place;
  datadict['Place'] = place_value;

  data_list.push(datadict);

  }

  console.log(data_list);

  //Create color

  // Loop through the data and assign markers
  for (let i = 0; i < data_list.length; i ++) {

    let color = "";
    if (data_list[i].Magnitude < 1) {
      color = "#fef0d9";
    }
    else if (data_list[i].Magnitude < 2) {
      color = "#fdcc8a";
    }
    else if (data_list[i].Magnitude < 3) {
      color = "#fc8d59";
    }
    else if (data_list[i].Magnitude < 4) {
      color = "#e34a33";
    }
    else {
      color = "#b30000";
    }
    
    L.circle(data_list[i].Coordinates, {
      fillOpacity: 0.75,
      color: color,
      fillColor: color,
      // Adjust radius
      radius: data_list[i].Magnitude * 15000
    }).bindPopup("<h1>" + data_list[i].Place + "</h1> <hr> <h3>Magnitude: " + data_list[i].Magnitude + "</h3>").addTo(myMap);

  }

  //Create legend
  let legend = L.control({position: 'bottomright'});
  legend.onAdd = function(map) {
    
    let colors = ["#fef0d9","#fdcc8a","#fc8d59","#e34a33","#b30000"]
    let div = L.DomUtil.create('div', 'info legend'),
      mags = [0,1,2,3,4],
      labels = [];

    for (let i = 0; i < mags.length; i++) {
      div.innerHTML += '<i style = "background:' + colors[i] + '"></i> ' + mags[i] + (mags[i +1] ? '&ndash;' + mags[i+1] + '<br>' : '+');
    }
  
    return div;
  };
  legend.addTo(myMap);
});




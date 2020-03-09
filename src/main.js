// Initialize the platform object:
const platform = new H.service.Platform({
   'apikey': 'luAvmoHbQUvxSVLucOwLZlrXOQ9JvIjUWuYPjqU1nsY'
    });

    
// Obtain the default map types from the platform object
const maptypes = platform.createDefaultLayers();

// Instantiate (and display) a map object:
const map = new H.Map(
    document.getElementById('root'),
    maptypes.vector.normal.map,
    {
    zoom: 11,
    center: { lat: -33.44, lng: -70.66 }
    });

// Enable the event system on the map instance:
const mapEvents = new H.mapevents.MapEvents(map);

// Add event listener:
map.addEventListener('tap', function(evt) {
    // Log 'tap' and 'mouse' events:
    console.log(evt.type, evt.currentPointer.type); 
});
const behavior = new H.mapevents.Behavior(mapEvents);

const ui = H.ui.UI.createDefault(map, maptypes);

const btnRuta = document.getElementById('Ruta')

btnRuta.addEventListener('click', () => {
 
  const finishValue = {
    searchText: document.getElementById('Hasta').value
  };

  // Define a callback function to process the geocoding response:
  const convertPoint = function(result) {
  let locations = result.Response.View[0].Result,
    position,
    marker;
   
  // Add a marker for each location found
  for (let i = 0;  i < locations.length; i++) {
    position = {
      lat: locations[i].Location.DisplayPosition.Latitude,
      lng: locations[i].Location.DisplayPosition.Longitude
    };


    marker = new H.map.Marker(position);
    map.addObject(marker);
    }
  };

   // Get an instance of the geocoding service:
  const geocoder = platform.getGeocodingService();

  geocoder.geocode(finishValue, convertPoint, function(e) {
  alert(e);
  });
  
  const city = document.getElementById('Ciudad').value

  fetch(`https://weather.ls.hereapi.com/weather/1.0/report.json?apiKey=luAvmoHbQUvxSVLucOwLZlrXOQ9JvIjUWuYPjqU1nsY&product=observation&name=${city}`)
  .then(res => res.json())
  .then(data => {
    let weatherData = data.observations.location
    for (let i = 0; i < weatherData.length; i++) {
      let position = {
        lat: weatherData[i].latitude,
        lng: weatherData[i].longitude
      };
      console.log(weatherData[i].observation[i].skyDescription)
      if(weatherData[i].observation[i].highTemperature >= 28){
        // Create an info bubble object at a specific geographic location:
        let bubble = new H.ui.InfoBubble(position, {
        content: '<b>Dia caluroso, recuerda tu agua y bloqueador</b>'
        });
        // Add info bubble to the UI:
        ui.addBubble(bubble);
      }else if (weatherData[i].observation[i].highTemperature <10){
        // Create an info bubble object at a specific geographic location:
        let bubble = new H.ui.InfoBubble(position, {
        content: '<b>Dia frio, no olvides salir abrigado</b>'
        });
        ui.addBubble(bubble);
      } else {
          // Create an info bubble object at a specific geographic location:
          let bubble = new H.ui.InfoBubble(position, {
          content: '<b>Dia agradeble</b>'
          });
          ui.addBubble(bubble);
      }
  }
})
})

/*fetch('https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=luAvmoHbQUvxSVLucOwLZlrXOQ9JvIjUWuYPjqU1nsY&waypoint0=geo!52.5,13.4&waypoint1=geo!52.5,13.45&mode=fastest;bicycle;traffic:disabled')
.then(res => res.json())
.then(data => console.log(data))*/
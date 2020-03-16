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
 
  const startValue = {
    searchText: document.getElementById('Desde').value
  };
  const finishValue = {
    searchText: document.getElementById('Hasta').value
  };
   
  // Define a callback function to process the geocoding response:
  const convertPoint = function(result) {
  let locations = result.Response.View[0].Result,
    position

  // Add a marker for each location found
  for (let i = 0;  i < locations.length; i++) {
    position = {
      lat: locations[i].Location.DisplayPosition.Latitude,
      lng: locations[i].Location.DisplayPosition.Longitude
    };
    console.log(position)
    }
  const routingParameters = {

    // The routing mode:
    'mode': 'fastest;bicycle',
    // The start point of the route:
    'waypoint0': `geo!${position.lat},${position.lng}`,
    // The end point of the route:
    'waypoint1': `geo!${position.lat},${position.lng}`,
    // To retrieve the shape of the route we choose the route
    // representation mode 'display'
    'representation': 'display'
  };
    
  var onResult = function(result) {
    var route,
      routeShape,
      startPoint,
      endPoint,
      linestring;
    if(result.response.route) {
    // Pick the first route from the response:
    route = result.response.route[0];
    // Pick the route's shape:
    routeShape = route.shape;
  
    // Create a linestring to use as a point source for the route line
    linestring = new H.geo.LineString();
  
    // Push all the points in the shape into the linestring:
    routeShape.forEach(function(point) {
      var parts = point.split(',');
      linestring.pushLatLngAlt(parts[0], parts[1]);
    });
  
    // Retrieve the mapped positions of the requested waypoints:
    startPoint = route.waypoint[0].mappedPosition;
    endPoint = route.waypoint[1].mappedPosition;
  
    // Create a polyline to display the route:
    var routeLine = new H.map.Polyline(linestring, {
      style: { strokeColor: 'blue', lineWidth: 3 }
    });
  
    // Create a marker for the start point:
    var startMarker = new H.map.Marker({
      lat: startPoint.latitude,
      lng: startPoint.longitude
    });
  
    // Create a marker for the end point:
    var endMarker = new H.map.Marker({
      lat: endPoint.latitude,
      lng: endPoint.longitude
    });
  
    // Add the route polyline and the two markers to the map:
    map.addObjects([routeLine, startMarker, endMarker]);
  
    // Set the map's viewport to make the whole route visible:
    map.getViewModel().setLookAtData({bounds: routeLine.getBoundingBox()});
    }
  };
  
  // Get an instance of the routing service:
  var router = platform.getRoutingService();
  
  // Call calculateRoute() with the routing parameters,
  // the callback and an error callback function (called if a
  // communication error occurs):
  router.calculateRoute(routingParameters, onResult,
    function(error) {
      alert(error.message);
    });
  };

  // Get an instance of the geocoding service:
  const geocoder = platform.getGeocodingService();
  
  geocoder.geocode(startValue, convertPoint, function(e) {
  alert(e);
  });
 
  geocoder.geocode(finishValue, convertPoint, function(e) {
  alert(e);
  });
})


/*fetch('https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=luAvmoHbQUvxSVLucOwLZlrXOQ9JvIjUWuYPjqU1nsY&waypoint0=geo!52.5,13.4&waypoint1=geo!52.5,13.45&mode=fastest;bicycle;traffic:disabled')
.then(res => res.json())
.then(data => console.log(data))*/
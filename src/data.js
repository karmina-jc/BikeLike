// /* Manejo de data */

// // esta es una función de ejemplo

// export const example = () => {
//   return 'example';
// };
  const startValue = {
    searchText: document.getElementById('Desde').value
  };

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

  geocoder.geocode(startValue, convertPoint, function(e) {
  alert(e);
  });

  geocoder.geocode(finishValue, convertPoint, function(e) {
  alert(e);
  });

  const routingParameters = {
    // The routing mode:
    'mode': 'fastest;pedestrian',
    // The start point of the route:
    'waypoint0': `geo!${position.lat},${position.lng}`,
    // The end point of the route:
    'waypoint1': `geo!${position.lat},${position.lng}`,
    // To retrieve the shape of the route we choose the route
    // representation mode 'display'
    'representation': 'display'
  };
  
  // Define a callback function to process the routing response:
  const ruteOp = function(result) {
    let route,
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
      let parts = point.split(',');
      linestring.pushLatLngAlt(parts[0], parts[1]);
    });
  
    // Retrieve the mapped positions of the requested waypoints:
    startPoint = route.waypoint[0].mappedPosition;
    endPoint = route.waypoint[1].mappedPosition;
  
    // Create a polyline to display the route:
    const routeLine = new H.map.Polyline(linestring, {
      style: { strokeColor: 'blue', lineWidth: 3 }
    });
  
    // Create a marker for the start point:
    let startMarker = new H.map.Marker({
      lat: startPoint.latitude,
      lng: startPoint.longitude
    });
  
    // Create a marker for the end point:
    let endMarker = new H.map.Marker({
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
  
  router.calculateRoute(routingParameters, ruteOp,
    function(error) {
      alert(error.message);
    });
  

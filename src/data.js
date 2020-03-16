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

//value for decoding
const geocoderService = platform.getGeocodingService();
const geocoder = adress =>{
  return new Promise ((resolve, reject) => {
    geocoderService.geocode(
      {
        'searchtext': adress
      },
      success => {
        resolve(success.Response.View[0].Result[0].Location.DisplayPosition);
      },
      error => {
        reject(error)
      }
    )
  })
}

const userRouting = async (startAdress, finishAdress) => {
  const startPiont = await geocoder(startAdress);
  const finishPoint = await geocoder(finishAdress)
  
  // Create the parameters for the routing request:
  const routingParameters = {
    // The routing mode:
    'mode': 'fastest;bicycle',
    // The start point of the route:
    'waypoint0': `geo!${startPiont.Latitude},${startPiont.Longitude}`,
    // The end point of the route:
    'waypoint1': `geo!${finishPoint.Latitude},${finishPoint.Longitude}`,
    // To retrieve the shape of the route we choose the route
    // representation mode 'display'
    'representation': 'display'
  };

// Define a callback function to process the routing response:
  const onResult = function(result) {
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
    const routeLine = new H.map.Polyline(linestring, {
      style: { strokeColor: 'blue', lineWidth: 3 }
    });

   document.querySelectorAll('.userOption button').forEach(e => {
      e.addEventListener('click', () => {
        console.log(e.value)

        if(e.value === 'like'){
          
          routeLine.addEventListener('tap', (event) => {
            let position = map.screenToGeo(
              event.currentPointer.viewportX,
              event.currentPointer.viewportY
            )
            let like = new H.map.Icon('./hearticon.png');
            const marker = new H.map.Marker(position,{icon:like})
            map.addObject(marker)
          })        
          
        }else if (e.value === 'hole'){
          
          routeLine.addEventListener('tap', (event) => {
            let position = map.screenToGeo(
              event.currentPointer.viewportX,
              event.currentPointer.viewportY
            )
            let hole = new H.map.Icon('./holeicon.png');
            const marker = new H.map.Marker(position,{icon:hole})
            map.addObject(marker)
          })
        }else if (e.value === 'danger'){
          
          routeLine.addEventListener('tap', (event) => {
            let position = map.screenToGeo(
            event.currentPointer.viewportX,
            event.currentPointer.viewportY
           )
          let danger = new H.map.Icon('./warningicon.png')
          const marker = new H.map.Marker(position,{icon:danger})
          map.addObject(marker)
          }) 
        }else{
          alert('Selecciona el punto de la ruta donde deseas poner tu pin')
        }
      })

    })

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

  // Call calculateRoute() with the routing parameters,
  // the callback and an error callback function (called if a
  // communication error occurs):
  router.calculateRoute(routingParameters, onResult,
    function(error) {
      alert(error.message);
    });
}

const btnRute = document.getElementById('Ruta')

btnRute.addEventListener('click', () => {
  let startAdress = document.getElementById('Desde').value;
  let finishAdress = document.getElementById('Hasta').value
  userRouting(startAdress, finishAdress)
})






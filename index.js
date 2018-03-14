window.onload = function() {
    if ("geolocation" in navigator) {
        var geoFail = null;
        var geoOptions = { enableHighAccuracy: true }
        var latlng = new google.maps.LatLng(37.09024, -95.712891);
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 3,
            mapTypeId: 'satellite',
            center: latlng,
            disableDefaultUI: true
        });
        map.setTilt(0);
        var clickMarker, userMarker, path;
        
        map.addListener('click', function(e) {
            if (!clickMarker) {
                clickMarker = new google.maps.Marker({
                    position: e.latLng,
                    map: map
                  });
            } else {
                clickMarker.setPosition(e.latLng);
            }
            update();
        });

        var geoSuccess = function(position) {
            var loc = {lat: position.coords.latitude, lng: position.coords.longitude};
            if (!userMarker) {
                userMarker = new google.maps.Marker({
                    position: loc,
                    map: map
                });
            } else {
                userMarker.setPosition(loc);
            }
            update();
        }
        navigator.geolocation.watchPosition(geoSuccess, geoFail, geoOptions);
      } else {
        alert("Location is not available. Please enable to continue");
      }
}

function update() {
    var bounds = new google.maps.LatLngBounds();
    if (userMarker) bounds.extend(userMarker.getPosition());
    if (clickMarker) bounds.extend(clickMarker.getPosition());
    map.fitBounds(bounds);
    if (userMarker && clickMarker) {
        var yards = google.maps.geometry.spherical.computeDistanceBetween(userMarker.getPosition(), clickMarker.getPosition()) * 1.09361;
        document.getElementById('yards').innerHTML = Math.round(yards) + ' yards';
        if (path) {
            path.setMap(null); 
        }
        path = new google.maps.Polyline({
            path: [userMarker.getPosition(), clickMarker.getPosition()],
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
          });   
        path.setMap(map);
    }
}
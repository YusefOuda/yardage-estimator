window.onload = function () {
    var clickMarker1, clickMarker2, currentClickMarker, userMarker, path, watchId;
    currentClickMarker = 1;
    if ("geolocation" in navigator) {
        var updateFirst = true;
        var geoFail = null;
        var geoOptions = { enableHighAccuracy: true }
        var latlng = new google.maps.LatLng(37.09024, -95.712891);
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 10,
            mapTypeId: 'satellite',
            center: latlng,
            disableDefaultUI: true
        });
        map.setTilt(0);

        map.addListener('click', function (e) {
            if (watchId === null) { // not tracking
                if (currentClickMarker === 1) {
                    if (!clickMarker1) {
                        clickMarker1 = new google.maps.Marker({
                            position: e.latLng,
                            map: map
                        });
                    } else {
                        clickMarker1.setPosition(e.latLng);
                    }
                    update(true);
                    currentClickMarker = 2;
                } else {
                    if (!clickMarker2) {
                        clickMarker2 = new google.maps.Marker({
                            position: e.latLng,
                            map: map
                        });
                    } else {
                        clickMarker2.setPosition(e.latLng);
                    }
                    update(true);
                    currentClickMarker = 1;
                }
            } else { // tracking position, only can add 1 marker
                if (!clickMarker1) {
                    clickMarker1 = new google.maps.Marker({
                        position: e.latLng,
                        map: map
                    });
                } else {
                    clickMarker1.setPosition(e.latLng);
                }
                update(true);
            }
        });

        var geoSuccess = function (position) {
            var loc = { lat: position.coords.latitude, lng: position.coords.longitude };
            if (!userMarker) {
                userMarker = new google.maps.Marker({
                    position: loc,
                    map: map
                });
            } else {
                userMarker.setPosition(loc);
            }
            if (updateFirst) {
                update(true);
                updateFirst = false;
                map.setZoom(17);
            } else {
                update(false);
            }
        }
        
        watchId = navigator.geolocation.watchPosition(geoSuccess, geoFail, geoOptions);

        var checkbox = this.document.getElementById("watch");
        watch.addEventListener('change', function() {
            if (clickMarker1) clickMarker1.setMap(null);
            if (clickMarker2) clickMarker2.setMap(null);
            if (userMarker) userMarker.setMap(null);
            if (path) path.setMap(null);
            clickMarker1 = null;
            clickMarker2 = null;
            userMarker = null;
            path = null;

            if (this.checked) {
                watchId = navigator.geolocation.watchPosition(geoSuccess, geoFail, geoOptions);
            } else {
                navigator.geolocation.clearWatch(watchId);
                watchId = null;
            }
        });
    } else {
        alert("Location is not available. Please enable to continue");
    }
    function update(setBounds) {
        if (setBounds) {
            var bounds = new google.maps.LatLngBounds();
            if (userMarker) bounds.extend(userMarker.getPosition());
            if (clickMarker1) bounds.extend(clickMarker1.getPosition());
            if (clickMarker2) bounds.extend(clickMarker2.getPosition());
            map.fitBounds(bounds);
        }
        if (userMarker && clickMarker1) {
            var yards = google.maps.geometry.spherical.computeDistanceBetween(userMarker.getPosition(), clickMarker1.getPosition()) * 1.09361;
            document.getElementById('yards').innerHTML = Math.round(yards) + ' yards';
            if (path) {
                path.setMap(null);
            }
            path = new google.maps.Polyline({
                path: [userMarker.getPosition(), clickMarker1.getPosition()],
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });
            path.setMap(map);
        } else if (clickMarker1 && clickMarker2) {
            var yards = google.maps.geometry.spherical.computeDistanceBetween(clickMarker1.getPosition(), clickMarker2.getPosition()) * 1.09361;
            document.getElementById('yards').innerHTML = Math.round(yards) + ' yards';
            if (path) {
                path.setMap(null);
            }
            path = new google.maps.Polyline({
                path: [clickMarker1.getPosition(), clickMarker2.getPosition()],
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });
            path.setMap(map);
        }
    }
}

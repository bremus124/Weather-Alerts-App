function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: { lat: 39.8097343, lng: -98.5556199 },
  });

  var input = document.getElementById("searchInput");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo("bounds", map);

  var infowindow = new google.maps.InfoWindow();
  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29),
  });

  autocomplete.addListener("place_changed", function () {
    infowindow.close();
    marker.setVisible(false);
    var place = autocomplete.getPlace();
    console.log({ place });
    localStorage.setItem("place",place.formatted_address);
    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }
    marker.setIcon({
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35),
    });
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    var address = "";
    if (place.address_components) {
      address = [
        (place.address_components[0] &&
          place.address_components[0].short_name) ||
          "",
        (place.address_components[1] &&
          place.address_components[1].short_name) ||
          "",
        (place.address_components[2] &&
          place.address_components[2].short_name) ||
          "",
      ].join(" ");
    }

    infowindow.setContent(
      "<div><strong>" + place.name + "</strong><br>" + address
    );
    infowindow.open(map, marker);

    // Location details
    for (var i = 0; i < place.address_components.length; i++) {
      if (place.address_components[i].types[0] == "postal_code") {
        document.getElementById("postal_code").innerHTML =
          place.address_components[i].long_name;
      }
      if (place.address_components[i].types[0] == "country") {
        document.getElementById("country").innerHTML =
          place.address_components[i].long_name;
      }

    }

    document.getElementById("alertsList").innerHTML = "";
    document.getElementById("location").innerHTML = place.formatted_address;
    document.getElementById("lat").innerHTML = place.geometry.location.lat();
    document.getElementById("lon").innerHTML = place.geometry.location.lng();
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "18daf76251msh7e93ac0397bbe70p1b0775jsn693b82572462",
        "X-RapidAPI-Host": "weatherbit-v1-mashape.p.rapidapi.com",
      },
    };

    fetch(
      `https://api.weatherbit.io/v2.0/alerts?lat=${place.geometry.location.lat()}&lon=${place.geometry.location.lng()}&key=4e13b98bdee542e2844bba58757bdc67&include=minutely`
      // "https://api.weatherbit.io/v2.0/alerts?lat=39.75895&lon=-84.19161&key=4e13b98bdee542e2844bba58757bdc67"
      // options
    )
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        document.getElementById("alertsList").innerHTML =
          response.alerts[0].severity +
          " " +
          response.alerts[0].title;

          var sevAlert = response.alerts[0].severity;
          var titleAlert = response.alerts[0].title;

          localStorage.setItem("severity", sevAlert);
          localStorage.setItem("title", titleAlert);
      })
      .catch((err) => console.error(err));
  });
}

window.initMap = initMap;

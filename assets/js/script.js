function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: { lat: 41, lng: -87 },
  });
}



window.initMap = initMap;
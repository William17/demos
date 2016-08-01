$(function() {

  $('#map').height($(window).height());

  var center = new google.maps.LatLng(22.10, 115.50);
  var map;
  var marker;
  function initialize() {
      var mapProp = {
          center:center,
          zoom: 8,
          mapTypeId:google.maps.MapTypeId.ROADMAP
      };
      map=new google.maps.Map(document.getElementById("map"),mapProp);
  }
  google.maps.event.addDomListener(window, 'load', initialize);


  var yunba = new Yunba({server: 'sock.yunba.io', port: 3000, appkey: '54d0c24252be1f7e1dd84c42'});
  yunba.init(function (success) {
      if (success) {
          yunba.connect(function (success, msg) {
              if (success) {
                  yunba.subscribe({'topic': 'nida_position'}, function (success, msg) {
                      if (!success) {
                          console.log(msg);
                      }
                  });
              }
          });
      }
  });
  var initCenter = false;
  yunba.set_message_cb(function (data) {
      if (data.topic == 'nida_position') {
        var position = JSON.parse(data.msg);
        var point = new google.maps.LatLng(position.lat, position.lng);
        if (!window.marker) {
          marker = new google.maps.Marker({
              position: point,
              icon:'./static/typhoon.gif'
          });
          marker.setMap(map);
          if (!initCenter) {
            map.panTo(point);
            initCenter = true;
          }
        } else {
          marker.setPosition(point);
        }
        console.log('moveTo: ' + position.lat + ',' + position.lng);
      }
  });

})


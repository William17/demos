$(function() {
  // init map size
  $('#map').height($(window).height());


  // init yunba
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

  var map;
  var markers = {};
  var current;
  yunba.set_message_cb(function (msg) {
      var data;
      if (msg.topic == 'nida_position') {
        data = JSON.parse(msg.msg);
        if (!map) {
          map = getMap(data);
        }
        if (!markers[data.time]) {
          if (current) {
            clearMarker(markers[current]);
            markers[data.time] = null;
          }
          current = data.time;
          markers[data.time] = {
            marker: addMarker(map, data),
            forecast: addForeCast(map, data)
          }
        }
      }
  });

  function clearMarker(marker) {
    marker.marker.setMap(null);
    for(var i = 0, length = marker.forecast.forecastMarkers.length; i < length; i++) {
      marker.forecast.forecastMarkers[i].setMap(null);
    }
    for(var j = 0, length = marker.forecast.foreCastLines.length; j < length; j++) {
      marker.forecast.foreCastLines[j].setMap(null);
    }
  }

  function addMarker(map, data) {
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.lat, data.lng),
        icon:'./static/typhoon.gif'
    });
    marker.setMap(map);
    return marker;
  }

  function addForeCast(map, data) {
    var forecast = data.forecast;
    var forecastMarkers = [];
    var foreCastLines = [];
    var marker;
    var lineColors = {
      "中国": "#ff0000",
      "日本": "#2BBE00",
      "中国香港": "#fe9104",
      "中国台湾": "#FF00FF",
      "美国": "#11f7f7"
    };
    var line;
    var iconNum;
    if (forecast) {
      for (var i = 0, iLength = forecast.length; i < iLength; i++) {
        for (var j = 0, jLength = forecast[i].forecastpoints.length; j < jLength; j++) {
          forecast[i].forecastpoints[j].lat = parseFloat(forecast[i].forecastpoints[j].lat);
          forecast[i].forecastpoints[j].lng = parseFloat(forecast[i].forecastpoints[j].lng);
          if (forecast[i].forecastpoints[j].power) {
            iconNum = Math.floor((parseInt(forecast[i].forecastpoints[j].power) - 4)/2);
            marker = new google.maps.Marker({
              position: new google.maps.LatLng(forecast[i].forecastpoints[j].lat, forecast[i].forecastpoints[j].lng),
              icon: './static/t-0' + iconNum + '.png'
            });
            marker.setMap(map);
            forecastMarkers.push(marker);
          };
        }
        var lineSymbol = {
          path: 'M 0,-1 0,1',
          strokeColor: lineColors[forecast[i].tm],
          strokeOpacity: 0.8,
          scale: 2
        };
        line = new google.maps.Polyline({
          path: forecast[i].forecastpoints,
          strokeOpacity: 0,
          icons: [{
            icon: lineSymbol,
            offset: '0',
            repeat: '10px'
          }]
        });
        line.setMap(map);
        foreCastLines.push(line);
      }
    }
    return {
      forecastMarkers: forecastMarkers,
      foreCastLines: foreCastLines
    }
  }

  function getMap(data) {
      var mapProp = {
          center: new google.maps.LatLng(data.lat, data.lng),
          zoom: 8,
          mapTypeId:google.maps.MapTypeId.ROADMAP
      };
      return new google.maps.Map(document.getElementById("map"),mapProp);
  }

});


/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* Loading the map */

var view = new ol.View({
        center: ol.proj.transform(
          [11.5195, 3.8613], 'EPSG:4326', 'EPSG:3857'),
        rotation: -Math.PI / 4,
        zoom: 16
    });

var map = new ol.Map({
    interactions: ol.interaction.defaults().extend([
      new ol.interaction.DragRotateAndZoom()
    ]),
    controls: ol.control.defaults().extend([
      new ol.control.OverviewMap()
    ]),
    layers: [
      new ol.layer.Tile({
          style: 'Road',
          source: new ol.source.MapQuest({layer: 'osm'})
        })
    ],
    view: view,
    target: 'map'
  });
  
  $('.ol-zoom-in, .ol-zoom-out').tooltip({
    placement: 'right'
  });
  $('.ol-rotate-reset, .ol-attribution button[title]').tooltip({
    placement: 'left'
  });

/* END Loading the map */


/*  Géolocalisation  */

    var geolocation = new ol.Geolocation({
        projection: view.getProjection()
      });

      function el(id) {
        return document.getElementById(id);
      }

      el('track').addEventListener('change', function() {
        geolocation.setTracking(this.checked);
      });

      // update the HTML page when the position changes.
      geolocation.on('change', function() {
        el('position').innerText = geolocation.getPosition();
        el('vitesse').innerText = geolocation.getSpeed() + ' [m/s]';
      });

      // handle geolocation error.
      geolocation.on('error', function(error) {
        var info = document.getElementById('info');
        info.innerHTML = error.message;
        info.style.display = '';
      });

      var accuracyFeature = new ol.Feature();
      geolocation.on('change:accuracyGeometry', function() {
        accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
      });

      var positionFeature = new ol.Feature();
      positionFeature.setStyle(new ol.style.Style({
        image: new ol.style.Circle({
          radius: 6,
          fill: new ol.style.Fill({
            color: '#3399CC'
          }),
          stroke: new ol.style.Stroke({
            color: '#fff',
            width: 2
          })
        })
      }));

      geolocation.on('change:position', function() {
        var coordinates = geolocation.getPosition();
        positionFeature.setGeometry(coordinates ?
            view.setCenter(geolocation.getPosition()) : null);
      });

      new ol.layer.Vector({
        map: map,
        source: new ol.source.Vector({
          features: [accuracyFeature, positionFeature]
        })
      });
/*  Géolocalisation  */

var dragAndDropInteraction = new ol.interaction.DragAndDrop({
    formatConstructors: [ol.format.GPX, ol.format.GeoJSON],
});
var namesintable = [];
var icons = [];
var source = new ol.source.XYZ({
    url: 'http://a.tile.openstreetmap.org/{z}/{x}/{y}.png' });
map = new ol.Map({
    interactions: ol.interaction.defaults().extend([dragAndDropInteraction]),
    layers: [
    new ol.layer.Tile({source: source}),
    new ol.layer.Vector({      
        source: new ol.source.Vector({features:icons})
    })],
    renderer: "canvas",
    target: 'map',
    view: new ol.View({
        center: ol.proj.fromLonLat([4.20, 51.82]),
        zoom: 12
    })
});
function setBasisBW(){
    source.setUrl('http://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png');
}

function example(){
    var examplesource = new ol.source.Vector({
        url: './26122020_161723(10).json',
        format: new ol.format.GeoJSON()
    });
    
    var examplevector = new ol.layer.Vector({
        source: examplesource,
        style: styleFunction
    });

    map.addLayer(examplevector);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var myObj = JSON.parse(this.responseText);
        //console.log(myObj.features)
        ClearChart()
        CollectInfo2(myObj.features)
    }
    };
    xmlhttp.open("GET", "./26122020_161723(10).json", true);
    xmlhttp.send();
}

function routes(){
    gpxs.forEach(gpx => {
        var routesource = new ol.source.Vector({
            url: gpx,
            format: new ol.format.GPX()
        });
        
        var routevector = new ol.layer.Vector({
            source: routesource,
            style: styleFunction
        });
        routevector.values_.zIndex = 1;
        map.addLayer(routevector)
    });
}

dragAndDropInteraction.on('addfeatures', addFile )

function addFile(event) {
    //console.log(event.features)
    ClearChart()
    CollectInfoGPX(event.features)
    //CollectInfo(event.features)
    var vectorSource = new ol.source.Vector({
        features: event.features,
    });
    map.addLayer( new ol.layer.Vector({
        source: vectorSource,
        style: styleFunction
        })
    );
    //console.log(vectorSource.getExtent())
    map.getView().fit(vectorSource.getExtent());
};

function LayersToTable(){
    var layers = map.getLayers()
    layers.forEach(element => {
        var name = element.values_.source.url_;
        console.log(element.get('name'));
        if (name != undefined && !namesintable.includes(name)){
            namesintable.push(name);
            var content = document.getElementById("t01bd").innerHTML
            var new_content = content+"<tr><td id='layername'><button class='cmap-button'>" + name + "</button></td><td id='control'>-</td></tr>"
            document.getElementById("t01bd").innerHTML = new_content;
        }
    });
}
function LayersToTable2(){
    var extent = map.getView().calculateExtent(map.getSize());
    source.forEachFeatureInExtent(extent, function(feature){
        // do something 
        console.log(feature)
    });
}
var displayFeatureInfo = function (pixel) {
    var features = [];
    map.forEachFeatureAtPixel(pixel, function (feature) {
        var geom = feature.get('geometry').getType();
        if(geom == "MultiLineString" || geom == "LineString"){
            features.push(feature);
        }
    });
    if (features.length > 0) {
      var info = [];
      var i, ii;
      for (i = 0, ii = features.length; i < ii; ++i) {

        info.push(features[i].get('name'));
      }
      document.getElementById('info').innerHTML = info.join('<br>') || '&nbsp';
    } else {
      document.getElementById('info').innerHTML = '&nbsp;';
    }
};

  map.on('pointermove', function (evt) {
    if (evt.dragging) {
      return;
    }
    var pixel = map.getEventPixel(evt.originalEvent);
    displayFeatureInfo(pixel);
  });
  
  map.on("click", function(e) {
    var features = [];
    var layers = []
    map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
        var geom = feature.get('geometry').getType();
        if(geom == "MultiLineString"){
            features.push(feature);
            layers.push(layer);
        }
    });
    map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
        selectedGPX(feature, layer)
    })
});
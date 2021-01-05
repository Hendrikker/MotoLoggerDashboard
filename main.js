var dragAndDropInteraction = new ol.interaction.DragAndDrop({
    formatConstructors: [ol.format.GPX, ol.format.GeoJSON],
});

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
    /*
var map = new ol.Map({
    interactions: ol.interaction.defaults().extend([dragAndDropInteraction]),
    layers: [
        new ol.layer.Tile({
        source: new ol.source.OSM()
        })
    ],
    target: 'map',
    view: new ol.View({
        center: ol.proj.fromLonLat([4.20, 51.82]),
        zoom: 12
    })
});
*/

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
        map.addLayer(routevector)
    });
}

dragAndDropInteraction.on('addfeatures', addFile )

function addFile(event) {
    //console.log(event.features)
    ClearChart()
    CollectInfo(event.features)
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
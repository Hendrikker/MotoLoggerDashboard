var selected = []
var distance_constant = 0.62467161816523797130098471648944;

function selectFromTable(id){
    id = id+2;
    console.log(id);
    var layers = map.getLayers();
    layers.forEach(layer => {
        if(layer.ol_uid==id){
            console.log(layer);
            selectedGPX(layer)
        }
    });
}

function selectedGPX(layer){
    // unselected last
    if (selected.length != 0){
        selected.styleFunction_ = styleFunction;
        selected.values_.zIndex = 1;
        selected.getSource().changed();
    }
    selected = layer;
    
    console.log(layer);

    var url = layer.values_.source.url_;
    var name;
    var id = layer.getSource().ol_uid - 1;
    if (url == undefined){
        name = layers.array_[index].getSource().uidIndex_[id].values_.name;
    }
    if (url != undefined){
        name = url.split("/");
        name = name[name.length-1].split(".")[0];
    }
    document.getElementById("infotitle").innerHTML = name;
    
    // select style
    layer.styleFunction_ = styleFunctionSelected;
    layer.values_.zIndex = 100;
    layer.getSource().changed();
    //calculationGPX(feature)
}

function calculationGPX(feature){
    var coords = feature.getGeometry().getCoordinates()[0];
    var distances = []
    for (var i = 1; i < coords.length; i++) {
        distances.push(calcdistance2(coords[i-1], coords[i]));
    }
    document.getElementById("distancevalue").innerHTML = (Math.round(distances.reduce((a, b) => a + b, 0))/1000).toString() + " km";
}

function CollectInfoGPX(features){
    var time = [];
    var elevation = [];
    var latlon = [];
    features.forEach(feature => {
        var geom = feature.getGeometry().getType();
        if (geom == "MultiLineString"){
            var coords = feature.getGeometry().getCoordinates()[0];
            console.log()
            coords.forEach(coord => {
                latlon.push([coord[1], coord[0]])
                elevation.push(coord[2])
                time.push(coord[3])
            });
        }
    });
    var distances = [];
    for (var i = 1; i < latlon.length; i++) {
        distances.push(calcdistance2(latlon[i-1], latlon[i]));
    }
    var total_distance = distances.reduce(function(a, b) { return a + b; }, 0);
    //var total_distance = feature.getGeometry().getLineString().getLength();
}
function calcdistance2(coord1, coord2){
    var distance = Math.sqrt((coord1[0] - coord2[0]) * (coord1[0] - coord2[0]) + (coord1[1] - coord2[1]) * (coord1[1] - coord2[1]))*distance_constant;
    return distance;
}

var styleFunctionSelected = function (feature) {
    if (feature.getGeometry().getType() == "Point"){
        var RGB;
        if (feature.getProperties()[current_property] != undefined){
            RGB = colormapping(current_property, current_colormap, feature.getProperties()[current_property])
        } else if(current_property == "No Points"){
            RGB = [0, 0, 0, 0]
        } else{
            RGB = [0, 0, 0, current_opacity]
        }
    }
    var styles = {
        'Point': new ol.style.Style({
            image: new ol.style.Circle({
                radius: 3,
                //fill: new ol.style.Fill({color: [c, c, c]}),
                fill: new ol.style.Fill({color: RGB}),
                //stroke: new ol.style.Stroke({color: [255,255,255], width: 0.5})
            })
        }),
        'LineString': new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: [0, 102, 153, 1],
            width: 3,
          }),
        }),
        'MultiLineString': new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: [0,0,170,1],
              width: 3,
            }),
          }),
          //zIndex: 100
      };
    return styles[feature.getGeometry().getType()];
};
var current_colormap = "spectral";
var current_property = "No Points";
document.getElementById("current_property").innerHTML = current_property
var current_opacity = 1;

function setCurrent_Property(new_current){
    current_property = new_current;
    document.getElementById("current_property").innerHTML = current_property
    if(new_current=='bearing'){current_colormap = "spectral-cycle"}
    if(new_current=='speed'){current_colormap = "spectral"}
    if(new_current=='elevation'){current_colormap = "spectral"}
    UpdateColormap(current_colormap)
}

function setCurrent_Colormap(new_current){
    current_colormap = new_current;
    UpdateColormap(current_colormap)
}
function toggleCurrent_Opacity(){
    if(current_opacity==0){
        current_opacity = 1;
    } else {
        current_opacity = 0;
    }
}

var styleFunction = function (feature) {
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
              color: [170,0,0,1],
              width: 2.5,
            }),
          }),
      };
    return styles[feature.getGeometry().getType()];
};

function colormapping(property, colormap ,value){
    if ( value>=minmax[property]["max"] ){
        return colormaps[colormap][colormaps[colormap].length-1];
    } else if (value<=minmax[property]["min"]){
        return colormaps[colormap][0];
    } else{
        var percentage = (value-minmax[property]["min"])/(minmax[property]["max"]-minmax[property]["min"])
        var nborder = colormaps[colormap].length-1
        var region = Math.floor(percentage*nborder)
        var subperc = (percentage%(1/nborder))*(nborder)
        var R = colormaps[colormap][region][0] + subperc * (colormaps[colormap][region+1][0] - colormaps[colormap][region][0])
        var G = colormaps[colormap][region][1] + subperc * (colormaps[colormap][region+1][1] - colormaps[colormap][region][1])
        var B = colormaps[colormap][region][2] + subperc * (colormaps[colormap][region+1][2] - colormaps[colormap][region][2])
        var color = [R, G, B, current_opacity]
        return color;
    }
}

function UpdateColormap(colormap){
    var css_bg = "linear-gradient(to right";
    colormaps[colormap].forEach(function (element, i) {
        css_bg = css_bg + ", rgb(" + element[0] + "," + element[1] + "," + element[2]+ ") " + i/(colormaps[colormap].length-1)*100 + "%"
    });
    css_bg = css_bg + ")"
    document.getElementsByClassName("colorbar")[0].style["background-image"] = css_bg;
    console.log(document.getElementById("cbartext"))
    document.getElementById("cbartext").innerHTML = minmax[current_property].units + "<span style='float: left'>" + minmax[current_property].min.toString() + "</span><span style='float:right;'>" + minmax[current_property].max.toString() + "</span>" ;
    console.log(document.getElementById("cbartext").innerHTML)
}
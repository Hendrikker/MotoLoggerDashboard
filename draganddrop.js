document.getElementById("sats").style.display = "none";

function CollectInfo(feats){
    count = 0
    var speeds = [];
    var elevations = [];
    var nsats = [];
    var HDOPs = [];
    var VDOPs = [];
    var PDOPs = [];
    feats.forEach(element => {
        if(element.getGeometry().getType() ==  "Point"){
            speeds.push(element.values_.speed)
            elevations.push(element.values_.elevation);
            nsats.push(element.values_["nsat"]);
            HDOPs.push(element.values_.HDOP);
            VDOPs.push(element.values_.VDOP);
            PDOPs.push(element.values_.PDOP);
            count = count + 1;
        }
    });
    var speed = summary(speeds)
    var elevation = summary(elevations)
    var nsat = summary(nsats)
    var HDOP = summary(HDOPs)
    var VDOP = summary(VDOPs)
    var PDOP = summary(PDOPs)
    fillTable(speed, "speed", count);
    fillTable(elevation, "height", count);
    fillTable(nsat, "nsat", count);
    fillTable(HDOP, "HDOP", count);
    fillTable(VDOP, "VDOP", count);
    fillTable(PDOP, "PDOP", count);

    var epochs = [];
    for (var i = 1; i <= count; i++) {
        epochs.push(i);
        chart1.data.labels.push(i)
        chart2.data.labels.push(i)
    }

    AddToChart1(speeds, "Speed");
    AddToChart1(elevations, "Elevation");
    AddToChart2(nsats, "# Sat");
    AddToChart2(HDOPs, "HDOP");
    AddToChart2(VDOPs, "VDOP");
    AddToChart2(PDOPs, "PDOP");
};

function summary(array){
    var sum = array.reduce((a, b) => a + b, 0)
    return [sum,Math.min.apply(Math, array),Math.max.apply(Math, array)];
}

function fillTable(info, name, count){
    document.getElementById(name+"-mean").innerHTML = Math.round(info[0]*100/count)/100;
    document.getElementById(name+"-min").innerHTML  = Math.round(info[1]*100)/100;
    document.getElementById(name+"-max").innerHTML  = Math.round(info[2]*100)/100;
}

function update(info, entry) {
    info[0] = info[0] + entry;
    if(entry <= info[1]){
        info[1] = entry;
    }
    if(entry >= info[2]){
        info[2] = entry;
    }
    return info;   // The function returns the product of p1 and p2
}

function CollectInfo2(feats){
    count = 0
    var speeds = [];
    var elevations = [];
    var nsats = [];
    var HDOPs = [];
    var VDOPs = [];
    var PDOPs = [];
    feats.forEach(element => {
        if(element["geometry"]["type"] ==  "Point"){
            speeds.push(element.properties.speed)
            elevations.push(element.properties.elevation);
            nsats.push(element.properties["nsat"]);
            HDOPs.push(element.properties.HDOP);
            VDOPs.push(element.properties.VDOP);
            PDOPs.push(element.properties.PDOP);
            count = count + 1;
        }
    });
    var speed = summary(speeds)
    var elevation = summary(elevations)
    var nsat = summary(nsats)
    var HDOP = summary(HDOPs)
    var VDOP = summary(VDOPs)
    var PDOP = summary(PDOPs)
    fillTable(speed, "speed", count);
    fillTable(elevation, "height", count);
    fillTable(nsat, "nsat", count);
    fillTable(HDOP, "HDOP", count);
    fillTable(VDOP, "VDOP", count);
    fillTable(PDOP, "PDOP", count);

    var epochs = [];
    for (var i = 1; i <= count; i++) {
        epochs.push(i);
        chart1.data.labels.push(i)
        chart2.data.labels.push(i)
    }

    AddToChart1(speeds, "Speed");
    AddToChart1(elevations, "Elevation");
    AddToChart2(nsats, "# Sat");
    AddToChart2(HDOPs, "HDOP");
    AddToChart2(VDOPs, "VDOP");
    AddToChart2(PDOPs, "PDOP");
};

function HideSats(){
    if(document.getElementById("sats").style.display == "none"){
        document.getElementById("sats").style.display = "block";
    }else{
        document.getElementById("sats").style.display = "none";
    }
    
}
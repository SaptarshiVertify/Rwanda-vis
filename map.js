// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
mapboxgl.accessToken = 'pk.eyJ1IjoiZGV2MDUxMCIsImEiOiJjbGNoaG41czEwYmxuM3FtOWNvemVub3lkIn0.5hN1wrZNfw-7YmnNYKM2YQ';
const bounds = [
	[28.89,-2.81], //SW boundary
	[30.18,-1.39] //NE boundary
];
const map = new mapboxgl.Map({
    container: 'map',
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/satellite-v9',
	opacity: 1,
    center: [29.7,-1.9],
    zoom: 10,
    // projection: 'natural' // starting projection
    // maxBounds: bounds
});

//  -------- Saving all district layer info -------
var dists = [
    // District,X,Y,Tea-17,Tea-22,Tea-ver,Over-22,Over-17
    ['Nyaruguru',29.5,-2.69,4197,'NA',4008,3043,'NA','NA',72.50],
    ['Karongi',29.41,-2.17,2480,'NA',2836,1928,'NA','NA',77.74],
    ['Nyamasheke',29.15,-2.4,4329,'NA',3353,3171,'NA','NA',73.25],
    ['Nyamagabe',29.434,-2.439,2584,'NA',2996,2044,'NA','NA',79.10],
    ['Rutsiro',29.39,-1.86,1239,639,2394,1028,546,85.38,82.97],
    ['Rusizi',28.94,-2.5,900,'NA',995,647,'NA','NA',71.89],
    ['Rulindo',29.96,-1.67,1649,'NA',1849,1471,'NA','NA',89.21],
    ['Gicumbi',30.04,-1.51,2295,'NA',2604,2089,'NA','NA',91.02],
    ['Nyabihu',29.49,-1.68,1940,929,1666,1527,889,95.73,78.71],
    ['Ngororero',29.52,-1.83,968,1805,1150,696,1504,83.32,71.90],
    ['Rubavu',29.33,-1.72,387,'NA',431,371,'NA','NA',95.87]
];

var locs = [
    [1,'August',29.4161,-2.743],
    [2,'August',29.4063,-2.745],
    [3,'October',29.413,-2.757],
    [4,'August',29.4251,-2.656],
    [5,'August',29.4227,-2.648],
    [6,'August',29.4278,-2.633],
    [7,'October',29.427,-2.632],
    [8,'October',29.5098,-2.775],
    [9,'October',29.5052,-2.779],
    [10,'October',29.5033,-2.771],
    [11,'August',29.5368,-2.694],
    [12,'August',29.5888,-2.647],
    [13,'August',29.5864,-2.619],
    [14,'August',29.5847,-2.593],
    [15,'August',29.5771,-2.585],
    [16,'August',29.5709,-2.574]
]

var layer_id=['Tea_farms_census_2017-8kieeo','corporative_data-4k996u','tea_musk_vector_diss_edit-54q76e'];
var layer_src = ['dev0510.4uhv9srz','dev0510.89bph4q2','dev0510.52ks4r0r'];
var layer_colours = ['blue','yellow','red'];
var damageLocations = [
    ['Loc 1'],
    ['Loc 2']
];

// ------ Dropdowns populate -----
// Populate dropdown menu for each district
var dist_drop = document.getElementById('district-dropdown');
for (i in dists){
    var opt = document.createElement('option');
    opt.value = dists[i];
    opt.text = dists[i][0];
    dist_drop.appendChild(opt);
};

var aff_drop = document.getElementById('affected-dropdown');
for (i in locs){
    var opt = document.createElement('option');
    opt.value = i;
    opt.text = 'Location '+locs[i][0];
    aff_drop.appendChild(opt);
};

// ------ Map load ----------
map.on('load', () => {

    // ------Add the district boundaries-------
    map.addSource('your-vector-source', {
        type: 'vector',
        url: 'mapbox://dev0510.8h24xvdp' // Replace with the URL of your vector file
    });

    map.addLayer({
        id: 'vector-boundary-lines',
        type: 'line',
        source: 'your-vector-source',
        'source-layer': 'attachments-7r74eu', // Replace with your source layer name
        paint: {
            'line-color': 'black', // Boundary color
            'line-width': 2 // Boundary line width
        },
        layout: {
            'visibility': 'visible' // Layer visibility (you can toggle this if needed)
        }
    });   
    
    // ------ Add the vector layers --------
    for (let i=0;i<layer_id.length;i++){
        map.addLayer({
            id: layer_id[i],
            type:'fill',
            source: {
                type: 'vector',
                url: 'mapbox://'+layer_src[i]
            },
            'source-layer': layer_id[i],
            paint: {
                'fill-color': layer_colours[i],
                'fill-opacity':((2*i)+3)/10.0
            }
        });
    }

    // ----- Add raster layers and damage polygons -----
    var raster_urls = ['dev0510.ajipjq4z','dev0510.bqj4mfwt','dev0510.ay4mo5bs']; // List of raster layer ids
    // var raster_urls = ['https://drive.google.com/file/d/1wjUYqOCXcuTw_uKZJxFH-aPMjag9zxzZ/view?usp=sharing','mapbox://dev0510.9rdk8b5f','mapbox://dev0510.a39v5k72'];
    for (let i=0;i<raster_urls.length;i++){
        map.addLayer({
            'id': 'raster-image-'+String(i),
            'type': 'raster',
            'source': {
                type: 'raster',
                url: 'mapbox://'+raster_urls[i]
            },
            // 'source-layer': 'your-source-layer', // if applicable
            'minzoom': 0,
            'maxzoom': 22,
            layout: {
                'visibility': 'none' // Layer visibility (you can toggle this if needed)
            },
            paint: {
                'raster-opacity' : 0
            }
        });
    }
    
    map.addLayer({
        id: 'damaged-poly-bounds',
        type: 'line',
        source: {
            type: 'vector',
            url : 'mapbox://dev0510.0dgqcsjj'
        },
        'source-layer': 'damage-bqaobq', // Replace with your source layer name
        paint: {
            'line-color': 'yellow', // Boundary color
            'line-width': 1 // Boundary line width
        },
        layout: {
            'visibility': 'none' // Layer visibility (you can toggle this if needed)
        }
    });

});
 
// ----- After the last frame rendered before the map enters an "idle" state. -------
map.on('idle', () => {

    var fillLayers = ['tea_musk_vector_diss_edit-54q76e','corporative_data-4k996u','Tea_farms_census_2017-8kieeo'];
    var vecToggle = document.getElementById('vectors');
    var rasToggle = document.getElementById('rasters');
        
    // Update the opacity of all fill layers
    for (let i =0;i<fillLayers.length;i++){
        // Add an event listener to update layer opacity when the slider changes
        document.getElementById('opacity-slider-'+String(i+1)).addEventListener('input', function (e) {
            var opacity = parseFloat(e.target.value);
            map.setPaintProperty(fillLayers[i], 'fill-opacity', opacity);
        });
    }
    
    // Update toggle for all vector layers
    vecToggle.addEventListener('change', () => {
        const visibility = vecToggle.checked ? 'visible' : 'none';
        for (i in fillLayers){
            map.setLayoutProperty(fillLayers[i], 'visibility', visibility);
        }   
    });

    rasToggle.addEventListener('change', () => {
        const visibility = rasToggle.checked ? 'visible' : 'none';
        var rasLayIDs = ['raster-image-0','raster-image-1','raster-image-2'];
        var sliderTime = document.getElementById('time-slider');
        map.setPaintProperty('raster-image-0', 'raster-opacity',1);
        map.setLayoutProperty('raster-image-0', 'visibility', visibility);
        map.setLayoutProperty('raster-image-1', 'visibility', visibility);
        map.setLayoutProperty('raster-image-2', 'visibility', visibility);
        sliderTime.addEventListener('input', function (e) {
            var index = parseFloat(e.target.value);
            for (i in rasLayIDs){
                if (rasLayIDs[i].split('-')[2]==index){
                    map.setPaintProperty(rasLayIDs[i], 'raster-opacity',1);
                }
                else {
                    map.setPaintProperty(rasLayIDs[i], 'raster-opacity',0);
                }
            }
        });
        map.setLayoutProperty('damaged-poly-bounds','visibility',visibility); 
    });
});

const toggleButton = document.getElementById('toggle-overlay-button');
const statsButton = document.getElementById('stats-collapse');
const stats = document.getElementById('stats');
const mapOverlay = document.querySelector('.map-overlay');
const mapOverlayContainer = document.querySelector('.map-overlay-container');

// Initially, set the content as visible and the button text as '-'
mapOverlay.style.display = 'block';

toggleButton.addEventListener('click', () => {
    if (mapOverlay.style.display === 'block' ) {
        mapOverlay.style.display = 'none';
        stats.style.display = 'none';
        statsButton.innerHTML=`&#11167;`;
        mapOverlay.style.height = "0px"; // Collapse the overlay
        toggleButton.style.opacity = "75%";
        // mapOverlay.style.maxHeight = null;
    } else {
        mapOverlay.style.display = 'block';
        mapOverlay.style.height = "340px"; 
        // mapOverlay.style.maxHeight =  "300px";
        toggleButton.style.opacity = "95%";
    }
});

statsButton.addEventListener('click', () => {
    if (stats.style.display === 'block' ) {
        stats.style.display = 'none';
        statsButton.innerHTML=`&#11167;`;
    } else {
        stats.style.display = 'block';
        statsButton.innerHTML=`&#11165;`;
    }
});

var months = ['July','August','October'];

// Change raster layer 
var sliderTime = document.getElementById('time-slider');
var month = document.getElementById('month');
var curr = sliderTime.value;
sliderTime.addEventListener('input', function (e) {
    var index = parseFloat(e.target.value);
    var mnt = months[index];
    month.innerHTML= `Selected month : ${mnt}`
});

// Listen for changes in the dropdown
var districtDropdown = document.getElementById('district-dropdown');
districtDropdown.addEventListener('change', function() {
    var selectedOption = districtDropdown.value;
    // ---- FORMAT: District,X,Y,Tea-17,Tea-22,Tea-ver,Over-17,Over-22,%-22,%-17
    if (selectedOption=='All'){
        map.setCenter([29.7,-1.7]);
        map.setZoom(10);
        var para = document.getElementById('stats-p');
        para.innerHTML = `District selected : All
        <br><b>Tea Areas</b>
        <br>Vertify analysis : 24282Ha
        <br>Census 2017 : 22968 Ha
        <br>Corporate 2022 : 3373 Ha
        <br>Overlap with 2022 survey : 18015 Ha
        <br>Overlap with 2017 survey : 2939 Ha
        <br>Overlap with 2017 survey : 2939 Ha <b>(87.13%)</b>
        <br>Overlap with 2022 survey : 18015 Ha <b>(78.44%)</b>`;
        var affPara = document.getElementById('aff-p');
        affPara.innerHTML = `<i>(Current extent of survey is restricted to Nyaruguru district only.)</i>`;
    }
    else if (selectedOption.split(',')[0]=='Nyaruguru'){
        console.log('Hello!');
        var slopt = selectedOption.split(',');
        var coords = [slopt[1],slopt[2]];
        map.setCenter(coords);
        map.setZoom(11);
        var para = document.getElementById('stats-p');
        para.innerHTML = `District selected : ${slopt[0]}
        <br><b>Tea Areas</b>
        <br>Vertify analysis : ${slopt[5]} Ha
        <br>Census 2017 : ${slopt[3]} Ha
        <br>Corporate 2022 : ${slopt[4]} Ha
        <br>Overlap with 2017 survey : ${slopt[6]} Ha <b>(${slopt[9]}%)</b>
        <br>Overlap with 2022 survey : ${slopt[7]} Ha <b>(${slopt[8]}%)</b>`;
        var affPara = document.getElementById('aff-p');
        affPara.innerHTML = `<i>(Select any loaction to view its temporal analysis.)</i>`;
    }
    else {
        var slopt = selectedOption.split(',');
        var coords = [slopt[1],slopt[2]];
        map.setCenter(coords);
        map.setZoom(11);
        var para = document.getElementById('stats-p');
        para.innerHTML = `District selected : ${slopt[0]}
        <br><b>Tea Areas</b>
        <br>Vertify analysis : ${slopt[5]} Ha
        <br>Census 2017 : ${slopt[3]} Ha
        <br>Corporate 2022 : ${slopt[4]} Ha
        <br>Overlap with 2017 survey : ${slopt[6]} Ha <b>(${slopt[9]}%)</b>
        <br>Overlap with 2022 survey : ${slopt[7]} Ha <b>(${slopt[8]}%)</b>`;
        var affPara = document.getElementById('aff-p');
        affPara.innerHTML = `<i>(Current extent of survey is restricted to Nyaruguru district only.)</i>`;
    }    
});

var affDropdown = document.getElementById('affected-dropdown');
affDropdown.addEventListener('change', function() {
    var selOpt = affDropdown.value;
    var locInfo = locs[selOpt];
    map.setCenter([locInfo[2],locInfo[3]]);
    map.setZoom(16);
    console.log(locInfo);
    // ---- FORMAT: District,X,Y,Tea-17,Tea-22,Tea-ver,Over-17,Over-22,%-22,%-17
    var slpt = dists[0];
    var para = document.getElementById('stats-p');
    para.innerHTML = `District selected : ${slpt[0]}
    <br><b>Tea Areas</b>
    <br>Vertify analysis : ${slpt[5]} Ha
    <br>Census 2017 : ${slpt[3]} Ha
    <br>Corporate 2022 : ${slpt[4]} Ha
    <br>Overlap with 2017 survey : ${slpt[6]} Ha <b>(${slpt[9]}%)</b>
    <br>Overlap with 2022 survey : ${slpt[7]} Ha <b>(${slpt[8]}%)</b>`;
    var affPara = document.getElementById('aff-p');
    affPara.innerHTML = `Location selected : Location ${locInfo[0]}
    <br><b>Month affected : ${locInfo[1]}</b>`;
});

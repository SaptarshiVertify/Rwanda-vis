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
    center: [29.7,-1.7],
    zoom: 10,
    // projection: 'natural' // starting projection
    // maxBounds: bounds
});

//  Saving all layers : names and ids (here we also listed their centres in [long,lat] format)
var dists = ['Nyaruguru','Karongi','Nyamasheke','Nyamagabe','Rutsiro','Rusizi','Rulindo','Gicumbi','Nyabihu','Ngororero','Rubavu'];
// var dists_src = ['dev0510.ba0vl8yj','dev0510.96wpl6uc','dev0510.295a24zv','Nyamagabe-78mync','dev0510.2cbpva0i','dev0510.byhp8at6','dev0510.26dn88ay','dev0510.dd557ud4','dev0510.agp7tvfh','dev0510.b4sapel7','dev0510.bairm4hz'];
var dist_centres = [
    [29.5,-2.69],[29.41,-2.17],[29.15,-2.4],[29.434,-2.439],[29.39,-1.86],[28.94,-2.5],[29.96,-1.67],[30.04,-1.51],[29.49,-1.68],[29.52,-1.83],[29.33,-1.72]
];
var dist_areas = [100834,99002.6,117195,109220,116185,95824.6,56841.6,83014.5,53840,67731.2,38446.8];
var tea_areas = [4008,2821,3170,2967,1851,804,1716,2478,1585,1101,389];

var layer_id=['Tea_farms_census_2017-8kieeo','corporative_data-4k996u','tea_musk_vector_diss_edit-54q76e'];
var layer_src = ['dev0510.4uhv9srz','dev0510.89bph4q2','dev0510.52ks4r0r'];
var layer_colours = ['blue','yellow','red']

// Populate dropdown menu for each layer
var dist_drop = document.getElementById('district-dropdown');
for (i in dists){
    var opt = document.createElement('option');
    opt.value = dists[i];
    opt.text = dists[i];
    dist_drop.appendChild(opt);
};

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

    // -----------Add raster and damage area polygons ------
    // map.addSource('raster-source', {
    //     type: 'raster',
    //     url: 'mapbox://dev0510.877dyjzv'
    // });

    // Change raster layer 

    var raster_urls = ['dev0510.877dyjzv','dev0510.9rdk8b5f','dev0510.a39v5k72'];
    for (let i=0;i<raster_urls.length;i++){
        console.log(i);
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
    
    map.addSource('damaged-poly', {
        type: 'vector',
        url : 'mapbox://dev0510.0dgqcsjj'
        // url: 'mapbox://dev0510.0dgqcsjj' // Replace with the URL of your vector file
    });

    map.addLayer({
        id: 'damaged-poly-bounds',
        type: 'line',
        source: 'damaged-poly',
        'source-layer': 'damage-bqaobq', // Replace with your source layer name
        paint: {
            'line-color': 'yellow', // Boundary color
            'line-width': 3 // Boundary line width
        },
        layout: {
            'visibility': 'none' // Layer visibility (you can toggle this if needed)
        }
    });

});
 
// After the last frame rendered before the map enters an "idle" state.
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


    // If the affected layers were not added to the map, abort
	// if (!map.getLayer('raster-image')) {
    //     return;
    // }
    // Update toggle for all affected layers
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
        stats.style.display = 'none'
        // toggleButton.innerHTML = "Layers &#129147;";
        mapOverlay.style.height = "0px"; // Collapse the overlay
        toggleButton.style.opacity = "75%";
        // mapOverlay.style.maxHeight = null;
    } else {
        mapOverlay.style.display = 'block';
        // toggleButton.innerHTML = "Layers &#129145;"
        mapOverlay.style.height = "330px"; 
        // mapOverlay.style.maxHeight =  "300px";
        toggleButton.style.opacity = "95%";
    }
});

statsButton.addEventListener('click', () => {
    if (stats.style.display === 'block' ) {
        stats.style.display = 'none';
        // toggleButton.innerHTML = "Layers &#129147;";
        // stats.style.height = "0px"; // Collapse the overlay
        // toggleButton.style.opacity = "75%";
        // mapOverlay.style.maxHeight = null;
    } else {
        stats.style.display = 'block';
        // toggleButton.innerHTML = "Layers &#129145;"
        // mapOverlay.style.height = "330px"; 
        // mapOverlay.style.maxHeight =  "300px";
        // toggleButton.style.opacity = "95%";
    }
});

var months = ['June','July','October','Dec'];

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
    if (selectedOption=='All'){
        map.setCenter([29.7,-1.7]);
        map.setZoom(10);
        var para = document.getElementById('stats-p');
        para.innerHTML = `District selected : All<br>Total area : 938135.3 Ha<br>Tea plantation area : 22890Ha`;
    }
    else {
        var coords = dist_centres[dists.indexOf(selectedOption)];
        map.setCenter(coords);
        map.setZoom(11);
        var para = document.getElementById('stats-p');
        var tot_ar = dist_areas[dists.indexOf(selectedOption)];
        var tea_ar = tea_areas[dists.indexOf(selectedOption)];
        para.innerHTML = `District selected : ${selectedOption}<br>Total area : ${tot_ar}Ha<br>Tea plantation area : ${tea_ar}Ha`;
    }
});
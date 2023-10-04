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

var layer_id=['tea_musk_vector_diss-1b2wcy'];
var layer_src = ['dev0510.0peqplg6'];

// Populate dropdown menu for each layer
var dist_drop = document.getElementById('district-dropdown');
for (i in dists){
    var opt = document.createElement('option');
    opt.value = dists[i];
    opt.text = dists[i];
    dist_drop.appendChild(opt);
};

map.on('load', () => {
    map.addSource('your-vector-source', {
        type: 'vector',
        url: 'mapbox://dev0510.8h24xvdp' // Replace with the URL of your vector file
    });

    map.addLayer({
        id: 'vector-boundaries',
        type: 'fill',
        source: 'your-vector-source',
        'source-layer': 'attachments-7r74eu', // Replace with your source layer name
        paint: {
            'fill-color': 'transparent', // Transparent fill
            'fill-outline-color': 'blue', // Boundary color
            'fill-opacity': 0.5 // Adjust fill opacity as needed (0 for completely transparent)
        },
        layout: {
            'visibility': 'visible' // Layer visibility (you can toggle this if needed)
        }
    });

    // Add a boundary line layer on top of the filled polygons
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
    
    for (i=0;i<layer_id.length;i++){
        map.addLayer({
            id: layer_id[i],
            type:'fill',
            source: {
                type: 'vector',
                url: 'mapbox://'+layer_src[i]
            },
            'source-layer': layer_id[i],
            paint: {
                'fill-color': 'red',
                'fill-opacity':0.3
            }
        });
    }
});
 
// After the last frame rendered before the map enters an "idle" state.
map.on('idle', () => {
	// Add an event listener to update layer opacity when the slider changes
    document.getElementById('opacity-slider').addEventListener('input', function (e) {
        var opacity = parseFloat(e.target.value);

        // Update the opacity of all fill layers
        layer_id.forEach(function (layerId) {
            map.setPaintProperty(layerId, 'fill-opacity', opacity);
        });
    });

});

const toggleButton = document.getElementById('toggle-overlay-button');
const mapOverlay = document.querySelector('.map-overlay');
const mapOverlayContainer = document.querySelector('.map-overlay');

// Initially, set the content as visible and the button text as '-'
mapOverlay.style.display = 'block';

toggleButton.addEventListener('click', () => {
    if (mapOverlay.style.display === 'block' ) {
        mapOverlay.style.display = 'none';
        mapOverlayContainer.style.height = '40px';
        toggleButton.innerHTML = "Layers &#129147;";
    } else {
        mapOverlay.style.display = 'block';
        toggleButton.innerHTML = "Layers &#129145;"
        mapOverlayContainer.style.height = '140px';
        mapOverlay.style.backgroundcolor = 'white';
    }
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
        map.setZoom(12);
        var para = document.getElementById('stats-p');
        var tot_ar = dist_areas[dists.indexOf(selectedOption)];
        var tea_ar = tea_areas[dists.indexOf(selectedOption)];
        para.innerHTML = `District selected : ${selectedOption}<br>Total area : ${tot_ar}Ha<br>Tea plantation area : ${tea_ar}Ha`;
    }
});
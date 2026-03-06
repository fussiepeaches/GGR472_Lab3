mapboxgl.accessToken = 'pk.eyJ1IjoiamFkYW1zZm9uZyIsImEiOiJjbWxpZjE4NXIwMmJtM2RwcTFzajJqNjF2In0.MS7dCtCbDqftMB_SOiiPgA';
const map = new mapboxgl.Map({
    container: 'my-map',
    style: 'mapbox://styles/jadamsfong/cmmf99pbd00oa01qrge9jecdt',
    center: [139.658, 35.673],
    zoom: 9.94,
    minZoom: 3
});
// limiting to japan only
map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        countries: "jp"
    })
);
// adding zoom to map
map.addControl(new mapboxgl.NavigationControl());

// using raw geojson 
map.on('load', () => {

    map.addSource('japan-tourist', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/fussiepeaches/GGR472_Lab3/refs/heads/main/japan_map%20(1).geojson',
        'generateId': true
    });
    // making markers change colour depending on classification, in the geojson file i did it by type of place to visit e.g. shopping, food, etc. so i have used match and category to retrive the property value and assign different colours
    map.addLayer({
        'id': 'japan-tourist-points',
        'type': 'circle',
        'source': 'japan-tourist',
        'paint': {
            'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                9, 5,
                12, 10
            ],
            'circle-color': [
                'match',
                ['get', 'category'],
                'food', '#185947',
                'shopping', '#ed7c1f',
                'museum', '#1f6896',
                'experience', '#731455',
                '#675555'],
            'circle-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                1,
                0.6
            ]
        }
    });

    // adding labels of the places to the map using name property
    map.addLayer({
        'id': 'japan-tourist-labels',
        'type': 'symbol',
        'source': 'japan-tourist',
        'layout': {
            'text-field': ['get', 'name'],
            'text-variable-anchor': ['bottom'],
            'text-radial-offset': 0.5,
            'text-justify': 'auto'
        },
        'paint': {
            'text-color': 'black'
        }
    });

});
// click event pop-up
map.on('mouseenter', 'japan-tourist-points', () => {
    map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', 'japan-tourist-points', () => {
    map.getCanvas().style.cursor = '';
});

map.on('click', 'japan-tourist-points', (e) => {
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML("<b>Name:</b> " + e.features[0].properties.name + "<br>" +
            "<b>Category:</b> " + e.features[0].properties.category)
        .addTo(map);
});
// hover event
let pointID = null;

map.on('mousemove', 'japan-tourist-points', (e) => {

    // reset hover to last point hovered on
    map.setFeatureState(
        { source: 'japan-tourist', id: pointID },
        { hover: false }
    );
    // make marker more opaque when hovering on it
    pointID = e.features[0].id;
    map.setFeatureState(
        { source: 'japan-tourist', id: pointID },
        { hover: true }
    );

});
// when mouse leaves point its on, marker goes back to normal state
map.on('mouseleave', 'japan-tourist-points', () => {

    map.setFeatureState(
        { source: 'japan-tourist', id: pointID },
        { hover: false }
    );

    pointID = null;
});
// flitering button options by category, e.g. 'all' will have no filter and thus show all points on map, clicking 'shopping' will show only shopping points. side note: AI and some googling was used here to help me figure out how to connect the buttons
document.getElementById('btn-all').addEventListener('click', () => {
        map.setFilter('japan-tourist-points', null);
    });

    document.getElementById('btn-food').addEventListener('click', () => {
        map.setFilter('japan-tourist-points', ['==', ['get', 'category'], 'food']);
    });

    document.getElementById('btn-shopping').addEventListener('click', () => {
        map.setFilter('japan-tourist-points', ['==', ['get', 'category'], 'shopping']);
    });

    document.getElementById('btn-museum').addEventListener('click', () => {
        map.setFilter('japan-tourist-points', ['==', ['get', 'category'], 'museum']);
    });

    document.getElementById('btn-experience').addEventListener('click', () => {
        map.setFilter('japan-tourist-points', ['==', ['get', 'category'], 'experience']);
        });

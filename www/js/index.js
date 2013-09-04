var app = {
    
    initialize: function() {
        this.bindEvents();
    },
    
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    
    onDeviceReady: function() {
        initMap();
    }
};

var p, l;

function onSuccess(position) {
    
    if(p) { map.removeLayer(p); }
    if(l) { map.removeLayer(l); }
    var latlng = new L.LatLng(position.coords.latitude, position.coords.longitude);
    map.setView(latlng, 16);
    
    var radius = position.coords.accuracy / 2;
    
    l = L.marker(latlng);
    l.addTo(map);
    
    p = L.circle(latlng, radius);
    p.addTo(map);
}


function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

$(document).delegate('#locateme', 'click', function() {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
                     });

var dataJSON = (function () {
    var dataJSON = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': 'cdm.json',
        'dataType': "json",
        'success': function (data) {
            dataJSON = data;
        }
    });
    return dataJSON;
})();
	
    
L.MarkerClusterGroup.include({
    fromGeoJSON: function (geojson) {
        this._geojson = geojson;
        this.filter();
    },

    filter: function (f) {
        f = f || function (m) { return true; }
        var markers = Array();
        for (var i = 0; i < this._geojson.features.length; i++) {
            var a = this._geojson.features[i];
            if (!f(a)) { continue; }
            var title = a.title;
            var description = a.description;
            var mediaid = a.media_id;
            var file = a.file;
            var author = a.author + ' ' + a.fname + ' ' + a.lname;
            var marker = L.marker(
            	new L.LatLng(
            		a.geometry.coordinates[0], a.geometry.coordinates[1]), {
						icon: L.mapbox.marker.icon({'marker-symbol': 'marker-stroked', 'marker-color': '#3c4e5a'}),
						title: title
					}
				);
                             marker.bindPopup('<b>'+title+'</b><br><i>'+author+'</i><br><a href="#" onclick="displayThumb(jQuery(this));return false;" id="thumb" data-internalid="'+mediaid+'/'+file+'"><img src="http://www.mp2013.fr/chercheursdemidi/files/cdm_medias/thumb/'+mediaid+'/'+file+'"></a>', {minWidth: 200});
            markers.push(marker);
        }
        this.clearLayers();
        this.addLayers(markers);
    }
});

var map;

function initMap(){

	resizeMap();

	var resizeTimer;
	$(window).resize(function() {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(resizeMap, 100);
	});

	setTimeout(function() {

		map = L.map('map').setView([43.2964, 5.3700], 12);
		
		// add an OpenStreetMap tile layer
		L.tileLayer('http://{s}.tile.cloudmade.com/0324b552fba24c6fa57a264112251a3c/1714/256/{z}/{x}/{y}.png', {
		    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);
	    
	    map.on('error', function (e) {
	        console.log(e);
	    })
	    var cluster = new L.MarkerClusterGroup();
	    map.addLayer(cluster);
	    
	    cluster.fromGeoJSON(dataJSON);
	    map.addLayer(cluster);

	}, 400);
    
    //jQuery("#welcomePop").popup("open");
}

function displayThumb(a) {
	
    var imgbig = "http://www.mp2013.fr/chercheursdemidi/files/cdm_medias/grande/" + jQuery(a).attr('data-internalid');
    jQuery("#imgbig").attr("src", imgbig);
    setTimeout(function(){
        jQuery("#imgPop").popup("open");
    }, 100); 
   
};

function resizeMap() {

	var mapheight = $(window).height();
	var mapwidth = $(window).width();
	$("#map").height(mapheight);
	$("#map").width(mapwidth);

}

var lat = 0;
var lng = 0;


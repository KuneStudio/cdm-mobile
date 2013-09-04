var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

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
            marker.bindPopup('<b>'+title+'</b><br><i>'+author+'</i><br><a href="#" onclick="displayThumb(jQuery(this));return false;" id="thumb" data-internalid="'+mediaid+'/'+file+'"><img src="http://www.mp2013.fr/chercheursdemidi/files/cdm_medias/thumb/'+mediaid+'/'+file+'"></a>');
            markers.push(marker);
        }
        this.clearLayers();
        this.addLayers(markers);
    }
});

 
 
    /*
    var map = L.mapbox.map('map', 'krisis.map-64yfiziu',  {markerLayer: false});
    */
    



jQuery('.chktax').on('click', function(e) {
	//console.log(jQuery(":checked.chktax"));
	var allChecked = {};
	var cat = [];
	jQuery(".chktax:checked").each(function(i, elem){
        var name = elem.name;
        allChecked[name] = allChecked[name] || [];
        cat = cat || []
        allChecked[name].push(elem.value);
        cat.push(elem.value);
    });
	//console.log(cat);
	
	
	cluster.filter(function (m) {
    	return superbag(m.properties['categories'], cat);
    });
	
});

function superbag(sup, sub) {
    sup.sort();
    sub.sort();
    var i, j;
    for (i=0,j=0; i<sup.length && j<sub.length;) {
        if (sup[i] < sub[j]) {
            ++i;
        } else if (sup[i] == sub[j]) {
            ++i; ++j;
        } else {
            // sub[j] not in sup, so sub not subbag
            return false;
        }
    }
    // make sure there are no elements left in sub
    return j == sub.length;
}


var map, minimal, midnightCommander, motorways
var waypoints = [];
var direction_pos = 0;


jQuery("#mymap").on('pageinit', function() {

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


});

function displayThumb(a) {
	
    var imgbig = "http://www.mp2013.fr/chercheursdemidi/files/cdm_medias/grande/" + jQuery(a).attr('data-internalid');
    console.log(imgbig);
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


document.addEventListener("deviceready", onDeviceReady, false);

    
function onDeviceReady() {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

function onSuccess(position) {
    
    var latlng = new L.LatLng(position.coords.latitude, position.coords.longitude);
    map.setView(latlng, 16);
    
    var radius = position.coords.accuracy / 2;

    L.marker(latlng).addTo(map);

    L.circle(latlng, radius).addTo(map);
}

    
function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}


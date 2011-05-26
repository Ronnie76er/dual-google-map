

dualmap.prototype = {
  
    map1: null,
    map2: null,
    geocoder: null,
    marker1: new google.maps.Marker(),
    marker2: new google.maps.Marker(),    
    
    mapHtml: '  \
        <div style="height:100%; width:45%;float:left;  margin: 10px"> \
            <div id="map_canvas" style="height: 100%; width:100%;"></div> \
            Location Name: <input type="text" id="location1" style="width: 50%"/> \
        </div> \
        <div style="height:100%; width:45%;  float:left; margin: 10px"> \
            <div id="map_canvas2" style="height: 100%; width:100%; "></div> \
            Location Name: <input type="text" id="location2" style="width: 50%"/> \
        </div> \
        ',
    
    initialize:function(divId){
        var jqueryDivId = '#'+divId;
        $(jqueryDivId).html(this.mapHtml);
        
        //New york
        var latlng = new google.maps.LatLng(40.77, -73.98);
        var myOptions = {
            zoom: 8,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.HYBRID
        };
        var mapElem1 = $("#map_canvas")
        
        this.map1 = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
        
        //Los Angeles
        myOptions.center = new google.maps.LatLng(33.93, -118.40);
        
        this.map2 = new google.maps.Map(document.getElementById("map_canvas2"), myOptions);
        
        google.maps.event.addListener(this.map1, 'zoom_changed', $.proxy(this.handleZoom1, this));
        google.maps.event.addListener(this.map2, 'zoom_changed', $.proxy(this.handleZoom2, this));
        
        this.geocoder = new google.maps.Geocoder();
        
        $("#location1").keyup($.proxy(this.onKeyup, this));
        $("#location2").keyup($.proxy(this.onKeyup, this));
        
    },
    
    onKeyup: function(event){
        if(event.keyCode == 13) {
            var mapToChange;
            if(event.currentTarget.id == 'location1')
                mapToChange = this.map1;
            else
                mapToChange = this.map2;
            this.submitAddress(mapToChange, event.currentTarget)
        }
    }, 
  
    handleZoom1: function() {
        if(this.map1.getZoom() != this.map2.getZoom())
            this.map2.setZoom(this.map1.getZoom());
    },
  
    handleZoom2: function() {
        if(this.map1.getZoom() != this.map2.getZoom())
            this.map1.setZoom(this.map2.getZoom());
    },
  
    submitAddress: function(map, element) {
        var address = $(element).val();
        if(element.id == "location1")
            this.geocoder.geocode({'address': address}, $.proxy(this.panMap1, this));
        else
            this.geocoder.geocode({'address': address}, $.proxy(this.panMap2, this));
   
    },
    
    panMap1: function(results, status) {
        this.panMap(this.map1, this.marker1, results, status);    
    },
    
    panMap2: function(results, status) {
           this.panMap(this.map2, this.marker2, results, status);    
    },
  
    panMap: function(map, marker, results, status) {
        if(status == google.maps.GeocoderStatus.OK){
            map.setCenter(results[0].geometry.location);
            map.fitBounds(results[0].geometry.viewport);
            marker.setMap(map);
            marker.setPosition(results[0].geometry.location);
        }
    }
};


function dualmap(divname) {
    dualmap.prototype.initialize(divname);    
}


// checks if key is present in array
// used to filter results
function checkInArray(key, arr) {
    for (var i=0; i<arr.length; i++){
        if(arr[i].includes(key)){
            return true;
        }
    }
    return false;
}

// create map
var mymap = L.map('main').setView([0, 0], 2);

// add tile layer
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
maxZoom: 18,
attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
id: 'mapbox.streets'
}).addTo(mymap);

searchterm = "";
handleFilter = () => {
    // remove markers
    for(var i = 0; i < this.markers.length; i++){
    this.mymap.removeLayer(this.markers[i]);
    }
    //update searchterm
    searchterm = document.getElementById("filter").value;
    fetchStudents(searchterm);
}
//fetching JSON data
fetchStudents(searchterm);

//track markers
markers = [];

function fetchStudents(searchterm)
{    fetch('http://mappy.dali.dartmouth.edu/members.json')
      .then((resp) => {
            return resp.json();
        })
      .then((data) => {
            data.filter((student) => {
                if (checkInArray(searchterm, student.terms_on)){ // filter by user input
                    return student;
                }
            })

            .map((student) => {
            //prepare custom icons to be added to markers
            var customIcon = L.icon({
                iconUrl: `http://mappy.dali.dartmouth.edu/${student.iconUrl}`,
                iconSize:     [40, 40],
                className: 'icons'
            });

            //add markers
            var marker = L.marker(student.lat_long, {icon: customIcon}).addTo(mymap);
            marker.bindPopup(`Name: ${student.name}<br>Message: ${student.message}<br>URL: ${student.url}<br>Project: ${student.project}<br>Terms On: ${student.terms_on}`);
            
            this.markers.push(marker);
            console.log(this.markers);
        })
    })
    .catch(function(e){
        console.log('Error fetching ', e);
    })
}
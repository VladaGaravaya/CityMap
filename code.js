function CityMap () {
    this.citiesAndCoords = localStorage.getItem('CityMap');
    this.cityMap = parse(this.citiesAndCoords);

    //Return the name of the northernmost, easternmost, southernmost or westernmost city
    //from the list, as requested by the caller.
    this.themost = function(cardinalPoint) {
        let coord;
        let city = '';
        this.cityMap.forEach(element => {
            if(cardinalPoint === 'northern' && (+element[2] > coord || typeof coord == "undefined")) {
                coord = element[2];
                city = element[0].slice(1);
            }
            if(cardinalPoint === 'eastern' && (+element[2] < coord || typeof coord == "undefined")) {
                coord = element[2];
                city = element[0].slice(1);
            }
            if(cardinalPoint === 'southern' && (+element[3] < coord || typeof coord == "undefined")) {
                coord = element[3]; 
                city = element[0].slice(1);
            }
            if(cardinalPoint === 'western' && (+element[3] > coord || typeof coord == "undefined")) {
                coord = element[3];
                city = element[0].slice(1);
            }
        });
        
        return city;
    }

    //Pass longitude and latitude as parameters, and return the name of the city that is closest
    //to that location.
    this.nearestCity = function(longitude, latitude) {
        let minDistance, city;
        this.cityMap.forEach(element => {
            let distance = Math.pow(Math.pow(element[2]-longitude, 2)+Math.pow(element[3]-latitude, 2), 0.5);
            if(distance < minDistance || typeof minDistance === "undefined") {
                minDistance = distance;
                city = element[0].slice(1);
            }
        });
        return city;
    }

    //Return a single string containing just the state abbreviations from the list of cities, each
    //separated by a space. The method should eliminate duplicate states. The result string
    //should not have leading or trailing spaces.
    this.states = function() {
        let states = this.cityMap.map( element => element[1].slice(1, -1));
        let result = [];

        for (let state of states) {
          if (!result.includes(state)) {
            result.push(state);
          }
        }
      
        return result.join(" ");
    }

    this.statesForD3 = function() {
        let states = {};
        this.cityMap.forEach( element => {
            if(typeof states[element[1].slice(1, -1)] === "undefined") {
                states[element[1].slice(1, -1)] = 1;
            }
            else {
                states[element[1].slice(1, -1)]++;
            }
        });
        return states;
    }

    // show list of cities of the state
    this.searchByState = function(state) {
        let cities = [];
        this.cityMap.forEach(element => {
            if(element[1].slice(1, -1) === state) {
                cities.push(element[0].slice(1));
            }
        });
        return cities;
    }

    this.searchByState = function(state) {
        let cities = [];
        this.cityMap.forEach(element => {
            if(element[1].slice(1, -1) === state) {
                cities.push(element);
            }
        });
        return cities;
    }
}

//const CITYMAP = '"Nashville, TN", 36.17, -86.78;"New York, NY", 40.71, -74.00;"Atlanta, GA", 33.75, -84.39;"Denver, CO", 39.74, -104.98;"Seattle, WA", 47.61, -122.33;"Los Angeles, CA", 34.05, -118.24;"Memphis, TN", 35.15, -90.05;';
//localStorage.setItem('CityMap', CITYMAP);

function parse(cities) {
    let toArray = [];
    cities.substring(0, cities.length - 1).split(';').forEach(element => {
        if(element) return toArray.push(element.split(','));
    });
    return toArray;
}

let citiesMap = new CityMap();
showTable(citiesMap.cityMap);

function showTable(cities) {
    let table = `<th>City</th><th>State</th><th>Longitude</th><th>Latitude</th>`;
    
    cities.forEach( element => {
        table += `<tr>
        <td>${element[0].slice(1)}</td>
        <td>${element[1].slice(0,-1)}</td>
        <td>${element[2]}</td>
        <td>${element[3]}</td>
        </tr>`;
    });
    document.getElementById('list').innerHTML = table;

    document.getElementById("north").innerText = citiesMap.themost('northern');
    document.getElementById("south").innerText = citiesMap.themost('southern');
    document.getElementById("east").innerText = citiesMap.themost('eastern');
    document.getElementById("west").innerText = citiesMap.themost('western');
};

document.getElementById('buttonSearch').addEventListener('click', () => {
    let stringForSearch = document.getElementById("search").value;
    if(stringForSearch) {
        showTable(citiesMap.searchByState(stringForSearch));
    }
    else {
        showTable(citiesMap.cityMap);
    }
});

document.getElementById('input').addEventListener('click', () => {
    let city = prompt('Input city.');
    let state = prompt('Input state.');
    let long = prompt('Input longitude.');
    let lat = prompt('Input latitude.');
    let newCityMap = localStorage.getItem('CityMap')+`"${city}, ${state}", ${long}, ${lat};`;
    localStorage.setItem('CityMap', newCityMap);
    citiesMap.citiesAndCoords = newCityMap;
    citiesMap.cityMap = parse(newCityMap);
    showTable(citiesMap.cityMap);
});
citiesMap.statesForD3();

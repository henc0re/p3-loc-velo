class MapModel {
    constructor () {
        this.lat = 43.60426;
        this.lon = 1.44367;
        this.zoom = 13;
        this.macarte = L.map('map',{scrollWheelZoom: false}).setView([this.lat, this.lon], this.zoom);
        this.tilelayer = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png').addTo(this.macarte);
        this.ajaxUrl = "https://api.jcdecaux.com/vls/v1/stations?contract=toulouse&apiKey=110bb2109635584660d15785866f72ba75aa09d8";
        this.detailsWindow = document.getElementById('details-window');
        this.statutStation = document.getElementById('info-statut-station');
        this.stationName = document.getElementById('info-station-name');
        this.stationAddress = document.getElementById('info-station-address');
        this.stationPotentialBikes = document.getElementById('info-station-bikes-potential');
        this.stationAvailableBikes = document.getElementById('info-station-bikes');
        this.marker;
        this.markerClusters = L.markerClusterGroup();
        this.stations;
        this.station;
        this.greenIcon = new L.Icon({
            iconUrl: 'img/icons/greenIcon.png',
            shadowUrl: 'img/icons/marker-shadowIcon.png',
            iconSize:     [25, 41],
            shadowSize:   [41, 41],
            iconAnchor:   [12, 41],
            shadowAnchor: [4, 41],
            popupAnchor:  [1, -34],
        });
        this.orangeIcon = new L.Icon({
            iconUrl: 'img/icons/orangeIcon.png',
            shadowUrl: 'img/icons/marker-shadowIcon.png',
            iconSize:     [25, 41],
            shadowSize:   [41, 41],
            iconAnchor:   [12, 41],
            shadowAnchor: [4, 41],
            popupAnchor:  [1, -34],
        });
        this.redIcon = new L.Icon({
            iconUrl: 'img/icons/redIcon.png',
            shadowUrl: 'img/icons/marker-shadowIcon.png',
            iconSize:     [25, 41],
            shadowSize:   [41, 41],
            iconAnchor:   [12, 41],
            shadowAnchor: [4, 41],
            popupAnchor:  [1, -34],
        });
        this.blackIcon = new L.Icon({
            iconUrl: 'img/icons/blackIcon.png',
            shadowUrl: 'img/icons/marker-shadowIcon.png',
            iconSize:     [25, 41],
            shadowSize:   [41, 41],
            iconAnchor:   [12, 41],
            shadowAnchor: [4, 41],
            popupAnchor:  [1, -34],
        });
        this.mapInteract();
        //this.ajaxOK();
    } // fin du constructor
    ajaxGet(url, callback) {    
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "json";
        xhr.send();
        xhr.onreadystatechange = () => {
            if (xhr.readyState == xhr.DONE && xhr.status == 200) {
                callback(xhr.response);

            }
            else if (xhr.readyState ==! 4 && this.status ==! 200) {
                console.log("error - " + xhr.status +  " " + xhr.readyState);
            }
        }
    }
    /*
    ajaxOK() {
        this.ajaxGet(this.ajaxUrl, (response) => {
            this.stations = response;
        console.log(this.stations);

        })
        console.log(this.stations);
    }
    */
    mapInteract() {
        this.ajaxGet(this.ajaxUrl, (response) => {
            this.stations = response;
            this.stations.forEach(station => {
                if(station.status === "OPEN" && station.available_bikes >= 4) { // si ouvert et velos >= 4 = icone verte
                veloMap.marker = L.marker([station.position.lat, station.position.lng], {icon: veloMap.greenIcon});
                }
                else if (station.status === "OPEN" && station.available_bikes < 4 && station.available_bikes >= 1) { // si ouvert et velo entre 1 et 3 = icone orange
                veloMap.marker = L.marker([station.position.lat, station.position.lng], {icon: veloMap.orangeIcon});
                }
                else if (station.status === "OPEN" && station.available_bikes == 0) { // si ouvert mais 0 velo = icone rouge
                veloMap.marker = L.marker([station.position.lat, station.position.lng], {icon: veloMap.redIcon});
                }
                else if (station.status === "CLOSED") { // si ferme = icone noire
                veloMap.marker = L.marker([station.position.lat, station.position.lng], {icon: veloMap.blackIcon});
                }
                veloMap.marker.addEventListener('click', () => { // ecoute au clic des markers et affiche les infos de la station selectionnee
                    this.detailsWindow.style.display="block";
                    veloResa.dontGoFurther();
                    if (station.status === "OPEN" && station.available_bikes >= 1) {
                        this.statutStation.innerHTML = "Station ouverte";
                        this.stationName.innerHTML = station.name.toLowerCase();
                        this.stationAddress.innerHTML = station.address.toLowerCase();
                        this.stationPotentialBikes.innerHTML = station.available_bike_stands;
                        this.stationAvailableBikes.innerHTML = station.available_bikes;
                        veloMap.station = station;
                        veloResa.goFurther();
                    }
                    else if (station.status === "OPEN" && station.available_bikes === 0) {
                        this.statutStation.innerHTML = "Station vide. Impossible de réserver.";
                        this.stationName.innerHTML = station.name.toLowerCase();
                        this.stationAddress.innerHTML = station.address.toLowerCase();
                        this.stationPotentialBikes.innerHTML = station.available_bike_stands;
                        this.stationAvailableBikes.innerHTML = station.available_bikes;
                        veloResa.dontGoFurther();
                    }
                    else if (station.status === "CLOSED") {
                        station.status = "Station fermée. Impossible de réserver.";
                        this.stationName.innerHTML = station.name.toLowerCase();
                        this.stationAddress.innerHTML = station.address.toLowerCase();
                        veloResa.dontGoFurther();
                    };
                });
            veloMap.markerClusters.addLayer(veloMap.marker);
            veloMap.macarte.addLayer(veloMap.markerClusters);
            });
        })
    } 
}

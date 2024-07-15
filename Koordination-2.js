

function auswertungHeute() {
    
var city = document.getElementById("ort").value;
var urlo = "https://nominatim.openstreetmap.org/search?q="+city+"&format=json";
    console.log(urlo);
    
fetch(urlo)
    .then((response) => {return response.json()})
    .then((ortdata) => {
    var latitude = ortdata[0].lat;
    var longitude = ortdata[0].lon;

    
var urlw = "https://api.open-meteo.com/v1/forecast?latitude="+latitude+"&longitude="+longitude+"&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,uv_index_clear_sky_max,rain_sum,snowfall_sum,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant";
    
fetch(urlw)
    .then((response) => {return response.json()})
    .then((data) => {var tage = document.getElementById("anzahl").value;
    for(var i = 0; i < tage; i++){
    console.log(data.daily.time[i]);
    
    //Zeit ins deutsche Format stellen
    var datum = data.daily.time[i];
    var teilerz = datum.indexOf("-");
    var jahr = datum.substring(0, teilerz);
    datum = datum.substring(teilerz+1);
    teilerz = datum.indexOf("-");
    var monat = datum.substring(0, teilerz);
    datum = datum.substring(teilerz+1); //datum enthält nur noch Tagesziffer
    console.log(datum+"."+monat+"."+jahr);
    
    
    //Berechnung korrekte Uhrzeit Sonnenaufgang
    var sonnenaufgang = data.daily.sunrise[i].indexOf("T");
    sonnenaufgang = data.daily.sunrise[i].substring(sonnenaufgang+1);
    var teilerag = sonnenaufgang.indexOf(":");
    var stundeag = parseInt(sonnenaufgang.substring(0, teilerag));
    stundeag += 2;
    var minuteag = sonnenaufgang.substring(teilerag);
    
    //Berechnung korrekte Uhrzeit Sonnenuntergang
    var sonnenuntergang = data.daily.sunset[i].indexOf("T");
    sonnenuntergang = data.daily.sunset[i].substring(sonnenuntergang+1);
     var teilerug = sonnenuntergang.indexOf(":");
    var stundeug = parseInt(sonnenuntergang.substring(0, teilerug));
    stundeug += 2;
    var minuteug = sonnenuntergang.substring(teilerug);
    
    //Berechnung Tageslichtdauer
    var sekundend = Math.trunc(parseInt(data.daily.daylight_duration[i])); //Sekunden
    var minutend = Math.trunc(sekundend/60); //Minuten
    sekundend -= (minutend*60); 
    if(sekundend<10){sekundend = "0" + sekundend;};
    var stundend = Math.trunc(minutend/60); //Stunden
    minutend -= (stundend*60);
    
    //Berechnung Sonnenscheindauer
    var sekundens = Math.trunc(parseInt(data.daily.sunshine_duration[i])); //Sekunden
    var minutens = Math.trunc(sekundens/60); //Minuten
    sekundens -= (minutens*60); 
    if(sekundens<10){sekundens = "0" + sekundens;};
    var stundens = Math.trunc(minutens/60); //Stunden
    minutens -= (stundens*60);
    
    //Berechnung Windrichtung
    var grad = parseInt(data.daily.wind_direction_10m_dominant[i]);
    var richtung = "";
    if(0<= grad <22){ richtung = "Nord";
     } else if (22<= grad <45){ richtung = "Nordnordost";
     } else if (45<= grad <67){ richtung = "Nordost"; 
     } else if (67<= grad <90){ richtung = "Ostnordost"; 
     } else if (90<= grad <112){ richtung = "Ost"; 
     } else if (112<= grad <135){ richtung = "Ostsüdost";                         
     } else if (135<= grad <157){ richtung = "Südost";
     } else if (157<= grad <180){ richtung = "Südsüdost"; 
     } else if (180<= grad <202){ richtung = "Süd"; 
     } else if (202<= grad <225){ richtung = "Südsüdwest"; 
     } else if (225<= grad <247){ richtung = "Südwest";                         
     } else if (247<= grad <270){ richtung = "Westsüdwest"; 
     } else if (270<= grad <292){ richtung = "West"; 
     } else if (292<= grad <315){ richtung = "Westnordwest"; 
     } else if (315<= grad <337){ richtung = "Nordwest";                            
     } else { richtung = "Nordnordwest"};
    
    var element = "tag"+(i+1);
    
    document.getElementById(element).innerHTML = "<h2>"+datum+"."+monat+"."+jahr+"</h2>"
                                                 +"<p>Maximale Temperatur: " + data.daily.temperature_2m_max[i] + "°C</p>"
                                                 +"<p>Minimale Temperatur: " + data.daily.temperature_2m_min[i] + "°C</p>"
                                                 +"<p>Sonnenaufgang: "  + stundeag + minuteag + " Uhr</p>"
                                                 +"<p>Sonnenuntergang: "  + stundeug + minuteug  + " Uhr</p>"
                                                +"<p>Tageslichtdauer: "+stundend+":"+minutend+":"+sekundend+" <span style='font-style: italic; font-size=50%'><br>(Stunden:Minuten:Sekunden)</span></p>"
                                                +"<p>Sonnenscheindauer: "+stundens+":"+minutens+":"+sekundens+" <span style='font-style: italic; font-size=50%'><br>(Stunden:Minuten:Sekunden)</span></p>"
                                                +"<p>Maximaler UV-Index: " + data.daily.uv_index_max[i] + "</p>"
                                                +"<p>Niederschlagsmenge: " + data.daily.rain_sum[i] + " mm</p>"
                                                +"<p>Schneemenge: " + data.daily.snowfall_sum[i] + " cm</p>"
                                                +"<p>Maximale Windgeschwindigkeit: " + data.daily.wind_speed_10m_max[i] + " km/h <span style='font-style: italic; font-size=50%;'><br>(Bei 10m Messungsabstand)</span></p>"
                                                +"<p>Minimale Windgeschwindigkeit: " + data.daily.wind_gusts_10m_max[i] + " km/h <span style='font-style: italic; font-size=50%;'><br>(Bei 10m Messungsabstand)</span></p>"
                                                +"<p>Windrichtung: " + data.daily.wind_direction_10m_dominant[i] + "° <span style='font-style: italic; font-size=50%;'>"+richtung+"</span></p>";
}});
});
}



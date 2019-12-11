var indexToWord = {0: "one", 1: "two", 2: "three", 3: "four", 4: "five"};

window.addEventListener("load", function () {
    init_map();
    show_movies();
    document.getElementById("element_one").addEventListener("click", function () {
        show_place(document.getElementById("headquarter_one").innerHTML);
    });
    document.getElementById("element_two").addEventListener("click", function () {
        show_place(document.getElementById("headquarter_two").innerHTML);
    });
    document.getElementById("element_three").addEventListener("click", function () {
        show_place(document.getElementById("headquarter_three").innerHTML);
    });
    document.getElementById("element_four").addEventListener("click", function () {
        show_place(document.getElementById("headquarter_four").innerHTML);
    });
    document.getElementById("element_five").addEventListener("click", function () {
        show_place(document.getElementById("headquarter_five").innerHTML);
    });

    document.getElementById("rating_one").addEventListener("change", function () {
        var movie_name = document.getElementById("movie_name_one").innerHTML;
        var rating =  document.getElementById("rating_one").value;
        set_rating(movie_name, rating);
    });
    document.getElementById("rating_two").addEventListener("change", function () {
        var movie_name = document.getElementById("movie_name_two").innerHTML;
        var rating =  document.getElementById("rating_two").value;
        set_rating(movie_name, rating);
    });
    document.getElementById("rating_three").addEventListener("change", function () {
        var movie_name = document.getElementById("movie_name_three").innerHTML;
        var rating =  document.getElementById("rating_three").value;
        set_rating(movie_name, rating);
    });
    document.getElementById("rating_four").addEventListener("change", function () {
        var movie_name = document.getElementById("movie_name_four").innerHTML;
        var rating =  document.getElementById("rating_four").value;
        set_rating(movie_name, rating);
    });
    document.getElementById("rating_five").addEventListener("change", function () {
        var movie_name = document.getElementById("movie_name_five").innerHTML;
        var rating =  document.getElementById("rating_five").value;
        set_rating(movie_name, rating);
    });
});

// ----------- MAPY.CZ -------------------
function init_map() {
    var stred = SMap.Coords.fromWGS84(14.41, 50.08);
    var mapa = new SMap(JAK.gel("mapa"), stred, 10);
    mapa.addDefaultLayer(SMap.DEF_BASE).enable();
    mapa.addDefaultControls();
}

function odpoved(geocoder) {
    if (!geocoder.getResults()[0].results.length) {
        alert("Tohle neznáme.");
        return;
    }

    var vysledky = geocoder.getResults()[0].results;
    var data = [];
    var item = vysledky.shift();
    var coords = item.coords;

    var mapa = new SMap(JAK.gel("mapa"), coords, 10);
    mapa.addDefaultLayer(SMap.DEF_BASE).enable();
    mapa.addDefaultControls();

    var layer = new SMap.Layer.Marker();
    mapa.addLayer(layer);
    layer.enable();

    var options = {};
    var marker = new SMap.Marker(coords, "myMarker", options);
    layer.addMarker(marker);
}

function show_place(name) {
    new SMap.Geocoder(name, odpoved);
}


// ----------- TMDB -------------------
function show_movies() {
    var data = "{}";

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = false;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            var response = JSON.parse(this.responseText);
            for (var i = 0; i < 5; i++) {
                show_movie(i, response["results"][i]["id"]);
            }
        }
    });

    xhr.open("GET", "https://api.themoviedb.org/3/movie/now_playing?page=1&language=en-US&api_key=bea1bcfee4ca6f9afacfd24b6fc895a3");

    xhr.send(data);
}

function show_movie(i, id) {
    var data = "{}";

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = false;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            var response = JSON.parse(this.responseText);
            var title = response["title"];
            var production_company = response["production_companies"][0]["name"];
            var production_company_id = response["production_companies"][0]["id"];

            document.getElementById("movie_name_" + indexToWord[i]).innerHTML = title;
            document.getElementById("studio_" + indexToWord[i]).innerHTML = production_company;

            get_rating(i);

            show_headquarters(i, production_company_id)
        }
    });

    xhr.open("GET", "https://api.themoviedb.org/3/movie/" + id + "?language=en-US&api_key=bea1bcfee4ca6f9afacfd24b6fc895a3");

    xhr.send(data);
}

function show_headquarters(i, id) {
    var data = "{}";

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = false;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            var response = JSON.parse(this.responseText);
            var headquarter = response["headquarters"];
            var el_id = "headquarter_" + indexToWord[i];
            var el = document.getElementById(el_id);
            el.innerHTML = headquarter;
        }
    });

    xhr.open("GET", "https://api.themoviedb.org/3/company/" + id + "?language=en-US&api_key=bea1bcfee4ca6f9afacfd24b6fc895a3");

    xhr.send(data);
}


// ----------- BACKEND -------------------
function get_rating(i) {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    var movie_name = document.getElementById("movie_name_" + indexToWord[i]).innerHTML;
    var url = "http://127.0.0.1:5000/ratings/"+movie_name+"/";
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            var rating = json["rating"];
            document.getElementById("rating_"+indexToWord[i]).value = rating;
        }
    };
    xhr.send();
}

function set_rating(movie, rating){
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    var url = "http://127.0.0.1:5000/ratings/"+movie+"/"+rating;
    xhr.open("PUT", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("Success");
        }
    };
    xhr.send();
}
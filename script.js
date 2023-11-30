$(document).ready(function () {
    $('#CurrentLoc').on('click', getUser_Loc);
    $('#searchBtn').on('click', function () {
        const enteredLocation = $('#locationInput').val().trim();
        if (enteredLocation !== "") {
            Geocode_Details(enteredLocation);
        } else {
            alert("Please enter a location.");
        }
    });

    function getUser_Loc() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    getLocation_details(latitude, longitude);
                },
                function (error) {
                    handleLocationError(error);
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    }

    function Geocode_Details(location) {
        clearResults();

        const apiKey = "XCThabjXcbnrxJjtMtV2fvLrwhesFCi1";
        const geocodeUrl = `https://geocode.maps.co/search?q=${encodeURIComponent(location)}&format=json&key=${apiKey}`;

        $.ajax({
            url: geocodeUrl,
            method: 'GET',
            success: function (geocodeData) {
                console.log("Geocode Data:", geocodeData);
                if (geocodeData.length > 0) {
                    const latitude = geocodeData[0].lat;
                    const longitude = geocodeData[0].lon;
                    getLocation_details(latitude, longitude);
                } else {
                    alert("Invalid location. Please enter a valid location.");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleGeocodeError(jqXHR, textStatus, errorThrown);
            }
        });
    }

    function getLocation_details(latitude, longitude) {
        // Clear previous results
        clearResults();

        const todayUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&formatted=0`;
        const tomorrowUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&formatted=1`;

        // AJAX call for today data
        $.ajax({
            url: todayUrl,
            method: 'GET',
            success: function (todayData) {
                console.log("Today Data:", todayData);
                displayResults(todayData.results, 'today', todayData.timezone);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleSunriseSunsetError(jqXHR, textStatus, errorThrown);
            }
        });

        // AJAX call for tomorrow data
        $.ajax({
            url: tomorrowUrl,
            method: 'GET',
            success: function (tomorrowData) {
                console.log("Tomorrow Data:", tomorrowData);
                displayResults(tomorrowData.results, 'tomorrow', tomorrowData.timezone);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleSunriseSunsetError(jqXHR, textStatus, errorThrown);
            }
        });
    }

    function displayResults(result, day, timezone) {
        // Display the results and show the resultContainer
        $('#resultContainer').css("display", "block");

        // Display results for the specified day
        $(`#${day}Result`).html(`
            <h3>${day.charAt(0).toUpperCase() + day.slice(1)}</h3>
            <div id="${day}Results">
                <p><strong>Sunrise:</strong> ${result.sunrise}</p>
                <p><strong>Sunset:</strong> ${result.sunset}</p>
                <p><strong>Dawn:</strong> ${result.dawn}</p>
                <p><strong>Dusk:</strong> ${result.dusk}</p>
                <p><strong>Day Length:</strong> ${result.day_length} seconds</p>
                <p><strong>Solar Noon:</strong> ${result.solar_noon}</p>
                <p><strong>Timezone:</strong> ${result.timezone}</p>
            </div>
        `);
    }

    function handleLocationError(error) {
        alert(`Error getting location: ${error.message}`);
    }

    function handleGeocodeError(jqXHR, textStatus, errorThrown) {
        alert(`An error occurred while fetching geocode data: ${textStatus} - ${errorThrown}`);
    }

    function handleSunriseSunsetError(jqXHR, textStatus, errorThrown) {
        alert(`An error occurred while fetching sunrise-sunset data: ${textStatus} - ${errorThrown}`);
    }

    function clearResults() {
        // Clear previous results
        $('#today_res').empty();
        $('#tom_res').empty();
        $('#resultContainer').css("display", "none");
    }
});

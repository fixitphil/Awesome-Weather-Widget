function get_guid() {
  try {
    if ( window.location.hash ) {
      return JSON.parse( decodeURIComponent(window.location.hash).substring(1) ).id;
    } else {
      return "default";
    }
  } catch(e) {
    return "default";
  }
}

function update_last_accessed() {
  var
    guid = get_guid(),
    instance = JSON.parse( localStorage.getItem(guid) );

  if ( !instance || instance === "" || localStorage.getItem(guid) === undefined ) {
    instance = {};
  }

  instance.last_accessed = Math.round(new Date().getTime()/1000.0);

  localStorage.setItem(guid, JSON.stringify(instance) );
}
update_last_accessed();

// Duplicity for the style to apply quickly & be live
var __instance = JSON.parse(localStorage.getItem( get_guid() )),
  __style = __instance.style || "A";
if(__style === "M") {
  $("html").addClass("non-android");
}


function convert(n,h,w) {
  if(h === "C") {
    if(w === "F") {
      return Math.round( n * 9 / 5 + 32 );
    } else {
      return Math.round(n);
    }
  } else if(h === "F") {
    if (w === "C") {
      return Math.round( ( n - 32 ) * 5 / 9 );
    } else {
      return Math.round(n);
    }
  } else {
    return Math.round(n);
  }
}

var google = "https://www.google.com";

function reset() {
  var instance = JSON.parse(localStorage.getItem( get_guid() ));

  if ( instance.weather !== undefined ) {
    var weather = JSON.parse(instance.weather);
  } else {
    var weather = {};
  }

  var
    place = instance.place || "San Francisco, CA",
    unit = instance.unit || "F",
    style = instance.style || "A";


  // Duplicity for the style to apply quickly & be live
  if(style === "M") {
    $("html").addClass("non-android");
  } else {
    $("html").removeClass("non-android");
  }

  if(unit === "C") {
    unit = "C";
  } else {
    unit = "F";
  }

  if(!weather.xml_api_reply) {
    console.error("No weather data.");
    return;
  }

  if(weather.xml_api_reply.weather
  && weather.xml_api_reply.weather.forecast_information
  && weather.xml_api_reply.weather.forecast_information.city.data
  && weather.xml_api_reply.weather.forecast_information.unit_system.data) {
    var full_place = weather.xml_api_reply.weather.forecast_information.city.data;
    var short_place = full_place.match(/(.*?),/);
    if ( typeof(short_place) !== "undefined"
      && typeof(short_place[1]) === "string"
      && short_place[1] !== "" ) {
      short_place = short_place[1];
    } else {
      short_place = full_place;
    }

    $(".place").html( short_place )
      .attr("title", full_place);

    if(weather.xml_api_reply.weather.forecast_information.unit_system.data === "SI") {
      var current_unit = "C";
    } else  {
      var current_unit = "F";
    }
  }

  if(weather.xml_api_reply.weather
  && weather.xml_api_reply.weather.current_conditions
  && weather.xml_api_reply.weather.current_conditions.temp_c.data
  && weather.xml_api_reply.weather.current_conditions.temp_f.data) {
    $(".conditions-0").html(weather.xml_api_reply.weather.current_conditions.condition.data);
    // $(".img-0").attr("src", google + weather.xml_api_reply.weather.current_conditions.icon.data);
    if(unit === "C") {
      $(".now").html(weather.xml_api_reply.weather.current_conditions.temp_c.data);
    } else {
      $(".now").html(weather.xml_api_reply.weather.current_conditions.temp_f.data);
    }
  }

  if(weather.xml_api_reply.weather.current_conditions
  && weather.xml_api_reply.weather.current_conditions.condition.data) {
    $(".conditions-0").html(weather.xml_api_reply.weather.current_conditions.condition.data);
  }

  if(weather.xml_api_reply.weather
  && weather.xml_api_reply.weather.forecast_conditions
  && weather.xml_api_reply.weather.forecast_conditions[0]
  && weather.xml_api_reply.weather.forecast_conditions[0].condition.data
  && weather.xml_api_reply.weather.forecast_conditions[0].icon.data
  && weather.xml_api_reply.weather.forecast_conditions[0].high.data
  && weather.xml_api_reply.weather.forecast_conditions[0].low.data
  && weather.xml_api_reply.weather.forecast_conditions[0].day_of_week.data) {
    $(".img-1").attr("src", google + weather.xml_api_reply.weather.forecast_conditions[0].icon.data)
    $(".conditions-1").html(weather.xml_api_reply.weather.forecast_conditions[0].condition.data);
    $(".day-1").html(weather.xml_api_reply.weather.forecast_conditions[0].day_of_week.data);

    $(".high-1").html( convert(weather.xml_api_reply.weather.forecast_conditions[0].high.data, current_unit, unit) );
    $(".low-1").html( convert(weather.xml_api_reply.weather.forecast_conditions[0].low.data, current_unit, unit) );
  }

  if(weather.xml_api_reply.weather
  && weather.xml_api_reply.weather.forecast_conditions
  && weather.xml_api_reply.weather.forecast_conditions[1]
  && weather.xml_api_reply.weather.forecast_conditions[1].condition.data
  && weather.xml_api_reply.weather.forecast_conditions[1].icon.data
  && weather.xml_api_reply.weather.forecast_conditions[1].high.data
  && weather.xml_api_reply.weather.forecast_conditions[1].low.data
  && weather.xml_api_reply.weather.forecast_conditions[1].day_of_week.data) {
    $(".img-2").attr("src", google + weather.xml_api_reply.weather.forecast_conditions[1].icon.data)
    $(".conditions-2").html(weather.xml_api_reply.weather.forecast_conditions[1].condition.data);
    $(".day-2").html(weather.xml_api_reply.weather.forecast_conditions[1].day_of_week.data);

    $(".high-2").html( convert(weather.xml_api_reply.weather.forecast_conditions[1].high.data, current_unit, unit) );
    $(".low-2").html( convert(weather.xml_api_reply.weather.forecast_conditions[1].low.data, current_unit, unit) );
  }

  if(weather.xml_api_reply.weather
  && weather.xml_api_reply.weather.forecast_conditions
  && weather.xml_api_reply.weather.forecast_conditions[2]
  && weather.xml_api_reply.weather.forecast_conditions[2].condition.data
  && weather.xml_api_reply.weather.forecast_conditions[2].icon.data
  && weather.xml_api_reply.weather.forecast_conditions[2].high.data
  && weather.xml_api_reply.weather.forecast_conditions[2].low.data
  && weather.xml_api_reply.weather.forecast_conditions[2].day_of_week.data) {
    $(".img-3").attr("src", google + weather.xml_api_reply.weather.forecast_conditions[2].icon.data)
    $(".conditions-3").html(weather.xml_api_reply.weather.forecast_conditions[2].condition.data);
    $(".day-3").html(weather.xml_api_reply.weather.forecast_conditions[2].day_of_week.data);

    $(".high-3").html( convert(weather.xml_api_reply.weather.forecast_conditions[2].high.data, current_unit, unit) );
    $(".low-3").html( convert(weather.xml_api_reply.weather.forecast_conditions[2].low.data, current_unit, unit) );
  }

  if(weather.xml_api_reply.weather
  && weather.xml_api_reply.weather.forecast_conditions
  && weather.xml_api_reply.weather.forecast_conditions[3]
  && weather.xml_api_reply.weather.forecast_conditions[3].condition.data
  && weather.xml_api_reply.weather.forecast_conditions[3].icon.data
  && weather.xml_api_reply.weather.forecast_conditions[3].high.data
  && weather.xml_api_reply.weather.forecast_conditions[3].low.data
  && weather.xml_api_reply.weather.forecast_conditions[3].day_of_week.data) {
    $(".img-4").attr("src", google + weather.xml_api_reply.weather.forecast_conditions[3].icon.data)
    $(".conditions-4").html(weather.xml_api_reply.weather.forecast_conditions[3].condition.data);
    $(".day-4").html(weather.xml_api_reply.weather.forecast_conditions[3].day_of_week.data);

    $(".high-4").html( convert(weather.xml_api_reply.weather.forecast_conditions[3].high.data, current_unit, unit) );
    $(".low-4").html( convert(weather.xml_api_reply.weather.forecast_conditions[3].low.data, current_unit, unit) );
  }
};

function restyle() {
  var width  = $(window).width() ,
      height = $(window).height();

  if ( width < 406 ) {
    $(".sub").css("display", "none");
    $(".main").css({
      "margin-left": (185 - 77) / 2
    });
    $(".weather-widget").css({
      "height": "185px",
      "width" : "185px"
    })
  } else if ( width >= 406 ) {
    $(".sub").css("display", "block");
    $(".main").css("margin-left", "");
    $(".weather-widget").css({
      "height": "",
      "width" : ""
    })
  }
}

$(document).ready(function($) {
  // Handles when the widget is resized
  restyle();
  $(window).bind("resize", function() {
    restyle();
  });

  // Being able to drag images just feels so tacky
  $("img").live("dragstart", function(event) { event.preventDefault(); });

  // Initial setup of the widget
  reset();

  // When anything in localStorage changes
  $(window).bind("storage", function (e) {
    if(e.originalEvent.key === get_guid()) {
      reset();
      restyle();
    }
  });
});

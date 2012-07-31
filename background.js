// For https://chrome.google.com/webstore/detail/mgmiemnjjchgkmgbeljfocdjjnpjnmcg

// Learn more about poke v3 here:
// http://wiki.antp.co/
var info = {
  "poke"    :   3,              // poke version 2
  "width"   :   2,              // 406 px default
  "height"  :   1,              // 200 px default
  "path"    :   "widget.html",
  "v2"      :   {
                  "resize"    :   true,   // Set to true ONLY if you create a range below.
                                          // Set to false to disable resizing
                  "min_width" :   1,      // Required; set to default width if not resizable
                  "max_width" :   2,      // Required; set to default width if not resizable
                  "min_height":   1,      // Required; set to default height if not resizable
                  "max_height":   1       // Required; set to default height if not resizable
                },
  "v3"      :   {
                  "multi_placement": true // Allows the widget to be placed more than once
                                          // Set to false unless you allow users to customize each one
                }
};

chrome.extension.onMessageExternal.addListener(function(request, sender, sendResponse) {
  if(request === "mgmiemnjjchgkmgbeljfocdjjnpjnmcg-poke") {
    chrome.extension.sendMessage(
      sender.id,
      {
        head: "mgmiemnjjchgkmgbeljfocdjjnpjnmcg-pokeback",
        body: info,
      }
    );
  }
});

// Start of weather-specific stuff

// backwards compatibility
if ( localStorage.getItem("place")
  || localStorage.getItem("hl")
  || localStorage.getItem("unit")
  || localStorage.getItem("style")
  || localStorage.getItem("weather") ) {

  // import to "default"
  instance = {
    place: localStorage.getItem("place"),
    hl: localStorage.getItem("hl"),
    unit: localStorage.getItem("unit"),
    style: localStorage.getItem("style"),
    weather: localStorage.getItem("weather")
  }

  localStorage.setItem("default", JSON.stringify(instance));

  // remove old items
  localStorage.removeItem("place");
  localStorage.removeItem("hl");
  localStorage.removeItem("unit");
  localStorage.removeItem("style");
  localStorage.removeItem("weather");
}

$(window).bind("storage", function (e) {
  update();
});

function update() {
  for (instance_id in localStorage) {
    var instance = JSON.parse(localStorage[instance_id]),
      now = Math.round(new Date().getTime()/1000.0),
      place = instance.place || "San Francisco, CA",
      hl = instance.hl || "en";

    if ( instance.last_accessed && parseInt(instance.last_accessed) ) {
      instance.last_accessed = instance.last_accessed;
    } else {
      instance.last_accessed = Math.round(new Date().getTime()/1000.0);
    }

    if ( (now - instance.last_accessed) < 129600 ) { // if accessed less than 1.5 days ago

      if ( !instance.last_update || !instance.weather) {
        instance.last_update = 1;
      }

      if ( (now - instance.last_update) > 14*60) {
        var url = "https://www.google.com/ig/api?weather=" + place + "&hl=" + hl,
          xml = new JKL.ParseXML( url ),
          data = xml.parse();

        if ( data.xml_api_reply
          && typeof(data.xml_api_reply) === "object" ) {
          instance.weather = JSON.stringify( data );
        }

        instance.last_update = Math.round(new Date().getTime()/1000.0);

        localStorage.setItem(instance_id, JSON.stringify(instance));
      }
    } else if ( (now - instance.last_accessed) > 2419200 ) { // if accessed more than 4 weeks ago
      // delete instance
      localStorage.removeItem(instance_id);
    }
  }
}

setInterval(update, 15*60*1000);
update();

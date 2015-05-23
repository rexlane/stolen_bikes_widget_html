(function() {
  var appendBikes, binx_api, binx_list_item, binx_widget_template, formatDates, getNearbyStolen, getSerialResponse, initializeBinxWidget, root_url, trim;

  console.log("stuff");

  root_url = window.binxw_root_url || "https://widget.bikeindex.org/";

  binx_api = "https://bikeindex.org/api/v2/bikes_search/stolen?per_page=10&widget_from=" + document.domain + "&";

  Array.prototype.uniq = function() {
    var i, key, output, ref, results, value;
    output = {};
    for (key = i = 0, ref = this.length; 0 <= ref ? i < ref : i > ref; key = 0 <= ref ? ++i : --i) {
      output[this[key]] = this[key];
    }
    results = [];
    for (key in output) {
      value = output[key];
      results.push(value);
    }
    return results;
  };

  trim = function(str) {
    return str.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
  };

  getSerialResponse = function(serial) {
    var base_url, that;
    base_url = $('#search_serials').attr('data-target');
    that = this;
    return $.ajax({
      type: "GET",
      url: binx_api + "serial=" + serial,
      success: function(data, textStatus, jqXHR) {
        data.serial_searched = serial;
        return that.appendBikes(data);
      }
    });
  };

  appendBikes = function(data, setTime) {
    var cache;
    if (setTime == null) {
      setTime = null;
    }
    if (setTime != null) {
      cache = {
        data: data,
        time: setTime
      };
      localStorage.setItem('binx_rstolen', JSON.stringify(cache));
    }
    $("#binx_list_container").html(Mustache.render(binx_list_item, data));
    return formatDates();
  };

  formatDates = function() {
    var date, ds, i, len, ref, results, sdate, today, yesterday;
    today = new Date();
    yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    yesterday = yesterday.toString().split(/\d{2}:/)[0];
    today = today.toString().split(/\d{2}:/)[0];
    ref = $("#binx_list_container .date-stolen");
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      ds = ref[i];
      sdate = new Date(parseInt($(ds).text(), 10) * 1000);
      date = sdate.toString().split(/\d{2}:/)[0];
      if (date === today) {
        date = 'Today';
      }
      if (date === yesterday) {
        date = 'Yesterday';
      }
      results.push($(ds).text(date));
    }
    return results;
  };

  getNearbyStolen = function(location, existing_bikes) {
    var url;
    if (existing_bikes == null) {
      existing_bikes = [];
    }
    url = "https://bikeindex.org/api/v2/bikes/3414";
    return $.ajax({
      type: "GET",
      url: url,
      success: function(data, textStatus, jqXHR) {
        var time;
        console.log(data);
        time = new Date().getTime();
        data.recent_results = true;
        data.bikes = existing_bikes.concat(data.bike);
        if (data.bikes.length < 6 && location.length > 0) {
          return getNearbyStolen('', data.bikes);
        } else {
          return appendBikes(data, time);
        }
      }
    });
  };

  initializeBinxWidget = function(options) {
    var cache, is_cached, time;
    Mustache.parse(binx_list_item);
    $('#binx_stolen_widget').html(Mustache.render(binx_widget_template, options.height));
    $('#binx_search_form').submit(function(event) {
      getSerialResponse($('#binx_search').val());
      return false;
    });
    $('#binxformsubm_a').click(function(event) {
      return getSerialResponse($('#binx_search').val());
    });
    if (options.norecent) {
      return true;
    }
    is_cached = false;
    if (!options.nocache) {
      cache = localStorage.getItem('binx_rstolen');
      time = new Date().getTime();
      if ((cache != null) && cache.length > 0) {
        cache = JSON.parse(cache);
        if ((cache.time != null) && time - cache.time < 10800000) {
          is_cached = true;
          appendBikes(cache.data);
        }
      }
    }
    if (!is_cached) {
      return getNearbyStolen(options.location);
    }
  };

  $(document).ready(function() {
    var container, height, options, ref, ref1, ref2, ref3;
    container = $('#binx_stolen_widget');
    options = {
      location: (ref = container.attr('data-location')) != null ? ref : 'ip',
      nocache: (ref1 = container.attr('data-nocache')) != null ? ref1 : false,
      norecent: (ref2 = container.attr('data-norecent')) != null ? ref2 : false
    };
    height = (ref3 = container.attr('data-height')) != null ? ref3 : 400;
    height = parseInt(height, 10) - 41;
    container.attr('data-height', height + "px");
    return initializeBinxWidget(options);
  });

  binx_widget_template = "<link href=\"" + root_url + "assets/styles.css\" rel=\"stylesheet\" type=\"text/css\">\n<form class=\"topsearcher\" id=\"binx_search_form\">\n  <span class=\"spacing-span\"></span>\n  <span class=\"top-stripe skinny-stripe\"></span>\n  <span class=\"spacing-span\"></span>\n  <span class=\"top-stripe fat-stripe\"></span>\n  <span class=\"spacing-span\"></span>\n  <span class=\"bottom-stripe fat-stripe\"></span>\n  <span class=\"spacing-span\"></span>\n  <span class=\"bottom-stripe skinny-stripe\"></span>\n  <input id=\"binx_search\" type=\"text\" placeholder=\"Search for a serial number\">\n  <input type=\"submit\" id=\"binxformsubm\">\n  <a href=\"#\" class=\"subm\" id=\"binxformsubm_a\"><img src=\"" + root_url + "assets/search.svg\"></a>\n</form>\n<div class='binxcontainer' id='binx_list_container'></div>";

  binx_list_item = "\n  <h2 class=\"search-response-info\">Bikes with serial numbers matching <em></em></h2>\n\n<ul>\n  \n    <li class='stolen'>\n      \n         <a class='stolen-thumb' href='https://bikeindex.org/bikes/' target=\"_blank\">\n          <img src=''>\n        </a>\n      \n      <h4>\n        <a href='https://bikeindex.org/bikes/' target=\"_blank\"></a>\n      </h4>\n      \n        <p>\n          <span class='stolen-color'>Stolen</span> from  &mdash;  <span class='date-stolen'>\n        </p>\n      \n      <p>\n        Serial: <span class='serial-text'></span>\n      </p>\n      \n        <p class=\"not-stolen\">Bike is not marked stolen</p>\n      \n    </li>\n  \n</ul>\n\n  <div class=\"binx-stolen-widget-list\">\n    \n      <h2 class='search-fail'>\n        We're sorry! Something went wrong and we couldn't retrieve recent results!\n        <span>We're probably working on fixing this right now, send us an email at <a href=\"mailto:contact@bikeindex.org\">contact@bikeindex.org</a> if the problem persists</span>\n      </h2>\n    \n    \n      <h2 class='search-fail'>\n        No bikes found on the Bike Index with a serial of <span class=\"search-query\"></span>\n      </h2>\n    \n  </div>\n\n\n  <div class=\"widget-info\">\n    Recent reported stolen bikes \n    \n      near <em></em>\n    \n  </div>\n";

}).call(this);

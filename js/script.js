/*global jQuery, document, window*/

/**
* Fork notes 2017-01-07: 
* $.cookie is depreciated so I replaced it with basic getCookie, setCookie functions.
* Incase of reading the cookie values through the subdomains, added a domain variable to the updateCookie function. 
* In my case I needed to set the cookie at toyota.com.tr then read it to pass along to CRM in turkiye.toyota.com.tr
* Also turkiye.toyota.com.tr was showing up as a referral traffic, added a subdomain variable exclude that
*/


/**
 * Functionality to replace the __UTMZ Cookie, previously built by GA
 * Why? We need the 'utm_source' value to be available in the /redirect pages
 * so it can be sent (along with Niche and Product name) to the hasOffers system
 */
(function ($) {
  window.trafficMonitor  = window.trafficMonitor || {};

  /*
   * A list of Search Engines websites
   * For example we will need to overwrite the cookie with these referral websites
   * (unless there is a UTM_SOURCE parameter in the current URL)
   * 
   * -------------------------------------------------------------------------------------------
   * Example Referrer:
   * https://www.google.com.au/search?..........&q=gautm&.....
   * The Referrer URL's host without www (`google.com.au`) contains the string `google`.
   * 
   * The requirements are met and therefore we will overwrite the cookie value to `google`
   */
  var searchEngines = [
    'daum', 'eniro', 'naver', 'pchome', 'google', 'images.google', 'yahoo', 'msn', 'bing', 'aol', 'lycos', 'ask', 'cnn', 'virgilio', 'baidu', 'alice', 'yandex', 'najdi', 'seznam',
    'rakuten', 'biglobe', 'goo.ne', 'search.smt.docomo', 'onet', 'kvasir', 'terra', 'rambler', 'conduit', 'babylon', 'search-results', 'avg', 'comcast', 'incredimail',
    'startsiden', 'go.mail.ru', 'centrum.cz', '360.cn', 'sogou', 'tut.by', 'globo', 'ukr', 'so.com', 'haosou.com', 'auone'
  ];


   /**
   * Returns the value of the chosen cookie.
   * @param {string} cookieName
   * @returns {string|Boolean}
   */
  function getCookie(cookieName){
        var name = cookieName + "=";
        var cookieArray = document.cookie.split(';'); //break cookie into array
        for(var i = 0; i < cookieArray.length; i++){
          var cookie = cookieArray[i].replace(/^\s+|\s+$/g, ''); //replace all space with '' = delete it
          if (cookie.indexOf(name)==0){
             return cookie.substring(name.length,cookie.length); //
          }
        }
        return null;
    } 
   
   /**
   * Creates or overwrites a cookie with expiration date.
   * @param {string} cname
   * @param {string} cvalue
   * @param {string} exDate
   * @param {string} domain
   * @returns {string|Boolean}
   */
function setCookie(cname, cvalue, exDate, domain) {
    document.cookie = cname + "=" + cvalue + ";expires=" + exDate + ";path=/;domain="+ domain;
}

  /**
   * Returns the host of a given URL
   * @param {string} url
   * @returns {string|Boolean}
   */
  function getHostByUrl(url) {
    if (!url) {
      return false;
    }

    var host = url.match(/\/\/(.[^/]+)/);
    if (host && host.length) {
      return host[1].replace('www.', '');
    }
    return false;
  }
  window.trafficMonitor.getHostByUrl = getHostByUrl;

  /**
   * Returns all query string parameters
   * @param {string} src Optional URL
   * @returns {Object}
   */
  function getQueryParameters(src) {
    var source, result = {};

    if (src) {
      source = src;
    } else {
      source = window.location.search;
    }

    var params = source.split(/\?|\&/);
    params.shift();

    $.each(params, function () {
      var param = this.split('=');
      result[param[0]] = param[1];
    });

    return result;
  }
  window.trafficMonitor.getQueryParameters = getQueryParameters;

  /**
   * Checks if the Referrer is a special one
   * @param {string} referrer
   * @param {Object} searchEngines
   * @returns {string|Boolean}
   */
  function isReferrerASearchEngine(referrer, searchEngines) {
    var referrerHostname = getHostByUrl(referrer);
    var result = false;

    if (!referrerHostname || !searchEngines) {
      return result;
    }
    $.each(searchEngines, function () {
      // Check if the Referrer is one of the Special websites
      if (referrerHostname.search(this) >= 0) {
        result = this;
      }
      // Continue the loop in case there are more than 1 match
    });

    return result;
  }
  window.trafficMonitor.isReferrerASearchEngine = isReferrerASearchEngine;

  /* We need to check for special cases
   * - `utm_source` parameter IS in the current URL
   * - there is a Referrer (not the current domain)
   *
   * Default 
   * - (direct)
   *
   * @param {Object} options
   * @returns {Object} result
   */
  function getUtmData(options) {
    var result = {
      'overwrite' : false,
      'cookieValue' : '(direct)'
    };

    // We check if the URL contains the Get parameter `utm_source`
    var urlParameters = getQueryParameters();
    var sourceParameter = urlParameters.utm_source;

    // If so, we are going to use this as the new value
    if (sourceParameter !== '' && sourceParameter !== undefined) {
      result.overwrite = true;
      result.cookieValue = sourceParameter;
      // Exit early, do not do further checks
      return result;
    }

    if (options.REFERRER) {
      var cleanReferrer = getHostByUrl(options.REFERRER);

      // We have a referrer! Check if the current site is also the referrer
      // Also check if the subdomain is a referrer 
      if (cleanReferrer !== options.ITSELF && cleanReferrer !== subdomain ) {
        result.overwrite = true;

        // We check the referrer for special cases (like google, bing, yahoo, etc.)
        var referrerSearchEngine = isReferrerASearchEngine(options.REFERRER, options.SEARCH_ENGINES);

        if (referrerSearchEngine !== false) {
          result.cookieValue = referrerSearchEngine;
        } else {
          if (cleanReferrer) {
            result.cookieValue = cleanReferrer;
          }
        }
      }
    }

    // Default Bahaviour - No Overwrite
    return result;
  }
  window.trafficMonitor.getUtmData = getUtmData;

 function updateCookies(cookieValue) {
    var sessionExpire = 1800000; // milliseconds - 30 minutes
    var utmExpire = 1.5768e10; // milliseconds - ~6 months
    var session = new Date();
    var utm = new Date();
    
    domain = "toyota.com.tr";  // Change to whatever domain your going to create a cookie
    subdomain = "turkiye.toyota.com.tr"; // Change with your subdomain that you want to exclude seeing as referral

    session.setTime(session.getTime() + sessionExpire);
    utm.setTime(utm.getTime() + utmExpire);

    // (Re)Create Cookies
    setCookie('__futm', cookieValue, utm, domain)
    
    // Restart Session
    setCookie('__futm_session', '', session, domain)
  }

  var options = {
    REFERRER : document.referrer,
    ITSELF: window.location.hostname.replace('www.', ''),
    SEARCH_ENGINES : searchEngines
  };

  /* Create or overwrite cookie if it doesn't exists or if the following criteria are met:
   *  - `utm_source` parameter IS in the current URL
   *  - or the referral exists and it is not the current domain name
   *  If cookie do not exists set cookie to
   *  - `(direct)`
  */

  var utmCheck = getUtmData(options);

  if (utmCheck.overwrite || getCookie('__futm') === null) {
    // Overwrite cases || FUTM cookie doesn't exists
    updateCookies(utmCheck.cookieValue);
  } else {
    // Keep the same cookie value but restart the expire dates
    updateCookies(getCookie('__futm'));
  }
}(jQuery));

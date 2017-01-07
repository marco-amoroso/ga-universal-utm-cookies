# ga-universal-utm-cookies

GA Universal UTM cookies

## Update: 2017-01-07
$.cookie is replaced with basic getCookie, setCookie functions.
Incase of reading the cookie values through the subdomains, added a domain variable to the updateCookie function. 
Added a subdomain variable if subdomain referral traffic needs to be excluded.


## Problem
Some companies rely on the UTMZ cookies created by Google Analytics to retrieve informations about the lead.
The new Google Analytics Universal no longer stores these cookies on the user's browser.

## My solution
We will replicate how GA uses these cookies at the moment and create our own cookies.

### GA Universal Logic
<img src="https://developers.google.com/analytics/images/platform/features/campaigns-trafficsources/TrafficSources-Flow-Reduced.png" alt="Google Logic Chart" width="200" />

Source: https://developers.google.com/analytics/devguides/platform/campaign-flow

### Old GA Logic vs GA Universal
https://support.google.com/analytics/answer/2731565?hl=en

Main difference with GA Universal that we are aware of is the fact Normal Referrers (e.g. othersite.com, mysite.com) were only overwriting the UTM Source if:
* the session was expired
* or if there was not a previous value in the UTMZ cookie.

While in Universal this is not the case and Referrers (Normal or Special) always overwrite the Source value.

### List of Search Engines (Special Referrers)
Source: https://developers.google.com/analytics/devguides/collection/gajs/gaTrackingTraffic#searchEngine

The list of Special Referrers was extracted from the link above and from GA.js file and it is valid as per today, April 17th 2015. The file has been minified and obfuscated and also the list could get updated anytime without warning.

(Special referrers are defined as those classified as Medium=Organic in GA - See Report)

* daum
* eniro
* naver
* pchome
* google
images.google
* yahoo
* msn
* bing
* aol
* lycos
* ask
* cnn
* virgilio
* baidu
* alice
* yandex
* najdi
* seznam
* rakuten
* biglobe
* goo.ne
* search.smt.docomo
* onet
* kvasir
* terra
* rambler
* conduit
* babylon
* search-results
* avg
* comcast
* incredimail
* startsiden
* go.mail.ru
* centrum.cz
* 360.cn
* sogou
* tut.by
* globo
* ukr
* so.com
* haosou.com
* auone

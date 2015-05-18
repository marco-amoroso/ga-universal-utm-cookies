/*jslint white: true*/
/*global describe, it, expect, window*/
describe('traffic-monitor', function() {
  var searchEngines = [
        'daum',
        'eniro',
        'naver',
        'pchome',
        'google'
      ];

  describe('getHostByUrl', function () {
    it('should return the host (without the www) from any given URL', function() {
      var getHostByUrl = window.trafficMonitor.getHostByUrl;

      expect(getHostByUrl('http://www.mywebsite.com')).toEqual('mywebsite.com');
      expect(getHostByUrl('http://mywebsite.com')).toEqual('mywebsite.com');
      expect(getHostByUrl('http://www.google.com')).toEqual('google.com');
      expect(getHostByUrl('mywebsite.com')).toEqual(false);
      expect(getHostByUrl('testing wrong url')).toEqual(false);
      expect(getHostByUrl()).toEqual(false);
    });
  });

  describe('getQueryParameters', function () {
    it('should return the list of parameters from any given URL', function() {
      var getQueryParameters = window.trafficMonitor.getQueryParameters;

      expect(getQueryParameters('http://www.mywebsite.com?q=123')).toEqual({'q':'123'});
      expect(getQueryParameters('http://www.mywebsite.com?q=123&p=321')).toEqual({'q':'123', 'p':'321'});
      expect(getQueryParameters('http://www.mywebsite.com')).toEqual({});
    });
  });

  describe('isReferrerASearchEngine', function () {
    it('should return the keyname of a special domain or false if it is not', function() {
      var isReferrerASearchEngine = window.trafficMonitor.isReferrerASearchEngine;

      expect(isReferrerASearchEngine('http://www.mywebsite.com?q=123', searchEngines)).toEqual(false);
      expect(isReferrerASearchEngine('http://www.google.com.au?q=123', searchEngines)).toEqual('google');
      expect(isReferrerASearchEngine('http://www.google.com.au', searchEngines)).toEqual('google');
      expect(isReferrerASearchEngine('http://www.daum.com?q=123', searchEngines)).toEqual('daum');
      expect(isReferrerASearchEngine('http://www.eniro.com#test?search_word=123', searchEngines)).toEqual('eniro');
      expect(isReferrerASearchEngine(null, searchEngines)).toEqual(false);
      expect(isReferrerASearchEngine('http://www.google.com.au?q=123')).toEqual(false);
    });
  });

  describe('getUtmData', function () {
    it('should return instructions for the Monitor Cookie, if we need to overwrite it and its new value', function() {
      var getUtmData = window.trafficMonitor.getUtmData;

      var options = {
        SEARCH_ENGINES : searchEngines,
        ITSELF : 'mywebsite.com',
        REFERRER : 'http://www.mywebsite.com'
      };

      expect(getUtmData(options)).toEqual({ overwrite : false, cookieValue : '(direct)' });

      options.REFERRER = 'http://www.creditcardmywebsite.com/somepage';
      expect(getUtmData(options)).toEqual({ overwrite : true, cookieValue : 'creditcardmywebsite.com' });

      options.REFERRER = 'http://www.google.com.au?q=123';
      expect(getUtmData(options)).toEqual({ overwrite : true, cookieValue : 'google' });

      options.REFERRER = 'http://www.google.com.au';
      expect(getUtmData(options)).toEqual({ overwrite : true, cookieValue : 'google' });

      options.REFERRER = null;
      expect(getUtmData(options)).toEqual({ overwrite : false, cookieValue : '(direct)' });
    });
  });
});

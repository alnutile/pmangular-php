'use strict';

/* Filters */

angular.module('myApp.filters', []).
filter('datefilter', function() {
    return function(dateoutput) {
      if(dateoutput > 1) {
      	return dateoutput +'000';
      }
    };
  }).filter('datedefaults', function() {
    return function(dateoutput) {
      if(dateoutput > 1) {
      	return dateoutput +'000';
      }
    };
  });
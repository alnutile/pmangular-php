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
  }).filter('levelfilter', function() {
    return function(level) {
      if(level > 0) {
        if(level == 1) {
          var level = 'low';
        } else if(level == 2) {
          var level = 'medium';
        } else if(level == 3) {
          var level = 'high';
        } else if(level == 4) {
          var level = 'urgent';
        }
        return level;
      }
    };
  });
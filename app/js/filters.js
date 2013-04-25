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
  }).filter('sizeLabel', function() {
    return function(sizeId) {
      var scope = this;
      if(sizeId >= 0) {
        var name = scope.quote.sizeChoices[sizeId]["name"];
        return name;
      }
    };
  }).filter('statusLabel', function() {
    return function(statusId) {
      var scope = this;
      if(statusId >= 0) {
        var name = scope.quote.quoteStatus[statusId]["name"];
        return name;
      }
    };
  }).filter('quoteIntro', function() {
    return function(id) {
      if(id >= 1) {
        var message = "Edit Quote#"+id;
      } else {
        var message = "New Quote - ";
      }
        return message;
      };
  });

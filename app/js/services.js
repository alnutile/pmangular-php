'use strict';

/* Services */


//from the cellar project
/*
angular.service('Wine', function ($resource) {
    return $resource('api/wines/:wineId', {}, {
        update: {method:'PUT'}
    });
});
*/


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  value('version', '0.1');

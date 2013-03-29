'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/dash', {templateUrl: 'partials/clients.html', controller: ClientList});
    $routeProvider.when('/hostings/:clientId', {templateUrl: 'partials/hostingdetails.html', controller: HostingDetails});
    $routeProvider.otherwise({redirectTo: '/dash'});
  }]);
'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/dash', {templateUrl: 'partials/dash.html', controller: ClientList});

    /*Client Service*/
    $routeProvider.when('/clients', {templateUrl: 'partials/clientsList.html', controller: ClientList});
    $routeProvider.when('/clients/:clientId', {templateUrl: 'partials/clientDetails.html', controller: ClientDetails});
    
    /*Hosting Service*/
    $routeProvider.when('/hostings', {templateUrl: 'partials/clientsHosting.html', controller: ClientList});
    $routeProvider.when('/hostings/:clientId', {templateUrl: 'partials/hostingdetails.html', controller: HostingDetails});
 
    /*People Service*/
    $routeProvider.when('/people', {templateUrl: 'partials/peopleList.html'});
    $routeProvider.when('/people/:personId', {templateUrl: 'partials/peopleDetails.html', controller: PersonDetails});


    $routeProvider.otherwise({redirectTo: '/dash'});
  }]);
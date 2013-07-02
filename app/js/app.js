'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'ui.bootstrap']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/dash', {templateUrl: 'partials/dash.html', controller: DashWidget});

    /*Client Service*/
    $routeProvider.when('/clients', {templateUrl: 'partials/clientsList.html'});
    $routeProvider.when('/clients/:clientId', {templateUrl: 'partials/clientDetails.html', controller: ClientDetails});
    
    /*Hosting Service*/
    $routeProvider.when('/hostings', {templateUrl: 'partials/clientsHosting.html'});
    $routeProvider.when('/hostings/:clientId', {templateUrl: 'partials/hostingdetails.html', controller: HostingDetails});
 
    /*People Service*/
    $routeProvider.when('/people', {templateUrl: 'partials/peopleList.html'});
    $routeProvider.when('/people/:personId', {templateUrl: 'partials/peopleDetails.html', controller: PersonDetails});

    /*Task Service*/
    $routeProvider.when('/task', {templateUrl: 'partials/taskList.html'});
    $routeProvider.when('/task/:taskId', {templateUrl: 'partials/taskDetails.html', controller: TaskDetails});
    
    /*Quote Service*/
    $routeProvider.when('/quotes', {templateUrl: 'partials/clientsQuotes.html'});
    $routeProvider.when('/quotes/:clientId', {templateUrl: 'partials/quotedetails.html', controller: QuoteDetails});
    $routeProvider.when('/quotes/edit/:quoteId', {templateUrl: 'partials/quotedetails.html', controller: QuoteDetails});
    $routeProvider.when('/quotes/new/:clientId', {templateUrl: 'partials/quotedetails.html', controller: QuoteDetails});
	
    $routeProvider.otherwise({redirectTo: '/dash', controller: DashWidget});
  }]).run(['$rootScope', '$location', function($rootScope, $location){
   var path = function() { return $location.path();};
   $rootScope.$watch(path, function(newVal, oldVal){
     var newVal = newVal.split('/');
     $rootScope.activetab = newVal[1];
   });
}]);;

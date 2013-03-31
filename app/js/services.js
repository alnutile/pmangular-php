'use strict';

/* Services */


//from the cellar project

//Syntax allows to chain factories
angular.module('myApp.services', ['ngResource']).
	//The factory returns objects / functions that can be used by the controllers
    factory('People', ['$resource', '$http', '$rootScope', function($resource, $http, $rootScope){
        return {
        	//the resource provider interacting with the PHP backend
	        api: 
				$resource('api/person/:personId', {}, {
			        update: {method:'PUT'}
				}),
			/*
			* A generic function that can be called to emit an event on one ctrl that can be handled by another ctrl.
			* The WineDetailCtrl emits it on each save, update or delete request, so that the WineListCtrl can react and update itself.	
			*/
			broadcastChange: function(){
				$rootScope.$broadcast('handleBroadcast');
			}

		}
	}])


// // Demonstrate how to register services
// // In this case it is a simple value service.
// angular.module('myApp.services', []).
//   value('version', '0.1');

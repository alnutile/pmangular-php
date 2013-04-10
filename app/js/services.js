//Syntax allows to chain factories
angular.module('myApp.services', ['ngResource']).
	//The factory returns objects / functions that can be used by the controllers
    factory('People', ['$resource', '$http', '$rootScope', function($resource, $http, $rootScope){
        return {
        	//the resource provider interacting with the PHP backend
	        api: 
				$resource('api/v3/person/:personId', {}, {
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
	}]).
	//The factory returns objects / functions that can be used by the controllers
    factory('Client', ['$resource', '$http', '$rootScope', function($resource, $http, $rootScope){
        return {
        	//the resource provider interacting with the PHP backend
	        api: 
				$resource('api/v3/client/:clientId', {}, {
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
	}]).
	//The factory returns objects / functions that can be used by the controllers
    factory('Hosting', ['$resource', '$http', '$rootScope', function($resource, $http, $rootScope){
        return {
        	//the resource provider interacting with the PHP backend
	        api: 
				$resource('api/v3/hostings/:clientId', {}, {
			        update: {method:'PUT'}
				}),
			apiSend: 
				$resource('api/v3/hostings/:id', {}, {
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
	}]).    
	factory('Task', ['$resource', '$http', '$rootScope', function($resource, $http, $rootScope){

        return {
        	//the resource provider interacting with the PHP backend
	        api: 
				$resource('api/v3/task/:id', {}, {
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
	}]).    
	factory('Filter', ['$resource', '$http', '$rootScope', function($resource, $http, $rootScope){
        return {
        	//the resource provider interacting with the PHP backend
	        api: 
				$resource('api/v3/filter/:id', {}, {
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
	}]).
	factory('TaskByStatus', ['$resource', '$http', '$rootScope', function($resource, $http, $rootScope){

        return {
        	//the resource provider interacting with the PHP backend
	        api: 
				$resource('api/v3/task/status/:id', {}, {
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
	}]).factory('TaskDetails', ['$resource', '$http', '$rootScope', function($resource, $http, $rootScope){
        return {
        	//the resource provider interacting with the PHP backend
	        api: 
				$resource('api/v3/task/:id', {}, {
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
	}]).factory('Quotes', ['$resource', '$http', '$rootScope', '$routeParams', function($resource, $http, $rootScope, $routeParams){
        return {
        	//the resource provider interacting with the PHP backend
	        api: 
            $resource('api/v3/quote/:clientId', {}, {
			        update: {method:'PUT'}
          }),
          lineitems: function() {
              var lineItemDefault = [{
                  major_feature: 'Major Feature',
                  feature_set: 'Feature Set',
                  item: 'Item',
                  hours: 0,
                  doc: 2
                }];
              return lineItemDefault;
          },
          general: function() {
              var generalDefault = {
                    id:0, 
                    clientId:$routeParams.clientId, 
                    project_name:'New Project', 
                    exec_summary:"Nothing here to see yet...", 
                    long_description: 'Nothing here to see yet...', 
                    size: 2,
                    created: '',
                    total: 0,
                    environment: 0.1,
                    concept: 0.1,
                    pm: 0.1,
                    config: 0.1,
                    testing:0.1,
                    deployment:0.1,
                    training:0.1,
                    buffer:0.1
                  };
              return generalDefault;
          },
          includedItems: function() {
              var includedDefault = [{
                    id:0, 
                    quote_id:0, 
                    yesno:1,
                    description:'Description Here'
                  }];
              return includedDefault;
          },
          assumptions: function(){
              var assumption = [{
                id:0,
                quote_id:0,
                description:'Assume away...'
              }];
              return assumption;
          },
          apiSend: 
            $resource('api/v3/quotes/:id', {}, {
              update: {method:'PUT'}
          }),
		}
	}])

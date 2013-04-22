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
                  high: 0,
                  doc: 1.4
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
                    line_items_total_hours: 0,
                    line_items_total_high_hours: 0,
                    total: 0,
                    total_high: 0,
                    total_quote: 0,
                    total_quote_high: 0,
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
          overhead: function() {
              var overheads = [];
              overheads = [{
                    id:0,
                    quote_id:0,
                    code:'env',
                    label:'Environment',
                    percentage: .05,
                    total: 0,
                    totalhigh: 0
                    }, {
                    id:1,
                    quote_id:0,
                    code:'cs',
                    label:'Concept and Solution',
                    percentage: .01,
                    total: 0,
                    totalhigh: 0
                    }, {
                    id:2,
                    quote_id:0,
                    code:'pm',
                    label:'Project Managment',
                    percentage: .2,
                    total: 0,
                    totalhigh: 0
                    }, {
                    id:3,
                    quote_id:0,
                    code:'cmf',
                    label:'Configuration Management, Features',
                    percentage: .05,
                    total: 0,
                    totalhigh: 0
                    }, {
                    id:4,
                    quote_id:0,
                    code:'tq',
                    label:'Testing & Quality',
                    percentage: .05,
                    total: 0,
                    totalhigh: 0
                    }, {
                    id:5,
                    quote_id:0,
                    code:'dep',
                    label:'Deployment',
                    percentage: .05,
                    total: 0,
                    totalhigh: 0
                    }, {
                    id:6,
                    quote_id:0,
                    code:'train',
                    label:'Training',
                    percentage: .05,
                    total: 0,
                    totalhigh: 0
                    }, {
                    id:7,
                    quote_id:0,
                    code:'buf',
                    label:'Buffer for unforeseen problems',
                    percentage: .01,
                    total: 0,
                    totalhigh: 0
                    }];
              return overheads;
          },
          rates: function() {
              var rateArray = [];
              rateArray = [{
                    id:0,
                    quote_id:0,
                    code:'DEV',
                    category:'Development',
                    rate: 100,
                    roles:'Developers' 
                    }, {
                    id:0,
                    quote_id:0,
                    code:'CS',
                    category:'Concept and solution',
                    rate: 100,
                    roles:'Solution Architect' 
                    }, {
                    id:0,
                    quote_id:0,
                    code:'DS',
                    category:'Web design',
                    rate: 100,
                    roles:'Design Team' 
                    }, {
                    id:0,
                    quote_id:0,
                    code:'DM',
                    category:'Migration of data',
                    rate: 100,
                    roles:['Tech', 'Developer']
                    }, {
                    id:0,
                    quote_id:0,
                    code:'DP',
                    category:'Deployment',
                    rate: 100,
                    roles: 'Tech'
                    }, {
                    id:0,
                    quote_id:0,
                    code:'TH',
                    category:'Theming',
                    rate: 100,
                    roles:'Developers' 
                    }, {
                    id:0,
                    quote_id:0,
                    code:'CM',
                    category:'Configuration management, features',
                    rate: 100,
                    roles:'Developers' 
                    }, {
                    id:0,
                    quote_id:0,
                    code:'TE',
                    category:'Testing',
                    rate: 100,
                    roles:'Developers' 
                    },
                    {
                    id:0,
                    quote_id:0,
                    code:'BU',
                    category:'Uncertainty buffer',
                    rate: 100,
                    roles:'Developers' 
                    }, {
                    id:0,
                    quote_id:0,
                    code:'PM',
                    category:'Project management',
                    rate: 100,
                    roles:'Production Manager' 
                    }, {
                    id:0,
                    quote_id:0,
                    code:'TN',
                    category:'Project management',
                    rate: 100,
                    roles:'Account Service' 
                    }, {
                    id:0,
                    quote_id:0,
                    code:'EV',
                    category:'Environment Setup',
                    rate: 100,
                    roles:'Developers' 
                    }];
              return rateArray;
          },
          docs: function() {
              docList = [{
                    id:1,
                    quote_id:0,
                    name:'Unknown',
                    level:1,
                    applied:1.5
                  }, {
                    id:2,
                    quote_id:0,
                    name:'Can speculate about solution',
                    level:2,
                    applied:1.4
                  }, {
                    id:3,
                    quote_id:0,
                    name:'Know solution by reference',
                    level:3,
                    applied:1.3
                  }, {
                    id:4,
                    quote_id:0,
                    name:'Know someone else who has done it before',
                    level:4,
                    applied:1.2
                  }, {
                    id:5,
                    quote_id:0,
                    name:'Done it before',
                    level:5,
                    applied:1.1
                  }];
              return docList;
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
          sizeChoices: function(){
              var sizes = [];
              sizes[2] = {
                  id:2,
                  name:"Small",
                  markup:1
                };
              sizes[1] = {
                  id:1,
                  name:"Medium",
                  markup:50
              };
              sizes[0] = {
                  id:0,
                  name:"Large",
                  markup:100
                };
              return sizes;
          },
          totalPercs: function(percsScope) {
             var totalPercs = 0;
             var totalPercsHigh = 0;

             angular.forEach(percsScope, function(value, key) {
                totalPercs = totalPercs + value.total;
                totalPercsHigh = totalPercsHigh + value.totalhigh;
             });

             var totalPercs = Math.round(totalPercs*100)/100;
             var totalPercsHigh = Math.round(totalPercsHigh*100)/100;

             var totals = [totalPercs, totalPercsHigh];

             return totals;
          },
          totalCost: function(scope) {
             total_quote = scope.quote.general.total * 100;
             total_quote_high = scope.quote.general.total_high * 100;
             return [total_quote, total_quote_high];
          },
          apiSend: 
            $resource('api/v3/quotes/:id', {}, {
              update: {method:'PUT'}
          }),
		}
	}])

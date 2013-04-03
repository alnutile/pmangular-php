'use strict';

/* Controllers */

function ClientList(Client, $location, $scope) {

	$scope.clientList = Client.api.query();

    $scope.$on('handleBroadcast', function() {
        $scope.clientList = Client.api.query(); 
    });   
}
//@todo look at why this extra call
ClientList.$inject = ['Client', '$location', '$scope'];

function ClientDetails(Client, $routeParams, $location, $scope) {
	$scope.clientDetails = Client.api.get({clientId: $routeParams.clientId})

	$scope.saveClient = function() {
		if($scope.clientDetails.id > 0) {
			Client.api.update({clientId:$scope.clientDetails.id}, $scope.clientDetails, function (res) { 
				Client.broadcastChange();
			});
		} else {
			Client.api.save({}, $scope.clientDetails, function(res){
				Client.broadcastChange();
			});
		}
	}
}

ClientDetails.$inject = ['Client', '$routeParams', '$location', '$scope'];



function HostingDetails(Hosting, $routeParams, $location, $scope) {
 	$scope.hostingPlans = Hosting.api.query({clientId: $routeParams.clientId}, [], function(results){
 		if(results.length < 1) {
 			var hostingPlans = {};
 			$scope.hostingPlans[0] = {
 					id:0, 
 					clientId:$routeParams.clientId, 
 					notes:'New Record', 
 					levelId:"None Set Yet", 
 					backuplocation1: 'SERVER01:/var/www/example', 
 					backuplocation2: 'SERVER01:/var/www/example'}
 				
 		}
 	});

	$scope.saveHosting = function() {
		if(this.plan.id > 0) {
			Hosting.apiSend.update({id:this.plan.id}, this.plan, function (res) { 
			});			
			//$http.put('api/v3/hostings/' + this.plan.id, this.plan).success(function(results){
			//});
		} else {
			Hosting.apiSend.save({}, this.plan, function(results){
				$scope.hostingPlans[0] = results; //Update form ID so it now has one
			});
		}
	}
}
HostingDetails.$inject = ['Hosting', '$routeParams', '$location', '$scope'];


function PeopleList(People, $location, $scope) {

	$scope.peopleList = People.api.query();

    $scope.$on('handleBroadcast', function() {
        $scope.peopleList = People.api.query(); 
    });

	$scope.clickedName = function(personList, index) {
		var personClicked = $scope.personClicked = [];
		$scope.personClicked = index;
	}
}
//@todo look at why this extra call
PeopleList.$inject = ['People', '$location', '$scope'];


function PersonDetails(People, $routeParams, $location, $scope) {
	$scope.personDetails = People.api.get({personId: $routeParams.personId})

	$scope.savePerson = function() {
		//var personId = personDetails.id;
		if($scope.personDetails.id > 0) {
			People.api.update({personId:$scope.personDetails.id}, $scope.personDetails, function (res) { 
				People.broadcastChange();
			});
		} else {
			People.api.save({}, $scope.personDetails, function(res){
				People.broadcastChange();
			});
		}
	}
}

PersonDetails.$inject = ['People', '$routeParams', '$location', '$scope'];


function FilterCtrl(Filter, $location, $scope) {

	$scope.filterList = Filter.api.get();


    $scope.$on('handleBroadcast', function() {
        $scope.filterList = Filter.api.get(); 
    });
}
//@todo look at why this extra call
FilterCtrl.$inject = ['Filter', '$location', '$scope'];


function TaskList(TaskByStatus, $location, $scope, $http) {
	
	$scope.taskform = {};
	$scope.taskform.posted = 0;

	$scope.taskList = TaskByStatus.api.query({id:2});

    $scope.$on('handleBroadcast', function() {
        $scope.taskList = TaskByStatus.api.query({id:2}); 
    });

    var filters = [];
	$http.get('api/v3/filter').success(function(data){	
		$scope.filters = data;
		$scope.taskform.assigned = '';
		$scope.taskform.text = '';
		$scope.taskform.startdate = '';
		$scope.taskform.enddate = '';
		$scope.taskform.statuslist = "2";
		$scope.taskform.bringup = '';
		$scope.taskform.posted = 0;
		$scope.taskform.projects = '';
		$scope.taskform.levels = '';
	});

	//Removing this for now and doing it 
	//at the submit level to deal with
	//the need for the other fields
	$scope.$watch('taskform.statuslist', function(status){
		if($scope.taskform.posted != 1) {
			$scope.taskList = TaskByStatus.api.query({id:status});
		}
	});

	$scope.filtersOnSubmit = function() {
		$http.post('api/v3/task/filtered', $scope.taskform).success(function(data) {
		    $scope.taskList = data;
		    $scope.taskform.posted = 1;
		});
	}

}
//@todo look at why this extra call
TaskList.$inject = ['TaskByStatus', '$location', '$scope', '$http'];

function TaskDetails(TaskDetails, $routeParams, $location, $scope, $filter, $http) {

	var defaultDate = $filter('datedefaults');
	var angDate = $filter('date');
	$scope.taskDetails = TaskDetails.api.get({id: $routeParams.taskId}, function(data){
		if($scope.taskDetails.due) {
			var dueDate = defaultDate($scope.taskDetails.due);
			var dueDate = angDate(dueDate, 'y-MM-dd');
			$scope.taskDetails.due = dueDate;
		};

		$http.get('api/v3/filter').success(function(data){	
			$scope.taskDetails.taskHelpers = data;
		});

		var taskId = $routeParams.taskId;
		$http.get('api/v3/notify/bytask/' + taskId).success(function(data){
			if(data === 'false') {
				data = '';
			}
			$scope.taskDetails.notify = data;
			var notify = {};
		});


		$http.get('api/v3/assign/bytask/' + taskId).success(function(data){
			if(data === 'false') {
				data = '';
			}
			$scope.taskDetails.notify = data;
			var notify = {};
		});


		var created = defaultDate($scope.taskDetails.created);
		$scope.taskDetails.created = angDate(created, 'y-MM-dd');


	});
	
	$scope.saveTask = function() {
		if($scope.taskDetails.id > 0) {
			TaskDetails.api.update({id:$scope.taskDetails.id}, $scope.taskDetails, function (res) { 
				TaskDetails.broadcastChange();
			});
		} else {
			// TaskDetails.api.save({}, $scope.taskDetails, function(res){
			// 	TaskDetails.broadcastChange();
			// });
		}
	}
}

TaskDetails.$inject = ['TaskDetails', '$routeParams', '$location', '$scope', '$filter', '$http'];



function DashWidget(TaskByStatus, $location, $scope, $http) {
	var dash = {};
	$scope.openTasks = TaskByStatus.api.query({id:2});
	$scope.internal = TaskByStatus.api.query({id:3});
	$scope.client = TaskByStatus.api.query({id:4});
	// 		"opentasks":TaskByStatus.api.query({id:2}), 
	// 		"internal":TaskByStatus.api.query({id:3}),
	// 		"client":TaskByStatus.api.query({id:4}),
	// 		"qadone":TaskByStatus.api.query({id:5})
	// 	}];
	// //Widget for comments

	//Task Items Due today

	//New Items (eg past day)

	//Items assigned to you and !done

	//Meeting and !done
	var meetingsStuff = new Object();
	var meetingsStuff = {meeting:"1", statuslist:2};
	$http.post('api/v3/task/filtered', meetingsStuff).success(function(data) {
	    $scope.meeting = data;
	});

	var searchString = {};
	$scope.searchTerm = '';
	$scope.search = '';
	$scope.previousSearch = '';
	$scope.searchResults = [{name:'Enter your search word above. After the 3rd letter the search will kick in for content types', id:'', type:'project or task or client'}];
	$scope.searchAll = function() {
		if($scope.searchTerm.length >= 3) {
			if($scope.previousSearch != $scope.searchTerm) {
				$scope.previousSearch = $scope.searchTerm;
				console.log($scope.searchTerm);
				$http.post('api/v3/searchall', {searchstring:$scope.searchTerm}).success(function(data) {
					console.log(data);
			    	return $scope.searchResults = data;
				});
			}
		}
	}

}
//@todo look at why this extra call
DashWidget.$inject = ['TaskByStatus', '$location', '$scope', '$http'];

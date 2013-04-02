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
			console.log($scope.taskDetails.taskHelpers.projects);
			var projectId = $scope.taskDetails.project_id;
			$scope.taskDetails.project_id = $scope.taskDetails.taskHelpers.projects[projectId];
		});

		var created = defaultDate($scope.taskDetails.created);
		$scope.taskDetails.created = angDate(created, 'y-MM-dd');


	});
	
	$scope.saveTask = function() {
		//console.log($scope.taskDetails["billable"]);
		// if($scope.taskDetails.id > 0) {
		// 	TaskDetails.api.update({id:$scope.taskDetails.id}, $scope.taskDetails, function (res) { 
		// 		TaskDetails.broadcastChange();
		// 	});
		// } else {
		// 	TaskDetails.api.save({}, $scope.taskDetails, function(res){
		// 		TaskDetails.broadcastChange();
		// 	});
		// }
	}
}

TaskDetails.$inject = ['TaskDetails', '$routeParams', '$location', '$scope', '$filter', '$http'];
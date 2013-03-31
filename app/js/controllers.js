'use strict';

/* Controllers */

function ClientList($scope, $http) {
  $http.get('api/v3/client').success(function(data) {
    $scope.clients = data;
  });

}

function HostingDetails($scope, $routeParams, $http) {
	
	$scope.saveHosting = function() {
		if(this.plan.id === 0) {
			$http.post('api/v3/hostings', this.plan).success(function(results){
				$scope.hostingplans[0] = results;
			});

		} else {
			$http.put('api/v3/hostings/' + this.plan.id, this.plan).success(function(results){
			});
		}

	}	

	$http.get('api/v3/hostings/' + $routeParams.clientId).success(function(data) {
	$scope.hostingplans = data;
		if($scope.hostingplans.length == 0) {
			var hostingplans = {};
			$scope.hostingplans[0] = { id:0, clientId:$routeParams.clientId, notes:'New Record', levelId:"None Set Yet", backuplocation1: 'SERVER01:/var/www/example', backuplocation2: 'SERVER01:/var/www/example'};
		}
	});
}

function ClientDetails($scope, $routeParams, $http) {
	
	$scope.saveClient = function() {
		if(this.clientsDetails.id === 0) {
			$http.post('api/v3/client', this.clientsDetails).success(function(results){
				$scope.clientsDetails[0] = results;
			});

		} else {
			$http.put('api/v3/client/' + this.clientsDetails.id, this.clientsDetails).success(function(results){

			});
		}

	}	

	$http.get('api/v3/client/' + $routeParams.clientId).success(function(data) {
	$scope.clientsDetails = data;
		if($scope.clientsDetails.length == 0) {
			var clientsDetails = {};
			$scope.clientsDetails = { id:0, clientName: 'Name Me', notes:'New Record', phone:"None Set Yet", phone2: '...'};
		}
	});
}




function PeopleList(People, $location, $scope) {
  // $http.get('api/v3/person').success(function(data) {
  //   $scope.peopleList = data;
  // });

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
				console.log($scope.personDetails);
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
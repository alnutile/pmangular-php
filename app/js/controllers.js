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
			console.log($scope.plan);
			$http.post('api/v3/hostings', this.plan).success(function(results){
				$scope.hostingplans[0] = results;
				//Should allow an append new form option
			});

		} else {
			console.log('Plan is update');
			$http.put('api/v3/hostings/' + this.plan.id, this.plan).success(function(results){
				console.log(results);
				//$scope.hostingplans[0] = results;
				//Should allow an append new form option
			});
		}

	}	

	$http.get('api/v3/hostings/' + $routeParams.clientId).success(function(data) {
	$scope.hostingplans = data;
	if($scope.hostingplans.length == 0) {
		var hostingplans = {};
		$scope.hostingplans[0] = { id:0, clientId:$routeParams.clientId, notes:'New Record', levelId:"None Set Yet", backuplocation1: 'SERVER01:/var/www/example', backuplocation2: 'SERVER01:/var/www/example'};
	}
		console.log($scope.hostingplans);
	});
}
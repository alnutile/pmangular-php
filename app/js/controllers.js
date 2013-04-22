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
				$http.post('api/v3/searchall', {searchstring:$scope.searchTerm}).success(function(data) {
			    	return $scope.searchResults = data;
				});
			}
		}
	}

}
//@todo look at why this extra call
DashWidget.$inject = ['TaskByStatus', '$location', '$scope', '$http'];


function QuoteDetails(Quotes, $routeParams, $location, $scope, $http) {
  //@todo should have access to routeParams in the view
  $scope.clientId = $routeParams.clientId;
  
 	$scope.quote = Quotes.api.query({clientId: $routeParams.clientId}, [], function(results){
 		if(results.length < 1) {
	      $scope.quote.lineitems = {};
	 	  $scope.quote.general = Quotes.general();
	      $scope.quote.lineitems = Quotes.lineitems();
	      $scope.quote.includedItems = Quotes.includedItems();
	      $scope.quote.assumptions = Quotes.assumptions();
	      $scope.quote.overhead = Quotes.overhead();
	      var notInc = Quotes.includedItems();
	      notInc[0].yesno = 0;
	      $scope.quote.notIncludedItems = notInc;
 		}
 	});

  $scope.quote.sizeChoices = Quotes.sizeChoices();
  $scope.quote.rates = Quotes.rates();
  $scope.quote.docs = Quotes.docs();
  $scope.quote.totalPerc = 0;
  $scope.quote.totalPercHigh = 0;
  
  $scope.addLineItem = function() {
    var newline = Quotes.lineitems();
    $scope.quote.lineitems.push(newline[0]);
  }  

  $scope.addIncluded = function() {
    var newline = Quotes.includedItems();
    $scope.quote.includedItems.push(newline[0]);
  }  

  $scope.addNotIncluded = function() {
    var newline = Quotes.includedItems();
    newline[0].yesno = 0;
    $scope.quote.notIncludedItems.push(newline[0]);
  }  
  
  $scope.addAssumption = function() {
    var newline = Quotes.assumptions();
    $scope.quote.assumptions.push(newline[0]);
  } 
	
  $scope.updateHigh = function() {

   var hoursTotal = 0;
   var highTotal = 0;
   var thisLine = this.lineitem;
   var hours = thisLine.hours;
   var doc = thisLine.doc;
   var high = doc * hours;
   
   this.lineitem.high = Math.round(high*100)/100;
   
   angular.forEach(this.quote.lineitems, function(value, key) {
      hoursTotal = hoursTotal + value.hours;
      highTotal = highTotal + value.high;
   });
      
   var highTotal = Math.round(highTotal*100)/100;

   this.quote.general.line_items_total_hours = hoursTotal;
   this.quote.general.line_items_total_high_hours = highTotal;


   //Seems since the change is happening here I need to 
   //Also update the % fields

   var quoteOverhead = angular.copy(this.quote.overhead);
   angular.forEach(this.quote.overhead, function(value, key){
   	//Total Hours x % 
   	var overHeadItemValue = hoursTotal * value.percentage;
   	var overHeadItemValue = Math.round(overHeadItemValue*100)/100;

   	//High Hours
   	var overHeadItemValueHigh = highTotal * value.percentage;
   	var overHeadItemValueHigh = Math.round(overHeadItemValueHigh*100)/100;

   	quoteOverhead[key].total = overHeadItemValue;
	quoteOverhead[key].totalhigh = overHeadItemValueHigh;
   });

   	$scope.quote.overhead = quoteOverhead;

  	//Set totals for showing Overhead Totals
  	var totalOverhead = Quotes.totalPercs($scope.quote.overhead);
  	//Just used to set a label on the form
  	$scope.quote.totalPerc = totalOverhead[0];
  	$scope.quote.totalPercHigh = totalOverhead[1];

   //Update Total high and low at the bottom of the sheet
   //this it the total of line items and % area

   $scope.quote.general.total = hoursTotal + totalOverhead[0];
   $scope.quote.general.total_high = highTotal + totalOverhead[1];

   //Set Totals Monetary
   //@todo move these into a directive?
   //@todo make this value 100 for example 
   //  dynamic
	var Costs = Quotes.totalCost($scope);
	$scope.quote.general.total_quote = Math.round(Costs[0]*100)/100;
	$scope.quote.general.total_quote_high = Math.round(Costs[1]*100)/100;

  } 
  
  $scope.updateOverhead = function() {
  	var changedOverhead = angular.copy(this.percentages);
  	//Get now totals

  	var totalLineItemHours = $scope.quote.general.line_items_total_hours;
  	var totalLineItemHighHours = $scope.quote.general.line_items_total_high_hours;
  	var newTotalPercentage = changedOverhead.percentage;
  	var newTotal = newTotalPercentage * totalLineItemHours;
  	var newTotal = Math.round(newTotal*100)/100;
  	var newHigh = newTotalPercentage * totalLineItemHighHours; 
  	var newHigh = Math.round(newHigh*100)/100;
  	
  	this.percentages.total = newTotal;
  	this.percentages.totalhigh = newHigh;

  	//Set totals for showing Overhead Totals
  	var totalOverhead = Quotes.totalPercs($scope.quote.overhead);
  	//Just used to set a label on the form
  	$scope.quote.totalPerc = totalOverhead[0];
  	$scope.quote.totalPercHigh = totalOverhead[1];

  	//reset totals
  	var total = totalLineItemHours + totalOverhead[0]; 
  	var total_high = totalLineItemHighHours + totalOverhead[1]; 
   	$scope.quote.general.total = total;
   	$scope.quote.general.total_high = total_high;

  	var Costs = Quotes.totalCost($scope);
  	$scope.quote.general.total_quote = Math.round(Costs[0]*100)/100;
   	$scope.quote.general.total_quote_high = Math.round(Costs[1]*100)/100;


  }



  $scope.quoteSave = function() {
  	//@todo seems I should not have to build these
    var sendQuote = {};
    sendQuote.general = $scope.quote.general;
    sendQuote.lineitems = $scope.quote.lineitems;
    sendQuote.notIncludedItems = $scope.quote.notIncludedItems;
    sendQuote.includedItems = $scope.quote.includedItems;
    sendQuote.assumptions = $scope.quote.assumptions;
    sendQuote.overhead = $scope.quote.overhead;
    
    Quotes.api.save({}, sendQuote, function(res) { 
        console.log($scope.quote);
        console.log(sendQuote);
    });
  }

}
QuoteDetails.$inject = ['Quotes', '$routeParams', '$location', '$scope', '$http'];


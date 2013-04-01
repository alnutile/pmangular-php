'use strict';


describe('PM Controllers', function() {

  beforeEach(function(){
    this.addMatchers({
      toEqualData: function(expected) {
        return angular.equals(this.actual, expected);
      }
    });
  });

  beforeEach(module('myApp.services'));

  describe('PeopleList', function(){
    var scope, ctrl, $httpBackend;

    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('api/v3/person').
          respond([{fname:'test1', lname:'test1'},{fname:'test2', lname:'test2'}]);

      scope = $rootScope.$new();
      ctrl = $controller(PeopleList, {$scope: scope});
    }));

    it('should create people list to click on', function() {
      $httpBackend.flush();
      expect(scope.peopleList.length).toBeGreaterThan(1);
    }); 
  });

  describe('PersonDetails', function(){
    var scope, $httpBackend, ctrl,
      xyzPersonData = function() {
        return {
          fname: 'Test fname',
          lname: 'Test lname',
          id: '10',
          phone: '555-555-5555',
          notes: 'test notes',
          email: 'test@example.com'
        }
      };

    beforeEach(inject(function(_$httpBackend_, $rootScope, $routeParams, $controller){
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('api/v3/person/10').respond(xyzPersonData());
    
      $routeParams.personId = '10';
      scope = $rootScope.$new();
      ctrl = $controller(PersonDetails, {$scope: scope});
    }));

    it('should fetch person details', function(){
      $httpBackend.flush();
      expect(scope.personDetails).toEqualData(xyzPersonData());
      console.log(scope.personDetails);
    });
  });

  //End Tests
});

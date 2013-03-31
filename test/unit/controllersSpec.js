'use strict';

describe('PM Controllers', function() {
  describe('PeopleList', function(){
    it('should create people list to click on', function() {
      var scope = {};
        ctrl = new PeopleList(scope);
        expect(scope.phones.length).toBeGreaterThan(1);
    }); 
  )};

});

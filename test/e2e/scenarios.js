'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */
/* test is at http://localhost/pmangular/test/e2e/runner.html */
/* this is after running scripts/e2e-test.sh */

describe('PMAngular App', function() {

  it('should automatically redirect to /dash when location hash/fragment is empty', function() {
    browser().navigateTo('../../app/index.html');
    expect(browser().location().url()).toBe("/dash");
  });

  describe('People List View', function() {

    beforeEach(function() {
      browser().navigateTo('../../app/index.html#/people');
    });


    it('should render people list when user navigates to /people', function() {
      expect(repeater('ul#people li').count()).toBeGreaterThan(2);
    
      input('query').enter('Alfred');
      expect(repeater('ul#people li').count()).toBe(1);

      input('query').enter('Bob the builder');
      expect(repeater('ul#people li').count()).toBe(0);
    });
  }); //End people list view

  describe('Person Detail View', function(){
    beforeEach(function() {
      browser().navigateTo('../../app/index.html#/people/2');
    });

    it('should render a person and their details', function(){
      expect(binding('personDetails.fname')).toBe('Alfred');
    });
  }); //end person details


  describe('Client List View', function() {

    beforeEach(function() {
      browser().navigateTo('../../app/index.html#/clients');
    });


    it('should render client list when user navigates to /clients', function() {
      expect(repeater('ul#clients li').count()).toBeGreaterThan(2);
    
      input('query').enter('BioScale');
      expect(repeater('ul#clients li').count()).toBe(1);

      input('query').enter('Bob the builder');
      expect(repeater('ul#clients li').count()).toBe(0);
    });
  }); //End client list view

  describe('Client Detail View', function(){
    beforeEach(function() {
      browser().navigateTo('../../app/index.html#/clients/1');
    });

    it('should render a client and their details', function(){
      expect(binding('clientDetails.clientName')).toBe('BioScale');
    });

    it('it should update the user name and list', function(){
      expect(element('a#client-1').text()).toBe('BioScale');
      // element('#clientName').val('test update');
      // expect(element('#clientName').val()).toBe('test update');
      // element('#save-1').click();
      // expect(element('a#client-1').text()).toBe('test update');
      // element('#clientName').val('BioScale');
      // element('#save-1').click();
      // expect(element('a#client-1').text()).toBe('BioScale');
      
    });

  }); //end person details

}); //End tests

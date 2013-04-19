'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */
/* test is at http://localhost/pmangular/test/e2e/runner.html */
/* this is after running scripts/e2e-test.sh */
describe('PMAngular App', function() {
/*
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

  }); //end client details

  describe('Hosting List View', function() {

    beforeEach(function() {
      browser().navigateTo('../../app/index.html#/hostings');
    });


    it('should render hostings list when user navigates to /hostings', function() {
      expect(repeater('ul#hostingList li').count()).toBeGreaterThan(2);
    
      input('query').enter('BioScale');
      expect(repeater('ul#hostingList li').count()).toBe(1);

      input('query').enter('Bob the builder');
      expect(repeater('ul#hostingList li').count()).toBe(0);
    });
  }); //End Hostings list view

  describe('Hosting Details View', function() {

    beforeEach(function() {
      browser().navigateTo('../../app/index.html#/hostings/1');
    });

    it('should render hostings detials view for BioScale who have 2', function() {
      expect(repeater('.accordion-group').count()).toBe(2);
      expect(element('input#client-id-5').val()).toBe("1");
    });
  }); //End Hostings Details view
*/
  describe('Quoting System', function() {

    beforeEach(function() {
      browser().navigateTo('../../app/index.html#/quotes/12');
    });

    it('Should start with a default Line Item Area', function() {
      expect(repeater('input.line-item-hours').count()).toBe(1);
      expect(element('input.line-item-hours').val()).toBe("0");
      expect(repeater('input.line-item-high').count()).toBe(1);
      expect(element('input.line-item-high').val()).toBe("0");
      
      //Now Set hours to effect high
      input('lineitem.hours').enter('2');
      expect(element('input.line-item-high').val()).toBe("2.8");
      select('lineitem.doc').option('4');
      expect(element('input.line-item-high').val()).toBe("2.2");
      
      //Test Adding new line item
      element('button.addlineitem').click();
      expect(repeater('input.line-item-hours').count()).toBe(2);
      expect(repeater('input.line-item-high').count()).toBe(2);
      
      //Re-test the hours math on this new line only
      expect(element('input.line-item-hours:eq(1)').val()).toBe("0");
      expect(element('input.line-item-high:eq(1)').val()).toBe("0");
      
      //Testing the 2nd line functionality to make sure this new line works
      using('tr:nth-of-type(2)', "Second line item").input('lineitem.hours').enter('3');
      element('input.line-item-hours:eq(1)').val('3');
      expect(element('input.line-item-high:eq(1)').val()).toBe("4.2");
      using('tr:nth-of-type(2)', "Second line item").select('lineitem.doc').option('4');
      expect(element('input.line-item-high:eq(1)').val()).toBe("3.3");
      
      //Make sure previous line keeps numbers
      expect(element('input.line-item-hours:eq(0)').val()).toBe("2");
      expect(element('input.line-item-high:eq(0)').val()).toBe("2.2");

      //This should also be affecting the Overhead area
      expect(repeater('table.overheads input').count()).toBeGreaterThan(4);
      expect(element('input.overhead-env-total').val()).toBe("0.25");
      expect(element('input.overhead-env-high').val()).toBe("0.28");  


      
    });
  }); //End Hostings Details view

}); //End tests

'use strict';

describe('Controller: SynchronizeCtrl', function () {

  // load the controller's module
  beforeEach(module('ishaLogisticsApp'));

  var SynchronizeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SynchronizeCtrl = $controller('SynchronizeCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SynchronizeCtrl.awesomeThings.length).toBe(3);
  });
});

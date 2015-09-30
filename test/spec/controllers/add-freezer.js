'use strict';

describe('Controller: AddFreezerCtrl', function () {

  // load the controller's module
  beforeEach(module('ishaLogisticsApp'));

  var AddFreezerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddFreezerCtrl = $controller('AddFreezerCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AddFreezerCtrl.awesomeThings.length).toBe(3);
  });
});

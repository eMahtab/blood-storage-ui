'use strict';

describe('Controller: AddBoxCtrl', function () {

  // load the controller's module
  beforeEach(module('ishaLogisticsApp'));

  var AddBoxCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddBoxCtrl = $controller('AddBoxCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AddBoxCtrl.awesomeThings.length).toBe(3);
  });
});

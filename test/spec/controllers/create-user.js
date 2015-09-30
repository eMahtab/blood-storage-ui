'use strict';

describe('Controller: CreateUserCtrl', function () {

  // load the controller's module
  beforeEach(module('ishaLogisticsApp'));

  var CreateUserCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CreateUserCtrl = $controller('CreateUserCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CreateUserCtrl.awesomeThings.length).toBe(3);
  });
});

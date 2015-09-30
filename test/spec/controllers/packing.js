'use strict';

describe('Controller: PackingCtrl', function () {

  // load the controller's module
  beforeEach(module('ishaLogisticsApp'));

  var PackingCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PackingCtrl = $controller('PackingCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PackingCtrl.awesomeThings.length).toBe(3);
  });
});

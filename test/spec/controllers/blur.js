'use strict';

describe('Controller: BlurCtrl', function () {

  // load the controller's module
  beforeEach(module('ishaLogisticsApp'));

  var BlurCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BlurCtrl = $controller('BlurCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(BlurCtrl.awesomeThings.length).toBe(3);
  });
});

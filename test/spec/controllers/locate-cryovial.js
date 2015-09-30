'use strict';

describe('Controller: LocateCryovialCtrl', function () {

  // load the controller's module
  beforeEach(module('ishaLogisticsApp'));

  var LocateCryovialCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LocateCryovialCtrl = $controller('LocateCryovialCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(LocateCryovialCtrl.awesomeThings.length).toBe(3);
  });
});

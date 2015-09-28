'use strict';

describe('Controller: LinkingCtrl', function () {

  // load the controller's module
  beforeEach(module('ishaLogisticsApp'));

  var LinkingCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LinkingCtrl = $controller('LinkingCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(LinkingCtrl.awesomeThings.length).toBe(3);
  });
});

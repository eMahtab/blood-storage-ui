'use strict';

describe('Controller: EditLinkingCtrl', function () {

  // load the controller's module
  beforeEach(module('ishaLogisticsApp'));

  var EditLinkingCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditLinkingCtrl = $controller('EditLinkingCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EditLinkingCtrl.awesomeThings.length).toBe(3);
  });
});

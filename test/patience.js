(function () {
  'use strict';

  var $httpBackend, $httpProvider;
  beforeEach(function () {
    angular.mock.module('begriffs.patience');

    angular.mock.inject(
      ['$httpBackend', '$httpProvider',
      function (httpBackend, httpProvider) {
        $httpBackend = httpBackend;
        $httpProvider = httpProvider;

        $httpProvider.interceptors.push('patience');
      }]
    );
  });

}());

(function () {
  'use strict';

  var $http, $httpBackend;
  beforeEach(function () {
    angular.mock.module('begriffs.patience');

    angular.mock.inject(
      ['$http', '$httpBackend',
      function (http, httpBackend) {
        $http = http;
        $httpBackend = httpBackend;
      }]
    );
  });

  describe('the patience interceptor', function () {
    it('passes normal responses through', function () {
      var handlers = {
        success: function (data, status) {
          expect(status).toEqual(200);
        },
        error: function () { }
      };
      spyOn(handlers, 'success').andCallThrough();
      spyOn(handlers, 'error');

      $http.get('/slow').success(handlers.success).error(handlers.error);

      $httpBackend.expectGET('/slow').respond(200, '');
      $httpBackend.flush();

      expect(handlers.success).toHaveBeenCalled();
      expect(handlers.error).not.toHaveBeenCalled();
    });
  });

}());

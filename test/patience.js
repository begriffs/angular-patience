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
    it('forwards normal responses', function () {
      var statuses = [200, 202];
      angular.forEach(statuses, function(s) {
        var handlers = {
          success: function (data, status) {
            expect(status).toEqual(s);
          },
          error: function () { }
        };
        spyOn(handlers, 'success').andCallThrough();
        spyOn(handlers, 'error');

        $http.get('/slow').success(handlers.success).error(handlers.error);

        $httpBackend.expectGET('/slow').respond(s, '');
        $httpBackend.flush();

        expect(handlers.success).toHaveBeenCalled();
        expect(handlers.error).not.toHaveBeenCalled();
      });
    });

    it('forwards error responses', function () {
      var statuses = [404, 500];
      angular.forEach(statuses, function(s) {
        var handlers = {
          success: function () { },
          error: function (data, status) {
            expect(status).toEqual(s);
          }
        };
        spyOn(handlers, 'success');
        spyOn(handlers, 'error').andCallThrough();

        $http.get('/slow').success(handlers.success).error(handlers.error);

        $httpBackend.expectGET('/slow').respond(s, '');
        $httpBackend.flush();

        expect(handlers.success).not.toHaveBeenCalled();
        expect(handlers.error).toHaveBeenCalled();
      });
    });

    it('follows 202 location suggestion', function () {
      $http.get('/slow');

      $httpBackend.expectGET('/slow').respond(202, '', {Location: '/status'});
      $httpBackend.expectGET('/status').respond(200, '');
      $httpBackend.flush();
      $httpBackend.verifyNoOutstandingRequest();
    });
  });

}());

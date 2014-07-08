(function () {
  'use strict';

  var $http, $httpBackend, $sock, $sockBackend;
  beforeEach(function () {
    angular.mock.module('begriffs.patience');
    angular.mock.module('ngSocketMock');

    angular.mock.inject(
      ['$http', '$httpBackend', 'ngSocket', 'ngSocketBackend',
      function (http, httpBackend, sock, sockBackend) {
        $http        = http;
        $httpBackend = httpBackend;
        $sock        = sock;
        $sockBackend = sockBackend;
      }]
    );
  });

  // afterEach(function () {
  //   $sockBackend.verifyNoOutstandingRequest();
  //   //$sockBackend.verifyNoOutstandingExpectation();
  // });

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
        spyOn(handlers, 'success').and.callThrough();
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
        spyOn(handlers, 'error').and.callThrough();

        $http.get('/slow').success(handlers.success).error(handlers.error);

        $httpBackend.expectGET('/slow').respond(s, '');
        $httpBackend.flush();

        expect(handlers.success).not.toHaveBeenCalled();
        expect(handlers.error).toHaveBeenCalled();
      });
    });

    it('becomes patient upon HTTP 202 and websocket upgrade', function () {
      var handlers = {
        success: function () { },
        error: function () { },
        notify: function () { done(); }
      };
      spyOn(handlers, 'success');
      spyOn(handlers, 'error');
      spyOn(handlers, 'notify').and.callThrough();

      var q = $http.get('/slow');
      q.then(handlers.success, handlers.error, handlers.notify);

      $httpBackend.expectGET('/slow').respond(202, '', {'Location': 'wss://status'});
      $httpBackend.flush();

      $sock('wss://status').send('notify');
      $sockBackend.flush();

      expect(handlers.notify).toHaveBeenCalled();
      expect(handlers.success).not.toHaveBeenCalled();
      expect(handlers.error).not.toHaveBeenCalled();
    });
  });

}());

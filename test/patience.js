(function () {
  'use strict';

  var $http, $httpBackend, $sockBackend;
  beforeEach(function () {
    angular.mock.module('begriffs.patience');
    angular.mock.module('ngSocketMock');

    angular.mock.inject(
      ['$http', '$httpBackend', 'ngSocketBackend',
      function (http, httpBackend, sockBackend) {
        $http        = http;
        $httpBackend = httpBackend;
        $sockBackend = sockBackend;
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

    it('becomes patient upon HTTP 202 and websocket upgrade', function () {
      var handlers = {
        success: function () { },
        error: function () { },
        notify: function () { }
      };
      spyOn(handlers, 'success');
      spyOn(handlers, 'error');
      spyOn(handlers, 'notify').andCallThrough();

      $httpBackend.expectGET('/slow').respond(202, '', {Location: 'wss://status'});
      $http.get('/slow').then(handlers.success, handlers.error, handlers.notify);

      $sockBackend.expectConnect('wss://status');

      var sock = $sockBackend.createWebSocketBackend('wss://status');
      console.log(sock);
      sock.send('notify', { progress: 0.5 });

      $sockBackend.flush();
      expect(handlers.notify).toHaveBeenCalled();
    });
  });

}());

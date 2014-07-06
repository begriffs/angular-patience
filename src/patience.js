(function() {
  'use strict';

  angular.module('begriffs.patience', ['ngSocket']).

    factory('patience', ['$q', '$injector', 'ngSocket', function ($q, $injector, sock) {
      var $http;
      return {
        response: function(response) {
          $http = $http || $injector.get('$http');
          if(response.status === 202 && typeof(response.headers('Location')) === 'string') {
            if(response.headers('Location').match(/^wss?:/)) {
              var ws = sock(response.headers('Location')),
                wait = $q.defer();

              ws.onMessage('notify', function (e) {
                wait.notify(angular.fromJson(e.data));
              });
              ws.onMessage('complete', function (e) {
                response.config.url = e.data.url;
                wait.resolve($http(response.config));
              });

              return wait;
            }

            response.config.url = response.headers('Location');
            return $http(response.config);
          }
          return response || $q.when(response);
        },

        responseError: function(rejection) {
          // if (canRecover(rejection)) {
          //   return responseOrNewPromise;
          // }
          return $q.reject(rejection);
        }
      };
    }]).

    config(['$httpProvider', function ($httpProvider) {
      $httpProvider.interceptors.push('patience');
    }]);

}());

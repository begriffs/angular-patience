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

              ws.onMessage(function (e) {
                wait.notify(angular.fromJson(e.data));
              }, 'notify');
              return wait.promise;
            }

            response.config.url = response.headers('Location');
            return $http(response.config);
          }
          return response || $q.when(response);
        },

        responseError: function(rejection) {
          return $q.reject(rejection);
        }
      };
    }]).

    config(['$httpProvider', function ($httpProvider) {
      $httpProvider.interceptors.push('patience');
    }]);

}());

(function() {
  'use strict';

  angular.module('begriffs.patience', []).

    factory('patience', ['$q', '$injector', function ($q, $injector) {
      var $http;
      return {
        response: function(response) {
          $http = $http || $injector.get('$http');
          if(response.status === 202 && typeof(response.headers('Location')) === 'string') {
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

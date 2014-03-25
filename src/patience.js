(function() {
  'use strict';

  angular.module('begriffs.patience', []).

    factory('patience', ['$http', '$q', function ($http, $q) {
      return {
        request: function(config) {
          return config || $q.when(config);
        },

        requestError: function(rejection) {
          if (canRecover(rejection)) {
            return responseOrNewPromise;
          }
          return $q.reject(rejection);
        },

        response: function(response) {
          return response || $q.when(response);
        },

        responseError: function(rejection) {
          if (canRecover(rejection)) {
            return responseOrNewPromise;
          }
          return $q.reject(rejection);
        }
      };
    }]);

}());

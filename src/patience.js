(function() {
  'use strict';

  angular.module('begriffs.patience', []).

    factory('patience', ['$http', '$q', function ($http, $q) {
      return {
        response: function(response) {
          console.log(response);
          return response || $q.when(response);
        },

        responseError: function(rejection) {
          // if (canRecover(rejection)) {
          //   return responseOrNewPromise;
          // }
          return $q.reject(rejection);
        }
      };
    }]);

}());

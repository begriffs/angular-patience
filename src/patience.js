(function() {
  'use strict';

  angular.module('begriffs.patience', []).

    config(['$httpProvider', function ($httpProvider) {
      $httpProvider.interceptors.push(['$q',
        function ($q) {
          return {
            response: function(response) {
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
    }]);

}());

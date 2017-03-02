(function() {
    'use strict';
    angular.module('app').component('homeComponent', {
        templateUrl: 'views/home.template.html',
        controller: function($location) {
            var ctrl = this;
            ctrl.login = function(username, password) {
                console.log(ctrl.isCorrect);
                if (username === 'Angel' && password === 'Angel') {
                    $location.path('/passwordspage');
                } else {
                    ctrl.isCorrect = false;
                }
            }
        }
    }).config(function($routeProvider) {
        $routeProvider
            .when('/', {
                template: '<home-component></home-component>'
            });
    });
})();
(function() {
    'use strict';
    angular.module('app').component('passwordspagecomponent', {
        templateUrl: 'views/passwordspage.template.html',
        controller: function() {}
    }).config(function($routeProvider) {
        $routeProvider
            .when('/passwordspage', {
                template: '<passwordspagecomponent></passwordspagecomponent> <searchbarcomponent></searchbarcomponent>'
            });
    });
})();
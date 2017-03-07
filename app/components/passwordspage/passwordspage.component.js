(function() {
    'use strict';
    angular.module('app').component('passwordspagecomponent', {
        templateUrl: 'views/passwordspage.template.html',
        controller: function($location, cookiesService) {

            this.logout = () => {
                if (cookiesService.getCookie("in") !== "") {
                    cookiesService.setCookie("in", cookiesService.getCookie("in"), -1);
                    $location.path('/');
                }
            }
            this.$onInit = () => {
                if (cookiesService.getCookie("in") === "") {
                    $location.path('/');
                }
                this.username = cookiesService.getCookie("in");
            }
        }
    }).config(function($routeProvider) {
        $routeProvider
            .when('/passwordspage', {
                template: "<passwordspagecomponent></passwordspagecomponent>"
            });
    });
})();
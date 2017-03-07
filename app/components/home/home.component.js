(function() {
    'use strict';
    angular.module('app').component('homeComponent', {
        templateUrl: 'views/home.template.html',
        controller: function($location, cookiesService) {
            this.validUsers = [
                { username: "angel", password: "angel" },
                { username: "carlos", password: "carlos" },
                { username: "javi", password: "javi" },
                { username: "alex", password: "alex" },
                { username: "victor", password: "victor" },
                { username: "gabi", password: "gabi" },
                { username: "fran", password: "fran" },
                { username: "andy", password: "andy" }
            ];
            this.login = (username, password) => {
                for (var user of this.validUsers) {
                    if (username === user.username && password === user.password) {
                        cookiesService.setCookie("in", username, 1);
                        $location.path('/passwordspage');
                    } else {
                        this.isCorrect = false;
                    }
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
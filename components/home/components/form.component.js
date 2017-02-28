angular.module("formcomponent", [])
    .component('formcomponent', {
        templateUrl: './form.html',
        controller: 'formController',
    })
    .controller("formController", ['$window', function($window) {
        var ctrl = this;
        ctrl.login = function(username, password) {
            console.log(username);
            if (username === 'Angel' && password === 'Angel') {
                $window.location.href = '/passwordspage.html'
            } else {
                ctrl.isCorrect = false;
            }
        }
    }]);
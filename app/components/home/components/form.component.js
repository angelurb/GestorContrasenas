(function() {
    'use strict';
    angular.module('app')
        .component('formcomponent', {
            templateUrl: 'views/form.template.html',
            bindings: {
                isCorrect: '<',
                onLogin: '&'
            },
            controller: function() {
                var ctrl = this;
                ctrl.login = () => {
                    ctrl.onLogin({
                        user: ctrl.username,
                        password: ctrl.password
                    });
                    if (ctrl.isCorrect === false) {
                        ctrl.messageError = 'Username or Password incorrect'
                    } else {
                        ctrl.messageError = '';
                    }
                }


            }
        });
})();
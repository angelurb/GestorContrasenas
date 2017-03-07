(function() {
    'use strict';
    angular.module('app')
        .component('formcomponent', {
            bindings: {
                isCorrect: '<',
                onLogin: '&'
            },
            templateUrl: 'views/form.template.html',
            controller: function() {
                this.$onChanges = (changes) => {
                    if (changes.isCorrect) {
                        this.correct = angular.copy(changes.isCorrect.currentValue);
                        showError();
                    }
                };
                this.login = () => {
                    this.onLogin({
                        user: this.username,
                        password: this.password
                    });
                };
                // Private functions:
                var ctrl = this;

                function showError() {
                    if (ctrl.correct === false) {
                        ctrl.messageError = 'Username or Password incorrect';
                    } else {
                        ctrl.messageError = '';
                    }
                }
            }
        });
})();
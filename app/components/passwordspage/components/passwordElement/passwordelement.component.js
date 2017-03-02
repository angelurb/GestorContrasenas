(function() {
    'use strict';
    angular.module("app").component('passwordelementcomponent', {
        templateUrl: 'views/passwordelement.template.html',
        bindings: {
            element: '<',
            onDelete: '&',
            addElement: '&'
        },
        controller: function() {
            var ctrl = this;
            ctrl.create = () => {
                ctrl.addElement();
            }
            ctrl.reset = () => {
                ctrl.element.website = ctrl.element.websiteCopy;
                ctrl.element.login = ctrl.element.loginCopy;
                ctrl.element.password = ctrl.element.passwordCopy;
            };
            ctrl.edit = () => {
                ctrl.editMode = !ctrl.editMode;
                ctrl.element.websiteCopy = ctrl.element.website;
                ctrl.element.loginCopy = ctrl.element.login;
                ctrl.element.passwordCopy = ctrl.element.password;
            }
            ctrl.delete = () => {
                ctrl.onDelete();
            }
            ctrl.save = () => {
                ctrl.editMode = !ctrl.editMode;
            }
        }
    });
})();
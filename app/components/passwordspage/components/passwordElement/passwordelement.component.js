(function() {
    'use strict';
    angular.module("app").component('passwordelementcomponent', {
        templateUrl: 'views/passwordelement.template.html',
        bindings: {
            save: '&',
            close: '&',
            elementToEdit: "<"
        },

        controller: function() {
            var ctrl = this;
            ctrl.element = ctrl.elementToEdit;
            ctrl.reset = () => {
                try {
                    ctrl.element.website = '';
                    ctrl.element.login = '';
                    ctrl.element.password = '';
                } catch (error) {}
            };
            ctrl.guardar = () => {
                if (ctrl.element === undefined ||
                    ctrl.element.website === undefined ||
                    ctrl.element.login === undefined ||
                    ctrl.element.password === undefined) {
                    ctrl.camposVacios = true;
                } else {
                    ctrl.save({ elemento: ctrl.element });
                }
            }
            ctrl.cerrar = () => {
                ctrl.close();
            };
        }
    });
})();
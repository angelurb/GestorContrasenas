(function() {
    'use strict';
    angular.module("app").component('passwordelementcomponent', {
        templateUrl: 'views/passwordelement.template.html',
        bindings: {
            element: '<',
            onDelete: '&',
            addElement: '&',
            save: '&',
            close: '&'
        },
        controller: function() {
            var ctrl = this;
            ctrl.reset = () => {
                ctrl.element.website = '';
                ctrl.element.login = '';
                ctrl.element.password = '';
            };
            ctrl.delete = () => {
                ctrl.onDelete();
            }
            ctrl.guardar = () => {
                if (ctrl.element === undefined) {
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
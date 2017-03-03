(function() {
    'use strict';
    angular.module('app').component('tablecomponent', {
        templateUrl: 'views/table.template.html',
        controller: function() {
            var ctrl = this;
            ctrl.wantDelete = '';
            ctrl.elements = [{
                website: 'www.gmail.com',
                login: 'angel',
                password: 'angel'
            }, {
                website: 'www.hotmail.com',
                login: 'angel',
                password: 'angel'
            }];
            ctrl.guardar = (elemento) => {
                if (ctrl.editMode) {
                    ctrl.elements.splice(ctrl.index, 1, elemento);
                    ctrl.editMode = false;
                } else if (ctrl.newRegister) {
                    ctrl.elements.push(elemento);
                    ctrl.newRegister = false;
                }
            };
            this.deleteElement = (element) => {
                var idx = ctrl.elements.indexOf(element);
                if (idx >= 0) {
                    ctrl.elements.splice(idx, 1);
                }
            }
            ctrl.wantDelete = (i) => {
                return true;
            }
            ctrl.addElement = () => {
                ctrl.newRegister = true;
            }
            ctrl.edit = (i) => {
                ctrl.index = i;
                ctrl.editMode = !ctrl.editMode;
            }
            ctrl.cerrar = () => {
                ctrl.editMode = false;
                ctrl.newRegister = false;
            };
        }
    });
})();
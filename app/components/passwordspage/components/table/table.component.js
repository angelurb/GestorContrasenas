(function() {
    'use strict';
    angular.module('app').component('tablecomponent', {
        templateUrl: 'views/table.template.html',
        controller: function() {
            var ctrl = this;
            ctrl.elements = [{
                website: 'www.gmail.com',
                login: 'angel',
                password: 'angel'
            }, {
                website: 'www.hotmail.com',
                login: 'angel',
                password: 'angel'
            }];
            ctrl.deleteElement = (element) => {
                var idx = ctrl.elements.indexOf(element);
                if (idx >= 0) {
                    ctrl.elements.splice(idx, 1);
                }
            }
            ctrl.addElement = () => {
                ctrl.elements.push({});
            }
        }
    });
})();
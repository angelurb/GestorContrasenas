(function() {
    'use strict';
    angular.module('app', ['ngRoute']);
})();
(function() {
    'use strict';
    angular.module('app').component('homeComponent', {
        templateUrl: 'views/home.template.html',
        controller: function($location) {
            var ctrl = this;
            ctrl.login = function(username, password) {
                console.log(ctrl.isCorrect);
                if (username === 'Angel' && password === 'Angel') {
                    $location.path('/passwordspage');
                } else {
                    ctrl.isCorrect = false;
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
(function() {
    'use strict';
    angular.module('app').component('passwordspagecomponent', {
        templateUrl: 'views/passwordspage.template.html',
        controller: function() {}
    }).config(function($routeProvider) {
        $routeProvider
            .when('/passwordspage', {
                template: '<passwordspagecomponent></passwordspagecomponent>'
            });
    });
})();
 (function() {
     'use strict';
     angular.module('app')
         .component('relojcomponent', {
             templateUrl: 'views/reloj.template.html',
             controller: 'RelojController',
         });
 })();
angular.module("app").controller("RelojController", [
    '$interval',
    function($interval) {
        var ctrl = this;
        secNum = 59;
        intervalMs = 1000;
        //Iniciación de todas las variables
        ctrl.$onInit = function() {
                getActualDate();
                noonCheck();
                intervalTime(intervalMs);
            }
            //Funciones Privadas

        //Fecha actual
        function getActualDate() {
            ctrl.daysArray = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
            var date = new Date();
            ctrl.hours = date.getHours();
            ctrl.minutes = date.getMinutes();
            ctrl.seconds = date.getSeconds();
            ctrl.weekday = date.getDay();
        };

        //Noon check 
        function noonCheck() {
            ctrl.format12 = true;
            ctrl.format12 ? ctrl.noonHours = 12 : ctrl.noonHours = 24;
            ctrl.hours >= ctrl.noonHours ? (ctrl.isNoon = true, ctrl.hours = ctrl.hours - ctrl.noonHours) : ctrl.isNoon = false;
        };

        //Interval  
        function intervalTime(intervalMs) {
            $interval(() => {
                actualizarHora();
            }, intervalMs);
        };

        //Actualiza la hora del Reloj cada vez que se llama
        function actualizarHora() {
            if (ctrl.seconds >= secNum) {
                ctrl.seconds = 0;
                ctrl.minutes++;
                if (ctrl.minutes >= secNum) {
                    checkChange(ctrl.minutes, secNum) ? (ctrl.minutes = 0, ctrl.hours++) : '';
                    checkChangeWeekday();
                    checkChange(ctrl.hours, ctrl.noonHours) ? (ctrl.hours = 0, ctrl.isNoon = !ctrl.isNoon) : '';
                }
            }
            ctrl.seconds++;
        };


        //Cambio de día de la semana
        function checkChangeWeekday() {
            if (ctrl.isNoon === true && ctrl.hours >= 12) {
                if (ctrl.weekday < 7) {
                    ctrl.weekday++;
                } else {
                    ctrl.weekday = 1;
                }
            }
        };

        //Comprobación de cambio (Ej: Si han passado 60 segundos, devuelve true para incrementar los minutos)
        function checkChange(value, maxValue) {
            if (value >= maxValue) {
                return true;
            } else {
                return false;
            }
        };
    }
]);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUuanMiLCJob21lL2hvbWUuY29tcG9uZW50LmpzIiwicGFzc3dvcmRzcGFnZS9wYXNzd29yZHNwYWdlLmNvbXBvbmVudC5qcyIsImNvbW1vbi9yZWxvai9yZWxvai5jb21wb25lbnQuanMiLCJjb21tb24vcmVsb2ovcmVsb2ouY29udHJvbGxlci5qcyIsImhvbWUvY29tcG9uZW50cy9mb3JtLmNvbXBvbmVudC5qcyIsInBhc3N3b3Jkc3BhZ2UvY29tcG9uZW50cy9wYXNzd29yZEVsZW1lbnQvcGFzc3dvcmRlbGVtZW50LmNvbXBvbmVudC5qcyIsInBhc3N3b3Jkc3BhZ2UvY29tcG9uZW50cy90YWJsZS90YWJsZS5jb21wb25lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwJywgWyduZ1JvdXRlJ10pO1xyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnKS5jb21wb25lbnQoJ2hvbWVDb21wb25lbnQnLCB7XHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9ob21lLnRlbXBsYXRlLmh0bWwnLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRsb2NhdGlvbikge1xyXG4gICAgICAgICAgICB2YXIgY3RybCA9IHRoaXM7XHJcbiAgICAgICAgICAgIGN0cmwubG9naW4gPSBmdW5jdGlvbih1c2VybmFtZSwgcGFzc3dvcmQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGN0cmwuaXNDb3JyZWN0KTtcclxuICAgICAgICAgICAgICAgIGlmICh1c2VybmFtZSA9PT0gJ0FuZ2VsJyAmJiBwYXNzd29yZCA9PT0gJ0FuZ2VsJykge1xyXG4gICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGFzc3dvcmRzcGFnZScpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjdHJsLmlzQ29ycmVjdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSkuY29uZmlnKGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyKSB7XHJcbiAgICAgICAgJHJvdXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLndoZW4oJy8nLCB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxob21lLWNvbXBvbmVudD48L2hvbWUtY29tcG9uZW50PidcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwJykuY29tcG9uZW50KCdwYXNzd29yZHNwYWdlY29tcG9uZW50Jywge1xyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvcGFzc3dvcmRzcGFnZS50ZW1wbGF0ZS5odG1sJyxcclxuICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHt9XHJcbiAgICB9KS5jb25maWcoZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIpIHtcclxuICAgICAgICAkcm91dGVQcm92aWRlclxyXG4gICAgICAgICAgICAud2hlbignL3Bhc3N3b3Jkc3BhZ2UnLCB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxwYXNzd29yZHNwYWdlY29tcG9uZW50PjwvcGFzc3dvcmRzcGFnZWNvbXBvbmVudD4nXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pKCk7IiwiIChmdW5jdGlvbigpIHtcclxuICAgICAndXNlIHN0cmljdCc7XHJcbiAgICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgIC5jb21wb25lbnQoJ3JlbG9qY29tcG9uZW50Jywge1xyXG4gICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9yZWxvai50ZW1wbGF0ZS5odG1sJyxcclxuICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZWxvakNvbnRyb2xsZXInLFxyXG4gICAgICAgICB9KTtcclxuIH0pKCk7IiwiYW5ndWxhci5tb2R1bGUoXCJhcHBcIikuY29udHJvbGxlcihcIlJlbG9qQ29udHJvbGxlclwiLCBbXHJcbiAgICAnJGludGVydmFsJyxcclxuICAgIGZ1bmN0aW9uKCRpbnRlcnZhbCkge1xyXG4gICAgICAgIHZhciBjdHJsID0gdGhpcztcclxuICAgICAgICBzZWNOdW0gPSA1OTtcclxuICAgICAgICBpbnRlcnZhbE1zID0gMTAwMDtcclxuICAgICAgICAvL0luaWNpYWNpw7NuIGRlIHRvZGFzIGxhcyB2YXJpYWJsZXNcclxuICAgICAgICBjdHJsLiRvbkluaXQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGdldEFjdHVhbERhdGUoKTtcclxuICAgICAgICAgICAgICAgIG5vb25DaGVjaygpO1xyXG4gICAgICAgICAgICAgICAgaW50ZXJ2YWxUaW1lKGludGVydmFsTXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vRnVuY2lvbmVzIFByaXZhZGFzXHJcblxyXG4gICAgICAgIC8vRmVjaGEgYWN0dWFsXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0QWN0dWFsRGF0ZSgpIHtcclxuICAgICAgICAgICAgY3RybC5kYXlzQXJyYXkgPSBbJ01PTicsICdUVUUnLCAnV0VEJywgJ1RIVScsICdGUkknLCAnU0FUJywgJ1NVTiddO1xyXG4gICAgICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIGN0cmwuaG91cnMgPSBkYXRlLmdldEhvdXJzKCk7XHJcbiAgICAgICAgICAgIGN0cmwubWludXRlcyA9IGRhdGUuZ2V0TWludXRlcygpO1xyXG4gICAgICAgICAgICBjdHJsLnNlY29uZHMgPSBkYXRlLmdldFNlY29uZHMoKTtcclxuICAgICAgICAgICAgY3RybC53ZWVrZGF5ID0gZGF0ZS5nZXREYXkoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvL05vb24gY2hlY2sgXHJcbiAgICAgICAgZnVuY3Rpb24gbm9vbkNoZWNrKCkge1xyXG4gICAgICAgICAgICBjdHJsLmZvcm1hdDEyID0gdHJ1ZTtcclxuICAgICAgICAgICAgY3RybC5mb3JtYXQxMiA/IGN0cmwubm9vbkhvdXJzID0gMTIgOiBjdHJsLm5vb25Ib3VycyA9IDI0O1xyXG4gICAgICAgICAgICBjdHJsLmhvdXJzID49IGN0cmwubm9vbkhvdXJzID8gKGN0cmwuaXNOb29uID0gdHJ1ZSwgY3RybC5ob3VycyA9IGN0cmwuaG91cnMgLSBjdHJsLm5vb25Ib3VycykgOiBjdHJsLmlzTm9vbiA9IGZhbHNlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vSW50ZXJ2YWwgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGludGVydmFsVGltZShpbnRlcnZhbE1zKSB7XHJcbiAgICAgICAgICAgICRpbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBhY3R1YWxpemFySG9yYSgpO1xyXG4gICAgICAgICAgICB9LCBpbnRlcnZhbE1zKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvL0FjdHVhbGl6YSBsYSBob3JhIGRlbCBSZWxvaiBjYWRhIHZleiBxdWUgc2UgbGxhbWFcclxuICAgICAgICBmdW5jdGlvbiBhY3R1YWxpemFySG9yYSgpIHtcclxuICAgICAgICAgICAgaWYgKGN0cmwuc2Vjb25kcyA+PSBzZWNOdW0pIHtcclxuICAgICAgICAgICAgICAgIGN0cmwuc2Vjb25kcyA9IDA7XHJcbiAgICAgICAgICAgICAgICBjdHJsLm1pbnV0ZXMrKztcclxuICAgICAgICAgICAgICAgIGlmIChjdHJsLm1pbnV0ZXMgPj0gc2VjTnVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tDaGFuZ2UoY3RybC5taW51dGVzLCBzZWNOdW0pID8gKGN0cmwubWludXRlcyA9IDAsIGN0cmwuaG91cnMrKykgOiAnJztcclxuICAgICAgICAgICAgICAgICAgICBjaGVja0NoYW5nZVdlZWtkYXkoKTtcclxuICAgICAgICAgICAgICAgICAgICBjaGVja0NoYW5nZShjdHJsLmhvdXJzLCBjdHJsLm5vb25Ib3VycykgPyAoY3RybC5ob3VycyA9IDAsIGN0cmwuaXNOb29uID0gIWN0cmwuaXNOb29uKSA6ICcnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGN0cmwuc2Vjb25kcysrO1xyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICAvL0NhbWJpbyBkZSBkw61hIGRlIGxhIHNlbWFuYVxyXG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrQ2hhbmdlV2Vla2RheSgpIHtcclxuICAgICAgICAgICAgaWYgKGN0cmwuaXNOb29uID09PSB0cnVlICYmIGN0cmwuaG91cnMgPj0gMTIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjdHJsLndlZWtkYXkgPCA3KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3RybC53ZWVrZGF5Kys7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGN0cmwud2Vla2RheSA9IDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvL0NvbXByb2JhY2nDs24gZGUgY2FtYmlvIChFajogU2kgaGFuIHBhc3NhZG8gNjAgc2VndW5kb3MsIGRldnVlbHZlIHRydWUgcGFyYSBpbmNyZW1lbnRhciBsb3MgbWludXRvcylcclxuICAgICAgICBmdW5jdGlvbiBjaGVja0NoYW5nZSh2YWx1ZSwgbWF4VmFsdWUpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlID49IG1heFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbl0pOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgIC5jb21wb25lbnQoJ2Zvcm1jb21wb25lbnQnLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvZm9ybS50ZW1wbGF0ZS5odG1sJyxcclxuICAgICAgICAgICAgYmluZGluZ3M6IHtcclxuICAgICAgICAgICAgICAgIGlzQ29ycmVjdDogJzwnLFxyXG4gICAgICAgICAgICAgICAgb25Mb2dpbjogJyYnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGN0cmwgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgY3RybC5sb2dpbiA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjdHJsLm9uTG9naW4oe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VyOiBjdHJsLnVzZXJuYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXNzd29yZDogY3RybC5wYXNzd29yZFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdHJsLmlzQ29ycmVjdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3RybC5tZXNzYWdlRXJyb3IgPSAnVXNlcm5hbWUgb3IgUGFzc3dvcmQgaW5jb3JyZWN0J1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0cmwubWVzc2FnZUVycm9yID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyLm1vZHVsZShcImFwcFwiKS5jb21wb25lbnQoJ3Bhc3N3b3JkZWxlbWVudGNvbXBvbmVudCcsIHtcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL3Bhc3N3b3JkZWxlbWVudC50ZW1wbGF0ZS5odG1sJyxcclxuICAgICAgICBiaW5kaW5nczoge1xyXG4gICAgICAgICAgICBlbGVtZW50OiAnPCcsXHJcbiAgICAgICAgICAgIG9uRGVsZXRlOiAnJicsXHJcbiAgICAgICAgICAgIGFkZEVsZW1lbnQ6ICcmJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBjdHJsID0gdGhpcztcclxuICAgICAgICAgICAgY3RybC5jcmVhdGUgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjdHJsLmFkZEVsZW1lbnQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjdHJsLnJlc2V0ID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY3RybC5lbGVtZW50LndlYnNpdGUgPSBjdHJsLmVsZW1lbnQud2Vic2l0ZUNvcHk7XHJcbiAgICAgICAgICAgICAgICBjdHJsLmVsZW1lbnQubG9naW4gPSBjdHJsLmVsZW1lbnQubG9naW5Db3B5O1xyXG4gICAgICAgICAgICAgICAgY3RybC5lbGVtZW50LnBhc3N3b3JkID0gY3RybC5lbGVtZW50LnBhc3N3b3JkQ29weTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgY3RybC5lZGl0ID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY3RybC5lZGl0TW9kZSA9ICFjdHJsLmVkaXRNb2RlO1xyXG4gICAgICAgICAgICAgICAgY3RybC5lbGVtZW50LndlYnNpdGVDb3B5ID0gY3RybC5lbGVtZW50LndlYnNpdGU7XHJcbiAgICAgICAgICAgICAgICBjdHJsLmVsZW1lbnQubG9naW5Db3B5ID0gY3RybC5lbGVtZW50LmxvZ2luO1xyXG4gICAgICAgICAgICAgICAgY3RybC5lbGVtZW50LnBhc3N3b3JkQ29weSA9IGN0cmwuZWxlbWVudC5wYXNzd29yZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjdHJsLmRlbGV0ZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGN0cmwub25EZWxldGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjdHJsLnNhdmUgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjdHJsLmVkaXRNb2RlID0gIWN0cmwuZWRpdE1vZGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwJykuY29tcG9uZW50KCd0YWJsZWNvbXBvbmVudCcsIHtcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL3RhYmxlLnRlbXBsYXRlLmh0bWwnLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgY3RybCA9IHRoaXM7XHJcbiAgICAgICAgICAgIGN0cmwuZWxlbWVudHMgPSBbe1xyXG4gICAgICAgICAgICAgICAgd2Vic2l0ZTogJ3d3dy5nbWFpbC5jb20nLFxyXG4gICAgICAgICAgICAgICAgbG9naW46ICdhbmdlbCcsXHJcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogJ2FuZ2VsJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICB3ZWJzaXRlOiAnd3d3LmhvdG1haWwuY29tJyxcclxuICAgICAgICAgICAgICAgIGxvZ2luOiAnYW5nZWwnLFxyXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6ICdhbmdlbCdcclxuICAgICAgICAgICAgfV07XHJcbiAgICAgICAgICAgIGN0cmwuZGVsZXRlRWxlbWVudCA9IChlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaWR4ID0gY3RybC5lbGVtZW50cy5pbmRleE9mKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGlkeCA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3RybC5lbGVtZW50cy5zcGxpY2UoaWR4LCAxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjdHJsLmFkZEVsZW1lbnQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjdHJsLmVsZW1lbnRzLnB1c2goe30pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn0pKCk7Il19

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
                template: '<passwordspagecomponent></passwordspagecomponent> <searchbarcomponent></searchbarcomponent>'
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
    angular.module('app').component('searchbarcomponent', {
        templateUrl: 'views/searchbar.template.html',
        controller: function() {}
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUuanMiLCJob21lL2hvbWUuY29tcG9uZW50LmpzIiwicGFzc3dvcmRzcGFnZS9wYXNzd29yZHNwYWdlLmNvbXBvbmVudC5qcyIsImNvbW1vbi9yZWxvai9yZWxvai5jb21wb25lbnQuanMiLCJjb21tb24vcmVsb2ovcmVsb2ouY29udHJvbGxlci5qcyIsImhvbWUvY29tcG9uZW50cy9mb3JtLmNvbXBvbmVudC5qcyIsInBhc3N3b3Jkc3BhZ2UvY29tcG9uZW50cy9wYXNzd29yZEVsZW1lbnQvcGFzc3dvcmRlbGVtZW50LmNvbXBvbmVudC5qcyIsInBhc3N3b3Jkc3BhZ2UvY29tcG9uZW50cy9zZWFyY2hiYXIvc2VhcmNoYmFyLmNvbXBvbmVudC5qcyIsInBhc3N3b3Jkc3BhZ2UvY29tcG9uZW50cy90YWJsZS90YWJsZS5jb21wb25lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbJ25nUm91dGUnXSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpLmNvbXBvbmVudCgnaG9tZUNvbXBvbmVudCcsIHtcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2hvbWUudGVtcGxhdGUuaHRtbCcsXHJcbiAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24oJGxvY2F0aW9uKSB7XHJcbiAgICAgICAgICAgIHZhciBjdHJsID0gdGhpcztcclxuICAgICAgICAgICAgY3RybC5sb2dpbiA9IGZ1bmN0aW9uKHVzZXJuYW1lLCBwYXNzd29yZCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3RybC5pc0NvcnJlY3QpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHVzZXJuYW1lID09PSAnQW5nZWwnICYmIHBhc3N3b3JkID09PSAnQW5nZWwnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wYXNzd29yZHNwYWdlJyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGN0cmwuaXNDb3JyZWN0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KS5jb25maWcoZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIpIHtcclxuICAgICAgICAkcm91dGVQcm92aWRlclxyXG4gICAgICAgICAgICAud2hlbignLycsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPGhvbWUtY29tcG9uZW50PjwvaG9tZS1jb21wb25lbnQ+J1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnKS5jb21wb25lbnQoJ3Bhc3N3b3Jkc3BhZ2Vjb21wb25lbnQnLCB7XHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9wYXNzd29yZHNwYWdlLnRlbXBsYXRlLmh0bWwnLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge31cclxuICAgIH0pLmNvbmZpZyhmdW5jdGlvbigkcm91dGVQcm92aWRlcikge1xyXG4gICAgICAgICRyb3V0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC53aGVuKCcvcGFzc3dvcmRzcGFnZScsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPHBhc3N3b3Jkc3BhZ2Vjb21wb25lbnQ+PC9wYXNzd29yZHNwYWdlY29tcG9uZW50PiA8c2VhcmNoYmFyY29tcG9uZW50Pjwvc2VhcmNoYmFyY29tcG9uZW50PidcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSkoKTsiLCIgKGZ1bmN0aW9uKCkge1xyXG4gICAgICd1c2Ugc3RyaWN0JztcclxuICAgICBhbmd1bGFyLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAgLmNvbXBvbmVudCgncmVsb2pjb21wb25lbnQnLCB7XHJcbiAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL3JlbG9qLnRlbXBsYXRlLmh0bWwnLFxyXG4gICAgICAgICAgICAgY29udHJvbGxlcjogJ1JlbG9qQ29udHJvbGxlcicsXHJcbiAgICAgICAgIH0pO1xyXG4gfSkoKTsiLCJhbmd1bGFyLm1vZHVsZShcImFwcFwiKS5jb250cm9sbGVyKFwiUmVsb2pDb250cm9sbGVyXCIsIFtcclxuICAgICckaW50ZXJ2YWwnLFxyXG4gICAgZnVuY3Rpb24oJGludGVydmFsKSB7XHJcbiAgICAgICAgdmFyIGN0cmwgPSB0aGlzO1xyXG4gICAgICAgIHNlY051bSA9IDU5O1xyXG4gICAgICAgIGludGVydmFsTXMgPSAxMDAwO1xyXG4gICAgICAgIC8vSW5pY2lhY2nDs24gZGUgdG9kYXMgbGFzIHZhcmlhYmxlc1xyXG4gICAgICAgIGN0cmwuJG9uSW5pdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgZ2V0QWN0dWFsRGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgbm9vbkNoZWNrKCk7XHJcbiAgICAgICAgICAgICAgICBpbnRlcnZhbFRpbWUoaW50ZXJ2YWxNcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9GdW5jaW9uZXMgUHJpdmFkYXNcclxuXHJcbiAgICAgICAgLy9GZWNoYSBhY3R1YWxcclxuICAgICAgICBmdW5jdGlvbiBnZXRBY3R1YWxEYXRlKCkge1xyXG4gICAgICAgICAgICBjdHJsLmRheXNBcnJheSA9IFsnTU9OJywgJ1RVRScsICdXRUQnLCAnVEhVJywgJ0ZSSScsICdTQVQnLCAnU1VOJ107XHJcbiAgICAgICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgY3RybC5ob3VycyA9IGRhdGUuZ2V0SG91cnMoKTtcclxuICAgICAgICAgICAgY3RybC5taW51dGVzID0gZGF0ZS5nZXRNaW51dGVzKCk7XHJcbiAgICAgICAgICAgIGN0cmwuc2Vjb25kcyA9IGRhdGUuZ2V0U2Vjb25kcygpO1xyXG4gICAgICAgICAgICBjdHJsLndlZWtkYXkgPSBkYXRlLmdldERheSgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vTm9vbiBjaGVjayBcclxuICAgICAgICBmdW5jdGlvbiBub29uQ2hlY2soKSB7XHJcbiAgICAgICAgICAgIGN0cmwuZm9ybWF0MTIgPSB0cnVlO1xyXG4gICAgICAgICAgICBjdHJsLmZvcm1hdDEyID8gY3RybC5ub29uSG91cnMgPSAxMiA6IGN0cmwubm9vbkhvdXJzID0gMjQ7XHJcbiAgICAgICAgICAgIGN0cmwuaG91cnMgPj0gY3RybC5ub29uSG91cnMgPyAoY3RybC5pc05vb24gPSB0cnVlLCBjdHJsLmhvdXJzID0gY3RybC5ob3VycyAtIGN0cmwubm9vbkhvdXJzKSA6IGN0cmwuaXNOb29uID0gZmFsc2U7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy9JbnRlcnZhbCAgXHJcbiAgICAgICAgZnVuY3Rpb24gaW50ZXJ2YWxUaW1lKGludGVydmFsTXMpIHtcclxuICAgICAgICAgICAgJGludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGFjdHVhbGl6YXJIb3JhKCk7XHJcbiAgICAgICAgICAgIH0sIGludGVydmFsTXMpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vQWN0dWFsaXphIGxhIGhvcmEgZGVsIFJlbG9qIGNhZGEgdmV6IHF1ZSBzZSBsbGFtYVxyXG4gICAgICAgIGZ1bmN0aW9uIGFjdHVhbGl6YXJIb3JhKCkge1xyXG4gICAgICAgICAgICBpZiAoY3RybC5zZWNvbmRzID49IHNlY051bSkge1xyXG4gICAgICAgICAgICAgICAgY3RybC5zZWNvbmRzID0gMDtcclxuICAgICAgICAgICAgICAgIGN0cmwubWludXRlcysrO1xyXG4gICAgICAgICAgICAgICAgaWYgKGN0cmwubWludXRlcyA+PSBzZWNOdW0pIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGVja0NoYW5nZShjdHJsLm1pbnV0ZXMsIHNlY051bSkgPyAoY3RybC5taW51dGVzID0gMCwgY3RybC5ob3VycysrKSA6ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrQ2hhbmdlV2Vla2RheSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrQ2hhbmdlKGN0cmwuaG91cnMsIGN0cmwubm9vbkhvdXJzKSA/IChjdHJsLmhvdXJzID0gMCwgY3RybC5pc05vb24gPSAhY3RybC5pc05vb24pIDogJyc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY3RybC5zZWNvbmRzKys7XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIC8vQ2FtYmlvIGRlIGTDrWEgZGUgbGEgc2VtYW5hXHJcbiAgICAgICAgZnVuY3Rpb24gY2hlY2tDaGFuZ2VXZWVrZGF5KCkge1xyXG4gICAgICAgICAgICBpZiAoY3RybC5pc05vb24gPT09IHRydWUgJiYgY3RybC5ob3VycyA+PSAxMikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGN0cmwud2Vla2RheSA8IDcpIHtcclxuICAgICAgICAgICAgICAgICAgICBjdHJsLndlZWtkYXkrKztcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3RybC53ZWVrZGF5ID0gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vQ29tcHJvYmFjacOzbiBkZSBjYW1iaW8gKEVqOiBTaSBoYW4gcGFzc2FkbyA2MCBzZWd1bmRvcywgZGV2dWVsdmUgdHJ1ZSBwYXJhIGluY3JlbWVudGFyIGxvcyBtaW51dG9zKVxyXG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrQ2hhbmdlKHZhbHVlLCBtYXhWYWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPj0gbWF4VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXSk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgLmNvbXBvbmVudCgnZm9ybWNvbXBvbmVudCcsIHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9mb3JtLnRlbXBsYXRlLmh0bWwnLFxyXG4gICAgICAgICAgICBiaW5kaW5nczoge1xyXG4gICAgICAgICAgICAgICAgaXNDb3JyZWN0OiAnPCcsXHJcbiAgICAgICAgICAgICAgICBvbkxvZ2luOiAnJidcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3RybCA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICBjdHJsLmxvZ2luID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGN0cmwub25Mb2dpbih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXI6IGN0cmwudXNlcm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhc3N3b3JkOiBjdHJsLnBhc3N3b3JkXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN0cmwuaXNDb3JyZWN0ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHJsLm1lc3NhZ2VFcnJvciA9ICdVc2VybmFtZSBvciBQYXNzd29yZCBpbmNvcnJlY3QnXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3RybC5tZXNzYWdlRXJyb3IgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXIubW9kdWxlKFwiYXBwXCIpLmNvbXBvbmVudCgncGFzc3dvcmRlbGVtZW50Y29tcG9uZW50Jywge1xyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvcGFzc3dvcmRlbGVtZW50LnRlbXBsYXRlLmh0bWwnLFxyXG4gICAgICAgIGJpbmRpbmdzOiB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQ6ICc8JyxcclxuICAgICAgICAgICAgb25EZWxldGU6ICcmJyxcclxuICAgICAgICAgICAgYWRkRWxlbWVudDogJyYnXHJcbiAgICAgICAgfSxcclxuICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGN0cmwgPSB0aGlzO1xyXG4gICAgICAgICAgICBjdHJsLmNyZWF0ZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGN0cmwuYWRkRWxlbWVudCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGN0cmwucmVzZXQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjdHJsLmVsZW1lbnQud2Vic2l0ZSA9IGN0cmwuZWxlbWVudC53ZWJzaXRlQ29weTtcclxuICAgICAgICAgICAgICAgIGN0cmwuZWxlbWVudC5sb2dpbiA9IGN0cmwuZWxlbWVudC5sb2dpbkNvcHk7XHJcbiAgICAgICAgICAgICAgICBjdHJsLmVsZW1lbnQucGFzc3dvcmQgPSBjdHJsLmVsZW1lbnQucGFzc3dvcmRDb3B5O1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBjdHJsLmVkaXQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjdHJsLmVkaXRNb2RlID0gIWN0cmwuZWRpdE1vZGU7XHJcbiAgICAgICAgICAgICAgICBjdHJsLmVsZW1lbnQud2Vic2l0ZUNvcHkgPSBjdHJsLmVsZW1lbnQud2Vic2l0ZTtcclxuICAgICAgICAgICAgICAgIGN0cmwuZWxlbWVudC5sb2dpbkNvcHkgPSBjdHJsLmVsZW1lbnQubG9naW47XHJcbiAgICAgICAgICAgICAgICBjdHJsLmVsZW1lbnQucGFzc3dvcmRDb3B5ID0gY3RybC5lbGVtZW50LnBhc3N3b3JkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGN0cmwuZGVsZXRlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY3RybC5vbkRlbGV0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGN0cmwuc2F2ZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGN0cmwuZWRpdE1vZGUgPSAhY3RybC5lZGl0TW9kZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnKS5jb21wb25lbnQoJ3NlYXJjaGJhcmNvbXBvbmVudCcsIHtcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL3NlYXJjaGJhci50ZW1wbGF0ZS5odG1sJyxcclxuICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHt9XHJcbiAgICB9KTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwJykuY29tcG9uZW50KCd0YWJsZWNvbXBvbmVudCcsIHtcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL3RhYmxlLnRlbXBsYXRlLmh0bWwnLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgY3RybCA9IHRoaXM7XHJcbiAgICAgICAgICAgIGN0cmwuZWxlbWVudHMgPSBbe1xyXG4gICAgICAgICAgICAgICAgd2Vic2l0ZTogJ3d3dy5nbWFpbC5jb20nLFxyXG4gICAgICAgICAgICAgICAgbG9naW46ICdhbmdlbCcsXHJcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogJ2FuZ2VsJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICB3ZWJzaXRlOiAnd3d3LmhvdG1haWwuY29tJyxcclxuICAgICAgICAgICAgICAgIGxvZ2luOiAnYW5nZWwnLFxyXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6ICdhbmdlbCdcclxuICAgICAgICAgICAgfV07XHJcbiAgICAgICAgICAgIGN0cmwuZGVsZXRlRWxlbWVudCA9IChlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaWR4ID0gY3RybC5lbGVtZW50cy5pbmRleE9mKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGlkeCA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3RybC5lbGVtZW50cy5zcGxpY2UoaWR4LCAxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjdHJsLmFkZEVsZW1lbnQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjdHJsLmVsZW1lbnRzLnB1c2goe30pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn0pKCk7Il19

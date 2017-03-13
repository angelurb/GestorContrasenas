(function() {
    'use strict';
    angular.module('app', ['ngRoute'])
})();
(function() {
    'use strict';
    angular.module('app').component('homeComponent', {
        templateUrl: 'views/home.template.html',
        controller: function($location, cookiesService) {
            this.validUsers = [
                { username: "angel", password: "angel" },
                { username: "carlos", password: "carlos" },
                { username: "javi", password: "javi" },
                { username: "alex", password: "alex" },
                { username: "victor", password: "victor" },
                { username: "gabi", password: "gabi" },
                { username: "fran", password: "fran" },
                { username: "andy", password: "andy" }
            ];
            this.login = (username, password) => {
                for (var user of this.validUsers) {
                    if (username === user.username && password === user.password) {
                        cookiesService.setCookie("in", username, 1);
                        $location.path('/passwordspage');
                        break;
                    } else {
                        this.isCorrect = false;
                    }
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
        controller: function($location, cookiesService) {

            this.logout = () => {
                if (cookiesService.getCookie("in") !== "") {
                    cookiesService.setCookie("in", cookiesService.getCookie("in"), -1);
                    $location.path('/');
                }
            }
            this.$onInit = () => {
                if (cookiesService.getCookie("in") === "") {
                    $location.path('/');
                }
                this.username = cookiesService.getCookie("in");
            }
        }
    }).config(function($routeProvider) {
        $routeProvider
            .when('/passwordspage', {
                template: "<passwordspagecomponent></passwordspagecomponent>"
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
                ctrl.intervalTime(intervalMs);
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
        ctrl.intervalTime = (intervalMs) => {
            $interval(() => {
                ctrl.actualizarHora();
            }, intervalMs);
        };

        //Actualiza la hora del Reloj cada vez que se llama
        ctrl.actualizarHora = () => {
            if (ctrl.seconds >= secNum) {
                ctrl.seconds = 0;
                ctrl.minutes++;
                if (ctrl.minutes >= secNum) {
                    ctrl.checkChange(ctrl.minutes, secNum) ? (ctrl.minutes = 0, ctrl.hours++) : '';
                    ctrl.checkChangeWeekday();
                    ctrl.checkChange(ctrl.hours, ctrl.noonHours) ? (ctrl.hours = 0, ctrl.isNoon = !ctrl.isNoon) : '';
                }
            } else {
                ctrl.seconds++;
            }
        };


        //Cambio de día de la semana
        ctrl.checkChangeWeekday = () => {
            if (ctrl.isNoon === true && ctrl.hours >= 12) {
                if (ctrl.weekday < 7) {
                    ctrl.weekday++;
                } else {
                    ctrl.weekday = 1;
                }
            }
        };

        //Comprobación de cambio (Ej: Si han passado 60 segundos, devuelve true para incrementar los minutos)
        ctrl.checkChange = (value, maxValue) => {
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
    angular.module('app').service('cookiesService', function() {
        return {
            setCookie: function(cname, cvalue, exdays) {
                var d = new Date();
                d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                var expires = "expires=" + d.toUTCString();
                document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
            },
            getCookie: function(cname) {
                let name = cname + "=";
                let decodedCookie = decodeURIComponent(document.cookie);
                let ca = decodedCookie.split(';');
                for (let i = 0; i < ca.length; i++) {
                    let c = ca[i];
                    while (c.charAt(0) == ' ') {
                        c = c.substring(1);
                    }
                    if (c.indexOf(name) == 0) {
                        return c.substring(name.length, c.length);
                    }
                }
                return "";
            }
        }
    });
})();
(function() {
    'use strict';
    angular.module('app').service('LS', function() {
        return {
            setData: function(val, idx, user) {
                val.id = idx;
                localStorage.setItem(idx + user + 'element', angular.toJson(val));
                //return this to concatenate str.setData().saddsa()....
                return this;
            },
            getData: function(user) {
                let all = [],
                    keys = Object.keys(localStorage),
                    i = 0,
                    key;
                for (; key = keys[i]; i++) {
                    if (key.includes(user + 'element')) {
                        all.push(JSON.parse(localStorage.getItem(key)));
                    }
                }
                return all;
            },
            deleteElement: function(idx, user) {
                localStorage.removeItem(idx + user + 'element');
            }
        }
    });
})();
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
                if (ctrl.element === undefined || ctrl.element === '' ||
                    ctrl.element.website === undefined || ctrl.element.website === '' ||
                    ctrl.element.login === undefined || ctrl.element.login === '' ||
                    ctrl.element.password === undefined || ctrl.element.password === '') {
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
(function() {
    'use strict';
    angular.module('app').component('tablecomponent', {
        templateUrl: 'views/table.template.html',
        controller: function(LS, cookiesService) {
            this.user = cookiesService.getCookie("in");
            this.elements = (LS.getData(this.user).length !== 0) ? LS.getData(this.user) : '';
            this.guardar = (elemento) => {
                if (this.editMode) {
                    LS.setData(elemento, this.index, this.user);
                    this.editMode = false;
                } else if (this.newRegister) {
                    LS.setData(elemento, this.elements !== '' ? Number(this.elements[this.elements.length - 1].id) + 1 : 1, this.user);
                    this.newRegister = false;
                }
                this.elements = LS.getData(this.user);

            };
            this.deleteElement = (element) => {
                LS.deleteElement(element.id, this.user);
                this.elements = (LS.getData(this.user).length !== 0) ? LS.getData(this.user) : '';
            }
            this.addElement = () => {
                this.newRegister = true;
                this.elementToEditF = undefined;
            }
            this.edit = (element) => {
                this.index = element.id;
                this.elementToEditF = element;
                this.editMode = !this.editMode;
            }
            this.cerrar = () => {
                this.editMode = false;
                this.newRegister = false;
            };

            this.orderFilter = (isActive) => {
                this.isActive = isActive;
                switch (isActive) {
                    case 1:
                        this.order = this.website;
                        this.reverse = false;
                        break;
                    case 2:
                        this.order = this.website;
                        this.reverse = true;
                        break;
                    case 3:
                        this.order = this.login;
                        this.reverse = false;
                        break;
                    case 4:
                        this.order = this.login;
                        this.reverse = true;
                        break;
                }
            }
        }
    })
})();

//VISUAL TOOLTIP
$(document).on('mouseenter', ".iftooltip", function() {
    var $this = $(this);
    if ($this.attr('pass')) {
        $this.tooltip({
            title: $this.attr('pass'),
            placement: "left"
        });
        $this.tooltip('show');
    }
    if (this.offsetWidth < this.scrollWidth) {
        $this.tooltip({
            title: $this.attr('x'),
            placement: "bottom"
        });
        if ('pass') {
            $this.tooltip('show');
        }
    }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUuanMiLCJob21lL2hvbWUuY29tcG9uZW50LmpzIiwicGFzc3dvcmRzcGFnZS9wYXNzd29yZHNwYWdlLmNvbXBvbmVudC5qcyIsImNvbW1vbi9yZWxvai9yZWxvai5jb21wb25lbnQuanMiLCJjb21tb24vcmVsb2ovcmVsb2ouY29udHJvbGxlci5qcyIsImNvbW1vbi9zZXJ2aWNlcy9jb29raWVzU2VydmljZS5qcyIsImNvbW1vbi9zZXJ2aWNlcy9sb2NhbFN0b3JhZ2VTZXJ2aWNlLmpzIiwiaG9tZS9jb21wb25lbnRzL2Zvcm0uY29tcG9uZW50LmpzIiwicGFzc3dvcmRzcGFnZS9jb21wb25lbnRzL3Bhc3N3b3JkRWxlbWVudC9wYXNzd29yZGVsZW1lbnQuY29tcG9uZW50LmpzIiwicGFzc3dvcmRzcGFnZS9jb21wb25lbnRzL3RhYmxlL3RhYmxlLmNvbXBvbmVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwJywgWyduZ1JvdXRlJ10pXHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpLmNvbXBvbmVudCgnaG9tZUNvbXBvbmVudCcsIHtcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2hvbWUudGVtcGxhdGUuaHRtbCcsXHJcbiAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24oJGxvY2F0aW9uLCBjb29raWVzU2VydmljZSkge1xyXG4gICAgICAgICAgICB0aGlzLnZhbGlkVXNlcnMgPSBbXHJcbiAgICAgICAgICAgICAgICB7IHVzZXJuYW1lOiBcImFuZ2VsXCIsIHBhc3N3b3JkOiBcImFuZ2VsXCIgfSxcclxuICAgICAgICAgICAgICAgIHsgdXNlcm5hbWU6IFwiY2FybG9zXCIsIHBhc3N3b3JkOiBcImNhcmxvc1wiIH0sXHJcbiAgICAgICAgICAgICAgICB7IHVzZXJuYW1lOiBcImphdmlcIiwgcGFzc3dvcmQ6IFwiamF2aVwiIH0sXHJcbiAgICAgICAgICAgICAgICB7IHVzZXJuYW1lOiBcImFsZXhcIiwgcGFzc3dvcmQ6IFwiYWxleFwiIH0sXHJcbiAgICAgICAgICAgICAgICB7IHVzZXJuYW1lOiBcInZpY3RvclwiLCBwYXNzd29yZDogXCJ2aWN0b3JcIiB9LFxyXG4gICAgICAgICAgICAgICAgeyB1c2VybmFtZTogXCJnYWJpXCIsIHBhc3N3b3JkOiBcImdhYmlcIiB9LFxyXG4gICAgICAgICAgICAgICAgeyB1c2VybmFtZTogXCJmcmFuXCIsIHBhc3N3b3JkOiBcImZyYW5cIiB9LFxyXG4gICAgICAgICAgICAgICAgeyB1c2VybmFtZTogXCJhbmR5XCIsIHBhc3N3b3JkOiBcImFuZHlcIiB9XHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgIHRoaXMubG9naW4gPSAodXNlcm5hbWUsIHBhc3N3b3JkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB1c2VyIG9mIHRoaXMudmFsaWRVc2Vycykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh1c2VybmFtZSA9PT0gdXNlci51c2VybmFtZSAmJiBwYXNzd29yZCA9PT0gdXNlci5wYXNzd29yZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb29raWVzU2VydmljZS5zZXRDb29raWUoXCJpblwiLCB1c2VybmFtZSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGFzc3dvcmRzcGFnZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQ29ycmVjdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KS5jb25maWcoZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIpIHtcclxuICAgICAgICAkcm91dGVQcm92aWRlclxyXG4gICAgICAgICAgICAud2hlbignLycsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPGhvbWUtY29tcG9uZW50PjwvaG9tZS1jb21wb25lbnQ+J1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwJykuY29tcG9uZW50KCdwYXNzd29yZHNwYWdlY29tcG9uZW50Jywge1xyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvcGFzc3dvcmRzcGFnZS50ZW1wbGF0ZS5odG1sJyxcclxuICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkbG9jYXRpb24sIGNvb2tpZXNTZXJ2aWNlKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmxvZ291dCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChjb29raWVzU2VydmljZS5nZXRDb29raWUoXCJpblwiKSAhPT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvb2tpZXNTZXJ2aWNlLnNldENvb2tpZShcImluXCIsIGNvb2tpZXNTZXJ2aWNlLmdldENvb2tpZShcImluXCIpLCAtMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLiRvbkluaXQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY29va2llc1NlcnZpY2UuZ2V0Q29va2llKFwiaW5cIikgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy51c2VybmFtZSA9IGNvb2tpZXNTZXJ2aWNlLmdldENvb2tpZShcImluXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSkuY29uZmlnKGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyKSB7XHJcbiAgICAgICAgJHJvdXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLndoZW4oJy9wYXNzd29yZHNwYWdlJywge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6IFwiPHBhc3N3b3Jkc3BhZ2Vjb21wb25lbnQ+PC9wYXNzd29yZHNwYWdlY29tcG9uZW50PlwiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pKCk7IiwiIChmdW5jdGlvbigpIHtcclxuICAgICAndXNlIHN0cmljdCc7XHJcbiAgICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgIC5jb21wb25lbnQoJ3JlbG9qY29tcG9uZW50Jywge1xyXG4gICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9yZWxvai50ZW1wbGF0ZS5odG1sJyxcclxuICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZWxvakNvbnRyb2xsZXInLFxyXG4gICAgICAgICB9KTtcclxuIH0pKCk7IiwiYW5ndWxhci5tb2R1bGUoXCJhcHBcIikuY29udHJvbGxlcihcIlJlbG9qQ29udHJvbGxlclwiLCBbXHJcbiAgICAnJGludGVydmFsJyxcclxuICAgIGZ1bmN0aW9uKCRpbnRlcnZhbCkge1xyXG4gICAgICAgIHZhciBjdHJsID0gdGhpcztcclxuICAgICAgICBzZWNOdW0gPSA1OTtcclxuICAgICAgICBpbnRlcnZhbE1zID0gMTAwMDtcclxuICAgICAgICAvL0luaWNpYWNpw7NuIGRlIHRvZGFzIGxhcyB2YXJpYWJsZXNcclxuICAgICAgICBjdHJsLiRvbkluaXQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGdldEFjdHVhbERhdGUoKTtcclxuICAgICAgICAgICAgICAgIG5vb25DaGVjaygpO1xyXG4gICAgICAgICAgICAgICAgY3RybC5pbnRlcnZhbFRpbWUoaW50ZXJ2YWxNcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9GdW5jaW9uZXMgUHJpdmFkYXNcclxuXHJcbiAgICAgICAgLy9GZWNoYSBhY3R1YWxcclxuICAgICAgICBmdW5jdGlvbiBnZXRBY3R1YWxEYXRlKCkge1xyXG4gICAgICAgICAgICBjdHJsLmRheXNBcnJheSA9IFsnTU9OJywgJ1RVRScsICdXRUQnLCAnVEhVJywgJ0ZSSScsICdTQVQnLCAnU1VOJ107XHJcbiAgICAgICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgY3RybC5ob3VycyA9IGRhdGUuZ2V0SG91cnMoKTtcclxuICAgICAgICAgICAgY3RybC5taW51dGVzID0gZGF0ZS5nZXRNaW51dGVzKCk7XHJcbiAgICAgICAgICAgIGN0cmwuc2Vjb25kcyA9IGRhdGUuZ2V0U2Vjb25kcygpO1xyXG4gICAgICAgICAgICBjdHJsLndlZWtkYXkgPSBkYXRlLmdldERheSgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vTm9vbiBjaGVjayBcclxuICAgICAgICBmdW5jdGlvbiBub29uQ2hlY2soKSB7XHJcbiAgICAgICAgICAgIGN0cmwuZm9ybWF0MTIgPSB0cnVlO1xyXG4gICAgICAgICAgICBjdHJsLmZvcm1hdDEyID8gY3RybC5ub29uSG91cnMgPSAxMiA6IGN0cmwubm9vbkhvdXJzID0gMjQ7XHJcbiAgICAgICAgICAgIGN0cmwuaG91cnMgPj0gY3RybC5ub29uSG91cnMgPyAoY3RybC5pc05vb24gPSB0cnVlLCBjdHJsLmhvdXJzID0gY3RybC5ob3VycyAtIGN0cmwubm9vbkhvdXJzKSA6IGN0cmwuaXNOb29uID0gZmFsc2U7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy9JbnRlcnZhbCAgXHJcbiAgICAgICAgY3RybC5pbnRlcnZhbFRpbWUgPSAoaW50ZXJ2YWxNcykgPT4ge1xyXG4gICAgICAgICAgICAkaW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY3RybC5hY3R1YWxpemFySG9yYSgpO1xyXG4gICAgICAgICAgICB9LCBpbnRlcnZhbE1zKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvL0FjdHVhbGl6YSBsYSBob3JhIGRlbCBSZWxvaiBjYWRhIHZleiBxdWUgc2UgbGxhbWFcclxuICAgICAgICBjdHJsLmFjdHVhbGl6YXJIb3JhID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoY3RybC5zZWNvbmRzID49IHNlY051bSkge1xyXG4gICAgICAgICAgICAgICAgY3RybC5zZWNvbmRzID0gMDtcclxuICAgICAgICAgICAgICAgIGN0cmwubWludXRlcysrO1xyXG4gICAgICAgICAgICAgICAgaWYgKGN0cmwubWludXRlcyA+PSBzZWNOdW0pIHtcclxuICAgICAgICAgICAgICAgICAgICBjdHJsLmNoZWNrQ2hhbmdlKGN0cmwubWludXRlcywgc2VjTnVtKSA/IChjdHJsLm1pbnV0ZXMgPSAwLCBjdHJsLmhvdXJzKyspIDogJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgY3RybC5jaGVja0NoYW5nZVdlZWtkYXkoKTtcclxuICAgICAgICAgICAgICAgICAgICBjdHJsLmNoZWNrQ2hhbmdlKGN0cmwuaG91cnMsIGN0cmwubm9vbkhvdXJzKSA/IChjdHJsLmhvdXJzID0gMCwgY3RybC5pc05vb24gPSAhY3RybC5pc05vb24pIDogJyc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjdHJsLnNlY29uZHMrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICAvL0NhbWJpbyBkZSBkw61hIGRlIGxhIHNlbWFuYVxyXG4gICAgICAgIGN0cmwuY2hlY2tDaGFuZ2VXZWVrZGF5ID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoY3RybC5pc05vb24gPT09IHRydWUgJiYgY3RybC5ob3VycyA+PSAxMikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGN0cmwud2Vla2RheSA8IDcpIHtcclxuICAgICAgICAgICAgICAgICAgICBjdHJsLndlZWtkYXkrKztcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3RybC53ZWVrZGF5ID0gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vQ29tcHJvYmFjacOzbiBkZSBjYW1iaW8gKEVqOiBTaSBoYW4gcGFzc2FkbyA2MCBzZWd1bmRvcywgZGV2dWVsdmUgdHJ1ZSBwYXJhIGluY3JlbWVudGFyIGxvcyBtaW51dG9zKVxyXG4gICAgICAgIGN0cmwuY2hlY2tDaGFuZ2UgPSAodmFsdWUsIG1heFZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA+PSBtYXhWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5dKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwJykuc2VydmljZSgnY29va2llc1NlcnZpY2UnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzZXRDb29raWU6IGZ1bmN0aW9uKGNuYW1lLCBjdmFsdWUsIGV4ZGF5cykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGQgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgZC5zZXRUaW1lKGQuZ2V0VGltZSgpICsgKGV4ZGF5cyAqIDI0ICogNjAgKiA2MCAqIDEwMDApKTtcclxuICAgICAgICAgICAgICAgIHZhciBleHBpcmVzID0gXCJleHBpcmVzPVwiICsgZC50b1VUQ1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuY29va2llID0gY25hbWUgKyBcIj1cIiArIGN2YWx1ZSArIFwiO1wiICsgZXhwaXJlcyArIFwiO3BhdGg9L1wiO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnZXRDb29raWU6IGZ1bmN0aW9uKGNuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IGNuYW1lICsgXCI9XCI7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGVjb2RlZENvb2tpZSA9IGRlY29kZVVSSUNvbXBvbmVudChkb2N1bWVudC5jb29raWUpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNhID0gZGVjb2RlZENvb2tpZS5zcGxpdCgnOycpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjYS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjID0gY2FbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGMuY2hhckF0KDApID09ICcgJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjID0gYy5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjLmluZGV4T2YobmFtZSkgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYy5zdWJzdHJpbmcobmFtZS5sZW5ndGgsIGMubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnKS5zZXJ2aWNlKCdMUycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHNldERhdGE6IGZ1bmN0aW9uKHZhbCwgaWR4LCB1c2VyKSB7XHJcbiAgICAgICAgICAgICAgICB2YWwuaWQgPSBpZHg7XHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShpZHggKyB1c2VyICsgJ2VsZW1lbnQnLCBhbmd1bGFyLnRvSnNvbih2YWwpKTtcclxuICAgICAgICAgICAgICAgIC8vcmV0dXJuIHRoaXMgdG8gY29uY2F0ZW5hdGUgc3RyLnNldERhdGEoKS5zYWRkc2EoKS4uLi5cclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnZXREYXRhOiBmdW5jdGlvbih1c2VyKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYWxsID0gW10sXHJcbiAgICAgICAgICAgICAgICAgICAga2V5cyA9IE9iamVjdC5rZXlzKGxvY2FsU3RvcmFnZSksXHJcbiAgICAgICAgICAgICAgICAgICAgaSA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAga2V5O1xyXG4gICAgICAgICAgICAgICAgZm9yICg7IGtleSA9IGtleXNbaV07IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXkuaW5jbHVkZXModXNlciArICdlbGVtZW50JykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWxsLnB1c2goSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFsbDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGVsZXRlRWxlbWVudDogZnVuY3Rpb24oaWR4LCB1c2VyKSB7XHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShpZHggKyB1c2VyICsgJ2VsZW1lbnQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgIC5jb21wb25lbnQoJ2Zvcm1jb21wb25lbnQnLCB7XHJcbiAgICAgICAgICAgIGJpbmRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICBpc0NvcnJlY3Q6ICc8JyxcclxuICAgICAgICAgICAgICAgIG9uTG9naW46ICcmJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2Zvcm0udGVtcGxhdGUuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kb25DaGFuZ2VzID0gKGNoYW5nZXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2hhbmdlcy5pc0NvcnJlY3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb3JyZWN0ID0gYW5ndWxhci5jb3B5KGNoYW5nZXMuaXNDb3JyZWN0LmN1cnJlbnRWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dFcnJvcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2luID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25Mb2dpbih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXI6IHRoaXMudXNlcm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhc3N3b3JkOiB0aGlzLnBhc3N3b3JkXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgLy8gUHJpdmF0ZSBmdW5jdGlvbnM6XHJcbiAgICAgICAgICAgICAgICB2YXIgY3RybCA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gc2hvd0Vycm9yKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdHJsLmNvcnJlY3QgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0cmwubWVzc2FnZUVycm9yID0gJ1VzZXJuYW1lIG9yIFBhc3N3b3JkIGluY29ycmVjdCc7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3RybC5tZXNzYWdlRXJyb3IgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyLm1vZHVsZShcImFwcFwiKS5jb21wb25lbnQoJ3Bhc3N3b3JkZWxlbWVudGNvbXBvbmVudCcsIHtcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL3Bhc3N3b3JkZWxlbWVudC50ZW1wbGF0ZS5odG1sJyxcclxuICAgICAgICBiaW5kaW5nczoge1xyXG4gICAgICAgICAgICBzYXZlOiAnJicsXHJcbiAgICAgICAgICAgIGNsb3NlOiAnJicsXHJcbiAgICAgICAgICAgIGVsZW1lbnRUb0VkaXQ6IFwiPFwiXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBjdHJsID0gdGhpcztcclxuICAgICAgICAgICAgY3RybC5lbGVtZW50ID0gY3RybC5lbGVtZW50VG9FZGl0O1xyXG4gICAgICAgICAgICBjdHJsLnJlc2V0ID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBjdHJsLmVsZW1lbnQud2Vic2l0ZSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIGN0cmwuZWxlbWVudC5sb2dpbiA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIGN0cmwuZWxlbWVudC5wYXNzd29yZCA9ICcnO1xyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHt9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGN0cmwuZ3VhcmRhciA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChjdHJsLmVsZW1lbnQgPT09IHVuZGVmaW5lZCB8fCBjdHJsLmVsZW1lbnQgPT09ICcnIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgY3RybC5lbGVtZW50LndlYnNpdGUgPT09IHVuZGVmaW5lZCB8fCBjdHJsLmVsZW1lbnQud2Vic2l0ZSA9PT0gJycgfHxcclxuICAgICAgICAgICAgICAgICAgICBjdHJsLmVsZW1lbnQubG9naW4gPT09IHVuZGVmaW5lZCB8fCBjdHJsLmVsZW1lbnQubG9naW4gPT09ICcnIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgY3RybC5lbGVtZW50LnBhc3N3b3JkID09PSB1bmRlZmluZWQgfHwgY3RybC5lbGVtZW50LnBhc3N3b3JkID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGN0cmwuY2FtcG9zVmFjaW9zID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3RybC5zYXZlKHsgZWxlbWVudG86IGN0cmwuZWxlbWVudCB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjdHJsLmNlcnJhciA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGN0cmwuY2xvc2UoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwJykuY29tcG9uZW50KCd0YWJsZWNvbXBvbmVudCcsIHtcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL3RhYmxlLnRlbXBsYXRlLmh0bWwnLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKExTLCBjb29raWVzU2VydmljZSkge1xyXG4gICAgICAgICAgICB0aGlzLnVzZXIgPSBjb29raWVzU2VydmljZS5nZXRDb29raWUoXCJpblwiKTtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50cyA9IChMUy5nZXREYXRhKHRoaXMudXNlcikubGVuZ3RoICE9PSAwKSA/IExTLmdldERhdGEodGhpcy51c2VyKSA6ICcnO1xyXG4gICAgICAgICAgICB0aGlzLmd1YXJkYXIgPSAoZWxlbWVudG8pID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmVkaXRNb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgTFMuc2V0RGF0YShlbGVtZW50bywgdGhpcy5pbmRleCwgdGhpcy51c2VyKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVkaXRNb2RlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMubmV3UmVnaXN0ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBMUy5zZXREYXRhKGVsZW1lbnRvLCB0aGlzLmVsZW1lbnRzICE9PSAnJyA/IE51bWJlcih0aGlzLmVsZW1lbnRzW3RoaXMuZWxlbWVudHMubGVuZ3RoIC0gMV0uaWQpICsgMSA6IDEsIHRoaXMudXNlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXdSZWdpc3RlciA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50cyA9IExTLmdldERhdGEodGhpcy51c2VyKTtcclxuXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlRWxlbWVudCA9IChlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBMUy5kZWxldGVFbGVtZW50KGVsZW1lbnQuaWQsIHRoaXMudXNlcik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnRzID0gKExTLmdldERhdGEodGhpcy51c2VyKS5sZW5ndGggIT09IDApID8gTFMuZ2V0RGF0YSh0aGlzLnVzZXIpIDogJyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5hZGRFbGVtZW50ID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXdSZWdpc3RlciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnRUb0VkaXRGID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZWRpdCA9IChlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmluZGV4ID0gZWxlbWVudC5pZDtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudFRvRWRpdEYgPSBlbGVtZW50O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lZGl0TW9kZSA9ICF0aGlzLmVkaXRNb2RlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY2VycmFyID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lZGl0TW9kZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXdSZWdpc3RlciA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5vcmRlckZpbHRlciA9IChpc0FjdGl2ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pc0FjdGl2ZSA9IGlzQWN0aXZlO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChpc0FjdGl2ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vcmRlciA9IHRoaXMud2Vic2l0ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXZlcnNlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vcmRlciA9IHRoaXMud2Vic2l0ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXZlcnNlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9yZGVyID0gdGhpcy5sb2dpbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXZlcnNlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vcmRlciA9IHRoaXMubG9naW47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmV2ZXJzZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufSkoKTtcclxuXHJcbi8vVklTVUFMIFRPT0xUSVBcclxuJChkb2N1bWVudCkub24oJ21vdXNlZW50ZXInLCBcIi5pZnRvb2x0aXBcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG4gICAgaWYgKCR0aGlzLmF0dHIoJ3Bhc3MnKSkge1xyXG4gICAgICAgICR0aGlzLnRvb2x0aXAoe1xyXG4gICAgICAgICAgICB0aXRsZTogJHRoaXMuYXR0cigncGFzcycpLFxyXG4gICAgICAgICAgICBwbGFjZW1lbnQ6IFwibGVmdFwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJHRoaXMudG9vbHRpcCgnc2hvdycpO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMub2Zmc2V0V2lkdGggPCB0aGlzLnNjcm9sbFdpZHRoKSB7XHJcbiAgICAgICAgJHRoaXMudG9vbHRpcCh7XHJcbiAgICAgICAgICAgIHRpdGxlOiAkdGhpcy5hdHRyKCd4JyksXHJcbiAgICAgICAgICAgIHBsYWNlbWVudDogXCJib3R0b21cIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmICgncGFzcycpIHtcclxuICAgICAgICAgICAgJHRoaXMudG9vbHRpcCgnc2hvdycpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7Il19

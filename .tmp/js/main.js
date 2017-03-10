(function() {
    'use strict';
    angular.module('app', ['ngRoute'])
        .service('cookiesService', function() {
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
        })
        .service('LS', function() {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUuanMiLCJob21lL2hvbWUuY29tcG9uZW50LmpzIiwicGFzc3dvcmRzcGFnZS9wYXNzd29yZHNwYWdlLmNvbXBvbmVudC5qcyIsImNvbW1vbi9yZWxvai9yZWxvai5jb21wb25lbnQuanMiLCJjb21tb24vcmVsb2ovcmVsb2ouY29udHJvbGxlci5qcyIsImhvbWUvY29tcG9uZW50cy9mb3JtLmNvbXBvbmVudC5qcyIsInBhc3N3b3Jkc3BhZ2UvY29tcG9uZW50cy9wYXNzd29yZEVsZW1lbnQvcGFzc3dvcmRlbGVtZW50LmNvbXBvbmVudC5qcyIsInBhc3N3b3Jkc3BhZ2UvY29tcG9uZW50cy90YWJsZS90YWJsZS5jb21wb25lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFsnbmdSb3V0ZSddKVxyXG4gICAgICAgIC5zZXJ2aWNlKCdjb29raWVzU2VydmljZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgc2V0Q29va2llOiBmdW5jdGlvbihjbmFtZSwgY3ZhbHVlLCBleGRheXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZCA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZC5zZXRUaW1lKGQuZ2V0VGltZSgpICsgKGV4ZGF5cyAqIDI0ICogNjAgKiA2MCAqIDEwMDApKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZXhwaXJlcyA9IFwiZXhwaXJlcz1cIiArIGQudG9VVENTdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5jb29raWUgPSBjbmFtZSArIFwiPVwiICsgY3ZhbHVlICsgXCI7XCIgKyBleHBpcmVzICsgXCI7cGF0aD0vXCI7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZ2V0Q29va2llOiBmdW5jdGlvbihjbmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBuYW1lID0gY25hbWUgKyBcIj1cIjtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZGVjb2RlZENvb2tpZSA9IGRlY29kZVVSSUNvbXBvbmVudChkb2N1bWVudC5jb29raWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjYSA9IGRlY29kZWRDb29raWUuc3BsaXQoJzsnKTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjID0gY2FbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChjLmNoYXJBdCgwKSA9PSAnICcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMgPSBjLnN1YnN0cmluZygxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYy5pbmRleE9mKG5hbWUpID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjLnN1YnN0cmluZyhuYW1lLmxlbmd0aCwgYy5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuc2VydmljZSgnTFMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHNldERhdGE6IGZ1bmN0aW9uKHZhbCwgaWR4LCB1c2VyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsLmlkID0gaWR4O1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGlkeCArIHVzZXIgKyAnZWxlbWVudCcsIGFuZ3VsYXIudG9Kc29uKHZhbCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vcmV0dXJuIHRoaXMgdG8gY29uY2F0ZW5hdGUgc3RyLnNldERhdGEoKS5zYWRkc2EoKS4uLi5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBnZXREYXRhOiBmdW5jdGlvbih1c2VyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGFsbCA9IFtdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXlzID0gT2JqZWN0LmtleXMobG9jYWxTdG9yYWdlKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaSA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKDsga2V5ID0ga2V5c1tpXTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrZXkuaW5jbHVkZXModXNlciArICdlbGVtZW50JykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbC5wdXNoKEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhbGw7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZGVsZXRlRWxlbWVudDogZnVuY3Rpb24oaWR4LCB1c2VyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oaWR4ICsgdXNlciArICdlbGVtZW50Jyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwJykuY29tcG9uZW50KCdob21lQ29tcG9uZW50Jywge1xyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvaG9tZS50ZW1wbGF0ZS5odG1sJyxcclxuICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkbG9jYXRpb24sIGNvb2tpZXNTZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmFsaWRVc2VycyA9IFtcclxuICAgICAgICAgICAgICAgIHsgdXNlcm5hbWU6IFwiYW5nZWxcIiwgcGFzc3dvcmQ6IFwiYW5nZWxcIiB9LFxyXG4gICAgICAgICAgICAgICAgeyB1c2VybmFtZTogXCJjYXJsb3NcIiwgcGFzc3dvcmQ6IFwiY2FybG9zXCIgfSxcclxuICAgICAgICAgICAgICAgIHsgdXNlcm5hbWU6IFwiamF2aVwiLCBwYXNzd29yZDogXCJqYXZpXCIgfSxcclxuICAgICAgICAgICAgICAgIHsgdXNlcm5hbWU6IFwiYWxleFwiLCBwYXNzd29yZDogXCJhbGV4XCIgfSxcclxuICAgICAgICAgICAgICAgIHsgdXNlcm5hbWU6IFwidmljdG9yXCIsIHBhc3N3b3JkOiBcInZpY3RvclwiIH0sXHJcbiAgICAgICAgICAgICAgICB7IHVzZXJuYW1lOiBcImdhYmlcIiwgcGFzc3dvcmQ6IFwiZ2FiaVwiIH0sXHJcbiAgICAgICAgICAgICAgICB7IHVzZXJuYW1lOiBcImZyYW5cIiwgcGFzc3dvcmQ6IFwiZnJhblwiIH0sXHJcbiAgICAgICAgICAgICAgICB7IHVzZXJuYW1lOiBcImFuZHlcIiwgcGFzc3dvcmQ6IFwiYW5keVwiIH1cclxuICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgdGhpcy5sb2dpbiA9ICh1c2VybmFtZSwgcGFzc3dvcmQpID0+IHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHVzZXIgb2YgdGhpcy52YWxpZFVzZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVzZXJuYW1lID09PSB1c2VyLnVzZXJuYW1lICYmIHBhc3N3b3JkID09PSB1c2VyLnBhc3N3b3JkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvb2tpZXNTZXJ2aWNlLnNldENvb2tpZShcImluXCIsIHVzZXJuYW1lLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wYXNzd29yZHNwYWdlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0NvcnJlY3QgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSkuY29uZmlnKGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyKSB7XHJcbiAgICAgICAgJHJvdXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLndoZW4oJy8nLCB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxob21lLWNvbXBvbmVudD48L2hvbWUtY29tcG9uZW50PidcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpLmNvbXBvbmVudCgncGFzc3dvcmRzcGFnZWNvbXBvbmVudCcsIHtcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL3Bhc3N3b3Jkc3BhZ2UudGVtcGxhdGUuaHRtbCcsXHJcbiAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24oJGxvY2F0aW9uLCBjb29raWVzU2VydmljZSkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5sb2dvdXQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY29va2llc1NlcnZpY2UuZ2V0Q29va2llKFwiaW5cIikgIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb29raWVzU2VydmljZS5zZXRDb29raWUoXCJpblwiLCBjb29raWVzU2VydmljZS5nZXRDb29raWUoXCJpblwiKSwgLTEpO1xyXG4gICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy4kb25Jbml0ID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvb2tpZXNTZXJ2aWNlLmdldENvb2tpZShcImluXCIpID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMudXNlcm5hbWUgPSBjb29raWVzU2VydmljZS5nZXRDb29raWUoXCJpblwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pLmNvbmZpZyhmdW5jdGlvbigkcm91dGVQcm92aWRlcikge1xyXG4gICAgICAgICRyb3V0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC53aGVuKCcvcGFzc3dvcmRzcGFnZScsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiBcIjxwYXNzd29yZHNwYWdlY29tcG9uZW50PjwvcGFzc3dvcmRzcGFnZWNvbXBvbmVudD5cIlxyXG4gICAgICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KSgpOyIsIiAoZnVuY3Rpb24oKSB7XHJcbiAgICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgICAuY29tcG9uZW50KCdyZWxvamNvbXBvbmVudCcsIHtcclxuICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvcmVsb2oudGVtcGxhdGUuaHRtbCcsXHJcbiAgICAgICAgICAgICBjb250cm9sbGVyOiAnUmVsb2pDb250cm9sbGVyJyxcclxuICAgICAgICAgfSk7XHJcbiB9KSgpOyIsImFuZ3VsYXIubW9kdWxlKFwiYXBwXCIpLmNvbnRyb2xsZXIoXCJSZWxvakNvbnRyb2xsZXJcIiwgW1xyXG4gICAgJyRpbnRlcnZhbCcsXHJcbiAgICBmdW5jdGlvbigkaW50ZXJ2YWwpIHtcclxuICAgICAgICB2YXIgY3RybCA9IHRoaXM7XHJcbiAgICAgICAgc2VjTnVtID0gNTk7XHJcbiAgICAgICAgaW50ZXJ2YWxNcyA9IDEwMDA7XHJcbiAgICAgICAgLy9JbmljaWFjacOzbiBkZSB0b2RhcyBsYXMgdmFyaWFibGVzXHJcbiAgICAgICAgY3RybC4kb25Jbml0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBnZXRBY3R1YWxEYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBub29uQ2hlY2soKTtcclxuICAgICAgICAgICAgICAgIGN0cmwuaW50ZXJ2YWxUaW1lKGludGVydmFsTXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vRnVuY2lvbmVzIFByaXZhZGFzXHJcblxyXG4gICAgICAgIC8vRmVjaGEgYWN0dWFsXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0QWN0dWFsRGF0ZSgpIHtcclxuICAgICAgICAgICAgY3RybC5kYXlzQXJyYXkgPSBbJ01PTicsICdUVUUnLCAnV0VEJywgJ1RIVScsICdGUkknLCAnU0FUJywgJ1NVTiddO1xyXG4gICAgICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIGN0cmwuaG91cnMgPSBkYXRlLmdldEhvdXJzKCk7XHJcbiAgICAgICAgICAgIGN0cmwubWludXRlcyA9IGRhdGUuZ2V0TWludXRlcygpO1xyXG4gICAgICAgICAgICBjdHJsLnNlY29uZHMgPSBkYXRlLmdldFNlY29uZHMoKTtcclxuICAgICAgICAgICAgY3RybC53ZWVrZGF5ID0gZGF0ZS5nZXREYXkoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvL05vb24gY2hlY2sgXHJcbiAgICAgICAgZnVuY3Rpb24gbm9vbkNoZWNrKCkge1xyXG4gICAgICAgICAgICBjdHJsLmZvcm1hdDEyID0gdHJ1ZTtcclxuICAgICAgICAgICAgY3RybC5mb3JtYXQxMiA/IGN0cmwubm9vbkhvdXJzID0gMTIgOiBjdHJsLm5vb25Ib3VycyA9IDI0O1xyXG4gICAgICAgICAgICBjdHJsLmhvdXJzID49IGN0cmwubm9vbkhvdXJzID8gKGN0cmwuaXNOb29uID0gdHJ1ZSwgY3RybC5ob3VycyA9IGN0cmwuaG91cnMgLSBjdHJsLm5vb25Ib3VycykgOiBjdHJsLmlzTm9vbiA9IGZhbHNlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vSW50ZXJ2YWwgIFxyXG4gICAgICAgIGN0cmwuaW50ZXJ2YWxUaW1lID0gKGludGVydmFsTXMpID0+IHtcclxuICAgICAgICAgICAgJGludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGN0cmwuYWN0dWFsaXphckhvcmEoKTtcclxuICAgICAgICAgICAgfSwgaW50ZXJ2YWxNcyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy9BY3R1YWxpemEgbGEgaG9yYSBkZWwgUmVsb2ogY2FkYSB2ZXogcXVlIHNlIGxsYW1hXHJcbiAgICAgICAgY3RybC5hY3R1YWxpemFySG9yYSA9ICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKGN0cmwuc2Vjb25kcyA+PSBzZWNOdW0pIHtcclxuICAgICAgICAgICAgICAgIGN0cmwuc2Vjb25kcyA9IDA7XHJcbiAgICAgICAgICAgICAgICBjdHJsLm1pbnV0ZXMrKztcclxuICAgICAgICAgICAgICAgIGlmIChjdHJsLm1pbnV0ZXMgPj0gc2VjTnVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3RybC5jaGVja0NoYW5nZShjdHJsLm1pbnV0ZXMsIHNlY051bSkgPyAoY3RybC5taW51dGVzID0gMCwgY3RybC5ob3VycysrKSA6ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIGN0cmwuY2hlY2tDaGFuZ2VXZWVrZGF5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY3RybC5jaGVja0NoYW5nZShjdHJsLmhvdXJzLCBjdHJsLm5vb25Ib3VycykgPyAoY3RybC5ob3VycyA9IDAsIGN0cmwuaXNOb29uID0gIWN0cmwuaXNOb29uKSA6ICcnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY3RybC5zZWNvbmRzKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgLy9DYW1iaW8gZGUgZMOtYSBkZSBsYSBzZW1hbmFcclxuICAgICAgICBjdHJsLmNoZWNrQ2hhbmdlV2Vla2RheSA9ICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKGN0cmwuaXNOb29uID09PSB0cnVlICYmIGN0cmwuaG91cnMgPj0gMTIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjdHJsLndlZWtkYXkgPCA3KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3RybC53ZWVrZGF5Kys7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGN0cmwud2Vla2RheSA9IDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvL0NvbXByb2JhY2nDs24gZGUgY2FtYmlvIChFajogU2kgaGFuIHBhc3NhZG8gNjAgc2VndW5kb3MsIGRldnVlbHZlIHRydWUgcGFyYSBpbmNyZW1lbnRhciBsb3MgbWludXRvcylcclxuICAgICAgICBjdHJsLmNoZWNrQ2hhbmdlID0gKHZhbHVlLCBtYXhWYWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPj0gbWF4VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXSk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgLmNvbXBvbmVudCgnZm9ybWNvbXBvbmVudCcsIHtcclxuICAgICAgICAgICAgYmluZGluZ3M6IHtcclxuICAgICAgICAgICAgICAgIGlzQ29ycmVjdDogJzwnLFxyXG4gICAgICAgICAgICAgICAgb25Mb2dpbjogJyYnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvZm9ybS50ZW1wbGF0ZS5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRvbkNoYW5nZXMgPSAoY2hhbmdlcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGFuZ2VzLmlzQ29ycmVjdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3QgPSBhbmd1bGFyLmNvcHkoY2hhbmdlcy5pc0NvcnJlY3QuY3VycmVudFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0Vycm9yKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9naW4gPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkxvZ2luKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcjogdGhpcy51c2VybmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFzc3dvcmQ6IHRoaXMucGFzc3dvcmRcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAvLyBQcml2YXRlIGZ1bmN0aW9uczpcclxuICAgICAgICAgICAgICAgIHZhciBjdHJsID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBzaG93RXJyb3IoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN0cmwuY29ycmVjdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3RybC5tZXNzYWdlRXJyb3IgPSAnVXNlcm5hbWUgb3IgUGFzc3dvcmQgaW5jb3JyZWN0JztcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHJsLm1lc3NhZ2VFcnJvciA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXIubW9kdWxlKFwiYXBwXCIpLmNvbXBvbmVudCgncGFzc3dvcmRlbGVtZW50Y29tcG9uZW50Jywge1xyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvcGFzc3dvcmRlbGVtZW50LnRlbXBsYXRlLmh0bWwnLFxyXG4gICAgICAgIGJpbmRpbmdzOiB7XHJcbiAgICAgICAgICAgIHNhdmU6ICcmJyxcclxuICAgICAgICAgICAgY2xvc2U6ICcmJyxcclxuICAgICAgICAgICAgZWxlbWVudFRvRWRpdDogXCI8XCJcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGN0cmwgPSB0aGlzO1xyXG4gICAgICAgICAgICBjdHJsLmVsZW1lbnQgPSBjdHJsLmVsZW1lbnRUb0VkaXQ7XHJcbiAgICAgICAgICAgIGN0cmwucmVzZXQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGN0cmwuZWxlbWVudC53ZWJzaXRlID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgY3RybC5lbGVtZW50LmxvZ2luID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgY3RybC5lbGVtZW50LnBhc3N3b3JkID0gJyc7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge31cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgY3RybC5ndWFyZGFyID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGN0cmwuZWxlbWVudCA9PT0gdW5kZWZpbmVkIHx8IGN0cmwuZWxlbWVudCA9PT0gJycgfHxcclxuICAgICAgICAgICAgICAgICAgICBjdHJsLmVsZW1lbnQud2Vic2l0ZSA9PT0gdW5kZWZpbmVkIHx8IGN0cmwuZWxlbWVudC53ZWJzaXRlID09PSAnJyB8fFxyXG4gICAgICAgICAgICAgICAgICAgIGN0cmwuZWxlbWVudC5sb2dpbiA9PT0gdW5kZWZpbmVkIHx8IGN0cmwuZWxlbWVudC5sb2dpbiA9PT0gJycgfHxcclxuICAgICAgICAgICAgICAgICAgICBjdHJsLmVsZW1lbnQucGFzc3dvcmQgPT09IHVuZGVmaW5lZCB8fCBjdHJsLmVsZW1lbnQucGFzc3dvcmQgPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3RybC5jYW1wb3NWYWNpb3MgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjdHJsLnNhdmUoeyBlbGVtZW50bzogY3RybC5lbGVtZW50IH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGN0cmwuY2VycmFyID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY3RybC5jbG9zZSgpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnKS5jb21wb25lbnQoJ3RhYmxlY29tcG9uZW50Jywge1xyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvdGFibGUudGVtcGxhdGUuaHRtbCcsXHJcbiAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24oTFMsIGNvb2tpZXNTZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXNlciA9IGNvb2tpZXNTZXJ2aWNlLmdldENvb2tpZShcImluXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRzID0gKExTLmdldERhdGEodGhpcy51c2VyKS5sZW5ndGggIT09IDApID8gTFMuZ2V0RGF0YSh0aGlzLnVzZXIpIDogJyc7XHJcbiAgICAgICAgICAgIHRoaXMuZ3VhcmRhciA9IChlbGVtZW50bykgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZWRpdE1vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBMUy5zZXREYXRhKGVsZW1lbnRvLCB0aGlzLmluZGV4LCB0aGlzLnVzZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWRpdE1vZGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5uZXdSZWdpc3Rlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIExTLnNldERhdGEoZWxlbWVudG8sIHRoaXMuZWxlbWVudHMgIT09ICcnID8gTnVtYmVyKHRoaXMuZWxlbWVudHNbdGhpcy5lbGVtZW50cy5sZW5ndGggLSAxXS5pZCkgKyAxIDogMSwgdGhpcy51c2VyKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5ld1JlZ2lzdGVyID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnRzID0gTFMuZ2V0RGF0YSh0aGlzLnVzZXIpO1xyXG5cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy5kZWxldGVFbGVtZW50ID0gKGVsZW1lbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIExTLmRlbGV0ZUVsZW1lbnQoZWxlbWVudC5pZCwgdGhpcy51c2VyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudHMgPSAoTFMuZ2V0RGF0YSh0aGlzLnVzZXIpLmxlbmd0aCAhPT0gMCkgPyBMUy5nZXREYXRhKHRoaXMudXNlcikgOiAnJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmFkZEVsZW1lbnQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5ld1JlZ2lzdGVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudFRvRWRpdEYgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5lZGl0ID0gKGVsZW1lbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5kZXggPSBlbGVtZW50LmlkO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50VG9FZGl0RiA9IGVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVkaXRNb2RlID0gIXRoaXMuZWRpdE1vZGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5jZXJyYXIgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVkaXRNb2RlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5ld1JlZ2lzdGVyID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9yZGVyRmlsdGVyID0gKGlzQWN0aXZlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzQWN0aXZlID0gaXNBY3RpdmU7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGlzQWN0aXZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9yZGVyID0gdGhpcy53ZWJzaXRlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJldmVyc2UgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9yZGVyID0gdGhpcy53ZWJzaXRlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJldmVyc2UgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3JkZXIgPSB0aGlzLmxvZ2luO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJldmVyc2UgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9yZGVyID0gdGhpcy5sb2dpbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXZlcnNlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59KSgpO1xyXG5cclxuLy9WSVNVQUwgVE9PTFRJUFxyXG4kKGRvY3VtZW50KS5vbignbW91c2VlbnRlcicsIFwiLmlmdG9vbHRpcFwiLCBmdW5jdGlvbigpIHtcclxuICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XHJcbiAgICBpZiAoJHRoaXMuYXR0cigncGFzcycpKSB7XHJcbiAgICAgICAgJHRoaXMudG9vbHRpcCh7XHJcbiAgICAgICAgICAgIHRpdGxlOiAkdGhpcy5hdHRyKCdwYXNzJyksXHJcbiAgICAgICAgICAgIHBsYWNlbWVudDogXCJsZWZ0XCJcclxuICAgICAgICB9KTtcclxuICAgICAgICAkdGhpcy50b29sdGlwKCdzaG93Jyk7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5vZmZzZXRXaWR0aCA8IHRoaXMuc2Nyb2xsV2lkdGgpIHtcclxuICAgICAgICAkdGhpcy50b29sdGlwKHtcclxuICAgICAgICAgICAgdGl0bGU6ICR0aGlzLmF0dHIoJ3gnKSxcclxuICAgICAgICAgICAgcGxhY2VtZW50OiBcImJvdHRvbVwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKCdwYXNzJykge1xyXG4gICAgICAgICAgICAkdGhpcy50b29sdGlwKCdzaG93Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTsiXX0=

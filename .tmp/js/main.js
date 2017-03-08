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
                    console.log(val)
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
                    localStorage.removeItem(user + 'element' + idx);
                }
            }
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
        console.log($this.attr('x'));
        if ('pass') {
            $this.tooltip('show');
        }
    }
});
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUuanMiLCJwYXNzd29yZHNwYWdlL3Bhc3N3b3Jkc3BhZ2UuY29tcG9uZW50LmpzIiwiaG9tZS9ob21lLmNvbXBvbmVudC5qcyIsImNvbW1vbi9yZWxvai9yZWxvai5jb21wb25lbnQuanMiLCJjb21tb24vcmVsb2ovcmVsb2ouY29udHJvbGxlci5qcyIsImhvbWUvY29tcG9uZW50cy9mb3JtLmNvbXBvbmVudC5qcyIsInBhc3N3b3Jkc3BhZ2UvY29tcG9uZW50cy90YWJsZS90YWJsZS5jb21wb25lbnQuanMiLCJwYXNzd29yZHNwYWdlL2NvbXBvbmVudHMvcGFzc3dvcmRFbGVtZW50L3Bhc3N3b3JkZWxlbWVudC5jb21wb25lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwJywgWyduZ1JvdXRlJ10pXHJcbiAgICAgICAgLnNlcnZpY2UoJ2Nvb2tpZXNTZXJ2aWNlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBzZXRDb29raWU6IGZ1bmN0aW9uKGNuYW1lLCBjdmFsdWUsIGV4ZGF5cykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICBkLnNldFRpbWUoZC5nZXRUaW1lKCkgKyAoZXhkYXlzICogMjQgKiA2MCAqIDYwICogMTAwMCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBleHBpcmVzID0gXCJleHBpcmVzPVwiICsgZC50b1VUQ1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IGNuYW1lICsgXCI9XCIgKyBjdmFsdWUgKyBcIjtcIiArIGV4cGlyZXMgKyBcIjtwYXRoPS9cIjtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBnZXRDb29raWU6IGZ1bmN0aW9uKGNuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBjbmFtZSArIFwiPVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBkZWNvZGVkQ29va2llID0gZGVjb2RlVVJJQ29tcG9uZW50KGRvY3VtZW50LmNvb2tpZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNhID0gZGVjb2RlZENvb2tpZS5zcGxpdCgnOycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2EubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGMgPSBjYVtpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGMuY2hhckF0KDApID09ICcgJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYyA9IGMuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjLmluZGV4T2YobmFtZSkgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGMuc3Vic3RyaW5nKG5hbWUubGVuZ3RoLCBjLmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIC5zZXJ2aWNlKCdMUycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgc2V0RGF0YTogZnVuY3Rpb24odmFsLCBpZHgsIHVzZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWwuaWQgPSBpZHg7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codmFsKVxyXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGlkeCArIHVzZXIgKyAnZWxlbWVudCcsIGFuZ3VsYXIudG9Kc29uKHZhbCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vcmV0dXJuIHRoaXMgdG8gY29uY2F0ZW5hdGUgc3RyLnNldERhdGEoKS5zYWRkc2EoKS4uLi5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBnZXREYXRhOiBmdW5jdGlvbih1c2VyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGFsbCA9IFtdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXlzID0gT2JqZWN0LmtleXMobG9jYWxTdG9yYWdlKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaSA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKDsga2V5ID0ga2V5c1tpXTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrZXkuaW5jbHVkZXModXNlciArICdlbGVtZW50JykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbC5wdXNoKEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhbGw7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZGVsZXRlRWxlbWVudDogZnVuY3Rpb24oaWR4LCB1c2VyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odXNlciArICdlbGVtZW50JyArIGlkeCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwJykuY29tcG9uZW50KCdwYXNzd29yZHNwYWdlY29tcG9uZW50Jywge1xyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvcGFzc3dvcmRzcGFnZS50ZW1wbGF0ZS5odG1sJyxcclxuICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkbG9jYXRpb24sIGNvb2tpZXNTZXJ2aWNlKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmxvZ291dCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChjb29raWVzU2VydmljZS5nZXRDb29raWUoXCJpblwiKSAhPT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvb2tpZXNTZXJ2aWNlLnNldENvb2tpZShcImluXCIsIGNvb2tpZXNTZXJ2aWNlLmdldENvb2tpZShcImluXCIpLCAtMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLiRvbkluaXQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY29va2llc1NlcnZpY2UuZ2V0Q29va2llKFwiaW5cIikgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy51c2VybmFtZSA9IGNvb2tpZXNTZXJ2aWNlLmdldENvb2tpZShcImluXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSkuY29uZmlnKGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyKSB7XHJcbiAgICAgICAgJHJvdXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLndoZW4oJy9wYXNzd29yZHNwYWdlJywge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6IFwiPHBhc3N3b3Jkc3BhZ2Vjb21wb25lbnQ+PC9wYXNzd29yZHNwYWdlY29tcG9uZW50PlwiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpLmNvbXBvbmVudCgnaG9tZUNvbXBvbmVudCcsIHtcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2hvbWUudGVtcGxhdGUuaHRtbCcsXHJcbiAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24oJGxvY2F0aW9uLCBjb29raWVzU2VydmljZSkge1xyXG4gICAgICAgICAgICB0aGlzLnZhbGlkVXNlcnMgPSBbXHJcbiAgICAgICAgICAgICAgICB7IHVzZXJuYW1lOiBcImFuZ2VsXCIsIHBhc3N3b3JkOiBcImFuZ2VsXCIgfSxcclxuICAgICAgICAgICAgICAgIHsgdXNlcm5hbWU6IFwiY2FybG9zXCIsIHBhc3N3b3JkOiBcImNhcmxvc1wiIH0sXHJcbiAgICAgICAgICAgICAgICB7IHVzZXJuYW1lOiBcImphdmlcIiwgcGFzc3dvcmQ6IFwiamF2aVwiIH0sXHJcbiAgICAgICAgICAgICAgICB7IHVzZXJuYW1lOiBcImFsZXhcIiwgcGFzc3dvcmQ6IFwiYWxleFwiIH0sXHJcbiAgICAgICAgICAgICAgICB7IHVzZXJuYW1lOiBcInZpY3RvclwiLCBwYXNzd29yZDogXCJ2aWN0b3JcIiB9LFxyXG4gICAgICAgICAgICAgICAgeyB1c2VybmFtZTogXCJnYWJpXCIsIHBhc3N3b3JkOiBcImdhYmlcIiB9LFxyXG4gICAgICAgICAgICAgICAgeyB1c2VybmFtZTogXCJmcmFuXCIsIHBhc3N3b3JkOiBcImZyYW5cIiB9LFxyXG4gICAgICAgICAgICAgICAgeyB1c2VybmFtZTogXCJhbmR5XCIsIHBhc3N3b3JkOiBcImFuZHlcIiB9XHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgIHRoaXMubG9naW4gPSAodXNlcm5hbWUsIHBhc3N3b3JkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB1c2VyIG9mIHRoaXMudmFsaWRVc2Vycykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh1c2VybmFtZSA9PT0gdXNlci51c2VybmFtZSAmJiBwYXNzd29yZCA9PT0gdXNlci5wYXNzd29yZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb29raWVzU2VydmljZS5zZXRDb29raWUoXCJpblwiLCB1c2VybmFtZSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGFzc3dvcmRzcGFnZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNDb3JyZWN0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pLmNvbmZpZyhmdW5jdGlvbigkcm91dGVQcm92aWRlcikge1xyXG4gICAgICAgICRyb3V0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC53aGVuKCcvJywge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8aG9tZS1jb21wb25lbnQ+PC9ob21lLWNvbXBvbmVudD4nXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG59KSgpOyIsIiAoZnVuY3Rpb24oKSB7XHJcbiAgICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgICAuY29tcG9uZW50KCdyZWxvamNvbXBvbmVudCcsIHtcclxuICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvcmVsb2oudGVtcGxhdGUuaHRtbCcsXHJcbiAgICAgICAgICAgICBjb250cm9sbGVyOiAnUmVsb2pDb250cm9sbGVyJyxcclxuICAgICAgICAgfSk7XHJcbiB9KSgpOyIsImFuZ3VsYXIubW9kdWxlKFwiYXBwXCIpLmNvbnRyb2xsZXIoXCJSZWxvakNvbnRyb2xsZXJcIiwgW1xyXG4gICAgJyRpbnRlcnZhbCcsXHJcbiAgICBmdW5jdGlvbigkaW50ZXJ2YWwpIHtcclxuICAgICAgICB2YXIgY3RybCA9IHRoaXM7XHJcbiAgICAgICAgc2VjTnVtID0gNTk7XHJcbiAgICAgICAgaW50ZXJ2YWxNcyA9IDEwMDA7XHJcbiAgICAgICAgLy9JbmljaWFjacOzbiBkZSB0b2RhcyBsYXMgdmFyaWFibGVzXHJcbiAgICAgICAgY3RybC4kb25Jbml0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBnZXRBY3R1YWxEYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBub29uQ2hlY2soKTtcclxuICAgICAgICAgICAgICAgIGludGVydmFsVGltZShpbnRlcnZhbE1zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL0Z1bmNpb25lcyBQcml2YWRhc1xyXG5cclxuICAgICAgICAvL0ZlY2hhIGFjdHVhbFxyXG4gICAgICAgIGZ1bmN0aW9uIGdldEFjdHVhbERhdGUoKSB7XHJcbiAgICAgICAgICAgIGN0cmwuZGF5c0FycmF5ID0gWydNT04nLCAnVFVFJywgJ1dFRCcsICdUSFUnLCAnRlJJJywgJ1NBVCcsICdTVU4nXTtcclxuICAgICAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICBjdHJsLmhvdXJzID0gZGF0ZS5nZXRIb3VycygpO1xyXG4gICAgICAgICAgICBjdHJsLm1pbnV0ZXMgPSBkYXRlLmdldE1pbnV0ZXMoKTtcclxuICAgICAgICAgICAgY3RybC5zZWNvbmRzID0gZGF0ZS5nZXRTZWNvbmRzKCk7XHJcbiAgICAgICAgICAgIGN0cmwud2Vla2RheSA9IGRhdGUuZ2V0RGF5KCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy9Ob29uIGNoZWNrIFxyXG4gICAgICAgIGZ1bmN0aW9uIG5vb25DaGVjaygpIHtcclxuICAgICAgICAgICAgY3RybC5mb3JtYXQxMiA9IHRydWU7XHJcbiAgICAgICAgICAgIGN0cmwuZm9ybWF0MTIgPyBjdHJsLm5vb25Ib3VycyA9IDEyIDogY3RybC5ub29uSG91cnMgPSAyNDtcclxuICAgICAgICAgICAgY3RybC5ob3VycyA+PSBjdHJsLm5vb25Ib3VycyA/IChjdHJsLmlzTm9vbiA9IHRydWUsIGN0cmwuaG91cnMgPSBjdHJsLmhvdXJzIC0gY3RybC5ub29uSG91cnMpIDogY3RybC5pc05vb24gPSBmYWxzZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvL0ludGVydmFsICBcclxuICAgICAgICBmdW5jdGlvbiBpbnRlcnZhbFRpbWUoaW50ZXJ2YWxNcykge1xyXG4gICAgICAgICAgICAkaW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgYWN0dWFsaXphckhvcmEoKTtcclxuICAgICAgICAgICAgfSwgaW50ZXJ2YWxNcyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy9BY3R1YWxpemEgbGEgaG9yYSBkZWwgUmVsb2ogY2FkYSB2ZXogcXVlIHNlIGxsYW1hXHJcbiAgICAgICAgZnVuY3Rpb24gYWN0dWFsaXphckhvcmEoKSB7XHJcbiAgICAgICAgICAgIGlmIChjdHJsLnNlY29uZHMgPj0gc2VjTnVtKSB7XHJcbiAgICAgICAgICAgICAgICBjdHJsLnNlY29uZHMgPSAwO1xyXG4gICAgICAgICAgICAgICAgY3RybC5taW51dGVzKys7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3RybC5taW51dGVzID49IHNlY051bSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrQ2hhbmdlKGN0cmwubWludXRlcywgc2VjTnVtKSA/IChjdHJsLm1pbnV0ZXMgPSAwLCBjdHJsLmhvdXJzKyspIDogJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tDaGFuZ2VXZWVrZGF5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tDaGFuZ2UoY3RybC5ob3VycywgY3RybC5ub29uSG91cnMpID8gKGN0cmwuaG91cnMgPSAwLCBjdHJsLmlzTm9vbiA9ICFjdHJsLmlzTm9vbikgOiAnJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjdHJsLnNlY29uZHMrKztcclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgLy9DYW1iaW8gZGUgZMOtYSBkZSBsYSBzZW1hbmFcclxuICAgICAgICBmdW5jdGlvbiBjaGVja0NoYW5nZVdlZWtkYXkoKSB7XHJcbiAgICAgICAgICAgIGlmIChjdHJsLmlzTm9vbiA9PT0gdHJ1ZSAmJiBjdHJsLmhvdXJzID49IDEyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3RybC53ZWVrZGF5IDwgNykge1xyXG4gICAgICAgICAgICAgICAgICAgIGN0cmwud2Vla2RheSsrO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjdHJsLndlZWtkYXkgPSAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy9Db21wcm9iYWNpw7NuIGRlIGNhbWJpbyAoRWo6IFNpIGhhbiBwYXNzYWRvIDYwIHNlZ3VuZG9zLCBkZXZ1ZWx2ZSB0cnVlIHBhcmEgaW5jcmVtZW50YXIgbG9zIG1pbnV0b3MpXHJcbiAgICAgICAgZnVuY3Rpb24gY2hlY2tDaGFuZ2UodmFsdWUsIG1heFZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA+PSBtYXhWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5dKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuY29tcG9uZW50KCdmb3JtY29tcG9uZW50Jywge1xyXG4gICAgICAgICAgICBiaW5kaW5nczoge1xyXG4gICAgICAgICAgICAgICAgaXNDb3JyZWN0OiAnPCcsXHJcbiAgICAgICAgICAgICAgICBvbkxvZ2luOiAnJidcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9mb3JtLnRlbXBsYXRlLmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJG9uQ2hhbmdlcyA9IChjaGFuZ2VzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoYW5nZXMuaXNDb3JyZWN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29ycmVjdCA9IGFuZ3VsYXIuY29weShjaGFuZ2VzLmlzQ29ycmVjdC5jdXJyZW50VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93RXJyb3IoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dpbiA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uTG9naW4oe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VyOiB0aGlzLnVzZXJuYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXNzd29yZDogdGhpcy5wYXNzd29yZFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIC8vIFByaXZhdGUgZnVuY3Rpb25zOlxyXG4gICAgICAgICAgICAgICAgdmFyIGN0cmwgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHNob3dFcnJvcigpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY3RybC5jb3JyZWN0ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHJsLm1lc3NhZ2VFcnJvciA9ICdVc2VybmFtZSBvciBQYXNzd29yZCBpbmNvcnJlY3QnO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0cmwubWVzc2FnZUVycm9yID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpLmNvbXBvbmVudCgndGFibGVjb21wb25lbnQnLCB7XHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy90YWJsZS50ZW1wbGF0ZS5odG1sJyxcclxuICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbihMUywgY29va2llc1NlcnZpY2UpIHtcclxuICAgICAgICAgICAgdGhpcy51c2VyID0gY29va2llc1NlcnZpY2UuZ2V0Q29va2llKFwiaW5cIik7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMgPSAoTFMuZ2V0RGF0YSh0aGlzLnVzZXIpLmxlbmd0aCAhPT0gMCkgPyBMUy5nZXREYXRhKHRoaXMudXNlcikgOiAnJztcclxuICAgICAgICAgICAgdGhpcy5ndWFyZGFyID0gKGVsZW1lbnRvKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5lZGl0TW9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIExTLnNldERhdGEoZWxlbWVudG8sIHRoaXMuaW5kZXgsIHRoaXMudXNlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lZGl0TW9kZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLm5ld1JlZ2lzdGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgTFMuc2V0RGF0YShlbGVtZW50bywgdGhpcy5lbGVtZW50cyAhPT0gJycgPyBOdW1iZXIodGhpcy5lbGVtZW50c1t0aGlzLmVsZW1lbnRzLmxlbmd0aCAtIDFdLmlkKSArIDEgOiAxLCB0aGlzLnVzZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV3UmVnaXN0ZXIgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudHMgPSBMUy5nZXREYXRhKHRoaXMudXNlcik7XHJcblxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0aGlzLmRlbGV0ZUVsZW1lbnQgPSAoZWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgTFMuZGVsZXRlRWxlbWVudChlbGVtZW50LmlkLCB0aGlzLnVzZXIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50cyA9IChMUy5nZXREYXRhKHRoaXMudXNlcikubGVuZ3RoICE9PSAwKSA/IExTLmdldERhdGEodGhpcy51c2VyKSA6ICcnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuYWRkRWxlbWVudCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMubmV3UmVnaXN0ZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50VG9FZGl0RiA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmVkaXQgPSAoZWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbmRleCA9IGVsZW1lbnQuaWQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnRUb0VkaXRGID0gZWxlbWVudDtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWRpdE1vZGUgPSAhdGhpcy5lZGl0TW9kZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmNlcnJhciA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWRpdE1vZGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMubmV3UmVnaXN0ZXIgPSBmYWxzZTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMub3JkZXJGaWx0ZXIgPSAoaXNBY3RpdmUpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNBY3RpdmUgPSBpc0FjdGl2ZTtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoaXNBY3RpdmUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3JkZXIgPSB0aGlzLndlYnNpdGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmV2ZXJzZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3JkZXIgPSB0aGlzLndlYnNpdGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmV2ZXJzZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vcmRlciA9IHRoaXMubG9naW47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmV2ZXJzZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3JkZXIgPSB0aGlzLmxvZ2luO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJldmVyc2UgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn0pKCk7XHJcblxyXG4vL1ZJU1VBTCBUT09MVElQXHJcbiQoZG9jdW1lbnQpLm9uKCdtb3VzZWVudGVyJywgXCIuaWZ0b29sdGlwXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyICR0aGlzID0gJCh0aGlzKTtcclxuICAgIGlmICgkdGhpcy5hdHRyKCdwYXNzJykpIHtcclxuICAgICAgICAkdGhpcy50b29sdGlwKHtcclxuICAgICAgICAgICAgdGl0bGU6ICR0aGlzLmF0dHIoJ3Bhc3MnKSxcclxuICAgICAgICAgICAgcGxhY2VtZW50OiBcImxlZnRcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICR0aGlzLnRvb2x0aXAoJ3Nob3cnKTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLm9mZnNldFdpZHRoIDwgdGhpcy5zY3JvbGxXaWR0aCkge1xyXG4gICAgICAgICR0aGlzLnRvb2x0aXAoe1xyXG4gICAgICAgICAgICB0aXRsZTogJHRoaXMuYXR0cigneCcpLFxyXG4gICAgICAgICAgICBwbGFjZW1lbnQ6IFwiYm90dG9tXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zb2xlLmxvZygkdGhpcy5hdHRyKCd4JykpO1xyXG4gICAgICAgIGlmICgncGFzcycpIHtcclxuICAgICAgICAgICAgJHRoaXMudG9vbHRpcCgnc2hvdycpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoXCJhcHBcIikuY29tcG9uZW50KCdwYXNzd29yZGVsZW1lbnRjb21wb25lbnQnLCB7XHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9wYXNzd29yZGVsZW1lbnQudGVtcGxhdGUuaHRtbCcsXHJcbiAgICAgICAgYmluZGluZ3M6IHtcclxuICAgICAgICAgICAgc2F2ZTogJyYnLFxyXG4gICAgICAgICAgICBjbG9zZTogJyYnLFxyXG4gICAgICAgICAgICBlbGVtZW50VG9FZGl0OiBcIjxcIlxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgY3RybCA9IHRoaXM7XHJcbiAgICAgICAgICAgIGN0cmwuZWxlbWVudCA9IGN0cmwuZWxlbWVudFRvRWRpdDtcclxuICAgICAgICAgICAgY3RybC5yZXNldCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3RybC5lbGVtZW50LndlYnNpdGUgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICBjdHJsLmVsZW1lbnQubG9naW4gPSAnJztcclxuICAgICAgICAgICAgICAgICAgICBjdHJsLmVsZW1lbnQucGFzc3dvcmQgPSAnJztcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7fVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBjdHJsLmd1YXJkYXIgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3RybC5lbGVtZW50ID09PSB1bmRlZmluZWQgfHxcclxuICAgICAgICAgICAgICAgICAgICBjdHJsLmVsZW1lbnQud2Vic2l0ZSA9PT0gdW5kZWZpbmVkIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgY3RybC5lbGVtZW50LmxvZ2luID09PSB1bmRlZmluZWQgfHxcclxuICAgICAgICAgICAgICAgICAgICBjdHJsLmVsZW1lbnQucGFzc3dvcmQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGN0cmwuY2FtcG9zVmFjaW9zID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3RybC5zYXZlKHsgZWxlbWVudG86IGN0cmwuZWxlbWVudCB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjdHJsLmNlcnJhciA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGN0cmwuY2xvc2UoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufSkoKTsiXX0=

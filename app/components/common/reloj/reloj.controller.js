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
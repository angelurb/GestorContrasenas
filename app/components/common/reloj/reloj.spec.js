describe("component: relojcomponent", function() {
    //Let us run code before each test(app)
    beforeEach(module('app'));
    var $componentController;
    beforeEach(inject(function(_$componentController_) {
        $componentController = _$componentController_;
    }));

    it('should have Date variables stored inbetween a range', function() {
        var date = new Date(),
            minutes = date.getMinutes(),
            seconds = date.getSeconds(),
            weekday = date.getDay();
        var ctrl = $componentController('relojcomponent', null, {});
        ctrl.$onInit();
        expect(ctrl.minutes).toBe(minutes);
        expect(ctrl.seconds).not.toBeGreaterThan(seconds + 5);
        expect(ctrl.weekday).toBe(weekday);
        expect(ctrl.daysArray).toBeDefined();
    });

    it('should check if its Noon or not', function() {
        var ctrl = $componentController('relojcomponent', null, {});
        var date = new Date(),
            hours = date.getHours();
        ctrl.$onInit();
        if (ctrl.isNoon) {
            expect(ctrl.hours).toBe(hours - 12);
        } else {
            expect(ctrl.hours).toBe(hours);
        }
    });

    it('should change the seconds according to the performance of the clocks', function() {
        var ctrl = $componentController('relojcomponent', null, {});
        ctrl.seconds = 30;
        ctrl.actualizarHora();
        expect(ctrl.seconds).toBe(31);
        ctrl.seconds = 59;
        ctrl.actualizarHora();
        expect(ctrl.seconds).toBe(0);
        ctrl.seconds = 70;
        ctrl.actualizarHora();
        expect(ctrl.seconds).toBe(0);
    });
    it('should change the minutes according to the performance of the clocks', function() {
        var ctrl = $componentController('relojcomponent', null, {});
        ctrl.seconds = 59;
        ctrl.minutes = 1;
        ctrl.actualizarHora();
        expect(ctrl.minutes).toBe(2);
        ctrl.minutes = 59;
        ctrl.seconds = 59;
        ctrl.actualizarHora();
        expect(ctrl.minutes).toBe(0);
    });
    it('should change the hours according to the performance of the clocks', function() {
        var ctrl = $componentController('relojcomponent', null, {});
        ctrl.$onInit();
        ctrl.hours = 1;
        ctrl.minutes = 59;
        ctrl.seconds = 59;
        ctrl.actualizarHora();
        expect(ctrl.hours).toBe(2);
        ctrl.hours = 11;
        ctrl.minutes = 59;
        ctrl.seconds = 59;
        ctrl.actualizarHora();
        expect(ctrl.hours).toBe(0);

    });

    it('should check if the day changes when the day ends', function() {
        var ctrl = $componentController('relojcomponent', null, {});
        ctrl.isNoon = true;
        ctrl.hours = 12;
        ctrl.weekday = 1;
        ctrl.checkChangeWeekday();
        expect(ctrl.weekday).toBe(2);
        ctrl.isNoon = true;
        ctrl.hours = 10;
        ctrl.weekday = 1;
        ctrl.checkChangeWeekday();
        expect(ctrl.weekday).toBe(1);
        ctrl.isNoon = true;
        ctrl.hours = 12;
        ctrl.weekday = 7;
        ctrl.checkChangeWeekday();
        expect(ctrl.weekday).toBe(1);
    });
})
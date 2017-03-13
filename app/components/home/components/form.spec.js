describe("component: relojcomponent", function() {
    //Let us run code before each test(app)
    beforeEach(module('app'));
    var $componentController;
    beforeEach(inject(function(_$componentController_) {
        $componentController = _$componentController_;
    }));

    it('should have two variables binded', function() {
        var changes = {
            isCorrect: {
                currentValue: true
            }
        };
        var onLoginSpy = jasmine.createSpy('onLogin');
        var ctrl = $componentController('formcomponent', null, { onLogin: onLoginSpy });
        expect(ctrl.correct).toBe(undefined);
        ctrl.$onChanges(changes);
        expect(ctrl.correct).toBe(true);
        ctrl.username = 'angel';
        ctrl.password = 'angel';
        ctrl.login();
        expect(onLoginSpy).toHaveBeenCalledWith({ user: ctrl.username, password: ctrl.password });
    });
})
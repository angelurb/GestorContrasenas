describe("component: relojcomponent", function() {
    //Let us run code before each test(app)
    beforeEach(module('app'));
    var $componentController;
    beforeEach(inject(function(_$componentController_) {
        $componentController = _$componentController_;
    }));

    it('should have two variables binded', function() {
        var ctrl = $componentController('formcomponent', { $scope: {} }, { isCorrect: {}, onLogin: {} });
        expect(ctrl.isCorrect).toBeDefined();
    });
    it('should have Date variables stored inbetween a range', function() {
        var ctrl = $componentController('formcomponent', { $scope: {} });

    });
    it('should have Date variables stored inbetween a range', function() {
        var ctrl = $componentController('formcomponent', { $scope: {} });

    });
    it('should have Date variables stored inbetween a range', function() {
        var ctrl = $componentController('formcomponent', { $scope: {} });

    });
})
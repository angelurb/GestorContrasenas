describe("component: homeComponent", function() {
    //Let us run code before each test(app)
    beforeEach(module('app'));
    var $componentController;
    beforeEach(inject(function(_$componentController_) {
        $componentController = _$componentController_;
    }));

    it('should have defined valid users and check if the login function works with them', function() {
        var ctrl = $componentController('homeComponent', { $scope: {} });
        expect(ctrl.validUsers).toBeDefined();
        ctrl.login("angel", "angel");
        expect(ctrl.isCorrect).not.toBeDefined();
        ctrl.login('angel', 'x');
        expect(ctrl.isCorrect).toBe(false);
    });
})
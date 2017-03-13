describe("component: passwordspagecomponent", function() {
    //Let us run code before each test(app)
    beforeEach(module('app'));
    var $componentController;
    beforeEach(inject(function(_$componentController_) {
        $componentController = _$componentController_;
    }));
    beforeEach(inject(function($injector) {
        cS = $injector.get('cookiesService');
    }));
    it('should logout which means delete cookie and go back to login page', function() {
        var ctrl = $componentController('passwordspagecomponent', { $scope: {} }, 'cS');
        cS.setCookie("in", 'pepe', 1);
        cookie = cS.getCookie("in");
        expect(cookie).not.toBe('');
        ctrl.logout();
        cookie = cS.getCookie("in");
        expect(cookie).toBe('');
    });
})
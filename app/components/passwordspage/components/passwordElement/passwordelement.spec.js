describe("component: passwordelementcomponent", function() {
    //Let us run code before each test(app)
    beforeEach(module('app'));
    var $componentController;
    beforeEach(inject(function(_$componentController_) {
        $componentController = _$componentController_;
    }));

    it('should have elementToEdit variable binded', function() {
        var ctrl = $componentController('passwordelementcomponent', { $scope: {} }, { elementToEdit: { username: 'angel', website: 'www.gmail.com', password: 'angel' } });
        expect(ctrl.elementToEdit).toBeDefined();
        expect(ctrl.element).toBe(ctrl.elementToEdit);
    });
    it('should have two functions binded and working', function() {
        var saveSpy = jasmine.createSpy('save');
        var closeSpy = jasmine.createSpy('close');
        var ctrl = $componentController('passwordelementcomponent', { $scope: {} }, { elementToEdit: { username: 'angel', website: 'www.gmail.com', password: 'angel' }, save: saveSpy, close: closeSpy });
        ctrl.element.website = 'www.gmail.com'
        ctrl.element.login = 'angel'
        ctrl.element.password = 'angel'
        ctrl.guardar();
        expect(saveSpy).toHaveBeenCalledWith({ elemento: ctrl.element });
        ctrl.cerrar();
        expect(closeSpy).toHaveBeenCalled();
    });
    it('should reset all elements with properties set on \'\' ', function() {
        var ctrl = $componentController('passwordelementcomponent', {
            $scope: {}
        }, {
            elementToEdit: {
                username: 'angel',
                website: 'www.gmail.com',
                password: 'angel'
            }
        });
        ctrl.reset();
        expect(ctrl.element.website).toBe('');
        expect(ctrl.element.login).toBe('');
        expect(ctrl.element.password).toBe('');
    });
})
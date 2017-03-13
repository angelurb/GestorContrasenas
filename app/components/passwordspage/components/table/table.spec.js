describe("component: tablecomponent", function() {
    //Let us run code before each test(app)
    beforeEach(module('app'));
    var $componentController;
    beforeEach(inject(function(_$componentController_) {
        $componentController = _$componentController_;
    }));
    beforeEach(inject(function($injector) {
        LS = $injector.get('LS');
    }));
    it('should have take data from local Storage if exists, if not elements equal to \'\'', function() {
        var ctrl = $componentController('tablecomponent', { $scope: {} }, 'LS');
        expect(ctrl.elements).toBe('');
    });

    it("should save element to elements, depending if its a new element or an edited one.", function() {
        var ctrl = $componentController('tablecomponent', { $scope: {} }, 'LS');
        ctrl.user = 'angel';
        ctrl.index = '1';
        ctrl.newRegister = true;
        ctrl.guardar({
            username: 'angel',
            website: 'www.gmail.com',
            password: 'angel',
            id: 1
        });
        expect(ctrl.elements).toEqual([{
            username: 'angel',
            website: 'www.gmail.com',
            password: 'angel',
            id: 1
        }]);
        ctrl.newRegister = false;
        ctrl.editMode = true;
        ctrl.guardar({
            username: 'pepe',
            website: 'www.gmail.com',
            password: 'pepe',
            id: 1
        });
        expect(ctrl.elements).toEqual([{
            username: 'pepe',
            website: 'www.gmail.com',
            password: 'pepe',
            id: '1'
        }]);
        ctrl.newRegister = true;
        ctrl.editMode = false;
        ctrl.guardar({
            username: 'jose',
            website: 'www.gmail.com',
            password: 'jose',
            id: 2
        });
        expect(ctrl.elements.length).toBe(2);
        localStorage.clear();
    });

    it('should delete an element when calling deleteElement', function() {
        var ctrl = $componentController('tablecomponent', { $scope: {} }, 'LS');
        ctrl.user = 'angel';
        ctrl.index = '1';
        ctrl.newRegister = true;
        element1 = {
            username: 'angel',
            website: 'www.gmail.com',
            password: 'angel',
            id: 1
        };
        element2 = {
            username: 'pepe',
            website: 'www.gmail.com',
            password: 'pepe',
            id: 2
        };
        //with one element, it deletes the element
        ctrl.guardar(element1);
        expect(ctrl.elements.length).toBe(1);
        ctrl.deleteElement(element1);
        expect(ctrl.elements.length).toBe(0);
        //with two elements, it should delete the one that we want to
        ctrl.newRegister = true;
        ctrl.guardar(element1);
        ctrl.newRegister = true;
        ctrl.guardar(element2);
        expect(ctrl.elements.length).toBe(2);
        ctrl.deleteElement(element1);
        expect(ctrl.elements).toEqual([{
            username: 'pepe',
            website: 'www.gmail.com',
            password: 'pepe',
            id: 2
        }]);
        localStorage.clear();
    });
    it('should order the Filter of the top of the table', function() {
        var ctrl = $componentController('tablecomponent', { $scope: {} }, 'LS');

    });
    it('should change variables when calling addElement, edit and cerrar', function() {
        var ctrl = $componentController('tablecomponent', { $scope: {} }, 'LS');
        ctrl.website = 'w';
        ctrl.login = 'l';
        ctrl.orderFilter(1);
        expect(ctrl.order).toBe(ctrl.website)
        expect(ctrl.reverse).toBe(false);
        ctrl.orderFilter(2);
        expect(ctrl.order).toBe(ctrl.website)
        expect(ctrl.reverse).toBe(true);
        ctrl.orderFilter(3);
        expect(ctrl.order).toBe(ctrl.login)
        expect(ctrl.reverse).toBe(false);
        ctrl.orderFilter(4);
        expect(ctrl.order).toBe(ctrl.login)
        expect(ctrl.reverse).toBe(true);
    });
});
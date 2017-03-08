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
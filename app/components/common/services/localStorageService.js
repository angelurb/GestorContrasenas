(function() {
    'use strict';
    angular.module('app').service('LS', function() {
        return {
            setData: function(val, idx, user) {
                val.id = idx;
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
                localStorage.removeItem(idx + user + 'element');
            }
        }
    });
})();
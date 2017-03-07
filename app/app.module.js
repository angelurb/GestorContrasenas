(function() {
    'use strict';
    angular.module('app', ['ngRoute'])
        .service('cookiesService', function() {
            return {
                setCookie: function(cname, cvalue, exdays) {
                    var d = new Date();
                    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                    var expires = "expires=" + d.toUTCString();
                    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
                },
                getCookie: function(cname) {
                    let name = cname + "=";
                    let decodedCookie = decodeURIComponent(document.cookie);
                    let ca = decodedCookie.split(';');
                    for (let i = 0; i < ca.length; i++) {
                        let c = ca[i];
                        while (c.charAt(0) == ' ') {
                            c = c.substring(1);
                        }
                        if (c.indexOf(name) == 0) {
                            return c.substring(name.length, c.length);
                        }
                    }
                    return "";
                }
            }
        })
        .service('LS', function() {
            return {
                setData: function(val, idx, user) {
                    val.id = idx;
                    localStorage.setItem(user + 'element' + idx, angular.toJson(val));
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
                    localStorage.removeItem(user + 'element' + idx);
                }
            }
        });
})();
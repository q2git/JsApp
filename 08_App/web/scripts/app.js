'use strict';
//
angular.module('myApp', ['ui.router','ngResource'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
                    // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html'
                    },
                    'content': {
                        templateUrl : 'views/content.html',
                        controller  : 'myCtrl'
                    },
                    'footer': {
                        templateUrl : 'views/footer.html'
                    }
                }
            })

  
		
            $urlRouterProvider.otherwise('/');
    })

/*
angular.module('confusionApp', ['ngRoute'])
.config(function($routeProvider) {
        $routeProvider
            // route for the contactus page
            .when('/contactus', {
                templateUrl : 'contactus.html',
                controller  : 'ContactController'
            })
            // route for the menu page
            .when('/menu', {
                templateUrl : 'menu.html',
                controller  : 'MenuController'
            })
            // route for the dish details page
            .when('/menu/:id', {
                templateUrl : 'dishdetail.html',
                controller  : 'DishDetailController'
            })
            .otherwise('/contactus');
    })
*/
;
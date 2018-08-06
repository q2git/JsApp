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

;
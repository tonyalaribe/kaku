'use strict';
var app = angular.module('app', ['ui.bootstrap', 'facebook','autocomplete']);

app.config(function($interpolateProvider){
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
    })
    
.config(function(FacebookProvider) {
     // Set your appId through the setAppId method or
     // use the shortcut in the initialize method directly.
     FacebookProvider.init('986275294733187');
  })
  

  
.controller('LoginCtrl',  function($scope, $modal, $http, Facebook){
  $scope.user = {};
  $scope.pic = {};
  $scope.loggedIn =false;
  
  $scope.logout = function(){
    Facebook.logout(function(response) {
  // user is now logged out
      $scope.loggedIn = false;
    });
  };
  
  $scope.$watch(function() {
    // This is for convenience, to notify if Facebook is loaded and ready to go.
    return Facebook.isReady();
  }, function(newVal) {
    // You might want to use this to disable/show/hide buttons and else
    $scope.facebookReady = true;
     Facebook.getLoginStatus(function(response) {
            if(response.status === 'connected') {
              if ($scope.loggedIn !== true){
                $scope.loggedIn = true;
                Facebook.api('/me', function(response) {
                    $scope.user = response;
                    $http.post('/login', response);
                    console.log(response);
                });
                
                Facebook.api('/me/picture?height=100&type=square&width=100', function(response) {
                    $scope.pic= response;
                });
                
              }
            } else {
              $scope.loggedIn = false;
            }
          });
      });


  $scope.open = function (size) {

            var modalInstance = $modal.open({
                template: '<div class="modal-header">'+
'                                <h3 class="modal-title" align="center">Login With</h3>'+
'                            </div>'+
'                                 <div class="modal-body" align="center">'+
'                                 <button class="btn btn-info nobr"  ng-hide="loggedIn" ng-click="login()" style="background-color:#3b5998; border-color:#3b5998;" type="submit"><i class="fa fa-facebook"></i> facebook</button>'+
'                                 </div>'+
'                                 <div class="modal-footer">'+
'                                    <button class="btn btn-warning" ng-click="cancel()">Cancel</button>'+
'                                 </div>',
                      controller: 'ModalInstanceCtrl',
                      size: size,
                      resolve: {
                        items: function () {
                            return $scope.items;
                        }
                      }
                });
    
};
  
})

.controller('ModalInstanceCtrl', function ($scope, $modalInstance, $http, Facebook) {

  $scope.login = function() {
        // From now on you can use the Facebook service just as Facebook api says
        Facebook.login(function(response) {
          // Do something with response
          $http.post('/login', response);
            
            
         });
         $modalInstance.dismiss('cancel');
    
      };
  
  
      $scope.cancel = function () {
         $modalInstance.dismiss('cancel');
      };
})

.controller('ReviewCtrl', function($scope, Facebook){
  $scope.loggedIn =false;

    $scope.$watch(function() {
      // This is for convenience, to notify if Facebook is loaded and ready to go.
      return Facebook.isReady();
    }, function(newVal) {
      // You might want to use this to disable/show/hide buttons and else
      $scope.facebookReady = true;
     Facebook.getLoginStatus(function(response) {
            if(response.status === 'connected') {
                $scope.loggedIn = true;
                Facebook.api('/me', function(response) {
                    $scope.email = response.email;
                    $scope.name = response.name;
   
                });
                Facebook.api('/me/picture?height=200&type=square&width=200', function(response) {
                  $scope.ppic= response.data.url;
                  console.log(response);
              });
     
    
            } else {
              $scope.loggedIn = false;
            }
          });
    
    
    });
})


.controller('OverviewPicCtrl', function($scope){
  
})


.controller('AlertCtrl', function($scope){
  
})



.controller('ReviewssCtrl', function($scope){
  $scope.overall=0;
  $scope.service=0;
  $scope.food=0;
  $scope.decor=0;
})
  
.controller('NewplaceCtrl',  function($scope,$http, Facebook){
  
    $scope.loggedIn =false;

    $scope.$watch(function() {
      // This is for convenience, to notify if Facebook is loaded and ready to go.
      return Facebook.isReady();
    }, function(newVal) {
      // You might want to use this to disable/show/hide buttons and else
      $scope.facebookReady = true;
     Facebook.getLoginStatus(function(response) {
            if(response.status === 'connected') {
                $scope.loggedIn = true;
                Facebook.api('/me', function(response) {
                    $http.post('/login', response);
                    $scope.email = response.email;
                });
     
    
            } else {
              $scope.loggedIn = false;
            }
          });
    
    
    });
})


.controller('SearchCtrl', function($scope,$http, Facebook){
    $scope.s = '';
    $scope.l = '';
    $scope.b = '';
    
    $scope.service = [
      'Drinks and NightLife',
      'Restaurants',
      'Cafes, Pastries & Ice Cream Spots',
      'Arts and Entertainment',
      'Events',
    ];
    
    $scope.loc = [
      'Ikeja',
      'Aba',
      'Calabar',
      'Warri',
      ];
      
      
    $scope.updateLocation = function(a){
      var promise = $http({
          method: 'GET',
          url: '/s',
          params: {
            't': 'location',
            's': a,
            
          }
          });
          
      promise.then(function(resp) {
      // resp is a response object
        $scope.loc = resp;
      }, function(resp) {
      // resp with error
      });

    };

    $scope.updateService = function(a){
      var promise = $http({
          method: 'GET',
          url: '/s',
          params: {
            't': 'service',
            's': a,
            
          }
          });
          
      promise.then(function(resp) {
      // resp is a response object
        $scope.service = resp;
      }, function(resp) {
      // resp with error
      });
    };
}
);
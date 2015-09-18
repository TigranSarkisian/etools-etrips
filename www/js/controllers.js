angular.module('equitrack.controllers', [])

.controller('AppCtrl', function($scope, $state, LoginService) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  $scope.logout = function(){
      console.log('logout goes here')
      $state.go("login")
      LoginService.logout()

  };
  // Form data for the login modal
  $scope.data = {};

})

.controller('DashCtrl', function($scope) {

})


.controller('LoginCtrl', ['$scope', '$ionicLoading', '$localStorage',
            'Data', 'LoginService', 'Auth', '$ionicPopup', '$state', 'API_urls',
             function($scope, $ionicLoading, $localStorage, Data, LoginService,
                      Auth, $ionicPopup, $state, API_urls) {

    $scope.data = {};
    function login_success(token){
        console.log("LoginCtrl: login_success");
        Data.get_trips(
            function(res){
                $ionicLoading.hide();
                console.log("got trips", res)
                $state.go('app.dash.my_trips');
            },
            function(res){
                $ionicLoading.hide();
                console.log("failed to get trips")
            }, true
        )

    };

    function login_fail(data){
        console.log("LoginCtrl: login_fail", data.data)
        var alertPopup = $ionicPopup.alert({
            title: 'Login failed!',
            template: 'Please check your credentials!'
        });
    };

    $scope.login = function(){
        var loginData = $scope.data
        $ionicLoading.show({
                      template: 'Loading...'
        });
        LoginService.loginUser(loginData, login_success, login_fail)
        $scope.data = {}
    };

}]);
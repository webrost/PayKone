angular.module("MainModule").controller("UserInRolesCtrl", function ($scope, $http, $q, $modal) {
    $scope.roles = [];
    $scope.users = [];
    $scope.current = { user: {} };
    $scope.newuser = "";

    $http.get("/api/users").success(function (data) {
        $scope.users = data;
        if(data.length > 0)
        {
            $scope.current.user = data[0];
            $scope.LoadRoles(data[0]);
        }
    });

    $scope.AddNewUser = function () {        
        $scope.newuser = "";
    }

    $scope.LoadRoles = function (user) {
        $scope.current.user = user;
        $http.post("/api/roles", { Name: user.Name }).success(function (data) {
            $scope.roles = data;
        });
    }

    $scope.IsActiveUser = function (user) {
        if($scope.current.user.Name == user.Name)
        {
            return "active";
        } else {
            return "";
        }
    }
});

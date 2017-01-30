angular.module("MainModule").controller("RoleRouteAccessCtrl", function ($scope, $http, $q, $modal) {
    $scope.roles = [];
    $scope.routes = [];
    $scope.current = { role: {} };

    $http.get("/api/roles").success(function (data) {
        $scope.roles = data;
        if(data.length > 0)
        {
            $scope.LoadRoutes(data[0]);
        }
    });


    $scope.UpdateRouteAccess = function (route) {
        if(!route.Enabled){
            $http.delete("/api/routes/" + route.Id);
        } else {
            $http.post("/api/routes", {
                Method: route.Method,
                RouteTemplate: route.RouteTemplate,
                RoleId: $scope.current.role.Id
            }).success(function (routeId) {
                route.Id = routeId
            });
        }
    }

    $scope.LoadRoutes = function (role) {
        $scope.current.role = role;
        $http.get("/api/routes/" + $scope.current.role.Id).success(function (data) {
            $scope.routes = data;
        });
    }

    $scope.IsActiveRole = function (roleId) {
        if ($scope.current.role.Id == roleId) {
            return "active";
        } else {
            return "";
        }
    }
});

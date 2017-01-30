angular.module("MainModule").controller("MenuAccessCtrl", function ($scope, $http, $q, $modal) {
    $scope.roles = [];
    $scope.menus = [];
    $scope.current = { role: {} };

    $http.get("/api/roles").success(function (data) {
        ShowWaiting();
        $scope.roles = data;
        if(data.length > 0)
        {
            $scope.LoadMenus(data[0]);
            HideWaiting();
        }else{
            ShowWaiting();
        }
    });


    $scope.UpdateMenuAccess = function (menu) {
        if(!menu.Enabled){
            $http.get("/api/menus/delete/" + menu.MenuAccessId);
        } else {
            $http.post("/api/menus", {
                Id: menu.Id,
                RoleId: $scope.current.role.Id
            }).success(function (menuAccessId) {
                menu.MenuAccessId = menuAccessId
            });
        }
    }

    $scope.LoadMenus = function (role) {
        $scope.current.role = role;
        $http.get("/api/menus/" + $scope.current.role.Id).success(function (data) {
            $scope.menus = data;
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

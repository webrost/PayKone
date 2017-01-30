angular.module("MainModule").controller("TerminalAccessCtrl", function ($scope, $http, $q, $modal) {    
    $scope.users = [];
    $scope.current = { user: {} };

    ///--Загрузка дерева терминалов
    $scope.LoadTerminalTree = function(user) {
        $scope.current.user = user;
        $.get("/api/terminalgroup/" + user.Name.replace('@', '%40')).success(function (data) {
            $('#tree').treeview({
                data: data,
                showCheckbox: true,
                onNodeChecked: function (event, data) {
                    $.get("/api/terminalgroup/access/allow/"+user.Name+"/"+data.id);
                },
                onNodeUnchecked: function (event, data) {
                    $.get("/api/terminalgroup/access/deny/" + user.Name + "/" + data.id);
                }
            });
        });
    }

    ///---Загрузка списка пользователей системы
    $http.get("/api/users").success(function (data) {
        $scope.users = data;
        if (data.length > 0) {
            $scope.current.user = data[0];
            $scope.LoadTerminalTree($scope.current.user);
        }
    });

    ///---Является ли текущий пользователь выделенным
    $scope.IsActiveUser = function (user) {
        if ($scope.current.user.Name == user.Name) {
            return "active";
        } else {
            return "";
        }
    }


});

angular.module("MainModule").controller("PaymentAccessCtrl", function ($scope, $http, $q, $modal) {    
    $scope.users = [];
    $scope.current = { user: {} };

    ///--Загрузка дерева терминалов
    $scope.LoadPaymentlTree = function (user) {
        ShowWaiting();
        $scope.current.user = user;
        $.get("/api/paymentgroup/" + user.Name.replace('@', '%40')).success(function (data) {
            $('#tree').treeview({
                data: data,
                showCheckbox: true,
                onNodeChecked: function (event, data) {
                    $.post("/api/paymentgroup/access/allow", { "Username": user.Name , "PaymentGroupId":data.id});
                },
                onNodeUnchecked: function (event, data) {
                    $.get("/api/paymentgroup/access/deny", { "Username": user.Name, "PaymentGroupId": data.id });
                }
            });
            HideWaiting();
        });
    }

    ///---Загрузка списка пользователей системы
    ShowWaiting();
    $http.get("/api/users").success(function (data) {
        $scope.users = data;
        if (data.length > 0) {
            $scope.current.user = data[0];
            $scope.LoadPaymentlTree($scope.current.user);
        }
        HideWaiting();
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

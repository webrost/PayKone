angular.module("MainModule").controller("BalanceCtrl", function ($scope, $http, $q) {
   
    $scope.records = [];
    $scope.current = {summ:0, count:0};

    ///---Получение кассы
    $scope.getIncassation = function () {
        ShowWaiting();
        $http.get("api/cashbox/balance").success(function (data) {
            $scope.records = data;
            $scope.getTotal();
            HideWaiting();
        });
    }
    $scope.getIncassation();

    $scope.getTotal = function () {
        $scope.current = { summ: 0, count: 0 };
        for (var i = 0; i < $scope.records.length; i++) {
            $scope.current.summ += $scope.records[i].Summ;
            $scope.current.count += $scope.records[i].AllCount;
        }
    }
});

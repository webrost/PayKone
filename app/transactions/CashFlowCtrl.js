angular.module("MainModule").controller("CashFlowCtrl", function ($scope, $http, $q, $modal) {
    
    $scope.currentTerminal;
    var dt = new Date();
    $scope.startDate = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
    $scope.endDate = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 23, 59, 59);
    $scope.EnableFilter = false;
    $scope.cashFlows = [];
    $scope.current = { cashFlow: {} };
    $scope.totalSumm = 0;
    $scope.totalCount = 0;

    $scope.getTerminals =  function(nameContains)
    {
        return $http.get("/api/terminals/" + nameContains).then(function (data) {
            return data.data.map(function (item) {
                return item
            });
        });
    }

    ///--Получение списка принятых купюр непосредственно с терминала
    $scope.getCashFlow = function () {
        if ($scope.currentTerminal.Id){
            $scope.cashFlows = [];
            var requestUrl = "/api/cashflows/" + $scope.currentTerminal.Id +
                "/" + $scope.startDate.getTime() +
                "/" + $scope.endDate.getTime();
            ShowWaiting();
            $http.get(requestUrl).success(function (data) {
                $scope.cashFlows = data;
                HideWaiting();
                $scope.totalSumm = 0;
                $scope.totalCount = $scope.cashFlows.length;
                for (var i = 0; i < $scope.cashFlows.length; i++) {
                    $scope.totalSumm += $scope.cashFlows[i].Nominal;
                }
                $scope.$apply();
            });
        }
    }

    ///---В результате выделения проверяю нужно ли активировать кнопку фильтрации транзакций
    $scope.CheckTerminalSelection = function () {
        if ($scope.currentTerminal.Id) {
            $scope.EnableFilter = true;
        }
    }

});

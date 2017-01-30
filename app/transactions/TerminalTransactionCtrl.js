angular.module("MainModule").controller("TerminalTransactionCtrl", function ($scope, $http, $q, $modal) {
    
    $scope.currentTerminal;
    var dt = new Date();
    $scope.startDate = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
    $scope.endDate = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 23, 59, 59);
    $scope.transactions = [];
    $scope.EnableFilter = false;
    $scope.checked = [];
    $scope.current = { transaction: {}};
    $scope.transactionstatus = 2;
    $scope.ShowDialogCashFlow = false;
    $scope.cashFlows = [];

    $scope.getTerminals =  function(nameContains)
    {
        return $http.get("/api/terminals/" + nameContains).then(function (data) {
            return data.data.map(function (item) {
                return item
            });
        });
    }

    ///---Возвращает купюры по указанным транзакциям
    $scope.GetCashFlow = function () {
        ShowWaiting();
        $http.post("/api/cashflowsintransactions", $scope.checked).success(function (data) {            
            $scope.cashFlows = data;
            HideWaiting();
            $scope.ShowDialogCashFlow = true;
        });
    }

    $scope.getTransaction = function () {
        if ($scope.currentTerminal.Id){
            $scope.transactions = [];
            var requestUrl = "/api/transactions/" + $scope.currentTerminal.Id +
                "/" + $scope.startDate.getFullYear() + "/" + $scope.startDate.getMonth() + "/" + $scope.startDate.getDate() + "/" + $scope.startDate.getHours() + "/" + $scope.startDate.getMinutes() + "/" + $scope.startDate.getSeconds() + "/" +
                "/" + $scope.endDate.getFullYear() + "/" + $scope.endDate.getMonth() + "/" + $scope.endDate.getDate() + "/" + $scope.endDate.getHours() + "/" + $scope.endDate.getMinutes() + "/" + $scope.endDate.getSeconds();
            ShowWaiting();
            $http.get(requestUrl).success(function (data) {
                $scope.transactions = data;
                HideWaiting();
            });
        }
    }

    $scope.getTotal = function () {
        var totalSumm = 0;
        for (var i = 0; i < $scope.transactions.length; i++) {
            totalSumm += $scope.transactions[i].Summ;
        }
        return totalSumm;
    }


    ///---В результате выделения проверяю нужно ли активировать кнопку фильтрации транзакций
    $scope.CheckTerminalSelection = function () {
        if ($scope.currentTerminal.Id) {
            $scope.EnableFilter = true;
        }
    }

    ///---Добавление/удаление транзакции для обработки
    $scope.Check = function (event, id) {
        if (event.target.checked) {
            $scope.checked.push(id);
        } else {
            var position = $scope.checked.indexOf(id);
            $scope.checked.splice(position, 1);
        }
    }

    ///---Изменение статуса транзакций
    $scope.ChangeTransactionStatus = function () {
        angular.forEach($scope.checked, function (value, key) {
            ShowWaiting();
            $http.get("/api/transaction/status/" + value +"/" +$scope.transactionstatus).success(function () {
                $scope.getTransaction();
                HideWaiting();
            }).error(function (error) {
            });
        });
    }

    ///---Печать чеков по выбранным трпнзакциям
    $scope.Print = function () {
        if ($scope.currentTerminal.ComputerName){
            angular.forEach($scope.checked, function (value, key) {
                ShowWaiting();
                $http.get("/api/receipt/" + value).success(function (receipt) {
                    var requestObject = { Receipt: receipt, PrintApiUrl: "http://" + $scope.currentTerminal.ComputerName + ":3232" };
                    //var requestObject = { Receipt: receipt, PrintApiUrl: "http://localhost:3232" };
                    $http.post("api/print", requestObject).success(function (data) {
                        HideWaiting();
                        if (data) {
                            $modal({
                                "title": "Ошибка печати",
                                "content": "Ошибка печати на терминал " + $scope.currentTerminal.ComputerName + " " + data,
                                "show": true
                            });
                        } else {
                            $modal({
                                "title": "Печать",
                                "content": "Данные для транзакции были отправлены на печать на терминал " + $scope.currentTerminal.ComputerName,
                                "show": true
                            });
                            $scope.checked = [];
                        }
                    }).error(function (error) {
                        $modal({
                            "title": "Ошибка печати",
                            "content": "Ошибка печати на терминал " + $scope.currentTerminal.ComputerName + " " + error,
                            "show": true
                        });
                    });
                });            
            });
        }
    }
});

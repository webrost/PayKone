angular.module("MainModule").controller("IncassationCtrl", function ($scope, $http, $q, $modal) {
    
    var dt = new Date();
    $scope.startDate = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
    $scope.endDate = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 23, 59, 59);
    $scope.incassations = [];
    $scope.checked = [];
    $scope.modalHeader = "";
    $scope.modalMessage = "";
    $scope.current = {incassation : {}};


    ///---Получение списка инкассаций
    $scope.getIncassation = function () {
        $scope.incassations = [];
        ShowWaiting();
        var requestUrl = "/api/incassations/" +
            $scope.startDate.getFullYear() + "/" + $scope.startDate.getMonth() + "/" + $scope.startDate.getDate() + "/" + $scope.startDate.getHours() + "/" + $scope.startDate.getMinutes() + "/" + $scope.startDate.getSeconds() + "/"
            + $scope.endDate.getFullYear() + "/" + $scope.endDate.getMonth() + "/" + $scope.endDate.getDate() + "/" + $scope.endDate.getHours() + "/" + $scope.endDate.getMinutes() + "/" + $scope.endDate.getSeconds();

        $http.get(requestUrl).success(function (data) {
            $scope.incassations = data;
            HideWaiting();
        });
    }

    $scope.getTotal = function () {
        var totalSumm = 0;
        for (var i = 0; i < $scope.incassations.length; i++)
        {
            totalSumm += $scope.incassations[i].Summ;
        }
        return totalSumm;
    }

    ///---Добавление/удаление инкассации для обработки
    $scope.Check = function (event, terminalId, date) {
        if (event.target.checked)
        {
            $scope.checked.push({ terminalId: terminalId, date: date});
        } else {
            $scope.checked = $scope.checked.filter(function (el) {
                return !(el.terminalId == terminalId && el.date == date);
            });
        }
    }

    ///---Печать чеков по выбранным инкассациям
    $scope.Print = function () {
        angular.forEach($scope.checked, function (value, key) {
            var requestString = "/api/incassation/receipt/" + value.terminalId + "/" + value.date.substring(0, 4)
                + "/" + value.date.substring(5, 7) + "/" + value.date.substring(8, 10) + "/" + value.date.substring(11, 13)
            + "/" + value.date.substring(14, 16) + "/" + value.date.substring(17, 19)
            ;

            ShowWaiting();
            $http.get(requestString).success(function (message) {
                $scope.modalHeader = "Результат";
                $scope.modalMessage = message;
                $('#myModal').modal('show');
                HideWaiting();
            }).error(function (ex) {
            });
            });
    }
});

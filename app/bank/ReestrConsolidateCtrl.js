angular.module("MainModule").controller("ReestrConsolidateCtrl", function ($scope, $http, $q, $modal) {

    $scope.reestrs = [];
    $scope.transactions = [];
    $scope.checked = [];
    var dt = new Date();
    $scope.startDate = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 0, 0, 0);
    $scope.endDate = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 23, 59, 59);

    $scope.current = { reestrName: "", reestrDate: {}, reestr: {}, transaction: {} };
    $scope.showSaveComplete = false;

    ///---Загрузка реестров за период
    $scope.LoadReestrs = function () {
        var requestUrl = "/api/reestr/builded" + Date2UrlFull($scope.startDate) + Date2UrlFull($scope.endDate);
        ShowWaiting();
        $.get(requestUrl).success(function (data) {
            $scope.reestrs = data;
            $scope.$apply();
            HideWaiting();
        });
    }

    ///---Удаление выгруженного файла реестра
    $scope.DeleteFile = function (reestr) {
        ShowWaiting();
        $.post("/api/reestr/deletefile", { FileName: reestr.FileName }).success(function () {
            $scope.transactions = [];
            $scope.LoadReestrs();
            HideWaiting();
        });
    }

    ///---Загрузка сформированных транзакций по выбранному реестру
    $scope.LoadTransactions = function (reestr) {
        $scope.current.reestr = reestr;
        var requestUrl = "/api/reestr/getrecords" + DateString2UrlMinutes(reestr.Date) + "/" + reestr.ReestrName;
        ShowWaiting();
        $.get(requestUrl).success(function (data) {
            $scope.transactions = data;
            $scope.$apply();
            HideWaiting();
        });
    }

    ///---Исключение транзакции из текущего реестра
    $scope.ExcludeTransaction = function (transaction) {
        $scope.current.transaction = transaction;
        ShowWaiting();
        $.post("/api/reestr/exlude", { ReestrIds: $scope.checked }).success(function () {
            $scope.transactions = [];
            $scope.LoadReestrs();
            HideWaiting();
        });
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



    ///---Сохранение реестров на FTP сервере
    $scope.ExportReestr = function (reestrName, reestrDate) {
        $scope.current.reestrName = reestrName;
        $scope.current.reestrDate = reestrDate;
        var requestUrl = "/api/reestr/export/" + DateString2UrlMinutes(reestrDate) + "/" + reestrName;
        $.get(requestUrl).success(function () {
            $scope.showSaveComplete = true;
            $scope.transactions = [];
            $scope.LoadReestrs();
        });
    }

    $scope.LoadReestrs();

});

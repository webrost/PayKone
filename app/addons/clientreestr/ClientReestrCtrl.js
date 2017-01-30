angular.module("MainModule").controller("ClientReestrCtrl", function ($scope, $http, $q, $modal, $routeParams) {
   
    $scope.records = [];
    $scope.reestrRecords = [];
    $scope.current = { summ: 0, count: 0 };
    $scope.showReestrs = true;
    $scope.currentReestrId = 0;
    

    ///---Получение реестра
    $scope.getReestrs = function () {
        ShowWaiting();
        $http.get("api/addons/ClientReestrs").success(function (data) {
            $scope.records = data;
            HideWaiting();
        });
    }

    ///---Получение записей реестра
    $scope.getReestrRecords = function () {
        ShowWaiting();
        $http.get("api/addons/ClientReestrRecords/" + $scope.currentReestrId).success(function (data) {
            $scope.reestrRecords = data;
            HideWaiting();
        });
    }

    ///---Определяю отображать сам реестр или список реестров
    if ($routeParams.reestrid == "0")
    {
        $scope.showReestrs = true;
        $scope.currentReestrId = 0;
        $scope.getReestrs();
    } else {
        $scope.showReestrs = false;
        $scope.currentReestrId = parseInt($routeParams.reestrid);
        $scope.getReestrRecords();
    }

    ///---Create new reestr
    $scope.NewReestr = function () {
        $http.post("api/addons/AddClientReestr", {}).success(function (data) {
            $scope.getReestrs();
        });
    }

    ///---Create new reestr record
    $scope.NewReestrRecord = function()
    {

    }

    $scope.SaveNewReestrRecord = function()
    {
        var newRR =             {
            "Account": $("#rrAccount").val(),
            "AccountName": $("#rrAccountName").val(),
            "OKPO": $("#rrOKPO").val(),
            "Sum": parseFloat($("#rrSum").val()),
            "ClientReestrId": $scope.currentReestrId,
            "Purpose": $("#rrPurpose").val()
        };
        $http.post("api/addons/ClientReestrRecord", newRR).success(function (data) {
            $scope.getReestrRecords();
        });
    }

    ///---Edit reestr
    $scope.EditReestr = function (id) {
        location.href = "cabinet.html#/clientreestr/"+id;
        //commission.source = $scope.source;
        //var newBoxModal = $modal.open({
        //    templateUrl: "/Scripts/app/addons/clientreestr/NewCommission.tpl.html",
        //    controller: "NewCommissionCtrl",
        //    resolve: {
        //        data: function () {
        //            return { commission: commission };
        //        }
        //    }
        //});
    }

    ///---Delete reestr
    $scope.DeleteReestr = function (id) {
        $http.get("api/addons/ClientReestr/Delete/" + id).success(function (data) {
            $scope.getReestrs();
        });
    }

    $scope.DeleteReestrRecord = function(id)
    {
        $http.get("api/addons/ClientReestrRecord/Delete/" + id).success(function () {
            $scope.getReestrRecords();
        });
    }

    ///---Переход на начальную страницу
    $scope.GoBack = function()
    {
        location.href = "cabinet.html#/clientreestr/0";
    }
});

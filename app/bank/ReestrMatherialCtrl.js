angular.module("MainModule").controller("ReestrMatherialCtrl", function ($scope, $http, $q, $modal) {    
    $scope.reestrs = [];
    $scope.transactions = [];
    $scope.current = { reestr: {}, reestrName: {}};
    $scope.showBuildComplete = false;
    
    var dt = new Date();
    $scope.reestrViewDate = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours()+1, 0, 0);

    ///---Просмотр реестра на указанную дату
    $scope.ViewReestr = function () {
        ShowWaiting();
        $.get("/api/reestr/consolidate/" + $scope.reestrViewDate.getFullYear() + "/" + ($scope.reestrViewDate.getMonth()+1) + "/" + $scope.reestrViewDate.getDate() + "/"
             + $scope.reestrViewDate.getHours()).success(function (data) {
            $scope.reestrs = data;
            $scope.$apply();
            HideWaiting();
        });
    }

    ///---
    $scope.FixCommissionDistribution = function () {
        ShowWaiting();
        $.get("https://kiosk.api.liteoffice.net/fixes/fix_commission_distribution").success(function (data) {
            HideWaiting();
        }).error(function (err) {
            var x = err;
            HideWaiting();
        });
    }

    ///---Построение указанного реестра
    $scope.BuildReestr = function (reestrName) {
        ShowWaiting();
        $.get("/api/reestr/build/" + $scope.reestrViewDate.getFullYear() + "/" + ($scope.reestrViewDate.getMonth() + 1) +
            "/" + $scope.reestrViewDate.getDate() + "/" + $scope.reestrViewDate.getHours() + "/" + $scope.reestrViewDate.getMinutes() + "/" + reestrName).success(function () {
                $scope.reestrs = [];
                $scope.transactions = [];
                $scope.current.reestrName = reestrName;
                $scope.$apply();
                HideWaiting();
                LoadReestr();
            });
    }

    $scope.LoadTransactions = function (reestr) {
        $scope.current.reestr = reestr;
        $.get("/api/reestr/matherial/" + reestr.ReestrName + "/" + $scope.reestrViewDate.getFullYear() + "/" + ($scope.reestrViewDate.getMonth() + 1) + "/" + $scope.reestrViewDate.getDate() + "/"
             + $scope.reestrViewDate.getHours()).success(function (data) {
            $scope.transactions = data;
            $scope.$apply();
        });
    }

    $scope.ViewReestr();
});


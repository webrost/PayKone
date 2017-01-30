angular.module("MainModule").controller("NewCommissionCtrl", function ($scope, $modalInstance, $http, $q, $modal, data) {
    $scope.commission = data.commission;

    ///--Отмена
    $scope.cancel = function () {
        $modalInstance.close();
    };

    ///---Сохранение параметров комиссии
    $scope.ok = function () {
        $http.post("/api/commissions/commission", {
            Id: $scope.commission.Id,
            IsPercent: $scope.commission.IsPercent,
            MaxValue: $scope.commission.MaxValue,
            MinValue: $scope.commission.MinValue,
            CommissionValue: $scope.commission.CommissionValue,
            Description: $scope.commission.Description,
            PaymentTargetId: $scope.commission.PaymentTargetId,
            source: $scope.commission.source
        }).success(function () {
            $modalInstance.close();
        });
    };

});

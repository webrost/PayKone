angular.module("MainModule").controller("MyDialogCtrl", function ($scope, $modalInstance, $http, $q, $modal, data) {
    $scope.header = data.Header;
    $scope.message = data.Message;

    $scope.ok = function () {
        $modalInstance.close("ok");
    }

    $scope.cancel = function () {
        $modalInstance.close("cancel");
    }
});

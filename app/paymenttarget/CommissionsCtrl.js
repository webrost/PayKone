angular.module("MainModule").controller("CommissionsCtrl", function ($scope, $http, $q, $modal) {    
    $scope.current = { commission: {}};
    $scope.commissions = [];
    $scope.source = "External";

    
    ///--Загрузка комиссий
    $scope.LoadCommissions = function () {
        ShowWaiting();
        $scope.commissions = [];
        $.get("/api/commissions/" + $scope.source).success(function (data) {
            $scope.commissions = data;
            $scope.$apply();
            HideWaiting();
        });
    }
    $scope.LoadCommissions();


    ///****************************************** Окно редактирования комиссии ***************************************************************
    $scope.EditCommission = function (commission) {
        commission.source = $scope.source;
        var newBoxModal = $modal.open({
            templateUrl: "/Scripts/app/paymenttarget/Modals/NewCommission.tpl.html",
            controller: "NewCommissionCtrl",
            resolve: {
                data: function () {
                    return { commission: commission };
                }
            }
        });
    }

    $scope.DeleteCommission = function(commission)
    {
        $scope.current.commission = commission;
        var confirm = $modal.open({
            templateUrl: "/Scripts/app/dialog/MyDialog.tpl.html",
            controller: "MyDialogCtrl",
            resolve: {
                data: function () {
                    return { Message: "Вы уверены, что хотите удаить запись", Header: "Удаление комиссии"}
                }
            }
        });
        confirm.result.then(function (data) {
            if(data=="ok")
            {
                var index = $scope.commissions.indexOf($scope.current.commission);
                if (index > -1) {
                    $scope.commissions.splice(index, 1);
                }
                $http.post("/api/commissions/delete", $scope.current.commission);
            }
        });
    }

});

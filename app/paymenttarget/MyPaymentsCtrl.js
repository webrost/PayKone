angular.module("MainModule").controller("MyPaymentsCtrl", function ($scope, $http, $q, $modal) {    
    $scope.current = { pti: {}, group: {} };
    $scope.ptis = [];

    ///--Загрузка дерева платежей
    $scope.LoadPaymnetTree = function () {
        $.get("/api/paymentgroups/my").success(function (data) {
            $('#tree').treeview({
                data: data,
                showCheckbox: false,
                onNodeSelected: function (event, node) {
                    $scope.current.group = node;
                    ShowWaiting();
                    $.get("/api/payments/ingroup/" + node.id).success(function (data) {
                        $scope.ptis = data;
                        $scope.$apply();
                        HideWaiting();
                    }).fail(function (error) {
                        var x = error;
                        HideWaiting();
                    });
                }
            });
        });
    }

    $scope.LoadPaymnetTree();

});

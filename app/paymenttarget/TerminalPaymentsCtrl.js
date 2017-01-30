angular.module("MainModule").controller("TerminalPaymentsCtrl", function ($scope, $http, $q, $modal) {    
    $scope.current = { pti: {}, group: {} };
    $scope.ptis = [];
    $scope.terminals = [];
    $scope.current = { terminal: {} };
    $scope.showCheckAll = false;
    $scope.CheckedAction = "";

    ///--Загрузка дерева платежей
    $scope.LoadPaymnetTree = function () {
        $.get("/api/paymentgroups/my").success(function (data) {
            $('#tree').treeview({
                data: data,
                showCheckbox: false,
                onNodeSelected: function (event, node) {
                    if ($scope.current.terminal.Id){
                        $scope.current.group = node;
                        $scope.LoadPaymets();
                    }
                }
            });
        });
    }

    ///--Загрузка платежей
    $scope.LoadPaymets = function () {
        if ($scope.current.group) {
            ShowWaiting();
            $.get("/api/payments/ingrouponterminal/" + $scope.current.group.id + "/" + $scope.current.terminal.Id).success(function (data) {
                $scope.ptis = data;
                $scope.$apply();
                HideWaiting();
            }).fail(function (error) {
                var x = error;
                HideWaiting();
            });
        }
    }

    ///---Выделение/деактивация сервисов на терминале
    $scope.CheckUncheckAction = function () {
        ShowWaiting();
        if($scope.CheckedAction == 'All') {
            $.get("/api/payments/toterminal/addall/" + $scope.current.group.id + "/" + $scope.current.terminal.Id).success(function () {
                $.each($scope.ptis, function (index, item) {
                    item.Checked = true;
                    $("#PTICheckBox_" + item.Id).prop('checked', true);
                });
            });
        }
        if ($scope.CheckedAction == 'None') {
            $.get("/api/payments/toterminal/deleteall/" + $scope.current.group.id + "/" + $scope.current.terminal.Id).success(function () {
                $.each($scope.ptis, function (index, item) {
                    item.Checked = false;
                    $("#PTICheckBox_" + item.Id).prop('checked', false);
                });
            });
        }
        HideWaiting();
    }

    ///---Загрузка списка терминалов
    $scope.LoadTerminals = function () {
        ShowWaiting();
        $.get("/api/terminals/my").success(function (data) {
            $scope.terminals = data;            
            if ($scope.terminals.length > 0) {
                $scope.current.terminal = $scope.terminals[0];
            }
            $scope.$apply();
            HideWaiting();
        });
    }

    ///--Возвращает класс для форматирования записи вида платежа
    $scope.GetPaymentClass = function (pti) {
        if (pti.Child == true) {
            return "ChildPTIClass";
        } else {
            return "";
        }
    }

    ///--Возвращает класс для форматирования записи вида платежа
    $scope.GetPaymentImageClass = function (pti) {
        if (pti.Child == true) {
            return "ChildPTIImageClass";
        } else {
            return "";
        }
    }
    

    ///--Добавляет/удаляет иконку с терминала
    $scope.SelectPayment = function(pti)
    {
        if (pti.Checked)
        {
            $.get("/api/payments/toterminal/add/" + pti.Id + "/" + $scope.current.terminal.Id).success(function () { });
        } else {
            $.get("/api/payments/toterminal/delete/" + pti.Id + "/" + $scope.current.terminal.Id).success(function () { });
        }        
    }

    ///---Выбор текущего терминала
    $scope.SelectTerminal = function (terminal) {
        $scope.current.terminal = terminal;
        $scope.LoadPaymets();
    }

    $scope.LoadTerminals();
    $scope.LoadPaymnetTree();
});

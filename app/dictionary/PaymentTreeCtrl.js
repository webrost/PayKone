angular.module("MainModule").controller("PaymentTreeCtrl", function ($scope, $http, $q, $modal) {
    $scope.groups = [];
    $scope.current = { group: {}, node: {} };
    $scope.GroupHaveChildren = true;
    $scope.CurrentGroupId = -1;
    $scope.HasSelectedGroup = false;

    ///---Получение полной структуры групп платежей
    BuildTree();

    ///---Обнуление текущей группы
    $scope.NewGroup = function()
    {
        $scope.current.group = {};
        $scope.$apply();
    }

    ///---Сохраняет новое наименование группы
    $scope.SaveGroup = function () {
        $.get("api/paymentgroup/save/" + $scope.current.group.id + "/" + $scope.current.group.text).success(function () {
            $scope.current.group = {};
            $scope.HasSelectedGroup = false;
            $scope.$apply();
            BuildTree();
        });
    }

    ///---Удаляет группу терминалов
    $scope.DeleteGroup = function () {
        $.get("api/paymentgroup/delete/" + $scope.current.group.id).success(function () {
            $scope.current.group = {};
            $scope.HasSelectedGroup = false;
            $scope.$apply();
            BuildTree();
        });
    }

    ///---Добавляет группу терминалов
    $scope.AddGroup = function () {
        $.get("api/paymentgroup/new/" + $scope.CurrentGroupId + "/" + $scope.current.group.text).success(function () {
            $scope.current.group = {};
            $scope.HasSelectedGroup = false;
            $scope.$apply();
            BuildTree();
        });
    }

    ///---Проверка на возможность удаления группы
    $scope.AllowDelete = function () {
        var allow = !$scope.GroupHaveChildren && ($scope.current.group.id >0);
        return allow;
    }

    ///---Построение и отображение группы терминалов
    function BuildTree()
    {
        ShowWaiting();
        $.get("/api/paymentgroup/all").success(function (data) {
            $('#tree').treeview({
                data: data,
                showCheckbox: false,
                onNodeSelected: onGroupSelect
            });
            HideWaiting();
        });
    }

    ///---Функция вызывается при выделении узла
    function onGroupSelect(event, node)
    {
        ShowWaiting();
        $.get("/api/paymentgroup/havechild/" + node.id).success(function (haveChildren) {
            $scope.GroupHaveChildren = haveChildren;
            $scope.current.group = node;
            $scope.CurrentGroupId = node.id;
            $scope.HasSelectedGroup = true;
            HideWaiting();
            $scope.$apply();
        });
    }
});

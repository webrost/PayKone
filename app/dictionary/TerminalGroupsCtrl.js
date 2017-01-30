angular.module("MainModule").controller("TerminalGroupsCtrl", function ($scope, $http, $q, $modal) {    
    $scope.groups = [];
    $scope.current = { group: {}, node: {} };
    $scope.GroupHaveChildren = true;
    $scope.CurrentGroupId = -1;

    ///---Получение полной структуры групп терминалов
    BuildTree();

    ///---Обнуление текущей группы
    $scope.NewGroup = function()
    {
        $scope.current.group = {};
        $scope.$apply();
    }

    ///---Сохраняет новое наименование группы
    $scope.SaveGroup = function () {
        $.get("api/terminalgroup/save/" + $scope.current.group.id + "/" + $scope.current.group.text).success(function () {
            $scope.current.group = {};
            $scope.$apply();
            BuildTree();
        });
    }

    ///---Удаляет группу терминалов
    $scope.DeleteGroup = function () {
        $.get("api/terminalgroup/delete/" + $scope.current.group.id).success(function () {
            $scope.current.group = {};
            $scope.$apply();
            BuildTree();
        });
    }

    ///---Добавляет группу терминалов
    $scope.AddGroup = function () {
        $.get("api/terminalgroup/new/" + $scope.CurrentGroupId + "/" + $scope.current.group.text).success(function () {
            $scope.current.group = {};
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
        $.get("/api/terminalgroup/all").success(function (data) {
            $('#tree').treeview({
                data: data,
                showCheckbox: false,
                onNodeSelected: onGroupSelect
            });
        });
    }

    ///---Функция вызывается при выделении узла
    function onGroupSelect(event, node)
    {
        $.get("/api/terminalgroup/havechild/" + node.id).success(function (haveChildren) {
            $scope.GroupHaveChildren = haveChildren;
            $scope.current.group = node;
            $scope.CurrentGroupId = node.id;
            $scope.$apply();
        });
    }
});

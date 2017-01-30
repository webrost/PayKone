angular.module("MainModule").controller("MyTerminalsCtrl", function ($scope, $http, $q, $modal) {    
    $scope.current = { user: {}, group: {}, terminal:{} };
    $scope.terminals = [];
    $scope.showEditPanel = false;
    $scope.showDeleteWarning = false;
    $scope.terminalGroups = [];

    ///--Загрузка дерева терминалов
    $scope.LoadTerminalTree = function () {
        $.get("/api/terminalgroup/my").success(function (data) {
            $scope.terminalGroups = [];
            GetFlatGroups(data,"");
            $('#tree').treeview({
                data: data,
                showCheckbox: false,
                onNodeSelected: function (event, node) {
                    $scope.current.group = node;
                    ShowWaiting();
                    $.get("/api/terminals/ingroup/" + node.id).success(function (data) {
                        $scope.terminals = data;
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

    $scope.LoadTerminalTree();

    ///---Выбор терминала для редактирования
    $scope.EditTerminal = function(terminal)
    {
        $scope.showEditPanel = true;
        $scope.current.terminal = terminal;
    }

    ///---Переход на RDP терминала
    $scope.goRdp = function(computerName)
    {
        $.get("/api/terminal/getrdp/" + computerName).success(function (data) {
            window.open(data,"_blank");
        });
    }

    ///---Переход на RDP терминала
    $scope.goWeb = function (terminalId) {
        var password = guid();
        $.get("/api/terminal/installCode/" + terminalId + "/" + password).success(function (url) {
            window.open(url+"/Icons.html?joinCode="+password, "_blank");
        });
    }

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
          s4() + '-' + s4() + s4() + s4();
    }

    ///---Переход на SSH терминала
    $scope.goSsh = function (computerName) {
        $.get("/api/terminal/getssh/" + computerName).success(function (data) {
            window.open(data, "_blank");
        });
    }

    ///---Открывает окно редактирования
    $scope.AddTerminal = function () {
        $scope.showEditPanel = true;
        $scope.current.terminal = {};
    }

    ///---Закрывает окно редактирования
    $scope.CloseEditor = function () {
        $scope.showEditPanel = false;
    }

    ///---Закрывает окно редактирования
    $scope.CloseDeletePanel = function () {
        $scope.showDeleteWarning = false;
    }

    ///---Сохраняет текущий терминал
    $scope.SaveTerminal = function () {
        $.post("/api/terminal/save",$scope.current.terminal).success(function () {
            $scope.showEditPanel = false;
            $.get("/api/terminals/ingroup/" + $scope.current.terminal.GroupId).success(function (data) {
                $scope.terminals = data;
                $scope.$apply();
            }).fail(function (error) {
            });
        });
    }

    ///---Выводит сообщение об удалении терминала
    $scope.DeleteTerminalPanel = function (terminal) {
        $scope.current.terminal = terminal;
        $scope.showDeleteWarning = true;
    }

    ///---Удаление терминала
    $scope.DeleteTerminal = function () {
        $.get("/api/terminal/delete/" + $scope.current.terminal.Id).success(function (data) {
            $scope.showDeleteWarning = false;
            $.get("/api/terminals/ingroup/" + $scope.current.terminal.GroupId).success(function (data) {
                $scope.terminals = data;
                $scope.$apply();
            }).fail(function (error) {
            });
        });
    }

    function GetFlatGroups(data,whitespaces) {
        for(var i = 0; i < data.length; i++)
        {
            $scope.terminalGroups.push({ "id": data[i].id, "text": whitespaces + data[i].text });
            if (data[i].nodes.length > 0) {
                whitespaces += "";
                GetFlatGroups(data[i].nodes, whitespaces);
            }
        }
    }
});

'use strict';

(function (global) {
    // nameObj 存放学校名字，图片通过命名规范动态填入
    var nameArr = [{ group: 'A', teams: ['东北财经大学范德萨范德萨', '大学', '大学'] }, { group: 'B', teams: ['大学', '大学', '大学'] }, { group: 'C', teams: ['大学', '大学', '大学'] }, { group: 'D', teams: ['大学', '大学', '大学'] }, { group: 'E', teams: ['大学', '大学', '大学'] }, { group: 'F', teams: ['大学', '大学', '大学'] }, { group: 'G', teams: ['大学', '大学', '大学'] }, { group: 'H', teams: ['大学', '大学', '大学'] }, { group: 'I', teams: ['大学', '大学', '大学'] }, { group: 'J', teams: ['大学', '大学', '大学'] }, { group: 'K', teams: ['大学', '大学', '大学'] }, { group: 'L', teams: ['大学', '大学', '大学'] }, { group: 'M', teams: ['大学', '大学', '大学'] }, { group: 'N', teams: ['大学', '大学', '大学'] }, { group: 'O', teams: ['大学', '大学', '大学'] }, { group: 'P', teams: ['大学', '大学', '大学'] }];
    // teamArr 首次渲染数据之前生成，用于读取队伍信息，小组赛筛选
    var teamArr = [];
    // 筛选之前所有队伍信息，无分组
    var teamPoolObj = {};
    // roundOneArr 存放首轮出线队伍 id，从 teamArr 中产生，长度 16
    var roundOneArr = [];
    // roundTwoArr 存放第二轮出线队伍 id，长度 8
    var roundTwoArr = [];
    // roundThrArr 存放第三轮出线队伍 id，长度 4
    var roundThrArr = [];
    // roundFurArr 存放第四轮出线队伍 id，长度 2
    var roundFurArr = [];
    // 冠军
    var winner = '';

    // 生成小组赛数据、所有队伍信息、分组信息。渲染小组赛选项
    // 小组赛的赛制和后面几轮有区别，单独写一个函数
    function initData() {
        var radioArr = [];
        var radioStr = '';

        teamArr = nameArr.map(function (item, index) {
            var _radioArr = [];
            var _radioStr = '';

            var groupData = {
                group: item.group,
                team: item.teams.map(function (_it, _in) {
                    var obj = {
                        team: item.group + '-' + _in + '-' + _it,
                        val: item.group + '-' + _in,
                        img: item.group + '-' + _in + '.png',
                        select: false
                    };

                    // 元素拼接
                    _radioArr.push('\n                        <input type="radio" name="' + item.group + '-48" id="' + item.group + '-' + _in + '" value="' + item.group + '-' + _in + '">\n                        <label for="' + item.group + '-' + _in + '" class="one-label">\n                            <div class="one-img"></div>\n                            <p>' + _it + '</p>\n                            <p>' + item.group + '-' + (_in + 1) + '</p>\n                        </label>\n                    ');

                    // 放入队伍池
                    teamPoolObj[item.group + '-' + _in] = obj;
                    return obj;
                })
            };

            _radioStr = _radioArr.join('\n');

            radioArr.push('<div class="one-list_group">\n                    <div class="one-list_title">\n                        <div class="one-list_img" style="background-image: url(../imgs/one-group_' + item.group + '.png)"></div>\n                    </div>\n                </div>\n                <form id="' + item.group + '-48" class="one-form">\n                    ' + _radioStr + '\n                </form>');

            return groupData;
        });

        radioStr = radioArr.join('');
        radioStr = '<div class="one-list">\n            ' + radioStr + '\n        </div>';

        // innerHTML 很暴力
        document.querySelector("#list-one").innerHTML = radioStr;
    }

    // 每个小组三选一，与后面的二选一规则不太一样
    // 第一轮小组赛选择完执行的函数
    function getOneList() {
        // 选中 01 小组赛晋级队伍
        var oneFormArr = document.querySelectorAll("#list-one form");
        // 记录获胜的队伍
        var winTeamArr = [];

        oneFormArr.forEach(function (item, index) {
            var inputArr = item.getElementsByTagName('input');
            var selectRaioId = '';

            [].forEach.call(inputArr, function (_it) {
                if (_it.checked) {
                    selectRaioId = _it.value;
                }
            });

            if (!selectRaioId) {
                // 提示选择完全
                console.log('没有选择完全');

                return;
            } else {
                winTeamArr.push(selectRaioId);
            }
        });

        console.log('全部选择完全');
        // 第一轮选择结束记录组 id 到顶层变量
        roundOneArr = winTeamArr;

        // 渲染 16 进 8 的数据
        generateData(roundOneArr, document.getElementById("list-two"));
    }

    // 后面几轮选出胜者
    function filterList(container) {
        var formArr = container.getElementsByTagName('form');
        var winTeamArr = [];

        [].forEach.call(formArr, function (item, index) {
            var inputArr = item.getElementsByTagName('input');
            var selectRaioId = '';

            [].forEach.call(inputArr, function (_it) {
                if (_it.checked) {
                    selectRaioId = _it.value;
                }
            });

            if (!selectRaioId) {
                // 提示选择完全
                console.log('没有选择完全');

                return;
            } else {
                winTeamArr.push(selectRaioId);
            }
        });

        console.log('全部选择完全');

        return winTeamArr;
    }

    // 从剩 16 支队伍开始，使用生成函数，根据队生成选项，并渲染
    // 后面几轮的函数可以复用
    function generateData(teams, element, tplType) {
        var index = 0;
        var teamObjArr = [];
        var tplArr = [];
        var tplStr = '';

        tplType = tplType || 'two';

        // 按照对阵的顺序存的，每次取两个生成一个对局
        teamObjArr = teams.map(function (item, index) {
            var obj = {};
            var flag = false;

            for (var key in teamPoolObj) {
                if (key == item) {
                    flag = true;
                    obj = teamPoolObj[key];
                }
            }

            if (flag) {
                return obj;
            } else {
                console.log('没有选完全');
            }
        });

        // 渲染
        while (teamObjArr.length > 0) {
            // 选出相邻的两个队
            var teamLeft = teamObjArr.shift();
            var teamRight = teamObjArr.shift();
            var prefix = teamLeft.val[0] + teamRight.val[0];

            switch (tplType) {
                case 'two':
                    tplArr.push('\n                        <form id="' + prefix + '" class="two-form">\n                            <input type="radio" name="' + prefix + '" id="' + prefix + '-0" value="' + teamLeft.val + '">\n                            <label for="' + prefix + '-0" class="two-label two-label_left">\n                                <div class="two-img"></div>\n                                <p class="two-name two-name_left">' + teamLeft.val + '</p>\n                            </label>\n                        \n                            <input type="radio" name="' + prefix + '" id="' + prefix + '-1" value="' + teamRight.val + '">\n                            <label for="' + prefix + '-1" class="two-label two-label_right">\n                                <p class="two-name two-name_right">' + teamRight.val + '</p>\n                                <div class="two-img"></div>\n                            </label>\n                        </form>\n                    ');

                    break;

                case 'fur':
                    tplArr.push('\n                        <form id="' + prefix + '" class="fur-form">\n                            <input type="radio" name="' + prefix + '" id="' + prefix + '-0" value="' + teamLeft.val + '">\n                            <label for="' + prefix + '-0" class="fur-label">\n                                <div class="fur-img"></div>\n                                <p class="fur-name">' + teamLeft.val + '</p>\n                            </label>\n                        \n                            <input type="radio" name="' + prefix + '" id="' + prefix + '-1" value="' + teamRight.val + '">\n                            <label for="' + prefix + '-1" class="fur-label">\n                                <div class="fur-img"></div>\n                                <p class="fur-name">' + teamRight.val + '</p>\n                            </label>\n                        </form>\n                    ');

                    break;

                case 'final':
                    tplArr.push('\n                        <form id="' + prefix + '" class="final-form">\n                            <input type="radio" name="' + prefix + '" id="' + prefix + '-0" value="' + teamLeft.val + '">\n                            <label for="' + prefix + '-0" class="final-label">\n                                <div class="final-img"></div>\n                                <p class="final-name">' + teamLeft.val + '</p>\n                            </label>\n                        \n                            <input type="radio" name="' + prefix + '" id="' + prefix + '-1" value="' + teamRight.val + '">\n                            <label for="' + prefix + '-1" class="final-label">\n                                <div class="final-img"></div>\n                                <p class="final-name">' + teamRight.val + '</p>\n                            </label>\n                        </form>\n                    ');

                    break;

                default:
                    break;
            }
        }

        tplStr = tplArr.join('\n');
        element.innerHTML = tplStr;
    }

    // 生成图片，需要调整一下样式
    function generateImage(src, target) {
        global.html2canvas(src).then(function (canvas) {
            var image = new Image();

            image.src = canvas.toDataURL("image/png");
            target.appendChild(image);
        });
    }

    // 执行首次生成数据
    initData();

    // 导出到全局
    global.getOneList = getOneList;
    global.eightFour = function () {
        roundTwoArr = filterList(document.getElementById("list-two"));
        generateData(roundTwoArr, document.getElementById("list-thr"), 'two');
    };
    global.fourTwo = function () {
        roundThrArr = filterList(document.getElementById("list-thr"));
        generateData(roundThrArr, document.getElementById("list-fur"), 'fur');
    };
    global.twoOne = function () {
        roundFurArr = filterList(document.getElementById("list-fur"));
        generateData(roundFurArr, document.getElementById("list-final"), 'final');
    };
    global.getImg = function () {
        generateImage(document.getElementById("one"), document.getElementById("result"));
    };

    // setTimeout(getImg, 1000);
})(window);
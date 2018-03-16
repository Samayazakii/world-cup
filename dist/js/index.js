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
    var sliderContainer = document.getElementById("slide-container");
    var homeBtn = document.getElementById("home-btn");
    var oneBtn = document.getElementById("one-btn");
    var twoBtn = document.getElementById("two-btn");
    var thrBtn = document.getElementById("thr-btn");
    var furBtn = document.getElementById("fur-btn");
    var finalBtn = document.getElementById("final-btn");

    // 是否可以翻页
    var SLIDE_NEXT = false;

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
        var selectAll = true;

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
                selectAll = false;

                return;
            } else {
                winTeamArr.push(selectRaioId);
            }
        });

        if (!selectAll) {
            SLIDE_NEXT = false;
            alert("请选择完全");

            return;
        } else {
            SLIDE_NEXT = true;
        }

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
        var selectAll = true;

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
                selectAll = false;

                return;
            } else {
                winTeamArr.push(selectRaioId);
            }
        });

        if (!selectAll) {
            SLIDE_NEXT = false;
            alert("请选择完整");

            return;
        }

        SLIDE_NEXT = true;

        if (winTeamArr.length > 1) {
            return winTeamArr;
        } else {
            return winTeamArr[0];
        }
    }

    // 从剩 16 支队伍开始，使用生成函数，根据队生成选项，并渲染
    // 后面几轮的函数可以复用
    function generateData(teams, element, tplType) {
        var index = 0;
        var teamObjArr = [];
        var tplArr = [];
        var tplStr = '';
        var selectAll = true;

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
                selectAll = false;
            }
        });

        if (!selectAll) {
            SLIDE_NEXT = false;

            alert("请选择完全");

            return;
        } else {
            SLIDE_NEXT = true;
        }

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

    // 根绝竞猜结果生成排列
    function generateGuess() {
        var share = document.getElementById("share");
        var eightLeft = document.getElementById("share-eight_left");
        var eightRight = document.getElementById("share-eight_right");
        var fourLeft = document.getElementById("share-four_left");
        var fourRight = document.getElementById("share-four_right");
        var twoLeft = document.getElementById("share-two_left");
        var twoRight = document.getElementById("share-two_right");
        var oneLeft = document.getElementById("share-one_left");
        var oneRight = document.getElementById("share-one_right");
        var winnerElement = document.getElementById("share-winner");

        var eightLeftStr = '';
        var eightRightStr = '';
        var fourLeftStr = '';
        var fourRightStr = '';
        var twoLeftStr = '';
        var twoRightStr = '';

        // 左边 8
        for (var i = 0; i < 8; i++) {
            var id = roundOneArr.shift();
            var item = '';

            for (var key in teamPoolObj) {
                if (key == id) {
                    item = teamPoolObj[key];
                }
            }

            eightLeftStr += '\n                <div class="eight-item">\n                    <div class="eight-item_img">' + item.val + '</div>\n                    <div class="eight-item_name">' + item.name + '</div>\n                </div>\n            ';
        }
        eightLeft.innerHTML = eightLeftStr;

        // 右边 8
        for (var _i = 0; _i < 8; _i++) {
            var _id = roundOneArr.shift();
            var _item = '';

            for (var _key in teamPoolObj) {
                if (_key == _id) {
                    _item = teamPoolObj[_key];
                }
            }

            eightRightStr += '\n                <div class="eight-item">\n                    <div class="eight-item_img">' + _item.val + '</div>\n                    <div class="eight-item_name">' + _item.name + '</div>\n                </div>\n            ';
        }
        eightRight.innerHTML = eightRightStr;

        // 左边 4
        for (var _i2 = 0; _i2 < 4; _i2++) {
            var _id2 = roundTwoArr.shift();
            var _item2 = '';

            for (var _key2 in teamPoolObj) {
                if (_key2 == _id2) {
                    _item2 = teamPoolObj[_key2];
                }
            }

            fourLeftStr += '\n                <div class="four-item">\n                    <div class="four-item_img">' + _item2.val + '</div>\n                </div>\n            ';
        }
        fourLeft.innerHTML = fourLeftStr;

        // 右边 4
        for (var _i3 = 0; _i3 < 4; _i3++) {
            var _id3 = roundTwoArr.shift();
            var _item3 = '';

            for (var _key3 in teamPoolObj) {
                if (_key3 == _id3) {
                    _item3 = teamPoolObj[_key3];
                }
            }

            fourRightStr += '\n                <div class="four-item">\n                    <div class="four-item_img">' + _item3.val + '</div>\n                </div>\n            ';
        }
        fourRight.innerHTML = fourRightStr;

        // 左边 2
        for (var _i4 = 0; _i4 < 2; _i4++) {
            var _id4 = roundThrArr.shift();
            var _item4 = '';

            for (var _key4 in teamPoolObj) {
                if (_key4 == _id4) {
                    _item4 = teamPoolObj[_key4];
                }
            }

            twoLeftStr += '\n                <div class="two-item">\n                    <div class="two-item_img">' + _item4.val + '</div>\n                </div>\n            ';
        }
        twoLeft.innerHTML = twoLeftStr;

        // 右边 2
        for (var _i5 = 0; _i5 < 2; _i5++) {
            var _id5 = roundThrArr.shift();
            var _item5 = '';

            for (var _key5 in teamPoolObj) {
                if (_key5 == _id5) {
                    _item5 = teamPoolObj[_key5];
                }
            }

            twoRightStr += '\n                <div class="two-item">\n                    <div class="two-item_img">' + _item5.val + '</div>\n                </div>\n            ';
        }
        twoRight.innerHTML = twoRightStr;

        // 左边 1
        for (var _i6 = 0; _i6 < 1; _i6++) {
            var _id6 = roundFurArr.shift();
            var _item6 = '';

            for (var _key6 in teamPoolObj) {
                if (_key6 == _id6) {
                    _item6 = teamPoolObj[_key6];
                }
            }

            oneLeft.innerHTML = '' + _item6.val;
        }

        // 右边 1
        for (var _i7 = 0; _i7 < 1; _i7++) {
            var _id7 = roundFurArr.shift();
            var _item7 = '';

            for (var _key7 in teamPoolObj) {
                if (_key7 == _id7) {
                    _item7 = teamPoolObj[_key7];
                }
            }

            oneRight.innerHTML = '' + _item7.val;
        }

        // 冠军
        for (var _i8 = 0; _i8 < 1; _i8++) {
            var _id8 = winner;
            var _item8 = '';

            for (var _key8 in teamPoolObj) {
                if (_key8 == _id8) {
                    _item8 = teamPoolObj[_key8];
                }
            }

            winnerElement.innerHTML = '' + _item8.val;
        }
    }

    // 生成图片，需要调整一下样式
    function generateImage(src, target) {
        global.html2canvas(src).then(function (canvas) {
            var image = new Image();
            var qrcode = document.querySelector("#qrcode");

            // html2canvas 对文字和 img 标签的图片做了特殊处理
            // 使用 img 标签会比使用 background-img 更清晰
            image.className = "result-img";
            image.src = canvas.toDataURL("image/png");
            target.appendChild(image);
        });
    }

    // 执行首次生成数据
    initData();

    // 首页 btn
    homeBtn.addEventListener("click", function () {
        sliderContainer.setAttribute("style", '\n            -webkit-transform: translateX(-10rem);\n            transform: translateX(-10rem);\n        ');
    });

    // 01 btn
    oneBtn.addEventListener("click", function () {
        getOneList();

        if (SLIDE_NEXT) {
            sliderContainer.setAttribute("style", '\n                -webkit-transform: translateX(-20rem);\n                transform: translateX(-20rem);\n            ');
        }
    });

    // 02 btn
    twoBtn.addEventListener("click", function () {
        roundTwoArr = filterList(document.getElementById("list-two"));
        generateData(roundTwoArr, document.getElementById("list-thr"), 'two');

        if (SLIDE_NEXT) {
            sliderContainer.setAttribute("style", '\n                -webkit-transform: translateX(-30rem);\n                transform: translateX(-30rem);\n            ');
        }
    });

    // 03 btn
    thrBtn.addEventListener("click", function () {
        roundThrArr = filterList(document.getElementById("list-thr"));
        generateData(roundThrArr, document.getElementById("list-fur"), 'fur');

        if (SLIDE_NEXT) {
            sliderContainer.setAttribute("style", '\n                -webkit-transform: translateX(-40rem);\n                transform: translateX(-40rem);\n            ');
        }
    });

    // 04 btn
    furBtn.addEventListener("click", function () {
        roundFurArr = filterList(document.getElementById("list-fur"));
        generateData(roundFurArr, document.getElementById("list-final"), 'final');

        if (SLIDE_NEXT) {
            sliderContainer.setAttribute("style", '\n                -webkit-transform: translateX(-50rem);\n                transform: translateX(-50rem);\n            ');
        }
    });

    // 05 btn
    finalBtn.addEventListener("click", function () {
        // TODO 这里没选就变成傻逼了
        global.getImg();

        if (SLIDE_NEXT) {
            setTimeout(function () {
                sliderContainer.setAttribute("style", '\n                    -webkit-transform: translateX(-70rem);\n                    transform: translateX(-70rem);\n                ');
            }, 500);
        }
    });

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
        winner = filterList(document.getElementById("list-final"));
        generateGuess();
        generateImage(document.getElementById("share"), document.getElementById("result"));
    };
})(window);
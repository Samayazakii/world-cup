'use strict';

// TODO 弱网环境下的体验 需要修改一下
(function (global) {
    global.onload = function () {
        showToast()('close');
    };

    // nameObj 存放学校名字，图片通过命名规范动态填入
    var nameArr = [{ group: 'A', teams: ['新加坡国立大学', '重庆大学', '西安交通大学'] }, { group: 'B', teams: ['桂林电子科技大学', '香港中文大学', '华北水利水电大学'] }, { group: 'C', teams: ['合肥赛区冠军', '墨尔本大学', '内蒙古科技大学'] }, { group: 'D', teams: ['西安外国语大学', '哈佛大学&耶鲁大学', '福建江夏学院'] }, { group: 'E', teams: ['哈尔滨工程大学', '山西财经大学', '华威大学'] }, { group: 'F', teams: ['国际关系学院', '海南大学', '吉林农业大学'] }, { group: 'G', teams: ['中山大学', '河北大学', '世新大学'] }, { group: 'H', teams: ['国防科技大学', '华侨大学', '艾因夏姆斯大学'] }, { group: 'I', teams: ['东北大学', '吉林财经大学', '东吴大学'] }, { group: 'J', teams: ['兰州理工大学', '云南大学', '北京师范大学'] }, { group: 'K', teams: ['中国人民大学', '澳门城市大学', '山东建筑大学'] }, { group: 'L', teams: ['浙江理工大学', '北京师范大学珠海分校', '马来亚大学'] }, { group: 'M', teams: ['中国民航大学', '爱丁堡大学', '武汉理工大学'] }, { group: 'N', teams: ['四川大学', '待定大学', '清华大学'] }, { group: 'O', teams: ['江西财经大学', '南开大学', '新南威尔士大学'] }, { group: 'P', teams: ['东北财经大学', '加拿大联队', '哈尔滨工业大学（威海）'] }];
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
    var reloadBtn = document.getElementById("info-reload");
    var nextBtn = document.getElementById("info-next");
    var showToast = global.showToast;

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
                        team: '' + _it,
                        val: item.group + '-' + _in,
                        img: item.group + '-' + (_in + 1) + '.png'
                    };

                    // 元素拼接
                    // 现实的分组是从一开始的，数组元素是从 0 开始，有区别
                    _radioArr.push('\n                        <input type="radio" name="' + item.group + '-48" id="' + item.group + '-' + _in + '" value="' + item.group + '-' + _in + '">\n                        <label for="' + item.group + '-' + _in + '" class="one-label">\n                            <div class="one-img" style="background-image: url(\'../imgs/school/' + item.group + '-' + (_in + 1) + '.png\')"></div>\n                            <p>' + _it + '</p>\n                            <p>' + item.group + '-' + (_in + 1) + '</p>\n                        </label>\n                    ');

                    // 放入队伍池
                    teamPoolObj[item.group + '-' + _in] = obj;
                    return obj;
                })
            };

            _radioStr = _radioArr.join('\n');

            // 每个组头部的分界部分
            radioArr.push('<div class="one-list_group">\n                    <div class="one-list_title">\n                        <div class="one-list_img" style="background-image: url(\'../imgs/one-group_' + item.group + '.png\')"></div>\n                    </div>\n                </div>\n                <form id="' + item.group + '-48" class="one-form">\n                    ' + _radioStr + '\n                </form>');

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

            showToast()('warn');

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
            showToast()('warn');

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

            showToast()('warn');

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
                    tplArr.push('\n                        <form id="' + prefix + '" class="two-form">\n                            <input type="radio" name="' + prefix + '" id="' + prefix + '-0" value="' + teamLeft.val + '">\n                            <label for="' + prefix + '-0" class="two-label two-label_left">\n                                <div class="two-img" style="background-image: url(\'../imgs/school/' + teamLeft.img + '\')"></div>\n                                <p class="two-name two-name_left">' + teamLeft.team + '</p>\n                            </label>\n                        \n                            <input type="radio" name="' + prefix + '" id="' + prefix + '-1" value="' + teamRight.val + '">\n                            <label for="' + prefix + '-1" class="two-label two-label_right">\n                                <p class="two-name two-name_right">' + teamRight.team + '</p>\n                                <div class="two-img" style="background-image: url(\'../imgs/school/' + teamRight.img + '\')"></div>\n                            </label>\n                        </form>\n                    ');

                    break;

                case 'fur':
                    tplArr.push('\n                        <form id="' + prefix + '" class="fur-form">\n                            <input type="radio" name="' + prefix + '" id="' + prefix + '-0" value="' + teamLeft.val + '">\n                            <label for="' + prefix + '-0" class="fur-label">\n                                <div class="fur-img" style="background-image: url(\'../imgs/school/' + teamLeft.img + '\')"></div>\n                                <p class="fur-name">' + teamLeft.team + '</p>\n                            </label>\n                        \n                            <input type="radio" name="' + prefix + '" id="' + prefix + '-1" value="' + teamRight.val + '">\n                            <label for="' + prefix + '-1" class="fur-label">\n                                <div class="fur-img" style="background-image: url(\'../imgs/school/' + teamRight.img + '\')"></div>\n                                <p class="fur-name">' + teamRight.team + '</p>\n                            </label>\n                        </form>\n                    ');

                    break;

                case 'final':
                    tplArr.push('\n                        <form id="' + prefix + '" class="final-form">\n                            <input type="radio" name="' + prefix + '" id="' + prefix + '-0" value="' + teamLeft.val + '">\n                            <label for="' + prefix + '-0" class="final-label">\n                                <div class="final-img" style="background-image: url(\'../imgs/school/' + teamLeft.img + '\')"></div>\n                                <p class="final-name">' + teamLeft.team + '</p>\n                            </label>\n                        \n                            <input type="radio" name="' + prefix + '" id="' + prefix + '-1" value="' + teamRight.val + '">\n                            <label for="' + prefix + '-1" class="final-label">\n                                <div class="final-img" style="background-image: url(\'../imgs/school/' + teamRight.img + '\')"></div>\n                                <p class="final-name">' + teamRight.team + '</p>\n                            </label>\n                        </form>\n                    ');

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
            var shortName = '';

            for (var key in teamPoolObj) {
                if (key == id) {
                    item = teamPoolObj[key];
                }
            }

            // html2canvas 不能处理 text-overflow
            if (item.team.length > 8) {
                shortName = item.team.slice(0, 8);
                shortName += '...';
            } else {
                shortName = item.team;
            }

            var elem = document.createElement('div');
            var text = document.createElement('div');
            var img = new Image();

            elem.setAttribute('class', 'eight-item');
            text.setAttribute('class', 'eight-item_name');
            img.setAttribute('class', 'eight-item_img');
            text.innerText = '' + shortName;

            img.src = '../imgs/school/' + item.img;

            img.onload = function () {
                console.log('=== img onload ===');
            };

            elem.appendChild(img);
            elem.appendChild(text);

            eightLeft.appendChild(elem);
        }

        // 右边 8
        for (var _i = 0; _i < 8; _i++) {
            var _id = roundOneArr.shift();
            var _item = '';
            var _shortName = '';

            for (var _key in teamPoolObj) {
                if (_key == _id) {
                    _item = teamPoolObj[_key];
                }
            }

            if (_item.team.length > 8) {
                _shortName = _item.team.slice(0, 8);
                _shortName += '...';
            } else {
                _shortName = _item.team;
            }

            eightRightStr += '\n                <div class="eight-item">\n                    <img class="eight-item_img" src="../imgs/school/' + _item.img + '" />\n                    <div class="eight-item_name">' + _shortName + '</div>\n                </div>\n            ';
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

            fourLeftStr += '\n                <div class="four-item">\n                    <img class="four-item_img" src="../imgs/school/' + _item2.img + '" />\n                </div>\n            ';
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

            fourRightStr += '\n                <div class="four-item">\n                    <img class="four-item_img" src="../imgs/school/' + _item3.img + '" />\n                </div>\n            ';
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

            twoLeftStr += '\n                <div class="two-item">\n                    <img class="two-item_img" src="../imgs/school/' + _item4.img + '" />\n                </div>\n            ';
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

            twoRightStr += '\n                <div class="two-item">\n                    <img class="two-item_img" src="../imgs/school/' + _item5.img + '" />\n                </div>\n            ';
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

            oneLeft.setAttribute('src', '../imgs/school/' + _item6.img);
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

            oneRight.setAttribute('src', '../imgs/school/' + _item7.img);
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

            winnerElement.setAttribute('src', '../imgs/school/' + _item8.img);
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
        var winnerSchool = '';

        winner = filterList(document.getElementById("list-final"));
        generateGuess();

        for (var key in teamPoolObj) {
            if (winner == key) {
                winnerSchool = teamPoolObj[key].team;
            }
        }

        document.getElementById("info-school").innerText = winnerSchool;

        if (SLIDE_NEXT) {
            sliderContainer.setAttribute("style", '\n               -webkit-transform: translateX(-60rem);\n               transform: translateX(-60rem);\n           ');
        }
    });

    // reload btn
    reloadBtn.addEventListener("click", function () {
        window.location.reload();
    });

    // next btn
    nextBtn.addEventListener("click", function () {
        var winnerSchool = '';

        for (var key in teamPoolObj) {
            if (winner == key) {
                winnerSchool = teamPoolObj[key].team;
            }
        }

        // 获取名字和话
        document.getElementById("share-info_school").innerText = winnerSchool;
        document.getElementById("share-info_word").innerText = document.getElementById("info-words").value;
        document.getElementById("share-info_nick").innerText = document.getElementById("info-nick").value;

        global.getImg();

        showToast()();

        if (SLIDE_NEXT) {
            setTimeout(function () {
                showToast()('close');

                sliderContainer.setAttribute("style", '\n                    -webkit-transform: translateX(-70rem);\n                    transform: translateX(-70rem);\n                ');
            }, 10000);
        }
    });

    // 导出到全局
    global.getImg = function () {
        // generateGuess();
        generateImage(document.getElementById("share"), document.getElementById("result"));
    };
    global.showToast = showToast;
})(window);
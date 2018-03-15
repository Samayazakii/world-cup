(function (global) {
    // nameObj 存放学校名字，图片通过命名规范动态填入
    let nameArr = [
        { group: 'A', teams: ['东北财经大学范德萨范德萨', '大学', '大学'] },
        { group: 'B', teams: ['大学', '大学', '大学'] },
        { group: 'C', teams: ['大学', '大学', '大学'] },
        { group: 'D', teams: ['大学', '大学', '大学'] },
        { group: 'E', teams: ['大学', '大学', '大学'] },
        { group: 'F', teams: ['大学', '大学', '大学'] },
        { group: 'G', teams: ['大学', '大学', '大学'] },
        { group: 'H', teams: ['大学', '大学', '大学'] },
        { group: 'I', teams: ['大学', '大学', '大学'] },
        { group: 'J', teams: ['大学', '大学', '大学'] },
        { group: 'K', teams: ['大学', '大学', '大学'] },
        { group: 'L', teams: ['大学', '大学', '大学'] },
        { group: 'M', teams: ['大学', '大学', '大学'] },
        { group: 'N', teams: ['大学', '大学', '大学'] },
        { group: 'O', teams: ['大学', '大学', '大学'] },
        { group: 'P', teams: ['大学', '大学', '大学'] },
    ];
    // teamArr 首次渲染数据之前生成，用于读取队伍信息，小组赛筛选
    let teamArr = [];
    // 筛选之前所有队伍信息，无分组
    let teamPoolObj = {};
    // roundOneArr 存放首轮出线队伍 id，从 teamArr 中产生，长度 16
    let roundOneArr = [];
    // roundTwoArr 存放第二轮出线队伍 id，长度 8
    let roundTwoArr = [];
    // roundThrArr 存放第三轮出线队伍 id，长度 4
    let roundThrArr = [];
    // roundFurArr 存放第四轮出线队伍 id，长度 2
    let roundFurArr = [];
    // 冠军
    let winner = '';

    // 生成小组赛数据、所有队伍信息、分组信息。渲染小组赛选项
    // 小组赛的赛制和后面几轮有区别，单独写一个函数
    function initData() {
        let radioArr = [];
        let radioStr = '';
        
        teamArr = nameArr.map((item, index) => {
            let _radioArr = [];
            let _radioStr = ''
            
            let groupData = {
                group: item.group,
                team: item.teams.map((_it, _in) => {
                    let obj = {
                        team: `${item.group}-${_in}-${_it}`,
                        val: `${item.group}-${_in}`, 
                        img: `${item.group}-${_in}.png`,
                        select: false
                    };
                    
                    // 元素拼接
                    _radioArr.push(`
                        <input type="radio" name="${item.group}-48" id="${item.group}-${_in}" value="${item.group}-${_in}">
                        <label for="${item.group}-${_in}" class="one-label">
                            <div class="one-img"></div>
                            <p>${_it}</p>
                            <p>${item.group}-${_in + 1}</p>
                        </label>
                    `);

                    // 放入队伍池
                    teamPoolObj[`${item.group}-${_in}`] = obj;
                    return obj;
                })
            };

            _radioStr = _radioArr.join('\n');
            
            radioArr.push(`<div class="one-list_group">
                    <div class="one-list_title">
                        <div class="one-list_img" style="background-image: url(../imgs/one-group_${item.group}.png)"></div>
                    </div>
                </div>
                <form id="${item.group}-48" class="one-form">
                    ${_radioStr}
                </form>`);

            return groupData;
        });

        radioStr = radioArr.join('');
        radioStr = `<div class="one-list">
            ${radioStr}
        </div>`;

        // innerHTML 很暴力
        document.querySelector("#list-one").innerHTML = radioStr;
    }

    // 每个小组三选一，与后面的二选一规则不太一样
    // 第一轮小组赛选择完执行的函数
    function getOneList() {
        // 选中 01 小组赛晋级队伍
        let oneFormArr = document.querySelectorAll("#list-one form");
        // 记录获胜的队伍
        let winTeamArr = [];

        oneFormArr.forEach((item, index) => {
            let inputArr = item.getElementsByTagName('input');
            let selectRaioId = '';
            
            [].forEach.call(inputArr, (_it) => {
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
        let formArr = container.getElementsByTagName('form');
        let winTeamArr = [];

        [].forEach.call(formArr, (item, index) => {
            let inputArr = item.getElementsByTagName('input');
            let selectRaioId = '';

            [].forEach.call(inputArr, (_it) => {
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
        let index = 0;
        let teamObjArr = [];
        let tplArr = [];
        let tplStr = '';

        tplType = tplType || 'two';

        // 按照对阵的顺序存的，每次取两个生成一个对局
        teamObjArr = teams.map((item, index) => {
            let obj = {};
            let flag = false;
            
            for (let key in teamPoolObj) {
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
            let teamLeft = teamObjArr.shift();
            let teamRight = teamObjArr.shift();
            let prefix = teamLeft.val[0] + teamRight.val[0]

            switch (tplType) {
                case 'two':
                    tplArr.push(`
                        <form id="${prefix}" class="two-form">
                            <input type="radio" name="${prefix}" id="${prefix}-0" value="${teamLeft.val}">
                            <label for="${prefix}-0" class="two-label two-label_left">
                                <div class="two-img"></div>
                                <p class="two-name two-name_left">${teamLeft.val}</p>
                            </label>
                        
                            <input type="radio" name="${prefix}" id="${prefix}-1" value="${teamRight.val}">
                            <label for="${prefix}-1" class="two-label two-label_right">
                                <p class="two-name two-name_right">${teamRight.val}</p>
                                <div class="two-img"></div>
                            </label>
                        </form>
                    `);
                    
                    break;

                case 'fur':
                    tplArr.push(`
                        <form id="${prefix}" class="fur-form">
                            <input type="radio" name="${prefix}" id="${prefix}-0" value="${teamLeft.val}">
                            <label for="${prefix}-0" class="fur-label">
                                <div class="fur-img"></div>
                                <p class="fur-name">${teamLeft.val}</p>
                            </label>
                        
                            <input type="radio" name="${prefix}" id="${prefix}-1" value="${teamRight.val}">
                            <label for="${prefix}-1" class="fur-label">
                                <div class="fur-img"></div>
                                <p class="fur-name">${teamRight.val}</p>
                            </label>
                        </form>
                    `);

                    break;
                
                case 'final':
                    tplArr.push(`
                        <form id="${prefix}" class="final-form">
                            <input type="radio" name="${prefix}" id="${prefix}-0" value="${teamLeft.val}">
                            <label for="${prefix}-0" class="final-label">
                                <div class="final-img"></div>
                                <p class="final-name">${teamLeft.val}</p>
                            </label>
                        
                            <input type="radio" name="${prefix}" id="${prefix}-1" value="${teamRight.val}">
                            <label for="${prefix}-1" class="final-label">
                                <div class="final-img"></div>
                                <p class="final-name">${teamRight.val}</p>
                            </label>
                        </form>
                    `);

                    break;
                
                default: break;
            }
        }

        tplStr = tplArr.join('\n');
        element.innerHTML = tplStr;
    }
    
    // 生成图片，需要调整一下样式
    function generateImage(src, target) {
        global.html2canvas(src).then(canvas => {
            let image = new Image();
            
            image.src = canvas.toDataURL("image/png");
            target.appendChild(image);
        });
    }

    // 执行首次生成数据
    initData();

    // 导出到全局
    global.getOneList = getOneList;
    global.eightFour = function() {
        roundTwoArr = filterList(document.getElementById("list-two"));
        generateData(roundTwoArr, document.getElementById("list-thr"), 'two');
    }
    global.fourTwo = function() {
        roundThrArr = filterList(document.getElementById("list-thr"));
        generateData(roundThrArr, document.getElementById("list-fur"), 'fur');
    }
    global.twoOne = function() {
        roundFurArr = filterList(document.getElementById("list-fur"));
        generateData(roundFurArr, document.getElementById("list-final"), 'final');
    }
    global.getImg = function() {
        generateImage(document.getElementById("one"), document.getElementById("result"));
    }

    setTimeout(getImg, 1000);
})(window);
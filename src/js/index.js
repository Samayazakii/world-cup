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
    let sliderContainer = document.getElementById("slide-container");
    let homeBtn = document.getElementById("home-btn");
    let oneBtn = document.getElementById("one-btn");
    let twoBtn = document.getElementById("two-btn");
    let thrBtn = document.getElementById("thr-btn");
    let furBtn = document.getElementById("fur-btn");
    let finalBtn = document.getElementById("final-btn");
    
    // 是否可以翻页
    let SLIDE_NEXT = false;

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
        let selectAll = true;

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
        let formArr = container.getElementsByTagName('form');
        let winTeamArr = [];
        let selectAll = true;

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
        let index = 0;
        let teamObjArr = [];
        let tplArr = [];
        let tplStr = '';
        let selectAll = true;

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

    // 根绝竞猜结果生成排列
    function generateGuess() {
        let share = document.getElementById("share");
        let eightLeft = document.getElementById("share-eight_left");
        let eightRight = document.getElementById("share-eight_right");
        let fourLeft = document.getElementById("share-four_left");
        let fourRight = document.getElementById("share-four_right");
        let twoLeft = document.getElementById("share-two_left");
        let twoRight = document.getElementById("share-two_right");
        let oneLeft = document.getElementById("share-one_left");
        let oneRight = document.getElementById("share-one_right");
        let winnerElement = document.getElementById("share-winner");

        let eightLeftStr = '';
        let eightRightStr = '';
        let fourLeftStr = '';
        let fourRightStr = '';
        let twoLeftStr = '';
        let twoRightStr = '';

        // 左边 8
        for (let i = 0; i < 8; i++) {
            let id = roundOneArr.shift();
            let item = '';

            for (let key in teamPoolObj) {
                if (key == id) {
                    item = teamPoolObj[key];
                }
            }

            eightLeftStr += `
                <div class="eight-item">
                    <div class="eight-item_img">${item.val}</div>
                    <div class="eight-item_name">${item.name}</div>
                </div>
            `;
        }
        eightLeft.innerHTML = eightLeftStr;

        // 右边 8
        for (let i = 0; i < 8; i++) {
            let id = roundOneArr.shift();
            let item = '';

            for (let key in teamPoolObj) {
                if (key == id) {
                    item = teamPoolObj[key];
                }
            }

            eightRightStr += `
                <div class="eight-item">
                    <div class="eight-item_img">${item.val}</div>
                    <div class="eight-item_name">${item.name}</div>
                </div>
            `;
        }
        eightRight.innerHTML = eightRightStr;

        // 左边 4
        for (let i = 0; i < 4; i++) {
            let id = roundTwoArr.shift();
            let item = '';

            for (let key in teamPoolObj) {
                if (key == id) {
                    item = teamPoolObj[key];
                }
            }

            fourLeftStr += `
                <div class="four-item">
                    <div class="four-item_img">${item.val}</div>
                </div>
            `;
        }
        fourLeft.innerHTML = fourLeftStr;

        // 右边 4
        for (let i = 0; i < 4; i++) {
            let id = roundTwoArr.shift();
            let item = '';

            for (let key in teamPoolObj) {
                if (key == id) {
                    item = teamPoolObj[key];
                }
            }

            fourRightStr += `
                <div class="four-item">
                    <div class="four-item_img">${item.val}</div>
                </div>
            `;
        }
        fourRight.innerHTML = fourRightStr;

        // 左边 2
        for (let i = 0; i < 2; i++) {
            let id = roundThrArr.shift();
            let item = '';

            for (let key in teamPoolObj) {
                if (key == id) {
                    item = teamPoolObj[key];
                }
            }

            twoLeftStr += `
                <div class="two-item">
                    <div class="two-item_img">${item.val}</div>
                </div>
            `;
        }
        twoLeft.innerHTML = twoLeftStr;

        // 右边 2
        for (let i = 0; i < 2; i++) {
            let id = roundThrArr.shift();
            let item = '';

            for (let key in teamPoolObj) {
                if (key == id) {
                    item = teamPoolObj[key];
                }
            }

            twoRightStr += `
                <div class="two-item">
                    <div class="two-item_img">${item.val}</div>
                </div>
            `;
        }
        twoRight.innerHTML = twoRightStr;

        // 左边 1
        for (let i = 0; i < 1; i++) {
            let id = roundFurArr.shift();
            let item = '';

            for (let key in teamPoolObj) {
                if (key == id) {
                    item = teamPoolObj[key];
                }
            }

            oneLeft.innerHTML = `${item.val}`;
        }
        

        // 右边 1
        for (let i = 0; i < 1; i++) {
            let id = roundFurArr.shift();
            let item = '';

            for (let key in teamPoolObj) {
                if (key == id) {
                    item = teamPoolObj[key];
                }
            }

            oneRight.innerHTML = `${item.val}`;
        }

        // 冠军
        for (let i = 0; i < 1; i++) {
            let id = winner;
            let item = '';

            for (let key in teamPoolObj) {
                if (key == id) {
                    item = teamPoolObj[key];
                }
            }

            winnerElement.innerHTML = `${item.val}`;
        }
    }

    // 生成图片，需要调整一下样式
    function generateImage(src, target) {
        global.html2canvas(src).then(canvas => {
            let image = new Image();
            let qrcode = document.querySelector("#qrcode");

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
        sliderContainer.setAttribute("style", `
            -webkit-transform: translateX(-10rem);
            transform: translateX(-10rem);
        `);
    });

    // 01 btn
    oneBtn.addEventListener("click", function () {
        getOneList();
        
        if (SLIDE_NEXT) {
            sliderContainer.setAttribute("style", `
                -webkit-transform: translateX(-20rem);
                transform: translateX(-20rem);
            `);
        }
    });

    // 02 btn
    twoBtn.addEventListener("click", function () {
        roundTwoArr = filterList(document.getElementById("list-two"));
        generateData(roundTwoArr, document.getElementById("list-thr"), 'two');
        
        if (SLIDE_NEXT) {
            sliderContainer.setAttribute("style", `
                -webkit-transform: translateX(-30rem);
                transform: translateX(-30rem);
            `);
        }
    });

    // 03 btn
    thrBtn.addEventListener("click", function () {
        roundThrArr = filterList(document.getElementById("list-thr"));
        generateData(roundThrArr, document.getElementById("list-fur"), 'fur');
        
        if (SLIDE_NEXT) {
             sliderContainer.setAttribute("style", `
                -webkit-transform: translateX(-40rem);
                transform: translateX(-40rem);
            `);
        }
    });

    // 04 btn
    furBtn.addEventListener("click", function () {
        roundFurArr = filterList(document.getElementById("list-fur"));
        generateData(roundFurArr, document.getElementById("list-final"), 'final');

        if (SLIDE_NEXT) {
             sliderContainer.setAttribute("style", `
                -webkit-transform: translateX(-50rem);
                transform: translateX(-50rem);
            `);
        }
    });

    // 05 btn
    finalBtn.addEventListener("click", function () {
        // TODO 这里没选就变成傻逼了
        global.getImg();
        
        if (SLIDE_NEXT) {
            setTimeout(() => {
                sliderContainer.setAttribute("style", `
                    -webkit-transform: translateX(-70rem);
                    transform: translateX(-70rem);
                `);
            }, 500);
        }
    });

    // 导出到全局
    global.getOneList = getOneList;
    global.eightFour = function() {
        roundTwoArr = filterList(document.getElementById("list-two"));
        generateData(roundTwoArr, document.getElementById("list-thr"), 'two');
    };
    global.fourTwo = function() {
        roundThrArr = filterList(document.getElementById("list-thr"));
        generateData(roundThrArr, document.getElementById("list-fur"), 'fur');
    };
    global.twoOne = function() {
        roundFurArr = filterList(document.getElementById("list-fur"));
        generateData(roundFurArr, document.getElementById("list-final"), 'final');
    };
    global.getImg = function() {
        winner = filterList(document.getElementById("list-final"));
        generateGuess();
        generateImage(document.getElementById("share"), document.getElementById("result"));
    };
})(window);
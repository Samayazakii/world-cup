"use strict";!function(r){r.onload=function(){f()("close")};var a,e,t=[{group:"A",teams:["新加坡国立大学","重庆大学","西安交通大学"]},{group:"B",teams:["桂林电子科技大学","香港中文大学","华北水利水电大学"]},{group:"C",teams:["合肥赛区冠军","墨尔本大学","内蒙古科技大学"]},{group:"D",teams:["西安外国语大学","哈佛大学&耶鲁大学","福建江夏学院"]},{group:"E",teams:["哈尔滨工程大学","山西财经大学","华威大学"]},{group:"F",teams:["国际关系学院","海南大学","吉林农业大学"]},{group:"G",teams:["中山大学","河北大学","世新大学"]},{group:"H",teams:["国防科技大学","华侨大学","艾因夏姆斯大学"]},{group:"I",teams:["东北大学","吉林财经大学","东吴大学"]},{group:"J",teams:["兰州理工大学","云南大学","北京师范大学"]},{group:"K",teams:["中国人民大学","澳门城市大学","山东建筑大学"]},{group:"L",teams:["浙江理工大学","北京师范大学珠海分校","马来亚大学"]},{group:"M",teams:["中国民航大学","爱丁堡大学","武汉理工大学"]},{group:"N",teams:["四川大学","莫斯科国际关系学院","清华大学"]},{group:"O",teams:["江西财经大学","南开大学","新南威尔士大学"]},{group:"P",teams:["东北财经大学","加拿大联队","哈尔滨工业大学（威海）"]}],X={},L=[],P=[],x=[],j=[],N="",i=document.getElementById("slide-container"),n=document.getElementById("home-btn"),o=document.getElementById("one-btn"),l=document.getElementById("two-btn"),s=document.getElementById("thr-btn"),m=document.getElementById("fur-btn"),c=document.getElementById("final-btn"),u=document.getElementById("info-reload"),d=document.getElementById("info-next"),f=r.showToast,g=!1;function p(e){var t=e.getElementsByTagName("form"),i=[],a=!0;return[].forEach.call(t,function(e,t){var n=e.getElementsByTagName("input"),r="";[].forEach.call(n,function(e){e.checked&&(r=e.value)}),r?i.push(r):a=!1}),a?(g=!0,1<i.length?i:i[0]):(g=!1,void f()("warn"))}function h(e,t,n){var r,i=[],a=[],o=!0;if(n=n||"two",i=e.map(function(e,t){var n={},r=!1;for(var i in X)i==e&&(r=!0,n=X[i]);if(r)return n;o=!1}),!o)return g=!1,void f()("warn");for(g=!0;0<i.length;){var l=i.shift(),s=i.shift(),m=l.val[0]+s.val[0];switch(n){case"two":a.push('\n                        <form id="'+m+'" class="two-form">\n                            <input type="radio" name="'+m+'" id="'+m+'-0" value="'+l.val+'">\n                            <label for="'+m+'-0" class="two-label two-label_left">\n                                <div class="two-img" style="background-image: url(\'../imgs/school/'+l.img+'\')"></div>\n                                <p class="two-name two-name_left">'+l.team+'</p>\n                            </label>\n                        \n                            <input type="radio" name="'+m+'" id="'+m+'-1" value="'+s.val+'">\n                            <label for="'+m+'-1" class="two-label two-label_right">\n                                <p class="two-name two-name_right">'+s.team+'</p>\n                                <div class="two-img" style="background-image: url(\'../imgs/school/'+s.img+"')\"></div>\n                            </label>\n                        </form>\n                    ");break;case"fur":a.push('\n                        <form id="'+m+'" class="fur-form">\n                            <input type="radio" name="'+m+'" id="'+m+'-0" value="'+l.val+'">\n                            <label for="'+m+'-0" class="fur-label">\n                                <div class="fur-img" style="background-image: url(\'../imgs/school/'+l.img+'\')"></div>\n                                <p class="fur-name">'+l.team+'</p>\n                            </label>\n                        \n                            <input type="radio" name="'+m+'" id="'+m+'-1" value="'+s.val+'">\n                            <label for="'+m+'-1" class="fur-label">\n                                <div class="fur-img" style="background-image: url(\'../imgs/school/'+s.img+'\')"></div>\n                                <p class="fur-name">'+s.team+"</p>\n                            </label>\n                        </form>\n                    ");break;case"final":a.push('\n                        <form id="'+m+'" class="final-form">\n                            <input type="radio" name="'+m+'" id="'+m+'-0" value="'+l.val+'">\n                            <label for="'+m+'-0" class="final-label">\n                                <div class="final-img" style="background-image: url(\'../imgs/school/'+l.img+'\')"></div>\n                                <p class="final-name">'+l.team+'</p>\n                            </label>\n                        \n                            <input type="radio" name="'+m+'" id="'+m+'-1" value="'+s.val+'">\n                            <label for="'+m+'-1" class="final-label">\n                                <div class="final-img" style="background-image: url(\'../imgs/school/'+s.img+'\')"></div>\n                                <p class="final-name">'+s.team+"</p>\n                            </label>\n                        </form>\n                    ")}}r=a.join("\n"),t.innerHTML=r}a=[],e="",t.map(function(r,e){var t,i=[],n={group:r.group,team:r.teams.map(function(e,t){var n={team:""+e,val:r.group+"-"+t,img:r.group+"-"+(t+1)+".png"};return i.push('\n                        <input type="radio" name="'+r.group+'-48" id="'+r.group+"-"+t+'" value="'+r.group+"-"+t+'">\n                        <label for="'+r.group+"-"+t+'" class="one-label">\n                            <div class="one-img" style="background-image: url(\'../imgs/school/'+r.group+"-"+(t+1)+".png')\"></div>\n                            <p>"+e+"</p>\n                            <p>"+r.group+"-"+(t+1)+"</p>\n                        </label>\n                    "),X[r.group+"-"+t]=n})};return t=i.join("\n"),a.push('<div class="one-list_group">\n                    <div class="one-list_title">\n                        <div class="one-list_img" style="background-image: url(\'../imgs/one-group_'+r.group+'.png\')"></div>\n                    </div>\n                </div>\n                <form id="'+r.group+'-48" class="one-form">\n                    '+t+"\n                </form>"),n}),e='<div class="one-list">\n            '+(e=a.join(""))+"\n        </div>",document.querySelector("#list-one").innerHTML=e,n.addEventListener("click",function(){i.setAttribute("style","\n            -webkit-transform: translateX(-10rem);\n            transform: translateX(-10rem);\n        ")}),o.addEventListener("click",function(){!function(){var e=document.querySelectorAll("#list-one form"),i=[],a=!0;if(e.forEach(function(e,t){var n=e.getElementsByTagName("input"),r="";[].forEach.call(n,function(e){e.checked&&(r=e.value)}),r?i.push(r):a=!1}),!a)return g=!1,f()("warn");g=!0,h(L=i,document.getElementById("list-two"))}(),g&&i.setAttribute("style","\n                -webkit-transform: translateX(-20rem);\n                transform: translateX(-20rem);\n            ")}),l.addEventListener("click",function(){(P=p(document.getElementById("list-two")))||0<P.length?h(P,document.getElementById("list-thr"),"two"):f()("warn"),g&&i.setAttribute("style","\n                -webkit-transform: translateX(-30rem);\n                transform: translateX(-30rem);\n            ")}),s.addEventListener("click",function(){(x=p(document.getElementById("list-thr")))||0<x.length?h(x,document.getElementById("list-fur"),"fur"):f()("warn"),g&&i.setAttribute("style","\n                -webkit-transform: translateX(-40rem);\n                transform: translateX(-40rem);\n            ")}),m.addEventListener("click",function(){(j=p(document.getElementById("list-fur")))||0<j.length?h(j,document.getElementById("list-final"),"final"):f()("warn"),g&&i.setAttribute("style","\n                -webkit-transform: translateX(-50rem);\n                transform: translateX(-50rem);\n            ")}),c.addEventListener("click",function(){var e="";if(N=p(document.getElementById("list-final"))){for(var t in function(){var n=[],r=[],i=[],a=[],e=document.createDocumentFragment();L.forEach(function(e,t){e==N?n.push(!0):n.push(!1)}),P.forEach(function(e,t){e==N?r.push(two):r.push(!1)}),x.forEach(function(e,t){e==N?i.push(!0):i.push(!1)}),j.forEach(function(e,t){e==N?a.push(!0):a.push(!1)});var t=document.createElement("div"),o=document.createElement("div"),l=document.createElement("div"),s=document.createElement("div"),m=document.createElement("div"),c=document.createElement("div"),u=document.createElement("div"),d=document.createElement("div");t.setAttribute("class","share-line-line-eight_left"),o.setAttribute("class","share-line-line-eight_right"),l.setAttribute("class","share-line-line-four_left"),s.setAttribute("class","share-line-line-four_right"),m.setAttribute("class","share-line-line-two_left"),c.setAttribute("class","share-line-line-two_right"),u.setAttribute("class","share-line-line-one_left"),d.setAttribute("class","share-line-line-one_right");for(var f=0;f<8;f++){var g=document.createElement("div");g.setAttribute("class","share-line-line-eight_item"),n[f]||g.setAttribute("style","opacity: 0"),t.appendChild(g)}for(var p=8;p<16;p++){var h=document.createElement("div");h.setAttribute("class","share-line-line-eight_item"),n[p]||h.setAttribute("style","opacity: 0"),o.appendChild(h)}for(var v=0;v<4;v++){var b=document.createElement("div");b.setAttribute("class","share-line-line-four_item"),r[v]||b.setAttribute("style","opacity: 0"),l.appendChild(b)}for(var y=4;y<8;y++){var E=document.createElement("div");E.setAttribute("class","share-line-line-four_item"),r[y]||E.setAttribute("style","opacity: 0"),s.appendChild(E)}for(var w=0;w<2;w++){var A=document.createElement("div");A.setAttribute("class","share-line-line-two_item"),i[w]||A.setAttribute("style","opacity: 0"),m.appendChild(A)}for(var I=2;I<4;I++){var B=document.createElement("div");B.setAttribute("class","share-line-line-two_item"),i[I]||B.setAttribute("style","opacity: 0"),c.appendChild(B)}a[0]?d.setAttribute("style","opacity: 0"):u.setAttribute("style","opacity: 0"),e.appendChild(t),e.appendChild(o),e.appendChild(l),e.appendChild(s),e.appendChild(m),e.appendChild(c),e.appendChild(u),e.appendChild(d),document.getElementById("share-line").appendChild(e)}(),function(){document.getElementById("share");var s=document.getElementById("share-eight_left"),m=document.getElementById("share-eight_right"),o=document.getElementById("share-four_left"),l=document.getElementById("share-four_right"),c=document.getElementById("share-two_left"),u=document.getElementById("share-two_right"),e=document.getElementById("share-one_left"),t=document.getElementById("share-one_right"),n=document.getElementById("share-winner"),d=[],r=document.getElementById("share-bg");r.src="../imgs/share-bg.png",d.push(new Promise(function(e,t){r.onload=function(){console.log("onload"),e()},r.onerror=function(){e()}}));for(var i=function(e){var t=L.shift(),n="",r="";for(var i in X)i==t&&(n=X[i]);8<n.team.length?(r=n.team.slice(0,8),r+="..."):r=n.team;var a=document.createElement("div"),o=document.createElement("div"),l=new Image;a.setAttribute("class","eight-item"),o.setAttribute("class","eight-item_name"),l.setAttribute("class","eight-item_img"),o.innerText=""+r,l.src="../imgs/school/"+n.img,a.appendChild(l),a.appendChild(o),s.appendChild(a),d.push(new Promise(function(e,t){l.onload=function(){e()},l.onerror=function(){e()}}))},a=0;a<8;a++)i();var f=function(e){var t=L.shift(),n="",r="";for(var i in X)i==t&&(n=X[i]);8<n.team.length?(r=n.team.slice(0,8),r+="..."):r=n.team;var a=document.createElement("div"),o=document.createElement("div"),l=new Image;a.setAttribute("class","eight-item"),o.setAttribute("class","eight-item_name"),l.setAttribute("class","eight-item_img"),o.innerText=""+r,l.src="../imgs/school/"+n.img,a.appendChild(l),a.appendChild(o),m.appendChild(a),d.push(new Promise(function(e,t){l.onload=function(){e()},l.onerror=function(){e()}}))};for(a=0;a<8;a++)f();var g=function(e){var t=P.shift(),n="";for(var r in X)r==t&&(n=X[r]);var i=document.createElement("div"),a=new Image;i.setAttribute("class","four-item"),a.setAttribute("class","four-item_img"),a.src="../imgs/school/"+n.img,i.appendChild(a),o.appendChild(i),d.push(new Promise(function(e,t){a.onload=function(){e()},a.onerror=function(){e()}}))};for(a=0;a<4;a++)g();var p=function(e){var t=P.shift(),n="";for(var r in X)r==t&&(n=X[r]);var i=document.createElement("div"),a=new Image;i.setAttribute("class","four-item"),a.setAttribute("class","four-item_img"),a.src="../imgs/school/"+n.img,i.appendChild(a),l.appendChild(i),d.push(new Promise(function(e,t){a.onload=function(){e()},a.onerror=function(){e()}}))};for(a=0;a<4;a++)p();var h=function(e){var t=x.shift(),n="";for(var r in X)r==t&&(n=X[r]);var i=document.createElement("div"),a=new Image;i.setAttribute("class","two-item"),a.setAttribute("class","two-item_img"),a.src="../imgs/school/"+n.img,i.appendChild(a),c.appendChild(i),d.push(new Promise(function(e,t){a.onload=function(){e()},a.onerror=function(){e()}}))};for(a=0;a<2;a++)h();var v=function(e){var t=x.shift(),n="";for(var r in X)r==t&&(n=X[r]);var i=document.createElement("div"),a=new Image;i.setAttribute("class","two-item"),a.setAttribute("class","two-item_img"),a.src="../imgs/school/"+n.img,i.appendChild(a),u.appendChild(i),d.push(new Promise(function(e,t){a.onload=function(){e()},a.onerror=function(){e()}}))};for(a=0;a<2;a++)v();for(a=0;a<1;a++){var b=j.shift(),y="";for(var E in X)E==b&&(y=X[E]);e.setAttribute("src","../imgs/school/"+y.img)}for(var w=0;w<1;w++){var A=j.shift(),I="";for(var B in X)B==A&&(I=X[B]);t.setAttribute("src","../imgs/school/"+I.img)}for(var _=0;_<1;_++){var C=N,k="";for(var T in X)T==C&&(k=X[T]);n.setAttribute("src","../imgs/school/"+k.img)}Promise.all(d).then(function(){console.log("promise all")})}(),r.ajax({type:"post",url:"//multi.hjls.org/group",data:{group:N},timeOut:5e3}),X)N==t&&(e=X[t].team);document.getElementById("info-school").innerText=e,g&&i.setAttribute("style","\n               -webkit-transform: translateX(-60rem);\n               transform: translateX(-60rem);\n           ")}else f()("warn")}),u.addEventListener("click",function(){window.location.reload()}),d.addEventListener("click",function(){var e="";for(var t in X)N==t&&(e=X[t].team);document.getElementById("share-info_school").innerText=e,document.getElementById("share-info_word").innerText=document.getElementById("info-words").value,document.getElementById("share-info_nick").innerText=document.getElementById("info-nick").value,r.getImg(),f()("wait")}),r.getImg=function(){var e,n;e=document.getElementById("share"),n=document.getElementById("result"),r.html2canvas(e).then(function(e){var t=new Image;document.querySelector("#qrcode"),t.className="result-img",t.src=e.toDataURL("image/png"),n.appendChild(t)}).then(function(){g&&setTimeout(function(){f()("close"),i.setAttribute("style","\n                        -webkit-transform: translateX(-70rem);\n                        transform: translateX(-70rem);\n                    ")},1e3)})},r.showToast=f}(window);
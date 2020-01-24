(function(e){function t(t){for(var n,i,s=t[0],u=t[1],l=t[2],f=0,d=[];f<s.length;f++)i=s[f],Object.prototype.hasOwnProperty.call(o,i)&&o[i]&&d.push(o[i][0]),o[i]=0;for(n in u)Object.prototype.hasOwnProperty.call(u,n)&&(e[n]=u[n]);c&&c(t);while(d.length)d.shift()();return a.push.apply(a,l||[]),r()}function r(){for(var e,t=0;t<a.length;t++){for(var r=a[t],n=!0,s=1;s<r.length;s++){var u=r[s];0!==o[u]&&(n=!1)}n&&(a.splice(t--,1),e=i(i.s=r[0]))}return e}var n={},o={app:0},a=[];function i(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,i),r.l=!0,r.exports}i.m=e,i.c=n,i.d=function(e,t,r){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(i.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)i.d(r,n,function(t){return e[t]}.bind(null,n));return r},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="/xknx-configuration-importer/";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],u=s.push.bind(s);s.push=t,s=s.slice();for(var l=0;l<s.length;l++)t(s[l]);var c=u;a.push([0,"chunk-vendors"]),r()})({0:function(e,t,r){e.exports=r("cd49")},"034f":function(e,t,r){"use strict";var n=r("64a9"),o=r.n(n);o.a},1:function(e,t){},2:function(e,t){},"64a9":function(e,t,r){},cd49:function(e,t,r){"use strict";r.r(t);r("cadf"),r("551c"),r("f751"),r("097d");var n=r("2b0e"),o=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{attrs:{id:"app"}},[r("ConfigurationImporter",{attrs:{msg:"Welcome to Your xKnx Configuration importer"}})],1)},a=[],i=r("d225"),s=r("308d"),u=r("6bb5"),l=r("4e2b"),c=r("9ab4"),f=r("60a3"),d=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"container"},[r("div",{staticClass:"large-12 medium-12 small-12 cell"},[r("label",[e._v("File\n      "),r("input",{ref:"file",attrs:{type:"file",id:"file"},on:{change:function(t){return e.handleFileUpload()}}})]),r("button",{on:{click:function(t){return e.convert()}}},[e._v("Submit")])])])},p=[],v=(r("a481"),r("ac4d"),r("8a81"),r("7514"),r("96cf"),r("3b8d")),h=(r("ac6a"),r("456d"),r("b0b4")),g=r("7c39"),y=r.n(g),b=r("651e"),m=r("083c").parseString,x=function(e){function t(){var e;return Object(i["a"])(this,t),e=Object(s["a"])(this,Object(u["a"])(t).apply(this,arguments)),e.groupAddresses=[],e}return Object(l["a"])(t,e),Object(h["a"])(t,[{key:"handleFileUpload",value:function(){this.file=this.$refs.file.files[0]}},{key:"resetXknx",value:function(){this.xknx={general:{own_address:"1.1.132"},groups:{climate:{},cover:{},light:{},sensor:{},binary_sensor:{},switch:{},time:{"General.Time":"9/0/1"}}}}},{key:"exportXKNX",value:function(){for(var e=0,t=Object.keys(this.xknx.groups);e<t.length;e++){var r=t[e];0==Object.keys(this.xknx.groups[r]).length&&delete this.xknx.groups[r]}var n=b.safeDump(this.xknx);this.download("xknx.yaml",n),console.log(n)}},{key:"convert",value:function(){var e=Object(v["a"])(regeneratorRuntime.mark((function e(){var t,r,n,o,a,i,s,u,l,c,f,d,p,v,h,g,b,x,k,_,O,w;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(this.resetXknx(),void 0!=this.file){e.next=3;break}return e.abrupt("return");case 3:return e.next=5,y.a.loadAsync(this.file);case 5:if(t=e.sent,r=Object.keys(t.files).find((function(e){return-1!=e.indexOf("0.xml")})),void 0!=r){e.next=9;break}return e.abrupt("return");case 9:return e.next=11,t.file(r).async("text");case 11:return n=e.sent,e.next=14,new Promise((function(e,t){m(n,(function(r,n){r&&t(r),e(n)}))}));case 14:if(o=e.sent,void 0!=o&&void 0!=o.KNX&&void 0!=o.KNX.Project){e.next=17;break}return e.abrupt("return");case 17:a=!0,i=!1,s=void 0,e.prev=20,u=o.KNX.Project[Symbol.iterator]();case 22:if(a=(l=u.next()).done){e.next=70;break}c=l.value,f=!0,d=!1,p=void 0,e.prev=27,v=c.Installations[Symbol.iterator]();case 29:if(f=(h=v.next()).done){e.next=53;break}for(g=h.value,b=!0,x=!1,k=void 0,e.prev=34,_=g.Installation[Symbol.iterator]();!(b=(O=_.next()).done);b=!0)w=O.value,this.parseInstallation(w);e.next=42;break;case 38:e.prev=38,e.t0=e["catch"](34),x=!0,k=e.t0;case 42:e.prev=42,e.prev=43,b||null==_.return||_.return();case 45:if(e.prev=45,!x){e.next=48;break}throw k;case 48:return e.finish(45);case 49:return e.finish(42);case 50:f=!0,e.next=29;break;case 53:e.next=59;break;case 55:e.prev=55,e.t1=e["catch"](27),d=!0,p=e.t1;case 59:e.prev=59,e.prev=60,f||null==v.return||v.return();case 62:if(e.prev=62,!d){e.next=65;break}throw p;case 65:return e.finish(62);case 66:return e.finish(59);case 67:a=!0,e.next=22;break;case 70:e.next=76;break;case 72:e.prev=72,e.t2=e["catch"](20),i=!0,s=e.t2;case 76:e.prev=76,e.prev=77,a||null==u.return||u.return();case 79:if(e.prev=79,!i){e.next=82;break}throw s;case 82:return e.finish(79);case 83:return e.finish(76);case 84:this.exportXKNX();case 85:case"end":return e.stop()}}),e,this,[[20,72,76,84],[27,55,59,67],[34,38,42,50],[43,,45,49],[60,,62,66],[77,,79,83]])})));function t(){return e.apply(this,arguments)}return t}()},{key:"parseInstallation",value:function(e){var t=!0,r=!1,n=void 0;try{for(var o,a=e.Locations[Symbol.iterator]();!(t=(o=a.next()).done);t=!0){var i=o.value;if(i.Space){var s=!0,u=!1,l=void 0;try{for(var c,f=i.Space[Symbol.iterator]();!(s=(c=f.next()).done);s=!0){var d=c.value;this.groupAddresses=e.GroupAddresses[0].GroupRanges[0].GroupRange.map((function(e){return(e.GroupRange||[]).map((function(e){return e.GroupAddress||[]}))})).reduce((function(e,t){return e.concat(t)}),[]).reduce((function(e,t){return e.concat(t)}),[]),this.parseSpace(d,"")}}catch(p){u=!0,l=p}finally{try{s||null==f.return||f.return()}finally{if(u)throw l}}}}}catch(p){r=!0,n=p}finally{try{t||null==a.return||a.return()}finally{if(r)throw n}}}},{key:"parseSpace",value:function(e,t){if(-1==["Building","BuildingPart"].indexOf(e["$"].Type)&&(t+=(t.length?".":"")+e["$"].Name),e.Space){var r=!0,n=!1,o=void 0;try{for(var a,i=e.Space[Symbol.iterator]();!(r=(a=i.next()).done);r=!0){var s=a.value;this.parseSpace(s,t)}}catch(v){n=!0,o=v}finally{try{r||null==i.return||i.return()}finally{if(n)throw o}}}if(e.Function){var u=!0,l=!1,c=void 0;try{for(var f,d=e.Function[Symbol.iterator]();!(u=(f=d.next()).done);u=!0){var p=f.value;this.parseFunction(p,t)}}catch(v){l=!0,c=v}finally{try{u||null==d.return||d.return()}finally{if(l)throw c}}}}},{key:"parseFunction",value:function(e,t){if(t+="."+e["$"].Name,void 0!=e.GroupAddressRef)switch(e["$"].Type){case"FT-0":break;case"FT-1":this.parseSwitchableLight(e.GroupAddressRef,t);break;case"FT-6":this.parseDimmableLight(e.GroupAddressRef,t);break;case"FT-7":this.parseScreen(e.GroupAddressRef,t);break;case"FT-9":this.parseClimate(e.GroupAddressRef,t);break}}},{key:"parseSwitchableLight",value:function(e,t){t=this.cleanTopologyString(t);var r={},n=!0,o=!1,a=void 0;try{for(var i,s=e[Symbol.iterator]();!(n=(i=s.next()).done);n=!0){var u=i.value,l=this.getGroupAddress(u);"SwitchOnOff"==u["$"].Role?r.group_address_switch=l:"InfoOnOff"==u["$"].Role&&(r.group_address_switch_state=l)}}catch(c){o=!0,a=c}finally{try{n||null==s.return||s.return()}finally{if(o)throw a}}Object.keys(r).length>0&&(this.xknx.groups.light[t]=r)}},{key:"parseDimmableLight",value:function(e,t){t=this.cleanTopologyString(t);var r={},n=!0,o=!1,a=void 0;try{for(var i,s=e[Symbol.iterator]();!(n=(i=s.next()).done);n=!0){var u=i.value,l=this.getGroupAddress(u),c=u["$"].Role;"SwitchOnOff"==c?r.group_address_switch=l:"InfoOnOff"==c?r.group_address_switch_state=l:"DimmingControl"==c?console.log("\tDimmingControl "+l):"DimmingValue"==c?r.group_address_brightness=l:"InfoDimmingValue"==c&&(r.group_address_brightness_state=l)}}catch(f){o=!0,a=f}finally{try{n||null==s.return||s.return()}finally{if(o)throw a}}Object.keys(r).length>0&&(this.xknx.groups.light[t]=r)}},{key:"parseScreen",value:function(e,t){t=this.cleanTopologyString(t);var r={},n=!0,o=!1,a=void 0;try{for(var i,s=e[Symbol.iterator]();!(n=(i=s.next()).done);n=!0){var u=i.value,l=this.getGroupAddress(u);if(void 0!=l){var c=u["$"].Role;"MoveUpDown"==c?r.group_address_long=l:"StopStepUpDown"==c?r.group_address_short=l:"CurrentAbsolutePositionBlindsPercentage"==c?r.group_address_position_feedback=l:"AbsolutePositionBlindsPercentage"==c?r.group_address_position=l:void 0!=c&&console.log(c)}}}catch(f){o=!0,a=f}finally{try{n||null==s.return||s.return()}finally{if(o)throw a}}Object.keys(r).length>0&&(this.xknx.groups.cover[t]=r)}},{key:"parseClimate",value:function(e,t){t=this.cleanTopologyString(t);var r={},n=!0,o=!1,a=void 0;try{for(var i,s=e[Symbol.iterator]();!(n=(i=s.next()).done);n=!0){var u=i.value,l=this.getGroupAddress(u),c=u["$"].Role;"HVACMode"==c?r.mode={group_address_operation_mode:l}:"ValvePosition"==c?console.log("\tValvePosition "+l):"WindowStatus"==c?console.log("\tWindowStatus "+l):"TempRoomSetpoint"==c?r.group_address_target_temperature=l:"TempRoom"==c?r.group_address_temperature=l:console.log(c)}}catch(f){o=!0,a=f}finally{try{n||null==s.return||s.return()}finally{if(o)throw a}}Object.keys(r).length>0&&(this.xknx.groups.climate[t]=r)}},{key:"getGroupAddress",value:function(e){var t=e["$"].RefId;if(void 0!=t&&0!=t.length){var r=this.groupAddresses.find((function(e){return e["$"].Id==t}));if(void 0!=r)return this.convertAddressToGroupAddressString(r["$"].Address)}}},{key:"convertAddressToGroupAddressString",value:function(e){e=+e;var t=Math.floor(e/2048),r=Math.floor(e%2048/256),n=e%2048%256;return t+"/"+r+"/"+n}},{key:"cleanTopologyString",value:function(e){var t=e.trim().replace(/ /g,"_");return isNaN(+t[0])||(t="_"+t),"."==t[t.length-1]&&(t+="x"),"."==t[0]&&(t=t.slice(1,t.length)),t}},{key:"download",value:function(e,t){var r=document.createElement("a");r.setAttribute("href","data:text/plain;charset=utf-8,"+encodeURIComponent(t)),r.setAttribute("download",e),r.style.display="none",document.body.appendChild(r),r.click(),document.body.removeChild(r)}}]),t}(f["c"]);Object(c["a"])([Object(f["b"])()],x.prototype,"msg",void 0),x=Object(c["a"])([f["a"]],x);var k=x,_=k,O=r("2877"),w=Object(O["a"])(_,d,p,!1,null,"4ff70084",null),S=w.exports,j=function(e){function t(){return Object(i["a"])(this,t),Object(s["a"])(this,Object(u["a"])(t).apply(this,arguments))}return Object(l["a"])(t,e),t}(f["c"]);j=Object(c["a"])([Object(f["a"])({components:{ConfigurationImporter:S}})],j);var A=j,T=A,R=(r("034f"),Object(O["a"])(T,o,a,!1,null,null,null)),G=R.exports;n["a"].config.productionTip=!1,new n["a"]({render:function(e){return e(G)}}).$mount("#app")}});
//# sourceMappingURL=app.ed61b057.js.map
var appendBikes,binx_api,binx_list_item,binx_widget_template,formatDates,getNearbyStolen,getSerialResponse,initializeBinxWidget,root_url,trim;root_url="https://binx-widget.herokuapp.com/",binx_api="https://bikeindex.org/api/v2/bikes_search/stolen?per_page=10&widget_from="+document.domain+"&",Array.prototype.uniq=function(){var e,n,t,s,a,i;for(n={},e=s=0,a=this.length;a>=0?a>s:s>a;e=a>=0?++s:--s)n[this[e]]=this[e];i=[];for(e in n)t=n[e],i.push(t);return i},trim=function(e){return e.replace(/^\s\s*/,"").replace(/\s\s*$/,"")},getSerialResponse=function(e){var n,t;return n=$("#search_serials").attr("data-target"),t=this,$.ajax({type:"GET",url:""+binx_api+"serial="+e,success:function(n){return n.serial_searched=e,t.appendBikes(n)}})},appendBikes=function(e,n){var t,s;return null==n&&(n=null),null!=n&&(t={data:e,time:n},localStorage.setItem("binx_rstolen",JSON.stringify(t))),$("#binx_list_container").html(Mustache.render(binx_list_item,e)),$("#binx_stolen_widget ul").css("max-height",$("#binx_stolen_widget").attr("data-height")),formatDates(),null==e.recent_results&&e.bikes.length>0?(s=e.bikes.length>19?" <span>(many found, showing first 20)</span>":" <span>("+e.bikes.length+" found)</span>",$("#binx_list_container .search-response-info").append(s)):void 0},formatDates=function(){var e,n,t,s,a,i,r,l,o;for(s=new Date,a=new Date,a.setDate(s.getDate()-1),a=a.toString().split(/\d{2}:/)[0],s=s.toString().split(/\d{2}:/)[0],l=$("#binx_list_container .date-stolen"),o=[],i=0,r=l.length;r>i;i++)n=l[i],t=new Date(1e3*parseInt($(n).text(),10)),e=t.toString().split(/\d{2}:/)[0],e===s&&(e="Today"),e===a&&(e="Yesterday"),o.push($(n).text(e));return o},getNearbyStolen=function(e,n){var t;return null==n&&(n=[]),t=""+binx_api+"proximity="+e+"&proximity_radius=100",$.ajax({type:"GET",url:t,success:function(t){var s;return s=(new Date).getTime(),t.recent_results=!0,t.bikes=n.concat(t.bikes),t.bikes.length<6&&e.length>0?getNearbyStolen("",t.bikes):appendBikes(t,s)}})},initializeBinxWidget=function(e){var n,t,s;return Mustache.parse(binx_list_item),$("#binx_stolen_widget").html(Mustache.render(binx_widget_template,e.height)),$("#binx_search_form").submit(function(){return getSerialResponse($("#binx_search").val()),!1}),$("#binxformsubm_a").click(function(){return getSerialResponse($("#binx_search").val())}),e.norecent?!0:(t=!1,e.nocache||(n=localStorage.getItem("binx_rstolen"),s=(new Date).getTime(),null!=n&&n.length>0&&(n=JSON.parse(n),null!=n.time&&s-n.time<108e5&&(t=!0,appendBikes(n.data)))),t?void 0:getNearbyStolen(e.location))},$(document).ready(function(){var e,n,t,s,a,i,r;return e=$("#binx_stolen_widget"),t={location:null!=(s=e.attr("data-location"))?s:"ip",nocache:null!=(a=e.attr("data-nocache"))?a:!1,norecent:null!=(i=e.attr("data-norecent"))?i:!1},n=null!=(r=e.attr("data-height"))?r:400,n=parseInt(n,10)-41,e.attr("data-height",""+n+"px"),initializeBinxWidget(t)}),binx_widget_template='<link href="'+root_url+'styles.css" rel="stylesheet" type="text/css">\n<form class="topsearcher" id="binx_search_form">\n  <span class="spacing-span"></span>\n  <span class="top-stripe skinny-stripe"></span>\n  <span class="spacing-span"></span>\n  <span class="top-stripe fat-stripe"></span>\n  <span class="spacing-span"></span>\n  <span class="bottom-stripe fat-stripe"></span>\n  <span class="spacing-span"></span>\n  <span class="bottom-stripe skinny-stripe"></span>\n  <input id="binx_search" type="text" placeholder="Search for a serial number">\n  <input type="submit" id="binxformsubm">\n  <a href="#" class="subm" id="binxformsubm_a"><img src="'+root_url+"search.svg\"></a>\n</form>\n<div class='binxcontainer' id='binx_list_container'></div>",binx_list_item="{{#serial_searched}}\n  <h2 class=\"search-response-info\">Bikes with serial numbers matching <em>{{serial_searched}}</em></h2>\n{{/serial_searched}}\n<ul>\n  {{#bikes}}\n    <li class='{{#stolen}}stolen{{/stolen}}'>\n      {{#thumb}}\n         <a class='stolen-thumb' href='{{url}}' target=\"_blank\">\n          <img src='{{thumb}}'>\n        </a>\n      {{/thumb}}\n      <h4>\n        <a href='{{url}}' target=\"_blank\">{{title}}</a>\n      </h4>\n      {{#stolen}}\n        <p>\n          <span class='stolen-color'>Stolen</span> {{#stolen_location}}from {{stolen_location}} &mdash; {{/stolen_location}} <span class='date-stolen'>{{date_stolen}}\n        </p>\n      {{/stolen}}\n      <p>\n        Serial: <span class='serial-text'>{{serial}}</span>\n      </p>\n      {{^stolen}}\n        <p class=\"not-stolen\">Bike is not marked stolen</p>\n      {{/stolen}}\n    </li>\n  {{/bikes}}\n</ul>\n{{^bikes}}\n  <div class=\"binx-stolen-widget-list\">\n    {{#recent_results}}\n      <h2 class='search-fail'>\n        We're sorry! Something went wrong and we couldn't retrieve recent results!\n        <span>We're probably working on fixing this right now, send us an email at <a href=\"mailto:contact@bikeindex.org\">contact@bikeindex.org</a> if the problem persists</span>\n      </h2>\n    {{/recent_results}}\n    {{#serial_searched}}\n      <h2 class='search-fail'>\n        No bikes found on the Bike Index with a serial of <span class=\"search-query\">{{serial_searched}}</span>\n      </h2>\n    {{/serial_searched}}\n  </div>\n{{/bikes}}\n{{#recent_results}}\n  <div class=\"widget-info\">\n    Recent reported stolen bikes \n    {{#location}}\n      near <em>{{location}}</em>\n    {{/location}}\n  </div>\n{{/recent_results}}";
(function(e,t){if(typeof exports==="object"&&exports){t(exports)}else if(typeof define==="function"&&define.amd){define(["exports"],t)}else{t(e.Mustache={})}})(this,function(e){function r(e){return typeof e==="function"}function i(e){return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}function o(e,t){return s.call(e,t)}function a(e){return!o(u,e)}function l(e){return String(e).replace(/[&<>"'\/]/g,function(e){return f[e]})}function m(t,r){function m(){if(f&&!l){while(u.length)delete o[u.pop()]}else{u=[]}f=false;l=false}function x(e){if(typeof e==="string")e=e.split(h,2);if(!n(e)||e.length!==2)throw new Error("Invalid tags: "+e);w=new RegExp(i(e[0])+"\\s*");E=new RegExp("\\s*"+i(e[1]));S=new RegExp("\\s*"+i("}"+e[1]))}if(!t)return[];var s=[];var o=[];var u=[];var f=false;var l=false;var w,E,S;x(r||e.tags);var T=new b(t);var N,C,k,L,A,O;while(!T.eos()){N=T.pos;k=T.scanUntil(w);if(k){for(var M=0,_=k.length;M<_;++M){L=k.charAt(M);if(a(L)){u.push(o.length)}else{l=true}o.push(["text",L,N,N+1]);N+=1;if(L==="\n")m()}}if(!T.scan(w))break;f=true;C=T.scan(v)||"name";T.scan(c);if(C==="="){k=T.scanUntil(p);T.scan(p);T.scanUntil(E)}else if(C==="{"){k=T.scanUntil(S);T.scan(d);T.scanUntil(E);C="&"}else{k=T.scanUntil(E)}if(!T.scan(E))throw new Error("Unclosed tag at "+T.pos);A=[C,k,N,T.pos];o.push(A);if(C==="#"||C==="^"){s.push(A)}else if(C==="/"){O=s.pop();if(!O)throw new Error('Unopened section "'+k+'" at '+N);if(O[1]!==k)throw new Error('Unclosed section "'+O[1]+'" at '+N)}else if(C==="name"||C==="{"||C==="&"){l=true}else if(C==="="){x(k)}}O=s.pop();if(O)throw new Error('Unclosed section "'+O[1]+'" at '+T.pos);return y(g(o))}function g(e){var t=[];var n,r;for(var i=0,s=e.length;i<s;++i){n=e[i];if(n){if(n[0]==="text"&&r&&r[0]==="text"){r[1]+=n[1];r[3]=n[3]}else{t.push(n);r=n}}}return t}function y(e){var t=[];var n=t;var r=[];var i,s;for(var o=0,u=e.length;o<u;++o){i=e[o];switch(i[0]){case"#":case"^":n.push(i);r.push(i);n=i[4]=[];break;case"/":s=r.pop();s[5]=i[2];n=r.length>0?r[r.length-1][4]:t;break;default:n.push(i)}}return t}function b(e){this.string=e;this.tail=e;this.pos=0}function w(e,t){this.view=e==null?{}:e;this.cache={".":this.view};this.parent=t}function E(){this.cache={}}var t=Object.prototype.toString;var n=Array.isArray||function(e){return t.call(e)==="[object Array]"};var s=RegExp.prototype.test;var u=/\S/;var f={"&":"&","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;"};var c=/\s*/;var h=/\s+/;var p=/\s*=/;var d=/\s*\}/;var v=/#|\^|\/|>|\{|&|=|!/;b.prototype.eos=function(){return this.tail===""};b.prototype.scan=function(e){var t=this.tail.match(e);if(!t||t.index!==0)return"";var n=t[0];this.tail=this.tail.substring(n.length);this.pos+=n.length;return n};b.prototype.scanUntil=function(e){var t=this.tail.search(e),n;switch(t){case-1:n=this.tail;this.tail="";break;case 0:n="";break;default:n=this.tail.substring(0,t);this.tail=this.tail.substring(t)}this.pos+=n.length;return n};w.prototype.push=function(e){return new w(e,this)};w.prototype.lookup=function(e){var t=this.cache;var n;if(e in t){n=t[e]}else{var i=this,s,o;while(i){if(e.indexOf(".")>0){n=i.view;s=e.split(".");o=0;while(n!=null&&o<s.length)n=n[s[o++]]}else{n=i.view[e]}if(n!=null)break;i=i.parent}t[e]=n}if(r(n))n=n.call(this.view);return n};E.prototype.clearCache=function(){this.cache={}};E.prototype.parse=function(e,t){var n=this.cache;var r=n[e];if(r==null)r=n[e]=m(e,t);return r};E.prototype.render=function(e,t,n){var r=this.parse(e);var i=t instanceof w?t:new w(t);return this.renderTokens(r,i,n,e)};E.prototype.renderTokens=function(t,i,s,o){function f(e){return a.render(e,i,s)}var u="";var a=this;var l,c;for(var h=0,p=t.length;h<p;++h){l=t[h];switch(l[0]){case"#":c=i.lookup(l[1]);if(!c)continue;if(n(c)){for(var d=0,v=c.length;d<v;++d){u+=this.renderTokens(l[4],i.push(c[d]),s,o)}}else if(typeof c==="object"||typeof c==="string"){u+=this.renderTokens(l[4],i.push(c),s,o)}else if(r(c)){if(typeof o!=="string")throw new Error("Cannot use higher-order sections without the original template");c=c.call(i.view,o.slice(l[3],l[5]),f);if(c!=null)u+=c}else{u+=this.renderTokens(l[4],i,s,o)}break;case"^":c=i.lookup(l[1]);if(!c||n(c)&&c.length===0)u+=this.renderTokens(l[4],i,s,o);break;case">":if(!s)continue;c=r(s)?s(l[1]):s[l[1]];if(c!=null)u+=this.renderTokens(this.parse(c),i,s,c);break;case"&":c=i.lookup(l[1]);if(c!=null)u+=c;break;case"name":c=i.lookup(l[1]);if(c!=null)u+=e.escape(c);break;case"text":u+=l[1];break}}return u};e.name="mustache.js";e.version="0.8.1";e.tags=["{{","}}"];var S=new E;e.clearCache=function(){return S.clearCache()};e.parse=function(e,t){return S.parse(e,t)};e.render=function(e,t,n){return S.render(e,t,n)};e.to_html=function(t,n,i,s){var o=e.render(t,n,i);if(r(s)){s(o)}else{return o}};e.escape=l;e.Scanner=b;e.Context=w;e.Writer=E})
(function(b,a){if(typeof exports==="object"&&exports){a(exports)}else{if(typeof define==="function"&&define.amd){define(["exports"],a)}else{a(b.Mustache={})}}})(this,function(a){var u=Object.prototype.toString;var k=Array.isArray||function(x){return u.call(x)==="[object Array]"};function b(x){return typeof x==="function"}function e(x){return x.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}var g=RegExp.prototype.test;function q(y,x){return g.call(y,x)}var j=/\S/;function h(x){return !q(j,x)}var d={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;"};function m(x){return String(x).replace(/[&<>"'\/]/g,function(y){return d[y]})}var f=/\s*/;var l=/\s+/;var t=/\s*=/;var n=/\s*\}/;var r=/#|\^|\/|>|\{|&|=|!/;function w(Q,F){if(!Q){return[]}var H=[];var G=[];var C=[];var R=false;var O=false;function N(){if(R&&!O){while(C.length){delete G[C.pop()]}}else{C=[]}R=false;O=false}var J,E,P;function D(S){if(typeof S==="string"){S=S.split(l,2)}if(!k(S)||S.length!==2){throw new Error("Invalid tags: "+S)}J=new RegExp(e(S[0])+"\\s*");E=new RegExp("\\s*"+e(S[1]));P=new RegExp("\\s*"+e("}"+S[1]))}D(F||a.tags);var z=new s(Q);var A,y,I,L,B,x;while(!z.eos()){A=z.pos;I=z.scanUntil(J);if(I){for(var M=0,K=I.length;M<K;++M){L=I.charAt(M);if(h(L)){C.push(G.length)}else{O=true}G.push(["text",L,A,A+1]);A+=1;if(L==="\n"){N()}}}if(!z.scan(J)){break}R=true;y=z.scan(r)||"name";z.scan(f);if(y==="="){I=z.scanUntil(t);z.scan(t);z.scanUntil(E)}else{if(y==="{"){I=z.scanUntil(P);z.scan(n);z.scanUntil(E);y="&"}else{I=z.scanUntil(E)}}if(!z.scan(E)){throw new Error("Unclosed tag at "+z.pos)}B=[y,I,A,z.pos];G.push(B);if(y==="#"||y==="^"){H.push(B)}else{if(y==="/"){x=H.pop();if(!x){throw new Error('Unopened section "'+I+'" at '+A)}if(x[1]!==I){throw new Error('Unclosed section "'+x[1]+'" at '+A)}}else{if(y==="name"||y==="{"||y==="&"){O=true}else{if(y==="="){D(I)}}}}}x=H.pop();if(x){throw new Error('Unclosed section "'+x[1]+'" at '+z.pos)}return v(c(G))}function c(C){var y=[];var A,x;for(var z=0,B=C.length;z<B;++z){A=C[z];if(A){if(A[0]==="text"&&x&&x[0]==="text"){x[1]+=A[1];x[3]=A[3]}else{y.push(A);x=A}}}return y}function v(C){var E=[];var B=E;var D=[];var y,A;for(var x=0,z=C.length;x<z;++x){y=C[x];switch(y[0]){case"#":case"^":B.push(y);D.push(y);B=y[4]=[];break;case"/":A=D.pop();A[5]=y[2];B=D.length>0?D[D.length-1][4]:E;break;default:B.push(y)}}return E}function s(x){this.string=x;this.tail=x;this.pos=0}s.prototype.eos=function(){return this.tail===""};s.prototype.scan=function(z){var y=this.tail.match(z);if(!y||y.index!==0){return""}var x=y[0];this.tail=this.tail.substring(x.length);this.pos+=x.length;return x};s.prototype.scanUntil=function(z){var y=this.tail.search(z),x;switch(y){case -1:x=this.tail;this.tail="";break;case 0:x="";break;default:x=this.tail.substring(0,y);this.tail=this.tail.substring(y)}this.pos+=x.length;return x};function p(y,x){this.view=y;this.cache={".":this.view};this.parent=x}p.prototype.push=function(x){return new p(x,this)};p.prototype.lookup=function(A){var y=this.cache;var C;if(A in y){C=y[A]}else{var B=this,D,z,x=false;while(B){if(A.indexOf(".")>0){C=B.view;D=A.split(".");z=0;while(C!=null&&z<D.length){if(z===D.length-1&&C!=null){x=typeof C==="object"&&C.hasOwnProperty(D[z])}C=C[D[z++]]}}else{if(B.view!=null&&typeof B.view==="object"){C=B.view[A];x=B.view.hasOwnProperty(A)}}if(x){break}B=B.parent}y[A]=C}if(b(C)){C=C.call(this.view)}return C};function o(){this.cache={}}o.prototype.clearCache=function(){this.cache={}};o.prototype.parse=function(z,y){var x=this.cache;var A=x[z];if(A==null){A=x[z]=w(z,y)}return A};o.prototype.render=function(A,x,z){var B=this.parse(A);var y=x instanceof p?x:new p(x);return this.renderTokens(B,y,z,A)};o.prototype.renderTokens=function(E,x,C,G){var A="";var z,y,F;for(var B=0,D=E.length;B<D;++B){F=undefined;z=E[B];y=z[0];if(y==="#"){F=this._renderSection(z,x,C,G)}else{if(y==="^"){F=this._renderInverted(z,x,C,G)}else{if(y===">"){F=this._renderPartial(z,x,C,G)}else{if(y==="&"){F=this._unescapedValue(z,x)}else{if(y==="name"){F=this._escapedValue(z,x)}else{if(y==="text"){F=this._rawValue(z)}}}}}}if(F!==undefined){A+=F}}return A};o.prototype._renderSection=function(z,x,C,F){var G=this;var B="";var D=x.lookup(z[1]);function y(H){return G.render(H,x,C)}if(!D){return}if(k(D)){for(var A=0,E=D.length;A<E;++A){B+=this.renderTokens(z[4],x.push(D[A]),C,F)}}else{if(typeof D==="object"||typeof D==="string"||typeof D==="number"){B+=this.renderTokens(z[4],x.push(D),C,F)}else{if(b(D)){if(typeof F!=="string"){throw new Error("Cannot use higher-order sections without the original template")}D=D.call(x.view,F.slice(z[3],z[5]),y);if(D!=null){B+=D}}else{B+=this.renderTokens(z[4],x,C,F)}}}return B};o.prototype._renderInverted=function(z,y,x,B){var A=y.lookup(z[1]);if(!A||k(A)&&A.length===0){return this.renderTokens(z[4],y,x,B)}};o.prototype._renderPartial=function(z,y,x){if(!x){return}var A=b(x)?x(z[1]):x[z[1]];if(A!=null){return this.renderTokens(this.parse(A),y,x,A)}};o.prototype._unescapedValue=function(y,x){var z=x.lookup(y[1]);if(z!=null){return z}};o.prototype._escapedValue=function(y,x){var z=x.lookup(y[1]);if(z!=null){return a.escape(z)}};o.prototype._rawValue=function(x){return x[1]};a.name="mustache.js";a.version="2.0.0";a.tags=["{{","}}"];var i=new o;a.clearCache=function(){return i.clearCache()};a.parse=function(y,x){return i.parse(y,x)};a.render=function(z,x,y){return i.render(z,x,y)};a.to_html=function(A,y,z,B){var x=a.render(A,y,z);if(b(B)){B(x)}else{return x}};a.escape=m;a.Scanner=s;a.Context=p;a.Writer=o});(function(){var c,d,f,b,g,h,e,i,j,a;j=window.binxw_root_url||"https://widget.bikeindex.org/";d="https://bikeindex.org/api/v2/bikes_search/stolen?per_page=10&widget_from="+document.domain+"&";Array.prototype.uniq=function(){var l,n,k,o,m,p;k={};for(n=l=0,o=this.length;0<=o?l<o:l>o;n=0<=o?++l:--l){k[this[n]]=this[n]}m=[];for(n in k){p=k[n];m.push(p)}return m};a=function(k){return k.replace(/^\s\s*/,"").replace(/\s\s*$/,"")};e=function(k){var m,l;m=$("#search_serials").attr("data-target");l=this;return $.ajax({type:"GET",url:d+"serial="+k,success:function(o,p,n){o.serial_searched=k;return l.appendBikes(o)}})};c=function(n,l){var k,m;if(l==null){l=null}if(l!=null){k={data:n,time:l};localStorage.setItem("binx_rstolen",JSON.stringify(k))}$("#binx_list_container").html(Mustache.render(f,n));$("#binx_stolen_widget ul").css("max-height",$("#binx_stolen_widget").attr("data-height"));g();if(n.recent_results==null){if(n.bikes.length>0){if(n.bikes.length>19){m=" <span>(many found, showing first 20)</span>"}else{m=" <span>("+n.bikes.length+" found)</span>"}return $("#binx_list_container .search-response-info").append(m)}}};g=function(){var m,k,o,r,l,p,n,s,q;s=new Date();q=new Date();q.setDate(s.getDate()-1);q=q.toString().split(/\d{2}:/)[0];s=s.toString().split(/\d{2}:/)[0];l=$("#binx_list_container .date-stolen");p=[];for(o=0,r=l.length;o<r;o++){k=l[o];n=new Date(parseInt($(k).text(),10)*1000);m=n.toString().split(/\d{2}:/)[0];if(m===s){m="Today"}if(m===q){m="Yesterday"}p.push($(k).text(m))}return p};h=function(k,m){var l;if(m==null){m=[]}l=d+"proximity="+k+"&proximity_radius=100";return $.ajax({type:"GET",url:l,success:function(o,q,n){var p;p=new Date().getTime();o.recent_results=true;o.bikes=m.concat(o.bikes);if(o.bikes.length<6&&k.length>0){return h("",o.bikes)}else{return c(o,p)}}})};i=function(l){var k,m,n;Mustache.parse(f);$("#binx_stolen_widget").html(Mustache.render(b,l.height));$("#binx_search_form").submit(function(o){e($("#binx_search").val());return false});$("#binxformsubm_a").click(function(o){return e($("#binx_search").val())});if(l.norecent){return true}m=false;if(!l.nocache){k=localStorage.getItem("binx_rstolen");n=new Date().getTime();if((k!=null)&&k.length>0){k=JSON.parse(k);if((k.time!=null)&&n-k.time<10800000){m=true;c(k.data)}}}if(!m){return h(l.location)}};$(document).ready(function(){var n,l,p,q,o,m,k;n=$("#binx_stolen_widget");p={location:(q=n.attr("data-location"))!=null?q:"ip",nocache:(o=n.attr("data-nocache"))!=null?o:false,norecent:(m=n.attr("data-norecent"))!=null?m:false};l=(k=n.attr("data-height"))!=null?k:400;l=parseInt(l,10)-41;n.attr("data-height",l+"px");return i(p)});b='<link href="'+j+'assets/styles.css" rel="stylesheet" type="text/css">\n<form class="topsearcher" id="binx_search_form">\n  <span class="spacing-span"></span>\n  <span class="top-stripe skinny-stripe"></span>\n  <span class="spacing-span"></span>\n  <span class="top-stripe fat-stripe"></span>\n  <span class="spacing-span"></span>\n  <span class="bottom-stripe fat-stripe"></span>\n  <span class="spacing-span"></span>\n  <span class="bottom-stripe skinny-stripe"></span>\n  <input id="binx_search" type="text" placeholder="Search for a serial number">\n  <input type="submit" id="binxformsubm">\n  <a href="#" class="subm" id="binxformsubm_a"><img src="'+j+"assets/search.svg\"></a>\n</form>\n<div class='binxcontainer' id='binx_list_container'></div>";f="{{#serial_searched}}\n  <h2 class=\"search-response-info\">Bikes with serial numbers matching <em>{{serial_searched}}</em></h2>\n{{/serial_searched}}\n<ul>\n  {{#bikes}}\n    <li class='{{#stolen}}stolen{{/stolen}}'>\n      {{#thumb}}\n         <a class='stolen-thumb' href='https://bikeindex.org/bikes/{{id}}' target=\"_blank\">\n          <img src='{{thumb}}'>\n        </a>\n      {{/thumb}}\n      <h4>\n        <a href='https://bikeindex.org/bikes/{{id}}' target=\"_blank\">{{title}}</a>\n      </h4>\n      {{#stolen}}\n        <p>\n          <span class='stolen-color'>Stolen</span> {{#stolen_location}}from {{stolen_location}} &mdash; {{/stolen_location}} <span class='date-stolen'>{{date_stolen}}\n        </p>\n      {{/stolen}}\n      <p>\n        Serial: <span class='serial-text'>{{serial}}</span>\n      </p>\n      {{^stolen}}\n        <p class=\"not-stolen\">Bike is not marked stolen</p>\n      {{/stolen}}\n    </li>\n  {{/bikes}}\n</ul>\n{{^bikes}}\n  <div class=\"binx-stolen-widget-list\">\n    {{#recent_results}}\n      <h2 class='search-fail'>\n        We're sorry! Something went wrong and we couldn't retrieve recent results!\n        <span>We're probably working on fixing this right now, send us an email at <a href=\"mailto:contact@bikeindex.org\">contact@bikeindex.org</a> if the problem persists</span>\n      </h2>\n    {{/recent_results}}\n    {{#serial_searched}}\n      <h2 class='search-fail'>\n        No bikes found on the Bike Index with a serial of <span class=\"search-query\">{{serial_searched}}</span>\n      </h2>\n    {{/serial_searched}}\n  </div>\n{{/bikes}}\n{{#recent_results}}\n  <div class=\"widget-info\">\n    Recent reported stolen bikes \n    {{#location}}\n      near <em>{{location}}</em>\n    {{/location}}\n  </div>\n{{/recent_results}}"}).call(this);
var stolenBinxList,unableToBinxList,__indexOf=[].indexOf||function(e){for(var t=0,n=this.length;n>t;t++)if(t in this&&this[t]===e)return t;return-1};stolenBinxList=function(e,t){var n,i,r,a,s,o,c,l,d;for(o=document.getElementById("bi-stolen-widget"),r=document.createElement("ul"),r.innerHTML="",i=l=0,d=e.length;d>l&&(n=e[i],!(i>6));i=++l)s=new Date(Date.parse(n.stolen_record.date_stolen)),s=s.toString().split(/\d{2}:/)[0],a="<li>",null!=n.thumb&&(a+="<a href='"+n.url+"' class='stolen-thumb'><img src='"+n.thumb+"'></a>"),a+="  <h4>\n    <a href='"+n.url+"'>"+n.title+"</a>\n  </h4>\n  <p>\n    Stolen from "+n.stolen_record.location+"\n    &mdash; on "+s+"\n  </p>\n</li>",r.innerHTML+=a;return o.appendChild(r),c=document.createElement("div"),c.setAttribute("class","widget-info"),c.innerHTML="Recent stolen bikes around "+t,o.appendChild(c)},unableToBinxList=function(){var e,t;return t=document.getElementById("bi-stolen-widget"),e=document.createElement("div"),e.innerHTML="<div class='binxerror'>\n<h4>Something went wrong. We couldn't get any recent stolen bikes. Check the <a href='https://bikeindex.org'>Bike Index</a> for an updated list.</h4>\n<pre>\n          ~~O     \n        -  /,    \n       -  -|~(*)  \n      -  (*)      \n\n     ---^------   \n</pre><p>... or maybe you should just go ride your bike</p></div>",t.appendChild(e)},function(){var cache,is_cached,location,req,time,url;return location=document.getElementById("bi-stolen-widget").getAttribute("data-location"),is_cached=!1,cache=localStorage.getItem("binx_rstolen"),time=(new Date).getTime(),null!=cache&&cache.length>0&&(cache=JSON.parse(cache),null!=cache.time&&time-cache.time<216e5&&(is_cached=!0,stolenBinxList(cache.bikes,location))),is_cached?void 0:(req=new XMLHttpRequest,url="https://bikeindex.org/api/v1/bikes?stolen=true&proximity="+location+"&proximity_radius=100",req.addEventListener("readystatechange",function(){var data,successResultCodes,_ref;return 4===req.readyState?(successResultCodes=[200],_ref=req.status,__indexOf.call(successResultCodes,_ref)>=0?(data=eval("("+req.responseText+")"),stolenBinxList(data.bikes,location),cache={bikes:data.bikes,time:time},localStorage.setItem("binx_rstolen",JSON.stringify(cache))):unableToBinxList()):void 0}),req.open("GET",url,!1),req.send())}();
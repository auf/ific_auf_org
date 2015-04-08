/*jslint browser: true */ /*global jQuery: true */

/**
 * jQuery Cookie plugin
 *
 * Copyright (c) 2010 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

// TODO JsDoc

/**
 * Create a cookie with the given key and value and other optional parameters.
 *
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Set the value of a cookie.
 * @example $.cookie('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'jquery.com', secure: true });
 * @desc Create a cookie with all available options.
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Create a session cookie.
 * @example $.cookie('the_cookie', null);
 * @desc Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
 *       used when the cookie was set.
 *
 * @param String key The key of the cookie.
 * @param String value The value of the cookie.
 * @param Object options An object literal containing key/value pairs to provide optional cookie attributes.
 * @option Number|Date expires Either an integer specifying the expiration date from now on in days or a Date object.
 *                             If a negative value is specified (e.g. a date in the past), the cookie will be deleted.
 *                             If set to null or omitted, the cookie will be a session cookie and will not be retained
 *                             when the the browser exits.
 * @option String path The value of the path atribute of the cookie (default: path of page that created the cookie).
 * @option String domain The value of the domain attribute of the cookie (default: domain of page that created the cookie).
 * @option Boolean secure If true, the secure attribute of the cookie will be set and the cookie transmission will
 *                        require a secure protocol (like HTTPS).
 * @type undefined
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */

/**
 * Get the value of a cookie with the given key.
 *
 * @example $.cookie('the_cookie');
 * @desc Get the value of a cookie.
 *
 * @param String key The key of the cookie.
 * @return The value of the cookie.
 * @type String
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
jQuery.cookie = function (key, value, options) {

    // key and value given, set cookie...
    if (arguments.length > 1 && (value === null || typeof value !== "object")) {
        options = jQuery.extend({}, options);

        if (value === null) {
            options.expires = -1;
        }

        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }

        return (document.cookie = [
            encodeURIComponent(key), '=',
            options.raw ? String(value) : encodeURIComponent(String(value)),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''));
    }

    // key and possibly options given, get cookie...
    options = value || {};
    var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};
;
(function($){$.fn.ajaxSubmit=function(options){if(!this.length){log("ajaxSubmit: skipping submit process - no element selected");return this}if(typeof options=="function")options={success:options};var action=this.attr("action");var url=typeof action==="string"?$.trim(action):"";if(url)url=(url.match(/^([^#]+)/)||[])[1];url=url||window.location.href||"";options=$.extend(true,{url:url,success:$.ajaxSettings.success,type:this[0].getAttribute("method")||"GET",iframeSrc:/^https/i.test(window.location.href||
"")?"javascript:false":"about:blank"},options);var veto={};this.trigger("form-pre-serialize",[this,options,veto]);if(veto.veto){log("ajaxSubmit: submit vetoed via form-pre-serialize trigger");return this}if(options.beforeSerialize&&options.beforeSerialize(this,options)===false){log("ajaxSubmit: submit aborted via beforeSerialize callback");return this}var n,v,a=this.formToArray(options.semantic);if(options.data){options.extraData=options.data;for(n in options.data)if(options.data[n]instanceof Array)for(var k in options.data[n])a.push({name:n,
value:options.data[n][k]});else{v=options.data[n];v=$.isFunction(v)?v():v;a.push({name:n,value:v})}}if(options.beforeSubmit&&options.beforeSubmit(a,this,options)===false){log("ajaxSubmit: submit aborted via beforeSubmit callback");return this}this.trigger("form-submit-validate",[a,this,options,veto]);if(veto.veto){log("ajaxSubmit: submit vetoed via form-submit-validate trigger");return this}var q=$.param(a);if(options.type.toUpperCase()=="GET"){options.url+=(options.url.indexOf("?")>=0?"&":"?")+q;
options.data=null}else options.data=q;var $form=this,callbacks=[];if(options.resetForm)callbacks.push(function(){$form.resetForm()});if(options.clearForm)callbacks.push(function(){$form.clearForm()});if(!options.dataType&&options.target){var oldSuccess=options.success||function(){};callbacks.push(function(data){var fn=options.replaceTarget?"replaceWith":"html";$(options.target)[fn](data).each(oldSuccess,arguments)})}else if(options.success)callbacks.push(options.success);options.success=function(data,
status,xhr){var context=options.context||options;for(var i=0,max=callbacks.length;i<max;i++)callbacks[i].apply(context,[data,status,xhr||$form,$form])};var fileInputs=$("input:file",this).length>0;var mp="multipart/form-data";var multipart=$form.attr("enctype")==mp||$form.attr("encoding")==mp;if(options.iframe!==false&&(fileInputs||options.iframe||multipart))if(options.closeKeepAlive)$.get(options.closeKeepAlive,fileUpload);else fileUpload();else $.ajax(options);this.trigger("form-submit-notify",
[this,options]);return this;function fileUpload(){var form=$form[0];if($(":input[name=submit],:input[id=submit]",form).length){alert('Error: Form elements must not have name or id of "submit".');return}var s=$.extend(true,{},$.ajaxSettings,options);s.context=s.context||s;var id="jqFormIO"+(new Date).getTime(),fn="_"+id;var $io=$('<iframe id="'+id+'" name="'+id+'" src="'+s.iframeSrc+'" />');var io=$io[0];$io.css({position:"absolute",top:"-1000px",left:"-1000px"});var xhr={aborted:0,responseText:null,
responseXML:null,status:0,statusText:"n/a",getAllResponseHeaders:function(){},getResponseHeader:function(){},setRequestHeader:function(){},abort:function(){log("aborting upload...");var e="aborted";this.aborted=1;$io.attr("src",s.iframeSrc);xhr.error=e;s.error&&s.error.call(s.context,xhr,"error",e);g&&$.event.trigger("ajaxError",[xhr,s,e]);s.complete&&s.complete.call(s.context,xhr,"error")}};var g=s.global;if(g&&!$.active++)$.event.trigger("ajaxStart");if(g)$.event.trigger("ajaxSend",[xhr,s]);if(s.beforeSend&&
s.beforeSend.call(s.context,xhr,s)===false){if(s.global)$.active--;return}if(xhr.aborted)return;var timedOut=0;var sub=form.clk;if(sub){var n=sub.name;if(n&&!sub.disabled){s.extraData=s.extraData||{};s.extraData[n]=sub.value;if(sub.type=="image"){s.extraData[n+".x"]=form.clk_x;s.extraData[n+".y"]=form.clk_y}}}function doSubmit(){var t=$form.attr("target"),a=$form.attr("action");form.setAttribute("target",id);if(form.getAttribute("method")!="POST")form.setAttribute("method","POST");if(form.getAttribute("action")!=
s.url)form.setAttribute("action",s.url);if(!s.skipEncodingOverride)$form.attr({encoding:"multipart/form-data",enctype:"multipart/form-data"});if(s.timeout)setTimeout(function(){timedOut=true;cb()},s.timeout);var extraInputs=[];try{if(s.extraData)for(var n in s.extraData)extraInputs.push($('<input type="hidden" name="'+n+'" value="'+s.extraData[n]+'" />').appendTo(form)[0]);$io.appendTo("body");io.attachEvent?io.attachEvent("onload",cb):io.addEventListener("load",cb,false);form.submit()}finally{form.setAttribute("action",
a);if(t)form.setAttribute("target",t);else $form.removeAttr("target");$(extraInputs).remove()}}if(s.forceSync)doSubmit();else setTimeout(doSubmit,10);var data,doc,domCheckCount=50;function cb(){if(xhr.aborted)return;var doc=io.contentWindow?io.contentWindow.document:io.contentDocument?io.contentDocument:io.document;if(!doc||doc.location.href==s.iframeSrc)if(!timedOut)return;io.detachEvent?io.detachEvent("onload",cb):io.removeEventListener("load",cb,false);var ok=true;try{if(timedOut)throw"timeout";
var isXml=s.dataType=="xml"||doc.XMLDocument||$.isXMLDoc(doc);log("isXml="+isXml);if(!isXml&&window.opera&&(doc.body==null||doc.body.innerHTML==""))if(--domCheckCount){log("requeing onLoad callback, DOM not available");setTimeout(cb,250);return}xhr.responseText=doc.body?doc.body.innerHTML:doc.documentElement?doc.documentElement.innerHTML:null;xhr.responseXML=doc.XMLDocument?doc.XMLDocument:doc;xhr.getResponseHeader=function(header){var headers={"content-type":s.dataType};return headers[header]};var scr=
/(json|script)/.test(s.dataType);if(scr||s.textarea){var ta=doc.getElementsByTagName("textarea")[0];if(ta)xhr.responseText=ta.value;else if(scr){var pre=doc.getElementsByTagName("pre")[0];var b=doc.getElementsByTagName("body")[0];if(pre)xhr.responseText=pre.textContent;else if(b)xhr.responseText=b.innerHTML}}else if(s.dataType=="xml"&&!xhr.responseXML&&xhr.responseText!=null)xhr.responseXML=toXml(xhr.responseText);data=httpData(xhr,s.dataType,s)}catch(e){log("error caught:",e);ok=false;xhr.error=
e;s.error&&s.error.call(s.context,xhr,"error",e);g&&$.event.trigger("ajaxError",[xhr,s,e])}if(xhr.aborted){log("upload aborted");ok=false}if(ok){s.success&&s.success.call(s.context,data,"success",xhr);g&&$.event.trigger("ajaxSuccess",[xhr,s])}g&&$.event.trigger("ajaxComplete",[xhr,s]);if(g&&!--$.active)$.event.trigger("ajaxStop");s.complete&&s.complete.call(s.context,xhr,ok?"success":"error");setTimeout(function(){$io.removeData("form-plugin-onload");$io.remove();xhr.responseXML=null},100)}var toXml=
$.parseXML||function(s,doc){if(window.ActiveXObject){doc=new ActiveXObject("Microsoft.XMLDOM");doc.async="false";doc.loadXML(s)}else doc=(new DOMParser).parseFromString(s,"text/xml");return doc&&doc.documentElement&&doc.documentElement.nodeName!="parsererror"?doc:null};var parseJSON=$.parseJSON||function(s){return window["eval"]("("+s+")")};var httpData=function(xhr,type,s){var ct=xhr.getResponseHeader("content-type")||"",xml=type==="xml"||!type&&ct.indexOf("xml")>=0,data=xml?xhr.responseXML:xhr.responseText;
if(xml&&data.documentElement.nodeName==="parsererror")$.error&&$.error("parsererror");if(s&&s.dataFilter)data=s.dataFilter(data,type);if(typeof data==="string")if(type==="json"||!type&&ct.indexOf("json")>=0)data=parseJSON(data);else if(type==="script"||!type&&ct.indexOf("javascript")>=0)$.globalEval(data);return data}}};$.fn.ajaxForm=function(options){if(this.length===0){var o={s:this.selector,c:this.context};if(!$.isReady&&o.s){log("DOM not ready, queuing ajaxForm");$(function(){$(o.s,o.c).ajaxForm(options)});
return this}log("terminating; zero elements found by selector"+($.isReady?"":" (DOM not ready)"));return this}return this.ajaxFormUnbind().bind("submit.form-plugin",function(e){if(!e.isDefaultPrevented()){e.preventDefault();$(this).ajaxSubmit(options)}}).bind("click.form-plugin",function(e){var target=e.target;var $el=$(target);if(!$el.is(":submit,input:image")){var t=$el.closest(":submit");if(t.length==0)return;target=t[0]}var form=this;form.clk=target;if(target.type=="image")if(e.offsetX!=undefined){form.clk_x=
e.offsetX;form.clk_y=e.offsetY}else if(typeof $.fn.offset=="function"){var offset=$el.offset();form.clk_x=e.pageX-offset.left;form.clk_y=e.pageY-offset.top}else{form.clk_x=e.pageX-target.offsetLeft;form.clk_y=e.pageY-target.offsetTop}setTimeout(function(){form.clk=form.clk_x=form.clk_y=null},100)})};$.fn.ajaxFormUnbind=function(){return this.unbind("submit.form-plugin click.form-plugin")};$.fn.formToArray=function(semantic){var a=[];if(this.length===0)return a;var form=this[0];var els=semantic?form.getElementsByTagName("*"):
form.elements;if(!els)return a;var i,j,n,v,el,max,jmax;for(i=0,max=els.length;i<max;i++){el=els[i];n=el.name;if(!n)continue;if(semantic&&form.clk&&el.type=="image"){if(!el.disabled&&form.clk==el){a.push({name:n,value:$(el).val()});a.push({name:n+".x",value:form.clk_x},{name:n+".y",value:form.clk_y})}continue}v=$.fieldValue(el,true);if(v&&v.constructor==Array)for(j=0,jmax=v.length;j<jmax;j++)a.push({name:n,value:v[j]});else if(v!==null&&typeof v!="undefined")a.push({name:n,value:v})}if(!semantic&&
form.clk){var $input=$(form.clk),input=$input[0];n=input.name;if(n&&!input.disabled&&input.type=="image"){a.push({name:n,value:$input.val()});a.push({name:n+".x",value:form.clk_x},{name:n+".y",value:form.clk_y})}}return a};$.fn.formSerialize=function(semantic){return $.param(this.formToArray(semantic))};$.fn.fieldSerialize=function(successful){var a=[];this.each(function(){var n=this.name;if(!n)return;var v=$.fieldValue(this,successful);if(v&&v.constructor==Array)for(var i=0,max=v.length;i<max;i++)a.push({name:n,
value:v[i]});else if(v!==null&&typeof v!="undefined")a.push({name:this.name,value:v})});return $.param(a)};$.fn.fieldValue=function(successful){for(var val=[],i=0,max=this.length;i<max;i++){var el=this[i];var v=$.fieldValue(el,successful);if(v===null||typeof v=="undefined"||v.constructor==Array&&!v.length)continue;v.constructor==Array?$.merge(val,v):val.push(v)}return val};$.fieldValue=function(el,successful){var n=el.name,t=el.type,tag=el.tagName.toLowerCase();if(successful===undefined)successful=
true;if(successful&&(!n||el.disabled||t=="reset"||t=="button"||(t=="checkbox"||t=="radio")&&!el.checked||(t=="submit"||t=="image")&&el.form&&el.form.clk!=el||tag=="select"&&el.selectedIndex==-1))return null;if(tag=="select"){var index=el.selectedIndex;if(index<0)return null;var a=[],ops=el.options;var one=t=="select-one";var max=one?index+1:ops.length;for(var i=one?index:0;i<max;i++){var op=ops[i];if(op.selected){var v=op.value;if(!v)v=op.attributes&&op.attributes["value"]&&!op.attributes["value"].specified?
op.text:op.value;if(one)return v;a.push(v)}}return a}return $(el).val()};$.fn.clearForm=function(){return this.each(function(){$("input,select,textarea",this).clearFields()})};$.fn.clearFields=$.fn.clearInputs=function(){return this.each(function(){var t=this.type,tag=this.tagName.toLowerCase();if(t=="text"||t=="password"||tag=="textarea")this.value="";else if(t=="checkbox"||t=="radio")this.checked=false;else if(tag=="select")this.selectedIndex=-1})};$.fn.resetForm=function(){return this.each(function(){if(typeof this.reset==
"function"||typeof this.reset=="object"&&!this.reset.nodeType)this.reset()})};$.fn.enable=function(b){if(b===undefined)b=true;return this.each(function(){this.disabled=!b})};$.fn.selected=function(select){if(select===undefined)select=true;return this.each(function(){var t=this.type;if(t=="checkbox"||t=="radio")this.checked=select;else if(this.tagName.toLowerCase()=="option"){var $sel=$(this).parent("select");if(select&&$sel[0]&&$sel[0].type=="select-one")$sel.find("option").selected(false);this.selected=
select}})};function log(){if($.fn.ajaxSubmit.debug){var msg="[jquery.form] "+Array.prototype.join.call(arguments,"");if(window.console&&window.console.log)window.console.log(msg);else if(window.opera&&window.opera.postError)window.opera.postError(msg)}}})(jQuery);;
(function ($) {

/**
 * Attaches language support to the jQuery UI datepicker component.
 */
Drupal.behaviors.localeDatepicker = {
  attach: function(context, settings) {
    // This code accesses Drupal.settings and localized strings via Drupal.t().
    // So this code should run after these are initialized. By placing it in an
    // attach behavior this is assured.
    $.datepicker.regional['drupal-locale'] = $.extend({
      closeText: Drupal.t('Done'),
      prevText: Drupal.t('Prev'),
      nextText: Drupal.t('Next'),
      currentText: Drupal.t('Today'),
      monthNames: [
        Drupal.t('January'),
        Drupal.t('February'),
        Drupal.t('March'),
        Drupal.t('April'),
        Drupal.t('May'),
        Drupal.t('June'),
        Drupal.t('July'),
        Drupal.t('August'),
        Drupal.t('September'),
        Drupal.t('October'),
        Drupal.t('November'),
        Drupal.t('December')
      ],
      monthNamesShort: [
        Drupal.t('Jan'),
        Drupal.t('Feb'),
        Drupal.t('Mar'),
        Drupal.t('Apr'),
        Drupal.t('May'),
        Drupal.t('Jun'),
        Drupal.t('Jul'),
        Drupal.t('Aug'),
        Drupal.t('Sep'),
        Drupal.t('Oct'),
        Drupal.t('Nov'),
        Drupal.t('Dec')
      ],
      dayNames: [
        Drupal.t('Sunday'),
        Drupal.t('Monday'),
        Drupal.t('Tuesday'),
        Drupal.t('Wednesday'),
        Drupal.t('Thursday'),
        Drupal.t('Friday'),
        Drupal.t('Saturday')
      ],
      dayNamesShort: [
        Drupal.t('Sun'),
        Drupal.t('Mon'),
        Drupal.t('Tue'),
        Drupal.t('Wed'),
        Drupal.t('Thu'),
        Drupal.t('Fri'),
        Drupal.t('Sat')
      ],
      dayNamesMin: [
        Drupal.t('Su'),
        Drupal.t('Mo'),
        Drupal.t('Tu'),
        Drupal.t('We'),
        Drupal.t('Th'),
        Drupal.t('Fr'),
        Drupal.t('Sa')
      ],
      dateFormat: Drupal.t('mm/dd/yy'),
      firstDay: 0,
      isRTL: 0
    }, Drupal.settings.jquery.ui.datepicker);
    $.datepicker.setDefaults($.datepicker.regional['drupal-locale']);
  }
};

})(jQuery);
;
/* http://keith-wood.name/timeEntry.html
   Time entry for jQuery v1.4.8.
   Written by Keith Wood (kbwood{at}iinet.com.au) June 2007.
   Dual licensed under the GPL (http://dev.jquery.com/browser/trunk/jquery/GPL-LICENSE.txt) and
   MIT (http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt) licenses.
   Please attribute the author if you use it. */
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(r($){r 1n(){p.Y=[];p.26=[];p.26[\'\']={1c:B,1d:\':\',1o:\'\',Z:[\'3J\',\'3K\'],2C:[\'3L\',\'3M 2D\',\'3N 2D\',\'3O\',\'3P\']};p.1B={2E:\'\',1C:B,27:[1,1,1],2F:0,2G:L,2H:v,2I:v,2J:v,2K:\'3Q.3R\',1p:[20,20,8],2L:\'\',1D:[40,40,16],2M:B,28:[3S,3T],2N:v,2O:v};$.1q(p.1B,p.26[\'\'])}7 m=\'o\';$.1q(1n.2P,{1e:\'3U\',3V:r(a){1E(p.1B,a||{});u p},2Q:r(b,c){7 d=$(b);q(d.2R(p.1e)){u}7 e={};e.1r=$.1q({},c);e.E=0;e.13=0;e.14=0;e.x=0;e.w=$(b);$.y(b,m,e);7 f=p.t(e,\'2K\');7 g=p.t(e,\'3W\');7 h=p.t(e,\'1p\');7 i=p.t(e,\'2E\');7 j=(!f?v:$(\'<15 1F="3X" 2S="3Y: 3Z-41; \'+\'29: 2T(\\\'\'+f+\'\\\') 0 0 2U-2V; \'+\'2a: \'+h[0]+\'O; 2W: \'+h[1]+\'O;\'+($.K.2X&&$.K.42<\'1.9\'?\' 2Y-U: \'+h[0]+\'O; 2Y-43: \'+(h[1]-18)+\'O;\':\'\')+\'"></15>\'));d.44(\'<15 1F="45"></15>\').2Z(i?\'<15 1F="47">\'+i+\'</15>\':\'\').2Z(j||\'\');d.49(p.1e).17(\'2b.o\',p.2c).17(\'4a.o\',p.30).17(\'4b.o\',p.31).17(\'4c.o\',p.32).17(\'4d.o\',p.33);q($.K.2X){d.17(\'w.o\',r(a){$.o.1f(e)})}q($.K.2d){d.17(\'4e.o\',r(a){1G(r(){$.o.1f(e)},1)})}q(p.t(e,\'2G\')&&$.1H.2e){d.2e(p.34)}q(j){j.3a(p.2f).2g(p.1I).4f(p.3b).2h(p.1I).3c(p.2i)}},4g:r(a){p.2j(a,B)},4h:r(a){p.2j(a,L)},2j:r(b,c){7 d=$.y(b,m);q(!d){u}b.3d=c;q(b.2k&&b.2k.1J.1g()==\'15\'){$.o.1K(d,b.2k,(c?5:-1))}$.o.Y=$.3e($.o.Y,r(a){u(a==b?v:a)});q(c){$.o.Y.4i(b)}},1s:r(a){u $.3f(a,p.Y)>-1},4j:r(a,b,c){7 d=$.y(a,m);q(d){q(1h b==\'1L\'){7 e=b;b={};b[e]=c}7 f=p.1i(d);1E(d.1r,b||{});q(f){p.19(d,F J(0,0,0,f[0],f[1],f[2]))}}$.y(a,m,d)},4k:r(b){$w=$(b);q(!$w.2R(p.1e)){u}$w.4l(p.1e).4m(\'.o\');q($.1H.2e){$w.4n()}p.Y=$.3e(p.Y,r(a){u(a==b?v:a)});$w.4o().4p($w);$.4q(b,m)},4r:r(a,b){7 c=$.y(a,m);q(c){p.19(c,b?(1h b==\'4s\'?F J(b.2l()):b):v)}},3g:r(a){7 b=$.y(a,m);7 c=(b?p.1i(b):v);u(!c?v:F J(0,0,0,c[0],c[1],c[2]))},4t:r(a){7 b=$.y(a,m);7 c=(b?p.1i(b):v);u(!c?0:(c[0]*4u+c[1]*2m+c[2])*3h)},2c:r(a){7 b=(a.1J&&a.1J.1g()==\'w\'?a:p);q($.o.P==b||$.o.1s(b)){$.o.1M=B;u}7 c=$.y(b,m);$.o.1M=L;$.o.P=b;$.o.1j=v;7 d=$.o.t(c,\'2N\');1E(c.1r,(d?d.1N(b,[b]):{}));$.y(b,m,c);$.o.1f(c);1G(r(){$.o.1a(c)},10)},30:r(a){$.o.1j=$.o.P;$.o.P=v},31:r(b){7 c=b.1k;7 d=$.y(c,m);q(!$.o.1M){7 e=$.o.t(d,\'1d\').G+2;d.x=0;q(c.3i!=v){1O(7 f=0;f<=I.1l(1,d.V,d.D);f++){7 g=(f!=d.D?(f*e)+2:(d.D*e)+$.o.t(d,\'1o\').G+$.o.t(d,\'Z\')[0].G);d.x=f;q(c.3i<g){C}}}N q(c.1P){7 h=$(b.3j);7 i=c.1P();7 j=r(a){u{4v:2,4w:4,4x:6}[a]||a};7 k=b.3k+1t.2n.1u-(h.1Q().U+Q(j(h.1v(\'4y-U-2a\')),10))-i.2o;1O(7 f=0;f<=I.1l(1,d.V,d.D);f++){7 g=(f!=d.D?(f*e)+2:(d.D*e)+$.o.t(d,\'1o\').G+$.o.t(d,\'Z\')[0].G);i.4z();i.3l(\'2p\',g);d.x=f;q(k<i.4A){C}}}}$.y(c,m,d);$.o.1a(d);$.o.1M=B},32:r(a){q(a.2q>=48){u L}7 b=$.y(a.1k,m);2r(a.2q){A 9:u(a.4B?$.o.W(b,-1,L):$.o.W(b,+1,L));A 35:q(a.3m){$.o.1R(b,\'\')}N{b.x=I.1l(1,b.V,b.D);$.o.R(b,0)}C;A 36:q(a.3m){$.o.19(b)}N{b.x=0;$.o.R(b,0)}C;A 37:$.o.W(b,-1,B);C;A 38:$.o.R(b,+1);C;A 39:$.o.W(b,+1,B);C;A 40:$.o.R(b,-1);C;A 46:$.o.1R(b,\'\');C}u B},33:r(a){7 b=4C.4D(a.3n==4E?a.2q:a.3n);q(b<\' \'){u L}7 c=$.y(a.1k,m);$.o.3o(c,b);u B},34:r(a,b){q($.o.1s(a.1k)){u}b=($.K.3p?-b/I.1S(b):($.K.2s?b/I.1S(b):b));7 c=$.y(a.1k,m);c.w.2b();q(!c.w.T()){$.o.1f(c)}$.o.R(c,b);a.4F()},3b:r(b){7 c=$.o.1b(b);7 d=$.y($.o.1m(c),m);7 e=$.o.t(d,\'2L\');q(e){d.1T=L;7 f=$(c).1Q();7 g=v;$(c).3q().2t(r(){7 a=$(p);q(a.1v(\'1w\')==\'4G\'||a.1v(\'1w\')==\'3r\'){g=a.1Q()}u!g});7 h=$.o.t(d,\'1p\');7 i=$.o.t(d,\'1D\');$(\'<3s 1F="4H" 2S="1w: 3r; U: \'+(f.U-(i[0]-h[0])/2-(g?g.U:0))+\'O; 1x: \'+(f.1x-(i[1]-h[1])/2-(g?g.1x:0))+\'O; 2a: \'+i[0]+\'O; 2W: \'+i[1]+\'O; 29: 4I 2T(\'+e+\') 2U-2V 2u 2u; z-4J: 10;"></3s>\').3a($.o.2f).2g($.o.1I).2h($.o.3t).3c($.o.2i).4K(c)}},1m:r(a){u $(a).4L(\'.\'+$.o.1e)[0]},2i:r(a){7 b=$.o.1b(a);7 c=$.y($.o.1m(b),m);b.4M=$.o.t(c,\'2C\')[$.o.2v(c,a)]},2f:r(a){7 b=$.o.1b(a);7 c=$.o.1m(b);q($.o.1s(c)){u}q(c==$.o.1j){$.o.P=c;$.o.1j=v}7 d=$.y(c,m);$.o.2c(c);7 e=$.o.2v(d,a);$.o.1K(d,b,e);$.o.2w(d,e);$.o.X=v;$.o.1U=L;7 f=$.o.t(d,\'28\');q(e>=3&&f[0]){$.o.X=1G(r(){$.o.2x(d,e)},f[0]);$(b).3u(\'2h\',$.o.2y).3u(\'2g\',$.o.2y)}},2w:r(a,b){q(!a.w.T()){$.o.1f(a)}2r(b){A 0:p.19(a);C;A 1:p.W(a,-1,B);C;A 2:p.W(a,+1,B);C;A 3:p.R(a,+1);C;A 4:p.R(a,-1);C}},2x:r(a,b){q(!$.o.X){u}$.o.P=$.o.1j;p.2w(a,b);p.X=1G(r(){$.o.2x(a,b)},p.t(a,\'28\')[1])},2y:r(a){4N($.o.X);$.o.X=v},3t:r(a){$.o.X=v;7 b=$.o.1b(a);7 c=$.o.1m(b);7 d=$.y(c,m);$(b).4O();d.1T=B},1I:r(a){$.o.X=v;7 b=$.o.1b(a);7 c=$.o.1m(b);7 d=$.y(c,m);q(!$.o.1s(c)){$.o.1K(d,b,-1)}q($.o.1U){$.o.P=$.o.1j}q($.o.P&&$.o.1U){$.o.1a(d)}$.o.1U=B},1b:r(a){u a.1k||a.3j},2v:r(a,b){7 c=p.1b(b);7 d=($.K.3p||$.K.2s?$.o.3v(c):$(c).1Q());7 e=($.K.2s?$.o.3w(c):[1t.2n.1u||1t.3x.1u,1t.2n.1V||1t.3x.1V]);7 f=p.t(a,\'2M\');7 g=(f?3y:b.3k+e[0]-d.U-($.K.2d?2:0));7 h=b.4P+e[1]-d.1x-($.K.2d?2:0);7 i=p.t(a,(a.1T?\'1D\':\'1p\'));7 j=(f?3y:i[0]-1-g);7 k=i[1]-1-h;q(i[2]>0&&I.1S(g-j)<=i[2]&&I.1S(h-k)<=i[2]){u 0}7 l=I.3z(g,h,j,k);u(l==g?1:(l==j?2:(l==h?3:4)))},1K:r(a,b,c){$(b).1v(\'29-1w\',\'-\'+((c+1)*p.t(a,(a.1T?\'1D\':\'1p\'))[0])+\'O 2u\')},3v:r(a){7 b=1W=0;q(a.3A){b=a.2o;1W=a.3B;2z(a=a.3A){7 c=b;b+=a.2o;q(b<0){b=c}1W+=a.3B}}u{U:b,1x:1W}},3w:r(a){7 b=B;$(a).3q().2t(r(){b|=$(p).1v(\'1w\')==\'4Q\'});q(b){u[0,0]}7 c=a.1u;7 d=a.1V;2z(a=a.4R){c+=a.1u||0;d+=a.1V||0}u[c,d]},t:r(a,b){u(a.1r[b]!=v?a.1r[b]:$.o.1B[b])},1f:r(a){7 b=p.1i(a);7 c=p.t(a,\'1C\');q(b){a.E=b[0];a.13=b[1];a.14=b[2]}N{7 d=p.1y(a);a.E=d[0];a.13=d[1];a.14=(c?d[2]:0)}a.V=(c?2:-1);a.D=(p.t(a,\'1c\')?-1:(c?3:2));a.1X=\'\';a.x=I.1l(0,I.3z(I.1l(1,a.V,a.D),p.t(a,\'2F\')));q(a.w.T()!=\'\'){p.2A(a)}},1i:r(a,b){b=b||a.w.T();7 c=p.t(a,\'1d\');7 d=b.4S(c);q(c==\'\'&&b!=\'\'){d[0]=b.1z(0,2);d[1]=b.1z(2,4);d[2]=b.1z(4,6)}7 e=p.t(a,\'Z\');7 f=p.t(a,\'1c\');q(d.G>=2){7 g=!f&&(b.3C(e[0])>-1);7 h=!f&&(b.3C(e[1])>-1);7 i=Q(d[0],10);i=(2B(i)?0:i);i=((g||h)&&i==12?0:i)+(h?12:0);7 j=Q(d[1],10);j=(2B(j)?0:j);7 k=(d.G>=3?Q(d[2],10):0);k=(2B(k)||!p.t(a,\'1C\')?0:k);u p.1y(a,[i,j,k])}u v},1y:r(a,b){7 c=(b!=v);q(!c){7 d=p.1A(a,p.t(a,\'2H\'))||F J();b=[d.1Y(),d.1Z(),d.21()]}7 e=B;7 f=p.t(a,\'27\');1O(7 i=0;i<f.G;i++){q(e){b[i]=0}N q(f[i]>1){b[i]=I.4T(b[i]/f[i])*f[i];e=L}}u b},2A:r(a){7 b=p.t(a,\'1c\');7 c=p.t(a,\'1d\');7 d=(p.22(b?a.E:((a.E+11)%12)+1)+c+p.22(a.13)+(p.t(a,\'1C\')?c+p.22(a.14):\'\')+(b?\'\':p.t(a,\'1o\')+p.t(a,\'Z\')[(a.E<12?0:1)]));p.1R(a,d);p.1a(a)},1a:r(a){7 b=a.w[0];q(a.w.4U(\':4V\')||$.o.P!=b){u}7 c=p.t(a,\'1d\');7 d=c.G+2;7 e=(a.x!=a.D?(a.x*d):(a.D*d)-c.G+p.t(a,\'1o\').G);7 f=e+(a.x!=a.D?2:p.t(a,\'Z\')[0].G);q(b.3D){b.3D(e,f)}N q(b.1P){7 g=b.1P();g.4W(\'2p\',e);g.3l(\'2p\',f-a.w.T().G);g.4X()}q(!b.3d){b.2b()}},22:r(a){u(a<10?\'0\':\'\')+a},1R:r(a,b){q(b!=a.w.T()){a.w.T(b).4Y(\'4Z\')}},W:r(a,b,c){7 d=(a.w.T()==\'\'||a.x==(b==-1?0:I.1l(1,a.V,a.D)));q(!d){a.x+=b}p.1a(a);a.1X=\'\';$.y(a.w[0],m,a);u(d&&c)},R:r(a,b){q(a.w.T()==\'\'){b=0}7 c=p.t(a,\'27\');p.19(a,F J(0,0,0,a.E+(a.x==0?b*c[0]:0)+(a.x==a.D?b*12:0),a.13+(a.x==1?b*c[1]:0),a.14+(a.x==a.V?b*c[2]:0)))},19:r(a,b){b=p.1A(a,b);7 c=p.1y(a,b?[b.1Y(),b.1Z(),b.21()]:v);b=F J(0,0,0,c[0],c[1],c[2]);7 b=p.25(b);7 d=p.25(p.1A(a,p.t(a,\'2I\')));7 e=p.25(p.1A(a,p.t(a,\'2J\')));b=(d&&b<d?d:(e&&b>e?e:b));7 f=p.t(a,\'2O\');q(f){b=f.1N(a.w[0],[p.3g(a.w[0]),b,d,e])}a.E=b.1Y();a.13=b.1Z();a.14=b.21();p.2A(a);$.y(a.w[0],m,a)},25:r(a){q(!a){u v}a.50(51);a.52(0);a.53(0);u a},1A:r(i,j){7 k=r(a){7 b=F J();b.54(b.2l()+a*3h);u b};7 l=r(a){7 b=$.o.1i(i,a);7 c=F J();7 d=(b?b[0]:c.1Y());7 e=(b?b[1]:c.1Z());7 f=(b?b[2]:c.21());q(!b){7 g=/([+-]?[0-9]+)\\s*(s|S|m|M|h|H)?/g;7 h=g.3E(a);2z(h){2r(h[2]||\'s\'){A\'s\':A\'S\':f+=Q(h[1],10);C;A\'m\':A\'M\':e+=Q(h[1],10);C;A\'h\':A\'H\':d+=Q(h[1],10);C}h=g.3E(a)}}c=F J(0,0,10,d,e,f,0);q(/^!/.55(a)){q(c.3F()>10){c=F J(0,0,10,23,59,59)}N q(c.3F()<10){c=F J(0,0,10,0,0,0)}}u c};u(j?(1h j==\'1L\'?l(j):(1h j==\'56\'?k(j):j)):v)},3o:r(a,b){q(b==p.t(a,\'1d\')){p.W(a,+1,B)}N q(b>=\'0\'&&b<=\'9\'){7 c=Q(b,10);7 d=Q(a.1X+b,10);7 e=p.t(a,\'1c\');7 f=(a.x!=0?a.E:(e?(d<24?d:c):(d>=1&&d<=12?d:(c>0?c:a.E))%12+(a.E>=12?12:0)));7 g=(a.x!=1?a.13:(d<2m?d:c));7 h=(a.x!=a.V?a.14:(d<2m?d:c));7 i=p.1y(a,[f,g,h]);p.19(a,F J(0,0,0,i[0],i[1],i[2]));a.1X=b}N q(!p.t(a,\'1c\')){b=b.1g();7 j=p.t(a,\'Z\');q((b==j[0].1z(0,1).1g()&&a.E>=12)||(b==j[1].1z(0,1).1g()&&a.E<12)){7 k=a.x;a.x=a.D;p.R(a,+1);a.x=k;p.1a(a)}}}});r 1E(a,b){$.1q(a,b);1O(7 c 57 b){q(b[c]==v){a[c]=v}}u a}7 n=[\'58\',\'2l\',\'5a\'];$.1H.o=r(c){7 d=5b.2P.5c.5d(5e,1);q(1h c==\'1L\'&&$.3f(c,n)>-1){u $.o[\'3G\'+c+\'1n\'].1N($.o,[p[0]].3H(d))}u p.2t(r(){7 a=p.1J.1g();q(a==\'w\'){q(1h c==\'1L\'){$.o[\'3G\'+c+\'1n\'].1N($.o,[p].3H(d))}N{7 b=($.1H.3I?$(p).3I():{});$.o.2Q(p,$.1q(b,c))}}})};$.o=F 1n()})(5f);',62,326,'|||||||var|||||||||||||||||timeEntry|this|if|function||_get|return|null|input|_field|data||case|false|break|_ampmField|_selectedHour|new|length||Math|Date|browser|true||else|px|_lastInput|parseInt|_adjustField||val|left|_secondField|_changeField|_timer|_disabledInputs|ampmNames||||_selectedMinute|_selectedSecond|span||bind||_setTime|_showField|_getSpinnerTarget|show24Hours|separator|markerClassName|_parseTime|toLowerCase|typeof|_extractTime|_blurredInput|target|max|_getInput|TimeEntry|ampmPrefix|spinnerSize|extend|options|_isDisabledTimeEntry|document|scrollLeft|css|position|top|_constrainTime|substring|_determineTime|_defaults|showSeconds|spinnerBigSize|extendRemove|class|setTimeout|fn|_endSpinner|nodeName|_changeSpinner|string|_focussed|apply|for|createTextRange|offset|_setValue|abs|_expanded|_handlingSpinner|scrollTop|curTop|_lastChr|getHours|getMinutes||getSeconds|_formatNumber|||_normaliseTime|regional|timeSteps|spinnerRepeat|background|width|focus|_doFocus|msie|mousewheel|_handleSpinner|mouseup|mouseout|_describeSpinner|_enableDisable|nextSibling|getTime|60|documentElement|offsetLeft|character|keyCode|switch|safari|each|0px|_getSpinnerRegion|_actionSpinner|_repeatSpinner|_releaseSpinner|while|_showTime|isNaN|spinnerTexts|field|appendText|initialField|useMouseWheel|defaultTime|minTime|maxTime|spinnerImage|spinnerBigImage|spinnerIncDecOnly|beforeShow|beforeSetTime|prototype|_connectTimeEntry|hasClass|style|url|no|repeat|height|mozilla|padding|after|_doBlur|_doClick|_doKeyDown|_doKeyPress|_doMouseWheel||||||mousedown|_expandSpinner|mousemove|disabled|map|inArray|_getTimeTimeEntry|1000|selectionStart|srcElement|clientX|moveEnd|ctrlKey|charCode|_handleKeyPress|opera|parents|absolute|div|_endExpand|one|_findPos|_findScroll|body|99|min|offsetParent|offsetTop|indexOf|setSelectionRange|exec|getDate|_|concat|metadata|AM|PM|Now|Previous|Next|Increment|Decrement|spinnerDefault|png|500|250|hasTimeEntry|setDefaults|spinnerText|timeEntry_control|display|inline||block|version|bottom|wrap|timeEntry_wrap||timeEntry_append||addClass|blur|click|keydown|keypress|paste|mouseover|_enableTimeEntry|_disableTimeEntry|push|_changeTimeEntry|_destroyTimeEntry|removeClass|unbind|unmousewheel|parent|replaceWith|removeData|_setTimeTimeEntry|object|_getOffsetTimeEntry|3600|thin|medium|thick|border|collapse|boundingWidth|shiftKey|String|fromCharCode|undefined|preventDefault|relative|timeEntry_expand|transparent|index|insertAfter|siblings|title|clearTimeout|remove|clientY|fixed|parentNode|split|round|is|hidden|moveStart|select|trigger|change|setFullYear|1900|setMonth|setDate|setTime|test|number|in|getOffset||isDisabled|Array|slice|call|arguments|jQuery'.split('|'),0,{}));
(function($){Drupal.ajax=Drupal.ajax||{};Drupal.behaviors.AJAX={attach:function(context,settings){for(var base in settings.ajax)if(!$("#"+base+".ajax-processed").length){var element_settings=settings.ajax[base];if(typeof element_settings.selector=="undefined")element_settings.selector="#"+base;$(element_settings.selector).each(function(){element_settings.element=this;Drupal.ajax[base]=new Drupal.ajax(base,this,element_settings)});$("#"+base).addClass("ajax-processed")}$(".use-ajax:not(.ajax-processed)").addClass("ajax-processed").each(function(){var element_settings=
{};element_settings.progress={"type":"throbber"};if($(this).attr("href")){element_settings.url=$(this).attr("href");element_settings.event="click"}var base=$(this).attr("id");Drupal.ajax[base]=new Drupal.ajax(base,this,element_settings)});$(".use-ajax-submit:not(.ajax-processed)").addClass("ajax-processed").each(function(){var element_settings={};element_settings.url=$(this.form).attr("action");element_settings.setClick=true;element_settings.event="click";element_settings.progress={"type":"throbber"};
var base=$(this).attr("id");Drupal.ajax[base]=new Drupal.ajax(base,this,element_settings)})}};Drupal.ajax=function(base,element,element_settings){var defaults={url:"system/ajax",event:"mousedown",keypress:true,selector:"#"+base,effect:"none",speed:"none",method:"replaceWith",progress:{type:"throbber",message:Drupal.t("Please wait...")},submit:{"js":true}};$.extend(this,defaults,element_settings);this.element=element;this.element_settings=element_settings;this.url=element_settings.url.replace(/\/nojs(\/|$|\?|&|#)/g,
"/ajax$1");this.wrapper="#"+element_settings.wrapper;if(this.element.form)this.form=$(this.element.form);var ajax=this;ajax.options={url:ajax.url,data:ajax.submit,beforeSerialize:function(element_settings,options){return ajax.beforeSerialize(element_settings,options)},beforeSubmit:function(form_values,element_settings,options){ajax.ajaxing=true;return ajax.beforeSubmit(form_values,element_settings,options)},beforeSend:function(xmlhttprequest,options){ajax.ajaxing=true;return ajax.beforeSend(xmlhttprequest,
options)},success:function(response,status){if(typeof response=="string")response=$.parseJSON(response);return ajax.success(response,status)},complete:function(response,status){ajax.ajaxing=false;if(status=="error"||status=="parsererror")return ajax.error(response,ajax.url)},dataType:"json",type:"POST"};$(ajax.element).bind(element_settings.event,function(event){return ajax.eventResponse(this,event)});if(element_settings.keypress)$(ajax.element).keypress(function(event){return ajax.keypressResponse(this,
event)});if(element_settings.prevent)$(ajax.element).bind(element_settings.prevent,false)};Drupal.ajax.prototype.keypressResponse=function(element,event){var ajax=this;if(event.which==13||event.which==32&&element.type!="text"&&element.type!="textarea"){$(ajax.element_settings.element).trigger(ajax.element_settings.event);return false}};Drupal.ajax.prototype.eventResponse=function(element,event){var ajax=this;if(ajax.ajaxing)return false;try{if(ajax.form){if(ajax.setClick)element.form.clk=element;
ajax.form.ajaxSubmit(ajax.options)}else{ajax.beforeSerialize(ajax.element,ajax.options);$.ajax(ajax.options)}}catch(e){ajax.ajaxing=false;alert("An error occurred while attempting to process "+ajax.options.url+": "+e.message)}if(typeof element.type!="undefined"&&(element.type=="checkbox"||element.type=="radio"))return true;else return false};Drupal.ajax.prototype.beforeSerialize=function(element,options){if(this.form){var settings=this.settings||Drupal.settings;Drupal.detachBehaviors(this.form,settings,
"serialize")}options.data["ajax_html_ids[]"]=[];$("[id]").each(function(){options.data["ajax_html_ids[]"].push(this.id)});options.data["ajax_page_state[theme]"]=Drupal.settings.ajaxPageState.theme;options.data["ajax_page_state[theme_token]"]=Drupal.settings.ajaxPageState.theme_token;for(var key in Drupal.settings.ajaxPageState.css)options.data["ajax_page_state[css]["+key+"]"]=1;for(var key in Drupal.settings.ajaxPageState.js)options.data["ajax_page_state[js]["+key+"]"]=1};Drupal.ajax.prototype.beforeSubmit=
function(form_values,element,options){};Drupal.ajax.prototype.beforeSend=function(xmlhttprequest,options){if(this.form){options.extraData=options.extraData||{};options.extraData.ajax_iframe_upload="1";var v=$.fieldValue(this.element);if(v!==null)options.extraData[this.element.name]=Drupal.checkPlain(v)}$(this.element).addClass("progress-disabled").attr("disabled",true);if(this.progress.type=="bar"){var progressBar=new Drupal.progressBar("ajax-progress-"+this.element.id,eval(this.progress.update_callback),
this.progress.method,eval(this.progress.error_callback));if(this.progress.message)progressBar.setProgress(-1,this.progress.message);if(this.progress.url)progressBar.startMonitoring(this.progress.url,this.progress.interval||1500);this.progress.element=$(progressBar.element).addClass("ajax-progress ajax-progress-bar");this.progress.object=progressBar;$(this.element).after(this.progress.element)}else if(this.progress.type=="throbber"){this.progress.element=$('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div></div>');
if(this.progress.message)$(".throbber",this.progress.element).after('<div class="message">'+this.progress.message+"</div>");$(this.element).after(this.progress.element)}};Drupal.ajax.prototype.success=function(response,status){if(this.progress.element)$(this.progress.element).remove();if(this.progress.object)this.progress.object.stopMonitoring();$(this.element).removeClass("progress-disabled").removeAttr("disabled");Drupal.freezeHeight();for(var i in response)if(response.hasOwnProperty(i)&&response[i]["command"]&&
this.commands[response[i]["command"]])this.commands[response[i]["command"]](this,response[i],status);if(this.form){var settings=this.settings||Drupal.settings;Drupal.attachBehaviors(this.form,settings)}Drupal.unfreezeHeight();this.settings=null};Drupal.ajax.prototype.getEffect=function(response){var type=response.effect||this.effect;var speed=response.speed||this.speed;var effect={};if(type=="none"){effect.showEffect="show";effect.hideEffect="hide";effect.showSpeed=""}else if(type=="fade"){effect.showEffect=
"fadeIn";effect.hideEffect="fadeOut";effect.showSpeed=speed}else{effect.showEffect=type+"Toggle";effect.hideEffect=type+"Toggle";effect.showSpeed=speed}return effect};Drupal.ajax.prototype.error=function(response,uri){alert(Drupal.ajaxError(response,uri));if(this.progress.element)$(this.progress.element).remove();if(this.progress.object)this.progress.object.stopMonitoring();$(this.wrapper).show();$(this.element).removeClass("progress-disabled").removeAttr("disabled");if(this.form){var settings=response.settings||
this.settings||Drupal.settings;Drupal.attachBehaviors(this.form,settings)}};Drupal.ajax.prototype.commands={insert:function(ajax,response,status){var wrapper=response.selector?$(response.selector):$(ajax.wrapper);var method=response.method||ajax.method;var effect=ajax.getEffect(response);var new_content_wrapped=$("<div></div>").html(response.data);var new_content=new_content_wrapped.contents();if(new_content.length!=1||new_content.get(0).nodeType!=1)new_content=new_content_wrapped;switch(method){case "html":case "replaceWith":case "replaceAll":case "empty":case "remove":var settings=
response.settings||ajax.settings||Drupal.settings;Drupal.detachBehaviors(wrapper,settings)}wrapper[method](new_content);if(effect.showEffect!="show")new_content.hide();if($(".ajax-new-content",new_content).length>0){$(".ajax-new-content",new_content).hide();new_content.show();$(".ajax-new-content",new_content)[effect.showEffect](effect.showSpeed)}else if(effect.showEffect!="show")new_content[effect.showEffect](effect.showSpeed);if(new_content.parents("html").length>0){var settings=response.settings||
ajax.settings||Drupal.settings;Drupal.attachBehaviors(new_content,settings)}},remove:function(ajax,response,status){var settings=response.settings||ajax.settings||Drupal.settings;Drupal.detachBehaviors($(response.selector),settings);$(response.selector).remove()},changed:function(ajax,response,status){if(!$(response.selector).hasClass("ajax-changed")){$(response.selector).addClass("ajax-changed");if(response.asterisk)$(response.selector).find(response.asterisk).append(' <span class="ajax-changed">*</span> ')}},
alert:function(ajax,response,status){alert(response.text,response.title)},css:function(ajax,response,status){$(response.selector).css(response.argument)},settings:function(ajax,response,status){if(response.merge)$.extend(true,Drupal.settings,response.settings);else ajax.settings=response.settings},data:function(ajax,response,status){$(response.selector).data(response.name,response.value)},invoke:function(ajax,response,status){var $element=$(response.selector);$element[response.method].apply($element,
response.arguments)},restripe:function(ajax,response,status){$("> tbody > tr:visible, > tr:visible",$(response.selector)).removeClass("odd even").filter(":even").addClass("odd").end().filter(":odd").addClass("even")},add_css:function(ajax,response,status){$("head").prepend(response.data);var match,importMatch=/^@import url\("(.*)"\);$/igm;if(document.styleSheets[0].addImport&&importMatch.test(response.data)){importMatch.lastIndex=0;while(match=importMatch.exec(response.data))document.styleSheets[0].addImport(match[1])}},
updateBuildId:function(ajax,response,status){$('input[name="form_build_id"][value="'+response["old"]+'"]').val(response["new"])}}})(jQuery);;
(function(D){var beforeSerialize=D.ajax.prototype.beforeSerialize;D.ajax.prototype.beforeSerialize=function(element,options){beforeSerialize.call(this,element,options);options.data["ajax_page_state[jquery_version]"]=D.settings.ajaxPageState.jquery_version}})(Drupal);;

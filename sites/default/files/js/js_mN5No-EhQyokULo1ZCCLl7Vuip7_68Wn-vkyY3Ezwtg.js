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

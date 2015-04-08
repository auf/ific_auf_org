(function(window,name,fn){if(typeof module==="object"&&module&&typeof module.exports==="object")module.exports=fn;else{window[name]=fn;if(typeof define==="function"&&define.amd)define(name,[],function(module){return fn})}})(this,"jRespond",function(win,doc,undefined){return function(breakpoints){var mediaListeners=[];var mediaInit=[];var mediaBreakpoints=breakpoints;var curr="";var prev="";var resizeTimer;var resizeW=0;var resizeTmrFast=100;var resizeTmrSlow=500;var resizeTmrSpd=resizeTmrSlow;var winWidth=
function(){var w=0;if(typeof window.innerWidth!="number")if(!(document.documentElement.clientWidth===0))w=document.documentElement.clientWidth;else w=document.body.clientWidth;else w=window.innerWidth;return w};var addFunction=function(elm){if(elm.length===undefined)addToStack(elm);else for(var i=0;i<elm.length;i++)addToStack(elm[i])};var addToStack=function(elm){var brkpt=elm["breakpoint"];var entr=elm["enter"]||undefined;mediaListeners.push(elm);mediaInit.push(false);if(testForCurr(brkpt)){if(entr!==
undefined)entr.call(null,{entering:curr,exiting:prev});mediaInit[mediaListeners.length-1]=true}};var cycleThrough=function(){var enterArray=[];var exitArray=[];for(var i=0;i<mediaListeners.length;i++){var brkpt=mediaListeners[i]["breakpoint"];var entr=mediaListeners[i]["enter"]||undefined;var exit=mediaListeners[i]["exit"]||undefined;if(brkpt==="*"){if(entr!==undefined)enterArray.push(entr);if(exit!==undefined)exitArray.push(exit)}else if(testForCurr(brkpt)){if(entr!==undefined&&!mediaInit[i])enterArray.push(entr);
mediaInit[i]=true}else{if(exit!==undefined&&mediaInit[i])exitArray.push(exit);mediaInit[i]=false}}var eventObject={entering:curr,exiting:prev};for(var j=0;j<exitArray.length;j++)exitArray[j].call(null,eventObject);for(var k=0;k<enterArray.length;k++)enterArray[k].call(null,eventObject)};var returnBreakpoint=function(width){var foundBrkpt=false;for(var i=0;i<mediaBreakpoints.length;i++)if(width>=mediaBreakpoints[i]["enter"]&&width<=mediaBreakpoints[i]["exit"]){foundBrkpt=true;break}if(foundBrkpt&&
curr!==mediaBreakpoints[i]["label"]){prev=curr;curr=mediaBreakpoints[i]["label"];cycleThrough()}else if(!foundBrkpt&&curr!==""){curr="";cycleThrough()}};var testForCurr=function(elm){if(typeof elm==="object"){if(elm.join().indexOf(curr)>=0)return true}else if(elm==="*")return true;else if(typeof elm==="string")if(curr===elm)return true};var checkResize=function(){var w=winWidth();if(w!==resizeW){resizeTmrSpd=resizeTmrFast;returnBreakpoint(w)}else resizeTmrSpd=resizeTmrSlow;resizeW=w;setTimeout(checkResize,
resizeTmrSpd)};checkResize();return{addFunc:function(elm){addFunction(elm)},getBreakpoint:function(){return curr}}}}(this,this.document));;
(function($) {

// Define jRespond Media queries.
var jRes = jRespond([
	{
		label: 'mobile',
		enter: 0,
		exit: 480
	},{
		label: 'tablet',
		enter: 481,
		exit: 979
	},{
		label: 'desktop',
		enter: 980,
		exit: 9999
	}
]);

// Modify the Search field for module filter.
Drupal.behaviors.adminimal_module_filter_box = {
  attach: function (context, settings) {
    //Add default hint value using the HTML5 placeholder attribute.
    $('input#edit-module-filter-name').attr( "placeholder", Drupal.t('Search') );
  }
};

// Fix some krumo styling.
Drupal.behaviors.krumo_remove_class = {
  attach: function (context, settings) {
  	// Find status messages that has krumo div inside them, and change the classes.
    $('#console .messages.status').has("div.krumo-root").removeClass().addClass( "krumo-wrapper" );
  }
};

// Add media query classes to the body tag.
Drupal.behaviors.adminimal_media_queries = {
	attach: function (context, settings) {
		jRes.addFunc([
			{
				breakpoint: 'mobile',
					enter: function() {
						$( "body" ).addClass( "mq-mobile" );
					},
					exit: function() {
						$( "body" ).removeClass( "mq-mobile" );
					}
			},{
				breakpoint: 'tablet',
					enter: function() {
						$( "body" ).addClass( "mq-tablet" );
					},
					exit: function() {
						$( "body" ).removeClass( "mq-tablet" );
					}
			},{
				breakpoint: 'desktop',
					enter: function() {
						$( "body" ).addClass( "mq-desktop" );
					},
					exit: function() {
						$( "body" ).removeClass( "mq-desktop" );
					}
			}
		]);
	}
};

// Move the active primary tab on mobile to be displayed last. 
Drupal.behaviors.adminimal_move_active_primary_tab = {
	attach: function (context, settings) {
  	// Add primary tabs class to the branding div for the bottom border.
    $('#branding').has("ul.tabs.primary").addClass( "has-primary-tabs" );

		// register enter and exit functions for a single breakpoint
		jRes.addFunc({
			breakpoint: 'mobile',
				enter: function() {
					$( "ul.tabs.primary li.active" ).clone().appendTo( "ul.tabs.primary" ).removeClass( "active" ).addClass( "current" );
					$( "ul.tabs.primary li.active" ).hide();
				},
				exit: function() {
					$( "ul.tabs.primary li.active" ).show();
					$( "ul.tabs.primary li.current" ).hide();
				}
		});
	}
};

})(jQuery);
;

(function($) {

Drupal.admin = Drupal.admin || {};
Drupal.admin.behaviors = Drupal.admin.behaviors || {};

/**
 * @ingroup admin_behaviors
 * @{
 */

/**
 * Apply active trail highlighting based on current path.
 *
 * @todo Not limited to toolbar; move into core?
 */
Drupal.admin.behaviors.toolbarActiveTrail = function (context, settings, $adminMenu) {
  if (settings.admin_menu.toolbar && settings.admin_menu.toolbar.activeTrail) {
    $adminMenu.find('> div > ul > li > a[href="' + settings.admin_menu.toolbar.activeTrail + '"]').addClass('active-trail');
  }
};

/**
 * @} End of "ingroup admin_behaviors".
 */

Drupal.admin.behaviors.shorcutcollapsed = function (context, settings, $adminMenu) {

  // Create the dropdown base 
  $("<li class=\"label\"><a>"+Drupal.t('Shortcuts')+"</a></li>").prependTo("body.menu-render-collapsed div.toolbar-shortcuts ul"); 

}

Drupal.admin.behaviors.shorcutselect = function (context, settings, $adminMenu) {

  // Create the dropdown base
  $("<select id='shortcut-menu'/>").appendTo("body.menu-render-dropdown div.toolbar-shortcuts");
    
  // Create default option "Select"
  $("<option />", {
    "selected"  :  "selected",
    "value"     :  "",
    "text"      :  Drupal.t('Shortcuts')
  }).appendTo("body.menu-render-dropdown div.toolbar-shortcuts select");
    
  // Populate dropdown with menu items
  $("body.menu-render-dropdown div.toolbar-shortcuts a").each(function() {
    var el = $(this);
    $("<option />", {
      "value"   :  el.attr("href"),
      "text"    :  el.text()
    }).appendTo("body.menu-render-dropdown div.toolbar-shortcuts select");
    });
    
  $("body.menu-render-dropdown div.toolbar-shortcuts select").change(function() {
    window.location = $(this).find("option:selected").val();
  });
  
  $('body.menu-render-dropdown div.toolbar-shortcuts ul').remove();

};

})(jQuery);
;
(function($){Drupal.behaviors.tableSelect={attach:function(context,settings){$("th.select-all",context).closest("table").once("table-select",Drupal.tableSelect)}};Drupal.tableSelect=function(){if($("td input:checkbox",this).length==0)return;var table=this,checkboxes,lastChecked;var strings={"selectAll":Drupal.t("Select all rows in this table"),"selectNone":Drupal.t("Deselect all rows in this table")};var updateSelectAll=function(state){$(table).prev("table.sticky-header").andSelf().find("th.select-all input:checkbox").each(function(){$(this).attr("title",
state?strings.selectNone:strings.selectAll);this.checked=state})};$("th.select-all",table).prepend($('<input type="checkbox" class="form-checkbox" />').attr("title",strings.selectAll)).click(function(event){if($(event.target).is("input:checkbox")){checkboxes.each(function(){this.checked=event.target.checked;$(this).closest("tr").toggleClass("selected",this.checked)});updateSelectAll(event.target.checked)}});checkboxes=$("td input:checkbox:enabled",table).click(function(e){$(this).closest("tr").toggleClass("selected",
this.checked);if(e.shiftKey&&lastChecked&&lastChecked!=e.target)Drupal.tableSelectRange($(e.target).closest("tr")[0],$(lastChecked).closest("tr")[0],e.target.checked);updateSelectAll(checkboxes.length==$(checkboxes).filter(":checked").length);lastChecked=e.target})};Drupal.tableSelectRange=function(from,to,state){var mode=from.rowIndex>to.rowIndex?"previousSibling":"nextSibling";for(var i=from[mode];i;i=i[mode]){if(i.nodeType!=1)continue;$(i).toggleClass("selected",state);$("input:checkbox",i).each(function(){this.checked=
state});if(to.nodeType){if(i==to)break}else if($.filter(to,[i]).r.length)break}}})(jQuery);;
(function($){Drupal.behaviors.tableHeader={attach:function(context,settings){if(!$.support.positionFixed)return;$("table.sticky-enabled",context).once("tableheader",function(){$(this).data("drupal-tableheader",new Drupal.tableHeader(this))})}};Drupal.tableHeader=function(table){var self=this;this.originalTable=$(table);this.originalHeader=$(table).children("thead");this.originalHeaderCells=this.originalHeader.find("> tr > th");this.displayWeight=null;this.originalTable.bind("columnschange",function(e,
display){self.widthCalculated=self.displayWeight!==null&&self.displayWeight===display;self.displayWeight=display});this.stickyTable=$('<table class="sticky-header"/>').insertBefore(this.originalTable).css({position:"fixed",top:"0px"});this.stickyHeader=this.originalHeader.clone(true).hide().appendTo(this.stickyTable);this.stickyHeaderCells=this.stickyHeader.find("> tr > th");this.originalTable.addClass("sticky-table");$(window).bind("scroll.drupal-tableheader",$.proxy(this,"eventhandlerRecalculateStickyHeader")).bind("resize.drupal-tableheader",
{calculateWidth:true},$.proxy(this,"eventhandlerRecalculateStickyHeader")).bind("drupalDisplaceAnchor.drupal-tableheader",function(){window.scrollBy(0,-self.stickyTable.outerHeight())}).bind("drupalDisplaceFocus.drupal-tableheader",function(event){if(self.stickyVisible&&event.clientY<self.stickyOffsetTop+self.stickyTable.outerHeight()&&event.$target.closest("sticky-header").length===0)window.scrollBy(0,-self.stickyTable.outerHeight())}).triggerHandler("resize.drupal-tableheader");this.stickyHeader.show()};
Drupal.tableHeader.prototype.eventhandlerRecalculateStickyHeader=function(event){var self=this;var calculateWidth=event.data&&event.data.calculateWidth;this.stickyOffsetTop=Drupal.settings.tableHeaderOffset?eval(Drupal.settings.tableHeaderOffset+"()"):0;this.stickyTable.css("top",this.stickyOffsetTop+"px");var viewHeight=document.documentElement.scrollHeight||document.body.scrollHeight;if(calculateWidth||this.viewHeight!==viewHeight){this.viewHeight=viewHeight;this.vPosition=this.originalTable.offset().top-
4-this.stickyOffsetTop;this.hPosition=this.originalTable.offset().left;this.vLength=this.originalTable[0].clientHeight-100;calculateWidth=true}var hScroll=document.documentElement.scrollLeft||document.body.scrollLeft;var vOffset=(document.documentElement.scrollTop||document.body.scrollTop)-this.vPosition;this.stickyVisible=vOffset>0&&vOffset<this.vLength;this.stickyTable.css({left:-hScroll+this.hPosition+"px",visibility:this.stickyVisible?"visible":"hidden"});if(this.stickyVisible&&(calculateWidth||
!this.widthCalculated)){this.widthCalculated=true;var $that=null;var $stickyCell=null;var display=null;var cellWidth=null;for(var i=0,il=this.originalHeaderCells.length;i<il;i+=1){$that=$(this.originalHeaderCells[i]);$stickyCell=this.stickyHeaderCells.eq($that.index());display=$that.css("display");if(display!=="none"){cellWidth=$that.css("width");if(cellWidth==="auto")cellWidth=$that[0].clientWidth+"px";$stickyCell.css({"width":cellWidth,"display":display})}else $stickyCell.css("display","none")}this.stickyTable.css("width",
this.originalTable.outerWidth())}}})(jQuery);;

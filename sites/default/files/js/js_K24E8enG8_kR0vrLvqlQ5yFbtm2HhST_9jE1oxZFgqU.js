(function($){Drupal.hideEmailAdministratorCheckbox=function(){if($("#edit-update-status-module-1").is(":checked"))$(".form-item-update-status-module-2").show();else $(".form-item-update-status-module-2").hide();$("#edit-update-status-module-1").change(function(){$(".form-item-update-status-module-2").toggle()})};Drupal.behaviors.cleanURLsSettingsCheck={attach:function(context,settings){if(!$("#edit-clean-url").length||$("#edit-clean-url.install").once("clean-url").length)return;var url=settings.basePath+
"admin/config/search/clean-urls/check";$.ajax({url:location.protocol+"//"+location.host+url,dataType:"json",success:function(){location=settings.basePath+"admin/config/search/clean-urls"}})}};Drupal.cleanURLsInstallCheck=function(){var url=location.protocol+"//"+location.host+Drupal.settings.basePath+"admin/config/search/clean-urls/check";$.ajax({async:false,url:url,dataType:"json",success:function(){$("#edit-clean-url").attr("value",1)}})};Drupal.behaviors.copyFieldValue={attach:function(context,
settings){for(var sourceId in settings.copyFieldValue)$("#"+sourceId,context).once("copy-field-values").bind("blur",function(){var targetIds=settings.copyFieldValue[sourceId];for(var delta in targetIds){var targetField=$("#"+targetIds[delta]);if(targetField.val()=="")targetField.val(this.value)}})}};Drupal.behaviors.dateTime={attach:function(context,settings){for(var fieldName in settings.dateTime)if(settings.dateTime.hasOwnProperty(fieldName))(function(fieldSettings,fieldName){var source="#edit-"+
fieldName;var suffix=source+"-suffix";$("input"+source,context).once("date-time").keyup(function(){var input=$(this);var url=fieldSettings.lookup+(/\?q=/.test(fieldSettings.lookup)?"&format=":"?format=")+encodeURIComponent(input.val());$.getJSON(url,function(data){$(suffix).empty().append(" "+fieldSettings.text+": <em>"+data+"</em>")})})})(settings.dateTime[fieldName],fieldName)}};Drupal.behaviors.pageCache={attach:function(context,settings){$("#edit-cache-0",context).change(function(){$("#page-compression-wrapper").hide();
$("#cache-error").hide()});$("#edit-cache-1",context).change(function(){$("#page-compression-wrapper").show();$("#cache-error").hide()});$("#edit-cache-2",context).change(function(){$("#page-compression-wrapper").show();$("#cache-error").show()})}}})(jQuery);;
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

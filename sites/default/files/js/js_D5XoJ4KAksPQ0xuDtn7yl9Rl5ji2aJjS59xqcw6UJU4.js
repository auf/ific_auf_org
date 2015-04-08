
/**
 *  @file
 *  Attach Media ckeditor behaviors.
 */

(function ($) {
  Drupal.media = Drupal.media || {};

  Drupal.settings.ckeditor.plugins['media'] = {

    /**
       * Initializes the tag map.
       */
    initializeTagMap: function () {
      if (typeof Drupal.settings.tagmap == 'undefined') {
        Drupal.settings.tagmap = { };
      }
    },
    /**
       * Execute the button.
       */
    invoke: function (data, settings, instanceId) {
      if (data.format == 'html') {
        Drupal.media.popups.mediaBrowser(function (mediaFiles) {
          Drupal.settings.ckeditor.plugins['media'].mediaBrowserOnSelect(mediaFiles, instanceId);
        }, settings['global']);
      }
    },

    /**
       * Respond to the mediaBrowser's onSelect event.
       */
    mediaBrowserOnSelect: function (mediaFiles, instanceId) {
      var mediaFile = mediaFiles[0];
      var options = {};
      Drupal.media.popups.mediaStyleSelector(mediaFile, function (formattedMedia) {
        Drupal.settings.ckeditor.plugins['media'].insertMediaFile(mediaFile, formattedMedia.type, formattedMedia.html, formattedMedia.options, CKEDITOR.instances[instanceId]);
      }, options);

      return;
    },

    insertMediaFile: function (mediaFile, viewMode, formattedMedia, options, ckeditorInstance) {

      this.initializeTagMap();
      // @TODO: the folks @ ckeditor have told us that there is no way
      // to reliably add wrapper divs via normal HTML.
      // There is some method of adding a "fake element"
      // But until then, we're just going to embed to img.
      // This is pretty hacked for now.
      //
      var imgElement = $(this.stripDivs(formattedMedia));
      this.addImageAttributes(imgElement, mediaFile.fid, viewMode, options);

      var toInsert = this.outerHTML(imgElement);
      // Create an inline tag
      var inlineTag = Drupal.settings.ckeditor.plugins['media'].createTag(imgElement);
      // Add it to the tag map in case the user switches input formats
      Drupal.settings.tagmap[inlineTag] = toInsert;
      ckeditorInstance.insertHtml(toInsert);
    },

    /**
       * Gets the HTML content of an element
       *
       * @param jQuery element
       */
    outerHTML: function (element) {
      return $('<div>').append( element.eq(0).clone() ).html();
    },

    addImageAttributes: function (imgElement, fid, view_mode, additional) {
      imgElement.addClass('media-image');

      this.forceAttributesIntoClass(imgElement, fid, view_mode, additional);
    },

    /**
       * Due to problems handling wrapping divs in ckeditor, this is needed.
       *
       * Going forward, if we don't care about supporting other editors
       * we can use the fakeobjects plugin to ckeditor to provide cleaner
       * transparency between what Drupal will output <div class="field..."><img></div>
       * instead of just <img>, for now though, we're going to remove all the stuff surrounding the images.
       *
       * @param String formattedMedia
       *  Element containing the image
       *
       * @return HTML of <img> tag inside formattedMedia
       */
    stripDivs: function (formattedMedia) {
      // Check to see if the image tag has divs to strip
      var stripped = null;
      if ($(formattedMedia).is('img')) {
        stripped = this.outerHTML($(formattedMedia));
      } else {
        stripped = this.outerHTML($('img', $(formattedMedia)));
      }
      // This will fail if we pass the img tag without anything wrapping it, like we do when re-enabling ckeditor
      return stripped;
    },

    /**
       * Attach function, called when a rich text editor loads.
       * This finds all [[tags]] and replaces them with the html
       * that needs to show in the editor.
       *
       */
    attach: function (content, settings, instanceId) {
      var matches = content.match(/\[\[.*?\]\]/g);
      this.initializeTagMap();
      var tagmap = Drupal.settings.tagmap;
      if (matches) {
        var inlineTag = "";
        for (i = 0; i < matches.length; i++) {
          inlineTag = matches[i];
          if (tagmap[inlineTag]) {
            // This probably needs some work...
            // We need to somehow get the fid propogated here.
            // We really want to
            var tagContent = tagmap[inlineTag];
            var mediaMarkup = this.stripDivs(tagContent); // THis is <div>..<img>

            var _tag = inlineTag;
            _tag = _tag.replace('[[','');
            _tag = _tag.replace(']]','');
            mediaObj = JSON.parse(_tag);

            var imgElement = $(mediaMarkup);
            this.addImageAttributes(imgElement, mediaObj.fid, mediaObj.view_mode);
            var toInsert = this.outerHTML(imgElement);
            content = content.replace(inlineTag, toInsert);
          }
          else {
            debug.debug("Could not find content for " + inlineTag);
          }
        }
      }
      return content;
    },

    /**
       * Detach function, called when a rich text editor detaches
       */
    detach: function (content, settings, instanceId) {
      var content = $('<div>' + content + '</div>');
      $('img.media-image',content).each(function (elem) {
        var tag = Drupal.settings.ckeditor.plugins['media'].createTag($(this));
        $(this).replaceWith(tag);
        var newContent = content.html();
        var tagContent = $('<div></div>').append($(this)).html();
        Drupal.settings.tagmap[tag] = tagContent;
      });
      return content.html();
    },

    /**
       * @param jQuery imgNode
       *  Image node to create tag from
       */
    createTag: function (imgNode) {
      // Currently this is the <img> itself
      // Collect all attribs to be stashed into tagContent
      var mediaAttributes = {};
      var imgElement = imgNode[0];
      var sorter = [];

      // @todo: this does not work in IE, width and height are always 0.
      for (i=0; i< imgElement.attributes.length; i++) {
        var attr = imgElement.attributes[i];
        if (attr.specified == true) {
          if (attr.name !== 'class') {
            sorter.push(attr);
          }
          else {
            // Exctract expando properties from the class field.
            var attributes = this.getAttributesFromClass(attr.value);
            for (var name in attributes) {
              if (attributes.hasOwnProperty(name)) {
                var value = attributes[name];
                if (value.type && value.type === 'attr') {
                  sorter.push(value);
                }
              }
            }
          }
        }
      }

      sorter.sort(this.sortAttributes);

      for (var prop in sorter) {
        mediaAttributes[sorter[prop].name] = sorter[prop].value;
      }

      // The following 5 ifs are dedicated to IE7
      // If the style is null, it is because IE7 can't read values from itself
      if (jQuery.browser.msie && jQuery.browser.version == '7.0') {
        if (mediaAttributes.style === "null") {
          var imgHeight = imgNode.css('height');
          var imgWidth = imgNode.css('width');
          mediaAttributes.style = {
            height: imgHeight,
            width: imgWidth
          }
          if (!mediaAttributes['width']) {
            mediaAttributes['width'] = imgWidth;
          }
          if (!mediaAttributes['height']) {
            mediaAttributes['height'] = imgHeight;
          }
        }
        // If the attribute width is zero, get the CSS width
        if (Number(mediaAttributes['width']) === 0) {
          mediaAttributes['width'] = imgNode.css('width');
        }
        // IE7 does support 'auto' as a value of the width attribute. It will not
        // display the image if this value is allowed to pass through
        if (mediaAttributes['width'] === 'auto') {
          delete mediaAttributes['width'];
        }
        // If the attribute height is zero, get the CSS height
        if (Number(mediaAttributes['height']) === 0) {
          mediaAttributes['height'] = imgNode.css('height');
        }
        // IE7 does support 'auto' as a value of the height attribute. It will not
        // display the image if this value is allowed to pass through
        if (mediaAttributes['height'] === 'auto') {
          delete mediaAttributes['height'];
        }
      }

      // Remove elements from attribs using the blacklist
      for (var blackList in Drupal.settings.media.blacklist) {
        delete mediaAttributes[Drupal.settings.media.blacklist[blackList]];
      }
      tagContent = {
        "type": 'media',
        // @todo: This will be selected from the format form
        "view_mode": attributes['view_mode'].value,
        "fid" : attributes['fid'].value,
        "attributes": mediaAttributes
      };
      return '[[' + JSON.stringify(tagContent) + ']]';
    },

    /**
       * Forces custom attributes into the class field of the specified image.
       *
       * Due to a bug in some versions of Firefox
       * (http://forums.mozillazine.org/viewtopic.php?f=9&t=1991855), the
       * custom attributes used to share information about the image are
       * being stripped as the image markup is set into the rich text
       * editor.  Here we encode these attributes into the class field so
       * the data survives.
       *
       * @param imgElement
       *   The image
       * @fid
       *   The file id.
       * @param view_mode
       *   The view mode.
       * @param additional
       *   Additional attributes to add to the image.
       */
    forceAttributesIntoClass: function (imgElement, fid, view_mode, additional) {
      var wysiwyg = imgElement.attr('wysiwyg');
      if (wysiwyg) {
        imgElement.addClass('attr__wysiwyg__' + wysiwyg);
      }
      var format = imgElement.attr('format');
      if (format) {
        imgElement.addClass('attr__format__' + format);
      }
      var typeOf = imgElement.attr('typeof');
      if (typeOf) {
        imgElement.addClass('attr__typeof__' + typeOf);
      }
      if (fid) {
        imgElement.addClass('img__fid__' + fid);
      }
      if (view_mode) {
        imgElement.addClass('img__view_mode__' + view_mode);
      }
      if (additional) {
        for (var name in additional) {
          if (additional.hasOwnProperty(name)) {
            if (name !== 'alt') {
              imgElement.addClass('attr__' + name + '__' + additional[name]);
            }
          }
        }
      }
    },

    /**
       * Retrieves encoded attributes from the specified class string.
       *
       * @param classString
       *   A string containing the value of the class attribute.
       * @return
       *   An array containing the attribute names as keys, and an object
       *   with the name, value, and attribute type (either 'attr' or
       *   'img', depending on whether it is an image attribute or should
       *   be it the attributes section)
       */
    getAttributesFromClass: function (classString) {
      var actualClasses = [];
      var otherAttributes = [];
      var classes = classString.split(' ');
      var regexp = new RegExp('^(attr|img)__([^\S]*)__([^\S]*)$');
      for (var index = 0; index < classes.length; index++) {
        var matches = classes[index].match(regexp);
        if (matches && matches.length === 4) {
          otherAttributes[matches[2]] = {
            name: matches[2],
            value: matches[3],
            type: matches[1]
          };
        }
        else {
          actualClasses.push(classes[index]);
        }
      }
      if (actualClasses.length > 0) {
        otherAttributes['class'] = {
          name: 'class',
          value: actualClasses.join(' '),
          type: 'attr'
        };
      }
      return otherAttributes;
    },

    sortAttributes: function (a, b) {
      var nameA = a.name.toLowerCase();
      var nameB = b.name.toLowerCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    }
  };

})(jQuery);
;
/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/
if (typeof window.CKEDITOR_BASEPATH === 'undefined') {
  window.CKEDITOR_BASEPATH = Drupal.settings.ckeditor.editor_path;
}
(function ($) {
  Drupal.ckeditor = (typeof(CKEDITOR) != 'undefined');
  Drupal.ckeditor_ver = false;

  Drupal.ckeditorToggle = function(textarea_ids, TextTextarea, TextRTE){
    if (!CKEDITOR.env.isCompatible) {
      return;
    }

    for (i=0; i<textarea_ids.length; i++){
      if (typeof(CKEDITOR.instances) != 'undefined' && typeof(CKEDITOR.instances[textarea_ids[i]]) != 'undefined'){
        Drupal.ckeditorOff(textarea_ids[i]);
        $('#switch_' + textarea_ids[i]).text(TextRTE);
      }
      else {
        Drupal.ckeditorOn(textarea_ids[i]);
        $('#switch_' + textarea_ids[i]).text(TextTextarea);
      }
    }
  };

  /**
 * CKEditor starting function
 *
 * @param string textarea_id
 */
  Drupal.ckeditorInit = function(textarea_id) {
    var ckeditor_obj = Drupal.settings.ckeditor;
    $("#" + textarea_id).next(".grippie").css("display", "none");
    $("#" + textarea_id).addClass("ckeditor-processed");

    var textarea_settings = false;
    ckeditor_obj.input_formats[ckeditor_obj.elements[textarea_id]].toolbar = eval(ckeditor_obj.input_formats[ckeditor_obj.elements[textarea_id]].toolbar);
    textarea_settings = ckeditor_obj.input_formats[ckeditor_obj.elements[textarea_id]];

    var drupalTopToolbar = $('#toolbar, #admin-menu', Drupal.overlayChild ? window.parent.document : document);

    textarea_settings['on'] =
    {
      configLoaded  : function(ev)
      {
        Drupal.ckeditor_ver = CKEDITOR.version.split('.')[0];
        if (Drupal.ckeditor_ver == 3) {
          ev.editor.addCss(ev.editor.config.extraCss);
        }
        else {
          CKEDITOR.addCss(ev.editor.config.extraCss);
        }
        // Let Drupal trigger formUpdated event [#1895278]
        ev.editor.on('change', function(ev) {
          $(ev.editor.element.$).trigger('change');
        });
        ev.editor.on('blur', function(ev) {
          $(ev.editor.element.$).trigger('blur');
        });
        ev.editor.on('focus', function(ev) {
          $(ev.editor.element.$).trigger('click');
        });
      },
      instanceReady : function(ev)
      {
        var body = $(ev.editor.document.$.body);
        if (typeof(ev.editor.dataProcessor.writer.setRules) != 'undefined') {
          ev.editor.dataProcessor.writer.setRules('p', {
            breakAfterOpen: false
          });

          if (typeof(ckeditor_obj.input_formats[ckeditor_obj.elements[textarea_id]].custom_formatting) != 'undefined') {
            var dtd = CKEDITOR.dtd;
            for ( var e in CKEDITOR.tools.extend( {}, dtd.$block, dtd.$listItem, dtd.$tableContent ) ) {
              ev.editor.dataProcessor.writer.setRules( e, ckeditor_obj.input_formats[ckeditor_obj.elements[textarea_id]].custom_formatting);
            }
            ev.editor.dataProcessor.writer.setRules( 'pre',
            {
              indent: ckeditor_obj.input_formats[ckeditor_obj.elements[textarea_id]].output_pre_indent
            });
          }
        }

        if (ev.editor.config.bodyClass)
          body.addClass(ev.editor.config.bodyClass);
        if (ev.editor.config.bodyId)
          body.attr('id', ev.editor.config.bodyId);
        if (typeof(Drupal.smileysAttach) != 'undefined' && typeof(ev.editor.dataProcessor.writer) != 'undefined')
          ev.editor.dataProcessor.writer.indentationChars = '    ';

        // Let Drupal trigger formUpdated event [#1895278]
        ((ev.editor.editable && ev.editor.editable()) || ev.editor.document.getBody()).on( 'keyup', function() {
          $(ev.editor.element.$).trigger('keyup');
        });
        ((ev.editor.editable && ev.editor.editable()) || ev.editor.document.getBody()).on( 'keydown', function() {
          $(ev.editor.element.$).trigger('keydown');
        });
      },
      focus : function(ev)
      {
        Drupal.ckeditorInstance = ev.editor;
        Drupal.ckeditorActiveId = ev.editor.name;
      },
      afterCommandExec: function(ev)
      {
        if (ev.data.name != 'maximize') {
          return;
        }
        if (ev.data.command.state == CKEDITOR.TRISTATE_ON) {
          drupalTopToolbar.hide();
        } else {
          drupalTopToolbar.show();
        }
      }
    };

    if (typeof Drupal.settings.ckeditor.scayt_language != 'undefined'){
      textarea_settings['scayt_sLang'] = Drupal.settings.ckeditor.scayt_language;
    }

    if (typeof textarea_settings['js_conf'] != 'undefined'){
      for (var add_conf in textarea_settings['js_conf']){
        textarea_settings[add_conf] = eval(textarea_settings['js_conf'][add_conf]);
      }
    }

    //remove width 100% from settings because this may cause problems with theme css
    if (textarea_settings.width == '100%') textarea_settings.width = '';

    if (CKEDITOR.loadFullCore) {
      CKEDITOR.on('loaded', function() {
        textarea_settings = Drupal.ckeditorLoadPlugins(textarea_settings);
        Drupal.ckeditorInstance = CKEDITOR.replace(textarea_id, textarea_settings);
      });
      CKEDITOR.loadFullCore();
    }
    else {
      textarea_settings = Drupal.ckeditorLoadPlugins(textarea_settings);
      Drupal.ckeditorInstance = CKEDITOR.replace(textarea_id, textarea_settings);
    }
  }

  Drupal.ckeditorOn = function(textarea_id, run_filter) {

    run_filter = typeof(run_filter) != 'undefined' ? run_filter : true;

    if (typeof(textarea_id) == 'undefined' || textarea_id.length == 0 || $("#" + textarea_id).length == 0) {
      return;
    }
    if ((typeof(Drupal.settings.ckeditor.load_timeout) == 'undefined') && (typeof(CKEDITOR.instances[textarea_id]) != 'undefined')) {
      return;
    }
    if (typeof(Drupal.settings.ckeditor.elements[textarea_id]) == 'undefined') {
      return;
    }
    var ckeditor_obj = Drupal.settings.ckeditor;

    if (!CKEDITOR.env.isCompatible) {
      return;
    }

    if (run_filter && ($("#" + textarea_id).val().length > 0) && typeof(ckeditor_obj.input_formats[ckeditor_obj.elements[textarea_id]]) != 'undefined' && ((ckeditor_obj.input_formats[ckeditor_obj.elements[textarea_id]]['ss'] == 1 && typeof(Drupal.settings.ckeditor.autostart) != 'undefined' && typeof(Drupal.settings.ckeditor.autostart[textarea_id]) != 'undefined') || ckeditor_obj.input_formats[ckeditor_obj.elements[textarea_id]]['ss'] == 2)) {
      $.ajax({
        type: 'POST',
        url: Drupal.settings.ckeditor.xss_url,
        async: false,
        data: {
          text: $('#' + textarea_id).val(),
          input_format: ckeditor_obj.textarea_default_format[textarea_id],
          token: Drupal.settings.ckeditor.ajaxToken
        },
        success: function(text){
          $("#" + textarea_id).val(text);
          Drupal.ckeditorInit(textarea_id);
        }
      })
    }
    else {
      Drupal.ckeditorInit(textarea_id);
    }
  };

  /**
 * CKEditor destroy function
 *
 * @param string textarea_id
 */
  Drupal.ckeditorOff = function(textarea_id) {
    if (!CKEDITOR.instances || typeof(CKEDITOR.instances[textarea_id]) == 'undefined') {
      return;
    }
    if (!CKEDITOR.env.isCompatible) {
      return;
    }
    if (Drupal.ckeditorInstance && Drupal.ckeditorInstance.name == textarea_id)
      delete Drupal.ckeditorInstance;

    $("#" + textarea_id).val(CKEDITOR.instances[textarea_id].getData());
    CKEDITOR.instances[textarea_id].destroy(true);

    $("#" + textarea_id).next(".grippie").css("display", "block");
  };

  /**
* Loading selected CKEditor plugins
*
* @param object textarea_settings
*/
  Drupal.ckeditorLoadPlugins = function(textarea_settings) {
    if (typeof(textarea_settings.extraPlugins) == 'undefined') {
      textarea_settings.extraPlugins = '';
    }
    if (typeof CKEDITOR.plugins != 'undefined') {
      for (var plugin in textarea_settings['loadPlugins']) {
        if (typeof(textarea_settings['loadPlugins'][plugin]['active']) == 'undefined' || textarea_settings['loadPlugins'][plugin]['active'] == 1) {
          textarea_settings.extraPlugins += (textarea_settings.extraPlugins) ? ',' + textarea_settings['loadPlugins'][plugin]['name'] : textarea_settings['loadPlugins'][plugin]['name'];
          CKEDITOR.plugins.addExternal(textarea_settings['loadPlugins'][plugin]['name'], textarea_settings['loadPlugins'][plugin]['path']);
        }
      }
    }
    return textarea_settings;
  }

  /**
 * Returns true if CKEDITOR.version >= version
 */
  Drupal.ckeditorCompareVersion = function (version){
    var ckver = CKEDITOR.version;
    ckver = ckver.match(/(([\d]\.)+[\d]+)/i);
    version = version.match(/((\d+\.)+[\d]+)/i);
    ckver = ckver[0].split('.');
    version = version[0].split('.');
    for (var x in ckver) {
      if (ckver[x]<version[x]) {
        return false;
      }
      else if (ckver[x]>version[x]) {
        return true;
      }
    }
    return true;
  };

  Drupal.ckeditorInsertHtml = function(html) {
    if (!Drupal.ckeditorInstance)
      return false;

    if (Drupal.ckeditorInstance.mode == 'wysiwyg') {
      Drupal.ckeditorInstance.insertHtml(html);
      return true;
    }
    else {
      alert(Drupal.t('Content can only be inserted into CKEditor in the WYSIWYG mode.'));
      return false;
    }
  };

  /**
 * Ajax support
 */
  if (typeof(Drupal.Ajax) != 'undefined' && typeof(Drupal.Ajax.plugins) != 'undefined') {
    Drupal.Ajax.plugins.CKEditor = function(hook, args) {
      if (hook === 'submit' && typeof(CKEDITOR.instances) != 'undefined') {
        for (var i in CKEDITOR.instances)
          CKEDITOR.instances[i].updateElement();
      }
      return true;
    };
  }

  //Support for Panels [#679976]
  Drupal.ckeditorSubmitAjaxForm = function () {
    if (typeof(CKEDITOR.instances) != 'undefined' && typeof(CKEDITOR.instances['edit-body']) != 'undefined') {
      Drupal.ckeditorOff('edit-body');
    }
  };

  function attachCKEditor(context) {
    // make sure the textarea behavior is run first, to get a correctly sized grippie
    if (Drupal.behaviors.textarea && Drupal.behaviors.textarea.attach) {
      Drupal.behaviors.textarea.attach(context);
    }

    $(context).find("textarea.ckeditor-mod:not(.ckeditor-processed)").each(function () {
      var ta_id=$(this).attr("id");
      if (CKEDITOR.instances && typeof(CKEDITOR.instances[ta_id]) != 'undefined'){
        Drupal.ckeditorOff(ta_id);
      }

      if ((typeof(Drupal.settings.ckeditor.autostart) != 'undefined') && (typeof(Drupal.settings.ckeditor.autostart[ta_id]) != 'undefined')) {
        Drupal.ckeditorOn(ta_id);
      }

      if (typeof(Drupal.settings.ckeditor.input_formats[Drupal.settings.ckeditor.elements[ta_id]]) != 'undefined') {
        $('.ckeditor_links').show();
      }

      var sel_format = $("#" + ta_id.substr(0, ta_id.lastIndexOf("-")) + "-format--2");
      if (sel_format && sel_format.not('.ckeditor-processed')) {
        sel_format.addClass('ckeditor-processed').change(function() {
          Drupal.settings.ckeditor.elements[ta_id] = $(this).val();
          if (CKEDITOR.instances && typeof(CKEDITOR.instances[ta_id]) != 'undefined') {
            $('#'+ta_id).val(CKEDITOR.instances[ta_id].getData());
          }
          Drupal.ckeditorOff(ta_id);
          if (typeof(Drupal.settings.ckeditor.input_formats[$(this).val()]) != 'undefined'){
            if ($('#'+ta_id).hasClass('ckeditor-processed')) {
              Drupal.ckeditorOn(ta_id, false);
            }
            else {
              Drupal.ckeditorOn(ta_id);
            }
            $('#switch_'+ta_id).show();
          }
          else {
            $('#switch_'+ta_id).hide();
          }
        });
      }
    });
  }

  /**
 * Drupal behaviors
 */
  Drupal.behaviors.ckeditor = {
    attach:
    function (context) {
      // If CKEDITOR is undefined and script is loaded from CDN, wait up to 15 seconds until it loads [#2244817]
      if ((typeof(CKEDITOR) == 'undefined') && Drupal.settings.ckeditor.editor_path.match(/^(http(s)?:)?\/\//i)) {
        if (typeof(Drupal.settings.ckeditor.loadAttempts) == 'undefined') {
          Drupal.settings.ckeditor.loadAttempts = 50;
        }
        if (Drupal.settings.ckeditor.loadAttempts > 0) {
          Drupal.settings.ckeditor.loadAttempts--;
          window.setTimeout(function() {
            Drupal.behaviors.ckeditor.attach(context);
          }, 300);
        }
        return;
      }
      if ((typeof(CKEDITOR) == 'undefined') || !CKEDITOR.env.isCompatible) {
        return;
      }
      attachCKEditor(context);
    },
    detach:
    function(context, settings, trigger){
      $(context).find("textarea.ckeditor-mod.ckeditor-processed").each(function () {
        var ta_id=$(this).attr("id");
        if (CKEDITOR.instances[ta_id])
          $('#'+ta_id).val(CKEDITOR.instances[ta_id].getData());
        if(trigger != 'serialize') {
          Drupal.ckeditorOff(ta_id);
          $(this).removeClass('ckeditor-processed');
        }
      });
    }
  };

  // Support CTools detach event.
  $(document).bind('CToolsDetachBehaviors', function(event, context) {
    Drupal.behaviors.ckeditor.detach(context, {}, 'unload');
  });
})(jQuery);

/**
 * IMCE support
 */
var ckeditor_imceSendTo = function (file, win){
  var cfunc = win.location.href.split('&');

  for (var x in cfunc) {
    if (cfunc[x].match(/^CKEditorFuncNum=\d+$/)) {
      cfunc = cfunc[x].split('=');
      break;
    }
  }
  CKEDITOR.tools.callFunction(cfunc[1], file.url);
  win.close();
}

;

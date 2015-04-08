<?php
/**
 * @see bootstrap_preprocess_html()
 * @see template_preprocess()
 * @see template_preprocess_html()
 * @see template_process()
 *
 * @ingroup themeable
 */
?>
<!DOCTYPE>
<html  lang="<?php print $language->language;?>" dir="<?php print $language->dir;?>"<?php print $rdf_namespaces;?>>
  <head profile="<?php print $grddl_profile;?>">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php print $head;?>
    <title><?php print $head_title;?></title>
    <?php print $styles;?>
    <!-- HTML5 element support for IE6-8 -->
    <!--[if lt IE 9]>
    <script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
    <?php print $scripts;?>
  </head>
  <body class="<?php print $classes;?>" <?php print $attributes;?>>
    <div id="skip-link">
      <a href="#main-content" class="element-invisible element-focusable"><?php print t('Skip to main content');?></a>
    </div>
    <?php print $page_top;?>
    <?php print $page;?>
    <?php print $page_bottom;?>
    <?php drupal_add_js('jQuery(document).ready(function () {   jQuery(".bef-datepicker").datepicker();});', 'inline');?>
<script>
    jQuery(document).ready(function($) {if($("#owl-example").children().length == 0  && $("#owl-video").children().length == 0){$(".pane-galerie h2,.panel-video h2").empty();}
    jQuery("ul li.expanded a" ).click(function() {var href= jQuery(this).attr( 'href' );location.href=href;}); });
</script>
  </body>
</html>
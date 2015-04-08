<?php
/*
 * @see bootstrap_preprocess_page()
 * @see template_preprocess()
 * @see template_preprocess_page()
 * @see bootstrap_process_page()
 * @see template_process()
 * @see html.tpl.php
 *
 * @ingroup themeable
 */
?>
<div class="header-top"></div>
<header id="navbar" role="banner" class="<?php print $navbar_classes;?>">
  <div class="container">
    <div class="navbar-header">
      <?php if ($logo): ?>
      <a class="logo navbar-btn pull-left" href="<?php print $front_page;?>" title="<?php print t('Home');?>">
        <img src="<?php print $logo;?>" alt="<?php print t('Home');?>" />
      </a>
      <?php endif;?>
      <?php if (!empty($site_name)): ?>
      <a class="name navbar-brand" href="<?php print $front_page;?>" title="<?php print t('Home');?>"><?php print $site_name;?></a>
      <?php endif;?>
      <!-- .btn-navbar is used as the toggle for collapsed navbar content -->
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
      <span class="sr-only">Toggle navigation</span>
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
      </button>
    </div>
    <?php if (!empty($page['navigation'])): ?>
        <?php print render($page['navigation']);?>
        <?php endif;?>
    <?php if (!empty($primary_nav) || !empty($secondary_nav) || !empty($page['navigation'])): ?>
    <div class="navbar-collapse collapse">
      <nav role="navigation">
        <?php if (!empty($primary_nav)): ?>
        <?php print render($primary_nav);?>
        <?php endif;?>
        <?php if (!empty($secondary_nav)): ?>
        <?php //print render($secondary_nav); ?>
        <?php endif;?>
      </nav>
    </div>
    <?php endif;?>
    <div class="header-colors">
      <div class="colorBlue"></div>
      <div class="colorYellow"></div>
      <div class="colorGreen"></div>
      <div class="colorPurple"></div>
      <div class="colorRed"></div>
    </div>
    <div class="auf-header logo-auf"></div>
  </div>
</header>
<div role="banner" id="page-header">
  <div class="container">
    <div class="header-btm"></div>
    <?php if (!empty($site_slogan)): ?>
    <p class="lead"><?php print $site_slogan;?></p>
    <?php endif;?>
    <?php print render($page['header']);?>
    </div> <!-- /#page-header -->
  </div>
  <div class="main-container container ">
    <div class="row">
      <?php if (!empty($breadcrumb)):print $breadcrumb;endif;?>
      <section<?php print $content_column_class;?>>
        <?php if (!empty($page['highlighted'])): ?>
        <div class="highlighted jumbotron"><?php print render($page['highlighted']);?></div>
        <?php endif;?>
        <a id="main-content"></a>
        <?php print $messages;?>
        <?php if (!empty($tabs)): ?>
        <?php print render($tabs);?>
        <?php endif;?>
        <?php if (!empty($page['help'])): ?>
        <?php print render($page['help']);?>
        <?php endif;?>
        <?php if (!empty($action_links)): ?>
      <ul class="action-links"><?php print render($action_links);?></ul>
      <?php endif;?>
      <?php //print render($title_prefix); ?>
      <?php //if (!empty($title)): ?>
      <!--<h1 class="page-header"><?php // print $title; ?></h1>-->
      <?php //endif; ?>
      <?php //print render($title_suffix); ?>
      <?php print render($page['content']);?>
    </section>
    <div class="col-lg-6 middle" >
      <?php if (!empty($page['sidebar_first'])): ?>
      <!--<aside class="col-sm-6" role="complementary">-->
      <?php print render($page['sidebar_first']);?>
      <!--</aside>  <!-- /#sidebar-first -->
      <?php endif;?>
      <?php if (!empty($page['sidebar_second'])): ?>
      <!--<aside class="col-sm-6" role="complementary">-->
      <?php print render($page['sidebar_second']);?>
      <!--</aside>  <!-- /#sidebar-second -->
      <?php endif;?>
    </div>
  </div>
</div>
<footer class="footer">
  <div class="container">
  <?php
print '
    <a class="logo-auf-foo" target="_blank" href="http://www.auf.org/" title="<?php print t(\'AGENCE UNIVERSITAIRE DE LA FRANCOPHONIE\');?>">
      <img src="/sites/default/files/site_files/Logo_AUF.png" alt="<?php print t(\'AGENCE UNIVERSITAIRE DE LA FRANCOPHONIE\');?>" />
    </a>
    <div id="copyright">&copy; ' . t("AUF 2015 Tous droits réservés") . '</div>';
    print render($page['footer']);
print '
    <div id="powred">
      <a target="_blank" href="http://agence-inspire.com"> ' . t("Powered By INSPIRE") . '
        <img width="30px" src="/sites/default/files/site_files/Inspire_logo_flat.png"/>
      </a>
    </div>';?>
  </div>
</footer>
<?php
  $eachType = array();$eachTypes=array();
  //TODO: change this to built in PHP method.
  $counter = 0;
  foreach($view->result as $key => $value){
    $term_name=taxonomy_term_load($value->_field_data['nid']['entity']->field_type['und'][0]['tid']);
    $eachType[$term_name->name][]= $value->nid;
    $eachTypes[$term_name->name]->content .= $rows[$counter];
    $counter++;
  }
?>

<div id="views-bootstrap-tab-<?php print $id ?>" class="<?php print $classes ?>">
  <ul class="nav nav-<?php print $tab_type?> <?php if ($justified) print 'nav-justified' ?>">
    <?php foreach ($eachType as $key => $tab): ?>
     <li class="<?php if ($key === 'BARCAMP') print 'active'?>">
       <a href="#tab-<?php print "{$id}-{$key}" ?>" data-toggle="tab"><?php print $key ?></a>
     </li>
    <?php endforeach ?>
  </ul>
  <div class="tab-content">
    <?php foreach ($eachTypes as $key => $row): 
       if (isset($row->content) && count($row->content)<=4){?>
      <div class="tab-pane <?php if ($key === 'BARCAMP') print 'active'?>" id="tab-<?php print "{$id}-{$key}" ?>" >
        <?php print $row->content; ?>
      </div>
    <?php } endforeach ?>
  </div>
</div>


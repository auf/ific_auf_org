<?php if (!$label_hidden): ?>
  	<span class="field-label icon-tags"><?php print $label ?>:&nbsp;</span>
 <?php endif; ?>
  
 <?php foreach ($items as $delta => $item): ?>
      <div class="field-tags inline"<?php print $item_attributes[$delta]; ?>><?php print render($item); ?></div>
 <?php endforeach; ?>
  
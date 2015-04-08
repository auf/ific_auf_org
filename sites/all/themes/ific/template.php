<?php
// Add this to your template.php
// And replace THEME by your theme name and MY_FORM_NID by... well your form nid

function ific_form_alter(&$form, &$form_state, $form_id) {
    if($form_id == 'webform_client_form_38') { 
      foreach ($form["submitted"] as $key => $value) {
          if (in_array($value["#type"], array("webform_email"))) {
              $form["submitted"][$key]['#attributes']["placeholder"] = t($value["#title"]);
          } 
      }
  }
}
/**
 * @file
 * textfield.func.php
 */
/**
 * Overrides theme_textfield().
 */
function ific_textfield($variables) {
  $element = $variables['element'];
  $element['#attributes']['type'] = 'text';
  element_set_attributes($element, array(
    'id',
    'name',
    'value',
    'size',
    'maxlength',
  ));
  _form_set_class($element, array('form-text'));

  $output = '<input' . drupal_attributes($element['#attributes']) . ' placeholder="'.$element['#title'].'" />';

  $extra = '';
  if ($element['#autocomplete_path'] && drupal_valid_path($element['#autocomplete_path'])) {
    drupal_add_library('system', 'drupal.autocomplete');
    $element['#attributes']['class'][] = 'form-autocomplete';

    $attributes = array();
    $attributes['type'] = 'hidden';
    $attributes['id'] = $element['#attributes']['id'] . '-autocomplete';
    $attributes['value'] = url($element['#autocomplete_path'], array('absolute' => TRUE));
    $attributes['disabled'] = 'disabled';
    $attributes['class'][] = 'autocomplete';
    $output = '<div class="input-group">' . $output . '<span class="input-group-addon">' . _bootstrap_icon('refresh') . '</span></div>';
    $extra = '<input' . drupal_attributes($attributes) . ' />';
  }

  return $output . $extra;
}
/**
 * @file
 * page.vars.php
 */

/**
 * Implements hook_preprocess_page().
 *
 * @see page.tpl.php
 */
function ific_preprocess_page(&$variables) {
  // Add information about the number of sidebars.
  if (!empty($variables['page']['sidebar_first']) && !empty($variables['page']['sidebar_second'])) {
    $variables['content_column_class'] = ' class="col-lg-6 left"';
  }
  elseif (!empty($variables['page']['sidebar_first']) || !empty($variables['page']['sidebar_second'])) {
    $variables['content_column_class'] = ' class="col-sm-12"';
  }
  else {
    $variables['content_column_class'] = ' class="col-sm-12"';
  }

  // Primary nav.
  $variables['primary_nav'] = FALSE;
  if ($variables['main_menu']) {
    // Build links.
    $variables['primary_nav'] = menu_tree(variable_get('menu_main_links_source', 'main-menu'));
    // Provide default theme wrapper function.
    $variables['primary_nav']['#theme_wrappers'] = array('menu_tree__primary');
  }

  // Secondary nav.
  $variables['secondary_nav'] = FALSE;
  if ($variables['secondary_menu']) {
    // Build links.
    $variables['secondary_nav'] = menu_tree(variable_get('menu_secondary_links_source', 'user-menu'));
    // Provide default theme wrapper function.
    $variables['secondary_nav']['#theme_wrappers'] = array('menu_tree__secondary');
  }

  $variables['navbar_classes_array'] = array('navbar');

  if (theme_get_setting('bootstrap_navbar_position') !== '') {
    $variables['navbar_classes_array'][] = 'navbar-' . theme_get_setting('bootstrap_navbar_position');
  }
  else {
    $variables['navbar_classes_array'][] = 'container';
  }
  if (theme_get_setting('bootstrap_navbar_inverse')) {
    $variables['navbar_classes_array'][] = 'navbar-inverse';
  }
  else {
    $variables['navbar_classes_array'][] = 'navbar-default';
  }
}
/**
 * @file
 * breadcrumb.func.php
 */

/**
 * Overrides theme_breadcrumb().
 *
 * Print breadcrumbs as an ordered list.
 */
function ific_breadcrumb($variables) {
        if( arg(0) == 'list-projets' && is_numeric(arg(1))){
           $tid=arg(1);
           $name=taxonomy_term_load($tid);
           $variables['breadcrumb'][1]= '<a href="/page-de-base/projets">'.t("Projets").'</a>';
           $variables['breadcrumb'][2]= $name->name;
           unset($variables['breadcrumb'][3]);
        }
        if( arg(0) == 'search'){
          
           $variables['breadcrumb'][1]= t("Recherche"); 
           $variables['breadcrumb'][2]= arg(2);
           unset($variables['breadcrumb'][3]);
        }
        if(arg(0) == 'actualites'){
               $variables['breadcrumb'][1]= t("Actualités"); 
        }
         if(arg(0) == 'salle-de-prese'){
               $variables['breadcrumb'][1]= t("Salle de presse"); 
        }
         if(arg(0) == 'appel-regions'){
               $variables['breadcrumb'][1]= t("Appel à regions"); 
        }
         if(arg(0) == 'events'){
               $variables['breadcrumb'][1]= t("Événements"); 
        }
         if(arg(0) == 'mediatheque'){
               $variables['breadcrumb'][1]= t("Mediathéques"); 
        }
         if(arg(0) == 'faq'){
               $variables['breadcrumb'][1]= t("FAQ"); 
        }
        if(drupal_is_front_page() ==  False){
        $nodes=menu_get_object();
        if(isset($nodes)){
        if($nodes->type == 'article'){
                $variables['breadcrumb'][]=$variables['breadcrumb'][1];
                $variables['breadcrumb'][1]= '<a href="/actualites">'.t("Actualités").'</a>';
        }
         if($nodes->type == 'salle_de_presse'){
                $variables['breadcrumb'][]=$variables['breadcrumb'][1];
                $variables['breadcrumb'][1]= '<a href="/salle-de-prese">'.t("Salle de presse").'</a>';
        }
        if($nodes->type == 'event'){
                $variables['breadcrumb'][]=$variables['breadcrumb'][1];
                $variables['breadcrumb'][1]= '<a href="/events">'.t("Événements").'</a>';
        }
        if($nodes->type == 'appel_region'){
                $variables['breadcrumb'][]=$variables['breadcrumb'][1];
                $variables['breadcrumb'][1]= '<a href="/appel-regions">'.t("Appel à regions").'</a>';
        }
        if($nodes->type == 'mediath_que'){
                $variables['breadcrumb'][]=$variables['breadcrumb'][1];
                $variables['breadcrumb'][1]= '<a href="/mediatheque">'.t("Mediathéques").'</a>';
        }
}
}
  $output = '';
  $breadcrumb = $variables['breadcrumb'];

  // Determine if we are to display the breadcrumb.
  $bootstrap_breadcrumb = theme_get_setting('bootstrap_breadcrumb');
  if (($bootstrap_breadcrumb == 1 || ($bootstrap_breadcrumb == 2 && arg(0) == 'admin')) && !empty($breadcrumb)) {
    $output = theme('item_list', array(
      'attributes' => array(
        'class' => array('breadcrumb'),
      ),
      'items' => $breadcrumb,
      'type' => 'ol',
    ));
  }
  return $output;
}

/**
 * @file
 * form-element-label.func.php
 */
/**
 * Overrides theme_form_element_label().
 */
function ific_form_element_label(&$variables)
{
        $element = $variables['element'];
        if ($element['#type'] == 'radio' || $element['#type'] == 'checkbox') {
                // This is also used in the installer, pre-database setup.
                $t    = get_t();
                // Determine if certain things should skip for checkbox or radio elements.
                $skip = (isset($element['#type']) && ('checkbox' === $element['#type'] || 'radio' === $element['#type']));
                // If title and required marker are both empty, output no label.
                if ((!isset($element['#title']) || $element['#title'] === '' && !$skip) && empty($element['#required'])) {
                        return '';
                }
                // If the element is required, a required marker is appended to the label.
                $required   = !empty($element['#required']) ? theme('form_required_marker', array(
                        'element' => $element
                )) : '';
                $title      = filter_xss_admin($element['#title']);
                $attributes = array();
                // Style the label as class option to display inline with the element.
                if ($element['#title_display'] == 'after' && !$skip) {
                        $attributes['class'][] = $element['#type'];
                }
                // Show label only to screen readers to avoid disruption in visual flows.
                elseif ($element['#title_display'] == 'invisible') {
                        $attributes['class'][] = 'element-invisible';
                }
                if (!empty($element['#id'])) {
                        $attributes['for'] = $element['#id'];
                }
                // Insert radio and checkboxes inside label elements.
                $output = '';
                // Append label.
                $output .= $t('!title !required', array(
                        '!title' => $title,
                        '!required' => $required
                ));
                // The leading whitespace helps visually separate fields from inline labels.
                return '<label  ' . drupal_attributes($attributes) . '>' . $element['#children'] . '<span class="lbl">' . $output . '</span></label>';
        }
}
/**
 * Build a BEF checkbox.
 *
 * @see http://api.drupal.org/api/function/theme_checkbox/7
 *
 * @param array $element
 *   Original <select> element generated by Views.
 * @param string $value
 *   Return value of this checkbox option.
 * @param string $label
 *   Label of this checkbox option.
 * @param bool $selected
 *   Checked or not.
 *
 * @return [type]
 *   HTML to render a checkbox.
 */
function ific_bef_checkbox($variables)
{
        $element    = $variables['element'];
        $value      = check_plain($variables['value']);
        $label      = check_plain($variables['label']);
        $selected   = $variables['selected'];
        $id         = drupal_html_id($element['#id'] . '-' . $value);
        // Custom ID for each checkbox based on the <select>'s original ID.
        $properties = array(
                '#required' => FALSE,
                '#id' => $id,
                '#type' => 'bef-checkbox',
                '#name' => $id
        );
        // Prevent the select-all-none class from cascading to all checkboxes.
        if (!empty($element['#attributes']['class']) && FALSE !== ($key = array_search('bef-select-all-none', $element['#attributes']['class']))) {
                unset($element['#attributes']['class'][$key]);
        }
        // Unset the name attribute as we are setting it manually.
        unset($element['#attributes']['name']);
        // Unset the multiple attribute as it doesn't apply for checkboxes.
        unset($element['#attributes']['multiple']);
        $checkbox                = '<input type="checkbox" '
        // Brackets are key -- just like select.
                . 'name="' . $element['#name'] . '[]" ' . 'id="' . $id . '" ' . 'value="' . $value . '" ' . ($selected ? 'checked="checked" ' : '') . drupal_attributes($element['#attributes']) . ' />';
        $properties['#children'] = "<label class='option' for='$id'> $checkbox <span class='lbl'>$label</span></label>";
        $output                  = theme('form_element', array(
                'element' => $properties
        ));
        return $output;
}


/**
 * @file
 * form-element.func.php
 */
/**
 * Overrides theme_form_element().
 */
function ific_form_element(&$variables)
{
        $element =& $variables['element'];
        $is_checkbox = FALSE;
        $is_radio    = FALSE;
        // This function is invoked as theme wrapper, but the rendered form element
        // may not necessarily have been processed by form_builder().
        $element += array(
                '#title_display' => 'before'
        );
        // Add element #id for #type 'item'.
        if (isset($element['#markup']) && !empty($element['#id'])) {
                $attributes['id'] = $element['#id'];
        }
        // Check for errors and set correct error class.
        if (isset($element['#parents']) && form_get_error($element)) {
                $attributes['class'][] = 'error';
        }
        if (!empty($element['#type'])) {
                $attributes['class'][] = 'form-type-' . strtr($element['#type'], '_', '-');
        }
        if (!empty($element['#name'])) {
                $attributes['class'][] = 'form-item-' . strtr($element['#name'], array(
                        ' ' => '-',
                        '_' => '-',
                        '[' => '-',
                        ']' => ''
                ));
        }
        // Add a class for disabled elements to facilitate cross-browser styling.
        if (!empty($element['#attributes']['disabled'])) {
                $attributes['class'][] = 'form-disabled';
        }
        if (!empty($element['#autocomplete_path']) && drupal_valid_path($element['#autocomplete_path'])) {
                $attributes['class'][] = 'form-autocomplete';
        }
        $attributes['class'][] = 'form-item';
        // See http://getbootstrap.com/css/#forms-controls.
        if (isset($element['#type'])) {
                if ($element['#type'] == "radio") {
                        $attributes['class'][] = 'radio';
                        $is_radio              = TRUE;
                } elseif ($element['#type'] == "checkbox") {
                        $attributes['class'][] = 'checkbox';
                        $is_checkbox           = TRUE;
                } else {
                        $attributes['class'][] = 'form-group';
                }
        }
        $description = FALSE;
        $tooltip     = FALSE;
        // Convert some descriptions to tooltips.
        // @see bootstrap_tooltip_descriptions setting in _bootstrap_settings_form()
        if (!empty($element['#description'])) {
                $description = $element['#description'];
                if (theme_get_setting('bootstrap_tooltip_enabled') && theme_get_setting('bootstrap_tooltip_descriptions') && $description === strip_tags($description) && strlen($description) <= 200) {
                        $tooltip                   = TRUE;
                        $attributes['data-toggle'] = 'tooltip';
                        $attributes['title']       = $description;
                }
        }
        $output = '<div' . drupal_attributes($attributes) . '>' . "\n";
        // If #title is not set, we don't display any label or required marker.
        if (!isset($element['#title'])) {
                $element['#title_display'] = 'none';
        }
        $prefix = '';
        $suffix = '';
        if (isset($element['#field_prefix']) || isset($element['#field_suffix'])) {
                // Determine if "#input_group" was specified.
                if (!empty($element['#input_group'])) {
                        $prefix .= '<div class="input-group">';
                        $prefix .= isset($element['#field_prefix']) ? '<span class="input-group-addon">' . $element['#field_prefix'] . '</span>' : '';
                        $suffix .= isset($element['#field_suffix']) ? '<span class="input-group-addon">' . $element['#field_suffix'] . '</span>' : '';
                        $suffix .= '</div>';
                } else {
                        $prefix .= isset($element['#field_prefix']) ? $element['#field_prefix'] : '';
                        $suffix .= isset($element['#field_suffix']) ? $element['#field_suffix'] : '';
                }
        }
        switch ($element['#title_display']) {
                case 'before':
                case 'invisible':
                        $output .= ' ' . theme('form_element_label', $variables);
                        $output .= ' ' . $prefix . $element['#children'] . $suffix . "\n";
                        break;
                case 'after':
                        if ($is_radio || $is_checkbox) {
                                $output .= ' ';
                        } else {
                                $variables['#children'] = ' ' . $prefix . $element['#children'] . $suffix;
                        }
                        $output .= ' ' . theme('form_element_label', $variables) . "\n";
                        break;
                case 'none':
                case 'attribute':
                        // Output no label and no required marker, only the children.
                        $output .= ' ' . $prefix . $element['#children'] . $suffix . "\n";
                        break;
        }
        if ($description && !$tooltip) {
                $output .= '<p class="help-block">' . $element['#description'] . "</p>\n";
        }
        $output .= "</div>\n";
        return $output;
}
function ific_preprocess_html(&$variables)
{
        if (in_array('node-type-webform', $variables['classes_array'])):
                drupal_add_js(base_path() . path_to_theme() . '/js/gmap3.js', array(
                        'type' => 'file',
                        'preprocess'=> false,
                        'scope' => 'footer',
                ));
                drupal_add_js('https://maps.googleapis.com/maps/api/js?sensor=false', array(
                        'type' => 'external',
                        'scope' => 'footer',
                        'group' => 'JS_LIBRARY'
                ));
        endif;
}
/**
 *add class bootstrap to image responsive
 */
function ific_preprocess_image(&$vars)
{
        $vars['attributes']['class'][] = 'img-responsive';
        // http://getbootstrap.com/css/#overview-responsive-images
}
/**
 * @file
 * exposed-filters.func.php
 */
/**
 * Overrides theme_exposed_filters().
 */
function ific_exposed_filters($variables)
{
        $form   = $variables['form'];
        $output = '';
        foreach (element_children($form['status']['filters']) as $key) {
                $form['status']['filters'][$key]['#field_prefix'] = '<div class="col-sm-10">';
                $form['status']['filters'][$key]['#field_suffix'] = '</div>';
        }
        $form['status']['actions']['#attributes']['class'][] = 'col-sm-offset-2';
        $form['status']['actions']['#attributes']['class'][] = 'col-sm-10';
        $form['status']['actions']['#prefix']                = '<div class="form-group">';
        $form['status']['actions']['#suffix']                = '</div>';
        if (isset($form['current'])) {
                $items = array();
                foreach (element_children($form['current']) as $key) {
                        $items[] = drupal_render($form['current'][$key]);
                }
                $output .= theme('item_list', array(
                        'items' => $items,
                        'attributes' => array(
                                'class' => array(
                                        'clearfix',
                                        'current-filters'
                                )
                        )
                ));
        }
        $output .= drupal_render_children($form);
        return '<div class="form-horizontal">' . $output . '</div>';
}
/**
 * @file
 * date_popup.func.php
 */
/**
 * Overrides theme_date_popu().
 */
function ific_date_popup($vars)
{
        $element               = $vars['element'];
        $attributes            = !empty($element['#wrapper_attributes']) ? $element['#wrapper_attributes'] : array(
                'class' => array()
        );
        $attributes['class'][] = 'container-inline-date';
        // If there is no description, the floating date elements need some extra padding below them.
        $wrapper_attributes    = array(
                'class' => array(
                        'date-padding'
                )
        );
        if (empty($element['date']['#description'])) {
                $wrapper_attributes['class'][] = 'clearfix';
        }
        // Add an wrapper to mimic the way a single value field works, for ease in using #states.
        if (isset($element['#children'])) {
                $element['#children'] = '<div id="' . $element['#id'] . '" ' . drupal_attributes($wrapper_attributes) . '>' . $element['#children'] . '<i  class="icon-large icon-calendar"></i></div>';
        }
        return '<div ' . drupal_attributes($attributes) . '>' . theme('form_element', $element) . '</div>';
}
/**
 * @file
 * template.php
 */
function ific_date_nav_title($params)
{
        $granularity = $params['granularity'];
        $view        = $params['view'];
        $date_info   = $view->date_info;
        $link        = !empty($params['link']) ? $params['link'] : FALSE;
        $format      = !empty($params['format']) ? $params['format'] : NULL;
        switch ($granularity) {
                case 'year':
                        $title    = $date_info->year;
                        $date_arg = $date_info->year;
                        break;
                case 'month':
                        $format   = !empty($format) ? $format : (empty($date_info->mini) ? 'F Y' : 'F Y');
                        $title    = date_format_date($date_info->min_date, 'custom', $format);
                        $date_arg = $date_info->year . '-' . date_pad($date_info->month);
                        break;
                case 'day':
                        $format   = !empty($format) ? $format : (empty($date_info->mini) ? 'l, F j Y' : 'l, F j');
                        $title    = date_format_date($date_info->min_date, 'custom', $format);
                        $date_arg = $date_info->year . '-' . date_pad($date_info->month) . '-' . date_pad($date_info->day);
                        break;
                case 'week':
                        $format   = !empty($format) ? $format : (empty($date_info->mini) ? 'F j Y' : 'F j');
                        $title    = t('Week of @date', array(
                                '@date' => date_format_date($date_info->min_date, 'custom', $format)
                        ));
                        $date_arg = $date_info->year . '-W' . date_pad($date_info->week);
                        break;
        }
        if (!empty($date_info->mini) || $link) {
                // Month navigation titles are used as links in the mini view.
                $attributes = array(
                        'title' => t('View full page month')
                );
                $url        = date_pager_url($view, $granularity, $date_arg, TRUE);
                return $title;
        } else {
                return $title;
        }
}
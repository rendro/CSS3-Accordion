/**
 * Horizontal accordion
 * 99% css3 magic, 1% javascript
 */
var HorizontalAccordion = function($node) {
	var active = 'active';
	$node.on('click', '.js_toggle', function() {
		$(this).siblings(['.', active].join('')).addBack().toggleClass(active);
	});
};

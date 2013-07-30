/**
 * Regular vertical accordion:
 * Bit more JS is needed to keep it fluid while using transitions
 */
/*globals $, Modernizr*/
var Accordion = function($node) {
	var toggleSelector  = '.js_toggle',
		contentSelector = '.js_content',
		active          = 'active',
		cssProperty     = 'height',
		notransition    = 'notransition',
		$contents       = $node.find([toggleSelector, ' + ', contentSelector].join('')),
		transition      = Modernizr.prefixed('transition'),
		transEndEventNames = {
			'WebkitTransition' : 'webkitTransitionEnd',
			'MozTransition'    : 'transitionend',
			'OTransition'      : 'oTransitionEnd',
			'msTransition'     : 'MSTransitionEnd',
			'transition'       : 'transitionend'
		},
		getHeight = function($el, recalculate) {
			var height = $el.data('innerHeight');

			if (height !== undefined && !recalculate) {
				return height;
			} else {
				height = 0;
			}

			$el.children().each(function() {
				height += $(this).outerHeight(true);
			}).data('innerHeight', height);

			return height;
		},
		hide = function($nodes) {
			$nodes.each(function() {
				var $toggle = $(this),
					$content = $toggle.next(contentSelector);
				$toggle.removeClass(active);
				if (false === transition) {
					$content.css(cssProperty, 0);
				} else {
					// remove transition and set height to inner height
					$content.addClass(notransition).css(cssProperty, getHeight($content));
					// deferred add transitions and reduce height to 0
					setTimeout(function() {
						$content.removeClass(notransition).css(cssProperty, 0);
					}, 0);
				}
			});
		},
		show = function($node) {
			var $content = $node.next(contentSelector),
				cssProperties = {};

			$node.addClass(active);
			if (transition) {
				cssProperties[cssProperty] = getHeight($content);
			} else {
				cssProperties[cssProperty] = 'auto';
				cssProperties.overflow = 'auto';
			}

			$content.css(cssProperties);
		};

	$node.on('click', ['>', toggleSelector].join(''), function() {
		var $el = $(this),
			$elementsToHide = $el.siblings(['.', active].join(''));
		if ($el.hasClass(active)) {
			$elementsToHide = $elementsToHide.add($el);
		} else {
			show($el);
		}
		hide($elementsToHide);
	});

	if (transition) {

		// initial height
		$contents.each(function() {
			getHeight($(this));
		});

		$(window).resize(function() {
			$contents.each(function() {
				getHeight($(this), true);
			});
		});

		$node.on(transEndEventNames[transition], [toggleSelector, '.', active, ' + ', contentSelector].join(''), function(e) {
			var $el = $(e.target);
			$el.addClass(notransition).css(cssProperty, 'auto');
			setTimeout(function() {
				$el.removeClass(notransition);
			}, 0);
		});
	}
};

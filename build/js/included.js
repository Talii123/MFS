/*! jQuery UI - v1.9.2 - 2013-04-04
* http://jqueryui.com
* Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.position.js, jquery.ui.draggable.js, jquery.ui.resizable.js, jquery.ui.autocomplete.js, jquery.ui.button.js, jquery.ui.datepicker.js, jquery.ui.dialog.js, jquery.ui.menu.js, jquery.ui.progressbar.js, jquery.ui.slider.js, jquery.ui.spinner.js, jquery.ui.tabs.js, jquery.ui.tooltip.js, jquery.ui.effect.js, jquery.ui.effect-slide.js
* Copyright 2013 jQuery Foundation and other contributors Licensed MIT */

(function( $, undefined ) {

var uuid = 0,
	runiqueId = /^ui-id-\d+$/;

// prevent duplicate loading
// this is only a problem because we proxy existing functions
// and we don't want to double proxy them
$.ui = $.ui || {};
if ( $.ui.version ) {
	return;
}

$.extend( $.ui, {
	version: "1.9.2",

	keyCode: {
		BACKSPACE: 8,
		COMMA: 188,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		LEFT: 37,
		NUMPAD_ADD: 107,
		NUMPAD_DECIMAL: 110,
		NUMPAD_DIVIDE: 111,
		NUMPAD_ENTER: 108,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT: 109,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SPACE: 32,
		TAB: 9,
		UP: 38
	}
});

// plugins
$.fn.extend({
	_focus: $.fn.focus,
	focus: function( delay, fn ) {
		return typeof delay === "number" ?
			this.each(function() {
				var elem = this;
				setTimeout(function() {
					$( elem ).focus();
					if ( fn ) {
						fn.call( elem );
					}
				}, delay );
			}) :
			this._focus.apply( this, arguments );
	},

	scrollParent: function() {
		var scrollParent;
		if (($.ui.ie && (/(static|relative)/).test(this.css('position'))) || (/absolute/).test(this.css('position'))) {
			scrollParent = this.parents().filter(function() {
				return (/(relative|absolute|fixed)/).test($.css(this,'position')) && (/(auto|scroll)/).test($.css(this,'overflow')+$.css(this,'overflow-y')+$.css(this,'overflow-x'));
			}).eq(0);
		} else {
			scrollParent = this.parents().filter(function() {
				return (/(auto|scroll)/).test($.css(this,'overflow')+$.css(this,'overflow-y')+$.css(this,'overflow-x'));
			}).eq(0);
		}

		return (/fixed/).test(this.css('position')) || !scrollParent.length ? $(document) : scrollParent;
	},

	zIndex: function( zIndex ) {
		if ( zIndex !== undefined ) {
			return this.css( "zIndex", zIndex );
		}

		if ( this.length ) {
			var elem = $( this[ 0 ] ), position, value;
			while ( elem.length && elem[ 0 ] !== document ) {
				// Ignore z-index if position is set to a value where z-index is ignored by the browser
				// This makes behavior of this function consistent across browsers
				// WebKit always returns auto if the element is positioned
				position = elem.css( "position" );
				if ( position === "absolute" || position === "relative" || position === "fixed" ) {
					// IE returns 0 when zIndex is not specified
					// other browsers return a string
					// we ignore the case of nested elements with an explicit value of 0
					// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
					value = parseInt( elem.css( "zIndex" ), 10 );
					if ( !isNaN( value ) && value !== 0 ) {
						return value;
					}
				}
				elem = elem.parent();
			}
		}

		return 0;
	},

	uniqueId: function() {
		return this.each(function() {
			if ( !this.id ) {
				this.id = "ui-id-" + (++uuid);
			}
		});
	},

	removeUniqueId: function() {
		return this.each(function() {
			if ( runiqueId.test( this.id ) ) {
				$( this ).removeAttr( "id" );
			}
		});
	}
});

// selectors
function focusable( element, isTabIndexNotNaN ) {
	var map, mapName, img,
		nodeName = element.nodeName.toLowerCase();
	if ( "area" === nodeName ) {
		map = element.parentNode;
		mapName = map.name;
		if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
			return false;
		}
		img = $( "img[usemap=#" + mapName + "]" )[0];
		return !!img && visible( img );
	}
	return ( /input|select|textarea|button|object/.test( nodeName ) ?
		!element.disabled :
		"a" === nodeName ?
			element.href || isTabIndexNotNaN :
			isTabIndexNotNaN) &&
		// the element and all of its ancestors must be visible
		visible( element );
}

function visible( element ) {
	return $.expr.filters.visible( element ) &&
		!$( element ).parents().andSelf().filter(function() {
			return $.css( this, "visibility" ) === "hidden";
		}).length;
}

$.extend( $.expr[ ":" ], {
	data: $.expr.createPseudo ?
		$.expr.createPseudo(function( dataName ) {
			return function( elem ) {
				return !!$.data( elem, dataName );
			};
		}) :
		// support: jQuery <1.8
		function( elem, i, match ) {
			return !!$.data( elem, match[ 3 ] );
		},

	focusable: function( element ) {
		return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
	},

	tabbable: function( element ) {
		var tabIndex = $.attr( element, "tabindex" ),
			isTabIndexNaN = isNaN( tabIndex );
		return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
	}
});

// support
$(function() {
	var body = document.body,
		div = body.appendChild( div = document.createElement( "div" ) );

	// access offsetHeight before setting the style to prevent a layout bug
	// in IE 9 which causes the element to continue to take up space even
	// after it is removed from the DOM (#8026)
	div.offsetHeight;

	$.extend( div.style, {
		minHeight: "100px",
		height: "auto",
		padding: 0,
		borderWidth: 0
	});

	$.support.minHeight = div.offsetHeight === 100;
	$.support.selectstart = "onselectstart" in div;

	// set display to none to avoid a layout bug in IE
	// http://dev.jquery.com/ticket/4014
	body.removeChild( div ).style.display = "none";
});

// support: jQuery <1.8
if ( !$( "<a>" ).outerWidth( 1 ).jquery ) {
	$.each( [ "Width", "Height" ], function( i, name ) {
		var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
			type = name.toLowerCase(),
			orig = {
				innerWidth: $.fn.innerWidth,
				innerHeight: $.fn.innerHeight,
				outerWidth: $.fn.outerWidth,
				outerHeight: $.fn.outerHeight
			};

		function reduce( elem, size, border, margin ) {
			$.each( side, function() {
				size -= parseFloat( $.css( elem, "padding" + this ) ) || 0;
				if ( border ) {
					size -= parseFloat( $.css( elem, "border" + this + "Width" ) ) || 0;
				}
				if ( margin ) {
					size -= parseFloat( $.css( elem, "margin" + this ) ) || 0;
				}
			});
			return size;
		}

		$.fn[ "inner" + name ] = function( size ) {
			if ( size === undefined ) {
				return orig[ "inner" + name ].call( this );
			}

			return this.each(function() {
				$( this ).css( type, reduce( this, size ) + "px" );
			});
		};

		$.fn[ "outer" + name] = function( size, margin ) {
			if ( typeof size !== "number" ) {
				return orig[ "outer" + name ].call( this, size );
			}

			return this.each(function() {
				$( this).css( type, reduce( this, size, true, margin ) + "px" );
			});
		};
	});
}

// support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
if ( $( "<a>" ).data( "a-b", "a" ).removeData( "a-b" ).data( "a-b" ) ) {
	$.fn.removeData = (function( removeData ) {
		return function( key ) {
			if ( arguments.length ) {
				return removeData.call( this, $.camelCase( key ) );
			} else {
				return removeData.call( this );
			}
		};
	})( $.fn.removeData );
}





// deprecated

(function() {
	var uaMatch = /msie ([\w.]+)/.exec( navigator.userAgent.toLowerCase() ) || [];
	$.ui.ie = uaMatch.length ? true : false;
	$.ui.ie6 = parseFloat( uaMatch[ 1 ], 10 ) === 6;
})();

$.fn.extend({
	disableSelection: function() {
		return this.bind( ( $.support.selectstart ? "selectstart" : "mousedown" ) +
			".ui-disableSelection", function( event ) {
				event.preventDefault();
			});
	},

	enableSelection: function() {
		return this.unbind( ".ui-disableSelection" );
	}
});

$.extend( $.ui, {
	// $.ui.plugin is deprecated.  Use the proxy pattern instead.
	plugin: {
		add: function( module, option, set ) {
			var i,
				proto = $.ui[ module ].prototype;
			for ( i in set ) {
				proto.plugins[ i ] = proto.plugins[ i ] || [];
				proto.plugins[ i ].push( [ option, set[ i ] ] );
			}
		},
		call: function( instance, name, args ) {
			var i,
				set = instance.plugins[ name ];
			if ( !set || !instance.element[ 0 ].parentNode || instance.element[ 0 ].parentNode.nodeType === 11 ) {
				return;
			}

			for ( i = 0; i < set.length; i++ ) {
				if ( instance.options[ set[ i ][ 0 ] ] ) {
					set[ i ][ 1 ].apply( instance.element, args );
				}
			}
		}
	},

	contains: $.contains,

	// only used by resizable
	hasScroll: function( el, a ) {

		//If overflow is hidden, the element might have extra content, but the user wants to hide it
		if ( $( el ).css( "overflow" ) === "hidden") {
			return false;
		}

		var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
			has = false;

		if ( el[ scroll ] > 0 ) {
			return true;
		}

		// TODO: determine which cases actually cause this to happen
		// if the element doesn't have the scroll set, see if it's possible to
		// set the scroll
		el[ scroll ] = 1;
		has = ( el[ scroll ] > 0 );
		el[ scroll ] = 0;
		return has;
	},

	// these are odd functions, fix the API or move into individual plugins
	isOverAxis: function( x, reference, size ) {
		//Determines when x coordinate is over "b" element axis
		return ( x > reference ) && ( x < ( reference + size ) );
	},
	isOver: function( y, x, top, left, height, width ) {
		//Determines when x, y coordinates is over "b" element
		return $.ui.isOverAxis( y, top, height ) && $.ui.isOverAxis( x, left, width );
	}
});

})( jQuery );
(function( $, undefined ) {

var uuid = 0,
	slice = Array.prototype.slice,
	_cleanData = $.cleanData;
$.cleanData = function( elems ) {
	for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
		try {
			$( elem ).triggerHandler( "remove" );
		// http://bugs.jquery.com/ticket/8235
		} catch( e ) {}
	}
	_cleanData( elems );
};

$.widget = function( name, base, prototype ) {
	var fullName, existingConstructor, constructor, basePrototype,
		namespace = name.split( "." )[ 0 ];

	name = name.split( "." )[ 1 ];
	fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	// create selector for plugin
	$.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
		return !!$.data( elem, fullName );
	};

	$[ namespace ] = $[ namespace ] || {};
	existingConstructor = $[ namespace ][ name ];
	constructor = $[ namespace ][ name ] = function( options, element ) {
		// allow instantiation without "new" keyword
		if ( !this._createWidget ) {
			return new constructor( options, element );
		}

		// allow instantiation without initializing for simple inheritance
		// must use "new" keyword (the code above always passes args)
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};
	// extend with the existing constructor to carry over any static properties
	$.extend( constructor, existingConstructor, {
		version: prototype.version,
		// copy the object used to create the prototype in case we need to
		// redefine the widget later
		_proto: $.extend( {}, prototype ),
		// track widgets that inherit from this widget in case this widget is
		// redefined after a widget inherits from it
		_childConstructors: []
	});

	basePrototype = new base();
	// we need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
	basePrototype.options = $.widget.extend( {}, basePrototype.options );
	$.each( prototype, function( prop, value ) {
		if ( $.isFunction( value ) ) {
			prototype[ prop ] = (function() {
				var _super = function() {
						return base.prototype[ prop ].apply( this, arguments );
					},
					_superApply = function( args ) {
						return base.prototype[ prop ].apply( this, args );
					};
				return function() {
					var __super = this._super,
						__superApply = this._superApply,
						returnValue;

					this._super = _super;
					this._superApply = _superApply;

					returnValue = value.apply( this, arguments );

					this._super = __super;
					this._superApply = __superApply;

					return returnValue;
				};
			})();
		}
	});
	constructor.prototype = $.widget.extend( basePrototype, {
		// TODO: remove support for widgetEventPrefix
		// always use the name + a colon as the prefix, e.g., draggable:start
		// don't prefix for widgets that aren't DOM-based
		widgetEventPrefix: existingConstructor ? basePrototype.widgetEventPrefix : name
	}, prototype, {
		constructor: constructor,
		namespace: namespace,
		widgetName: name,
		// TODO remove widgetBaseClass, see #8155
		widgetBaseClass: fullName,
		widgetFullName: fullName
	});

	// If this widget is being redefined then we need to find all widgets that
	// are inheriting from it and redefine all of them so that they inherit from
	// the new version of this widget. We're essentially trying to replace one
	// level in the prototype chain.
	if ( existingConstructor ) {
		$.each( existingConstructor._childConstructors, function( i, child ) {
			var childPrototype = child.prototype;

			// redefine the child widget using the same prototype that was
			// originally used, but inherit from the new version of the base
			$.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto );
		});
		// remove the list of existing child constructors from the old constructor
		// so the old child constructors can be garbage collected
		delete existingConstructor._childConstructors;
	} else {
		base._childConstructors.push( constructor );
	}

	$.widget.bridge( name, constructor );
};

$.widget.extend = function( target ) {
	var input = slice.call( arguments, 1 ),
		inputIndex = 0,
		inputLength = input.length,
		key,
		value;
	for ( ; inputIndex < inputLength; inputIndex++ ) {
		for ( key in input[ inputIndex ] ) {
			value = input[ inputIndex ][ key ];
			if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
				// Clone objects
				if ( $.isPlainObject( value ) ) {
					target[ key ] = $.isPlainObject( target[ key ] ) ?
						$.widget.extend( {}, target[ key ], value ) :
						// Don't extend strings, arrays, etc. with objects
						$.widget.extend( {}, value );
				// Copy everything else by reference
				} else {
					target[ key ] = value;
				}
			}
		}
	}
	return target;
};

$.widget.bridge = function( name, object ) {
	var fullName = object.prototype.widgetFullName || name;
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string",
			args = slice.call( arguments, 1 ),
			returnValue = this;

		// allow multiple hashes to be passed on init
		options = !isMethodCall && args.length ?
			$.widget.extend.apply( null, [ options ].concat(args) ) :
			options;

		if ( isMethodCall ) {
			this.each(function() {
				var methodValue,
					instance = $.data( this, fullName );
				if ( !instance ) {
					return $.error( "cannot call methods on " + name + " prior to initialization; " +
						"attempted to call method '" + options + "'" );
				}
				if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
					return $.error( "no such method '" + options + "' for " + name + " widget instance" );
				}
				methodValue = instance[ options ].apply( instance, args );
				if ( methodValue !== instance && methodValue !== undefined ) {
					returnValue = methodValue && methodValue.jquery ?
						returnValue.pushStack( methodValue.get() ) :
						methodValue;
					return false;
				}
			});
		} else {
			this.each(function() {
				var instance = $.data( this, fullName );
				if ( instance ) {
					instance.option( options || {} )._init();
				} else {
					$.data( this, fullName, new object( options, this ) );
				}
			});
		}

		return returnValue;
	};
};

$.Widget = function( /* options, element */ ) {};
$.Widget._childConstructors = [];

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	defaultElement: "<div>",
	options: {
		disabled: false,

		// callbacks
		create: null
	},
	_createWidget: function( options, element ) {
		element = $( element || this.defaultElement || this )[ 0 ];
		this.element = $( element );
		this.uuid = uuid++;
		this.eventNamespace = "." + this.widgetName + this.uuid;
		this.options = $.widget.extend( {},
			this.options,
			this._getCreateOptions(),
			options );

		this.bindings = $();
		this.hoverable = $();
		this.focusable = $();

		if ( element !== this ) {
			// 1.9 BC for #7810
			// TODO remove dual storage
			$.data( element, this.widgetName, this );
			$.data( element, this.widgetFullName, this );
			this._on( true, this.element, {
				remove: function( event ) {
					if ( event.target === element ) {
						this.destroy();
					}
				}
			});
			this.document = $( element.style ?
				// element within the document
				element.ownerDocument :
				// element is window or document
				element.document || element );
			this.window = $( this.document[0].defaultView || this.document[0].parentWindow );
		}

		this._create();
		this._trigger( "create", null, this._getCreateEventData() );
		this._init();
	},
	_getCreateOptions: $.noop,
	_getCreateEventData: $.noop,
	_create: $.noop,
	_init: $.noop,

	destroy: function() {
		this._destroy();
		// we can probably remove the unbind calls in 2.0
		// all event bindings should go through this._on()
		this.element
			.unbind( this.eventNamespace )
			// 1.9 BC for #7810
			// TODO remove dual storage
			.removeData( this.widgetName )
			.removeData( this.widgetFullName )
			// support: jquery <1.6.3
			// http://bugs.jquery.com/ticket/9413
			.removeData( $.camelCase( this.widgetFullName ) );
		this.widget()
			.unbind( this.eventNamespace )
			.removeAttr( "aria-disabled" )
			.removeClass(
				this.widgetFullName + "-disabled " +
				"ui-state-disabled" );

		// clean up events and states
		this.bindings.unbind( this.eventNamespace );
		this.hoverable.removeClass( "ui-state-hover" );
		this.focusable.removeClass( "ui-state-focus" );
	},
	_destroy: $.noop,

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key,
			parts,
			curOption,
			i;

		if ( arguments.length === 0 ) {
			// don't return a reference to the internal hash
			return $.widget.extend( {}, this.options );
		}

		if ( typeof key === "string" ) {
			// handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
			options = {};
			parts = key.split( "." );
			key = parts.shift();
			if ( parts.length ) {
				curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
				for ( i = 0; i < parts.length - 1; i++ ) {
					curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
					curOption = curOption[ parts[ i ] ];
				}
				key = parts.pop();
				if ( value === undefined ) {
					return curOption[ key ] === undefined ? null : curOption[ key ];
				}
				curOption[ key ] = value;
			} else {
				if ( value === undefined ) {
					return this.options[ key ] === undefined ? null : this.options[ key ];
				}
				options[ key ] = value;
			}
		}

		this._setOptions( options );

		return this;
	},
	_setOptions: function( options ) {
		var key;

		for ( key in options ) {
			this._setOption( key, options[ key ] );
		}

		return this;
	},
	_setOption: function( key, value ) {
		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this.widget()
				.toggleClass( this.widgetFullName + "-disabled ui-state-disabled", !!value )
				.attr( "aria-disabled", value );
			this.hoverable.removeClass( "ui-state-hover" );
			this.focusable.removeClass( "ui-state-focus" );
		}

		return this;
	},

	enable: function() {
		return this._setOption( "disabled", false );
	},
	disable: function() {
		return this._setOption( "disabled", true );
	},

	_on: function( suppressDisabledCheck, element, handlers ) {
		var delegateElement,
			instance = this;

		// no suppressDisabledCheck flag, shuffle arguments
		if ( typeof suppressDisabledCheck !== "boolean" ) {
			handlers = element;
			element = suppressDisabledCheck;
			suppressDisabledCheck = false;
		}

		// no element argument, shuffle and use this.element
		if ( !handlers ) {
			handlers = element;
			element = this.element;
			delegateElement = this.widget();
		} else {
			// accept selectors, DOM elements
			element = delegateElement = $( element );
			this.bindings = this.bindings.add( element );
		}

		$.each( handlers, function( event, handler ) {
			function handlerProxy() {
				// allow widgets to customize the disabled handling
				// - disabled as an array instead of boolean
				// - disabled class as method for disabling individual parts
				if ( !suppressDisabledCheck &&
						( instance.options.disabled === true ||
							$( this ).hasClass( "ui-state-disabled" ) ) ) {
					return;
				}
				return ( typeof handler === "string" ? instance[ handler ] : handler )
					.apply( instance, arguments );
			}

			// copy the guid so direct unbinding works
			if ( typeof handler !== "string" ) {
				handlerProxy.guid = handler.guid =
					handler.guid || handlerProxy.guid || $.guid++;
			}

			var match = event.match( /^(\w+)\s*(.*)$/ ),
				eventName = match[1] + instance.eventNamespace,
				selector = match[2];
			if ( selector ) {
				delegateElement.delegate( selector, eventName, handlerProxy );
			} else {
				element.bind( eventName, handlerProxy );
			}
		});
	},

	_off: function( element, eventName ) {
		eventName = (eventName || "").split( " " ).join( this.eventNamespace + " " ) + this.eventNamespace;
		element.unbind( eventName ).undelegate( eventName );
	},

	_delay: function( handler, delay ) {
		function handlerProxy() {
			return ( typeof handler === "string" ? instance[ handler ] : handler )
				.apply( instance, arguments );
		}
		var instance = this;
		return setTimeout( handlerProxy, delay || 0 );
	},

	_hoverable: function( element ) {
		this.hoverable = this.hoverable.add( element );
		this._on( element, {
			mouseenter: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-hover" );
			},
			mouseleave: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-hover" );
			}
		});
	},

	_focusable: function( element ) {
		this.focusable = this.focusable.add( element );
		this._on( element, {
			focusin: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-focus" );
			},
			focusout: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-focus" );
			}
		});
	},

	_trigger: function( type, event, data ) {
		var prop, orig,
			callback = this.options[ type ];

		data = data || {};
		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();
		// the original event may come from any element
		// so we need to reset the target on the new event
		event.target = this.element[ 0 ];

		// copy original event properties over to the new event
		orig = event.originalEvent;
		if ( orig ) {
			for ( prop in orig ) {
				if ( !( prop in event ) ) {
					event[ prop ] = orig[ prop ];
				}
			}
		}

		this.element.trigger( event, data );
		return !( $.isFunction( callback ) &&
			callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
			event.isDefaultPrevented() );
	}
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
	$.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
		if ( typeof options === "string" ) {
			options = { effect: options };
		}
		var hasOptions,
			effectName = !options ?
				method :
				options === true || typeof options === "number" ?
					defaultEffect :
					options.effect || defaultEffect;
		options = options || {};
		if ( typeof options === "number" ) {
			options = { duration: options };
		}
		hasOptions = !$.isEmptyObject( options );
		options.complete = callback;
		if ( options.delay ) {
			element.delay( options.delay );
		}
		if ( hasOptions && $.effects && ( $.effects.effect[ effectName ] || $.uiBackCompat !== false && $.effects[ effectName ] ) ) {
			element[ method ]( options );
		} else if ( effectName !== method && element[ effectName ] ) {
			element[ effectName ]( options.duration, options.easing, callback );
		} else {
			element.queue(function( next ) {
				$( this )[ method ]();
				if ( callback ) {
					callback.call( element[ 0 ] );
				}
				next();
			});
		}
	};
});

// DEPRECATED
if ( $.uiBackCompat !== false ) {
	$.Widget.prototype._getCreateOptions = function() {
		return $.metadata && $.metadata.get( this.element[0] )[ this.widgetName ];
	};
}

})( jQuery );
(function( $, undefined ) {

var mouseHandled = false;
$( document ).mouseup( function( e ) {
	mouseHandled = false;
});

$.widget("ui.mouse", {
	version: "1.9.2",
	options: {
		cancel: 'input,textarea,button,select,option',
		distance: 1,
		delay: 0
	},
	_mouseInit: function() {
		var that = this;

		this.element
			.bind('mousedown.'+this.widgetName, function(event) {
				return that._mouseDown(event);
			})
			.bind('click.'+this.widgetName, function(event) {
				if (true === $.data(event.target, that.widgetName + '.preventClickEvent')) {
					$.removeData(event.target, that.widgetName + '.preventClickEvent');
					event.stopImmediatePropagation();
					return false;
				}
			});

		this.started = false;
	},

	// TODO: make sure destroying one instance of mouse doesn't mess with
	// other instances of mouse
	_mouseDestroy: function() {
		this.element.unbind('.'+this.widgetName);
		if ( this._mouseMoveDelegate ) {
			$(document)
				.unbind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
				.unbind('mouseup.'+this.widgetName, this._mouseUpDelegate);
		}
	},

	_mouseDown: function(event) {
		// don't let more than one widget handle mouseStart
		if( mouseHandled ) { return; }

		// we may have missed mouseup (out of window)
		(this._mouseStarted && this._mouseUp(event));

		this._mouseDownEvent = event;

		var that = this,
			btnIsLeft = (event.which === 1),
			// event.target.nodeName works around a bug in IE 8 with
			// disabled inputs (#7620)
			elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
		if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
			return true;
		}

		this.mouseDelayMet = !this.options.delay;
		if (!this.mouseDelayMet) {
			this._mouseDelayTimer = setTimeout(function() {
				that.mouseDelayMet = true;
			}, this.options.delay);
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted = (this._mouseStart(event) !== false);
			if (!this._mouseStarted) {
				event.preventDefault();
				return true;
			}
		}

		// Click event may never have fired (Gecko & Opera)
		if (true === $.data(event.target, this.widgetName + '.preventClickEvent')) {
			$.removeData(event.target, this.widgetName + '.preventClickEvent');
		}

		// these delegates are required to keep context
		this._mouseMoveDelegate = function(event) {
			return that._mouseMove(event);
		};
		this._mouseUpDelegate = function(event) {
			return that._mouseUp(event);
		};
		$(document)
			.bind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
			.bind('mouseup.'+this.widgetName, this._mouseUpDelegate);

		event.preventDefault();

		mouseHandled = true;
		return true;
	},

	_mouseMove: function(event) {
		// IE mouseup check - mouseup happened when mouse was out of window
		if ($.ui.ie && !(document.documentMode >= 9) && !event.button) {
			return this._mouseUp(event);
		}

		if (this._mouseStarted) {
			this._mouseDrag(event);
			return event.preventDefault();
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted =
				(this._mouseStart(this._mouseDownEvent, event) !== false);
			(this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
		}

		return !this._mouseStarted;
	},

	_mouseUp: function(event) {
		$(document)
			.unbind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
			.unbind('mouseup.'+this.widgetName, this._mouseUpDelegate);

		if (this._mouseStarted) {
			this._mouseStarted = false;

			if (event.target === this._mouseDownEvent.target) {
				$.data(event.target, this.widgetName + '.preventClickEvent', true);
			}

			this._mouseStop(event);
		}

		return false;
	},

	_mouseDistanceMet: function(event) {
		return (Math.max(
				Math.abs(this._mouseDownEvent.pageX - event.pageX),
				Math.abs(this._mouseDownEvent.pageY - event.pageY)
			) >= this.options.distance
		);
	},

	_mouseDelayMet: function(event) {
		return this.mouseDelayMet;
	},

	// These are placeholder methods, to be overriden by extending plugin
	_mouseStart: function(event) {},
	_mouseDrag: function(event) {},
	_mouseStop: function(event) {},
	_mouseCapture: function(event) { return true; }
});

})(jQuery);
(function( $, undefined ) {

$.ui = $.ui || {};

var cachedScrollbarWidth,
	max = Math.max,
	abs = Math.abs,
	round = Math.round,
	rhorizontal = /left|center|right/,
	rvertical = /top|center|bottom/,
	roffset = /[\+\-]\d+%?/,
	rposition = /^\w+/,
	rpercent = /%$/,
	_position = $.fn.position;

function getOffsets( offsets, width, height ) {
	return [
		parseInt( offsets[ 0 ], 10 ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
		parseInt( offsets[ 1 ], 10 ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
	];
}
function parseCss( element, property ) {
	return parseInt( $.css( element, property ), 10 ) || 0;
}

$.position = {
	scrollbarWidth: function() {
		if ( cachedScrollbarWidth !== undefined ) {
			return cachedScrollbarWidth;
		}
		var w1, w2,
			div = $( "<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>" ),
			innerDiv = div.children()[0];

		$( "body" ).append( div );
		w1 = innerDiv.offsetWidth;
		div.css( "overflow", "scroll" );

		w2 = innerDiv.offsetWidth;

		if ( w1 === w2 ) {
			w2 = div[0].clientWidth;
		}

		div.remove();

		return (cachedScrollbarWidth = w1 - w2);
	},
	getScrollInfo: function( within ) {
		var overflowX = within.isWindow ? "" : within.element.css( "overflow-x" ),
			overflowY = within.isWindow ? "" : within.element.css( "overflow-y" ),
			hasOverflowX = overflowX === "scroll" ||
				( overflowX === "auto" && within.width < within.element[0].scrollWidth ),
			hasOverflowY = overflowY === "scroll" ||
				( overflowY === "auto" && within.height < within.element[0].scrollHeight );
		return {
			width: hasOverflowX ? $.position.scrollbarWidth() : 0,
			height: hasOverflowY ? $.position.scrollbarWidth() : 0
		};
	},
	getWithinInfo: function( element ) {
		var withinElement = $( element || window ),
			isWindow = $.isWindow( withinElement[0] );
		return {
			element: withinElement,
			isWindow: isWindow,
			offset: withinElement.offset() || { left: 0, top: 0 },
			scrollLeft: withinElement.scrollLeft(),
			scrollTop: withinElement.scrollTop(),
			width: isWindow ? withinElement.width() : withinElement.outerWidth(),
			height: isWindow ? withinElement.height() : withinElement.outerHeight()
		};
	}
};

$.fn.position = function( options ) {
	if ( !options || !options.of ) {
		return _position.apply( this, arguments );
	}

	// make a copy, we don't want to modify arguments
	options = $.extend( {}, options );

	var atOffset, targetWidth, targetHeight, targetOffset, basePosition,
		target = $( options.of ),
		within = $.position.getWithinInfo( options.within ),
		scrollInfo = $.position.getScrollInfo( within ),
		targetElem = target[0],
		collision = ( options.collision || "flip" ).split( " " ),
		offsets = {};

	if ( targetElem.nodeType === 9 ) {
		targetWidth = target.width();
		targetHeight = target.height();
		targetOffset = { top: 0, left: 0 };
	} else if ( $.isWindow( targetElem ) ) {
		targetWidth = target.width();
		targetHeight = target.height();
		targetOffset = { top: target.scrollTop(), left: target.scrollLeft() };
	} else if ( targetElem.preventDefault ) {
		// force left top to allow flipping
		options.at = "left top";
		targetWidth = targetHeight = 0;
		targetOffset = { top: targetElem.pageY, left: targetElem.pageX };
	} else {
		targetWidth = target.outerWidth();
		targetHeight = target.outerHeight();
		targetOffset = target.offset();
	}
	// clone to reuse original targetOffset later
	basePosition = $.extend( {}, targetOffset );

	// force my and at to have valid horizontal and vertical positions
	// if a value is missing or invalid, it will be converted to center
	$.each( [ "my", "at" ], function() {
		var pos = ( options[ this ] || "" ).split( " " ),
			horizontalOffset,
			verticalOffset;

		if ( pos.length === 1) {
			pos = rhorizontal.test( pos[ 0 ] ) ?
				pos.concat( [ "center" ] ) :
				rvertical.test( pos[ 0 ] ) ?
					[ "center" ].concat( pos ) :
					[ "center", "center" ];
		}
		pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "center";
		pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : "center";

		// calculate offsets
		horizontalOffset = roffset.exec( pos[ 0 ] );
		verticalOffset = roffset.exec( pos[ 1 ] );
		offsets[ this ] = [
			horizontalOffset ? horizontalOffset[ 0 ] : 0,
			verticalOffset ? verticalOffset[ 0 ] : 0
		];

		// reduce to just the positions without the offsets
		options[ this ] = [
			rposition.exec( pos[ 0 ] )[ 0 ],
			rposition.exec( pos[ 1 ] )[ 0 ]
		];
	});

	// normalize collision option
	if ( collision.length === 1 ) {
		collision[ 1 ] = collision[ 0 ];
	}

	if ( options.at[ 0 ] === "right" ) {
		basePosition.left += targetWidth;
	} else if ( options.at[ 0 ] === "center" ) {
		basePosition.left += targetWidth / 2;
	}

	if ( options.at[ 1 ] === "bottom" ) {
		basePosition.top += targetHeight;
	} else if ( options.at[ 1 ] === "center" ) {
		basePosition.top += targetHeight / 2;
	}

	atOffset = getOffsets( offsets.at, targetWidth, targetHeight );
	basePosition.left += atOffset[ 0 ];
	basePosition.top += atOffset[ 1 ];

	return this.each(function() {
		var collisionPosition, using,
			elem = $( this ),
			elemWidth = elem.outerWidth(),
			elemHeight = elem.outerHeight(),
			marginLeft = parseCss( this, "marginLeft" ),
			marginTop = parseCss( this, "marginTop" ),
			collisionWidth = elemWidth + marginLeft + parseCss( this, "marginRight" ) + scrollInfo.width,
			collisionHeight = elemHeight + marginTop + parseCss( this, "marginBottom" ) + scrollInfo.height,
			position = $.extend( {}, basePosition ),
			myOffset = getOffsets( offsets.my, elem.outerWidth(), elem.outerHeight() );

		if ( options.my[ 0 ] === "right" ) {
			position.left -= elemWidth;
		} else if ( options.my[ 0 ] === "center" ) {
			position.left -= elemWidth / 2;
		}

		if ( options.my[ 1 ] === "bottom" ) {
			position.top -= elemHeight;
		} else if ( options.my[ 1 ] === "center" ) {
			position.top -= elemHeight / 2;
		}

		position.left += myOffset[ 0 ];
		position.top += myOffset[ 1 ];

		// if the browser doesn't support fractions, then round for consistent results
		if ( !$.support.offsetFractions ) {
			position.left = round( position.left );
			position.top = round( position.top );
		}

		collisionPosition = {
			marginLeft: marginLeft,
			marginTop: marginTop
		};

		$.each( [ "left", "top" ], function( i, dir ) {
			if ( $.ui.position[ collision[ i ] ] ) {
				$.ui.position[ collision[ i ] ][ dir ]( position, {
					targetWidth: targetWidth,
					targetHeight: targetHeight,
					elemWidth: elemWidth,
					elemHeight: elemHeight,
					collisionPosition: collisionPosition,
					collisionWidth: collisionWidth,
					collisionHeight: collisionHeight,
					offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ] ],
					my: options.my,
					at: options.at,
					within: within,
					elem : elem
				});
			}
		});

		if ( $.fn.bgiframe ) {
			elem.bgiframe();
		}

		if ( options.using ) {
			// adds feedback as second argument to using callback, if present
			using = function( props ) {
				var left = targetOffset.left - position.left,
					right = left + targetWidth - elemWidth,
					top = targetOffset.top - position.top,
					bottom = top + targetHeight - elemHeight,
					feedback = {
						target: {
							element: target,
							left: targetOffset.left,
							top: targetOffset.top,
							width: targetWidth,
							height: targetHeight
						},
						element: {
							element: elem,
							left: position.left,
							top: position.top,
							width: elemWidth,
							height: elemHeight
						},
						horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
						vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
					};
				if ( targetWidth < elemWidth && abs( left + right ) < targetWidth ) {
					feedback.horizontal = "center";
				}
				if ( targetHeight < elemHeight && abs( top + bottom ) < targetHeight ) {
					feedback.vertical = "middle";
				}
				if ( max( abs( left ), abs( right ) ) > max( abs( top ), abs( bottom ) ) ) {
					feedback.important = "horizontal";
				} else {
					feedback.important = "vertical";
				}
				options.using.call( this, props, feedback );
			};
		}

		elem.offset( $.extend( position, { using: using } ) );
	});
};

$.ui.position = {
	fit: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
				outerWidth = within.width,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = withinOffset - collisionPosLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
				newOverRight;

			// element is wider than within
			if ( data.collisionWidth > outerWidth ) {
				// element is initially over the left side of within
				if ( overLeft > 0 && overRight <= 0 ) {
					newOverRight = position.left + overLeft + data.collisionWidth - outerWidth - withinOffset;
					position.left += overLeft - newOverRight;
				// element is initially over right side of within
				} else if ( overRight > 0 && overLeft <= 0 ) {
					position.left = withinOffset;
				// element is initially over both left and right sides of within
				} else {
					if ( overLeft > overRight ) {
						position.left = withinOffset + outerWidth - data.collisionWidth;
					} else {
						position.left = withinOffset;
					}
				}
			// too far left -> align with left edge
			} else if ( overLeft > 0 ) {
				position.left += overLeft;
			// too far right -> align with right edge
			} else if ( overRight > 0 ) {
				position.left -= overRight;
			// adjust based on position and margin
			} else {
				position.left = max( position.left - collisionPosLeft, position.left );
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
				outerHeight = data.within.height,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = withinOffset - collisionPosTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
				newOverBottom;

			// element is taller than within
			if ( data.collisionHeight > outerHeight ) {
				// element is initially over the top of within
				if ( overTop > 0 && overBottom <= 0 ) {
					newOverBottom = position.top + overTop + data.collisionHeight - outerHeight - withinOffset;
					position.top += overTop - newOverBottom;
				// element is initially over bottom of within
				} else if ( overBottom > 0 && overTop <= 0 ) {
					position.top = withinOffset;
				// element is initially over both top and bottom of within
				} else {
					if ( overTop > overBottom ) {
						position.top = withinOffset + outerHeight - data.collisionHeight;
					} else {
						position.top = withinOffset;
					}
				}
			// too far up -> align with top
			} else if ( overTop > 0 ) {
				position.top += overTop;
			// too far down -> align with bottom edge
			} else if ( overBottom > 0 ) {
				position.top -= overBottom;
			// adjust based on position and margin
			} else {
				position.top = max( position.top - collisionPosTop, position.top );
			}
		}
	},
	flip: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.left + within.scrollLeft,
				outerWidth = within.width,
				offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = collisionPosLeft - offsetLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
				myOffset = data.my[ 0 ] === "left" ?
					-data.elemWidth :
					data.my[ 0 ] === "right" ?
						data.elemWidth :
						0,
				atOffset = data.at[ 0 ] === "left" ?
					data.targetWidth :
					data.at[ 0 ] === "right" ?
						-data.targetWidth :
						0,
				offset = -2 * data.offset[ 0 ],
				newOverRight,
				newOverLeft;

			if ( overLeft < 0 ) {
				newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth - outerWidth - withinOffset;
				if ( newOverRight < 0 || newOverRight < abs( overLeft ) ) {
					position.left += myOffset + atOffset + offset;
				}
			}
			else if ( overRight > 0 ) {
				newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset + atOffset + offset - offsetLeft;
				if ( newOverLeft > 0 || abs( newOverLeft ) < overRight ) {
					position.left += myOffset + atOffset + offset;
				}
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.top + within.scrollTop,
				outerHeight = within.height,
				offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = collisionPosTop - offsetTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
				top = data.my[ 1 ] === "top",
				myOffset = top ?
					-data.elemHeight :
					data.my[ 1 ] === "bottom" ?
						data.elemHeight :
						0,
				atOffset = data.at[ 1 ] === "top" ?
					data.targetHeight :
					data.at[ 1 ] === "bottom" ?
						-data.targetHeight :
						0,
				offset = -2 * data.offset[ 1 ],
				newOverTop,
				newOverBottom;
			if ( overTop < 0 ) {
				newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight - outerHeight - withinOffset;
				if ( ( position.top + myOffset + atOffset + offset) > overTop && ( newOverBottom < 0 || newOverBottom < abs( overTop ) ) ) {
					position.top += myOffset + atOffset + offset;
				}
			}
			else if ( overBottom > 0 ) {
				newOverTop = position.top -  data.collisionPosition.marginTop + myOffset + atOffset + offset - offsetTop;
				if ( ( position.top + myOffset + atOffset + offset) > overBottom && ( newOverTop > 0 || abs( newOverTop ) < overBottom ) ) {
					position.top += myOffset + atOffset + offset;
				}
			}
		}
	},
	flipfit: {
		left: function() {
			$.ui.position.flip.left.apply( this, arguments );
			$.ui.position.fit.left.apply( this, arguments );
		},
		top: function() {
			$.ui.position.flip.top.apply( this, arguments );
			$.ui.position.fit.top.apply( this, arguments );
		}
	}
};

// fraction support test
(function () {
	var testElement, testElementParent, testElementStyle, offsetLeft, i,
		body = document.getElementsByTagName( "body" )[ 0 ],
		div = document.createElement( "div" );

	//Create a "fake body" for testing based on method used in jQuery.support
	testElement = document.createElement( body ? "div" : "body" );
	testElementStyle = {
		visibility: "hidden",
		width: 0,
		height: 0,
		border: 0,
		margin: 0,
		background: "none"
	};
	if ( body ) {
		$.extend( testElementStyle, {
			position: "absolute",
			left: "-1000px",
			top: "-1000px"
		});
	}
	for ( i in testElementStyle ) {
		testElement.style[ i ] = testElementStyle[ i ];
	}
	testElement.appendChild( div );
	testElementParent = body || document.documentElement;
	testElementParent.insertBefore( testElement, testElementParent.firstChild );

	div.style.cssText = "position: absolute; left: 10.7432222px;";

	offsetLeft = $( div ).offset().left;
	$.support.offsetFractions = offsetLeft > 10 && offsetLeft < 11;

	testElement.innerHTML = "";
	testElementParent.removeChild( testElement );
})();

// DEPRECATED
if ( $.uiBackCompat !== false ) {
	// offset option
	(function( $ ) {
		var _position = $.fn.position;
		$.fn.position = function( options ) {
			if ( !options || !options.offset ) {
				return _position.call( this, options );
			}
			var offset = options.offset.split( " " ),
				at = options.at.split( " " );
			if ( offset.length === 1 ) {
				offset[ 1 ] = offset[ 0 ];
			}
			if ( /^\d/.test( offset[ 0 ] ) ) {
				offset[ 0 ] = "+" + offset[ 0 ];
			}
			if ( /^\d/.test( offset[ 1 ] ) ) {
				offset[ 1 ] = "+" + offset[ 1 ];
			}
			if ( at.length === 1 ) {
				if ( /left|center|right/.test( at[ 0 ] ) ) {
					at[ 1 ] = "center";
				} else {
					at[ 1 ] = at[ 0 ];
					at[ 0 ] = "center";
				}
			}
			return _position.call( this, $.extend( options, {
				at: at[ 0 ] + offset[ 0 ] + " " + at[ 1 ] + offset[ 1 ],
				offset: undefined
			} ) );
		};
	}( jQuery ) );
}

}( jQuery ) );
(function( $, undefined ) {

$.widget("ui.draggable", $.ui.mouse, {
	version: "1.9.2",
	widgetEventPrefix: "drag",
	options: {
		addClasses: true,
		appendTo: "parent",
		axis: false,
		connectToSortable: false,
		containment: false,
		cursor: "auto",
		cursorAt: false,
		grid: false,
		handle: false,
		helper: "original",
		iframeFix: false,
		opacity: false,
		refreshPositions: false,
		revert: false,
		revertDuration: 500,
		scope: "default",
		scroll: true,
		scrollSensitivity: 20,
		scrollSpeed: 20,
		snap: false,
		snapMode: "both",
		snapTolerance: 20,
		stack: false,
		zIndex: false
	},
	_create: function() {

		if (this.options.helper == 'original' && !(/^(?:r|a|f)/).test(this.element.css("position")))
			this.element[0].style.position = 'relative';

		(this.options.addClasses && this.element.addClass("ui-draggable"));
		(this.options.disabled && this.element.addClass("ui-draggable-disabled"));

		this._mouseInit();

	},

	_destroy: function() {
		this.element.removeClass( "ui-draggable ui-draggable-dragging ui-draggable-disabled" );
		this._mouseDestroy();
	},

	_mouseCapture: function(event) {

		var o = this.options;

		// among others, prevent a drag on a resizable-handle
		if (this.helper || o.disabled || $(event.target).is('.ui-resizable-handle'))
			return false;

		//Quit if we're not on a valid handle
		this.handle = this._getHandle(event);
		if (!this.handle)
			return false;

		$(o.iframeFix === true ? "iframe" : o.iframeFix).each(function() {
			$('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>')
			.css({
				width: this.offsetWidth+"px", height: this.offsetHeight+"px",
				position: "absolute", opacity: "0.001", zIndex: 1000
			})
			.css($(this).offset())
			.appendTo("body");
		});

		return true;

	},

	_mouseStart: function(event) {

		var o = this.options;

		//Create and append the visible helper
		this.helper = this._createHelper(event);

		this.helper.addClass("ui-draggable-dragging");

		//Cache the helper size
		this._cacheHelperProportions();

		//If ddmanager is used for droppables, set the global draggable
		if($.ui.ddmanager)
			$.ui.ddmanager.current = this;

		/*
		 * - Position generation -
		 * This block generates everything position related - it's the core of draggables.
		 */

		//Cache the margins of the original element
		this._cacheMargins();

		//Store the helper's css position
		this.cssPosition = this.helper.css("position");
		this.scrollParent = this.helper.scrollParent();

		//The element's absolute position on the page minus margins
		this.offset = this.positionAbs = this.element.offset();
		this.offset = {
			top: this.offset.top - this.margins.top,
			left: this.offset.left - this.margins.left
		};

		$.extend(this.offset, {
			click: { //Where the click happened, relative to the element
				left: event.pageX - this.offset.left,
				top: event.pageY - this.offset.top
			},
			parent: this._getParentOffset(),
			relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
		});

		//Generate the original position
		this.originalPosition = this.position = this._generatePosition(event);
		this.originalPageX = event.pageX;
		this.originalPageY = event.pageY;

		//Adjust the mouse offset relative to the helper if 'cursorAt' is supplied
		(o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

		//Set a containment if given in the options
		if(o.containment)
			this._setContainment();

		//Trigger event + callbacks
		if(this._trigger("start", event) === false) {
			this._clear();
			return false;
		}

		//Recache the helper size
		this._cacheHelperProportions();

		//Prepare the droppable offsets
		if ($.ui.ddmanager && !o.dropBehaviour)
			$.ui.ddmanager.prepareOffsets(this, event);


		this._mouseDrag(event, true); //Execute the drag once - this causes the helper not to be visible before getting its correct position

		//If the ddmanager is used for droppables, inform the manager that dragging has started (see #5003)
		if ( $.ui.ddmanager ) $.ui.ddmanager.dragStart(this, event);

		return true;
	},

	_mouseDrag: function(event, noPropagation) {

		//Compute the helpers position
		this.position = this._generatePosition(event);
		this.positionAbs = this._convertPositionTo("absolute");

		//Call plugins and callbacks and use the resulting position if something is returned
		if (!noPropagation) {
			var ui = this._uiHash();
			if(this._trigger('drag', event, ui) === false) {
				this._mouseUp({});
				return false;
			}
			this.position = ui.position;
		}

		if(!this.options.axis || this.options.axis != "y") this.helper[0].style.left = this.position.left+'px';
		if(!this.options.axis || this.options.axis != "x") this.helper[0].style.top = this.position.top+'px';
		if($.ui.ddmanager) $.ui.ddmanager.drag(this, event);

		return false;
	},

	_mouseStop: function(event) {

		//If we are using droppables, inform the manager about the drop
		var dropped = false;
		if ($.ui.ddmanager && !this.options.dropBehaviour)
			dropped = $.ui.ddmanager.drop(this, event);

		//if a drop comes from outside (a sortable)
		if(this.dropped) {
			dropped = this.dropped;
			this.dropped = false;
		}

		//if the original element is no longer in the DOM don't bother to continue (see #8269)
		var element = this.element[0], elementInDom = false;
		while ( element && (element = element.parentNode) ) {
			if (element == document ) {
				elementInDom = true;
			}
		}
		if ( !elementInDom && this.options.helper === "original" )
			return false;

		if((this.options.revert == "invalid" && !dropped) || (this.options.revert == "valid" && dropped) || this.options.revert === true || ($.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped))) {
			var that = this;
			$(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
				if(that._trigger("stop", event) !== false) {
					that._clear();
				}
			});
		} else {
			if(this._trigger("stop", event) !== false) {
				this._clear();
			}
		}

		return false;
	},

	_mouseUp: function(event) {
		//Remove frame helpers
		$("div.ui-draggable-iframeFix").each(function() {
			this.parentNode.removeChild(this);
		});

		//If the ddmanager is used for droppables, inform the manager that dragging has stopped (see #5003)
		if( $.ui.ddmanager ) $.ui.ddmanager.dragStop(this, event);

		return $.ui.mouse.prototype._mouseUp.call(this, event);
	},

	cancel: function() {

		if(this.helper.is(".ui-draggable-dragging")) {
			this._mouseUp({});
		} else {
			this._clear();
		}

		return this;

	},

	_getHandle: function(event) {

		var handle = !this.options.handle || !$(this.options.handle, this.element).length ? true : false;
		$(this.options.handle, this.element)
			.find("*")
			.andSelf()
			.each(function() {
				if(this == event.target) handle = true;
			});

		return handle;

	},

	_createHelper: function(event) {

		var o = this.options;
		var helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event])) : (o.helper == 'clone' ? this.element.clone().removeAttr('id') : this.element);

		if(!helper.parents('body').length)
			helper.appendTo((o.appendTo == 'parent' ? this.element[0].parentNode : o.appendTo));

		if(helper[0] != this.element[0] && !(/(fixed|absolute)/).test(helper.css("position")))
			helper.css("position", "absolute");

		return helper;

	},

	_adjustOffsetFromHelper: function(obj) {
		if (typeof obj == 'string') {
			obj = obj.split(' ');
		}
		if ($.isArray(obj)) {
			obj = {left: +obj[0], top: +obj[1] || 0};
		}
		if ('left' in obj) {
			this.offset.click.left = obj.left + this.margins.left;
		}
		if ('right' in obj) {
			this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
		}
		if ('top' in obj) {
			this.offset.click.top = obj.top + this.margins.top;
		}
		if ('bottom' in obj) {
			this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
		}
	},

	_getParentOffset: function() {

		//Get the offsetParent and cache its position
		this.offsetParent = this.helper.offsetParent();
		var po = this.offsetParent.offset();

		// This is a special case where we need to modify a offset calculated on start, since the following happened:
		// 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
		// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
		//    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
		if(this.cssPosition == 'absolute' && this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) {
			po.left += this.scrollParent.scrollLeft();
			po.top += this.scrollParent.scrollTop();
		}

		if((this.offsetParent[0] == document.body) //This needs to be actually done for all browsers, since pageX/pageY includes this information
		|| (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == 'html' && $.ui.ie)) //Ugly IE fix
			po = { top: 0, left: 0 };

		return {
			top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
			left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
		};

	},

	_getRelativeOffset: function() {

		if(this.cssPosition == "relative") {
			var p = this.element.position();
			return {
				top: p.top - (parseInt(this.helper.css("top"),10) || 0) + this.scrollParent.scrollTop(),
				left: p.left - (parseInt(this.helper.css("left"),10) || 0) + this.scrollParent.scrollLeft()
			};
		} else {
			return { top: 0, left: 0 };
		}

	},

	_cacheMargins: function() {
		this.margins = {
			left: (parseInt(this.element.css("marginLeft"),10) || 0),
			top: (parseInt(this.element.css("marginTop"),10) || 0),
			right: (parseInt(this.element.css("marginRight"),10) || 0),
			bottom: (parseInt(this.element.css("marginBottom"),10) || 0)
		};
	},

	_cacheHelperProportions: function() {
		this.helperProportions = {
			width: this.helper.outerWidth(),
			height: this.helper.outerHeight()
		};
	},

	_setContainment: function() {

		var o = this.options;
		if(o.containment == 'parent') o.containment = this.helper[0].parentNode;
		if(o.containment == 'document' || o.containment == 'window') this.containment = [
			o.containment == 'document' ? 0 : $(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left,
			o.containment == 'document' ? 0 : $(window).scrollTop() - this.offset.relative.top - this.offset.parent.top,
			(o.containment == 'document' ? 0 : $(window).scrollLeft()) + $(o.containment == 'document' ? document : window).width() - this.helperProportions.width - this.margins.left,
			(o.containment == 'document' ? 0 : $(window).scrollTop()) + ($(o.containment == 'document' ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
		];

		if(!(/^(document|window|parent)$/).test(o.containment) && o.containment.constructor != Array) {
			var c = $(o.containment);
			var ce = c[0]; if(!ce) return;
			var co = c.offset();
			var over = ($(ce).css("overflow") != 'hidden');

			this.containment = [
				(parseInt($(ce).css("borderLeftWidth"),10) || 0) + (parseInt($(ce).css("paddingLeft"),10) || 0),
				(parseInt($(ce).css("borderTopWidth"),10) || 0) + (parseInt($(ce).css("paddingTop"),10) || 0),
				(over ? Math.max(ce.scrollWidth,ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"),10) || 0) - (parseInt($(ce).css("paddingRight"),10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right,
				(over ? Math.max(ce.scrollHeight,ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"),10) || 0) - (parseInt($(ce).css("paddingBottom"),10) || 0) - this.helperProportions.height - this.margins.top  - this.margins.bottom
			];
			this.relative_container = c;

		} else if(o.containment.constructor == Array) {
			this.containment = o.containment;
		}

	},

	_convertPositionTo: function(d, pos) {

		if(!pos) pos = this.position;
		var mod = d == "absolute" ? 1 : -1;
		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		return {
			top: (
				pos.top																	// The absolute mouse position
				+ this.offset.relative.top * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
				+ this.offset.parent.top * mod											// The offsetParent's offset without borders (offset + border)
				- ( ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod)
			),
			left: (
				pos.left																// The absolute mouse position
				+ this.offset.relative.left * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
				+ this.offset.parent.left * mod											// The offsetParent's offset without borders (offset + border)
				- ( ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ) * mod)
			)
		};

	},

	_generatePosition: function(event) {

		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);
		var pageX = event.pageX;
		var pageY = event.pageY;

		/*
		 * - Position constraining -
		 * Constrain the position to a mix of grid, containment.
		 */

		if(this.originalPosition) { //If we are not dragging yet, we won't check for options
			var containment;
			if(this.containment) {
			if (this.relative_container){
				var co = this.relative_container.offset();
				containment = [ this.containment[0] + co.left,
					this.containment[1] + co.top,
					this.containment[2] + co.left,
					this.containment[3] + co.top ];
			}
			else {
				containment = this.containment;
			}

				if(event.pageX - this.offset.click.left < containment[0]) pageX = containment[0] + this.offset.click.left;
				if(event.pageY - this.offset.click.top < containment[1]) pageY = containment[1] + this.offset.click.top;
				if(event.pageX - this.offset.click.left > containment[2]) pageX = containment[2] + this.offset.click.left;
				if(event.pageY - this.offset.click.top > containment[3]) pageY = containment[3] + this.offset.click.top;
			}

			if(o.grid) {
				//Check for grid elements set to 0 to prevent divide by 0 error causing invalid argument errors in IE (see ticket #6950)
				var top = o.grid[1] ? this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1] : this.originalPageY;
				pageY = containment ? (!(top - this.offset.click.top < containment[1] || top - this.offset.click.top > containment[3]) ? top : (!(top - this.offset.click.top < containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

				var left = o.grid[0] ? this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0] : this.originalPageX;
				pageX = containment ? (!(left - this.offset.click.left < containment[0] || left - this.offset.click.left > containment[2]) ? left : (!(left - this.offset.click.left < containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
			}

		}

		return {
			top: (
				pageY																// The absolute mouse position
				- this.offset.click.top													// Click offset (relative to the element)
				- this.offset.relative.top												// Only for relative positioned nodes: Relative offset from element to offset parent
				- this.offset.parent.top												// The offsetParent's offset without borders (offset + border)
				+ ( ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ))
			),
			left: (
				pageX																// The absolute mouse position
				- this.offset.click.left												// Click offset (relative to the element)
				- this.offset.relative.left												// Only for relative positioned nodes: Relative offset from element to offset parent
				- this.offset.parent.left												// The offsetParent's offset without borders (offset + border)
				+ ( ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ))
			)
		};

	},

	_clear: function() {
		this.helper.removeClass("ui-draggable-dragging");
		if(this.helper[0] != this.element[0] && !this.cancelHelperRemoval) this.helper.remove();
		//if($.ui.ddmanager) $.ui.ddmanager.current = null;
		this.helper = null;
		this.cancelHelperRemoval = false;
	},

	// From now on bulk stuff - mainly helpers

	_trigger: function(type, event, ui) {
		ui = ui || this._uiHash();
		$.ui.plugin.call(this, type, [event, ui]);
		if(type == "drag") this.positionAbs = this._convertPositionTo("absolute"); //The absolute position has to be recalculated after plugins
		return $.Widget.prototype._trigger.call(this, type, event, ui);
	},

	plugins: {},

	_uiHash: function(event) {
		return {
			helper: this.helper,
			position: this.position,
			originalPosition: this.originalPosition,
			offset: this.positionAbs
		};
	}

});

$.ui.plugin.add("draggable", "connectToSortable", {
	start: function(event, ui) {

		var inst = $(this).data("draggable"), o = inst.options,
			uiSortable = $.extend({}, ui, { item: inst.element });
		inst.sortables = [];
		$(o.connectToSortable).each(function() {
			var sortable = $.data(this, 'sortable');
			if (sortable && !sortable.options.disabled) {
				inst.sortables.push({
					instance: sortable,
					shouldRevert: sortable.options.revert
				});
				sortable.refreshPositions();	// Call the sortable's refreshPositions at drag start to refresh the containerCache since the sortable container cache is used in drag and needs to be up to date (this will ensure it's initialised as well as being kept in step with any changes that might have happened on the page).
				sortable._trigger("activate", event, uiSortable);
			}
		});

	},
	stop: function(event, ui) {

		//If we are still over the sortable, we fake the stop event of the sortable, but also remove helper
		var inst = $(this).data("draggable"),
			uiSortable = $.extend({}, ui, { item: inst.element });

		$.each(inst.sortables, function() {
			if(this.instance.isOver) {

				this.instance.isOver = 0;

				inst.cancelHelperRemoval = true; //Don't remove the helper in the draggable instance
				this.instance.cancelHelperRemoval = false; //Remove it in the sortable instance (so sortable plugins like revert still work)

				//The sortable revert is supported, and we have to set a temporary dropped variable on the draggable to support revert: 'valid/invalid'
				if(this.shouldRevert) this.instance.options.revert = true;

				//Trigger the stop of the sortable
				this.instance._mouseStop(event);

				this.instance.options.helper = this.instance.options._helper;

				//If the helper has been the original item, restore properties in the sortable
				if(inst.options.helper == 'original')
					this.instance.currentItem.css({ top: 'auto', left: 'auto' });

			} else {
				this.instance.cancelHelperRemoval = false; //Remove the helper in the sortable instance
				this.instance._trigger("deactivate", event, uiSortable);
			}

		});

	},
	drag: function(event, ui) {

		var inst = $(this).data("draggable"), that = this;

		var checkPos = function(o) {
			var dyClick = this.offset.click.top, dxClick = this.offset.click.left;
			var helperTop = this.positionAbs.top, helperLeft = this.positionAbs.left;
			var itemHeight = o.height, itemWidth = o.width;
			var itemTop = o.top, itemLeft = o.left;

			return $.ui.isOver(helperTop + dyClick, helperLeft + dxClick, itemTop, itemLeft, itemHeight, itemWidth);
		};

		$.each(inst.sortables, function(i) {

			var innermostIntersecting = false;
			var thisSortable = this;
			//Copy over some variables to allow calling the sortable's native _intersectsWith
			this.instance.positionAbs = inst.positionAbs;
			this.instance.helperProportions = inst.helperProportions;
			this.instance.offset.click = inst.offset.click;

			if(this.instance._intersectsWith(this.instance.containerCache)) {
				innermostIntersecting = true;
				$.each(inst.sortables, function () {
					this.instance.positionAbs = inst.positionAbs;
					this.instance.helperProportions = inst.helperProportions;
					this.instance.offset.click = inst.offset.click;
					if  (this != thisSortable
						&& this.instance._intersectsWith(this.instance.containerCache)
						&& $.ui.contains(thisSortable.instance.element[0], this.instance.element[0]))
						innermostIntersecting = false;
						return innermostIntersecting;
				});
			}


			if(innermostIntersecting) {
				//If it intersects, we use a little isOver variable and set it once, so our move-in stuff gets fired only once
				if(!this.instance.isOver) {

					this.instance.isOver = 1;
					//Now we fake the start of dragging for the sortable instance,
					//by cloning the list group item, appending it to the sortable and using it as inst.currentItem
					//We can then fire the start event of the sortable with our passed browser event, and our own helper (so it doesn't create a new one)
					this.instance.currentItem = $(that).clone().removeAttr('id').appendTo(this.instance.element).data("sortable-item", true);
					this.instance.options._helper = this.instance.options.helper; //Store helper option to later restore it
					this.instance.options.helper = function() { return ui.helper[0]; };

					event.target = this.instance.currentItem[0];
					this.instance._mouseCapture(event, true);
					this.instance._mouseStart(event, true, true);

					//Because the browser event is way off the new appended portlet, we modify a couple of variables to reflect the changes
					this.instance.offset.click.top = inst.offset.click.top;
					this.instance.offset.click.left = inst.offset.click.left;
					this.instance.offset.parent.left -= inst.offset.parent.left - this.instance.offset.parent.left;
					this.instance.offset.parent.top -= inst.offset.parent.top - this.instance.offset.parent.top;

					inst._trigger("toSortable", event);
					inst.dropped = this.instance.element; //draggable revert needs that
					//hack so receive/update callbacks work (mostly)
					inst.currentItem = inst.element;
					this.instance.fromOutside = inst;

				}

				//Provided we did all the previous steps, we can fire the drag event of the sortable on every draggable drag, when it intersects with the sortable
				if(this.instance.currentItem) this.instance._mouseDrag(event);

			} else {

				//If it doesn't intersect with the sortable, and it intersected before,
				//we fake the drag stop of the sortable, but make sure it doesn't remove the helper by using cancelHelperRemoval
				if(this.instance.isOver) {

					this.instance.isOver = 0;
					this.instance.cancelHelperRemoval = true;

					//Prevent reverting on this forced stop
					this.instance.options.revert = false;

					// The out event needs to be triggered independently
					this.instance._trigger('out', event, this.instance._uiHash(this.instance));

					this.instance._mouseStop(event, true);
					this.instance.options.helper = this.instance.options._helper;

					//Now we remove our currentItem, the list group clone again, and the placeholder, and animate the helper back to it's original size
					this.instance.currentItem.remove();
					if(this.instance.placeholder) this.instance.placeholder.remove();

					inst._trigger("fromSortable", event);
					inst.dropped = false; //draggable revert needs that
				}

			};

		});

	}
});

$.ui.plugin.add("draggable", "cursor", {
	start: function(event, ui) {
		var t = $('body'), o = $(this).data('draggable').options;
		if (t.css("cursor")) o._cursor = t.css("cursor");
		t.css("cursor", o.cursor);
	},
	stop: function(event, ui) {
		var o = $(this).data('draggable').options;
		if (o._cursor) $('body').css("cursor", o._cursor);
	}
});

$.ui.plugin.add("draggable", "opacity", {
	start: function(event, ui) {
		var t = $(ui.helper), o = $(this).data('draggable').options;
		if(t.css("opacity")) o._opacity = t.css("opacity");
		t.css('opacity', o.opacity);
	},
	stop: function(event, ui) {
		var o = $(this).data('draggable').options;
		if(o._opacity) $(ui.helper).css('opacity', o._opacity);
	}
});

$.ui.plugin.add("draggable", "scroll", {
	start: function(event, ui) {
		var i = $(this).data("draggable");
		if(i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') i.overflowOffset = i.scrollParent.offset();
	},
	drag: function(event, ui) {

		var i = $(this).data("draggable"), o = i.options, scrolled = false;

		if(i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') {

			if(!o.axis || o.axis != 'x') {
				if((i.overflowOffset.top + i.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity)
					i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop + o.scrollSpeed;
				else if(event.pageY - i.overflowOffset.top < o.scrollSensitivity)
					i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop - o.scrollSpeed;
			}

			if(!o.axis || o.axis != 'y') {
				if((i.overflowOffset.left + i.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity)
					i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft + o.scrollSpeed;
				else if(event.pageX - i.overflowOffset.left < o.scrollSensitivity)
					i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft - o.scrollSpeed;
			}

		} else {

			if(!o.axis || o.axis != 'x') {
				if(event.pageY - $(document).scrollTop() < o.scrollSensitivity)
					scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
				else if($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity)
					scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
			}

			if(!o.axis || o.axis != 'y') {
				if(event.pageX - $(document).scrollLeft() < o.scrollSensitivity)
					scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
				else if($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity)
					scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
			}

		}

		if(scrolled !== false && $.ui.ddmanager && !o.dropBehaviour)
			$.ui.ddmanager.prepareOffsets(i, event);

	}
});

$.ui.plugin.add("draggable", "snap", {
	start: function(event, ui) {

		var i = $(this).data("draggable"), o = i.options;
		i.snapElements = [];

		$(o.snap.constructor != String ? ( o.snap.items || ':data(draggable)' ) : o.snap).each(function() {
			var $t = $(this); var $o = $t.offset();
			if(this != i.element[0]) i.snapElements.push({
				item: this,
				width: $t.outerWidth(), height: $t.outerHeight(),
				top: $o.top, left: $o.left
			});
		});

	},
	drag: function(event, ui) {

		var inst = $(this).data("draggable"), o = inst.options;
		var d = o.snapTolerance;

		var x1 = ui.offset.left, x2 = x1 + inst.helperProportions.width,
			y1 = ui.offset.top, y2 = y1 + inst.helperProportions.height;

		for (var i = inst.snapElements.length - 1; i >= 0; i--){

			var l = inst.snapElements[i].left, r = l + inst.snapElements[i].width,
				t = inst.snapElements[i].top, b = t + inst.snapElements[i].height;

			//Yes, I know, this is insane ;)
			if(!((l-d < x1 && x1 < r+d && t-d < y1 && y1 < b+d) || (l-d < x1 && x1 < r+d && t-d < y2 && y2 < b+d) || (l-d < x2 && x2 < r+d && t-d < y1 && y1 < b+d) || (l-d < x2 && x2 < r+d && t-d < y2 && y2 < b+d))) {
				if(inst.snapElements[i].snapping) (inst.options.snap.release && inst.options.snap.release.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
				inst.snapElements[i].snapping = false;
				continue;
			}

			if(o.snapMode != 'inner') {
				var ts = Math.abs(t - y2) <= d;
				var bs = Math.abs(b - y1) <= d;
				var ls = Math.abs(l - x2) <= d;
				var rs = Math.abs(r - x1) <= d;
				if(ts) ui.position.top = inst._convertPositionTo("relative", { top: t - inst.helperProportions.height, left: 0 }).top - inst.margins.top;
				if(bs) ui.position.top = inst._convertPositionTo("relative", { top: b, left: 0 }).top - inst.margins.top;
				if(ls) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l - inst.helperProportions.width }).left - inst.margins.left;
				if(rs) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r }).left - inst.margins.left;
			}

			var first = (ts || bs || ls || rs);

			if(o.snapMode != 'outer') {
				var ts = Math.abs(t - y1) <= d;
				var bs = Math.abs(b - y2) <= d;
				var ls = Math.abs(l - x1) <= d;
				var rs = Math.abs(r - x2) <= d;
				if(ts) ui.position.top = inst._convertPositionTo("relative", { top: t, left: 0 }).top - inst.margins.top;
				if(bs) ui.position.top = inst._convertPositionTo("relative", { top: b - inst.helperProportions.height, left: 0 }).top - inst.margins.top;
				if(ls) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l }).left - inst.margins.left;
				if(rs) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r - inst.helperProportions.width }).left - inst.margins.left;
			}

			if(!inst.snapElements[i].snapping && (ts || bs || ls || rs || first))
				(inst.options.snap.snap && inst.options.snap.snap.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
			inst.snapElements[i].snapping = (ts || bs || ls || rs || first);

		};

	}
});

$.ui.plugin.add("draggable", "stack", {
	start: function(event, ui) {

		var o = $(this).data("draggable").options;

		var group = $.makeArray($(o.stack)).sort(function(a,b) {
			return (parseInt($(a).css("zIndex"),10) || 0) - (parseInt($(b).css("zIndex"),10) || 0);
		});
		if (!group.length) { return; }

		var min = parseInt(group[0].style.zIndex) || 0;
		$(group).each(function(i) {
			this.style.zIndex = min + i;
		});

		this[0].style.zIndex = min + group.length;

	}
});

$.ui.plugin.add("draggable", "zIndex", {
	start: function(event, ui) {
		var t = $(ui.helper), o = $(this).data("draggable").options;
		if(t.css("zIndex")) o._zIndex = t.css("zIndex");
		t.css('zIndex', o.zIndex);
	},
	stop: function(event, ui) {
		var o = $(this).data("draggable").options;
		if(o._zIndex) $(ui.helper).css('zIndex', o._zIndex);
	}
});

})(jQuery);
(function( $, undefined ) {

$.widget("ui.resizable", $.ui.mouse, {
	version: "1.9.2",
	widgetEventPrefix: "resize",
	options: {
		alsoResize: false,
		animate: false,
		animateDuration: "slow",
		animateEasing: "swing",
		aspectRatio: false,
		autoHide: false,
		containment: false,
		ghost: false,
		grid: false,
		handles: "e,s,se",
		helper: false,
		maxHeight: null,
		maxWidth: null,
		minHeight: 10,
		minWidth: 10,
		zIndex: 1000
	},
	_create: function() {

		var that = this, o = this.options;
		this.element.addClass("ui-resizable");

		$.extend(this, {
			_aspectRatio: !!(o.aspectRatio),
			aspectRatio: o.aspectRatio,
			originalElement: this.element,
			_proportionallyResizeElements: [],
			_helper: o.helper || o.ghost || o.animate ? o.helper || 'ui-resizable-helper' : null
		});

		//Wrap the element if it cannot hold child nodes
		if(this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)) {

			//Create a wrapper element and set the wrapper to the new current internal element
			this.element.wrap(
				$('<div class="ui-wrapper" style="overflow: hidden;"></div>').css({
					position: this.element.css('position'),
					width: this.element.outerWidth(),
					height: this.element.outerHeight(),
					top: this.element.css('top'),
					left: this.element.css('left')
				})
			);

			//Overwrite the original this.element
			this.element = this.element.parent().data(
				"resizable", this.element.data('resizable')
			);

			this.elementIsWrapper = true;

			//Move margins to the wrapper
			this.element.css({ marginLeft: this.originalElement.css("marginLeft"), marginTop: this.originalElement.css("marginTop"), marginRight: this.originalElement.css("marginRight"), marginBottom: this.originalElement.css("marginBottom") });
			this.originalElement.css({ marginLeft: 0, marginTop: 0, marginRight: 0, marginBottom: 0});

			//Prevent Safari textarea resize
			this.originalResizeStyle = this.originalElement.css('resize');
			this.originalElement.css('resize', 'none');

			//Push the actual element to our proportionallyResize internal array
			this._proportionallyResizeElements.push(this.originalElement.css({ position: 'static', zoom: 1, display: 'block' }));

			// avoid IE jump (hard set the margin)
			this.originalElement.css({ margin: this.originalElement.css('margin') });

			// fix handlers offset
			this._proportionallyResize();

		}

		this.handles = o.handles || (!$('.ui-resizable-handle', this.element).length ? "e,s,se" : { n: '.ui-resizable-n', e: '.ui-resizable-e', s: '.ui-resizable-s', w: '.ui-resizable-w', se: '.ui-resizable-se', sw: '.ui-resizable-sw', ne: '.ui-resizable-ne', nw: '.ui-resizable-nw' });
		if(this.handles.constructor == String) {

			if(this.handles == 'all') this.handles = 'n,e,s,w,se,sw,ne,nw';
			var n = this.handles.split(","); this.handles = {};

			for(var i = 0; i < n.length; i++) {

				var handle = $.trim(n[i]), hname = 'ui-resizable-'+handle;
				var axis = $('<div class="ui-resizable-handle ' + hname + '"></div>');

				// Apply zIndex to all handles - see #7960
				axis.css({ zIndex: o.zIndex });

				//TODO : What's going on here?
				if ('se' == handle) {
					axis.addClass('ui-icon ui-icon-gripsmall-diagonal-se');
				};

				//Insert into internal handles object and append to element
				this.handles[handle] = '.ui-resizable-'+handle;
				this.element.append(axis);
			}

		}

		this._renderAxis = function(target) {

			target = target || this.element;

			for(var i in this.handles) {

				if(this.handles[i].constructor == String)
					this.handles[i] = $(this.handles[i], this.element).show();

				//Apply pad to wrapper element, needed to fix axis position (textarea, inputs, scrolls)
				if (this.elementIsWrapper && this.originalElement[0].nodeName.match(/textarea|input|select|button/i)) {

					var axis = $(this.handles[i], this.element), padWrapper = 0;

					//Checking the correct pad and border
					padWrapper = /sw|ne|nw|se|n|s/.test(i) ? axis.outerHeight() : axis.outerWidth();

					//The padding type i have to apply...
					var padPos = [ 'padding',
						/ne|nw|n/.test(i) ? 'Top' :
						/se|sw|s/.test(i) ? 'Bottom' :
						/^e$/.test(i) ? 'Right' : 'Left' ].join("");

					target.css(padPos, padWrapper);

					this._proportionallyResize();

				}

				//TODO: What's that good for? There's not anything to be executed left
				if(!$(this.handles[i]).length)
					continue;

			}
		};

		//TODO: make renderAxis a prototype function
		this._renderAxis(this.element);

		this._handles = $('.ui-resizable-handle', this.element)
			.disableSelection();

		//Matching axis name
		this._handles.mouseover(function() {
			if (!that.resizing) {
				if (this.className)
					var axis = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);
				//Axis, default = se
				that.axis = axis && axis[1] ? axis[1] : 'se';
			}
		});

		//If we want to auto hide the elements
		if (o.autoHide) {
			this._handles.hide();
			$(this.element)
				.addClass("ui-resizable-autohide")
				.mouseenter(function() {
					if (o.disabled) return;
					$(this).removeClass("ui-resizable-autohide");
					that._handles.show();
				})
				.mouseleave(function(){
					if (o.disabled) return;
					if (!that.resizing) {
						$(this).addClass("ui-resizable-autohide");
						that._handles.hide();
					}
				});
		}

		//Initialize the mouse interaction
		this._mouseInit();

	},

	_destroy: function() {

		this._mouseDestroy();

		var _destroy = function(exp) {
			$(exp).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing")
				.removeData("resizable").removeData("ui-resizable").unbind(".resizable").find('.ui-resizable-handle').remove();
		};

		//TODO: Unwrap at same DOM position
		if (this.elementIsWrapper) {
			_destroy(this.element);
			var wrapper = this.element;
			this.originalElement.css({
				position: wrapper.css('position'),
				width: wrapper.outerWidth(),
				height: wrapper.outerHeight(),
				top: wrapper.css('top'),
				left: wrapper.css('left')
			}).insertAfter( wrapper );
			wrapper.remove();
		}

		this.originalElement.css('resize', this.originalResizeStyle);
		_destroy(this.originalElement);

		return this;
	},

	_mouseCapture: function(event) {
		var handle = false;
		for (var i in this.handles) {
			if ($(this.handles[i])[0] == event.target) {
				handle = true;
			}
		}

		return !this.options.disabled && handle;
	},

	_mouseStart: function(event) {

		var o = this.options, iniPos = this.element.position(), el = this.element;

		this.resizing = true;
		this.documentScroll = { top: $(document).scrollTop(), left: $(document).scrollLeft() };

		// bugfix for http://dev.jquery.com/ticket/1749
		if (el.is('.ui-draggable') || (/absolute/).test(el.css('position'))) {
			el.css({ position: 'absolute', top: iniPos.top, left: iniPos.left });
		}

		this._renderProxy();

		var curleft = num(this.helper.css('left')), curtop = num(this.helper.css('top'));

		if (o.containment) {
			curleft += $(o.containment).scrollLeft() || 0;
			curtop += $(o.containment).scrollTop() || 0;
		}

		//Store needed variables
		this.offset = this.helper.offset();
		this.position = { left: curleft, top: curtop };
		this.size = this._helper ? { width: el.outerWidth(), height: el.outerHeight() } : { width: el.width(), height: el.height() };
		this.originalSize = this._helper ? { width: el.outerWidth(), height: el.outerHeight() } : { width: el.width(), height: el.height() };
		this.originalPosition = { left: curleft, top: curtop };
		this.sizeDiff = { width: el.outerWidth() - el.width(), height: el.outerHeight() - el.height() };
		this.originalMousePosition = { left: event.pageX, top: event.pageY };

		//Aspect Ratio
		this.aspectRatio = (typeof o.aspectRatio == 'number') ? o.aspectRatio : ((this.originalSize.width / this.originalSize.height) || 1);

		var cursor = $('.ui-resizable-' + this.axis).css('cursor');
		$('body').css('cursor', cursor == 'auto' ? this.axis + '-resize' : cursor);

		el.addClass("ui-resizable-resizing");
		this._propagate("start", event);
		return true;
	},

	_mouseDrag: function(event) {

		//Increase performance, avoid regex
		var el = this.helper, o = this.options, props = {},
			that = this, smp = this.originalMousePosition, a = this.axis;

		var dx = (event.pageX-smp.left)||0, dy = (event.pageY-smp.top)||0;
		var trigger = this._change[a];
		if (!trigger) return false;

		// Calculate the attrs that will be change
		var data = trigger.apply(this, [event, dx, dy]);

		// Put this in the mouseDrag handler since the user can start pressing shift while resizing
		this._updateVirtualBoundaries(event.shiftKey);
		if (this._aspectRatio || event.shiftKey)
			data = this._updateRatio(data, event);

		data = this._respectSize(data, event);

		// plugins callbacks need to be called first
		this._propagate("resize", event);

		el.css({
			top: this.position.top + "px", left: this.position.left + "px",
			width: this.size.width + "px", height: this.size.height + "px"
		});

		if (!this._helper && this._proportionallyResizeElements.length)
			this._proportionallyResize();

		this._updateCache(data);

		// calling the user callback at the end
		this._trigger('resize', event, this.ui());

		return false;
	},

	_mouseStop: function(event) {

		this.resizing = false;
		var o = this.options, that = this;

		if(this._helper) {
			var pr = this._proportionallyResizeElements, ista = pr.length && (/textarea/i).test(pr[0].nodeName),
				soffseth = ista && $.ui.hasScroll(pr[0], 'left') /* TODO - jump height */ ? 0 : that.sizeDiff.height,
				soffsetw = ista ? 0 : that.sizeDiff.width;

			var s = { width: (that.helper.width()  - soffsetw), height: (that.helper.height() - soffseth) },
				left = (parseInt(that.element.css('left'), 10) + (that.position.left - that.originalPosition.left)) || null,
				top = (parseInt(that.element.css('top'), 10) + (that.position.top - that.originalPosition.top)) || null;

			if (!o.animate)
				this.element.css($.extend(s, { top: top, left: left }));

			that.helper.height(that.size.height);
			that.helper.width(that.size.width);

			if (this._helper && !o.animate) this._proportionallyResize();
		}

		$('body').css('cursor', 'auto');

		this.element.removeClass("ui-resizable-resizing");

		this._propagate("stop", event);

		if (this._helper) this.helper.remove();
		return false;

	},

	_updateVirtualBoundaries: function(forceAspectRatio) {
		var o = this.options, pMinWidth, pMaxWidth, pMinHeight, pMaxHeight, b;

		b = {
			minWidth: isNumber(o.minWidth) ? o.minWidth : 0,
			maxWidth: isNumber(o.maxWidth) ? o.maxWidth : Infinity,
			minHeight: isNumber(o.minHeight) ? o.minHeight : 0,
			maxHeight: isNumber(o.maxHeight) ? o.maxHeight : Infinity
		};

		if(this._aspectRatio || forceAspectRatio) {
			// We want to create an enclosing box whose aspect ration is the requested one
			// First, compute the "projected" size for each dimension based on the aspect ratio and other dimension
			pMinWidth = b.minHeight * this.aspectRatio;
			pMinHeight = b.minWidth / this.aspectRatio;
			pMaxWidth = b.maxHeight * this.aspectRatio;
			pMaxHeight = b.maxWidth / this.aspectRatio;

			if(pMinWidth > b.minWidth) b.minWidth = pMinWidth;
			if(pMinHeight > b.minHeight) b.minHeight = pMinHeight;
			if(pMaxWidth < b.maxWidth) b.maxWidth = pMaxWidth;
			if(pMaxHeight < b.maxHeight) b.maxHeight = pMaxHeight;
		}
		this._vBoundaries = b;
	},

	_updateCache: function(data) {
		var o = this.options;
		this.offset = this.helper.offset();
		if (isNumber(data.left)) this.position.left = data.left;
		if (isNumber(data.top)) this.position.top = data.top;
		if (isNumber(data.height)) this.size.height = data.height;
		if (isNumber(data.width)) this.size.width = data.width;
	},

	_updateRatio: function(data, event) {

		var o = this.options, cpos = this.position, csize = this.size, a = this.axis;

		if (isNumber(data.height)) data.width = (data.height * this.aspectRatio);
		else if (isNumber(data.width)) data.height = (data.width / this.aspectRatio);

		if (a == 'sw') {
			data.left = cpos.left + (csize.width - data.width);
			data.top = null;
		}
		if (a == 'nw') {
			data.top = cpos.top + (csize.height - data.height);
			data.left = cpos.left + (csize.width - data.width);
		}

		return data;
	},

	_respectSize: function(data, event) {

		var el = this.helper, o = this._vBoundaries, pRatio = this._aspectRatio || event.shiftKey, a = this.axis,
				ismaxw = isNumber(data.width) && o.maxWidth && (o.maxWidth < data.width), ismaxh = isNumber(data.height) && o.maxHeight && (o.maxHeight < data.height),
					isminw = isNumber(data.width) && o.minWidth && (o.minWidth > data.width), isminh = isNumber(data.height) && o.minHeight && (o.minHeight > data.height);

		if (isminw) data.width = o.minWidth;
		if (isminh) data.height = o.minHeight;
		if (ismaxw) data.width = o.maxWidth;
		if (ismaxh) data.height = o.maxHeight;

		var dw = this.originalPosition.left + this.originalSize.width, dh = this.position.top + this.size.height;
		var cw = /sw|nw|w/.test(a), ch = /nw|ne|n/.test(a);

		if (isminw && cw) data.left = dw - o.minWidth;
		if (ismaxw && cw) data.left = dw - o.maxWidth;
		if (isminh && ch)	data.top = dh - o.minHeight;
		if (ismaxh && ch)	data.top = dh - o.maxHeight;

		// fixing jump error on top/left - bug #2330
		var isNotwh = !data.width && !data.height;
		if (isNotwh && !data.left && data.top) data.top = null;
		else if (isNotwh && !data.top && data.left) data.left = null;

		return data;
	},

	_proportionallyResize: function() {

		var o = this.options;
		if (!this._proportionallyResizeElements.length) return;
		var element = this.helper || this.element;

		for (var i=0; i < this._proportionallyResizeElements.length; i++) {

			var prel = this._proportionallyResizeElements[i];

			if (!this.borderDif) {
				var b = [prel.css('borderTopWidth'), prel.css('borderRightWidth'), prel.css('borderBottomWidth'), prel.css('borderLeftWidth')],
					p = [prel.css('paddingTop'), prel.css('paddingRight'), prel.css('paddingBottom'), prel.css('paddingLeft')];

				this.borderDif = $.map(b, function(v, i) {
					var border = parseInt(v,10)||0, padding = parseInt(p[i],10)||0;
					return border + padding;
				});
			}

			prel.css({
				height: (element.height() - this.borderDif[0] - this.borderDif[2]) || 0,
				width: (element.width() - this.borderDif[1] - this.borderDif[3]) || 0
			});

		};

	},

	_renderProxy: function() {

		var el = this.element, o = this.options;
		this.elementOffset = el.offset();

		if(this._helper) {

			this.helper = this.helper || $('<div style="overflow:hidden;"></div>');

			// fix ie6 offset TODO: This seems broken
			var ie6offset = ($.ui.ie6 ? 1 : 0),
			pxyoffset = ( $.ui.ie6 ? 2 : -1 );

			this.helper.addClass(this._helper).css({
				width: this.element.outerWidth() + pxyoffset,
				height: this.element.outerHeight() + pxyoffset,
				position: 'absolute',
				left: this.elementOffset.left - ie6offset +'px',
				top: this.elementOffset.top - ie6offset +'px',
				zIndex: ++o.zIndex //TODO: Don't modify option
			});

			this.helper
				.appendTo("body")
				.disableSelection();

		} else {
			this.helper = this.element;
		}

	},

	_change: {
		e: function(event, dx, dy) {
			return { width: this.originalSize.width + dx };
		},
		w: function(event, dx, dy) {
			var o = this.options, cs = this.originalSize, sp = this.originalPosition;
			return { left: sp.left + dx, width: cs.width - dx };
		},
		n: function(event, dx, dy) {
			var o = this.options, cs = this.originalSize, sp = this.originalPosition;
			return { top: sp.top + dy, height: cs.height - dy };
		},
		s: function(event, dx, dy) {
			return { height: this.originalSize.height + dy };
		},
		se: function(event, dx, dy) {
			return $.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
		},
		sw: function(event, dx, dy) {
			return $.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
		},
		ne: function(event, dx, dy) {
			return $.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
		},
		nw: function(event, dx, dy) {
			return $.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
		}
	},

	_propagate: function(n, event) {
		$.ui.plugin.call(this, n, [event, this.ui()]);
		(n != "resize" && this._trigger(n, event, this.ui()));
	},

	plugins: {},

	ui: function() {
		return {
			originalElement: this.originalElement,
			element: this.element,
			helper: this.helper,
			position: this.position,
			size: this.size,
			originalSize: this.originalSize,
			originalPosition: this.originalPosition
		};
	}

});

/*
 * Resizable Extensions
 */

$.ui.plugin.add("resizable", "alsoResize", {

	start: function (event, ui) {
		var that = $(this).data("resizable"), o = that.options;

		var _store = function (exp) {
			$(exp).each(function() {
				var el = $(this);
				el.data("resizable-alsoresize", {
					width: parseInt(el.width(), 10), height: parseInt(el.height(), 10),
					left: parseInt(el.css('left'), 10), top: parseInt(el.css('top'), 10)
				});
			});
		};

		if (typeof(o.alsoResize) == 'object' && !o.alsoResize.parentNode) {
			if (o.alsoResize.length) { o.alsoResize = o.alsoResize[0]; _store(o.alsoResize); }
			else { $.each(o.alsoResize, function (exp) { _store(exp); }); }
		}else{
			_store(o.alsoResize);
		}
	},

	resize: function (event, ui) {
		var that = $(this).data("resizable"), o = that.options, os = that.originalSize, op = that.originalPosition;

		var delta = {
			height: (that.size.height - os.height) || 0, width: (that.size.width - os.width) || 0,
			top: (that.position.top - op.top) || 0, left: (that.position.left - op.left) || 0
		},

		_alsoResize = function (exp, c) {
			$(exp).each(function() {
				var el = $(this), start = $(this).data("resizable-alsoresize"), style = {},
					css = c && c.length ? c : el.parents(ui.originalElement[0]).length ? ['width', 'height'] : ['width', 'height', 'top', 'left'];

				$.each(css, function (i, prop) {
					var sum = (start[prop]||0) + (delta[prop]||0);
					if (sum && sum >= 0)
						style[prop] = sum || null;
				});

				el.css(style);
			});
		};

		if (typeof(o.alsoResize) == 'object' && !o.alsoResize.nodeType) {
			$.each(o.alsoResize, function (exp, c) { _alsoResize(exp, c); });
		}else{
			_alsoResize(o.alsoResize);
		}
	},

	stop: function (event, ui) {
		$(this).removeData("resizable-alsoresize");
	}
});

$.ui.plugin.add("resizable", "animate", {

	stop: function(event, ui) {
		var that = $(this).data("resizable"), o = that.options;

		var pr = that._proportionallyResizeElements, ista = pr.length && (/textarea/i).test(pr[0].nodeName),
					soffseth = ista && $.ui.hasScroll(pr[0], 'left') /* TODO - jump height */ ? 0 : that.sizeDiff.height,
						soffsetw = ista ? 0 : that.sizeDiff.width;

		var style = { width: (that.size.width - soffsetw), height: (that.size.height - soffseth) },
					left = (parseInt(that.element.css('left'), 10) + (that.position.left - that.originalPosition.left)) || null,
						top = (parseInt(that.element.css('top'), 10) + (that.position.top - that.originalPosition.top)) || null;

		that.element.animate(
			$.extend(style, top && left ? { top: top, left: left } : {}), {
				duration: o.animateDuration,
				easing: o.animateEasing,
				step: function() {

					var data = {
						width: parseInt(that.element.css('width'), 10),
						height: parseInt(that.element.css('height'), 10),
						top: parseInt(that.element.css('top'), 10),
						left: parseInt(that.element.css('left'), 10)
					};

					if (pr && pr.length) $(pr[0]).css({ width: data.width, height: data.height });

					// propagating resize, and updating values for each animation step
					that._updateCache(data);
					that._propagate("resize", event);

				}
			}
		);
	}

});

$.ui.plugin.add("resizable", "containment", {

	start: function(event, ui) {
		var that = $(this).data("resizable"), o = that.options, el = that.element;
		var oc = o.containment,	ce = (oc instanceof $) ? oc.get(0) : (/parent/.test(oc)) ? el.parent().get(0) : oc;
		if (!ce) return;

		that.containerElement = $(ce);

		if (/document/.test(oc) || oc == document) {
			that.containerOffset = { left: 0, top: 0 };
			that.containerPosition = { left: 0, top: 0 };

			that.parentData = {
				element: $(document), left: 0, top: 0,
				width: $(document).width(), height: $(document).height() || document.body.parentNode.scrollHeight
			};
		}

		// i'm a node, so compute top, left, right, bottom
		else {
			var element = $(ce), p = [];
			$([ "Top", "Right", "Left", "Bottom" ]).each(function(i, name) { p[i] = num(element.css("padding" + name)); });

			that.containerOffset = element.offset();
			that.containerPosition = element.position();
			that.containerSize = { height: (element.innerHeight() - p[3]), width: (element.innerWidth() - p[1]) };

			var co = that.containerOffset, ch = that.containerSize.height,	cw = that.containerSize.width,
						width = ($.ui.hasScroll(ce, "left") ? ce.scrollWidth : cw ), height = ($.ui.hasScroll(ce) ? ce.scrollHeight : ch);

			that.parentData = {
				element: ce, left: co.left, top: co.top, width: width, height: height
			};
		}
	},

	resize: function(event, ui) {
		var that = $(this).data("resizable"), o = that.options,
				ps = that.containerSize, co = that.containerOffset, cs = that.size, cp = that.position,
				pRatio = that._aspectRatio || event.shiftKey, cop = { top:0, left:0 }, ce = that.containerElement;

		if (ce[0] != document && (/static/).test(ce.css('position'))) cop = co;

		if (cp.left < (that._helper ? co.left : 0)) {
			that.size.width = that.size.width + (that._helper ? (that.position.left - co.left) : (that.position.left - cop.left));
			if (pRatio) that.size.height = that.size.width / that.aspectRatio;
			that.position.left = o.helper ? co.left : 0;
		}

		if (cp.top < (that._helper ? co.top : 0)) {
			that.size.height = that.size.height + (that._helper ? (that.position.top - co.top) : that.position.top);
			if (pRatio) that.size.width = that.size.height * that.aspectRatio;
			that.position.top = that._helper ? co.top : 0;
		}

		that.offset.left = that.parentData.left+that.position.left;
		that.offset.top = that.parentData.top+that.position.top;

		var woset = Math.abs( (that._helper ? that.offset.left - cop.left : (that.offset.left - cop.left)) + that.sizeDiff.width ),
					hoset = Math.abs( (that._helper ? that.offset.top - cop.top : (that.offset.top - co.top)) + that.sizeDiff.height );

		var isParent = that.containerElement.get(0) == that.element.parent().get(0),
			isOffsetRelative = /relative|absolute/.test(that.containerElement.css('position'));

		if(isParent && isOffsetRelative) woset -= that.parentData.left;

		if (woset + that.size.width >= that.parentData.width) {
			that.size.width = that.parentData.width - woset;
			if (pRatio) that.size.height = that.size.width / that.aspectRatio;
		}

		if (hoset + that.size.height >= that.parentData.height) {
			that.size.height = that.parentData.height - hoset;
			if (pRatio) that.size.width = that.size.height * that.aspectRatio;
		}
	},

	stop: function(event, ui){
		var that = $(this).data("resizable"), o = that.options, cp = that.position,
				co = that.containerOffset, cop = that.containerPosition, ce = that.containerElement;

		var helper = $(that.helper), ho = helper.offset(), w = helper.outerWidth() - that.sizeDiff.width, h = helper.outerHeight() - that.sizeDiff.height;

		if (that._helper && !o.animate && (/relative/).test(ce.css('position')))
			$(this).css({ left: ho.left - cop.left - co.left, width: w, height: h });

		if (that._helper && !o.animate && (/static/).test(ce.css('position')))
			$(this).css({ left: ho.left - cop.left - co.left, width: w, height: h });

	}
});

$.ui.plugin.add("resizable", "ghost", {

	start: function(event, ui) {

		var that = $(this).data("resizable"), o = that.options, cs = that.size;

		that.ghost = that.originalElement.clone();
		that.ghost
			.css({ opacity: .25, display: 'block', position: 'relative', height: cs.height, width: cs.width, margin: 0, left: 0, top: 0 })
			.addClass('ui-resizable-ghost')
			.addClass(typeof o.ghost == 'string' ? o.ghost : '');

		that.ghost.appendTo(that.helper);

	},

	resize: function(event, ui){
		var that = $(this).data("resizable"), o = that.options;
		if (that.ghost) that.ghost.css({ position: 'relative', height: that.size.height, width: that.size.width });
	},

	stop: function(event, ui){
		var that = $(this).data("resizable"), o = that.options;
		if (that.ghost && that.helper) that.helper.get(0).removeChild(that.ghost.get(0));
	}

});

$.ui.plugin.add("resizable", "grid", {

	resize: function(event, ui) {
		var that = $(this).data("resizable"), o = that.options, cs = that.size, os = that.originalSize, op = that.originalPosition, a = that.axis, ratio = o._aspectRatio || event.shiftKey;
		o.grid = typeof o.grid == "number" ? [o.grid, o.grid] : o.grid;
		var ox = Math.round((cs.width - os.width) / (o.grid[0]||1)) * (o.grid[0]||1), oy = Math.round((cs.height - os.height) / (o.grid[1]||1)) * (o.grid[1]||1);

		if (/^(se|s|e)$/.test(a)) {
			that.size.width = os.width + ox;
			that.size.height = os.height + oy;
		}
		else if (/^(ne)$/.test(a)) {
			that.size.width = os.width + ox;
			that.size.height = os.height + oy;
			that.position.top = op.top - oy;
		}
		else if (/^(sw)$/.test(a)) {
			that.size.width = os.width + ox;
			that.size.height = os.height + oy;
			that.position.left = op.left - ox;
		}
		else {
			that.size.width = os.width + ox;
			that.size.height = os.height + oy;
			that.position.top = op.top - oy;
			that.position.left = op.left - ox;
		}
	}

});

var num = function(v) {
	return parseInt(v, 10) || 0;
};

var isNumber = function(value) {
	return !isNaN(parseInt(value, 10));
};

})(jQuery);
(function( $, undefined ) {

// used to prevent race conditions with remote data sources
var requestIndex = 0;

$.widget( "ui.autocomplete", {
	version: "1.9.2",
	defaultElement: "<input>",
	options: {
		appendTo: "body",
		autoFocus: false,
		delay: 300,
		minLength: 1,
		position: {
			my: "left top",
			at: "left bottom",
			collision: "none"
		},
		source: null,

		// callbacks
		change: null,
		close: null,
		focus: null,
		open: null,
		response: null,
		search: null,
		select: null
	},

	pending: 0,

	_create: function() {
		// Some browsers only repeat keydown events, not keypress events,
		// so we use the suppressKeyPress flag to determine if we've already
		// handled the keydown event. #7269
		// Unfortunately the code for & in keypress is the same as the up arrow,
		// so we use the suppressKeyPressRepeat flag to avoid handling keypress
		// events when we know the keydown event was used to modify the
		// search term. #7799
		var suppressKeyPress, suppressKeyPressRepeat, suppressInput;

		this.isMultiLine = this._isMultiLine();
		this.valueMethod = this.element[ this.element.is( "input,textarea" ) ? "val" : "text" ];
		this.isNewMenu = true;

		this.element
			.addClass( "ui-autocomplete-input" )
			.attr( "autocomplete", "off" );

		this._on( this.element, {
			keydown: function( event ) {
				if ( this.element.prop( "readOnly" ) ) {
					suppressKeyPress = true;
					suppressInput = true;
					suppressKeyPressRepeat = true;
					return;
				}

				suppressKeyPress = false;
				suppressInput = false;
				suppressKeyPressRepeat = false;
				var keyCode = $.ui.keyCode;
				switch( event.keyCode ) {
				case keyCode.PAGE_UP:
					suppressKeyPress = true;
					this._move( "previousPage", event );
					break;
				case keyCode.PAGE_DOWN:
					suppressKeyPress = true;
					this._move( "nextPage", event );
					break;
				case keyCode.UP:
					suppressKeyPress = true;
					this._keyEvent( "previous", event );
					break;
				case keyCode.DOWN:
					suppressKeyPress = true;
					this._keyEvent( "next", event );
					break;
				case keyCode.ENTER:
				case keyCode.NUMPAD_ENTER:
					// when menu is open and has focus
					if ( this.menu.active ) {
						// #6055 - Opera still allows the keypress to occur
						// which causes forms to submit
						suppressKeyPress = true;
						event.preventDefault();
						this.menu.select( event );
					}
					break;
				case keyCode.TAB:
					if ( this.menu.active ) {
						this.menu.select( event );
					}
					break;
				case keyCode.ESCAPE:
					if ( this.menu.element.is( ":visible" ) ) {
						this._value( this.term );
						this.close( event );
						// Different browsers have different default behavior for escape
						// Single press can mean undo or clear
						// Double press in IE means clear the whole form
						event.preventDefault();
					}
					break;
				default:
					suppressKeyPressRepeat = true;
					// search timeout should be triggered before the input value is changed
					this._searchTimeout( event );
					break;
				}
			},
			keypress: function( event ) {
				if ( suppressKeyPress ) {
					suppressKeyPress = false;
					event.preventDefault();
					return;
				}
				if ( suppressKeyPressRepeat ) {
					return;
				}

				// replicate some key handlers to allow them to repeat in Firefox and Opera
				var keyCode = $.ui.keyCode;
				switch( event.keyCode ) {
				case keyCode.PAGE_UP:
					this._move( "previousPage", event );
					break;
				case keyCode.PAGE_DOWN:
					this._move( "nextPage", event );
					break;
				case keyCode.UP:
					this._keyEvent( "previous", event );
					break;
				case keyCode.DOWN:
					this._keyEvent( "next", event );
					break;
				}
			},
			input: function( event ) {
				if ( suppressInput ) {
					suppressInput = false;
					event.preventDefault();
					return;
				}
				this._searchTimeout( event );
			},
			focus: function() {
				this.selectedItem = null;
				this.previous = this._value();
			},
			blur: function( event ) {
				if ( this.cancelBlur ) {
					delete this.cancelBlur;
					return;
				}

				clearTimeout( this.searching );
				this.close( event );
				this._change( event );
			}
		});

		this._initSource();
		this.menu = $( "<ul>" )
			.addClass( "ui-autocomplete" )
			.appendTo( this.document.find( this.options.appendTo || "body" )[ 0 ] )
			.menu({
				// custom key handling for now
				input: $(),
				// disable ARIA support, the live region takes care of that
				role: null
			})
			.zIndex( this.element.zIndex() + 1 )
			.hide()
			.data( "menu" );

		this._on( this.menu.element, {
			mousedown: function( event ) {
				// prevent moving focus out of the text field
				event.preventDefault();

				// IE doesn't prevent moving focus even with event.preventDefault()
				// so we set a flag to know when we should ignore the blur event
				this.cancelBlur = true;
				this._delay(function() {
					delete this.cancelBlur;
				});

				// clicking on the scrollbar causes focus to shift to the body
				// but we can't detect a mouseup or a click immediately afterward
				// so we have to track the next mousedown and close the menu if
				// the user clicks somewhere outside of the autocomplete
				var menuElement = this.menu.element[ 0 ];
				if ( !$( event.target ).closest( ".ui-menu-item" ).length ) {
					this._delay(function() {
						var that = this;
						this.document.one( "mousedown", function( event ) {
							if ( event.target !== that.element[ 0 ] &&
									event.target !== menuElement &&
									!$.contains( menuElement, event.target ) ) {
								that.close();
							}
						});
					});
				}
			},
			menufocus: function( event, ui ) {
				// #7024 - Prevent accidental activation of menu items in Firefox
				if ( this.isNewMenu ) {
					this.isNewMenu = false;
					if ( event.originalEvent && /^mouse/.test( event.originalEvent.type ) ) {
						this.menu.blur();

						this.document.one( "mousemove", function() {
							$( event.target ).trigger( event.originalEvent );
						});

						return;
					}
				}

				// back compat for _renderItem using item.autocomplete, via #7810
				// TODO remove the fallback, see #8156
				var item = ui.item.data( "ui-autocomplete-item" ) || ui.item.data( "item.autocomplete" );
				if ( false !== this._trigger( "focus", event, { item: item } ) ) {
					// use value to match what will end up in the input, if it was a key event
					if ( event.originalEvent && /^key/.test( event.originalEvent.type ) ) {
						this._value( item.value );
					}
				} else {
					// Normally the input is populated with the item's value as the
					// menu is navigated, causing screen readers to notice a change and
					// announce the item. Since the focus event was canceled, this doesn't
					// happen, so we update the live region so that screen readers can
					// still notice the change and announce it.
					this.liveRegion.text( item.value );
				}
			},
			menuselect: function( event, ui ) {
				// back compat for _renderItem using item.autocomplete, via #7810
				// TODO remove the fallback, see #8156
				var item = ui.item.data( "ui-autocomplete-item" ) || ui.item.data( "item.autocomplete" ),
					previous = this.previous;

				// only trigger when focus was lost (click on menu)
				if ( this.element[0] !== this.document[0].activeElement ) {
					this.element.focus();
					this.previous = previous;
					// #6109 - IE triggers two focus events and the second
					// is asynchronous, so we need to reset the previous
					// term synchronously and asynchronously :-(
					this._delay(function() {
						this.previous = previous;
						this.selectedItem = item;
					});
				}

				if ( false !== this._trigger( "select", event, { item: item } ) ) {
					this._value( item.value );
				}
				// reset the term after the select event
				// this allows custom select handling to work properly
				this.term = this._value();

				this.close( event );
				this.selectedItem = item;
			}
		});

		this.liveRegion = $( "<span>", {
				role: "status",
				"aria-live": "polite"
			})
			.addClass( "ui-helper-hidden-accessible" )
			.insertAfter( this.element );

		if ( $.fn.bgiframe ) {
			this.menu.element.bgiframe();
		}

		// turning off autocomplete prevents the browser from remembering the
		// value when navigating through history, so we re-enable autocomplete
		// if the page is unloaded before the widget is destroyed. #7790
		this._on( this.window, {
			beforeunload: function() {
				this.element.removeAttr( "autocomplete" );
			}
		});
	},

	_destroy: function() {
		clearTimeout( this.searching );
		this.element
			.removeClass( "ui-autocomplete-input" )
			.removeAttr( "autocomplete" );
		this.menu.element.remove();
		this.liveRegion.remove();
	},

	_setOption: function( key, value ) {
		this._super( key, value );
		if ( key === "source" ) {
			this._initSource();
		}
		if ( key === "appendTo" ) {
			this.menu.element.appendTo( this.document.find( value || "body" )[0] );
		}
		if ( key === "disabled" && value && this.xhr ) {
			this.xhr.abort();
		}
	},

	_isMultiLine: function() {
		// Textareas are always multi-line
		if ( this.element.is( "textarea" ) ) {
			return true;
		}
		// Inputs are always single-line, even if inside a contentEditable element
		// IE also treats inputs as contentEditable
		if ( this.element.is( "input" ) ) {
			return false;
		}
		// All other element types are determined by whether or not they're contentEditable
		return this.element.prop( "isContentEditable" );
	},

	_initSource: function() {
		var array, url,
			that = this;
		if ( $.isArray(this.options.source) ) {
			array = this.options.source;
			this.source = function( request, response ) {
				response( $.ui.autocomplete.filter( array, request.term ) );
			};
		} else if ( typeof this.options.source === "string" ) {
			url = this.options.source;
			this.source = function( request, response ) {
				if ( that.xhr ) {
					that.xhr.abort();
				}
				that.xhr = $.ajax({
					url: url,
					data: request,
					dataType: "json",
					success: function( data ) {
						response( data );
					},
					error: function() {
						response( [] );
					}
				});
			};
		} else {
			this.source = this.options.source;
		}
	},

	_searchTimeout: function( event ) {
		clearTimeout( this.searching );
		this.searching = this._delay(function() {
			// only search if the value has changed
			if ( this.term !== this._value() ) {
				this.selectedItem = null;
				this.search( null, event );
			}
		}, this.options.delay );
	},

	search: function( value, event ) {
		value = value != null ? value : this._value();

		// always save the actual value, not the one passed as an argument
		this.term = this._value();

		if ( value.length < this.options.minLength ) {
			return this.close( event );
		}

		if ( this._trigger( "search", event ) === false ) {
			return;
		}

		return this._search( value );
	},

	_search: function( value ) {
		this.pending++;
		this.element.addClass( "ui-autocomplete-loading" );
		this.cancelSearch = false;

		this.source( { term: value }, this._response() );
	},

	_response: function() {
		var that = this,
			index = ++requestIndex;

		return function( content ) {
			if ( index === requestIndex ) {
				that.__response( content );
			}

			that.pending--;
			if ( !that.pending ) {
				that.element.removeClass( "ui-autocomplete-loading" );
			}
		};
	},

	__response: function( content ) {
		if ( content ) {
			content = this._normalize( content );
		}
		this._trigger( "response", null, { content: content } );
		if ( !this.options.disabled && content && content.length && !this.cancelSearch ) {
			this._suggest( content );
			this._trigger( "open" );
		} else {
			// use ._close() instead of .close() so we don't cancel future searches
			this._close();
		}
	},

	close: function( event ) {
		this.cancelSearch = true;
		this._close( event );
	},

	_close: function( event ) {
		if ( this.menu.element.is( ":visible" ) ) {
			this.menu.element.hide();
			this.menu.blur();
			this.isNewMenu = true;
			this._trigger( "close", event );
		}
	},

	_change: function( event ) {
		if ( this.previous !== this._value() ) {
			this._trigger( "change", event, { item: this.selectedItem } );
		}
	},

	_normalize: function( items ) {
		// assume all items have the right format when the first item is complete
		if ( items.length && items[0].label && items[0].value ) {
			return items;
		}
		return $.map( items, function( item ) {
			if ( typeof item === "string" ) {
				return {
					label: item,
					value: item
				};
			}
			return $.extend({
				label: item.label || item.value,
				value: item.value || item.label
			}, item );
		});
	},

	_suggest: function( items ) {
		var ul = this.menu.element
			.empty()
			.zIndex( this.element.zIndex() + 1 );
		this._renderMenu( ul, items );
		this.menu.refresh();

		// size and position menu
		ul.show();
		this._resizeMenu();
		ul.position( $.extend({
			of: this.element
		}, this.options.position ));

		if ( this.options.autoFocus ) {
			this.menu.next();
		}
	},

	_resizeMenu: function() {
		var ul = this.menu.element;
		ul.outerWidth( Math.max(
			// Firefox wraps long text (possibly a rounding bug)
			// so we add 1px to avoid the wrapping (#7513)
			ul.width( "" ).outerWidth() + 1,
			this.element.outerWidth()
		) );
	},

	_renderMenu: function( ul, items ) {
		var that = this;
		$.each( items, function( index, item ) {
			that._renderItemData( ul, item );
		});
	},

	_renderItemData: function( ul, item ) {
		return this._renderItem( ul, item ).data( "ui-autocomplete-item", item );
	},

	_renderItem: function( ul, item ) {
		return $( "<li>" )
			.append( $( "<a>" ).text( item.label ) )
			.appendTo( ul );
	},

	_move: function( direction, event ) {
		if ( !this.menu.element.is( ":visible" ) ) {
			this.search( null, event );
			return;
		}
		if ( this.menu.isFirstItem() && /^previous/.test( direction ) ||
				this.menu.isLastItem() && /^next/.test( direction ) ) {
			this._value( this.term );
			this.menu.blur();
			return;
		}
		this.menu[ direction ]( event );
	},

	widget: function() {
		return this.menu.element;
	},

	_value: function() {
		return this.valueMethod.apply( this.element, arguments );
	},

	_keyEvent: function( keyEvent, event ) {
		if ( !this.isMultiLine || this.menu.element.is( ":visible" ) ) {
			this._move( keyEvent, event );

			// prevents moving cursor to beginning/end of the text field in some browsers
			event.preventDefault();
		}
	}
});

$.extend( $.ui.autocomplete, {
	escapeRegex: function( value ) {
		return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
	},
	filter: function(array, term) {
		var matcher = new RegExp( $.ui.autocomplete.escapeRegex(term), "i" );
		return $.grep( array, function(value) {
			return matcher.test( value.label || value.value || value );
		});
	}
});


// live region extension, adding a `messages` option
// NOTE: This is an experimental API. We are still investigating
// a full solution for string manipulation and internationalization.
$.widget( "ui.autocomplete", $.ui.autocomplete, {
	options: {
		messages: {
			noResults: "No search results.",
			results: function( amount ) {
				return amount + ( amount > 1 ? " results are" : " result is" ) +
					" available, use up and down arrow keys to navigate.";
			}
		}
	},

	__response: function( content ) {
		var message;
		this._superApply( arguments );
		if ( this.options.disabled || this.cancelSearch ) {
			return;
		}
		if ( content && content.length ) {
			message = this.options.messages.results( content.length );
		} else {
			message = this.options.messages.noResults;
		}
		this.liveRegion.text( message );
	}
});


}( jQuery ));
(function( $, undefined ) {

var lastActive, startXPos, startYPos, clickDragged,
	baseClasses = "ui-button ui-widget ui-state-default ui-corner-all",
	stateClasses = "ui-state-hover ui-state-active ",
	typeClasses = "ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only",
	formResetHandler = function() {
		var buttons = $( this ).find( ":ui-button" );
		setTimeout(function() {
			buttons.button( "refresh" );
		}, 1 );
	},
	radioGroup = function( radio ) {
		var name = radio.name,
			form = radio.form,
			radios = $( [] );
		if ( name ) {
			if ( form ) {
				radios = $( form ).find( "[name='" + name + "']" );
			} else {
				radios = $( "[name='" + name + "']", radio.ownerDocument )
					.filter(function() {
						return !this.form;
					});
			}
		}
		return radios;
	};

$.widget( "ui.button", {
	version: "1.9.2",
	defaultElement: "<button>",
	options: {
		disabled: null,
		text: true,
		label: null,
		icons: {
			primary: null,
			secondary: null
		}
	},
	_create: function() {
		this.element.closest( "form" )
			.unbind( "reset" + this.eventNamespace )
			.bind( "reset" + this.eventNamespace, formResetHandler );

		if ( typeof this.options.disabled !== "boolean" ) {
			this.options.disabled = !!this.element.prop( "disabled" );
		} else {
			this.element.prop( "disabled", this.options.disabled );
		}

		this._determineButtonType();
		this.hasTitle = !!this.buttonElement.attr( "title" );

		var that = this,
			options = this.options,
			toggleButton = this.type === "checkbox" || this.type === "radio",
			activeClass = !toggleButton ? "ui-state-active" : "",
			focusClass = "ui-state-focus";

		if ( options.label === null ) {
			options.label = (this.type === "input" ? this.buttonElement.val() : this.buttonElement.html());
		}

		this._hoverable( this.buttonElement );

		this.buttonElement
			.addClass( baseClasses )
			.attr( "role", "button" )
			.bind( "mouseenter" + this.eventNamespace, function() {
				if ( options.disabled ) {
					return;
				}
				if ( this === lastActive ) {
					$( this ).addClass( "ui-state-active" );
				}
			})
			.bind( "mouseleave" + this.eventNamespace, function() {
				if ( options.disabled ) {
					return;
				}
				$( this ).removeClass( activeClass );
			})
			.bind( "click" + this.eventNamespace, function( event ) {
				if ( options.disabled ) {
					event.preventDefault();
					event.stopImmediatePropagation();
				}
			});

		this.element
			.bind( "focus" + this.eventNamespace, function() {
				// no need to check disabled, focus won't be triggered anyway
				that.buttonElement.addClass( focusClass );
			})
			.bind( "blur" + this.eventNamespace, function() {
				that.buttonElement.removeClass( focusClass );
			});

		if ( toggleButton ) {
			this.element.bind( "change" + this.eventNamespace, function() {
				if ( clickDragged ) {
					return;
				}
				that.refresh();
			});
			// if mouse moves between mousedown and mouseup (drag) set clickDragged flag
			// prevents issue where button state changes but checkbox/radio checked state
			// does not in Firefox (see ticket #6970)
			this.buttonElement
				.bind( "mousedown" + this.eventNamespace, function( event ) {
					if ( options.disabled ) {
						return;
					}
					clickDragged = false;
					startXPos = event.pageX;
					startYPos = event.pageY;
				})
				.bind( "mouseup" + this.eventNamespace, function( event ) {
					if ( options.disabled ) {
						return;
					}
					if ( startXPos !== event.pageX || startYPos !== event.pageY ) {
						clickDragged = true;
					}
			});
		}

		if ( this.type === "checkbox" ) {
			this.buttonElement.bind( "click" + this.eventNamespace, function() {
				if ( options.disabled || clickDragged ) {
					return false;
				}
				$( this ).toggleClass( "ui-state-active" );
				that.buttonElement.attr( "aria-pressed", that.element[0].checked );
			});
		} else if ( this.type === "radio" ) {
			this.buttonElement.bind( "click" + this.eventNamespace, function() {
				if ( options.disabled || clickDragged ) {
					return false;
				}
				$( this ).addClass( "ui-state-active" );
				that.buttonElement.attr( "aria-pressed", "true" );

				var radio = that.element[ 0 ];
				radioGroup( radio )
					.not( radio )
					.map(function() {
						return $( this ).button( "widget" )[ 0 ];
					})
					.removeClass( "ui-state-active" )
					.attr( "aria-pressed", "false" );
			});
		} else {
			this.buttonElement
				.bind( "mousedown" + this.eventNamespace, function() {
					if ( options.disabled ) {
						return false;
					}
					$( this ).addClass( "ui-state-active" );
					lastActive = this;
					that.document.one( "mouseup", function() {
						lastActive = null;
					});
				})
				.bind( "mouseup" + this.eventNamespace, function() {
					if ( options.disabled ) {
						return false;
					}
					$( this ).removeClass( "ui-state-active" );
				})
				.bind( "keydown" + this.eventNamespace, function(event) {
					if ( options.disabled ) {
						return false;
					}
					if ( event.keyCode === $.ui.keyCode.SPACE || event.keyCode === $.ui.keyCode.ENTER ) {
						$( this ).addClass( "ui-state-active" );
					}
				})
				.bind( "keyup" + this.eventNamespace, function() {
					$( this ).removeClass( "ui-state-active" );
				});

			if ( this.buttonElement.is("a") ) {
				this.buttonElement.keyup(function(event) {
					if ( event.keyCode === $.ui.keyCode.SPACE ) {
						// TODO pass through original event correctly (just as 2nd argument doesn't work)
						$( this ).click();
					}
				});
			}
		}

		// TODO: pull out $.Widget's handling for the disabled option into
		// $.Widget.prototype._setOptionDisabled so it's easy to proxy and can
		// be overridden by individual plugins
		this._setOption( "disabled", options.disabled );
		this._resetButton();
	},

	_determineButtonType: function() {
		var ancestor, labelSelector, checked;

		if ( this.element.is("[type=checkbox]") ) {
			this.type = "checkbox";
		} else if ( this.element.is("[type=radio]") ) {
			this.type = "radio";
		} else if ( this.element.is("input") ) {
			this.type = "input";
		} else {
			this.type = "button";
		}

		if ( this.type === "checkbox" || this.type === "radio" ) {
			// we don't search against the document in case the element
			// is disconnected from the DOM
			ancestor = this.element.parents().last();
			labelSelector = "label[for='" + this.element.attr("id") + "']";
			this.buttonElement = ancestor.find( labelSelector );
			if ( !this.buttonElement.length ) {
				ancestor = ancestor.length ? ancestor.siblings() : this.element.siblings();
				this.buttonElement = ancestor.filter( labelSelector );
				if ( !this.buttonElement.length ) {
					this.buttonElement = ancestor.find( labelSelector );
				}
			}
			this.element.addClass( "ui-helper-hidden-accessible" );

			checked = this.element.is( ":checked" );
			if ( checked ) {
				this.buttonElement.addClass( "ui-state-active" );
			}
			this.buttonElement.prop( "aria-pressed", checked );
		} else {
			this.buttonElement = this.element;
		}
	},

	widget: function() {
		return this.buttonElement;
	},

	_destroy: function() {
		this.element
			.removeClass( "ui-helper-hidden-accessible" );
		this.buttonElement
			.removeClass( baseClasses + " " + stateClasses + " " + typeClasses )
			.removeAttr( "role" )
			.removeAttr( "aria-pressed" )
			.html( this.buttonElement.find(".ui-button-text").html() );

		if ( !this.hasTitle ) {
			this.buttonElement.removeAttr( "title" );
		}
	},

	_setOption: function( key, value ) {
		this._super( key, value );
		if ( key === "disabled" ) {
			if ( value ) {
				this.element.prop( "disabled", true );
			} else {
				this.element.prop( "disabled", false );
			}
			return;
		}
		this._resetButton();
	},

	refresh: function() {
		//See #8237 & #8828
		var isDisabled = this.element.is( "input, button" ) ? this.element.is( ":disabled" ) : this.element.hasClass( "ui-button-disabled" );

		if ( isDisabled !== this.options.disabled ) {
			this._setOption( "disabled", isDisabled );
		}
		if ( this.type === "radio" ) {
			radioGroup( this.element[0] ).each(function() {
				if ( $( this ).is( ":checked" ) ) {
					$( this ).button( "widget" )
						.addClass( "ui-state-active" )
						.attr( "aria-pressed", "true" );
				} else {
					$( this ).button( "widget" )
						.removeClass( "ui-state-active" )
						.attr( "aria-pressed", "false" );
				}
			});
		} else if ( this.type === "checkbox" ) {
			if ( this.element.is( ":checked" ) ) {
				this.buttonElement
					.addClass( "ui-state-active" )
					.attr( "aria-pressed", "true" );
			} else {
				this.buttonElement
					.removeClass( "ui-state-active" )
					.attr( "aria-pressed", "false" );
			}
		}
	},

	_resetButton: function() {
		if ( this.type === "input" ) {
			if ( this.options.label ) {
				this.element.val( this.options.label );
			}
			return;
		}
		var buttonElement = this.buttonElement.removeClass( typeClasses ),
			buttonText = $( "<span></span>", this.document[0] )
				.addClass( "ui-button-text" )
				.html( this.options.label )
				.appendTo( buttonElement.empty() )
				.text(),
			icons = this.options.icons,
			multipleIcons = icons.primary && icons.secondary,
			buttonClasses = [];

		if ( icons.primary || icons.secondary ) {
			if ( this.options.text ) {
				buttonClasses.push( "ui-button-text-icon" + ( multipleIcons ? "s" : ( icons.primary ? "-primary" : "-secondary" ) ) );
			}

			if ( icons.primary ) {
				buttonElement.prepend( "<span class='ui-button-icon-primary ui-icon " + icons.primary + "'></span>" );
			}

			if ( icons.secondary ) {
				buttonElement.append( "<span class='ui-button-icon-secondary ui-icon " + icons.secondary + "'></span>" );
			}

			if ( !this.options.text ) {
				buttonClasses.push( multipleIcons ? "ui-button-icons-only" : "ui-button-icon-only" );

				if ( !this.hasTitle ) {
					buttonElement.attr( "title", $.trim( buttonText ) );
				}
			}
		} else {
			buttonClasses.push( "ui-button-text-only" );
		}
		buttonElement.addClass( buttonClasses.join( " " ) );
	}
});

$.widget( "ui.buttonset", {
	version: "1.9.2",
	options: {
		items: "button, input[type=button], input[type=submit], input[type=reset], input[type=checkbox], input[type=radio], a, :data(button)"
	},

	_create: function() {
		this.element.addClass( "ui-buttonset" );
	},

	_init: function() {
		this.refresh();
	},

	_setOption: function( key, value ) {
		if ( key === "disabled" ) {
			this.buttons.button( "option", key, value );
		}

		this._super( key, value );
	},

	refresh: function() {
		var rtl = this.element.css( "direction" ) === "rtl";

		this.buttons = this.element.find( this.options.items )
			.filter( ":ui-button" )
				.button( "refresh" )
			.end()
			.not( ":ui-button" )
				.button()
			.end()
			.map(function() {
				return $( this ).button( "widget" )[ 0 ];
			})
				.removeClass( "ui-corner-all ui-corner-left ui-corner-right" )
				.filter( ":first" )
					.addClass( rtl ? "ui-corner-right" : "ui-corner-left" )
				.end()
				.filter( ":last" )
					.addClass( rtl ? "ui-corner-left" : "ui-corner-right" )
				.end()
			.end();
	},

	_destroy: function() {
		this.element.removeClass( "ui-buttonset" );
		this.buttons
			.map(function() {
				return $( this ).button( "widget" )[ 0 ];
			})
				.removeClass( "ui-corner-left ui-corner-right" )
			.end()
			.button( "destroy" );
	}
});

}( jQuery ) );
(function( $, undefined ) {

$.extend($.ui, { datepicker: { version: "1.9.2" } });

var PROP_NAME = 'datepicker';
var dpuuid = new Date().getTime();
var instActive;

/* Date picker manager.
   Use the singleton instance of this class, $.datepicker, to interact with the date picker.
   Settings for (groups of) date pickers are maintained in an instance object,
   allowing multiple different settings on the same page. */

function Datepicker() {
	this.debug = false; // Change this to true to start debugging
	this._curInst = null; // The current instance in use
	this._keyEvent = false; // If the last event was a key event
	this._disabledInputs = []; // List of date picker inputs that have been disabled
	this._datepickerShowing = false; // True if the popup picker is showing , false if not
	this._inDialog = false; // True if showing within a "dialog", false if not
	this._mainDivId = 'ui-datepicker-div'; // The ID of the main datepicker division
	this._inlineClass = 'ui-datepicker-inline'; // The name of the inline marker class
	this._appendClass = 'ui-datepicker-append'; // The name of the append marker class
	this._triggerClass = 'ui-datepicker-trigger'; // The name of the trigger marker class
	this._dialogClass = 'ui-datepicker-dialog'; // The name of the dialog marker class
	this._disableClass = 'ui-datepicker-disabled'; // The name of the disabled covering marker class
	this._unselectableClass = 'ui-datepicker-unselectable'; // The name of the unselectable cell marker class
	this._currentClass = 'ui-datepicker-current-day'; // The name of the current day marker class
	this._dayOverClass = 'ui-datepicker-days-cell-over'; // The name of the day hover marker class
	this.regional = []; // Available regional settings, indexed by language code
	this.regional[''] = { // Default regional settings
		closeText: 'Done', // Display text for close link
		prevText: 'Prev', // Display text for previous month link
		nextText: 'Next', // Display text for next month link
		currentText: 'Today', // Display text for current month link
		monthNames: ['January','February','March','April','May','June',
			'July','August','September','October','November','December'], // Names of months for drop-down and formatting
		monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // For formatting
		dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], // For formatting
		dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], // For formatting
		dayNamesMin: ['Su','Mo','Tu','We','Th','Fr','Sa'], // Column headings for days starting at Sunday
		weekHeader: 'Wk', // Column header for week of the year
		dateFormat: 'mm/dd/yy', // See format options on parseDate
		firstDay: 0, // The first day of the week, Sun = 0, Mon = 1, ...
		isRTL: false, // True if right-to-left language, false if left-to-right
		showMonthAfterYear: false, // True if the year select precedes month, false for month then year
		yearSuffix: '' // Additional text to append to the year in the month headers
	};
	this._defaults = { // Global defaults for all the date picker instances
		showOn: 'focus', // 'focus' for popup on focus,
			// 'button' for trigger button, or 'both' for either
		showAnim: 'fadeIn', // Name of jQuery animation for popup
		showOptions: {}, // Options for enhanced animations
		defaultDate: null, // Used when field is blank: actual date,
			// +/-number for offset from today, null for today
		appendText: '', // Display text following the input box, e.g. showing the format
		buttonText: '...', // Text for trigger button
		buttonImage: '', // URL for trigger button image
		buttonImageOnly: false, // True if the image appears alone, false if it appears on a button
		hideIfNoPrevNext: false, // True to hide next/previous month links
			// if not applicable, false to just disable them
		navigationAsDateFormat: false, // True if date formatting applied to prev/today/next links
		gotoCurrent: false, // True if today link goes back to current selection instead
		changeMonth: false, // True if month can be selected directly, false if only prev/next
		changeYear: false, // True if year can be selected directly, false if only prev/next
		yearRange: 'c-10:c+10', // Range of years to display in drop-down,
			// either relative to today's year (-nn:+nn), relative to currently displayed year
			// (c-nn:c+nn), absolute (nnnn:nnnn), or a combination of the above (nnnn:-n)
		showOtherMonths: false, // True to show dates in other months, false to leave blank
		selectOtherMonths: false, // True to allow selection of dates in other months, false for unselectable
		showWeek: false, // True to show week of the year, false to not show it
		calculateWeek: this.iso8601Week, // How to calculate the week of the year,
			// takes a Date and returns the number of the week for it
		shortYearCutoff: '+10', // Short year values < this are in the current century,
			// > this are in the previous century,
			// string value starting with '+' for current year + value
		minDate: null, // The earliest selectable date, or null for no limit
		maxDate: null, // The latest selectable date, or null for no limit
		duration: 'fast', // Duration of display/closure
		beforeShowDay: null, // Function that takes a date and returns an array with
			// [0] = true if selectable, false if not, [1] = custom CSS class name(s) or '',
			// [2] = cell title (optional), e.g. $.datepicker.noWeekends
		beforeShow: null, // Function that takes an input field and
			// returns a set of custom settings for the date picker
		onSelect: null, // Define a callback function when a date is selected
		onChangeMonthYear: null, // Define a callback function when the month or year is changed
		onClose: null, // Define a callback function when the datepicker is closed
		numberOfMonths: 1, // Number of months to show at a time
		showCurrentAtPos: 0, // The position in multipe months at which to show the current month (starting at 0)
		stepMonths: 1, // Number of months to step back/forward
		stepBigMonths: 12, // Number of months to step back/forward for the big links
		altField: '', // Selector for an alternate field to store selected dates into
		altFormat: '', // The date format to use for the alternate field
		constrainInput: true, // The input is constrained by the current date format
		showButtonPanel: false, // True to show button panel, false to not show it
		autoSize: false, // True to size the input for the date format, false to leave as is
		disabled: false // The initial disabled state
	};
	$.extend(this._defaults, this.regional['']);
	this.dpDiv = bindHover($('<div id="' + this._mainDivId + '" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>'));
}

$.extend(Datepicker.prototype, {
	/* Class name added to elements to indicate already configured with a date picker. */
	markerClassName: 'hasDatepicker',

	//Keep track of the maximum number of rows displayed (see #7043)
	maxRows: 4,

	/* Debug logging (if enabled). */
	log: function () {
		if (this.debug)
			console.log.apply('', arguments);
	},

	// TODO rename to "widget" when switching to widget factory
	_widgetDatepicker: function() {
		return this.dpDiv;
	},

	/* Override the default settings for all instances of the date picker.
	   @param  settings  object - the new settings to use as defaults (anonymous object)
	   @return the manager object */
	setDefaults: function(settings) {
		extendRemove(this._defaults, settings || {});
		return this;
	},

	/* Attach the date picker to a jQuery selection.
	   @param  target    element - the target input field or division or span
	   @param  settings  object - the new settings to use for this date picker instance (anonymous) */
	_attachDatepicker: function(target, settings) {
		// check for settings on the control itself - in namespace 'date:'
		var inlineSettings = null;
		for (var attrName in this._defaults) {
			var attrValue = target.getAttribute('date:' + attrName);
			if (attrValue) {
				inlineSettings = inlineSettings || {};
				try {
					inlineSettings[attrName] = eval(attrValue);
				} catch (err) {
					inlineSettings[attrName] = attrValue;
				}
			}
		}
		var nodeName = target.nodeName.toLowerCase();
		var inline = (nodeName == 'div' || nodeName == 'span');
		if (!target.id) {
			this.uuid += 1;
			target.id = 'dp' + this.uuid;
		}
		var inst = this._newInst($(target), inline);
		inst.settings = $.extend({}, settings || {}, inlineSettings || {});
		if (nodeName == 'input') {
			this._connectDatepicker(target, inst);
		} else if (inline) {
			this._inlineDatepicker(target, inst);
		}
	},

	/* Create a new instance object. */
	_newInst: function(target, inline) {
		var id = target[0].id.replace(/([^A-Za-z0-9_-])/g, '\\\\$1'); // escape jQuery meta chars
		return {id: id, input: target, // associated target
			selectedDay: 0, selectedMonth: 0, selectedYear: 0, // current selection
			drawMonth: 0, drawYear: 0, // month being drawn
			inline: inline, // is datepicker inline or not
			dpDiv: (!inline ? this.dpDiv : // presentation div
			bindHover($('<div class="' + this._inlineClass + ' ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>')))};
	},

	/* Attach the date picker to an input field. */
	_connectDatepicker: function(target, inst) {
		var input = $(target);
		inst.append = $([]);
		inst.trigger = $([]);
		if (input.hasClass(this.markerClassName))
			return;
		this._attachments(input, inst);
		input.addClass(this.markerClassName).keydown(this._doKeyDown).
			keypress(this._doKeyPress).keyup(this._doKeyUp).
			bind("setData.datepicker", function(event, key, value) {
				inst.settings[key] = value;
			}).bind("getData.datepicker", function(event, key) {
				return this._get(inst, key);
			});
		this._autoSize(inst);
		$.data(target, PROP_NAME, inst);
		//If disabled option is true, disable the datepicker once it has been attached to the input (see ticket #5665)
		if( inst.settings.disabled ) {
			this._disableDatepicker( target );
		}
	},

	/* Make attachments based on settings. */
	_attachments: function(input, inst) {
		var appendText = this._get(inst, 'appendText');
		var isRTL = this._get(inst, 'isRTL');
		if (inst.append)
			inst.append.remove();
		if (appendText) {
			inst.append = $('<span class="' + this._appendClass + '">' + appendText + '</span>');
			input[isRTL ? 'before' : 'after'](inst.append);
		}
		input.unbind('focus', this._showDatepicker);
		if (inst.trigger)
			inst.trigger.remove();
		var showOn = this._get(inst, 'showOn');
		if (showOn == 'focus' || showOn == 'both') // pop-up date picker when in the marked field
			input.focus(this._showDatepicker);
		if (showOn == 'button' || showOn == 'both') { // pop-up date picker when button clicked
			var buttonText = this._get(inst, 'buttonText');
			var buttonImage = this._get(inst, 'buttonImage');
			inst.trigger = $(this._get(inst, 'buttonImageOnly') ?
				$('<img/>').addClass(this._triggerClass).
					attr({ src: buttonImage, alt: buttonText, title: buttonText }) :
				$('<button type="button"></button>').addClass(this._triggerClass).
					html(buttonImage == '' ? buttonText : $('<img/>').attr(
					{ src:buttonImage, alt:buttonText, title:buttonText })));
			input[isRTL ? 'before' : 'after'](inst.trigger);
			inst.trigger.click(function() {
				if ($.datepicker._datepickerShowing && $.datepicker._lastInput == input[0])
					$.datepicker._hideDatepicker();
				else if ($.datepicker._datepickerShowing && $.datepicker._lastInput != input[0]) {
					$.datepicker._hideDatepicker();
					$.datepicker._showDatepicker(input[0]);
				} else
					$.datepicker._showDatepicker(input[0]);
				return false;
			});
		}
	},

	/* Apply the maximum length for the date format. */
	_autoSize: function(inst) {
		if (this._get(inst, 'autoSize') && !inst.inline) {
			var date = new Date(2009, 12 - 1, 20); // Ensure double digits
			var dateFormat = this._get(inst, 'dateFormat');
			if (dateFormat.match(/[DM]/)) {
				var findMax = function(names) {
					var max = 0;
					var maxI = 0;
					for (var i = 0; i < names.length; i++) {
						if (names[i].length > max) {
							max = names[i].length;
							maxI = i;
						}
					}
					return maxI;
				};
				date.setMonth(findMax(this._get(inst, (dateFormat.match(/MM/) ?
					'monthNames' : 'monthNamesShort'))));
				date.setDate(findMax(this._get(inst, (dateFormat.match(/DD/) ?
					'dayNames' : 'dayNamesShort'))) + 20 - date.getDay());
			}
			inst.input.attr('size', this._formatDate(inst, date).length);
		}
	},

	/* Attach an inline date picker to a div. */
	_inlineDatepicker: function(target, inst) {
		var divSpan = $(target);
		if (divSpan.hasClass(this.markerClassName))
			return;
		divSpan.addClass(this.markerClassName).append(inst.dpDiv).
			bind("setData.datepicker", function(event, key, value){
				inst.settings[key] = value;
			}).bind("getData.datepicker", function(event, key){
				return this._get(inst, key);
			});
		$.data(target, PROP_NAME, inst);
		this._setDate(inst, this._getDefaultDate(inst), true);
		this._updateDatepicker(inst);
		this._updateAlternate(inst);
		//If disabled option is true, disable the datepicker before showing it (see ticket #5665)
		if( inst.settings.disabled ) {
			this._disableDatepicker( target );
		}
		// Set display:block in place of inst.dpDiv.show() which won't work on disconnected elements
		// http://bugs.jqueryui.com/ticket/7552 - A Datepicker created on a detached div has zero height
		inst.dpDiv.css( "display", "block" );
	},

	/* Pop-up the date picker in a "dialog" box.
	   @param  input     element - ignored
	   @param  date      string or Date - the initial date to display
	   @param  onSelect  function - the function to call when a date is selected
	   @param  settings  object - update the dialog date picker instance's settings (anonymous object)
	   @param  pos       int[2] - coordinates for the dialog's position within the screen or
	                     event - with x/y coordinates or
	                     leave empty for default (screen centre)
	   @return the manager object */
	_dialogDatepicker: function(input, date, onSelect, settings, pos) {
		var inst = this._dialogInst; // internal instance
		if (!inst) {
			this.uuid += 1;
			var id = 'dp' + this.uuid;
			this._dialogInput = $('<input type="text" id="' + id +
				'" style="position: absolute; top: -100px; width: 0px;"/>');
			this._dialogInput.keydown(this._doKeyDown);
			$('body').append(this._dialogInput);
			inst = this._dialogInst = this._newInst(this._dialogInput, false);
			inst.settings = {};
			$.data(this._dialogInput[0], PROP_NAME, inst);
		}
		extendRemove(inst.settings, settings || {});
		date = (date && date.constructor == Date ? this._formatDate(inst, date) : date);
		this._dialogInput.val(date);

		this._pos = (pos ? (pos.length ? pos : [pos.pageX, pos.pageY]) : null);
		if (!this._pos) {
			var browserWidth = document.documentElement.clientWidth;
			var browserHeight = document.documentElement.clientHeight;
			var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
			var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
			this._pos = // should use actual width/height below
				[(browserWidth / 2) - 100 + scrollX, (browserHeight / 2) - 150 + scrollY];
		}

		// move input on screen for focus, but hidden behind dialog
		this._dialogInput.css('left', (this._pos[0] + 20) + 'px').css('top', this._pos[1] + 'px');
		inst.settings.onSelect = onSelect;
		this._inDialog = true;
		this.dpDiv.addClass(this._dialogClass);
		this._showDatepicker(this._dialogInput[0]);
		if ($.blockUI)
			$.blockUI(this.dpDiv);
		$.data(this._dialogInput[0], PROP_NAME, inst);
		return this;
	},

	/* Detach a datepicker from its control.
	   @param  target    element - the target input field or division or span */
	_destroyDatepicker: function(target) {
		var $target = $(target);
		var inst = $.data(target, PROP_NAME);
		if (!$target.hasClass(this.markerClassName)) {
			return;
		}
		var nodeName = target.nodeName.toLowerCase();
		$.removeData(target, PROP_NAME);
		if (nodeName == 'input') {
			inst.append.remove();
			inst.trigger.remove();
			$target.removeClass(this.markerClassName).
				unbind('focus', this._showDatepicker).
				unbind('keydown', this._doKeyDown).
				unbind('keypress', this._doKeyPress).
				unbind('keyup', this._doKeyUp);
		} else if (nodeName == 'div' || nodeName == 'span')
			$target.removeClass(this.markerClassName).empty();
	},

	/* Enable the date picker to a jQuery selection.
	   @param  target    element - the target input field or division or span */
	_enableDatepicker: function(target) {
		var $target = $(target);
		var inst = $.data(target, PROP_NAME);
		if (!$target.hasClass(this.markerClassName)) {
			return;
		}
		var nodeName = target.nodeName.toLowerCase();
		if (nodeName == 'input') {
			target.disabled = false;
			inst.trigger.filter('button').
				each(function() { this.disabled = false; }).end().
				filter('img').css({opacity: '1.0', cursor: ''});
		}
		else if (nodeName == 'div' || nodeName == 'span') {
			var inline = $target.children('.' + this._inlineClass);
			inline.children().removeClass('ui-state-disabled');
			inline.find("select.ui-datepicker-month, select.ui-datepicker-year").
				prop("disabled", false);
		}
		this._disabledInputs = $.map(this._disabledInputs,
			function(value) { return (value == target ? null : value); }); // delete entry
	},

	/* Disable the date picker to a jQuery selection.
	   @param  target    element - the target input field or division or span */
	_disableDatepicker: function(target) {
		var $target = $(target);
		var inst = $.data(target, PROP_NAME);
		if (!$target.hasClass(this.markerClassName)) {
			return;
		}
		var nodeName = target.nodeName.toLowerCase();
		if (nodeName == 'input') {
			target.disabled = true;
			inst.trigger.filter('button').
				each(function() { this.disabled = true; }).end().
				filter('img').css({opacity: '0.5', cursor: 'default'});
		}
		else if (nodeName == 'div' || nodeName == 'span') {
			var inline = $target.children('.' + this._inlineClass);
			inline.children().addClass('ui-state-disabled');
			inline.find("select.ui-datepicker-month, select.ui-datepicker-year").
				prop("disabled", true);
		}
		this._disabledInputs = $.map(this._disabledInputs,
			function(value) { return (value == target ? null : value); }); // delete entry
		this._disabledInputs[this._disabledInputs.length] = target;
	},

	/* Is the first field in a jQuery collection disabled as a datepicker?
	   @param  target    element - the target input field or division or span
	   @return boolean - true if disabled, false if enabled */
	_isDisabledDatepicker: function(target) {
		if (!target) {
			return false;
		}
		for (var i = 0; i < this._disabledInputs.length; i++) {
			if (this._disabledInputs[i] == target)
				return true;
		}
		return false;
	},

	/* Retrieve the instance data for the target control.
	   @param  target  element - the target input field or division or span
	   @return  object - the associated instance data
	   @throws  error if a jQuery problem getting data */
	_getInst: function(target) {
		try {
			return $.data(target, PROP_NAME);
		}
		catch (err) {
			throw 'Missing instance data for this datepicker';
		}
	},

	/* Update or retrieve the settings for a date picker attached to an input field or division.
	   @param  target  element - the target input field or division or span
	   @param  name    object - the new settings to update or
	                   string - the name of the setting to change or retrieve,
	                   when retrieving also 'all' for all instance settings or
	                   'defaults' for all global defaults
	   @param  value   any - the new value for the setting
	                   (omit if above is an object or to retrieve a value) */
	_optionDatepicker: function(target, name, value) {
		var inst = this._getInst(target);
		if (arguments.length == 2 && typeof name == 'string') {
			return (name == 'defaults' ? $.extend({}, $.datepicker._defaults) :
				(inst ? (name == 'all' ? $.extend({}, inst.settings) :
				this._get(inst, name)) : null));
		}
		var settings = name || {};
		if (typeof name == 'string') {
			settings = {};
			settings[name] = value;
		}
		if (inst) {
			if (this._curInst == inst) {
				this._hideDatepicker();
			}
			var date = this._getDateDatepicker(target, true);
			var minDate = this._getMinMaxDate(inst, 'min');
			var maxDate = this._getMinMaxDate(inst, 'max');
			extendRemove(inst.settings, settings);
			// reformat the old minDate/maxDate values if dateFormat changes and a new minDate/maxDate isn't provided
			if (minDate !== null && settings['dateFormat'] !== undefined && settings['minDate'] === undefined)
				inst.settings.minDate = this._formatDate(inst, minDate);
			if (maxDate !== null && settings['dateFormat'] !== undefined && settings['maxDate'] === undefined)
				inst.settings.maxDate = this._formatDate(inst, maxDate);
			this._attachments($(target), inst);
			this._autoSize(inst);
			this._setDate(inst, date);
			this._updateAlternate(inst);
			this._updateDatepicker(inst);
		}
	},

	// change method deprecated
	_changeDatepicker: function(target, name, value) {
		this._optionDatepicker(target, name, value);
	},

	/* Redraw the date picker attached to an input field or division.
	   @param  target  element - the target input field or division or span */
	_refreshDatepicker: function(target) {
		var inst = this._getInst(target);
		if (inst) {
			this._updateDatepicker(inst);
		}
	},

	/* Set the dates for a jQuery selection.
	   @param  target   element - the target input field or division or span
	   @param  date     Date - the new date */
	_setDateDatepicker: function(target, date) {
		var inst = this._getInst(target);
		if (inst) {
			this._setDate(inst, date);
			this._updateDatepicker(inst);
			this._updateAlternate(inst);
		}
	},

	/* Get the date(s) for the first entry in a jQuery selection.
	   @param  target     element - the target input field or division or span
	   @param  noDefault  boolean - true if no default date is to be used
	   @return Date - the current date */
	_getDateDatepicker: function(target, noDefault) {
		var inst = this._getInst(target);
		if (inst && !inst.inline)
			this._setDateFromField(inst, noDefault);
		return (inst ? this._getDate(inst) : null);
	},

	/* Handle keystrokes. */
	_doKeyDown: function(event) {
		var inst = $.datepicker._getInst(event.target);
		var handled = true;
		var isRTL = inst.dpDiv.is('.ui-datepicker-rtl');
		inst._keyEvent = true;
		if ($.datepicker._datepickerShowing)
			switch (event.keyCode) {
				case 9: $.datepicker._hideDatepicker();
						handled = false;
						break; // hide on tab out
				case 13: var sel = $('td.' + $.datepicker._dayOverClass + ':not(.' +
									$.datepicker._currentClass + ')', inst.dpDiv);
						if (sel[0])
							$.datepicker._selectDay(event.target, inst.selectedMonth, inst.selectedYear, sel[0]);
							var onSelect = $.datepicker._get(inst, 'onSelect');
							if (onSelect) {
								var dateStr = $.datepicker._formatDate(inst);

								// trigger custom callback
								onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);
							}
						else
							$.datepicker._hideDatepicker();
						return false; // don't submit the form
						break; // select the value on enter
				case 27: $.datepicker._hideDatepicker();
						break; // hide on escape
				case 33: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
							-$.datepicker._get(inst, 'stepBigMonths') :
							-$.datepicker._get(inst, 'stepMonths')), 'M');
						break; // previous month/year on page up/+ ctrl
				case 34: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
							+$.datepicker._get(inst, 'stepBigMonths') :
							+$.datepicker._get(inst, 'stepMonths')), 'M');
						break; // next month/year on page down/+ ctrl
				case 35: if (event.ctrlKey || event.metaKey) $.datepicker._clearDate(event.target);
						handled = event.ctrlKey || event.metaKey;
						break; // clear on ctrl or command +end
				case 36: if (event.ctrlKey || event.metaKey) $.datepicker._gotoToday(event.target);
						handled = event.ctrlKey || event.metaKey;
						break; // current on ctrl or command +home
				case 37: if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, (isRTL ? +1 : -1), 'D');
						handled = event.ctrlKey || event.metaKey;
						// -1 day on ctrl or command +left
						if (event.originalEvent.altKey) $.datepicker._adjustDate(event.target, (event.ctrlKey ?
									-$.datepicker._get(inst, 'stepBigMonths') :
									-$.datepicker._get(inst, 'stepMonths')), 'M');
						// next month/year on alt +left on Mac
						break;
				case 38: if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, -7, 'D');
						handled = event.ctrlKey || event.metaKey;
						break; // -1 week on ctrl or command +up
				case 39: if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, (isRTL ? -1 : +1), 'D');
						handled = event.ctrlKey || event.metaKey;
						// +1 day on ctrl or command +right
						if (event.originalEvent.altKey) $.datepicker._adjustDate(event.target, (event.ctrlKey ?
									+$.datepicker._get(inst, 'stepBigMonths') :
									+$.datepicker._get(inst, 'stepMonths')), 'M');
						// next month/year on alt +right
						break;
				case 40: if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, +7, 'D');
						handled = event.ctrlKey || event.metaKey;
						break; // +1 week on ctrl or command +down
				default: handled = false;
			}
		else if (event.keyCode == 36 && event.ctrlKey) // display the date picker on ctrl+home
			$.datepicker._showDatepicker(this);
		else {
			handled = false;
		}
		if (handled) {
			event.preventDefault();
			event.stopPropagation();
		}
	},

	/* Filter entered characters - based on date format. */
	_doKeyPress: function(event) {
		var inst = $.datepicker._getInst(event.target);
		if ($.datepicker._get(inst, 'constrainInput')) {
			var chars = $.datepicker._possibleChars($.datepicker._get(inst, 'dateFormat'));
			var chr = String.fromCharCode(event.charCode == undefined ? event.keyCode : event.charCode);
			return event.ctrlKey || event.metaKey || (chr < ' ' || !chars || chars.indexOf(chr) > -1);
		}
	},

	/* Synchronise manual entry and field/alternate field. */
	_doKeyUp: function(event) {
		var inst = $.datepicker._getInst(event.target);
		if (inst.input.val() != inst.lastVal) {
			try {
				var date = $.datepicker.parseDate($.datepicker._get(inst, 'dateFormat'),
					(inst.input ? inst.input.val() : null),
					$.datepicker._getFormatConfig(inst));
				if (date) { // only if valid
					$.datepicker._setDateFromField(inst);
					$.datepicker._updateAlternate(inst);
					$.datepicker._updateDatepicker(inst);
				}
			}
			catch (err) {
				$.datepicker.log(err);
			}
		}
		return true;
	},

	/* Pop-up the date picker for a given input field.
	   If false returned from beforeShow event handler do not show.
	   @param  input  element - the input field attached to the date picker or
	                  event - if triggered by focus */
	_showDatepicker: function(input) {
		input = input.target || input;
		if (input.nodeName.toLowerCase() != 'input') // find from button/image trigger
			input = $('input', input.parentNode)[0];
		if ($.datepicker._isDisabledDatepicker(input) || $.datepicker._lastInput == input) // already here
			return;
		var inst = $.datepicker._getInst(input);
		if ($.datepicker._curInst && $.datepicker._curInst != inst) {
			$.datepicker._curInst.dpDiv.stop(true, true);
			if ( inst && $.datepicker._datepickerShowing ) {
				$.datepicker._hideDatepicker( $.datepicker._curInst.input[0] );
			}
		}
		var beforeShow = $.datepicker._get(inst, 'beforeShow');
		var beforeShowSettings = beforeShow ? beforeShow.apply(input, [input, inst]) : {};
		if(beforeShowSettings === false){
			//false
			return;
		}
		extendRemove(inst.settings, beforeShowSettings);
		inst.lastVal = null;
		$.datepicker._lastInput = input;
		$.datepicker._setDateFromField(inst);
		if ($.datepicker._inDialog) // hide cursor
			input.value = '';
		if (!$.datepicker._pos) { // position below input
			$.datepicker._pos = $.datepicker._findPos(input);
			$.datepicker._pos[1] += input.offsetHeight; // add the height
		}
		var isFixed = false;
		$(input).parents().each(function() {
			isFixed |= $(this).css('position') == 'fixed';
			return !isFixed;
		});
		var offset = {left: $.datepicker._pos[0], top: $.datepicker._pos[1]};
		$.datepicker._pos = null;
		//to avoid flashes on Firefox
		inst.dpDiv.empty();
		// determine sizing offscreen
		inst.dpDiv.css({position: 'absolute', display: 'block', top: '-1000px'});
		$.datepicker._updateDatepicker(inst);
		// fix width for dynamic number of date pickers
		// and adjust position before showing
		offset = $.datepicker._checkOffset(inst, offset, isFixed);
		inst.dpDiv.css({position: ($.datepicker._inDialog && $.blockUI ?
			'static' : (isFixed ? 'fixed' : 'absolute')), display: 'none',
			left: offset.left + 'px', top: offset.top + 'px'});
		if (!inst.inline) {
			var showAnim = $.datepicker._get(inst, 'showAnim');
			var duration = $.datepicker._get(inst, 'duration');
			var postProcess = function() {
				var cover = inst.dpDiv.find('iframe.ui-datepicker-cover'); // IE6- only
				if( !! cover.length ){
					var borders = $.datepicker._getBorders(inst.dpDiv);
					cover.css({left: -borders[0], top: -borders[1],
						width: inst.dpDiv.outerWidth(), height: inst.dpDiv.outerHeight()});
				}
			};
			inst.dpDiv.zIndex($(input).zIndex()+1);
			$.datepicker._datepickerShowing = true;

			// DEPRECATED: after BC for 1.8.x $.effects[ showAnim ] is not needed
			if ( $.effects && ( $.effects.effect[ showAnim ] || $.effects[ showAnim ] ) )
				inst.dpDiv.show(showAnim, $.datepicker._get(inst, 'showOptions'), duration, postProcess);
			else
				inst.dpDiv[showAnim || 'show']((showAnim ? duration : null), postProcess);
			if (!showAnim || !duration)
				postProcess();
			if (inst.input.is(':visible') && !inst.input.is(':disabled'))
				inst.input.focus();
			$.datepicker._curInst = inst;
		}
	},

	/* Generate the date picker content. */
	_updateDatepicker: function(inst) {
		this.maxRows = 4; //Reset the max number of rows being displayed (see #7043)
		var borders = $.datepicker._getBorders(inst.dpDiv);
		instActive = inst; // for delegate hover events
		inst.dpDiv.empty().append(this._generateHTML(inst));
		this._attachHandlers(inst);
		var cover = inst.dpDiv.find('iframe.ui-datepicker-cover'); // IE6- only
		if( !!cover.length ){ //avoid call to outerXXXX() when not in IE6
			cover.css({left: -borders[0], top: -borders[1], width: inst.dpDiv.outerWidth(), height: inst.dpDiv.outerHeight()})
		}
		inst.dpDiv.find('.' + this._dayOverClass + ' a').mouseover();
		var numMonths = this._getNumberOfMonths(inst);
		var cols = numMonths[1];
		var width = 17;
		inst.dpDiv.removeClass('ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4').width('');
		if (cols > 1)
			inst.dpDiv.addClass('ui-datepicker-multi-' + cols).css('width', (width * cols) + 'em');
		inst.dpDiv[(numMonths[0] != 1 || numMonths[1] != 1 ? 'add' : 'remove') +
			'Class']('ui-datepicker-multi');
		inst.dpDiv[(this._get(inst, 'isRTL') ? 'add' : 'remove') +
			'Class']('ui-datepicker-rtl');
		if (inst == $.datepicker._curInst && $.datepicker._datepickerShowing && inst.input &&
				// #6694 - don't focus the input if it's already focused
				// this breaks the change event in IE
				inst.input.is(':visible') && !inst.input.is(':disabled') && inst.input[0] != document.activeElement)
			inst.input.focus();
		// deffered render of the years select (to avoid flashes on Firefox)
		if( inst.yearshtml ){
			var origyearshtml = inst.yearshtml;
			setTimeout(function(){
				//assure that inst.yearshtml didn't change.
				if( origyearshtml === inst.yearshtml && inst.yearshtml ){
					inst.dpDiv.find('select.ui-datepicker-year:first').replaceWith(inst.yearshtml);
				}
				origyearshtml = inst.yearshtml = null;
			}, 0);
		}
	},

	/* Retrieve the size of left and top borders for an element.
	   @param  elem  (jQuery object) the element of interest
	   @return  (number[2]) the left and top borders */
	_getBorders: function(elem) {
		var convert = function(value) {
			return {thin: 1, medium: 2, thick: 3}[value] || value;
		};
		return [parseFloat(convert(elem.css('border-left-width'))),
			parseFloat(convert(elem.css('border-top-width')))];
	},

	/* Check positioning to remain on screen. */
	_checkOffset: function(inst, offset, isFixed) {
		var dpWidth = inst.dpDiv.outerWidth();
		var dpHeight = inst.dpDiv.outerHeight();
		var inputWidth = inst.input ? inst.input.outerWidth() : 0;
		var inputHeight = inst.input ? inst.input.outerHeight() : 0;
		var viewWidth = document.documentElement.clientWidth + (isFixed ? 0 : $(document).scrollLeft());
		var viewHeight = document.documentElement.clientHeight + (isFixed ? 0 : $(document).scrollTop());

		offset.left -= (this._get(inst, 'isRTL') ? (dpWidth - inputWidth) : 0);
		offset.left -= (isFixed && offset.left == inst.input.offset().left) ? $(document).scrollLeft() : 0;
		offset.top -= (isFixed && offset.top == (inst.input.offset().top + inputHeight)) ? $(document).scrollTop() : 0;

		// now check if datepicker is showing outside window viewport - move to a better place if so.
		offset.left -= Math.min(offset.left, (offset.left + dpWidth > viewWidth && viewWidth > dpWidth) ?
			Math.abs(offset.left + dpWidth - viewWidth) : 0);
		offset.top -= Math.min(offset.top, (offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ?
			Math.abs(dpHeight + inputHeight) : 0);

		return offset;
	},

	/* Find an object's position on the screen. */
	_findPos: function(obj) {
		var inst = this._getInst(obj);
		var isRTL = this._get(inst, 'isRTL');
		while (obj && (obj.type == 'hidden' || obj.nodeType != 1 || $.expr.filters.hidden(obj))) {
			obj = obj[isRTL ? 'previousSibling' : 'nextSibling'];
		}
		var position = $(obj).offset();
		return [position.left, position.top];
	},

	/* Hide the date picker from view.
	   @param  input  element - the input field attached to the date picker */
	_hideDatepicker: function(input) {
		var inst = this._curInst;
		if (!inst || (input && inst != $.data(input, PROP_NAME)))
			return;
		if (this._datepickerShowing) {
			var showAnim = this._get(inst, 'showAnim');
			var duration = this._get(inst, 'duration');
			var postProcess = function() {
				$.datepicker._tidyDialog(inst);
			};

			// DEPRECATED: after BC for 1.8.x $.effects[ showAnim ] is not needed
			if ( $.effects && ( $.effects.effect[ showAnim ] || $.effects[ showAnim ] ) )
				inst.dpDiv.hide(showAnim, $.datepicker._get(inst, 'showOptions'), duration, postProcess);
			else
				inst.dpDiv[(showAnim == 'slideDown' ? 'slideUp' :
					(showAnim == 'fadeIn' ? 'fadeOut' : 'hide'))]((showAnim ? duration : null), postProcess);
			if (!showAnim)
				postProcess();
			this._datepickerShowing = false;
			var onClose = this._get(inst, 'onClose');
			if (onClose)
				onClose.apply((inst.input ? inst.input[0] : null),
					[(inst.input ? inst.input.val() : ''), inst]);
			this._lastInput = null;
			if (this._inDialog) {
				this._dialogInput.css({ position: 'absolute', left: '0', top: '-100px' });
				if ($.blockUI) {
					$.unblockUI();
					$('body').append(this.dpDiv);
				}
			}
			this._inDialog = false;
		}
	},

	/* Tidy up after a dialog display. */
	_tidyDialog: function(inst) {
		inst.dpDiv.removeClass(this._dialogClass).unbind('.ui-datepicker-calendar');
	},

	/* Close date picker if clicked elsewhere. */
	_checkExternalClick: function(event) {
		if (!$.datepicker._curInst)
			return;

		var $target = $(event.target),
			inst = $.datepicker._getInst($target[0]);

		if ( ( ( $target[0].id != $.datepicker._mainDivId &&
				$target.parents('#' + $.datepicker._mainDivId).length == 0 &&
				!$target.hasClass($.datepicker.markerClassName) &&
				!$target.closest("." + $.datepicker._triggerClass).length &&
				$.datepicker._datepickerShowing && !($.datepicker._inDialog && $.blockUI) ) ) ||
			( $target.hasClass($.datepicker.markerClassName) && $.datepicker._curInst != inst ) )
			$.datepicker._hideDatepicker();
	},

	/* Adjust one of the date sub-fields. */
	_adjustDate: function(id, offset, period) {
		var target = $(id);
		var inst = this._getInst(target[0]);
		if (this._isDisabledDatepicker(target[0])) {
			return;
		}
		this._adjustInstDate(inst, offset +
			(period == 'M' ? this._get(inst, 'showCurrentAtPos') : 0), // undo positioning
			period);
		this._updateDatepicker(inst);
	},

	/* Action for current link. */
	_gotoToday: function(id) {
		var target = $(id);
		var inst = this._getInst(target[0]);
		if (this._get(inst, 'gotoCurrent') && inst.currentDay) {
			inst.selectedDay = inst.currentDay;
			inst.drawMonth = inst.selectedMonth = inst.currentMonth;
			inst.drawYear = inst.selectedYear = inst.currentYear;
		}
		else {
			var date = new Date();
			inst.selectedDay = date.getDate();
			inst.drawMonth = inst.selectedMonth = date.getMonth();
			inst.drawYear = inst.selectedYear = date.getFullYear();
		}
		this._notifyChange(inst);
		this._adjustDate(target);
	},

	/* Action for selecting a new month/year. */
	_selectMonthYear: function(id, select, period) {
		var target = $(id);
		var inst = this._getInst(target[0]);
		inst['selected' + (period == 'M' ? 'Month' : 'Year')] =
		inst['draw' + (period == 'M' ? 'Month' : 'Year')] =
			parseInt(select.options[select.selectedIndex].value,10);
		this._notifyChange(inst);
		this._adjustDate(target);
	},

	/* Action for selecting a day. */
	_selectDay: function(id, month, year, td) {
		var target = $(id);
		if ($(td).hasClass(this._unselectableClass) || this._isDisabledDatepicker(target[0])) {
			return;
		}
		var inst = this._getInst(target[0]);
		inst.selectedDay = inst.currentDay = $('a', td).html();
		inst.selectedMonth = inst.currentMonth = month;
		inst.selectedYear = inst.currentYear = year;
		this._selectDate(id, this._formatDate(inst,
			inst.currentDay, inst.currentMonth, inst.currentYear));
	},

	/* Erase the input field and hide the date picker. */
	_clearDate: function(id) {
		var target = $(id);
		var inst = this._getInst(target[0]);
		this._selectDate(target, '');
	},

	/* Update the input field with the selected date. */
	_selectDate: function(id, dateStr) {
		var target = $(id);
		var inst = this._getInst(target[0]);
		dateStr = (dateStr != null ? dateStr : this._formatDate(inst));
		if (inst.input)
			inst.input.val(dateStr);
		this._updateAlternate(inst);
		var onSelect = this._get(inst, 'onSelect');
		if (onSelect)
			onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);  // trigger custom callback
		else if (inst.input)
			inst.input.trigger('change'); // fire the change event
		if (inst.inline)
			this._updateDatepicker(inst);
		else {
			this._hideDatepicker();
			this._lastInput = inst.input[0];
			if (typeof(inst.input[0]) != 'object')
				inst.input.focus(); // restore focus
			this._lastInput = null;
		}
	},

	/* Update any alternate field to synchronise with the main field. */
	_updateAlternate: function(inst) {
		var altField = this._get(inst, 'altField');
		if (altField) { // update alternate field too
			var altFormat = this._get(inst, 'altFormat') || this._get(inst, 'dateFormat');
			var date = this._getDate(inst);
			var dateStr = this.formatDate(altFormat, date, this._getFormatConfig(inst));
			$(altField).each(function() { $(this).val(dateStr); });
		}
	},

	/* Set as beforeShowDay function to prevent selection of weekends.
	   @param  date  Date - the date to customise
	   @return [boolean, string] - is this date selectable?, what is its CSS class? */
	noWeekends: function(date) {
		var day = date.getDay();
		return [(day > 0 && day < 6), ''];
	},

	/* Set as calculateWeek to determine the week of the year based on the ISO 8601 definition.
	   @param  date  Date - the date to get the week for
	   @return  number - the number of the week within the year that contains this date */
	iso8601Week: function(date) {
		var checkDate = new Date(date.getTime());
		// Find Thursday of this week starting on Monday
		checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
		var time = checkDate.getTime();
		checkDate.setMonth(0); // Compare with Jan 1
		checkDate.setDate(1);
		return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
	},

	/* Parse a string value into a date object.
	   See formatDate below for the possible formats.

	   @param  format    string - the expected format of the date
	   @param  value     string - the date in the above format
	   @param  settings  Object - attributes include:
	                     shortYearCutoff  number - the cutoff year for determining the century (optional)
	                     dayNamesShort    string[7] - abbreviated names of the days from Sunday (optional)
	                     dayNames         string[7] - names of the days from Sunday (optional)
	                     monthNamesShort  string[12] - abbreviated names of the months (optional)
	                     monthNames       string[12] - names of the months (optional)
	   @return  Date - the extracted date value or null if value is blank */
	parseDate: function (format, value, settings) {
		if (format == null || value == null)
			throw 'Invalid arguments';
		value = (typeof value == 'object' ? value.toString() : value + '');
		if (value == '')
			return null;
		var shortYearCutoff = (settings ? settings.shortYearCutoff : null) || this._defaults.shortYearCutoff;
		shortYearCutoff = (typeof shortYearCutoff != 'string' ? shortYearCutoff :
				new Date().getFullYear() % 100 + parseInt(shortYearCutoff, 10));
		var dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort;
		var dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames;
		var monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort;
		var monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames;
		var year = -1;
		var month = -1;
		var day = -1;
		var doy = -1;
		var literal = false;
		// Check whether a format character is doubled
		var lookAhead = function(match) {
			var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
			if (matches)
				iFormat++;
			return matches;
		};
		// Extract a number from the string value
		var getNumber = function(match) {
			var isDoubled = lookAhead(match);
			var size = (match == '@' ? 14 : (match == '!' ? 20 :
				(match == 'y' && isDoubled ? 4 : (match == 'o' ? 3 : 2))));
			var digits = new RegExp('^\\d{1,' + size + '}');
			var num = value.substring(iValue).match(digits);
			if (!num)
				throw 'Missing number at position ' + iValue;
			iValue += num[0].length;
			return parseInt(num[0], 10);
		};
		// Extract a name from the string value and convert to an index
		var getName = function(match, shortNames, longNames) {
			var names = $.map(lookAhead(match) ? longNames : shortNames, function (v, k) {
				return [ [k, v] ];
			}).sort(function (a, b) {
				return -(a[1].length - b[1].length);
			});
			var index = -1;
			$.each(names, function (i, pair) {
				var name = pair[1];
				if (value.substr(iValue, name.length).toLowerCase() == name.toLowerCase()) {
					index = pair[0];
					iValue += name.length;
					return false;
				}
			});
			if (index != -1)
				return index + 1;
			else
				throw 'Unknown name at position ' + iValue;
		};
		// Confirm that a literal character matches the string value
		var checkLiteral = function() {
			if (value.charAt(iValue) != format.charAt(iFormat))
				throw 'Unexpected literal at position ' + iValue;
			iValue++;
		};
		var iValue = 0;
		for (var iFormat = 0; iFormat < format.length; iFormat++) {
			if (literal)
				if (format.charAt(iFormat) == "'" && !lookAhead("'"))
					literal = false;
				else
					checkLiteral();
			else
				switch (format.charAt(iFormat)) {
					case 'd':
						day = getNumber('d');
						break;
					case 'D':
						getName('D', dayNamesShort, dayNames);
						break;
					case 'o':
						doy = getNumber('o');
						break;
					case 'm':
						month = getNumber('m');
						break;
					case 'M':
						month = getName('M', monthNamesShort, monthNames);
						break;
					case 'y':
						year = getNumber('y');
						break;
					case '@':
						var date = new Date(getNumber('@'));
						year = date.getFullYear();
						month = date.getMonth() + 1;
						day = date.getDate();
						break;
					case '!':
						var date = new Date((getNumber('!') - this._ticksTo1970) / 10000);
						year = date.getFullYear();
						month = date.getMonth() + 1;
						day = date.getDate();
						break;
					case "'":
						if (lookAhead("'"))
							checkLiteral();
						else
							literal = true;
						break;
					default:
						checkLiteral();
				}
		}
		if (iValue < value.length){
			var extra = value.substr(iValue);
			if (!/^\s+/.test(extra)) {
				throw "Extra/unparsed characters found in date: " + extra;
			}
		}
		if (year == -1)
			year = new Date().getFullYear();
		else if (year < 100)
			year += new Date().getFullYear() - new Date().getFullYear() % 100 +
				(year <= shortYearCutoff ? 0 : -100);
		if (doy > -1) {
			month = 1;
			day = doy;
			do {
				var dim = this._getDaysInMonth(year, month - 1);
				if (day <= dim)
					break;
				month++;
				day -= dim;
			} while (true);
		}
		var date = this._daylightSavingAdjust(new Date(year, month - 1, day));
		if (date.getFullYear() != year || date.getMonth() + 1 != month || date.getDate() != day)
			throw 'Invalid date'; // E.g. 31/02/00
		return date;
	},

	/* Standard date formats. */
	ATOM: 'yy-mm-dd', // RFC 3339 (ISO 8601)
	COOKIE: 'D, dd M yy',
	ISO_8601: 'yy-mm-dd',
	RFC_822: 'D, d M y',
	RFC_850: 'DD, dd-M-y',
	RFC_1036: 'D, d M y',
	RFC_1123: 'D, d M yy',
	RFC_2822: 'D, d M yy',
	RSS: 'D, d M y', // RFC 822
	TICKS: '!',
	TIMESTAMP: '@',
	W3C: 'yy-mm-dd', // ISO 8601

	_ticksTo1970: (((1970 - 1) * 365 + Math.floor(1970 / 4) - Math.floor(1970 / 100) +
		Math.floor(1970 / 400)) * 24 * 60 * 60 * 10000000),

	/* Format a date object into a string value.
	   The format can be combinations of the following:
	   d  - day of month (no leading zero)
	   dd - day of month (two digit)
	   o  - day of year (no leading zeros)
	   oo - day of year (three digit)
	   D  - day name short
	   DD - day name long
	   m  - month of year (no leading zero)
	   mm - month of year (two digit)
	   M  - month name short
	   MM - month name long
	   y  - year (two digit)
	   yy - year (four digit)
	   @ - Unix timestamp (ms since 01/01/1970)
	   ! - Windows ticks (100ns since 01/01/0001)
	   '...' - literal text
	   '' - single quote

	   @param  format    string - the desired format of the date
	   @param  date      Date - the date value to format
	   @param  settings  Object - attributes include:
	                     dayNamesShort    string[7] - abbreviated names of the days from Sunday (optional)
	                     dayNames         string[7] - names of the days from Sunday (optional)
	                     monthNamesShort  string[12] - abbreviated names of the months (optional)
	                     monthNames       string[12] - names of the months (optional)
	   @return  string - the date in the above format */
	formatDate: function (format, date, settings) {
		if (!date)
			return '';
		var dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort;
		var dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames;
		var monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort;
		var monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames;
		// Check whether a format character is doubled
		var lookAhead = function(match) {
			var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
			if (matches)
				iFormat++;
			return matches;
		};
		// Format a number, with leading zero if necessary
		var formatNumber = function(match, value, len) {
			var num = '' + value;
			if (lookAhead(match))
				while (num.length < len)
					num = '0' + num;
			return num;
		};
		// Format a name, short or long as requested
		var formatName = function(match, value, shortNames, longNames) {
			return (lookAhead(match) ? longNames[value] : shortNames[value]);
		};
		var output = '';
		var literal = false;
		if (date)
			for (var iFormat = 0; iFormat < format.length; iFormat++) {
				if (literal)
					if (format.charAt(iFormat) == "'" && !lookAhead("'"))
						literal = false;
					else
						output += format.charAt(iFormat);
				else
					switch (format.charAt(iFormat)) {
						case 'd':
							output += formatNumber('d', date.getDate(), 2);
							break;
						case 'D':
							output += formatName('D', date.getDay(), dayNamesShort, dayNames);
							break;
						case 'o':
							output += formatNumber('o',
								Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000), 3);
							break;
						case 'm':
							output += formatNumber('m', date.getMonth() + 1, 2);
							break;
						case 'M':
							output += formatName('M', date.getMonth(), monthNamesShort, monthNames);
							break;
						case 'y':
							output += (lookAhead('y') ? date.getFullYear() :
								(date.getYear() % 100 < 10 ? '0' : '') + date.getYear() % 100);
							break;
						case '@':
							output += date.getTime();
							break;
						case '!':
							output += date.getTime() * 10000 + this._ticksTo1970;
							break;
						case "'":
							if (lookAhead("'"))
								output += "'";
							else
								literal = true;
							break;
						default:
							output += format.charAt(iFormat);
					}
			}
		return output;
	},

	/* Extract all possible characters from the date format. */
	_possibleChars: function (format) {
		var chars = '';
		var literal = false;
		// Check whether a format character is doubled
		var lookAhead = function(match) {
			var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
			if (matches)
				iFormat++;
			return matches;
		};
		for (var iFormat = 0; iFormat < format.length; iFormat++)
			if (literal)
				if (format.charAt(iFormat) == "'" && !lookAhead("'"))
					literal = false;
				else
					chars += format.charAt(iFormat);
			else
				switch (format.charAt(iFormat)) {
					case 'd': case 'm': case 'y': case '@':
						chars += '0123456789';
						break;
					case 'D': case 'M':
						return null; // Accept anything
					case "'":
						if (lookAhead("'"))
							chars += "'";
						else
							literal = true;
						break;
					default:
						chars += format.charAt(iFormat);
				}
		return chars;
	},

	/* Get a setting value, defaulting if necessary. */
	_get: function(inst, name) {
		return inst.settings[name] !== undefined ?
			inst.settings[name] : this._defaults[name];
	},

	/* Parse existing date and initialise date picker. */
	_setDateFromField: function(inst, noDefault) {
		if (inst.input.val() == inst.lastVal) {
			return;
		}
		var dateFormat = this._get(inst, 'dateFormat');
		var dates = inst.lastVal = inst.input ? inst.input.val() : null;
		var date, defaultDate;
		date = defaultDate = this._getDefaultDate(inst);
		var settings = this._getFormatConfig(inst);
		try {
			date = this.parseDate(dateFormat, dates, settings) || defaultDate;
		} catch (event) {
			this.log(event);
			dates = (noDefault ? '' : dates);
		}
		inst.selectedDay = date.getDate();
		inst.drawMonth = inst.selectedMonth = date.getMonth();
		inst.drawYear = inst.selectedYear = date.getFullYear();
		inst.currentDay = (dates ? date.getDate() : 0);
		inst.currentMonth = (dates ? date.getMonth() : 0);
		inst.currentYear = (dates ? date.getFullYear() : 0);
		this._adjustInstDate(inst);
	},

	/* Retrieve the default date shown on opening. */
	_getDefaultDate: function(inst) {
		return this._restrictMinMax(inst,
			this._determineDate(inst, this._get(inst, 'defaultDate'), new Date()));
	},

	/* A date may be specified as an exact value or a relative one. */
	_determineDate: function(inst, date, defaultDate) {
		var offsetNumeric = function(offset) {
			var date = new Date();
			date.setDate(date.getDate() + offset);
			return date;
		};
		var offsetString = function(offset) {
			try {
				return $.datepicker.parseDate($.datepicker._get(inst, 'dateFormat'),
					offset, $.datepicker._getFormatConfig(inst));
			}
			catch (e) {
				// Ignore
			}
			var date = (offset.toLowerCase().match(/^c/) ?
				$.datepicker._getDate(inst) : null) || new Date();
			var year = date.getFullYear();
			var month = date.getMonth();
			var day = date.getDate();
			var pattern = /([+-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g;
			var matches = pattern.exec(offset);
			while (matches) {
				switch (matches[2] || 'd') {
					case 'd' : case 'D' :
						day += parseInt(matches[1],10); break;
					case 'w' : case 'W' :
						day += parseInt(matches[1],10) * 7; break;
					case 'm' : case 'M' :
						month += parseInt(matches[1],10);
						day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
						break;
					case 'y': case 'Y' :
						year += parseInt(matches[1],10);
						day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
						break;
				}
				matches = pattern.exec(offset);
			}
			return new Date(year, month, day);
		};
		var newDate = (date == null || date === '' ? defaultDate : (typeof date == 'string' ? offsetString(date) :
			(typeof date == 'number' ? (isNaN(date) ? defaultDate : offsetNumeric(date)) : new Date(date.getTime()))));
		newDate = (newDate && newDate.toString() == 'Invalid Date' ? defaultDate : newDate);
		if (newDate) {
			newDate.setHours(0);
			newDate.setMinutes(0);
			newDate.setSeconds(0);
			newDate.setMilliseconds(0);
		}
		return this._daylightSavingAdjust(newDate);
	},

	/* Handle switch to/from daylight saving.
	   Hours may be non-zero on daylight saving cut-over:
	   > 12 when midnight changeover, but then cannot generate
	   midnight datetime, so jump to 1AM, otherwise reset.
	   @param  date  (Date) the date to check
	   @return  (Date) the corrected date */
	_daylightSavingAdjust: function(date) {
		if (!date) return null;
		date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
		return date;
	},

	/* Set the date(s) directly. */
	_setDate: function(inst, date, noChange) {
		var clear = !date;
		var origMonth = inst.selectedMonth;
		var origYear = inst.selectedYear;
		var newDate = this._restrictMinMax(inst, this._determineDate(inst, date, new Date()));
		inst.selectedDay = inst.currentDay = newDate.getDate();
		inst.drawMonth = inst.selectedMonth = inst.currentMonth = newDate.getMonth();
		inst.drawYear = inst.selectedYear = inst.currentYear = newDate.getFullYear();
		if ((origMonth != inst.selectedMonth || origYear != inst.selectedYear) && !noChange)
			this._notifyChange(inst);
		this._adjustInstDate(inst);
		if (inst.input) {
			inst.input.val(clear ? '' : this._formatDate(inst));
		}
	},

	/* Retrieve the date(s) directly. */
	_getDate: function(inst) {
		var startDate = (!inst.currentYear || (inst.input && inst.input.val() == '') ? null :
			this._daylightSavingAdjust(new Date(
			inst.currentYear, inst.currentMonth, inst.currentDay)));
			return startDate;
	},

	/* Attach the onxxx handlers.  These are declared statically so
	 * they work with static code transformers like Caja.
	 */
	_attachHandlers: function(inst) {
		var stepMonths = this._get(inst, 'stepMonths');
		var id = '#' + inst.id.replace( /\\\\/g, "\\" );
		inst.dpDiv.find('[data-handler]').map(function () {
			var handler = {
				prev: function () {
					window['DP_jQuery_' + dpuuid].datepicker._adjustDate(id, -stepMonths, 'M');
				},
				next: function () {
					window['DP_jQuery_' + dpuuid].datepicker._adjustDate(id, +stepMonths, 'M');
				},
				hide: function () {
					window['DP_jQuery_' + dpuuid].datepicker._hideDatepicker();
				},
				today: function () {
					window['DP_jQuery_' + dpuuid].datepicker._gotoToday(id);
				},
				selectDay: function () {
					window['DP_jQuery_' + dpuuid].datepicker._selectDay(id, +this.getAttribute('data-month'), +this.getAttribute('data-year'), this);
					return false;
				},
				selectMonth: function () {
					window['DP_jQuery_' + dpuuid].datepicker._selectMonthYear(id, this, 'M');
					return false;
				},
				selectYear: function () {
					window['DP_jQuery_' + dpuuid].datepicker._selectMonthYear(id, this, 'Y');
					return false;
				}
			};
			$(this).bind(this.getAttribute('data-event'), handler[this.getAttribute('data-handler')]);
		});
	},

	/* Generate the HTML for the current state of the date picker. */
	_generateHTML: function(inst) {
		var today = new Date();
		today = this._daylightSavingAdjust(
			new Date(today.getFullYear(), today.getMonth(), today.getDate())); // clear time
		var isRTL = this._get(inst, 'isRTL');
		var showButtonPanel = this._get(inst, 'showButtonPanel');
		var hideIfNoPrevNext = this._get(inst, 'hideIfNoPrevNext');
		var navigationAsDateFormat = this._get(inst, 'navigationAsDateFormat');
		var numMonths = this._getNumberOfMonths(inst);
		var showCurrentAtPos = this._get(inst, 'showCurrentAtPos');
		var stepMonths = this._get(inst, 'stepMonths');
		var isMultiMonth = (numMonths[0] != 1 || numMonths[1] != 1);
		var currentDate = this._daylightSavingAdjust((!inst.currentDay ? new Date(9999, 9, 9) :
			new Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
		var minDate = this._getMinMaxDate(inst, 'min');
		var maxDate = this._getMinMaxDate(inst, 'max');
		var drawMonth = inst.drawMonth - showCurrentAtPos;
		var drawYear = inst.drawYear;
		if (drawMonth < 0) {
			drawMonth += 12;
			drawYear--;
		}
		if (maxDate) {
			var maxDraw = this._daylightSavingAdjust(new Date(maxDate.getFullYear(),
				maxDate.getMonth() - (numMonths[0] * numMonths[1]) + 1, maxDate.getDate()));
			maxDraw = (minDate && maxDraw < minDate ? minDate : maxDraw);
			while (this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1)) > maxDraw) {
				drawMonth--;
				if (drawMonth < 0) {
					drawMonth = 11;
					drawYear--;
				}
			}
		}
		inst.drawMonth = drawMonth;
		inst.drawYear = drawYear;
		var prevText = this._get(inst, 'prevText');
		prevText = (!navigationAsDateFormat ? prevText : this.formatDate(prevText,
			this._daylightSavingAdjust(new Date(drawYear, drawMonth - stepMonths, 1)),
			this._getFormatConfig(inst)));
		var prev = (this._canAdjustMonth(inst, -1, drawYear, drawMonth) ?
			'<a class="ui-datepicker-prev ui-corner-all" data-handler="prev" data-event="click"' +
			' title="' + prevText + '"><span class="ui-icon ui-icon-circle-triangle-' + ( isRTL ? 'e' : 'w') + '">' + prevText + '</span></a>' :
			(hideIfNoPrevNext ? '' : '<a class="ui-datepicker-prev ui-corner-all ui-state-disabled" title="'+ prevText +'"><span class="ui-icon ui-icon-circle-triangle-' + ( isRTL ? 'e' : 'w') + '">' + prevText + '</span></a>'));
		var nextText = this._get(inst, 'nextText');
		nextText = (!navigationAsDateFormat ? nextText : this.formatDate(nextText,
			this._daylightSavingAdjust(new Date(drawYear, drawMonth + stepMonths, 1)),
			this._getFormatConfig(inst)));
		var next = (this._canAdjustMonth(inst, +1, drawYear, drawMonth) ?
			'<a class="ui-datepicker-next ui-corner-all" data-handler="next" data-event="click"' +
			' title="' + nextText + '"><span class="ui-icon ui-icon-circle-triangle-' + ( isRTL ? 'w' : 'e') + '">' + nextText + '</span></a>' :
			(hideIfNoPrevNext ? '' : '<a class="ui-datepicker-next ui-corner-all ui-state-disabled" title="'+ nextText + '"><span class="ui-icon ui-icon-circle-triangle-' + ( isRTL ? 'w' : 'e') + '">' + nextText + '</span></a>'));
		var currentText = this._get(inst, 'currentText');
		var gotoDate = (this._get(inst, 'gotoCurrent') && inst.currentDay ? currentDate : today);
		currentText = (!navigationAsDateFormat ? currentText :
			this.formatDate(currentText, gotoDate, this._getFormatConfig(inst)));
		var controls = (!inst.inline ? '<button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" data-handler="hide" data-event="click">' +
			this._get(inst, 'closeText') + '</button>' : '');
		var buttonPanel = (showButtonPanel) ? '<div class="ui-datepicker-buttonpane ui-widget-content">' + (isRTL ? controls : '') +
			(this._isInRange(inst, gotoDate) ? '<button type="button" class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all" data-handler="today" data-event="click"' +
			'>' + currentText + '</button>' : '') + (isRTL ? '' : controls) + '</div>' : '';
		var firstDay = parseInt(this._get(inst, 'firstDay'),10);
		firstDay = (isNaN(firstDay) ? 0 : firstDay);
		var showWeek = this._get(inst, 'showWeek');
		var dayNames = this._get(inst, 'dayNames');
		var dayNamesShort = this._get(inst, 'dayNamesShort');
		var dayNamesMin = this._get(inst, 'dayNamesMin');
		var monthNames = this._get(inst, 'monthNames');
		var monthNamesShort = this._get(inst, 'monthNamesShort');
		var beforeShowDay = this._get(inst, 'beforeShowDay');
		var showOtherMonths = this._get(inst, 'showOtherMonths');
		var selectOtherMonths = this._get(inst, 'selectOtherMonths');
		var calculateWeek = this._get(inst, 'calculateWeek') || this.iso8601Week;
		var defaultDate = this._getDefaultDate(inst);
		var html = '';
		for (var row = 0; row < numMonths[0]; row++) {
			var group = '';
			this.maxRows = 4;
			for (var col = 0; col < numMonths[1]; col++) {
				var selectedDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, inst.selectedDay));
				var cornerClass = ' ui-corner-all';
				var calender = '';
				if (isMultiMonth) {
					calender += '<div class="ui-datepicker-group';
					if (numMonths[1] > 1)
						switch (col) {
							case 0: calender += ' ui-datepicker-group-first';
								cornerClass = ' ui-corner-' + (isRTL ? 'right' : 'left'); break;
							case numMonths[1]-1: calender += ' ui-datepicker-group-last';
								cornerClass = ' ui-corner-' + (isRTL ? 'left' : 'right'); break;
							default: calender += ' ui-datepicker-group-middle'; cornerClass = ''; break;
						}
					calender += '">';
				}
				calender += '<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix' + cornerClass + '">' +
					(/all|left/.test(cornerClass) && row == 0 ? (isRTL ? next : prev) : '') +
					(/all|right/.test(cornerClass) && row == 0 ? (isRTL ? prev : next) : '') +
					this._generateMonthYearHeader(inst, drawMonth, drawYear, minDate, maxDate,
					row > 0 || col > 0, monthNames, monthNamesShort) + // draw month headers
					'</div><table class="ui-datepicker-calendar"><thead>' +
					'<tr>';
				var thead = (showWeek ? '<th class="ui-datepicker-week-col">' + this._get(inst, 'weekHeader') + '</th>' : '');
				for (var dow = 0; dow < 7; dow++) { // days of the week
					var day = (dow + firstDay) % 7;
					thead += '<th' + ((dow + firstDay + 6) % 7 >= 5 ? ' class="ui-datepicker-week-end"' : '') + '>' +
						'<span title="' + dayNames[day] + '">' + dayNamesMin[day] + '</span></th>';
				}
				calender += thead + '</tr></thead><tbody>';
				var daysInMonth = this._getDaysInMonth(drawYear, drawMonth);
				if (drawYear == inst.selectedYear && drawMonth == inst.selectedMonth)
					inst.selectedDay = Math.min(inst.selectedDay, daysInMonth);
				var leadDays = (this._getFirstDayOfMonth(drawYear, drawMonth) - firstDay + 7) % 7;
				var curRows = Math.ceil((leadDays + daysInMonth) / 7); // calculate the number of rows to generate
				var numRows = (isMultiMonth ? this.maxRows > curRows ? this.maxRows : curRows : curRows); //If multiple months, use the higher number of rows (see #7043)
				this.maxRows = numRows;
				var printDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1 - leadDays));
				for (var dRow = 0; dRow < numRows; dRow++) { // create date picker rows
					calender += '<tr>';
					var tbody = (!showWeek ? '' : '<td class="ui-datepicker-week-col">' +
						this._get(inst, 'calculateWeek')(printDate) + '</td>');
					for (var dow = 0; dow < 7; dow++) { // create date picker days
						var daySettings = (beforeShowDay ?
							beforeShowDay.apply((inst.input ? inst.input[0] : null), [printDate]) : [true, '']);
						var otherMonth = (printDate.getMonth() != drawMonth);
						var unselectable = (otherMonth && !selectOtherMonths) || !daySettings[0] ||
							(minDate && printDate < minDate) || (maxDate && printDate > maxDate);
						tbody += '<td class="' +
							((dow + firstDay + 6) % 7 >= 5 ? ' ui-datepicker-week-end' : '') + // highlight weekends
							(otherMonth ? ' ui-datepicker-other-month' : '') + // highlight days from other months
							((printDate.getTime() == selectedDate.getTime() && drawMonth == inst.selectedMonth && inst._keyEvent) || // user pressed key
							(defaultDate.getTime() == printDate.getTime() && defaultDate.getTime() == selectedDate.getTime()) ?
							// or defaultDate is current printedDate and defaultDate is selectedDate
							' ' + this._dayOverClass : '') + // highlight selected day
							(unselectable ? ' ' + this._unselectableClass + ' ui-state-disabled': '') +  // highlight unselectable days
							(otherMonth && !showOtherMonths ? '' : ' ' + daySettings[1] + // highlight custom dates
							(printDate.getTime() == currentDate.getTime() ? ' ' + this._currentClass : '') + // highlight selected day
							(printDate.getTime() == today.getTime() ? ' ui-datepicker-today' : '')) + '"' + // highlight today (if different)
							((!otherMonth || showOtherMonths) && daySettings[2] ? ' title="' + daySettings[2] + '"' : '') + // cell title
							(unselectable ? '' : ' data-handler="selectDay" data-event="click" data-month="' + printDate.getMonth() + '" data-year="' + printDate.getFullYear() + '"') + '>' + // actions
							(otherMonth && !showOtherMonths ? '&#xa0;' : // display for other months
							(unselectable ? '<span class="ui-state-default">' + printDate.getDate() + '</span>' : '<a class="ui-state-default' +
							(printDate.getTime() == today.getTime() ? ' ui-state-highlight' : '') +
							(printDate.getTime() == currentDate.getTime() ? ' ui-state-active' : '') + // highlight selected day
							(otherMonth ? ' ui-priority-secondary' : '') + // distinguish dates from other months
							'" href="#">' + printDate.getDate() + '</a>')) + '</td>'; // display selectable date
						printDate.setDate(printDate.getDate() + 1);
						printDate = this._daylightSavingAdjust(printDate);
					}
					calender += tbody + '</tr>';
				}
				drawMonth++;
				if (drawMonth > 11) {
					drawMonth = 0;
					drawYear++;
				}
				calender += '</tbody></table>' + (isMultiMonth ? '</div>' +
							((numMonths[0] > 0 && col == numMonths[1]-1) ? '<div class="ui-datepicker-row-break"></div>' : '') : '');
				group += calender;
			}
			html += group;
		}
		html += buttonPanel + ($.ui.ie6 && !inst.inline ?
			'<iframe src="javascript:false;" class="ui-datepicker-cover" frameborder="0"></iframe>' : '');
		inst._keyEvent = false;
		return html;
	},

	/* Generate the month and year header. */
	_generateMonthYearHeader: function(inst, drawMonth, drawYear, minDate, maxDate,
			secondary, monthNames, monthNamesShort) {
		var changeMonth = this._get(inst, 'changeMonth');
		var changeYear = this._get(inst, 'changeYear');
		var showMonthAfterYear = this._get(inst, 'showMonthAfterYear');
		var html = '<div class="ui-datepicker-title">';
		var monthHtml = '';
		// month selection
		if (secondary || !changeMonth)
			monthHtml += '<span class="ui-datepicker-month">' + monthNames[drawMonth] + '</span>';
		else {
			var inMinYear = (minDate && minDate.getFullYear() == drawYear);
			var inMaxYear = (maxDate && maxDate.getFullYear() == drawYear);
			monthHtml += '<select class="ui-datepicker-month" data-handler="selectMonth" data-event="change">';
			for (var month = 0; month < 12; month++) {
				if ((!inMinYear || month >= minDate.getMonth()) &&
						(!inMaxYear || month <= maxDate.getMonth()))
					monthHtml += '<option value="' + month + '"' +
						(month == drawMonth ? ' selected="selected"' : '') +
						'>' + monthNamesShort[month] + '</option>';
			}
			monthHtml += '</select>';
		}
		if (!showMonthAfterYear)
			html += monthHtml + (secondary || !(changeMonth && changeYear) ? '&#xa0;' : '');
		// year selection
		if ( !inst.yearshtml ) {
			inst.yearshtml = '';
			if (secondary || !changeYear)
				html += '<span class="ui-datepicker-year">' + drawYear + '</span>';
			else {
				// determine range of years to display
				var years = this._get(inst, 'yearRange').split(':');
				var thisYear = new Date().getFullYear();
				var determineYear = function(value) {
					var year = (value.match(/c[+-].*/) ? drawYear + parseInt(value.substring(1), 10) :
						(value.match(/[+-].*/) ? thisYear + parseInt(value, 10) :
						parseInt(value, 10)));
					return (isNaN(year) ? thisYear : year);
				};
				var year = determineYear(years[0]);
				var endYear = Math.max(year, determineYear(years[1] || ''));
				year = (minDate ? Math.max(year, minDate.getFullYear()) : year);
				endYear = (maxDate ? Math.min(endYear, maxDate.getFullYear()) : endYear);
				inst.yearshtml += '<select class="ui-datepicker-year" data-handler="selectYear" data-event="change">';
				for (; year <= endYear; year++) {
					inst.yearshtml += '<option value="' + year + '"' +
						(year == drawYear ? ' selected="selected"' : '') +
						'>' + year + '</option>';
				}
				inst.yearshtml += '</select>';

				html += inst.yearshtml;
				inst.yearshtml = null;
			}
		}
		html += this._get(inst, 'yearSuffix');
		if (showMonthAfterYear)
			html += (secondary || !(changeMonth && changeYear) ? '&#xa0;' : '') + monthHtml;
		html += '</div>'; // Close datepicker_header
		return html;
	},

	/* Adjust one of the date sub-fields. */
	_adjustInstDate: function(inst, offset, period) {
		var year = inst.drawYear + (period == 'Y' ? offset : 0);
		var month = inst.drawMonth + (period == 'M' ? offset : 0);
		var day = Math.min(inst.selectedDay, this._getDaysInMonth(year, month)) +
			(period == 'D' ? offset : 0);
		var date = this._restrictMinMax(inst,
			this._daylightSavingAdjust(new Date(year, month, day)));
		inst.selectedDay = date.getDate();
		inst.drawMonth = inst.selectedMonth = date.getMonth();
		inst.drawYear = inst.selectedYear = date.getFullYear();
		if (period == 'M' || period == 'Y')
			this._notifyChange(inst);
	},

	/* Ensure a date is within any min/max bounds. */
	_restrictMinMax: function(inst, date) {
		var minDate = this._getMinMaxDate(inst, 'min');
		var maxDate = this._getMinMaxDate(inst, 'max');
		var newDate = (minDate && date < minDate ? minDate : date);
		newDate = (maxDate && newDate > maxDate ? maxDate : newDate);
		return newDate;
	},

	/* Notify change of month/year. */
	_notifyChange: function(inst) {
		var onChange = this._get(inst, 'onChangeMonthYear');
		if (onChange)
			onChange.apply((inst.input ? inst.input[0] : null),
				[inst.selectedYear, inst.selectedMonth + 1, inst]);
	},

	/* Determine the number of months to show. */
	_getNumberOfMonths: function(inst) {
		var numMonths = this._get(inst, 'numberOfMonths');
		return (numMonths == null ? [1, 1] : (typeof numMonths == 'number' ? [1, numMonths] : numMonths));
	},

	/* Determine the current maximum date - ensure no time components are set. */
	_getMinMaxDate: function(inst, minMax) {
		return this._determineDate(inst, this._get(inst, minMax + 'Date'), null);
	},

	/* Find the number of days in a given month. */
	_getDaysInMonth: function(year, month) {
		return 32 - this._daylightSavingAdjust(new Date(year, month, 32)).getDate();
	},

	/* Find the day of the week of the first of a month. */
	_getFirstDayOfMonth: function(year, month) {
		return new Date(year, month, 1).getDay();
	},

	/* Determines if we should allow a "next/prev" month display change. */
	_canAdjustMonth: function(inst, offset, curYear, curMonth) {
		var numMonths = this._getNumberOfMonths(inst);
		var date = this._daylightSavingAdjust(new Date(curYear,
			curMonth + (offset < 0 ? offset : numMonths[0] * numMonths[1]), 1));
		if (offset < 0)
			date.setDate(this._getDaysInMonth(date.getFullYear(), date.getMonth()));
		return this._isInRange(inst, date);
	},

	/* Is the given date in the accepted range? */
	_isInRange: function(inst, date) {
		var minDate = this._getMinMaxDate(inst, 'min');
		var maxDate = this._getMinMaxDate(inst, 'max');
		return ((!minDate || date.getTime() >= minDate.getTime()) &&
			(!maxDate || date.getTime() <= maxDate.getTime()));
	},

	/* Provide the configuration settings for formatting/parsing. */
	_getFormatConfig: function(inst) {
		var shortYearCutoff = this._get(inst, 'shortYearCutoff');
		shortYearCutoff = (typeof shortYearCutoff != 'string' ? shortYearCutoff :
			new Date().getFullYear() % 100 + parseInt(shortYearCutoff, 10));
		return {shortYearCutoff: shortYearCutoff,
			dayNamesShort: this._get(inst, 'dayNamesShort'), dayNames: this._get(inst, 'dayNames'),
			monthNamesShort: this._get(inst, 'monthNamesShort'), monthNames: this._get(inst, 'monthNames')};
	},

	/* Format the given date for display. */
	_formatDate: function(inst, day, month, year) {
		if (!day) {
			inst.currentDay = inst.selectedDay;
			inst.currentMonth = inst.selectedMonth;
			inst.currentYear = inst.selectedYear;
		}
		var date = (day ? (typeof day == 'object' ? day :
			this._daylightSavingAdjust(new Date(year, month, day))) :
			this._daylightSavingAdjust(new Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
		return this.formatDate(this._get(inst, 'dateFormat'), date, this._getFormatConfig(inst));
	}
});

/*
 * Bind hover events for datepicker elements.
 * Done via delegate so the binding only occurs once in the lifetime of the parent div.
 * Global instActive, set by _updateDatepicker allows the handlers to find their way back to the active picker.
 */
function bindHover(dpDiv) {
	var selector = 'button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a';
	return dpDiv.delegate(selector, 'mouseout', function() {
			$(this).removeClass('ui-state-hover');
			if (this.className.indexOf('ui-datepicker-prev') != -1) $(this).removeClass('ui-datepicker-prev-hover');
			if (this.className.indexOf('ui-datepicker-next') != -1) $(this).removeClass('ui-datepicker-next-hover');
		})
		.delegate(selector, 'mouseover', function(){
			if (!$.datepicker._isDisabledDatepicker( instActive.inline ? dpDiv.parent()[0] : instActive.input[0])) {
				$(this).parents('.ui-datepicker-calendar').find('a').removeClass('ui-state-hover');
				$(this).addClass('ui-state-hover');
				if (this.className.indexOf('ui-datepicker-prev') != -1) $(this).addClass('ui-datepicker-prev-hover');
				if (this.className.indexOf('ui-datepicker-next') != -1) $(this).addClass('ui-datepicker-next-hover');
			}
		});
}

/* jQuery extend now ignores nulls! */
function extendRemove(target, props) {
	$.extend(target, props);
	for (var name in props)
		if (props[name] == null || props[name] == undefined)
			target[name] = props[name];
	return target;
};

/* Invoke the datepicker functionality.
   @param  options  string - a command, optionally followed by additional parameters or
	                Object - settings for attaching new datepicker functionality
   @return  jQuery object */
$.fn.datepicker = function(options){

	/* Verify an empty collection wasn't passed - Fixes #6976 */
	if ( !this.length ) {
		return this;
	}

	/* Initialise the date picker. */
	if (!$.datepicker.initialized) {
		$(document).mousedown($.datepicker._checkExternalClick).
			find(document.body).append($.datepicker.dpDiv);
		$.datepicker.initialized = true;
	}

	var otherArgs = Array.prototype.slice.call(arguments, 1);
	if (typeof options == 'string' && (options == 'isDisabled' || options == 'getDate' || options == 'widget'))
		return $.datepicker['_' + options + 'Datepicker'].
			apply($.datepicker, [this[0]].concat(otherArgs));
	if (options == 'option' && arguments.length == 2 && typeof arguments[1] == 'string')
		return $.datepicker['_' + options + 'Datepicker'].
			apply($.datepicker, [this[0]].concat(otherArgs));
	return this.each(function() {
		typeof options == 'string' ?
			$.datepicker['_' + options + 'Datepicker'].
				apply($.datepicker, [this].concat(otherArgs)) :
			$.datepicker._attachDatepicker(this, options);
	});
};

$.datepicker = new Datepicker(); // singleton instance
$.datepicker.initialized = false;
$.datepicker.uuid = new Date().getTime();
$.datepicker.version = "1.9.2";

// Workaround for #4055
// Add another global to avoid noConflict issues with inline event handlers
window['DP_jQuery_' + dpuuid] = $;

})(jQuery);
(function( $, undefined ) {

var uiDialogClasses = "ui-dialog ui-widget ui-widget-content ui-corner-all ",
	sizeRelatedOptions = {
		buttons: true,
		height: true,
		maxHeight: true,
		maxWidth: true,
		minHeight: true,
		minWidth: true,
		width: true
	},
	resizableRelatedOptions = {
		maxHeight: true,
		maxWidth: true,
		minHeight: true,
		minWidth: true
	};

$.widget("ui.dialog", {
	version: "1.9.2",
	options: {
		autoOpen: true,
		buttons: {},
		closeOnEscape: true,
		closeText: "close",
		dialogClass: "",
		draggable: true,
		hide: null,
		height: "auto",
		maxHeight: false,
		maxWidth: false,
		minHeight: 150,
		minWidth: 150,
		modal: false,
		position: {
			my: "center",
			at: "center",
			of: window,
			collision: "fit",
			// ensure that the titlebar is never outside the document
			using: function( pos ) {
				var topOffset = $( this ).css( pos ).offset().top;
				if ( topOffset < 0 ) {
					$( this ).css( "top", pos.top - topOffset );
				}
			}
		},
		resizable: true,
		show: null,
		stack: true,
		title: "",
		width: 300,
		zIndex: 1000
	},

	_create: function() {
		this.originalTitle = this.element.attr( "title" );
		// #5742 - .attr() might return a DOMElement
		if ( typeof this.originalTitle !== "string" ) {
			this.originalTitle = "";
		}
		this.oldPosition = {
			parent: this.element.parent(),
			index: this.element.parent().children().index( this.element )
		};
		this.options.title = this.options.title || this.originalTitle;
		var that = this,
			options = this.options,

			title = options.title || "&#160;",
			uiDialog,
			uiDialogTitlebar,
			uiDialogTitlebarClose,
			uiDialogTitle,
			uiDialogButtonPane;

			uiDialog = ( this.uiDialog = $( "<div>" ) )
				.addClass( uiDialogClasses + options.dialogClass )
				.css({
					display: "none",
					outline: 0, // TODO: move to stylesheet
					zIndex: options.zIndex
				})
				// setting tabIndex makes the div focusable
				.attr( "tabIndex", -1)
				.keydown(function( event ) {
					if ( options.closeOnEscape && !event.isDefaultPrevented() && event.keyCode &&
							event.keyCode === $.ui.keyCode.ESCAPE ) {
						that.close( event );
						event.preventDefault();
					}
				})
				.mousedown(function( event ) {
					that.moveToTop( false, event );
				})
				.appendTo( "body" );

			this.element
				.show()
				.removeAttr( "title" )
				.addClass( "ui-dialog-content ui-widget-content" )
				.appendTo( uiDialog );

			uiDialogTitlebar = ( this.uiDialogTitlebar = $( "<div>" ) )
				.addClass( "ui-dialog-titlebar  ui-widget-header  " +
					"ui-corner-all  ui-helper-clearfix" )
				.bind( "mousedown", function() {
					// Dialog isn't getting focus when dragging (#8063)
					uiDialog.focus();
				})
				.prependTo( uiDialog );

			uiDialogTitlebarClose = $( "<a href='#'></a>" )
				.addClass( "ui-dialog-titlebar-close  ui-corner-all" )
				.attr( "role", "button" )
				.click(function( event ) {
					event.preventDefault();
					that.close( event );
				})
				.appendTo( uiDialogTitlebar );

			( this.uiDialogTitlebarCloseText = $( "<span>" ) )
				.addClass( "ui-icon ui-icon-closethick" )
				.text( options.closeText )
				.appendTo( uiDialogTitlebarClose );

			uiDialogTitle = $( "<span>" )
				.uniqueId()
				.addClass( "ui-dialog-title" )
				.html( title )
				.prependTo( uiDialogTitlebar );

			uiDialogButtonPane = ( this.uiDialogButtonPane = $( "<div>" ) )
				.addClass( "ui-dialog-buttonpane ui-widget-content ui-helper-clearfix" );

			( this.uiButtonSet = $( "<div>" ) )
				.addClass( "ui-dialog-buttonset" )
				.appendTo( uiDialogButtonPane );

		uiDialog.attr({
			role: "dialog",
			"aria-labelledby": uiDialogTitle.attr( "id" )
		});

		uiDialogTitlebar.find( "*" ).add( uiDialogTitlebar ).disableSelection();
		this._hoverable( uiDialogTitlebarClose );
		this._focusable( uiDialogTitlebarClose );

		if ( options.draggable && $.fn.draggable ) {
			this._makeDraggable();
		}
		if ( options.resizable && $.fn.resizable ) {
			this._makeResizable();
		}

		this._createButtons( options.buttons );
		this._isOpen = false;

		if ( $.fn.bgiframe ) {
			uiDialog.bgiframe();
		}

		// prevent tabbing out of modal dialogs
		this._on( uiDialog, { keydown: function( event ) {
			if ( !options.modal || event.keyCode !== $.ui.keyCode.TAB ) {
				return;
			}

			var tabbables = $( ":tabbable", uiDialog ),
				first = tabbables.filter( ":first" ),
				last  = tabbables.filter( ":last" );

			if ( event.target === last[0] && !event.shiftKey ) {
				first.focus( 1 );
				return false;
			} else if ( event.target === first[0] && event.shiftKey ) {
				last.focus( 1 );
				return false;
			}
		}});
	},

	_init: function() {
		if ( this.options.autoOpen ) {
			this.open();
		}
	},

	_destroy: function() {
		var next,
			oldPosition = this.oldPosition;

		if ( this.overlay ) {
			this.overlay.destroy();
		}
		this.uiDialog.hide();
		this.element
			.removeClass( "ui-dialog-content ui-widget-content" )
			.hide()
			.appendTo( "body" );
		this.uiDialog.remove();

		if ( this.originalTitle ) {
			this.element.attr( "title", this.originalTitle );
		}

		next = oldPosition.parent.children().eq( oldPosition.index );
		// Don't try to place the dialog next to itself (#8613)
		if ( next.length && next[ 0 ] !== this.element[ 0 ] ) {
			next.before( this.element );
		} else {
			oldPosition.parent.append( this.element );
		}
	},

	widget: function() {
		return this.uiDialog;
	},

	close: function( event ) {
		var that = this,
			maxZ, thisZ;

		if ( !this._isOpen ) {
			return;
		}

		if ( false === this._trigger( "beforeClose", event ) ) {
			return;
		}

		this._isOpen = false;

		if ( this.overlay ) {
			this.overlay.destroy();
		}

		if ( this.options.hide ) {
			this._hide( this.uiDialog, this.options.hide, function() {
				that._trigger( "close", event );
			});
		} else {
			this.uiDialog.hide();
			this._trigger( "close", event );
		}

		$.ui.dialog.overlay.resize();

		// adjust the maxZ to allow other modal dialogs to continue to work (see #4309)
		if ( this.options.modal ) {
			maxZ = 0;
			$( ".ui-dialog" ).each(function() {
				if ( this !== that.uiDialog[0] ) {
					thisZ = $( this ).css( "z-index" );
					if ( !isNaN( thisZ ) ) {
						maxZ = Math.max( maxZ, thisZ );
					}
				}
			});
			$.ui.dialog.maxZ = maxZ;
		}

		return this;
	},

	isOpen: function() {
		return this._isOpen;
	},

	// the force parameter allows us to move modal dialogs to their correct
	// position on open
	moveToTop: function( force, event ) {
		var options = this.options,
			saveScroll;

		if ( ( options.modal && !force ) ||
				( !options.stack && !options.modal ) ) {
			return this._trigger( "focus", event );
		}

		if ( options.zIndex > $.ui.dialog.maxZ ) {
			$.ui.dialog.maxZ = options.zIndex;
		}
		if ( this.overlay ) {
			$.ui.dialog.maxZ += 1;
			$.ui.dialog.overlay.maxZ = $.ui.dialog.maxZ;
			this.overlay.$el.css( "z-index", $.ui.dialog.overlay.maxZ );
		}

		// Save and then restore scroll
		// Opera 9.5+ resets when parent z-index is changed.
		// http://bugs.jqueryui.com/ticket/3193
		saveScroll = {
			scrollTop: this.element.scrollTop(),
			scrollLeft: this.element.scrollLeft()
		};
		$.ui.dialog.maxZ += 1;
		this.uiDialog.css( "z-index", $.ui.dialog.maxZ );
		this.element.attr( saveScroll );
		this._trigger( "focus", event );

		return this;
	},

	open: function() {
		if ( this._isOpen ) {
			return;
		}

		var hasFocus,
			options = this.options,
			uiDialog = this.uiDialog;

		this._size();
		this._position( options.position );
		uiDialog.show( options.show );
		this.overlay = options.modal ? new $.ui.dialog.overlay( this ) : null;
		this.moveToTop( true );

		// set focus to the first tabbable element in the content area or the first button
		// if there are no tabbable elements, set focus on the dialog itself
		hasFocus = this.element.find( ":tabbable" );
		if ( !hasFocus.length ) {
			hasFocus = this.uiDialogButtonPane.find( ":tabbable" );
			if ( !hasFocus.length ) {
				hasFocus = uiDialog;
			}
		}
		hasFocus.eq( 0 ).focus();

		this._isOpen = true;
		this._trigger( "open" );

		return this;
	},

	_createButtons: function( buttons ) {
		var that = this,
			hasButtons = false;

		// if we already have a button pane, remove it
		this.uiDialogButtonPane.remove();
		this.uiButtonSet.empty();

		if ( typeof buttons === "object" && buttons !== null ) {
			$.each( buttons, function() {
				return !(hasButtons = true);
			});
		}
		if ( hasButtons ) {
			$.each( buttons, function( name, props ) {
				var button, click;
				props = $.isFunction( props ) ?
					{ click: props, text: name } :
					props;
				// Default to a non-submitting button
				props = $.extend( { type: "button" }, props );
				// Change the context for the click callback to be the main element
				click = props.click;
				props.click = function() {
					click.apply( that.element[0], arguments );
				};
				button = $( "<button></button>", props )
					.appendTo( that.uiButtonSet );
				if ( $.fn.button ) {
					button.button();
				}
			});
			this.uiDialog.addClass( "ui-dialog-buttons" );
			this.uiDialogButtonPane.appendTo( this.uiDialog );
		} else {
			this.uiDialog.removeClass( "ui-dialog-buttons" );
		}
	},

	_makeDraggable: function() {
		var that = this,
			options = this.options;

		function filteredUi( ui ) {
			return {
				position: ui.position,
				offset: ui.offset
			};
		}

		this.uiDialog.draggable({
			cancel: ".ui-dialog-content, .ui-dialog-titlebar-close",
			handle: ".ui-dialog-titlebar",
			containment: "document",
			start: function( event, ui ) {
				$( this )
					.addClass( "ui-dialog-dragging" );
				that._trigger( "dragStart", event, filteredUi( ui ) );
			},
			drag: function( event, ui ) {
				that._trigger( "drag", event, filteredUi( ui ) );
			},
			stop: function( event, ui ) {
				options.position = [
					ui.position.left - that.document.scrollLeft(),
					ui.position.top - that.document.scrollTop()
				];
				$( this )
					.removeClass( "ui-dialog-dragging" );
				that._trigger( "dragStop", event, filteredUi( ui ) );
				$.ui.dialog.overlay.resize();
			}
		});
	},

	_makeResizable: function( handles ) {
		handles = (handles === undefined ? this.options.resizable : handles);
		var that = this,
			options = this.options,
			// .ui-resizable has position: relative defined in the stylesheet
			// but dialogs have to use absolute or fixed positioning
			position = this.uiDialog.css( "position" ),
			resizeHandles = typeof handles === 'string' ?
				handles	:
				"n,e,s,w,se,sw,ne,nw";

		function filteredUi( ui ) {
			return {
				originalPosition: ui.originalPosition,
				originalSize: ui.originalSize,
				position: ui.position,
				size: ui.size
			};
		}

		this.uiDialog.resizable({
			cancel: ".ui-dialog-content",
			containment: "document",
			alsoResize: this.element,
			maxWidth: options.maxWidth,
			maxHeight: options.maxHeight,
			minWidth: options.minWidth,
			minHeight: this._minHeight(),
			handles: resizeHandles,
			start: function( event, ui ) {
				$( this ).addClass( "ui-dialog-resizing" );
				that._trigger( "resizeStart", event, filteredUi( ui ) );
			},
			resize: function( event, ui ) {
				that._trigger( "resize", event, filteredUi( ui ) );
			},
			stop: function( event, ui ) {
				$( this ).removeClass( "ui-dialog-resizing" );
				options.height = $( this ).height();
				options.width = $( this ).width();
				that._trigger( "resizeStop", event, filteredUi( ui ) );
				$.ui.dialog.overlay.resize();
			}
		})
		.css( "position", position )
		.find( ".ui-resizable-se" )
			.addClass( "ui-icon ui-icon-grip-diagonal-se" );
	},

	_minHeight: function() {
		var options = this.options;

		if ( options.height === "auto" ) {
			return options.minHeight;
		} else {
			return Math.min( options.minHeight, options.height );
		}
	},

	_position: function( position ) {
		var myAt = [],
			offset = [ 0, 0 ],
			isVisible;

		if ( position ) {
			// deep extending converts arrays to objects in jQuery <= 1.3.2 :-(
	//		if (typeof position == 'string' || $.isArray(position)) {
	//			myAt = $.isArray(position) ? position : position.split(' ');

			if ( typeof position === "string" || (typeof position === "object" && "0" in position ) ) {
				myAt = position.split ? position.split( " " ) : [ position[ 0 ], position[ 1 ] ];
				if ( myAt.length === 1 ) {
					myAt[ 1 ] = myAt[ 0 ];
				}

				$.each( [ "left", "top" ], function( i, offsetPosition ) {
					if ( +myAt[ i ] === myAt[ i ] ) {
						offset[ i ] = myAt[ i ];
						myAt[ i ] = offsetPosition;
					}
				});

				position = {
					my: myAt[0] + (offset[0] < 0 ? offset[0] : "+" + offset[0]) + " " +
						myAt[1] + (offset[1] < 0 ? offset[1] : "+" + offset[1]),
					at: myAt.join( " " )
				};
			}

			position = $.extend( {}, $.ui.dialog.prototype.options.position, position );
		} else {
			position = $.ui.dialog.prototype.options.position;
		}

		// need to show the dialog to get the actual offset in the position plugin
		isVisible = this.uiDialog.is( ":visible" );
		if ( !isVisible ) {
			this.uiDialog.show();
		}
		this.uiDialog.position( position );
		if ( !isVisible ) {
			this.uiDialog.hide();
		}
	},

	_setOptions: function( options ) {
		var that = this,
			resizableOptions = {},
			resize = false;

		$.each( options, function( key, value ) {
			that._setOption( key, value );

			if ( key in sizeRelatedOptions ) {
				resize = true;
			}
			if ( key in resizableRelatedOptions ) {
				resizableOptions[ key ] = value;
			}
		});

		if ( resize ) {
			this._size();
		}
		if ( this.uiDialog.is( ":data(resizable)" ) ) {
			this.uiDialog.resizable( "option", resizableOptions );
		}
	},

	_setOption: function( key, value ) {
		var isDraggable, isResizable,
			uiDialog = this.uiDialog;

		switch ( key ) {
			case "buttons":
				this._createButtons( value );
				break;
			case "closeText":
				// ensure that we always pass a string
				this.uiDialogTitlebarCloseText.text( "" + value );
				break;
			case "dialogClass":
				uiDialog
					.removeClass( this.options.dialogClass )
					.addClass( uiDialogClasses + value );
				break;
			case "disabled":
				if ( value ) {
					uiDialog.addClass( "ui-dialog-disabled" );
				} else {
					uiDialog.removeClass( "ui-dialog-disabled" );
				}
				break;
			case "draggable":
				isDraggable = uiDialog.is( ":data(draggable)" );
				if ( isDraggable && !value ) {
					uiDialog.draggable( "destroy" );
				}

				if ( !isDraggable && value ) {
					this._makeDraggable();
				}
				break;
			case "position":
				this._position( value );
				break;
			case "resizable":
				// currently resizable, becoming non-resizable
				isResizable = uiDialog.is( ":data(resizable)" );
				if ( isResizable && !value ) {
					uiDialog.resizable( "destroy" );
				}

				// currently resizable, changing handles
				if ( isResizable && typeof value === "string" ) {
					uiDialog.resizable( "option", "handles", value );
				}

				// currently non-resizable, becoming resizable
				if ( !isResizable && value !== false ) {
					this._makeResizable( value );
				}
				break;
			case "title":
				// convert whatever was passed in o a string, for html() to not throw up
				$( ".ui-dialog-title", this.uiDialogTitlebar )
					.html( "" + ( value || "&#160;" ) );
				break;
		}

		this._super( key, value );
	},

	_size: function() {
		/* If the user has resized the dialog, the .ui-dialog and .ui-dialog-content
		 * divs will both have width and height set, so we need to reset them
		 */
		var nonContentHeight, minContentHeight, autoHeight,
			options = this.options,
			isVisible = this.uiDialog.is( ":visible" );

		// reset content sizing
		this.element.show().css({
			width: "auto",
			minHeight: 0,
			height: 0
		});

		if ( options.minWidth > options.width ) {
			options.width = options.minWidth;
		}

		// reset wrapper sizing
		// determine the height of all the non-content elements
		nonContentHeight = this.uiDialog.css({
				height: "auto",
				width: options.width
			})
			.outerHeight();
		minContentHeight = Math.max( 0, options.minHeight - nonContentHeight );

		if ( options.height === "auto" ) {
			// only needed for IE6 support
			if ( $.support.minHeight ) {
				this.element.css({
					minHeight: minContentHeight,
					height: "auto"
				});
			} else {
				this.uiDialog.show();
				autoHeight = this.element.css( "height", "auto" ).height();
				if ( !isVisible ) {
					this.uiDialog.hide();
				}
				this.element.height( Math.max( autoHeight, minContentHeight ) );
			}
		} else {
			this.element.height( Math.max( options.height - nonContentHeight, 0 ) );
		}

		if (this.uiDialog.is( ":data(resizable)" ) ) {
			this.uiDialog.resizable( "option", "minHeight", this._minHeight() );
		}
	}
});

$.extend($.ui.dialog, {
	uuid: 0,
	maxZ: 0,

	getTitleId: function($el) {
		var id = $el.attr( "id" );
		if ( !id ) {
			this.uuid += 1;
			id = this.uuid;
		}
		return "ui-dialog-title-" + id;
	},

	overlay: function( dialog ) {
		this.$el = $.ui.dialog.overlay.create( dialog );
	}
});

$.extend( $.ui.dialog.overlay, {
	instances: [],
	// reuse old instances due to IE memory leak with alpha transparency (see #5185)
	oldInstances: [],
	maxZ: 0,
	events: $.map(
		"focus,mousedown,mouseup,keydown,keypress,click".split( "," ),
		function( event ) {
			return event + ".dialog-overlay";
		}
	).join( " " ),
	create: function( dialog ) {
		if ( this.instances.length === 0 ) {
			// prevent use of anchors and inputs
			// we use a setTimeout in case the overlay is created from an
			// event that we're going to be cancelling (see #2804)
			setTimeout(function() {
				// handle $(el).dialog().dialog('close') (see #4065)
				if ( $.ui.dialog.overlay.instances.length ) {
					$( document ).bind( $.ui.dialog.overlay.events, function( event ) {
						// stop events if the z-index of the target is < the z-index of the overlay
						// we cannot return true when we don't want to cancel the event (#3523)
						if ( $( event.target ).zIndex() < $.ui.dialog.overlay.maxZ ) {
							return false;
						}
					});
				}
			}, 1 );

			// handle window resize
			$( window ).bind( "resize.dialog-overlay", $.ui.dialog.overlay.resize );
		}

		var $el = ( this.oldInstances.pop() || $( "<div>" ).addClass( "ui-widget-overlay" ) );

		// allow closing by pressing the escape key
		$( document ).bind( "keydown.dialog-overlay", function( event ) {
			var instances = $.ui.dialog.overlay.instances;
			// only react to the event if we're the top overlay
			if ( instances.length !== 0 && instances[ instances.length - 1 ] === $el &&
				dialog.options.closeOnEscape && !event.isDefaultPrevented() && event.keyCode &&
				event.keyCode === $.ui.keyCode.ESCAPE ) {

				dialog.close( event );
				event.preventDefault();
			}
		});

		$el.appendTo( document.body ).css({
			width: this.width(),
			height: this.height()
		});

		if ( $.fn.bgiframe ) {
			$el.bgiframe();
		}

		this.instances.push( $el );
		return $el;
	},

	destroy: function( $el ) {
		var indexOf = $.inArray( $el, this.instances ),
			maxZ = 0;

		if ( indexOf !== -1 ) {
			this.oldInstances.push( this.instances.splice( indexOf, 1 )[ 0 ] );
		}

		if ( this.instances.length === 0 ) {
			$( [ document, window ] ).unbind( ".dialog-overlay" );
		}

		$el.height( 0 ).width( 0 ).remove();

		// adjust the maxZ to allow other modal dialogs to continue to work (see #4309)
		$.each( this.instances, function() {
			maxZ = Math.max( maxZ, this.css( "z-index" ) );
		});
		this.maxZ = maxZ;
	},

	height: function() {
		var scrollHeight,
			offsetHeight;
		// handle IE
		if ( $.ui.ie ) {
			scrollHeight = Math.max(
				document.documentElement.scrollHeight,
				document.body.scrollHeight
			);
			offsetHeight = Math.max(
				document.documentElement.offsetHeight,
				document.body.offsetHeight
			);

			if ( scrollHeight < offsetHeight ) {
				return $( window ).height() + "px";
			} else {
				return scrollHeight + "px";
			}
		// handle "good" browsers
		} else {
			return $( document ).height() + "px";
		}
	},

	width: function() {
		var scrollWidth,
			offsetWidth;
		// handle IE
		if ( $.ui.ie ) {
			scrollWidth = Math.max(
				document.documentElement.scrollWidth,
				document.body.scrollWidth
			);
			offsetWidth = Math.max(
				document.documentElement.offsetWidth,
				document.body.offsetWidth
			);

			if ( scrollWidth < offsetWidth ) {
				return $( window ).width() + "px";
			} else {
				return scrollWidth + "px";
			}
		// handle "good" browsers
		} else {
			return $( document ).width() + "px";
		}
	},

	resize: function() {
		/* If the dialog is draggable and the user drags it past the
		 * right edge of the window, the document becomes wider so we
		 * need to stretch the overlay. If the user then drags the
		 * dialog back to the left, the document will become narrower,
		 * so we need to shrink the overlay to the appropriate size.
		 * This is handled by shrinking the overlay before setting it
		 * to the full document size.
		 */
		var $overlays = $( [] );
		$.each( $.ui.dialog.overlay.instances, function() {
			$overlays = $overlays.add( this );
		});

		$overlays.css({
			width: 0,
			height: 0
		}).css({
			width: $.ui.dialog.overlay.width(),
			height: $.ui.dialog.overlay.height()
		});
	}
});

$.extend( $.ui.dialog.overlay.prototype, {
	destroy: function() {
		$.ui.dialog.overlay.destroy( this.$el );
	}
});

}( jQuery ) );
(function( $, undefined ) {

var mouseHandled = false;

$.widget( "ui.menu", {
	version: "1.9.2",
	defaultElement: "<ul>",
	delay: 300,
	options: {
		icons: {
			submenu: "ui-icon-carat-1-e"
		},
		menus: "ul",
		position: {
			my: "left top",
			at: "right top"
		},
		role: "menu",

		// callbacks
		blur: null,
		focus: null,
		select: null
	},

	_create: function() {
		this.activeMenu = this.element;
		this.element
			.uniqueId()
			.addClass( "ui-menu ui-widget ui-widget-content ui-corner-all" )
			.toggleClass( "ui-menu-icons", !!this.element.find( ".ui-icon" ).length )
			.attr({
				role: this.options.role,
				tabIndex: 0
			})
			// need to catch all clicks on disabled menu
			// not possible through _on
			.bind( "click" + this.eventNamespace, $.proxy(function( event ) {
				if ( this.options.disabled ) {
					event.preventDefault();
				}
			}, this ));

		if ( this.options.disabled ) {
			this.element
				.addClass( "ui-state-disabled" )
				.attr( "aria-disabled", "true" );
		}

		this._on({
			// Prevent focus from sticking to links inside menu after clicking
			// them (focus should always stay on UL during navigation).
			"mousedown .ui-menu-item > a": function( event ) {
				event.preventDefault();
			},
			"click .ui-state-disabled > a": function( event ) {
				event.preventDefault();
			},
			"click .ui-menu-item:has(a)": function( event ) {
				var target = $( event.target ).closest( ".ui-menu-item" );
				if ( !mouseHandled && target.not( ".ui-state-disabled" ).length ) {
					mouseHandled = true;

					this.select( event );
					// Open submenu on click
					if ( target.has( ".ui-menu" ).length ) {
						this.expand( event );
					} else if ( !this.element.is( ":focus" ) ) {
						// Redirect focus to the menu
						this.element.trigger( "focus", [ true ] );

						// If the active item is on the top level, let it stay active.
						// Otherwise, blur the active item since it is no longer visible.
						if ( this.active && this.active.parents( ".ui-menu" ).length === 1 ) {
							clearTimeout( this.timer );
						}
					}
				}
			},
			"mouseenter .ui-menu-item": function( event ) {
				var target = $( event.currentTarget );
				// Remove ui-state-active class from siblings of the newly focused menu item
				// to avoid a jump caused by adjacent elements both having a class with a border
				target.siblings().children( ".ui-state-active" ).removeClass( "ui-state-active" );
				this.focus( event, target );
			},
			mouseleave: "collapseAll",
			"mouseleave .ui-menu": "collapseAll",
			focus: function( event, keepActiveItem ) {
				// If there's already an active item, keep it active
				// If not, activate the first item
				var item = this.active || this.element.children( ".ui-menu-item" ).eq( 0 );

				if ( !keepActiveItem ) {
					this.focus( event, item );
				}
			},
			blur: function( event ) {
				this._delay(function() {
					if ( !$.contains( this.element[0], this.document[0].activeElement ) ) {
						this.collapseAll( event );
					}
				});
			},
			keydown: "_keydown"
		});

		this.refresh();

		// Clicks outside of a menu collapse any open menus
		this._on( this.document, {
			click: function( event ) {
				if ( !$( event.target ).closest( ".ui-menu" ).length ) {
					this.collapseAll( event );
				}

				// Reset the mouseHandled flag
				mouseHandled = false;
			}
		});
	},

	_destroy: function() {
		// Destroy (sub)menus
		this.element
			.removeAttr( "aria-activedescendant" )
			.find( ".ui-menu" ).andSelf()
				.removeClass( "ui-menu ui-widget ui-widget-content ui-corner-all ui-menu-icons" )
				.removeAttr( "role" )
				.removeAttr( "tabIndex" )
				.removeAttr( "aria-labelledby" )
				.removeAttr( "aria-expanded" )
				.removeAttr( "aria-hidden" )
				.removeAttr( "aria-disabled" )
				.removeUniqueId()
				.show();

		// Destroy menu items
		this.element.find( ".ui-menu-item" )
			.removeClass( "ui-menu-item" )
			.removeAttr( "role" )
			.removeAttr( "aria-disabled" )
			.children( "a" )
				.removeUniqueId()
				.removeClass( "ui-corner-all ui-state-hover" )
				.removeAttr( "tabIndex" )
				.removeAttr( "role" )
				.removeAttr( "aria-haspopup" )
				.children().each( function() {
					var elem = $( this );
					if ( elem.data( "ui-menu-submenu-carat" ) ) {
						elem.remove();
					}
				});

		// Destroy menu dividers
		this.element.find( ".ui-menu-divider" ).removeClass( "ui-menu-divider ui-widget-content" );
	},

	_keydown: function( event ) {
		var match, prev, character, skip, regex,
			preventDefault = true;

		function escape( value ) {
			return value.replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" );
		}

		switch ( event.keyCode ) {
		case $.ui.keyCode.PAGE_UP:
			this.previousPage( event );
			break;
		case $.ui.keyCode.PAGE_DOWN:
			this.nextPage( event );
			break;
		case $.ui.keyCode.HOME:
			this._move( "first", "first", event );
			break;
		case $.ui.keyCode.END:
			this._move( "last", "last", event );
			break;
		case $.ui.keyCode.UP:
			this.previous( event );
			break;
		case $.ui.keyCode.DOWN:
			this.next( event );
			break;
		case $.ui.keyCode.LEFT:
			this.collapse( event );
			break;
		case $.ui.keyCode.RIGHT:
			if ( this.active && !this.active.is( ".ui-state-disabled" ) ) {
				this.expand( event );
			}
			break;
		case $.ui.keyCode.ENTER:
		case $.ui.keyCode.SPACE:
			this._activate( event );
			break;
		case $.ui.keyCode.ESCAPE:
			this.collapse( event );
			break;
		default:
			preventDefault = false;
			prev = this.previousFilter || "";
			character = String.fromCharCode( event.keyCode );
			skip = false;

			clearTimeout( this.filterTimer );

			if ( character === prev ) {
				skip = true;
			} else {
				character = prev + character;
			}

			regex = new RegExp( "^" + escape( character ), "i" );
			match = this.activeMenu.children( ".ui-menu-item" ).filter(function() {
				return regex.test( $( this ).children( "a" ).text() );
			});
			match = skip && match.index( this.active.next() ) !== -1 ?
				this.active.nextAll( ".ui-menu-item" ) :
				match;

			// If no matches on the current filter, reset to the last character pressed
			// to move down the menu to the first item that starts with that character
			if ( !match.length ) {
				character = String.fromCharCode( event.keyCode );
				regex = new RegExp( "^" + escape( character ), "i" );
				match = this.activeMenu.children( ".ui-menu-item" ).filter(function() {
					return regex.test( $( this ).children( "a" ).text() );
				});
			}

			if ( match.length ) {
				this.focus( event, match );
				if ( match.length > 1 ) {
					this.previousFilter = character;
					this.filterTimer = this._delay(function() {
						delete this.previousFilter;
					}, 1000 );
				} else {
					delete this.previousFilter;
				}
			} else {
				delete this.previousFilter;
			}
		}

		if ( preventDefault ) {
			event.preventDefault();
		}
	},

	_activate: function( event ) {
		if ( !this.active.is( ".ui-state-disabled" ) ) {
			if ( this.active.children( "a[aria-haspopup='true']" ).length ) {
				this.expand( event );
			} else {
				this.select( event );
			}
		}
	},

	refresh: function() {
		var menus,
			icon = this.options.icons.submenu,
			submenus = this.element.find( this.options.menus );

		// Initialize nested menus
		submenus.filter( ":not(.ui-menu)" )
			.addClass( "ui-menu ui-widget ui-widget-content ui-corner-all" )
			.hide()
			.attr({
				role: this.options.role,
				"aria-hidden": "true",
				"aria-expanded": "false"
			})
			.each(function() {
				var menu = $( this ),
					item = menu.prev( "a" ),
					submenuCarat = $( "<span>" )
						.addClass( "ui-menu-icon ui-icon " + icon )
						.data( "ui-menu-submenu-carat", true );

				item
					.attr( "aria-haspopup", "true" )
					.prepend( submenuCarat );
				menu.attr( "aria-labelledby", item.attr( "id" ) );
			});

		menus = submenus.add( this.element );

		// Don't refresh list items that are already adapted
		menus.children( ":not(.ui-menu-item):has(a)" )
			.addClass( "ui-menu-item" )
			.attr( "role", "presentation" )
			.children( "a" )
				.uniqueId()
				.addClass( "ui-corner-all" )
				.attr({
					tabIndex: -1,
					role: this._itemRole()
				});

		// Initialize unlinked menu-items containing spaces and/or dashes only as dividers
		menus.children( ":not(.ui-menu-item)" ).each(function() {
			var item = $( this );
			// hyphen, em dash, en dash
			if ( !/[^\-—–\s]/.test( item.text() ) ) {
				item.addClass( "ui-widget-content ui-menu-divider" );
			}
		});

		// Add aria-disabled attribute to any disabled menu item
		menus.children( ".ui-state-disabled" ).attr( "aria-disabled", "true" );

		// If the active item has been removed, blur the menu
		if ( this.active && !$.contains( this.element[ 0 ], this.active[ 0 ] ) ) {
			this.blur();
		}
	},

	_itemRole: function() {
		return {
			menu: "menuitem",
			listbox: "option"
		}[ this.options.role ];
	},

	focus: function( event, item ) {
		var nested, focused;
		this.blur( event, event && event.type === "focus" );

		this._scrollIntoView( item );

		this.active = item.first();
		focused = this.active.children( "a" ).addClass( "ui-state-focus" );
		// Only update aria-activedescendant if there's a role
		// otherwise we assume focus is managed elsewhere
		if ( this.options.role ) {
			this.element.attr( "aria-activedescendant", focused.attr( "id" ) );
		}

		// Highlight active parent menu item, if any
		this.active
			.parent()
			.closest( ".ui-menu-item" )
			.children( "a:first" )
			.addClass( "ui-state-active" );

		if ( event && event.type === "keydown" ) {
			this._close();
		} else {
			this.timer = this._delay(function() {
				this._close();
			}, this.delay );
		}

		nested = item.children( ".ui-menu" );
		if ( nested.length && ( /^mouse/.test( event.type ) ) ) {
			this._startOpening(nested);
		}
		this.activeMenu = item.parent();

		this._trigger( "focus", event, { item: item } );
	},

	_scrollIntoView: function( item ) {
		var borderTop, paddingTop, offset, scroll, elementHeight, itemHeight;
		if ( this._hasScroll() ) {
			borderTop = parseFloat( $.css( this.activeMenu[0], "borderTopWidth" ) ) || 0;
			paddingTop = parseFloat( $.css( this.activeMenu[0], "paddingTop" ) ) || 0;
			offset = item.offset().top - this.activeMenu.offset().top - borderTop - paddingTop;
			scroll = this.activeMenu.scrollTop();
			elementHeight = this.activeMenu.height();
			itemHeight = item.height();

			if ( offset < 0 ) {
				this.activeMenu.scrollTop( scroll + offset );
			} else if ( offset + itemHeight > elementHeight ) {
				this.activeMenu.scrollTop( scroll + offset - elementHeight + itemHeight );
			}
		}
	},

	blur: function( event, fromFocus ) {
		if ( !fromFocus ) {
			clearTimeout( this.timer );
		}

		if ( !this.active ) {
			return;
		}

		this.active.children( "a" ).removeClass( "ui-state-focus" );
		this.active = null;

		this._trigger( "blur", event, { item: this.active } );
	},

	_startOpening: function( submenu ) {
		clearTimeout( this.timer );

		// Don't open if already open fixes a Firefox bug that caused a .5 pixel
		// shift in the submenu position when mousing over the carat icon
		if ( submenu.attr( "aria-hidden" ) !== "true" ) {
			return;
		}

		this.timer = this._delay(function() {
			this._close();
			this._open( submenu );
		}, this.delay );
	},

	_open: function( submenu ) {
		var position = $.extend({
			of: this.active
		}, this.options.position );

		clearTimeout( this.timer );
		this.element.find( ".ui-menu" ).not( submenu.parents( ".ui-menu" ) )
			.hide()
			.attr( "aria-hidden", "true" );

		submenu
			.show()
			.removeAttr( "aria-hidden" )
			.attr( "aria-expanded", "true" )
			.position( position );
	},

	collapseAll: function( event, all ) {
		clearTimeout( this.timer );
		this.timer = this._delay(function() {
			// If we were passed an event, look for the submenu that contains the event
			var currentMenu = all ? this.element :
				$( event && event.target ).closest( this.element.find( ".ui-menu" ) );

			// If we found no valid submenu ancestor, use the main menu to close all sub menus anyway
			if ( !currentMenu.length ) {
				currentMenu = this.element;
			}

			this._close( currentMenu );

			this.blur( event );
			this.activeMenu = currentMenu;
		}, this.delay );
	},

	// With no arguments, closes the currently active menu - if nothing is active
	// it closes all menus.  If passed an argument, it will search for menus BELOW
	_close: function( startMenu ) {
		if ( !startMenu ) {
			startMenu = this.active ? this.active.parent() : this.element;
		}

		startMenu
			.find( ".ui-menu" )
				.hide()
				.attr( "aria-hidden", "true" )
				.attr( "aria-expanded", "false" )
			.end()
			.find( "a.ui-state-active" )
				.removeClass( "ui-state-active" );
	},

	collapse: function( event ) {
		var newItem = this.active &&
			this.active.parent().closest( ".ui-menu-item", this.element );
		if ( newItem && newItem.length ) {
			this._close();
			this.focus( event, newItem );
		}
	},

	expand: function( event ) {
		var newItem = this.active &&
			this.active
				.children( ".ui-menu " )
				.children( ".ui-menu-item" )
				.first();

		if ( newItem && newItem.length ) {
			this._open( newItem.parent() );

			// Delay so Firefox will not hide activedescendant change in expanding submenu from AT
			this._delay(function() {
				this.focus( event, newItem );
			});
		}
	},

	next: function( event ) {
		this._move( "next", "first", event );
	},

	previous: function( event ) {
		this._move( "prev", "last", event );
	},

	isFirstItem: function() {
		return this.active && !this.active.prevAll( ".ui-menu-item" ).length;
	},

	isLastItem: function() {
		return this.active && !this.active.nextAll( ".ui-menu-item" ).length;
	},

	_move: function( direction, filter, event ) {
		var next;
		if ( this.active ) {
			if ( direction === "first" || direction === "last" ) {
				next = this.active
					[ direction === "first" ? "prevAll" : "nextAll" ]( ".ui-menu-item" )
					.eq( -1 );
			} else {
				next = this.active
					[ direction + "All" ]( ".ui-menu-item" )
					.eq( 0 );
			}
		}
		if ( !next || !next.length || !this.active ) {
			next = this.activeMenu.children( ".ui-menu-item" )[ filter ]();
		}

		this.focus( event, next );
	},

	nextPage: function( event ) {
		var item, base, height;

		if ( !this.active ) {
			this.next( event );
			return;
		}
		if ( this.isLastItem() ) {
			return;
		}
		if ( this._hasScroll() ) {
			base = this.active.offset().top;
			height = this.element.height();
			this.active.nextAll( ".ui-menu-item" ).each(function() {
				item = $( this );
				return item.offset().top - base - height < 0;
			});

			this.focus( event, item );
		} else {
			this.focus( event, this.activeMenu.children( ".ui-menu-item" )
				[ !this.active ? "first" : "last" ]() );
		}
	},

	previousPage: function( event ) {
		var item, base, height;
		if ( !this.active ) {
			this.next( event );
			return;
		}
		if ( this.isFirstItem() ) {
			return;
		}
		if ( this._hasScroll() ) {
			base = this.active.offset().top;
			height = this.element.height();
			this.active.prevAll( ".ui-menu-item" ).each(function() {
				item = $( this );
				return item.offset().top - base + height > 0;
			});

			this.focus( event, item );
		} else {
			this.focus( event, this.activeMenu.children( ".ui-menu-item" ).first() );
		}
	},

	_hasScroll: function() {
		return this.element.outerHeight() < this.element.prop( "scrollHeight" );
	},

	select: function( event ) {
		// TODO: It should never be possible to not have an active item at this
		// point, but the tests don't trigger mouseenter before click.
		this.active = this.active || $( event.target ).closest( ".ui-menu-item" );
		var ui = { item: this.active };
		if ( !this.active.has( ".ui-menu" ).length ) {
			this.collapseAll( event, true );
		}
		this._trigger( "select", event, ui );
	}
});

}( jQuery ));
(function( $, undefined ) {

$.widget( "ui.progressbar", {
	version: "1.9.2",
	options: {
		value: 0,
		max: 100
	},

	min: 0,

	_create: function() {
		this.element
			.addClass( "ui-progressbar ui-widget ui-widget-content ui-corner-all" )
			.attr({
				role: "progressbar",
				"aria-valuemin": this.min,
				"aria-valuemax": this.options.max,
				"aria-valuenow": this._value()
			});

		this.valueDiv = $( "<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>" )
			.appendTo( this.element );

		this.oldValue = this._value();
		this._refreshValue();
	},

	_destroy: function() {
		this.element
			.removeClass( "ui-progressbar ui-widget ui-widget-content ui-corner-all" )
			.removeAttr( "role" )
			.removeAttr( "aria-valuemin" )
			.removeAttr( "aria-valuemax" )
			.removeAttr( "aria-valuenow" );

		this.valueDiv.remove();
	},

	value: function( newValue ) {
		if ( newValue === undefined ) {
			return this._value();
		}

		this._setOption( "value", newValue );
		return this;
	},

	_setOption: function( key, value ) {
		if ( key === "value" ) {
			this.options.value = value;
			this._refreshValue();
			if ( this._value() === this.options.max ) {
				this._trigger( "complete" );
			}
		}

		this._super( key, value );
	},

	_value: function() {
		var val = this.options.value;
		// normalize invalid value
		if ( typeof val !== "number" ) {
			val = 0;
		}
		return Math.min( this.options.max, Math.max( this.min, val ) );
	},

	_percentage: function() {
		return 100 * this._value() / this.options.max;
	},

	_refreshValue: function() {
		var value = this.value(),
			percentage = this._percentage();

		if ( this.oldValue !== value ) {
			this.oldValue = value;
			this._trigger( "change" );
		}

		this.valueDiv
			.toggle( value > this.min )
			.toggleClass( "ui-corner-right", value === this.options.max )
			.width( percentage.toFixed(0) + "%" );
		this.element.attr( "aria-valuenow", value );
	}
});

})( jQuery );
(function( $, undefined ) {

// number of pages in a slider
// (how many times can you page up/down to go through the whole range)
var numPages = 5;

$.widget( "ui.slider", $.ui.mouse, {
	version: "1.9.2",
	widgetEventPrefix: "slide",

	options: {
		animate: false,
		distance: 0,
		max: 100,
		min: 0,
		orientation: "horizontal",
		range: false,
		step: 1,
		value: 0,
		values: null
	},

	_create: function() {
		var i, handleCount,
			o = this.options,
			existingHandles = this.element.find( ".ui-slider-handle" ).addClass( "ui-state-default ui-corner-all" ),
			handle = "<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>",
			handles = [];

		this._keySliding = false;
		this._mouseSliding = false;
		this._animateOff = true;
		this._handleIndex = null;
		this._detectOrientation();
		this._mouseInit();

		this.element
			.addClass( "ui-slider" +
				" ui-slider-" + this.orientation +
				" ui-widget" +
				" ui-widget-content" +
				" ui-corner-all" +
				( o.disabled ? " ui-slider-disabled ui-disabled" : "" ) );

		this.range = $([]);

		if ( o.range ) {
			if ( o.range === true ) {
				if ( !o.values ) {
					o.values = [ this._valueMin(), this._valueMin() ];
				}
				if ( o.values.length && o.values.length !== 2 ) {
					o.values = [ o.values[0], o.values[0] ];
				}
			}

			this.range = $( "<div></div>" )
				.appendTo( this.element )
				.addClass( "ui-slider-range" +
				// note: this isn't the most fittingly semantic framework class for this element,
				// but worked best visually with a variety of themes
				" ui-widget-header" +
				( ( o.range === "min" || o.range === "max" ) ? " ui-slider-range-" + o.range : "" ) );
		}

		handleCount = ( o.values && o.values.length ) || 1;

		for ( i = existingHandles.length; i < handleCount; i++ ) {
			handles.push( handle );
		}

		this.handles = existingHandles.add( $( handles.join( "" ) ).appendTo( this.element ) );

		this.handle = this.handles.eq( 0 );

		this.handles.add( this.range ).filter( "a" )
			.click(function( event ) {
				event.preventDefault();
			})
			.mouseenter(function() {
				if ( !o.disabled ) {
					$( this ).addClass( "ui-state-hover" );
				}
			})
			.mouseleave(function() {
				$( this ).removeClass( "ui-state-hover" );
			})
			.focus(function() {
				if ( !o.disabled ) {
					$( ".ui-slider .ui-state-focus" ).removeClass( "ui-state-focus" );
					$( this ).addClass( "ui-state-focus" );
				} else {
					$( this ).blur();
				}
			})
			.blur(function() {
				$( this ).removeClass( "ui-state-focus" );
			});

		this.handles.each(function( i ) {
			$( this ).data( "ui-slider-handle-index", i );
		});

		this._on( this.handles, {
			keydown: function( event ) {
				var allowed, curVal, newVal, step,
					index = $( event.target ).data( "ui-slider-handle-index" );

				switch ( event.keyCode ) {
					case $.ui.keyCode.HOME:
					case $.ui.keyCode.END:
					case $.ui.keyCode.PAGE_UP:
					case $.ui.keyCode.PAGE_DOWN:
					case $.ui.keyCode.UP:
					case $.ui.keyCode.RIGHT:
					case $.ui.keyCode.DOWN:
					case $.ui.keyCode.LEFT:
						event.preventDefault();
						if ( !this._keySliding ) {
							this._keySliding = true;
							$( event.target ).addClass( "ui-state-active" );
							allowed = this._start( event, index );
							if ( allowed === false ) {
								return;
							}
						}
						break;
				}

				step = this.options.step;
				if ( this.options.values && this.options.values.length ) {
					curVal = newVal = this.values( index );
				} else {
					curVal = newVal = this.value();
				}

				switch ( event.keyCode ) {
					case $.ui.keyCode.HOME:
						newVal = this._valueMin();
						break;
					case $.ui.keyCode.END:
						newVal = this._valueMax();
						break;
					case $.ui.keyCode.PAGE_UP:
						newVal = this._trimAlignValue( curVal + ( (this._valueMax() - this._valueMin()) / numPages ) );
						break;
					case $.ui.keyCode.PAGE_DOWN:
						newVal = this._trimAlignValue( curVal - ( (this._valueMax() - this._valueMin()) / numPages ) );
						break;
					case $.ui.keyCode.UP:
					case $.ui.keyCode.RIGHT:
						if ( curVal === this._valueMax() ) {
							return;
						}
						newVal = this._trimAlignValue( curVal + step );
						break;
					case $.ui.keyCode.DOWN:
					case $.ui.keyCode.LEFT:
						if ( curVal === this._valueMin() ) {
							return;
						}
						newVal = this._trimAlignValue( curVal - step );
						break;
				}

				this._slide( event, index, newVal );
			},
			keyup: function( event ) {
				var index = $( event.target ).data( "ui-slider-handle-index" );

				if ( this._keySliding ) {
					this._keySliding = false;
					this._stop( event, index );
					this._change( event, index );
					$( event.target ).removeClass( "ui-state-active" );
				}
			}
		});

		this._refreshValue();

		this._animateOff = false;
	},

	_destroy: function() {
		this.handles.remove();
		this.range.remove();

		this.element
			.removeClass( "ui-slider" +
				" ui-slider-horizontal" +
				" ui-slider-vertical" +
				" ui-slider-disabled" +
				" ui-widget" +
				" ui-widget-content" +
				" ui-corner-all" );

		this._mouseDestroy();
	},

	_mouseCapture: function( event ) {
		var position, normValue, distance, closestHandle, index, allowed, offset, mouseOverHandle,
			that = this,
			o = this.options;

		if ( o.disabled ) {
			return false;
		}

		this.elementSize = {
			width: this.element.outerWidth(),
			height: this.element.outerHeight()
		};
		this.elementOffset = this.element.offset();

		position = { x: event.pageX, y: event.pageY };
		normValue = this._normValueFromMouse( position );
		distance = this._valueMax() - this._valueMin() + 1;
		this.handles.each(function( i ) {
			var thisDistance = Math.abs( normValue - that.values(i) );
			if ( distance > thisDistance ) {
				distance = thisDistance;
				closestHandle = $( this );
				index = i;
			}
		});

		// workaround for bug #3736 (if both handles of a range are at 0,
		// the first is always used as the one with least distance,
		// and moving it is obviously prevented by preventing negative ranges)
		if( o.range === true && this.values(1) === o.min ) {
			index += 1;
			closestHandle = $( this.handles[index] );
		}

		allowed = this._start( event, index );
		if ( allowed === false ) {
			return false;
		}
		this._mouseSliding = true;

		this._handleIndex = index;

		closestHandle
			.addClass( "ui-state-active" )
			.focus();

		offset = closestHandle.offset();
		mouseOverHandle = !$( event.target ).parents().andSelf().is( ".ui-slider-handle" );
		this._clickOffset = mouseOverHandle ? { left: 0, top: 0 } : {
			left: event.pageX - offset.left - ( closestHandle.width() / 2 ),
			top: event.pageY - offset.top -
				( closestHandle.height() / 2 ) -
				( parseInt( closestHandle.css("borderTopWidth"), 10 ) || 0 ) -
				( parseInt( closestHandle.css("borderBottomWidth"), 10 ) || 0) +
				( parseInt( closestHandle.css("marginTop"), 10 ) || 0)
		};

		if ( !this.handles.hasClass( "ui-state-hover" ) ) {
			this._slide( event, index, normValue );
		}
		this._animateOff = true;
		return true;
	},

	_mouseStart: function() {
		return true;
	},

	_mouseDrag: function( event ) {
		var position = { x: event.pageX, y: event.pageY },
			normValue = this._normValueFromMouse( position );

		this._slide( event, this._handleIndex, normValue );

		return false;
	},

	_mouseStop: function( event ) {
		this.handles.removeClass( "ui-state-active" );
		this._mouseSliding = false;

		this._stop( event, this._handleIndex );
		this._change( event, this._handleIndex );

		this._handleIndex = null;
		this._clickOffset = null;
		this._animateOff = false;

		return false;
	},

	_detectOrientation: function() {
		this.orientation = ( this.options.orientation === "vertical" ) ? "vertical" : "horizontal";
	},

	_normValueFromMouse: function( position ) {
		var pixelTotal,
			pixelMouse,
			percentMouse,
			valueTotal,
			valueMouse;

		if ( this.orientation === "horizontal" ) {
			pixelTotal = this.elementSize.width;
			pixelMouse = position.x - this.elementOffset.left - ( this._clickOffset ? this._clickOffset.left : 0 );
		} else {
			pixelTotal = this.elementSize.height;
			pixelMouse = position.y - this.elementOffset.top - ( this._clickOffset ? this._clickOffset.top : 0 );
		}

		percentMouse = ( pixelMouse / pixelTotal );
		if ( percentMouse > 1 ) {
			percentMouse = 1;
		}
		if ( percentMouse < 0 ) {
			percentMouse = 0;
		}
		if ( this.orientation === "vertical" ) {
			percentMouse = 1 - percentMouse;
		}

		valueTotal = this._valueMax() - this._valueMin();
		valueMouse = this._valueMin() + percentMouse * valueTotal;

		return this._trimAlignValue( valueMouse );
	},

	_start: function( event, index ) {
		var uiHash = {
			handle: this.handles[ index ],
			value: this.value()
		};
		if ( this.options.values && this.options.values.length ) {
			uiHash.value = this.values( index );
			uiHash.values = this.values();
		}
		return this._trigger( "start", event, uiHash );
	},

	_slide: function( event, index, newVal ) {
		var otherVal,
			newValues,
			allowed;

		if ( this.options.values && this.options.values.length ) {
			otherVal = this.values( index ? 0 : 1 );

			if ( ( this.options.values.length === 2 && this.options.range === true ) &&
					( ( index === 0 && newVal > otherVal) || ( index === 1 && newVal < otherVal ) )
				) {
				newVal = otherVal;
			}

			if ( newVal !== this.values( index ) ) {
				newValues = this.values();
				newValues[ index ] = newVal;
				// A slide can be canceled by returning false from the slide callback
				allowed = this._trigger( "slide", event, {
					handle: this.handles[ index ],
					value: newVal,
					values: newValues
				} );
				otherVal = this.values( index ? 0 : 1 );
				if ( allowed !== false ) {
					this.values( index, newVal, true );
				}
			}
		} else {
			if ( newVal !== this.value() ) {
				// A slide can be canceled by returning false from the slide callback
				allowed = this._trigger( "slide", event, {
					handle: this.handles[ index ],
					value: newVal
				} );
				if ( allowed !== false ) {
					this.value( newVal );
				}
			}
		}
	},

	_stop: function( event, index ) {
		var uiHash = {
			handle: this.handles[ index ],
			value: this.value()
		};
		if ( this.options.values && this.options.values.length ) {
			uiHash.value = this.values( index );
			uiHash.values = this.values();
		}

		this._trigger( "stop", event, uiHash );
	},

	_change: function( event, index ) {
		if ( !this._keySliding && !this._mouseSliding ) {
			var uiHash = {
				handle: this.handles[ index ],
				value: this.value()
			};
			if ( this.options.values && this.options.values.length ) {
				uiHash.value = this.values( index );
				uiHash.values = this.values();
			}

			this._trigger( "change", event, uiHash );
		}
	},

	value: function( newValue ) {
		if ( arguments.length ) {
			this.options.value = this._trimAlignValue( newValue );
			this._refreshValue();
			this._change( null, 0 );
			return;
		}

		return this._value();
	},

	values: function( index, newValue ) {
		var vals,
			newValues,
			i;

		if ( arguments.length > 1 ) {
			this.options.values[ index ] = this._trimAlignValue( newValue );
			this._refreshValue();
			this._change( null, index );
			return;
		}

		if ( arguments.length ) {
			if ( $.isArray( arguments[ 0 ] ) ) {
				vals = this.options.values;
				newValues = arguments[ 0 ];
				for ( i = 0; i < vals.length; i += 1 ) {
					vals[ i ] = this._trimAlignValue( newValues[ i ] );
					this._change( null, i );
				}
				this._refreshValue();
			} else {
				if ( this.options.values && this.options.values.length ) {
					return this._values( index );
				} else {
					return this.value();
				}
			}
		} else {
			return this._values();
		}
	},

	_setOption: function( key, value ) {
		var i,
			valsLength = 0;

		if ( $.isArray( this.options.values ) ) {
			valsLength = this.options.values.length;
		}

		$.Widget.prototype._setOption.apply( this, arguments );

		switch ( key ) {
			case "disabled":
				if ( value ) {
					this.handles.filter( ".ui-state-focus" ).blur();
					this.handles.removeClass( "ui-state-hover" );
					this.handles.prop( "disabled", true );
					this.element.addClass( "ui-disabled" );
				} else {
					this.handles.prop( "disabled", false );
					this.element.removeClass( "ui-disabled" );
				}
				break;
			case "orientation":
				this._detectOrientation();
				this.element
					.removeClass( "ui-slider-horizontal ui-slider-vertical" )
					.addClass( "ui-slider-" + this.orientation );
				this._refreshValue();
				break;
			case "value":
				this._animateOff = true;
				this._refreshValue();
				this._change( null, 0 );
				this._animateOff = false;
				break;
			case "values":
				this._animateOff = true;
				this._refreshValue();
				for ( i = 0; i < valsLength; i += 1 ) {
					this._change( null, i );
				}
				this._animateOff = false;
				break;
			case "min":
			case "max":
				this._animateOff = true;
				this._refreshValue();
				this._animateOff = false;
				break;
		}
	},

	//internal value getter
	// _value() returns value trimmed by min and max, aligned by step
	_value: function() {
		var val = this.options.value;
		val = this._trimAlignValue( val );

		return val;
	},

	//internal values getter
	// _values() returns array of values trimmed by min and max, aligned by step
	// _values( index ) returns single value trimmed by min and max, aligned by step
	_values: function( index ) {
		var val,
			vals,
			i;

		if ( arguments.length ) {
			val = this.options.values[ index ];
			val = this._trimAlignValue( val );

			return val;
		} else {
			// .slice() creates a copy of the array
			// this copy gets trimmed by min and max and then returned
			vals = this.options.values.slice();
			for ( i = 0; i < vals.length; i+= 1) {
				vals[ i ] = this._trimAlignValue( vals[ i ] );
			}

			return vals;
		}
	},

	// returns the step-aligned value that val is closest to, between (inclusive) min and max
	_trimAlignValue: function( val ) {
		if ( val <= this._valueMin() ) {
			return this._valueMin();
		}
		if ( val >= this._valueMax() ) {
			return this._valueMax();
		}
		var step = ( this.options.step > 0 ) ? this.options.step : 1,
			valModStep = (val - this._valueMin()) % step,
			alignValue = val - valModStep;

		if ( Math.abs(valModStep) * 2 >= step ) {
			alignValue += ( valModStep > 0 ) ? step : ( -step );
		}

		// Since JavaScript has problems with large floats, round
		// the final value to 5 digits after the decimal point (see #4124)
		return parseFloat( alignValue.toFixed(5) );
	},

	_valueMin: function() {
		return this.options.min;
	},

	_valueMax: function() {
		return this.options.max;
	},

	_refreshValue: function() {
		var lastValPercent, valPercent, value, valueMin, valueMax,
			oRange = this.options.range,
			o = this.options,
			that = this,
			animate = ( !this._animateOff ) ? o.animate : false,
			_set = {};

		if ( this.options.values && this.options.values.length ) {
			this.handles.each(function( i ) {
				valPercent = ( that.values(i) - that._valueMin() ) / ( that._valueMax() - that._valueMin() ) * 100;
				_set[ that.orientation === "horizontal" ? "left" : "bottom" ] = valPercent + "%";
				$( this ).stop( 1, 1 )[ animate ? "animate" : "css" ]( _set, o.animate );
				if ( that.options.range === true ) {
					if ( that.orientation === "horizontal" ) {
						if ( i === 0 ) {
							that.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( { left: valPercent + "%" }, o.animate );
						}
						if ( i === 1 ) {
							that.range[ animate ? "animate" : "css" ]( { width: ( valPercent - lastValPercent ) + "%" }, { queue: false, duration: o.animate } );
						}
					} else {
						if ( i === 0 ) {
							that.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( { bottom: ( valPercent ) + "%" }, o.animate );
						}
						if ( i === 1 ) {
							that.range[ animate ? "animate" : "css" ]( { height: ( valPercent - lastValPercent ) + "%" }, { queue: false, duration: o.animate } );
						}
					}
				}
				lastValPercent = valPercent;
			});
		} else {
			value = this.value();
			valueMin = this._valueMin();
			valueMax = this._valueMax();
			valPercent = ( valueMax !== valueMin ) ?
					( value - valueMin ) / ( valueMax - valueMin ) * 100 :
					0;
			_set[ this.orientation === "horizontal" ? "left" : "bottom" ] = valPercent + "%";
			this.handle.stop( 1, 1 )[ animate ? "animate" : "css" ]( _set, o.animate );

			if ( oRange === "min" && this.orientation === "horizontal" ) {
				this.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( { width: valPercent + "%" }, o.animate );
			}
			if ( oRange === "max" && this.orientation === "horizontal" ) {
				this.range[ animate ? "animate" : "css" ]( { width: ( 100 - valPercent ) + "%" }, { queue: false, duration: o.animate } );
			}
			if ( oRange === "min" && this.orientation === "vertical" ) {
				this.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( { height: valPercent + "%" }, o.animate );
			}
			if ( oRange === "max" && this.orientation === "vertical" ) {
				this.range[ animate ? "animate" : "css" ]( { height: ( 100 - valPercent ) + "%" }, { queue: false, duration: o.animate } );
			}
		}
	}

});

}(jQuery));
(function( $ ) {

function modifier( fn ) {
	return function() {
		var previous = this.element.val();
		fn.apply( this, arguments );
		this._refresh();
		if ( previous !== this.element.val() ) {
			this._trigger( "change" );
		}
	};
}

$.widget( "ui.spinner", {
	version: "1.9.2",
	defaultElement: "<input>",
	widgetEventPrefix: "spin",
	options: {
		culture: null,
		icons: {
			down: "ui-icon-triangle-1-s",
			up: "ui-icon-triangle-1-n"
		},
		incremental: true,
		max: null,
		min: null,
		numberFormat: null,
		page: 10,
		step: 1,

		change: null,
		spin: null,
		start: null,
		stop: null
	},

	_create: function() {
		// handle string values that need to be parsed
		this._setOption( "max", this.options.max );
		this._setOption( "min", this.options.min );
		this._setOption( "step", this.options.step );

		// format the value, but don't constrain
		this._value( this.element.val(), true );

		this._draw();
		this._on( this._events );
		this._refresh();

		// turning off autocomplete prevents the browser from remembering the
		// value when navigating through history, so we re-enable autocomplete
		// if the page is unloaded before the widget is destroyed. #7790
		this._on( this.window, {
			beforeunload: function() {
				this.element.removeAttr( "autocomplete" );
			}
		});
	},

	_getCreateOptions: function() {
		var options = {},
			element = this.element;

		$.each( [ "min", "max", "step" ], function( i, option ) {
			var value = element.attr( option );
			if ( value !== undefined && value.length ) {
				options[ option ] = value;
			}
		});

		return options;
	},

	_events: {
		keydown: function( event ) {
			if ( this._start( event ) && this._keydown( event ) ) {
				event.preventDefault();
			}
		},
		keyup: "_stop",
		focus: function() {
			this.previous = this.element.val();
		},
		blur: function( event ) {
			if ( this.cancelBlur ) {
				delete this.cancelBlur;
				return;
			}

			this._refresh();
			if ( this.previous !== this.element.val() ) {
				this._trigger( "change", event );
			}
		},
		mousewheel: function( event, delta ) {
			if ( !delta ) {
				return;
			}
			if ( !this.spinning && !this._start( event ) ) {
				return false;
			}

			this._spin( (delta > 0 ? 1 : -1) * this.options.step, event );
			clearTimeout( this.mousewheelTimer );
			this.mousewheelTimer = this._delay(function() {
				if ( this.spinning ) {
					this._stop( event );
				}
			}, 100 );
			event.preventDefault();
		},
		"mousedown .ui-spinner-button": function( event ) {
			var previous;

			// We never want the buttons to have focus; whenever the user is
			// interacting with the spinner, the focus should be on the input.
			// If the input is focused then this.previous is properly set from
			// when the input first received focus. If the input is not focused
			// then we need to set this.previous based on the value before spinning.
			previous = this.element[0] === this.document[0].activeElement ?
				this.previous : this.element.val();
			function checkFocus() {
				var isActive = this.element[0] === this.document[0].activeElement;
				if ( !isActive ) {
					this.element.focus();
					this.previous = previous;
					// support: IE
					// IE sets focus asynchronously, so we need to check if focus
					// moved off of the input because the user clicked on the button.
					this._delay(function() {
						this.previous = previous;
					});
				}
			}

			// ensure focus is on (or stays on) the text field
			event.preventDefault();
			checkFocus.call( this );

			// support: IE
			// IE doesn't prevent moving focus even with event.preventDefault()
			// so we set a flag to know when we should ignore the blur event
			// and check (again) if focus moved off of the input.
			this.cancelBlur = true;
			this._delay(function() {
				delete this.cancelBlur;
				checkFocus.call( this );
			});

			if ( this._start( event ) === false ) {
				return;
			}

			this._repeat( null, $( event.currentTarget ).hasClass( "ui-spinner-up" ) ? 1 : -1, event );
		},
		"mouseup .ui-spinner-button": "_stop",
		"mouseenter .ui-spinner-button": function( event ) {
			// button will add ui-state-active if mouse was down while mouseleave and kept down
			if ( !$( event.currentTarget ).hasClass( "ui-state-active" ) ) {
				return;
			}

			if ( this._start( event ) === false ) {
				return false;
			}
			this._repeat( null, $( event.currentTarget ).hasClass( "ui-spinner-up" ) ? 1 : -1, event );
		},
		// TODO: do we really want to consider this a stop?
		// shouldn't we just stop the repeater and wait until mouseup before
		// we trigger the stop event?
		"mouseleave .ui-spinner-button": "_stop"
	},

	_draw: function() {
		var uiSpinner = this.uiSpinner = this.element
			.addClass( "ui-spinner-input" )
			.attr( "autocomplete", "off" )
			.wrap( this._uiSpinnerHtml() )
			.parent()
				// add buttons
				.append( this._buttonHtml() );

		this.element.attr( "role", "spinbutton" );

		// button bindings
		this.buttons = uiSpinner.find( ".ui-spinner-button" )
			.attr( "tabIndex", -1 )
			.button()
			.removeClass( "ui-corner-all" );

		// IE 6 doesn't understand height: 50% for the buttons
		// unless the wrapper has an explicit height
		if ( this.buttons.height() > Math.ceil( uiSpinner.height() * 0.5 ) &&
				uiSpinner.height() > 0 ) {
			uiSpinner.height( uiSpinner.height() );
		}

		// disable spinner if element was already disabled
		if ( this.options.disabled ) {
			this.disable();
		}
	},

	_keydown: function( event ) {
		var options = this.options,
			keyCode = $.ui.keyCode;

		switch ( event.keyCode ) {
		case keyCode.UP:
			this._repeat( null, 1, event );
			return true;
		case keyCode.DOWN:
			this._repeat( null, -1, event );
			return true;
		case keyCode.PAGE_UP:
			this._repeat( null, options.page, event );
			return true;
		case keyCode.PAGE_DOWN:
			this._repeat( null, -options.page, event );
			return true;
		}

		return false;
	},

	_uiSpinnerHtml: function() {
		return "<span class='ui-spinner ui-widget ui-widget-content ui-corner-all'></span>";
	},

	_buttonHtml: function() {
		return "" +
			"<a class='ui-spinner-button ui-spinner-up ui-corner-tr'>" +
				"<span class='ui-icon " + this.options.icons.up + "'>&#9650;</span>" +
			"</a>" +
			"<a class='ui-spinner-button ui-spinner-down ui-corner-br'>" +
				"<span class='ui-icon " + this.options.icons.down + "'>&#9660;</span>" +
			"</a>";
	},

	_start: function( event ) {
		if ( !this.spinning && this._trigger( "start", event ) === false ) {
			return false;
		}

		if ( !this.counter ) {
			this.counter = 1;
		}
		this.spinning = true;
		return true;
	},

	_repeat: function( i, steps, event ) {
		i = i || 500;

		clearTimeout( this.timer );
		this.timer = this._delay(function() {
			this._repeat( 40, steps, event );
		}, i );

		this._spin( steps * this.options.step, event );
	},

	_spin: function( step, event ) {
		var value = this.value() || 0;

		if ( !this.counter ) {
			this.counter = 1;
		}

		value = this._adjustValue( value + step * this._increment( this.counter ) );

		if ( !this.spinning || this._trigger( "spin", event, { value: value } ) !== false) {
			this._value( value );
			this.counter++;
		}
	},

	_increment: function( i ) {
		var incremental = this.options.incremental;

		if ( incremental ) {
			return $.isFunction( incremental ) ?
				incremental( i ) :
				Math.floor( i*i*i/50000 - i*i/500 + 17*i/200 + 1 );
		}

		return 1;
	},

	_precision: function() {
		var precision = this._precisionOf( this.options.step );
		if ( this.options.min !== null ) {
			precision = Math.max( precision, this._precisionOf( this.options.min ) );
		}
		return precision;
	},

	_precisionOf: function( num ) {
		var str = num.toString(),
			decimal = str.indexOf( "." );
		return decimal === -1 ? 0 : str.length - decimal - 1;
	},

	_adjustValue: function( value ) {
		var base, aboveMin,
			options = this.options;

		// make sure we're at a valid step
		// - find out where we are relative to the base (min or 0)
		base = options.min !== null ? options.min : 0;
		aboveMin = value - base;
		// - round to the nearest step
		aboveMin = Math.round(aboveMin / options.step) * options.step;
		// - rounding is based on 0, so adjust back to our base
		value = base + aboveMin;

		// fix precision from bad JS floating point math
		value = parseFloat( value.toFixed( this._precision() ) );

		// clamp the value
		if ( options.max !== null && value > options.max) {
			return options.max;
		}
		if ( options.min !== null && value < options.min ) {
			return options.min;
		}

		return value;
	},

	_stop: function( event ) {
		if ( !this.spinning ) {
			return;
		}

		clearTimeout( this.timer );
		clearTimeout( this.mousewheelTimer );
		this.counter = 0;
		this.spinning = false;
		this._trigger( "stop", event );
	},

	_setOption: function( key, value ) {
		if ( key === "culture" || key === "numberFormat" ) {
			var prevValue = this._parse( this.element.val() );
			this.options[ key ] = value;
			this.element.val( this._format( prevValue ) );
			return;
		}

		if ( key === "max" || key === "min" || key === "step" ) {
			if ( typeof value === "string" ) {
				value = this._parse( value );
			}
		}

		this._super( key, value );

		if ( key === "disabled" ) {
			if ( value ) {
				this.element.prop( "disabled", true );
				this.buttons.button( "disable" );
			} else {
				this.element.prop( "disabled", false );
				this.buttons.button( "enable" );
			}
		}
	},

	_setOptions: modifier(function( options ) {
		this._super( options );
		this._value( this.element.val() );
	}),

	_parse: function( val ) {
		if ( typeof val === "string" && val !== "" ) {
			val = window.Globalize && this.options.numberFormat ?
				Globalize.parseFloat( val, 10, this.options.culture ) : +val;
		}
		return val === "" || isNaN( val ) ? null : val;
	},

	_format: function( value ) {
		if ( value === "" ) {
			return "";
		}
		return window.Globalize && this.options.numberFormat ?
			Globalize.format( value, this.options.numberFormat, this.options.culture ) :
			value;
	},

	_refresh: function() {
		this.element.attr({
			"aria-valuemin": this.options.min,
			"aria-valuemax": this.options.max,
			// TODO: what should we do with values that can't be parsed?
			"aria-valuenow": this._parse( this.element.val() )
		});
	},

	// update the value without triggering change
	_value: function( value, allowAny ) {
		var parsed;
		if ( value !== "" ) {
			parsed = this._parse( value );
			if ( parsed !== null ) {
				if ( !allowAny ) {
					parsed = this._adjustValue( parsed );
				}
				value = this._format( parsed );
			}
		}
		this.element.val( value );
		this._refresh();
	},

	_destroy: function() {
		this.element
			.removeClass( "ui-spinner-input" )
			.prop( "disabled", false )
			.removeAttr( "autocomplete" )
			.removeAttr( "role" )
			.removeAttr( "aria-valuemin" )
			.removeAttr( "aria-valuemax" )
			.removeAttr( "aria-valuenow" );
		this.uiSpinner.replaceWith( this.element );
	},

	stepUp: modifier(function( steps ) {
		this._stepUp( steps );
	}),
	_stepUp: function( steps ) {
		this._spin( (steps || 1) * this.options.step );
	},

	stepDown: modifier(function( steps ) {
		this._stepDown( steps );
	}),
	_stepDown: function( steps ) {
		this._spin( (steps || 1) * -this.options.step );
	},

	pageUp: modifier(function( pages ) {
		this._stepUp( (pages || 1) * this.options.page );
	}),

	pageDown: modifier(function( pages ) {
		this._stepDown( (pages || 1) * this.options.page );
	}),

	value: function( newVal ) {
		if ( !arguments.length ) {
			return this._parse( this.element.val() );
		}
		modifier( this._value ).call( this, newVal );
	},

	widget: function() {
		return this.uiSpinner;
	}
});

}( jQuery ) );
(function( $, undefined ) {

var tabId = 0,
	rhash = /#.*$/;

function getNextTabId() {
	return ++tabId;
}

function isLocal( anchor ) {
	return anchor.hash.length > 1 &&
		anchor.href.replace( rhash, "" ) ===
			location.href.replace( rhash, "" )
				// support: Safari 5.1
				// Safari 5.1 doesn't encode spaces in window.location
				// but it does encode spaces from anchors (#8777)
				.replace( /\s/g, "%20" );
}

$.widget( "ui.tabs", {
	version: "1.9.2",
	delay: 300,
	options: {
		active: null,
		collapsible: false,
		event: "click",
		heightStyle: "content",
		hide: null,
		show: null,

		// callbacks
		activate: null,
		beforeActivate: null,
		beforeLoad: null,
		load: null
	},

	_create: function() {
		var that = this,
			options = this.options,
			active = options.active,
			locationHash = location.hash.substring( 1 );

		this.running = false;

		this.element
			.addClass( "ui-tabs ui-widget ui-widget-content ui-corner-all" )
			.toggleClass( "ui-tabs-collapsible", options.collapsible )
			// Prevent users from focusing disabled tabs via click
			.delegate( ".ui-tabs-nav > li", "mousedown" + this.eventNamespace, function( event ) {
				if ( $( this ).is( ".ui-state-disabled" ) ) {
					event.preventDefault();
				}
			})
			// support: IE <9
			// Preventing the default action in mousedown doesn't prevent IE
			// from focusing the element, so if the anchor gets focused, blur.
			// We don't have to worry about focusing the previously focused
			// element since clicking on a non-focusable element should focus
			// the body anyway.
			.delegate( ".ui-tabs-anchor", "focus" + this.eventNamespace, function() {
				if ( $( this ).closest( "li" ).is( ".ui-state-disabled" ) ) {
					this.blur();
				}
			});

		this._processTabs();

		if ( active === null ) {
			// check the fragment identifier in the URL
			if ( locationHash ) {
				this.tabs.each(function( i, tab ) {
					if ( $( tab ).attr( "aria-controls" ) === locationHash ) {
						active = i;
						return false;
					}
				});
			}

			// check for a tab marked active via a class
			if ( active === null ) {
				active = this.tabs.index( this.tabs.filter( ".ui-tabs-active" ) );
			}

			// no active tab, set to false
			if ( active === null || active === -1 ) {
				active = this.tabs.length ? 0 : false;
			}
		}

		// handle numbers: negative, out of range
		if ( active !== false ) {
			active = this.tabs.index( this.tabs.eq( active ) );
			if ( active === -1 ) {
				active = options.collapsible ? false : 0;
			}
		}
		options.active = active;

		// don't allow collapsible: false and active: false
		if ( !options.collapsible && options.active === false && this.anchors.length ) {
			options.active = 0;
		}

		// Take disabling tabs via class attribute from HTML
		// into account and update option properly.
		if ( $.isArray( options.disabled ) ) {
			options.disabled = $.unique( options.disabled.concat(
				$.map( this.tabs.filter( ".ui-state-disabled" ), function( li ) {
					return that.tabs.index( li );
				})
			) ).sort();
		}

		// check for length avoids error when initializing empty list
		if ( this.options.active !== false && this.anchors.length ) {
			this.active = this._findActive( this.options.active );
		} else {
			this.active = $();
		}

		this._refresh();

		if ( this.active.length ) {
			this.load( options.active );
		}
	},

	_getCreateEventData: function() {
		return {
			tab: this.active,
			panel: !this.active.length ? $() : this._getPanelForTab( this.active )
		};
	},

	_tabKeydown: function( event ) {
		var focusedTab = $( this.document[0].activeElement ).closest( "li" ),
			selectedIndex = this.tabs.index( focusedTab ),
			goingForward = true;

		if ( this._handlePageNav( event ) ) {
			return;
		}

		switch ( event.keyCode ) {
			case $.ui.keyCode.RIGHT:
			case $.ui.keyCode.DOWN:
				selectedIndex++;
				break;
			case $.ui.keyCode.UP:
			case $.ui.keyCode.LEFT:
				goingForward = false;
				selectedIndex--;
				break;
			case $.ui.keyCode.END:
				selectedIndex = this.anchors.length - 1;
				break;
			case $.ui.keyCode.HOME:
				selectedIndex = 0;
				break;
			case $.ui.keyCode.SPACE:
				// Activate only, no collapsing
				event.preventDefault();
				clearTimeout( this.activating );
				this._activate( selectedIndex );
				return;
			case $.ui.keyCode.ENTER:
				// Toggle (cancel delayed activation, allow collapsing)
				event.preventDefault();
				clearTimeout( this.activating );
				// Determine if we should collapse or activate
				this._activate( selectedIndex === this.options.active ? false : selectedIndex );
				return;
			default:
				return;
		}

		// Focus the appropriate tab, based on which key was pressed
		event.preventDefault();
		clearTimeout( this.activating );
		selectedIndex = this._focusNextTab( selectedIndex, goingForward );

		// Navigating with control key will prevent automatic activation
		if ( !event.ctrlKey ) {
			// Update aria-selected immediately so that AT think the tab is already selected.
			// Otherwise AT may confuse the user by stating that they need to activate the tab,
			// but the tab will already be activated by the time the announcement finishes.
			focusedTab.attr( "aria-selected", "false" );
			this.tabs.eq( selectedIndex ).attr( "aria-selected", "true" );

			this.activating = this._delay(function() {
				this.option( "active", selectedIndex );
			}, this.delay );
		}
	},

	_panelKeydown: function( event ) {
		if ( this._handlePageNav( event ) ) {
			return;
		}

		// Ctrl+up moves focus to the current tab
		if ( event.ctrlKey && event.keyCode === $.ui.keyCode.UP ) {
			event.preventDefault();
			this.active.focus();
		}
	},

	// Alt+page up/down moves focus to the previous/next tab (and activates)
	_handlePageNav: function( event ) {
		if ( event.altKey && event.keyCode === $.ui.keyCode.PAGE_UP ) {
			this._activate( this._focusNextTab( this.options.active - 1, false ) );
			return true;
		}
		if ( event.altKey && event.keyCode === $.ui.keyCode.PAGE_DOWN ) {
			this._activate( this._focusNextTab( this.options.active + 1, true ) );
			return true;
		}
	},

	_findNextTab: function( index, goingForward ) {
		var lastTabIndex = this.tabs.length - 1;

		function constrain() {
			if ( index > lastTabIndex ) {
				index = 0;
			}
			if ( index < 0 ) {
				index = lastTabIndex;
			}
			return index;
		}

		while ( $.inArray( constrain(), this.options.disabled ) !== -1 ) {
			index = goingForward ? index + 1 : index - 1;
		}

		return index;
	},

	_focusNextTab: function( index, goingForward ) {
		index = this._findNextTab( index, goingForward );
		this.tabs.eq( index ).focus();
		return index;
	},

	_setOption: function( key, value ) {
		if ( key === "active" ) {
			// _activate() will handle invalid values and update this.options
			this._activate( value );
			return;
		}

		if ( key === "disabled" ) {
			// don't use the widget factory's disabled handling
			this._setupDisabled( value );
			return;
		}

		this._super( key, value);

		if ( key === "collapsible" ) {
			this.element.toggleClass( "ui-tabs-collapsible", value );
			// Setting collapsible: false while collapsed; open first panel
			if ( !value && this.options.active === false ) {
				this._activate( 0 );
			}
		}

		if ( key === "event" ) {
			this._setupEvents( value );
		}

		if ( key === "heightStyle" ) {
			this._setupHeightStyle( value );
		}
	},

	_tabId: function( tab ) {
		return tab.attr( "aria-controls" ) || "ui-tabs-" + getNextTabId();
	},

	_sanitizeSelector: function( hash ) {
		return hash ? hash.replace( /[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g, "\\$&" ) : "";
	},

	refresh: function() {
		var options = this.options,
			lis = this.tablist.children( ":has(a[href])" );

		// get disabled tabs from class attribute from HTML
		// this will get converted to a boolean if needed in _refresh()
		options.disabled = $.map( lis.filter( ".ui-state-disabled" ), function( tab ) {
			return lis.index( tab );
		});

		this._processTabs();

		// was collapsed or no tabs
		if ( options.active === false || !this.anchors.length ) {
			options.active = false;
			this.active = $();
		// was active, but active tab is gone
		} else if ( this.active.length && !$.contains( this.tablist[ 0 ], this.active[ 0 ] ) ) {
			// all remaining tabs are disabled
			if ( this.tabs.length === options.disabled.length ) {
				options.active = false;
				this.active = $();
			// activate previous tab
			} else {
				this._activate( this._findNextTab( Math.max( 0, options.active - 1 ), false ) );
			}
		// was active, active tab still exists
		} else {
			// make sure active index is correct
			options.active = this.tabs.index( this.active );
		}

		this._refresh();
	},

	_refresh: function() {
		this._setupDisabled( this.options.disabled );
		this._setupEvents( this.options.event );
		this._setupHeightStyle( this.options.heightStyle );

		this.tabs.not( this.active ).attr({
			"aria-selected": "false",
			tabIndex: -1
		});
		this.panels.not( this._getPanelForTab( this.active ) )
			.hide()
			.attr({
				"aria-expanded": "false",
				"aria-hidden": "true"
			});

		// Make sure one tab is in the tab order
		if ( !this.active.length ) {
			this.tabs.eq( 0 ).attr( "tabIndex", 0 );
		} else {
			this.active
				.addClass( "ui-tabs-active ui-state-active" )
				.attr({
					"aria-selected": "true",
					tabIndex: 0
				});
			this._getPanelForTab( this.active )
				.show()
				.attr({
					"aria-expanded": "true",
					"aria-hidden": "false"
				});
		}
	},

	_processTabs: function() {
		var that = this;

		this.tablist = this._getList()
			.addClass( "ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" )
			.attr( "role", "tablist" );

		this.tabs = this.tablist.find( "> li:has(a[href])" )
			.addClass( "ui-state-default ui-corner-top" )
			.attr({
				role: "tab",
				tabIndex: -1
			});

		this.anchors = this.tabs.map(function() {
				return $( "a", this )[ 0 ];
			})
			.addClass( "ui-tabs-anchor" )
			.attr({
				role: "presentation",
				tabIndex: -1
			});

		this.panels = $();

		this.anchors.each(function( i, anchor ) {
			var selector, panel, panelId,
				anchorId = $( anchor ).uniqueId().attr( "id" ),
				tab = $( anchor ).closest( "li" ),
				originalAriaControls = tab.attr( "aria-controls" );

			// inline tab
			if ( isLocal( anchor ) ) {
				selector = anchor.hash;
				panel = that.element.find( that._sanitizeSelector( selector ) );
			// remote tab
			} else {
				panelId = that._tabId( tab );
				selector = "#" + panelId;
				panel = that.element.find( selector );
				if ( !panel.length ) {
					panel = that._createPanel( panelId );
					panel.insertAfter( that.panels[ i - 1 ] || that.tablist );
				}
				panel.attr( "aria-live", "polite" );
			}

			if ( panel.length) {
				that.panels = that.panels.add( panel );
			}
			if ( originalAriaControls ) {
				tab.data( "ui-tabs-aria-controls", originalAriaControls );
			}
			tab.attr({
				"aria-controls": selector.substring( 1 ),
				"aria-labelledby": anchorId
			});
			panel.attr( "aria-labelledby", anchorId );
		});

		this.panels
			.addClass( "ui-tabs-panel ui-widget-content ui-corner-bottom" )
			.attr( "role", "tabpanel" );
	},

	// allow overriding how to find the list for rare usage scenarios (#7715)
	_getList: function() {
		return this.element.find( "ol,ul" ).eq( 0 );
	},

	_createPanel: function( id ) {
		return $( "<div>" )
			.attr( "id", id )
			.addClass( "ui-tabs-panel ui-widget-content ui-corner-bottom" )
			.data( "ui-tabs-destroy", true );
	},

	_setupDisabled: function( disabled ) {
		if ( $.isArray( disabled ) ) {
			if ( !disabled.length ) {
				disabled = false;
			} else if ( disabled.length === this.anchors.length ) {
				disabled = true;
			}
		}

		// disable tabs
		for ( var i = 0, li; ( li = this.tabs[ i ] ); i++ ) {
			if ( disabled === true || $.inArray( i, disabled ) !== -1 ) {
				$( li )
					.addClass( "ui-state-disabled" )
					.attr( "aria-disabled", "true" );
			} else {
				$( li )
					.removeClass( "ui-state-disabled" )
					.removeAttr( "aria-disabled" );
			}
		}

		this.options.disabled = disabled;
	},

	_setupEvents: function( event ) {
		var events = {
			click: function( event ) {
				event.preventDefault();
			}
		};
		if ( event ) {
			$.each( event.split(" "), function( index, eventName ) {
				events[ eventName ] = "_eventHandler";
			});
		}

		this._off( this.anchors.add( this.tabs ).add( this.panels ) );
		this._on( this.anchors, events );
		this._on( this.tabs, { keydown: "_tabKeydown" } );
		this._on( this.panels, { keydown: "_panelKeydown" } );

		this._focusable( this.tabs );
		this._hoverable( this.tabs );
	},

	_setupHeightStyle: function( heightStyle ) {
		var maxHeight, overflow,
			parent = this.element.parent();

		if ( heightStyle === "fill" ) {
			// IE 6 treats height like minHeight, so we need to turn off overflow
			// in order to get a reliable height
			// we use the minHeight support test because we assume that only
			// browsers that don't support minHeight will treat height as minHeight
			if ( !$.support.minHeight ) {
				overflow = parent.css( "overflow" );
				parent.css( "overflow", "hidden");
			}
			maxHeight = parent.height();
			this.element.siblings( ":visible" ).each(function() {
				var elem = $( this ),
					position = elem.css( "position" );

				if ( position === "absolute" || position === "fixed" ) {
					return;
				}
				maxHeight -= elem.outerHeight( true );
			});
			if ( overflow ) {
				parent.css( "overflow", overflow );
			}

			this.element.children().not( this.panels ).each(function() {
				maxHeight -= $( this ).outerHeight( true );
			});

			this.panels.each(function() {
				$( this ).height( Math.max( 0, maxHeight -
					$( this ).innerHeight() + $( this ).height() ) );
			})
			.css( "overflow", "auto" );
		} else if ( heightStyle === "auto" ) {
			maxHeight = 0;
			this.panels.each(function() {
				maxHeight = Math.max( maxHeight, $( this ).height( "" ).height() );
			}).height( maxHeight );
		}
	},

	_eventHandler: function( event ) {
		var options = this.options,
			active = this.active,
			anchor = $( event.currentTarget ),
			tab = anchor.closest( "li" ),
			clickedIsActive = tab[ 0 ] === active[ 0 ],
			collapsing = clickedIsActive && options.collapsible,
			toShow = collapsing ? $() : this._getPanelForTab( tab ),
			toHide = !active.length ? $() : this._getPanelForTab( active ),
			eventData = {
				oldTab: active,
				oldPanel: toHide,
				newTab: collapsing ? $() : tab,
				newPanel: toShow
			};

		event.preventDefault();

		if ( tab.hasClass( "ui-state-disabled" ) ||
				// tab is already loading
				tab.hasClass( "ui-tabs-loading" ) ||
				// can't switch durning an animation
				this.running ||
				// click on active header, but not collapsible
				( clickedIsActive && !options.collapsible ) ||
				// allow canceling activation
				( this._trigger( "beforeActivate", event, eventData ) === false ) ) {
			return;
		}

		options.active = collapsing ? false : this.tabs.index( tab );

		this.active = clickedIsActive ? $() : tab;
		if ( this.xhr ) {
			this.xhr.abort();
		}

		if ( !toHide.length && !toShow.length ) {
			$.error( "jQuery UI Tabs: Mismatching fragment identifier." );
		}

		if ( toShow.length ) {
			this.load( this.tabs.index( tab ), event );
		}
		this._toggle( event, eventData );
	},

	// handles show/hide for selecting tabs
	_toggle: function( event, eventData ) {
		var that = this,
			toShow = eventData.newPanel,
			toHide = eventData.oldPanel;

		this.running = true;

		function complete() {
			that.running = false;
			that._trigger( "activate", event, eventData );
		}

		function show() {
			eventData.newTab.closest( "li" ).addClass( "ui-tabs-active ui-state-active" );

			if ( toShow.length && that.options.show ) {
				that._show( toShow, that.options.show, complete );
			} else {
				toShow.show();
				complete();
			}
		}

		// start out by hiding, then showing, then completing
		if ( toHide.length && this.options.hide ) {
			this._hide( toHide, this.options.hide, function() {
				eventData.oldTab.closest( "li" ).removeClass( "ui-tabs-active ui-state-active" );
				show();
			});
		} else {
			eventData.oldTab.closest( "li" ).removeClass( "ui-tabs-active ui-state-active" );
			toHide.hide();
			show();
		}

		toHide.attr({
			"aria-expanded": "false",
			"aria-hidden": "true"
		});
		eventData.oldTab.attr( "aria-selected", "false" );
		// If we're switching tabs, remove the old tab from the tab order.
		// If we're opening from collapsed state, remove the previous tab from the tab order.
		// If we're collapsing, then keep the collapsing tab in the tab order.
		if ( toShow.length && toHide.length ) {
			eventData.oldTab.attr( "tabIndex", -1 );
		} else if ( toShow.length ) {
			this.tabs.filter(function() {
				return $( this ).attr( "tabIndex" ) === 0;
			})
			.attr( "tabIndex", -1 );
		}

		toShow.attr({
			"aria-expanded": "true",
			"aria-hidden": "false"
		});
		eventData.newTab.attr({
			"aria-selected": "true",
			tabIndex: 0
		});
	},

	_activate: function( index ) {
		var anchor,
			active = this._findActive( index );

		// trying to activate the already active panel
		if ( active[ 0 ] === this.active[ 0 ] ) {
			return;
		}

		// trying to collapse, simulate a click on the current active header
		if ( !active.length ) {
			active = this.active;
		}

		anchor = active.find( ".ui-tabs-anchor" )[ 0 ];
		this._eventHandler({
			target: anchor,
			currentTarget: anchor,
			preventDefault: $.noop
		});
	},

	_findActive: function( index ) {
		return index === false ? $() : this.tabs.eq( index );
	},

	_getIndex: function( index ) {
		// meta-function to give users option to provide a href string instead of a numerical index.
		if ( typeof index === "string" ) {
			index = this.anchors.index( this.anchors.filter( "[href$='" + index + "']" ) );
		}

		return index;
	},

	_destroy: function() {
		if ( this.xhr ) {
			this.xhr.abort();
		}

		this.element.removeClass( "ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible" );

		this.tablist
			.removeClass( "ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" )
			.removeAttr( "role" );

		this.anchors
			.removeClass( "ui-tabs-anchor" )
			.removeAttr( "role" )
			.removeAttr( "tabIndex" )
			.removeData( "href.tabs" )
			.removeData( "load.tabs" )
			.removeUniqueId();

		this.tabs.add( this.panels ).each(function() {
			if ( $.data( this, "ui-tabs-destroy" ) ) {
				$( this ).remove();
			} else {
				$( this )
					.removeClass( "ui-state-default ui-state-active ui-state-disabled " +
						"ui-corner-top ui-corner-bottom ui-widget-content ui-tabs-active ui-tabs-panel" )
					.removeAttr( "tabIndex" )
					.removeAttr( "aria-live" )
					.removeAttr( "aria-busy" )
					.removeAttr( "aria-selected" )
					.removeAttr( "aria-labelledby" )
					.removeAttr( "aria-hidden" )
					.removeAttr( "aria-expanded" )
					.removeAttr( "role" );
			}
		});

		this.tabs.each(function() {
			var li = $( this ),
				prev = li.data( "ui-tabs-aria-controls" );
			if ( prev ) {
				li.attr( "aria-controls", prev );
			} else {
				li.removeAttr( "aria-controls" );
			}
		});

		this.panels.show();

		if ( this.options.heightStyle !== "content" ) {
			this.panels.css( "height", "" );
		}
	},

	enable: function( index ) {
		var disabled = this.options.disabled;
		if ( disabled === false ) {
			return;
		}

		if ( index === undefined ) {
			disabled = false;
		} else {
			index = this._getIndex( index );
			if ( $.isArray( disabled ) ) {
				disabled = $.map( disabled, function( num ) {
					return num !== index ? num : null;
				});
			} else {
				disabled = $.map( this.tabs, function( li, num ) {
					return num !== index ? num : null;
				});
			}
		}
		this._setupDisabled( disabled );
	},

	disable: function( index ) {
		var disabled = this.options.disabled;
		if ( disabled === true ) {
			return;
		}

		if ( index === undefined ) {
			disabled = true;
		} else {
			index = this._getIndex( index );
			if ( $.inArray( index, disabled ) !== -1 ) {
				return;
			}
			if ( $.isArray( disabled ) ) {
				disabled = $.merge( [ index ], disabled ).sort();
			} else {
				disabled = [ index ];
			}
		}
		this._setupDisabled( disabled );
	},

	load: function( index, event ) {
		index = this._getIndex( index );
		var that = this,
			tab = this.tabs.eq( index ),
			anchor = tab.find( ".ui-tabs-anchor" ),
			panel = this._getPanelForTab( tab ),
			eventData = {
				tab: tab,
				panel: panel
			};

		// not remote
		if ( isLocal( anchor[ 0 ] ) ) {
			return;
		}

		this.xhr = $.ajax( this._ajaxSettings( anchor, event, eventData ) );

		// support: jQuery <1.8
		// jQuery <1.8 returns false if the request is canceled in beforeSend,
		// but as of 1.8, $.ajax() always returns a jqXHR object.
		if ( this.xhr && this.xhr.statusText !== "canceled" ) {
			tab.addClass( "ui-tabs-loading" );
			panel.attr( "aria-busy", "true" );

			this.xhr
				.success(function( response ) {
					// support: jQuery <1.8
					// http://bugs.jquery.com/ticket/11778
					setTimeout(function() {
						panel.html( response );
						that._trigger( "load", event, eventData );
					}, 1 );
				})
				.complete(function( jqXHR, status ) {
					// support: jQuery <1.8
					// http://bugs.jquery.com/ticket/11778
					setTimeout(function() {
						if ( status === "abort" ) {
							that.panels.stop( false, true );
						}

						tab.removeClass( "ui-tabs-loading" );
						panel.removeAttr( "aria-busy" );

						if ( jqXHR === that.xhr ) {
							delete that.xhr;
						}
					}, 1 );
				});
		}
	},

	// TODO: Remove this function in 1.10 when ajaxOptions is removed
	_ajaxSettings: function( anchor, event, eventData ) {
		var that = this;
		return {
			url: anchor.attr( "href" ),
			beforeSend: function( jqXHR, settings ) {
				return that._trigger( "beforeLoad", event,
					$.extend( { jqXHR : jqXHR, ajaxSettings: settings }, eventData ) );
			}
		};
	},

	_getPanelForTab: function( tab ) {
		var id = $( tab ).attr( "aria-controls" );
		return this.element.find( this._sanitizeSelector( "#" + id ) );
	}
});

// DEPRECATED
if ( $.uiBackCompat !== false ) {

	// helper method for a lot of the back compat extensions
	$.ui.tabs.prototype._ui = function( tab, panel ) {
		return {
			tab: tab,
			panel: panel,
			index: this.anchors.index( tab )
		};
	};

	// url method
	$.widget( "ui.tabs", $.ui.tabs, {
		url: function( index, url ) {
			this.anchors.eq( index ).attr( "href", url );
		}
	});

	// TODO: Remove _ajaxSettings() method when removing this extension
	// ajaxOptions and cache options
	$.widget( "ui.tabs", $.ui.tabs, {
		options: {
			ajaxOptions: null,
			cache: false
		},

		_create: function() {
			this._super();

			var that = this;

			this._on({ tabsbeforeload: function( event, ui ) {
				// tab is already cached
				if ( $.data( ui.tab[ 0 ], "cache.tabs" ) ) {
					event.preventDefault();
					return;
				}

				ui.jqXHR.success(function() {
					if ( that.options.cache ) {
						$.data( ui.tab[ 0 ], "cache.tabs", true );
					}
				});
			}});
		},

		_ajaxSettings: function( anchor, event, ui ) {
			var ajaxOptions = this.options.ajaxOptions;
			return $.extend( {}, ajaxOptions, {
				error: function( xhr, status ) {
					try {
						// Passing index avoid a race condition when this method is
						// called after the user has selected another tab.
						// Pass the anchor that initiated this request allows
						// loadError to manipulate the tab content panel via $(a.hash)
						ajaxOptions.error(
							xhr, status, ui.tab.closest( "li" ).index(), ui.tab[ 0 ] );
					}
					catch ( error ) {}
				}
			}, this._superApply( arguments ) );
		},

		_setOption: function( key, value ) {
			// reset cache if switching from cached to not cached
			if ( key === "cache" && value === false ) {
				this.anchors.removeData( "cache.tabs" );
			}
			this._super( key, value );
		},

		_destroy: function() {
			this.anchors.removeData( "cache.tabs" );
			this._super();
		},

		url: function( index ){
			this.anchors.eq( index ).removeData( "cache.tabs" );
			this._superApply( arguments );
		}
	});

	// abort method
	$.widget( "ui.tabs", $.ui.tabs, {
		abort: function() {
			if ( this.xhr ) {
				this.xhr.abort();
			}
		}
	});

	// spinner
	$.widget( "ui.tabs", $.ui.tabs, {
		options: {
			spinner: "<em>Loading&#8230;</em>"
		},
		_create: function() {
			this._super();
			this._on({
				tabsbeforeload: function( event, ui ) {
					// Don't react to nested tabs or tabs that don't use a spinner
					if ( event.target !== this.element[ 0 ] ||
							!this.options.spinner ) {
						return;
					}

					var span = ui.tab.find( "span" ),
						html = span.html();
					span.html( this.options.spinner );
					ui.jqXHR.complete(function() {
						span.html( html );
					});
				}
			});
		}
	});

	// enable/disable events
	$.widget( "ui.tabs", $.ui.tabs, {
		options: {
			enable: null,
			disable: null
		},

		enable: function( index ) {
			var options = this.options,
				trigger;

			if ( index && options.disabled === true ||
					( $.isArray( options.disabled ) && $.inArray( index, options.disabled ) !== -1 ) ) {
				trigger = true;
			}

			this._superApply( arguments );

			if ( trigger ) {
				this._trigger( "enable", null, this._ui( this.anchors[ index ], this.panels[ index ] ) );
			}
		},

		disable: function( index ) {
			var options = this.options,
				trigger;

			if ( index && options.disabled === false ||
					( $.isArray( options.disabled ) && $.inArray( index, options.disabled ) === -1 ) ) {
				trigger = true;
			}

			this._superApply( arguments );

			if ( trigger ) {
				this._trigger( "disable", null, this._ui( this.anchors[ index ], this.panels[ index ] ) );
			}
		}
	});

	// add/remove methods and events
	$.widget( "ui.tabs", $.ui.tabs, {
		options: {
			add: null,
			remove: null,
			tabTemplate: "<li><a href='#{href}'><span>#{label}</span></a></li>"
		},

		add: function( url, label, index ) {
			if ( index === undefined ) {
				index = this.anchors.length;
			}

			var doInsertAfter, panel,
				options = this.options,
				li = $( options.tabTemplate
					.replace( /#\{href\}/g, url )
					.replace( /#\{label\}/g, label ) ),
				id = !url.indexOf( "#" ) ?
					url.replace( "#", "" ) :
					this._tabId( li );

			li.addClass( "ui-state-default ui-corner-top" ).data( "ui-tabs-destroy", true );
			li.attr( "aria-controls", id );

			doInsertAfter = index >= this.tabs.length;

			// try to find an existing element before creating a new one
			panel = this.element.find( "#" + id );
			if ( !panel.length ) {
				panel = this._createPanel( id );
				if ( doInsertAfter ) {
					if ( index > 0 ) {
						panel.insertAfter( this.panels.eq( -1 ) );
					} else {
						panel.appendTo( this.element );
					}
				} else {
					panel.insertBefore( this.panels[ index ] );
				}
			}
			panel.addClass( "ui-tabs-panel ui-widget-content ui-corner-bottom" ).hide();

			if ( doInsertAfter ) {
				li.appendTo( this.tablist );
			} else {
				li.insertBefore( this.tabs[ index ] );
			}

			options.disabled = $.map( options.disabled, function( n ) {
				return n >= index ? ++n : n;
			});

			this.refresh();
			if ( this.tabs.length === 1 && options.active === false ) {
				this.option( "active", 0 );
			}

			this._trigger( "add", null, this._ui( this.anchors[ index ], this.panels[ index ] ) );
			return this;
		},

		remove: function( index ) {
			index = this._getIndex( index );
			var options = this.options,
				tab = this.tabs.eq( index ).remove(),
				panel = this._getPanelForTab( tab ).remove();

			// If selected tab was removed focus tab to the right or
			// in case the last tab was removed the tab to the left.
			// We check for more than 2 tabs, because if there are only 2,
			// then when we remove this tab, there will only be one tab left
			// so we don't need to detect which tab to activate.
			if ( tab.hasClass( "ui-tabs-active" ) && this.anchors.length > 2 ) {
				this._activate( index + ( index + 1 < this.anchors.length ? 1 : -1 ) );
			}

			options.disabled = $.map(
				$.grep( options.disabled, function( n ) {
					return n !== index;
				}),
				function( n ) {
					return n >= index ? --n : n;
				});

			this.refresh();

			this._trigger( "remove", null, this._ui( tab.find( "a" )[ 0 ], panel[ 0 ] ) );
			return this;
		}
	});

	// length method
	$.widget( "ui.tabs", $.ui.tabs, {
		length: function() {
			return this.anchors.length;
		}
	});

	// panel ids (idPrefix option + title attribute)
	$.widget( "ui.tabs", $.ui.tabs, {
		options: {
			idPrefix: "ui-tabs-"
		},

		_tabId: function( tab ) {
			var a = tab.is( "li" ) ? tab.find( "a[href]" ) : tab;
			a = a[0];
			return $( a ).closest( "li" ).attr( "aria-controls" ) ||
				a.title && a.title.replace( /\s/g, "_" ).replace( /[^\w\u00c0-\uFFFF\-]/g, "" ) ||
				this.options.idPrefix + getNextTabId();
		}
	});

	// _createPanel method
	$.widget( "ui.tabs", $.ui.tabs, {
		options: {
			panelTemplate: "<div></div>"
		},

		_createPanel: function( id ) {
			return $( this.options.panelTemplate )
				.attr( "id", id )
				.addClass( "ui-tabs-panel ui-widget-content ui-corner-bottom" )
				.data( "ui-tabs-destroy", true );
		}
	});

	// selected option
	$.widget( "ui.tabs", $.ui.tabs, {
		_create: function() {
			var options = this.options;
			if ( options.active === null && options.selected !== undefined ) {
				options.active = options.selected === -1 ? false : options.selected;
			}
			this._super();
			options.selected = options.active;
			if ( options.selected === false ) {
				options.selected = -1;
			}
		},

		_setOption: function( key, value ) {
			if ( key !== "selected" ) {
				return this._super( key, value );
			}

			var options = this.options;
			this._super( "active", value === -1 ? false : value );
			options.selected = options.active;
			if ( options.selected === false ) {
				options.selected = -1;
			}
		},

		_eventHandler: function() {
			this._superApply( arguments );
			this.options.selected = this.options.active;
			if ( this.options.selected === false ) {
				this.options.selected = -1;
			}
		}
	});

	// show and select event
	$.widget( "ui.tabs", $.ui.tabs, {
		options: {
			show: null,
			select: null
		},
		_create: function() {
			this._super();
			if ( this.options.active !== false ) {
				this._trigger( "show", null, this._ui(
					this.active.find( ".ui-tabs-anchor" )[ 0 ],
					this._getPanelForTab( this.active )[ 0 ] ) );
			}
		},
		_trigger: function( type, event, data ) {
			var tab, panel,
				ret = this._superApply( arguments );

			if ( !ret ) {
				return false;
			}

			if ( type === "beforeActivate" ) {
				tab = data.newTab.length ? data.newTab : data.oldTab;
				panel = data.newPanel.length ? data.newPanel : data.oldPanel;
				ret = this._super( "select", event, {
					tab: tab.find( ".ui-tabs-anchor" )[ 0],
					panel: panel[ 0 ],
					index: tab.closest( "li" ).index()
				});
			} else if ( type === "activate" && data.newTab.length ) {
				ret = this._super( "show", event, {
					tab: data.newTab.find( ".ui-tabs-anchor" )[ 0 ],
					panel: data.newPanel[ 0 ],
					index: data.newTab.closest( "li" ).index()
				});
			}
			return ret;
		}
	});

	// select method
	$.widget( "ui.tabs", $.ui.tabs, {
		select: function( index ) {
			index = this._getIndex( index );
			if ( index === -1 ) {
				if ( this.options.collapsible && this.options.selected !== -1 ) {
					index = this.options.selected;
				} else {
					return;
				}
			}
			this.anchors.eq( index ).trigger( this.options.event + this.eventNamespace );
		}
	});

	// cookie option
	(function() {

	var listId = 0;

	$.widget( "ui.tabs", $.ui.tabs, {
		options: {
			cookie: null // e.g. { expires: 7, path: '/', domain: 'jquery.com', secure: true }
		},
		_create: function() {
			var options = this.options,
				active;
			if ( options.active == null && options.cookie ) {
				active = parseInt( this._cookie(), 10 );
				if ( active === -1 ) {
					active = false;
				}
				options.active = active;
			}
			this._super();
		},
		_cookie: function( active ) {
			var cookie = [ this.cookie ||
				( this.cookie = this.options.cookie.name || "ui-tabs-" + (++listId) ) ];
			if ( arguments.length ) {
				cookie.push( active === false ? -1 : active );
				cookie.push( this.options.cookie );
			}
			return $.cookie.apply( null, cookie );
		},
		_refresh: function() {
			this._super();
			if ( this.options.cookie ) {
				this._cookie( this.options.active, this.options.cookie );
			}
		},
		_eventHandler: function() {
			this._superApply( arguments );
			if ( this.options.cookie ) {
				this._cookie( this.options.active, this.options.cookie );
			}
		},
		_destroy: function() {
			this._super();
			if ( this.options.cookie ) {
				this._cookie( null, this.options.cookie );
			}
		}
	});

	})();

	// load event
	$.widget( "ui.tabs", $.ui.tabs, {
		_trigger: function( type, event, data ) {
			var _data = $.extend( {}, data );
			if ( type === "load" ) {
				_data.panel = _data.panel[ 0 ];
				_data.tab = _data.tab.find( ".ui-tabs-anchor" )[ 0 ];
			}
			return this._super( type, event, _data );
		}
	});

	// fx option
	// The new animation options (show, hide) conflict with the old show callback.
	// The old fx option wins over show/hide anyway (always favor back-compat).
	// If a user wants to use the new animation API, they must give up the old API.
	$.widget( "ui.tabs", $.ui.tabs, {
		options: {
			fx: null // e.g. { height: "toggle", opacity: "toggle", duration: 200 }
		},

		_getFx: function() {
			var hide, show,
				fx = this.options.fx;

			if ( fx ) {
				if ( $.isArray( fx ) ) {
					hide = fx[ 0 ];
					show = fx[ 1 ];
				} else {
					hide = show = fx;
				}
			}

			return fx ? { show: show, hide: hide } : null;
		},

		_toggle: function( event, eventData ) {
			var that = this,
				toShow = eventData.newPanel,
				toHide = eventData.oldPanel,
				fx = this._getFx();

			if ( !fx ) {
				return this._super( event, eventData );
			}

			that.running = true;

			function complete() {
				that.running = false;
				that._trigger( "activate", event, eventData );
			}

			function show() {
				eventData.newTab.closest( "li" ).addClass( "ui-tabs-active ui-state-active" );

				if ( toShow.length && fx.show ) {
					toShow
						.animate( fx.show, fx.show.duration, function() {
							complete();
						});
				} else {
					toShow.show();
					complete();
				}
			}

			// start out by hiding, then showing, then completing
			if ( toHide.length && fx.hide ) {
				toHide.animate( fx.hide, fx.hide.duration, function() {
					eventData.oldTab.closest( "li" ).removeClass( "ui-tabs-active ui-state-active" );
					show();
				});
			} else {
				eventData.oldTab.closest( "li" ).removeClass( "ui-tabs-active ui-state-active" );
				toHide.hide();
				show();
			}
		}
	});
}

})( jQuery );
(function( $ ) {

var increments = 0;

function addDescribedBy( elem, id ) {
	var describedby = (elem.attr( "aria-describedby" ) || "").split( /\s+/ );
	describedby.push( id );
	elem
		.data( "ui-tooltip-id", id )
		.attr( "aria-describedby", $.trim( describedby.join( " " ) ) );
}

function removeDescribedBy( elem ) {
	var id = elem.data( "ui-tooltip-id" ),
		describedby = (elem.attr( "aria-describedby" ) || "").split( /\s+/ ),
		index = $.inArray( id, describedby );
	if ( index !== -1 ) {
		describedby.splice( index, 1 );
	}

	elem.removeData( "ui-tooltip-id" );
	describedby = $.trim( describedby.join( " " ) );
	if ( describedby ) {
		elem.attr( "aria-describedby", describedby );
	} else {
		elem.removeAttr( "aria-describedby" );
	}
}

$.widget( "ui.tooltip", {
	version: "1.9.2",
	options: {
		content: function() {
			return $( this ).attr( "title" );
		},
		hide: true,
		// Disabled elements have inconsistent behavior across browsers (#8661)
		items: "[title]:not([disabled])",
		position: {
			my: "left top+15",
			at: "left bottom",
			collision: "flipfit flip"
		},
		show: true,
		tooltipClass: null,
		track: false,

		// callbacks
		close: null,
		open: null
	},

	_create: function() {
		this._on({
			mouseover: "open",
			focusin: "open"
		});

		// IDs of generated tooltips, needed for destroy
		this.tooltips = {};
		// IDs of parent tooltips where we removed the title attribute
		this.parents = {};

		if ( this.options.disabled ) {
			this._disable();
		}
	},

	_setOption: function( key, value ) {
		var that = this;

		if ( key === "disabled" ) {
			this[ value ? "_disable" : "_enable" ]();
			this.options[ key ] = value;
			// disable element style changes
			return;
		}

		this._super( key, value );

		if ( key === "content" ) {
			$.each( this.tooltips, function( id, element ) {
				that._updateContent( element );
			});
		}
	},

	_disable: function() {
		var that = this;

		// close open tooltips
		$.each( this.tooltips, function( id, element ) {
			var event = $.Event( "blur" );
			event.target = event.currentTarget = element[0];
			that.close( event, true );
		});

		// remove title attributes to prevent native tooltips
		this.element.find( this.options.items ).andSelf().each(function() {
			var element = $( this );
			if ( element.is( "[title]" ) ) {
				element
					.data( "ui-tooltip-title", element.attr( "title" ) )
					.attr( "title", "" );
			}
		});
	},

	_enable: function() {
		// restore title attributes
		this.element.find( this.options.items ).andSelf().each(function() {
			var element = $( this );
			if ( element.data( "ui-tooltip-title" ) ) {
				element.attr( "title", element.data( "ui-tooltip-title" ) );
			}
		});
	},

	open: function( event ) {
		var that = this,
			target = $( event ? event.target : this.element )
				// we need closest here due to mouseover bubbling,
				// but always pointing at the same event target
				.closest( this.options.items );

		// No element to show a tooltip for or the tooltip is already open
		if ( !target.length || target.data( "ui-tooltip-id" ) ) {
			return;
		}

		if ( target.attr( "title" ) ) {
			target.data( "ui-tooltip-title", target.attr( "title" ) );
		}

		target.data( "ui-tooltip-open", true );

		// kill parent tooltips, custom or native, for hover
		if ( event && event.type === "mouseover" ) {
			target.parents().each(function() {
				var parent = $( this ),
					blurEvent;
				if ( parent.data( "ui-tooltip-open" ) ) {
					blurEvent = $.Event( "blur" );
					blurEvent.target = blurEvent.currentTarget = this;
					that.close( blurEvent, true );
				}
				if ( parent.attr( "title" ) ) {
					parent.uniqueId();
					that.parents[ this.id ] = {
						element: this,
						title: parent.attr( "title" )
					};
					parent.attr( "title", "" );
				}
			});
		}

		this._updateContent( target, event );
	},

	_updateContent: function( target, event ) {
		var content,
			contentOption = this.options.content,
			that = this,
			eventType = event ? event.type : null;

		if ( typeof contentOption === "string" ) {
			return this._open( event, target, contentOption );
		}

		content = contentOption.call( target[0], function( response ) {
			// ignore async response if tooltip was closed already
			if ( !target.data( "ui-tooltip-open" ) ) {
				return;
			}
			// IE may instantly serve a cached response for ajax requests
			// delay this call to _open so the other call to _open runs first
			that._delay(function() {
				// jQuery creates a special event for focusin when it doesn't
				// exist natively. To improve performance, the native event
				// object is reused and the type is changed. Therefore, we can't
				// rely on the type being correct after the event finished
				// bubbling, so we set it back to the previous value. (#8740)
				if ( event ) {
					event.type = eventType;
				}
				this._open( event, target, response );
			});
		});
		if ( content ) {
			this._open( event, target, content );
		}
	},

	_open: function( event, target, content ) {
		var tooltip, events, delayedShow,
			positionOption = $.extend( {}, this.options.position );

		if ( !content ) {
			return;
		}

		// Content can be updated multiple times. If the tooltip already
		// exists, then just update the content and bail.
		tooltip = this._find( target );
		if ( tooltip.length ) {
			tooltip.find( ".ui-tooltip-content" ).html( content );
			return;
		}

		// if we have a title, clear it to prevent the native tooltip
		// we have to check first to avoid defining a title if none exists
		// (we don't want to cause an element to start matching [title])
		//
		// We use removeAttr only for key events, to allow IE to export the correct
		// accessible attributes. For mouse events, set to empty string to avoid
		// native tooltip showing up (happens only when removing inside mouseover).
		if ( target.is( "[title]" ) ) {
			if ( event && event.type === "mouseover" ) {
				target.attr( "title", "" );
			} else {
				target.removeAttr( "title" );
			}
		}

		tooltip = this._tooltip( target );
		addDescribedBy( target, tooltip.attr( "id" ) );
		tooltip.find( ".ui-tooltip-content" ).html( content );

		function position( event ) {
			positionOption.of = event;
			if ( tooltip.is( ":hidden" ) ) {
				return;
			}
			tooltip.position( positionOption );
		}
		if ( this.options.track && event && /^mouse/.test( event.type ) ) {
			this._on( this.document, {
				mousemove: position
			});
			// trigger once to override element-relative positioning
			position( event );
		} else {
			tooltip.position( $.extend({
				of: target
			}, this.options.position ) );
		}

		tooltip.hide();

		this._show( tooltip, this.options.show );
		// Handle tracking tooltips that are shown with a delay (#8644). As soon
		// as the tooltip is visible, position the tooltip using the most recent
		// event.
		if ( this.options.show && this.options.show.delay ) {
			delayedShow = setInterval(function() {
				if ( tooltip.is( ":visible" ) ) {
					position( positionOption.of );
					clearInterval( delayedShow );
				}
			}, $.fx.interval );
		}

		this._trigger( "open", event, { tooltip: tooltip } );

		events = {
			keyup: function( event ) {
				if ( event.keyCode === $.ui.keyCode.ESCAPE ) {
					var fakeEvent = $.Event(event);
					fakeEvent.currentTarget = target[0];
					this.close( fakeEvent, true );
				}
			},
			remove: function() {
				this._removeTooltip( tooltip );
			}
		};
		if ( !event || event.type === "mouseover" ) {
			events.mouseleave = "close";
		}
		if ( !event || event.type === "focusin" ) {
			events.focusout = "close";
		}
		this._on( true, target, events );
	},

	close: function( event ) {
		var that = this,
			target = $( event ? event.currentTarget : this.element ),
			tooltip = this._find( target );

		// disabling closes the tooltip, so we need to track when we're closing
		// to avoid an infinite loop in case the tooltip becomes disabled on close
		if ( this.closing ) {
			return;
		}

		// only set title if we had one before (see comment in _open())
		if ( target.data( "ui-tooltip-title" ) ) {
			target.attr( "title", target.data( "ui-tooltip-title" ) );
		}

		removeDescribedBy( target );

		tooltip.stop( true );
		this._hide( tooltip, this.options.hide, function() {
			that._removeTooltip( $( this ) );
		});

		target.removeData( "ui-tooltip-open" );
		this._off( target, "mouseleave focusout keyup" );
		// Remove 'remove' binding only on delegated targets
		if ( target[0] !== this.element[0] ) {
			this._off( target, "remove" );
		}
		this._off( this.document, "mousemove" );

		if ( event && event.type === "mouseleave" ) {
			$.each( this.parents, function( id, parent ) {
				$( parent.element ).attr( "title", parent.title );
				delete that.parents[ id ];
			});
		}

		this.closing = true;
		this._trigger( "close", event, { tooltip: tooltip } );
		this.closing = false;
	},

	_tooltip: function( element ) {
		var id = "ui-tooltip-" + increments++,
			tooltip = $( "<div>" )
				.attr({
					id: id,
					role: "tooltip"
				})
				.addClass( "ui-tooltip ui-widget ui-corner-all ui-widget-content " +
					( this.options.tooltipClass || "" ) );
		$( "<div>" )
			.addClass( "ui-tooltip-content" )
			.appendTo( tooltip );
		tooltip.appendTo( this.document[0].body );
		if ( $.fn.bgiframe ) {
			tooltip.bgiframe();
		}
		this.tooltips[ id ] = element;
		return tooltip;
	},

	_find: function( target ) {
		var id = target.data( "ui-tooltip-id" );
		return id ? $( "#" + id ) : $();
	},

	_removeTooltip: function( tooltip ) {
		tooltip.remove();
		delete this.tooltips[ tooltip.attr( "id" ) ];
	},

	_destroy: function() {
		var that = this;

		// close open tooltips
		$.each( this.tooltips, function( id, element ) {
			// Delegate to close method to handle common cleanup
			var event = $.Event( "blur" );
			event.target = event.currentTarget = element[0];
			that.close( event, true );

			// Remove immediately; destroying an open tooltip doesn't use the
			// hide animation
			$( "#" + id ).remove();

			// Restore the title
			if ( element.data( "ui-tooltip-title" ) ) {
				element.attr( "title", element.data( "ui-tooltip-title" ) );
				element.removeData( "ui-tooltip-title" );
			}
		});
	}
});

}( jQuery ) );
;(jQuery.effects || (function($, undefined) {

var backCompat = $.uiBackCompat !== false,
	// prefix used for storing data on .data()
	dataSpace = "ui-effects-";

$.effects = {
	effect: {}
};

/*!
 * jQuery Color Animations v2.0.0
 * http://jquery.com/
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * Date: Mon Aug 13 13:41:02 2012 -0500
 */
(function( jQuery, undefined ) {

	var stepHooks = "backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor".split(" "),

	// plusequals test for += 100 -= 100
	rplusequals = /^([\-+])=\s*(\d+\.?\d*)/,
	// a set of RE's that can match strings and generate color tuples.
	stringParsers = [{
			re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
			parse: function( execResult ) {
				return [
					execResult[ 1 ],
					execResult[ 2 ],
					execResult[ 3 ],
					execResult[ 4 ]
				];
			}
		}, {
			re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
			parse: function( execResult ) {
				return [
					execResult[ 1 ] * 2.55,
					execResult[ 2 ] * 2.55,
					execResult[ 3 ] * 2.55,
					execResult[ 4 ]
				];
			}
		}, {
			// this regex ignores A-F because it's compared against an already lowercased string
			re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,
			parse: function( execResult ) {
				return [
					parseInt( execResult[ 1 ], 16 ),
					parseInt( execResult[ 2 ], 16 ),
					parseInt( execResult[ 3 ], 16 )
				];
			}
		}, {
			// this regex ignores A-F because it's compared against an already lowercased string
			re: /#([a-f0-9])([a-f0-9])([a-f0-9])/,
			parse: function( execResult ) {
				return [
					parseInt( execResult[ 1 ] + execResult[ 1 ], 16 ),
					parseInt( execResult[ 2 ] + execResult[ 2 ], 16 ),
					parseInt( execResult[ 3 ] + execResult[ 3 ], 16 )
				];
			}
		}, {
			re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
			space: "hsla",
			parse: function( execResult ) {
				return [
					execResult[ 1 ],
					execResult[ 2 ] / 100,
					execResult[ 3 ] / 100,
					execResult[ 4 ]
				];
			}
		}],

	// jQuery.Color( )
	color = jQuery.Color = function( color, green, blue, alpha ) {
		return new jQuery.Color.fn.parse( color, green, blue, alpha );
	},
	spaces = {
		rgba: {
			props: {
				red: {
					idx: 0,
					type: "byte"
				},
				green: {
					idx: 1,
					type: "byte"
				},
				blue: {
					idx: 2,
					type: "byte"
				}
			}
		},

		hsla: {
			props: {
				hue: {
					idx: 0,
					type: "degrees"
				},
				saturation: {
					idx: 1,
					type: "percent"
				},
				lightness: {
					idx: 2,
					type: "percent"
				}
			}
		}
	},
	propTypes = {
		"byte": {
			floor: true,
			max: 255
		},
		"percent": {
			max: 1
		},
		"degrees": {
			mod: 360,
			floor: true
		}
	},
	support = color.support = {},

	// element for support tests
	supportElem = jQuery( "<p>" )[ 0 ],

	// colors = jQuery.Color.names
	colors,

	// local aliases of functions called often
	each = jQuery.each;

// determine rgba support immediately
supportElem.style.cssText = "background-color:rgba(1,1,1,.5)";
support.rgba = supportElem.style.backgroundColor.indexOf( "rgba" ) > -1;

// define cache name and alpha properties
// for rgba and hsla spaces
each( spaces, function( spaceName, space ) {
	space.cache = "_" + spaceName;
	space.props.alpha = {
		idx: 3,
		type: "percent",
		def: 1
	};
});

function clamp( value, prop, allowEmpty ) {
	var type = propTypes[ prop.type ] || {};

	if ( value == null ) {
		return (allowEmpty || !prop.def) ? null : prop.def;
	}

	// ~~ is an short way of doing floor for positive numbers
	value = type.floor ? ~~value : parseFloat( value );

	// IE will pass in empty strings as value for alpha,
	// which will hit this case
	if ( isNaN( value ) ) {
		return prop.def;
	}

	if ( type.mod ) {
		// we add mod before modding to make sure that negatives values
		// get converted properly: -10 -> 350
		return (value + type.mod) % type.mod;
	}

	// for now all property types without mod have min and max
	return 0 > value ? 0 : type.max < value ? type.max : value;
}

function stringParse( string ) {
	var inst = color(),
		rgba = inst._rgba = [];

	string = string.toLowerCase();

	each( stringParsers, function( i, parser ) {
		var parsed,
			match = parser.re.exec( string ),
			values = match && parser.parse( match ),
			spaceName = parser.space || "rgba";

		if ( values ) {
			parsed = inst[ spaceName ]( values );

			// if this was an rgba parse the assignment might happen twice
			// oh well....
			inst[ spaces[ spaceName ].cache ] = parsed[ spaces[ spaceName ].cache ];
			rgba = inst._rgba = parsed._rgba;

			// exit each( stringParsers ) here because we matched
			return false;
		}
	});

	// Found a stringParser that handled it
	if ( rgba.length ) {

		// if this came from a parsed string, force "transparent" when alpha is 0
		// chrome, (and maybe others) return "transparent" as rgba(0,0,0,0)
		if ( rgba.join() === "0,0,0,0" ) {
			jQuery.extend( rgba, colors.transparent );
		}
		return inst;
	}

	// named colors
	return colors[ string ];
}

color.fn = jQuery.extend( color.prototype, {
	parse: function( red, green, blue, alpha ) {
		if ( red === undefined ) {
			this._rgba = [ null, null, null, null ];
			return this;
		}
		if ( red.jquery || red.nodeType ) {
			red = jQuery( red ).css( green );
			green = undefined;
		}

		var inst = this,
			type = jQuery.type( red ),
			rgba = this._rgba = [];

		// more than 1 argument specified - assume ( red, green, blue, alpha )
		if ( green !== undefined ) {
			red = [ red, green, blue, alpha ];
			type = "array";
		}

		if ( type === "string" ) {
			return this.parse( stringParse( red ) || colors._default );
		}

		if ( type === "array" ) {
			each( spaces.rgba.props, function( key, prop ) {
				rgba[ prop.idx ] = clamp( red[ prop.idx ], prop );
			});
			return this;
		}

		if ( type === "object" ) {
			if ( red instanceof color ) {
				each( spaces, function( spaceName, space ) {
					if ( red[ space.cache ] ) {
						inst[ space.cache ] = red[ space.cache ].slice();
					}
				});
			} else {
				each( spaces, function( spaceName, space ) {
					var cache = space.cache;
					each( space.props, function( key, prop ) {

						// if the cache doesn't exist, and we know how to convert
						if ( !inst[ cache ] && space.to ) {

							// if the value was null, we don't need to copy it
							// if the key was alpha, we don't need to copy it either
							if ( key === "alpha" || red[ key ] == null ) {
								return;
							}
							inst[ cache ] = space.to( inst._rgba );
						}

						// this is the only case where we allow nulls for ALL properties.
						// call clamp with alwaysAllowEmpty
						inst[ cache ][ prop.idx ] = clamp( red[ key ], prop, true );
					});

					// everything defined but alpha?
					if ( inst[ cache ] && $.inArray( null, inst[ cache ].slice( 0, 3 ) ) < 0 ) {
						// use the default of 1
						inst[ cache ][ 3 ] = 1;
						if ( space.from ) {
							inst._rgba = space.from( inst[ cache ] );
						}
					}
				});
			}
			return this;
		}
	},
	is: function( compare ) {
		var is = color( compare ),
			same = true,
			inst = this;

		each( spaces, function( _, space ) {
			var localCache,
				isCache = is[ space.cache ];
			if (isCache) {
				localCache = inst[ space.cache ] || space.to && space.to( inst._rgba ) || [];
				each( space.props, function( _, prop ) {
					if ( isCache[ prop.idx ] != null ) {
						same = ( isCache[ prop.idx ] === localCache[ prop.idx ] );
						return same;
					}
				});
			}
			return same;
		});
		return same;
	},
	_space: function() {
		var used = [],
			inst = this;
		each( spaces, function( spaceName, space ) {
			if ( inst[ space.cache ] ) {
				used.push( spaceName );
			}
		});
		return used.pop();
	},
	transition: function( other, distance ) {
		var end = color( other ),
			spaceName = end._space(),
			space = spaces[ spaceName ],
			startColor = this.alpha() === 0 ? color( "transparent" ) : this,
			start = startColor[ space.cache ] || space.to( startColor._rgba ),
			result = start.slice();

		end = end[ space.cache ];
		each( space.props, function( key, prop ) {
			var index = prop.idx,
				startValue = start[ index ],
				endValue = end[ index ],
				type = propTypes[ prop.type ] || {};

			// if null, don't override start value
			if ( endValue === null ) {
				return;
			}
			// if null - use end
			if ( startValue === null ) {
				result[ index ] = endValue;
			} else {
				if ( type.mod ) {
					if ( endValue - startValue > type.mod / 2 ) {
						startValue += type.mod;
					} else if ( startValue - endValue > type.mod / 2 ) {
						startValue -= type.mod;
					}
				}
				result[ index ] = clamp( ( endValue - startValue ) * distance + startValue, prop );
			}
		});
		return this[ spaceName ]( result );
	},
	blend: function( opaque ) {
		// if we are already opaque - return ourself
		if ( this._rgba[ 3 ] === 1 ) {
			return this;
		}

		var rgb = this._rgba.slice(),
			a = rgb.pop(),
			blend = color( opaque )._rgba;

		return color( jQuery.map( rgb, function( v, i ) {
			return ( 1 - a ) * blend[ i ] + a * v;
		}));
	},
	toRgbaString: function() {
		var prefix = "rgba(",
			rgba = jQuery.map( this._rgba, function( v, i ) {
				return v == null ? ( i > 2 ? 1 : 0 ) : v;
			});

		if ( rgba[ 3 ] === 1 ) {
			rgba.pop();
			prefix = "rgb(";
		}

		return prefix + rgba.join() + ")";
	},
	toHslaString: function() {
		var prefix = "hsla(",
			hsla = jQuery.map( this.hsla(), function( v, i ) {
				if ( v == null ) {
					v = i > 2 ? 1 : 0;
				}

				// catch 1 and 2
				if ( i && i < 3 ) {
					v = Math.round( v * 100 ) + "%";
				}
				return v;
			});

		if ( hsla[ 3 ] === 1 ) {
			hsla.pop();
			prefix = "hsl(";
		}
		return prefix + hsla.join() + ")";
	},
	toHexString: function( includeAlpha ) {
		var rgba = this._rgba.slice(),
			alpha = rgba.pop();

		if ( includeAlpha ) {
			rgba.push( ~~( alpha * 255 ) );
		}

		return "#" + jQuery.map( rgba, function( v ) {

			// default to 0 when nulls exist
			v = ( v || 0 ).toString( 16 );
			return v.length === 1 ? "0" + v : v;
		}).join("");
	},
	toString: function() {
		return this._rgba[ 3 ] === 0 ? "transparent" : this.toRgbaString();
	}
});
color.fn.parse.prototype = color.fn;

// hsla conversions adapted from:
// https://code.google.com/p/maashaack/source/browse/packages/graphics/trunk/src/graphics/colors/HUE2RGB.as?r=5021

function hue2rgb( p, q, h ) {
	h = ( h + 1 ) % 1;
	if ( h * 6 < 1 ) {
		return p + (q - p) * h * 6;
	}
	if ( h * 2 < 1) {
		return q;
	}
	if ( h * 3 < 2 ) {
		return p + (q - p) * ((2/3) - h) * 6;
	}
	return p;
}

spaces.hsla.to = function ( rgba ) {
	if ( rgba[ 0 ] == null || rgba[ 1 ] == null || rgba[ 2 ] == null ) {
		return [ null, null, null, rgba[ 3 ] ];
	}
	var r = rgba[ 0 ] / 255,
		g = rgba[ 1 ] / 255,
		b = rgba[ 2 ] / 255,
		a = rgba[ 3 ],
		max = Math.max( r, g, b ),
		min = Math.min( r, g, b ),
		diff = max - min,
		add = max + min,
		l = add * 0.5,
		h, s;

	if ( min === max ) {
		h = 0;
	} else if ( r === max ) {
		h = ( 60 * ( g - b ) / diff ) + 360;
	} else if ( g === max ) {
		h = ( 60 * ( b - r ) / diff ) + 120;
	} else {
		h = ( 60 * ( r - g ) / diff ) + 240;
	}

	if ( l === 0 || l === 1 ) {
		s = l;
	} else if ( l <= 0.5 ) {
		s = diff / add;
	} else {
		s = diff / ( 2 - add );
	}
	return [ Math.round(h) % 360, s, l, a == null ? 1 : a ];
};

spaces.hsla.from = function ( hsla ) {
	if ( hsla[ 0 ] == null || hsla[ 1 ] == null || hsla[ 2 ] == null ) {
		return [ null, null, null, hsla[ 3 ] ];
	}
	var h = hsla[ 0 ] / 360,
		s = hsla[ 1 ],
		l = hsla[ 2 ],
		a = hsla[ 3 ],
		q = l <= 0.5 ? l * ( 1 + s ) : l + s - l * s,
		p = 2 * l - q;

	return [
		Math.round( hue2rgb( p, q, h + ( 1 / 3 ) ) * 255 ),
		Math.round( hue2rgb( p, q, h ) * 255 ),
		Math.round( hue2rgb( p, q, h - ( 1 / 3 ) ) * 255 ),
		a
	];
};


each( spaces, function( spaceName, space ) {
	var props = space.props,
		cache = space.cache,
		to = space.to,
		from = space.from;

	// makes rgba() and hsla()
	color.fn[ spaceName ] = function( value ) {

		// generate a cache for this space if it doesn't exist
		if ( to && !this[ cache ] ) {
			this[ cache ] = to( this._rgba );
		}
		if ( value === undefined ) {
			return this[ cache ].slice();
		}

		var ret,
			type = jQuery.type( value ),
			arr = ( type === "array" || type === "object" ) ? value : arguments,
			local = this[ cache ].slice();

		each( props, function( key, prop ) {
			var val = arr[ type === "object" ? key : prop.idx ];
			if ( val == null ) {
				val = local[ prop.idx ];
			}
			local[ prop.idx ] = clamp( val, prop );
		});

		if ( from ) {
			ret = color( from( local ) );
			ret[ cache ] = local;
			return ret;
		} else {
			return color( local );
		}
	};

	// makes red() green() blue() alpha() hue() saturation() lightness()
	each( props, function( key, prop ) {
		// alpha is included in more than one space
		if ( color.fn[ key ] ) {
			return;
		}
		color.fn[ key ] = function( value ) {
			var vtype = jQuery.type( value ),
				fn = ( key === "alpha" ? ( this._hsla ? "hsla" : "rgba" ) : spaceName ),
				local = this[ fn ](),
				cur = local[ prop.idx ],
				match;

			if ( vtype === "undefined" ) {
				return cur;
			}

			if ( vtype === "function" ) {
				value = value.call( this, cur );
				vtype = jQuery.type( value );
			}
			if ( value == null && prop.empty ) {
				return this;
			}
			if ( vtype === "string" ) {
				match = rplusequals.exec( value );
				if ( match ) {
					value = cur + parseFloat( match[ 2 ] ) * ( match[ 1 ] === "+" ? 1 : -1 );
				}
			}
			local[ prop.idx ] = value;
			return this[ fn ]( local );
		};
	});
});

// add .fx.step functions
each( stepHooks, function( i, hook ) {
	jQuery.cssHooks[ hook ] = {
		set: function( elem, value ) {
			var parsed, curElem,
				backgroundColor = "";

			if ( jQuery.type( value ) !== "string" || ( parsed = stringParse( value ) ) ) {
				value = color( parsed || value );
				if ( !support.rgba && value._rgba[ 3 ] !== 1 ) {
					curElem = hook === "backgroundColor" ? elem.parentNode : elem;
					while (
						(backgroundColor === "" || backgroundColor === "transparent") &&
						curElem && curElem.style
					) {
						try {
							backgroundColor = jQuery.css( curElem, "backgroundColor" );
							curElem = curElem.parentNode;
						} catch ( e ) {
						}
					}

					value = value.blend( backgroundColor && backgroundColor !== "transparent" ?
						backgroundColor :
						"_default" );
				}

				value = value.toRgbaString();
			}
			try {
				elem.style[ hook ] = value;
			} catch( error ) {
				// wrapped to prevent IE from throwing errors on "invalid" values like 'auto' or 'inherit'
			}
		}
	};
	jQuery.fx.step[ hook ] = function( fx ) {
		if ( !fx.colorInit ) {
			fx.start = color( fx.elem, hook );
			fx.end = color( fx.end );
			fx.colorInit = true;
		}
		jQuery.cssHooks[ hook ].set( fx.elem, fx.start.transition( fx.end, fx.pos ) );
	};
});

jQuery.cssHooks.borderColor = {
	expand: function( value ) {
		var expanded = {};

		each( [ "Top", "Right", "Bottom", "Left" ], function( i, part ) {
			expanded[ "border" + part + "Color" ] = value;
		});
		return expanded;
	}
};

// Basic color names only.
// Usage of any of the other color names requires adding yourself or including
// jquery.color.svg-names.js.
colors = jQuery.Color.names = {
	// 4.1. Basic color keywords
	aqua: "#00ffff",
	black: "#000000",
	blue: "#0000ff",
	fuchsia: "#ff00ff",
	gray: "#808080",
	green: "#008000",
	lime: "#00ff00",
	maroon: "#800000",
	navy: "#000080",
	olive: "#808000",
	purple: "#800080",
	red: "#ff0000",
	silver: "#c0c0c0",
	teal: "#008080",
	white: "#ffffff",
	yellow: "#ffff00",

	// 4.2.3. "transparent" color keyword
	transparent: [ null, null, null, 0 ],

	_default: "#ffffff"
};

})( jQuery );



/******************************************************************************/
/****************************** CLASS ANIMATIONS ******************************/
/******************************************************************************/
(function() {

var classAnimationActions = [ "add", "remove", "toggle" ],
	shorthandStyles = {
		border: 1,
		borderBottom: 1,
		borderColor: 1,
		borderLeft: 1,
		borderRight: 1,
		borderTop: 1,
		borderWidth: 1,
		margin: 1,
		padding: 1
	};

$.each([ "borderLeftStyle", "borderRightStyle", "borderBottomStyle", "borderTopStyle" ], function( _, prop ) {
	$.fx.step[ prop ] = function( fx ) {
		if ( fx.end !== "none" && !fx.setAttr || fx.pos === 1 && !fx.setAttr ) {
			jQuery.style( fx.elem, prop, fx.end );
			fx.setAttr = true;
		}
	};
});

function getElementStyles() {
	var style = this.ownerDocument.defaultView ?
			this.ownerDocument.defaultView.getComputedStyle( this, null ) :
			this.currentStyle,
		newStyle = {},
		key,
		len;

	// webkit enumerates style porperties
	if ( style && style.length && style[ 0 ] && style[ style[ 0 ] ] ) {
		len = style.length;
		while ( len-- ) {
			key = style[ len ];
			if ( typeof style[ key ] === "string" ) {
				newStyle[ $.camelCase( key ) ] = style[ key ];
			}
		}
	} else {
		for ( key in style ) {
			if ( typeof style[ key ] === "string" ) {
				newStyle[ key ] = style[ key ];
			}
		}
	}

	return newStyle;
}


function styleDifference( oldStyle, newStyle ) {
	var diff = {},
		name, value;

	for ( name in newStyle ) {
		value = newStyle[ name ];
		if ( oldStyle[ name ] !== value ) {
			if ( !shorthandStyles[ name ] ) {
				if ( $.fx.step[ name ] || !isNaN( parseFloat( value ) ) ) {
					diff[ name ] = value;
				}
			}
		}
	}

	return diff;
}

$.effects.animateClass = function( value, duration, easing, callback ) {
	var o = $.speed( duration, easing, callback );

	return this.queue( function() {
		var animated = $( this ),
			baseClass = animated.attr( "class" ) || "",
			applyClassChange,
			allAnimations = o.children ? animated.find( "*" ).andSelf() : animated;

		// map the animated objects to store the original styles.
		allAnimations = allAnimations.map(function() {
			var el = $( this );
			return {
				el: el,
				start: getElementStyles.call( this )
			};
		});

		// apply class change
		applyClassChange = function() {
			$.each( classAnimationActions, function(i, action) {
				if ( value[ action ] ) {
					animated[ action + "Class" ]( value[ action ] );
				}
			});
		};
		applyClassChange();

		// map all animated objects again - calculate new styles and diff
		allAnimations = allAnimations.map(function() {
			this.end = getElementStyles.call( this.el[ 0 ] );
			this.diff = styleDifference( this.start, this.end );
			return this;
		});

		// apply original class
		animated.attr( "class", baseClass );

		// map all animated objects again - this time collecting a promise
		allAnimations = allAnimations.map(function() {
			var styleInfo = this,
				dfd = $.Deferred(),
				opts = jQuery.extend({}, o, {
					queue: false,
					complete: function() {
						dfd.resolve( styleInfo );
					}
				});

			this.el.animate( this.diff, opts );
			return dfd.promise();
		});

		// once all animations have completed:
		$.when.apply( $, allAnimations.get() ).done(function() {

			// set the final class
			applyClassChange();

			// for each animated element,
			// clear all css properties that were animated
			$.each( arguments, function() {
				var el = this.el;
				$.each( this.diff, function(key) {
					el.css( key, '' );
				});
			});

			// this is guarnteed to be there if you use jQuery.speed()
			// it also handles dequeuing the next anim...
			o.complete.call( animated[ 0 ] );
		});
	});
};

$.fn.extend({
	_addClass: $.fn.addClass,
	addClass: function( classNames, speed, easing, callback ) {
		return speed ?
			$.effects.animateClass.call( this,
				{ add: classNames }, speed, easing, callback ) :
			this._addClass( classNames );
	},

	_removeClass: $.fn.removeClass,
	removeClass: function( classNames, speed, easing, callback ) {
		return speed ?
			$.effects.animateClass.call( this,
				{ remove: classNames }, speed, easing, callback ) :
			this._removeClass( classNames );
	},

	_toggleClass: $.fn.toggleClass,
	toggleClass: function( classNames, force, speed, easing, callback ) {
		if ( typeof force === "boolean" || force === undefined ) {
			if ( !speed ) {
				// without speed parameter
				return this._toggleClass( classNames, force );
			} else {
				return $.effects.animateClass.call( this,
					(force ? { add: classNames } : { remove: classNames }),
					speed, easing, callback );
			}
		} else {
			// without force parameter
			return $.effects.animateClass.call( this,
				{ toggle: classNames }, force, speed, easing );
		}
	},

	switchClass: function( remove, add, speed, easing, callback) {
		return $.effects.animateClass.call( this, {
			add: add,
			remove: remove
		}, speed, easing, callback );
	}
});

})();

/******************************************************************************/
/*********************************** EFFECTS **********************************/
/******************************************************************************/

(function() {

$.extend( $.effects, {
	version: "1.9.2",

	// Saves a set of properties in a data storage
	save: function( element, set ) {
		for( var i=0; i < set.length; i++ ) {
			if ( set[ i ] !== null ) {
				element.data( dataSpace + set[ i ], element[ 0 ].style[ set[ i ] ] );
			}
		}
	},

	// Restores a set of previously saved properties from a data storage
	restore: function( element, set ) {
		var val, i;
		for( i=0; i < set.length; i++ ) {
			if ( set[ i ] !== null ) {
				val = element.data( dataSpace + set[ i ] );
				// support: jQuery 1.6.2
				// http://bugs.jquery.com/ticket/9917
				// jQuery 1.6.2 incorrectly returns undefined for any falsy value.
				// We can't differentiate between "" and 0 here, so we just assume
				// empty string since it's likely to be a more common value...
				if ( val === undefined ) {
					val = "";
				}
				element.css( set[ i ], val );
			}
		}
	},

	setMode: function( el, mode ) {
		if (mode === "toggle") {
			mode = el.is( ":hidden" ) ? "show" : "hide";
		}
		return mode;
	},

	// Translates a [top,left] array into a baseline value
	// this should be a little more flexible in the future to handle a string & hash
	getBaseline: function( origin, original ) {
		var y, x;
		switch ( origin[ 0 ] ) {
			case "top": y = 0; break;
			case "middle": y = 0.5; break;
			case "bottom": y = 1; break;
			default: y = origin[ 0 ] / original.height;
		}
		switch ( origin[ 1 ] ) {
			case "left": x = 0; break;
			case "center": x = 0.5; break;
			case "right": x = 1; break;
			default: x = origin[ 1 ] / original.width;
		}
		return {
			x: x,
			y: y
		};
	},

	// Wraps the element around a wrapper that copies position properties
	createWrapper: function( element ) {

		// if the element is already wrapped, return it
		if ( element.parent().is( ".ui-effects-wrapper" )) {
			return element.parent();
		}

		// wrap the element
		var props = {
				width: element.outerWidth(true),
				height: element.outerHeight(true),
				"float": element.css( "float" )
			},
			wrapper = $( "<div></div>" )
				.addClass( "ui-effects-wrapper" )
				.css({
					fontSize: "100%",
					background: "transparent",
					border: "none",
					margin: 0,
					padding: 0
				}),
			// Store the size in case width/height are defined in % - Fixes #5245
			size = {
				width: element.width(),
				height: element.height()
			},
			active = document.activeElement;

		// support: Firefox
		// Firefox incorrectly exposes anonymous content
		// https://bugzilla.mozilla.org/show_bug.cgi?id=561664
		try {
			active.id;
		} catch( e ) {
			active = document.body;
		}

		element.wrap( wrapper );

		// Fixes #7595 - Elements lose focus when wrapped.
		if ( element[ 0 ] === active || $.contains( element[ 0 ], active ) ) {
			$( active ).focus();
		}

		wrapper = element.parent(); //Hotfix for jQuery 1.4 since some change in wrap() seems to actually lose the reference to the wrapped element

		// transfer positioning properties to the wrapper
		if ( element.css( "position" ) === "static" ) {
			wrapper.css({ position: "relative" });
			element.css({ position: "relative" });
		} else {
			$.extend( props, {
				position: element.css( "position" ),
				zIndex: element.css( "z-index" )
			});
			$.each([ "top", "left", "bottom", "right" ], function(i, pos) {
				props[ pos ] = element.css( pos );
				if ( isNaN( parseInt( props[ pos ], 10 ) ) ) {
					props[ pos ] = "auto";
				}
			});
			element.css({
				position: "relative",
				top: 0,
				left: 0,
				right: "auto",
				bottom: "auto"
			});
		}
		element.css(size);

		return wrapper.css( props ).show();
	},

	removeWrapper: function( element ) {
		var active = document.activeElement;

		if ( element.parent().is( ".ui-effects-wrapper" ) ) {
			element.parent().replaceWith( element );

			// Fixes #7595 - Elements lose focus when wrapped.
			if ( element[ 0 ] === active || $.contains( element[ 0 ], active ) ) {
				$( active ).focus();
			}
		}


		return element;
	},

	setTransition: function( element, list, factor, value ) {
		value = value || {};
		$.each( list, function( i, x ) {
			var unit = element.cssUnit( x );
			if ( unit[ 0 ] > 0 ) {
				value[ x ] = unit[ 0 ] * factor + unit[ 1 ];
			}
		});
		return value;
	}
});

// return an effect options object for the given parameters:
function _normalizeArguments( effect, options, speed, callback ) {

	// allow passing all options as the first parameter
	if ( $.isPlainObject( effect ) ) {
		options = effect;
		effect = effect.effect;
	}

	// convert to an object
	effect = { effect: effect };

	// catch (effect, null, ...)
	if ( options == null ) {
		options = {};
	}

	// catch (effect, callback)
	if ( $.isFunction( options ) ) {
		callback = options;
		speed = null;
		options = {};
	}

	// catch (effect, speed, ?)
	if ( typeof options === "number" || $.fx.speeds[ options ] ) {
		callback = speed;
		speed = options;
		options = {};
	}

	// catch (effect, options, callback)
	if ( $.isFunction( speed ) ) {
		callback = speed;
		speed = null;
	}

	// add options to effect
	if ( options ) {
		$.extend( effect, options );
	}

	speed = speed || options.duration;
	effect.duration = $.fx.off ? 0 :
		typeof speed === "number" ? speed :
		speed in $.fx.speeds ? $.fx.speeds[ speed ] :
		$.fx.speeds._default;

	effect.complete = callback || options.complete;

	return effect;
}

function standardSpeed( speed ) {
	// valid standard speeds
	if ( !speed || typeof speed === "number" || $.fx.speeds[ speed ] ) {
		return true;
	}

	// invalid strings - treat as "normal" speed
	if ( typeof speed === "string" && !$.effects.effect[ speed ] ) {
		// TODO: remove in 2.0 (#7115)
		if ( backCompat && $.effects[ speed ] ) {
			return false;
		}
		return true;
	}

	return false;
}

$.fn.extend({
	effect: function( /* effect, options, speed, callback */ ) {
		var args = _normalizeArguments.apply( this, arguments ),
			mode = args.mode,
			queue = args.queue,
			effectMethod = $.effects.effect[ args.effect ],

			// DEPRECATED: remove in 2.0 (#7115)
			oldEffectMethod = !effectMethod && backCompat && $.effects[ args.effect ];

		if ( $.fx.off || !( effectMethod || oldEffectMethod ) ) {
			// delegate to the original method (e.g., .show()) if possible
			if ( mode ) {
				return this[ mode ]( args.duration, args.complete );
			} else {
				return this.each( function() {
					if ( args.complete ) {
						args.complete.call( this );
					}
				});
			}
		}

		function run( next ) {
			var elem = $( this ),
				complete = args.complete,
				mode = args.mode;

			function done() {
				if ( $.isFunction( complete ) ) {
					complete.call( elem[0] );
				}
				if ( $.isFunction( next ) ) {
					next();
				}
			}

			// if the element is hiddden and mode is hide,
			// or element is visible and mode is show
			if ( elem.is( ":hidden" ) ? mode === "hide" : mode === "show" ) {
				done();
			} else {
				effectMethod.call( elem[0], args, done );
			}
		}

		// TODO: remove this check in 2.0, effectMethod will always be true
		if ( effectMethod ) {
			return queue === false ? this.each( run ) : this.queue( queue || "fx", run );
		} else {
			// DEPRECATED: remove in 2.0 (#7115)
			return oldEffectMethod.call(this, {
				options: args,
				duration: args.duration,
				callback: args.complete,
				mode: args.mode
			});
		}
	},

	_show: $.fn.show,
	show: function( speed ) {
		if ( standardSpeed( speed ) ) {
			return this._show.apply( this, arguments );
		} else {
			var args = _normalizeArguments.apply( this, arguments );
			args.mode = "show";
			return this.effect.call( this, args );
		}
	},

	_hide: $.fn.hide,
	hide: function( speed ) {
		if ( standardSpeed( speed ) ) {
			return this._hide.apply( this, arguments );
		} else {
			var args = _normalizeArguments.apply( this, arguments );
			args.mode = "hide";
			return this.effect.call( this, args );
		}
	},

	// jQuery core overloads toggle and creates _toggle
	__toggle: $.fn.toggle,
	toggle: function( speed ) {
		if ( standardSpeed( speed ) || typeof speed === "boolean" || $.isFunction( speed ) ) {
			return this.__toggle.apply( this, arguments );
		} else {
			var args = _normalizeArguments.apply( this, arguments );
			args.mode = "toggle";
			return this.effect.call( this, args );
		}
	},

	// helper functions
	cssUnit: function(key) {
		var style = this.css( key ),
			val = [];

		$.each( [ "em", "px", "%", "pt" ], function( i, unit ) {
			if ( style.indexOf( unit ) > 0 ) {
				val = [ parseFloat( style ), unit ];
			}
		});
		return val;
	}
});

})();

/******************************************************************************/
/*********************************** EASING ***********************************/
/******************************************************************************/

(function() {

// based on easing equations from Robert Penner (http://www.robertpenner.com/easing)

var baseEasings = {};

$.each( [ "Quad", "Cubic", "Quart", "Quint", "Expo" ], function( i, name ) {
	baseEasings[ name ] = function( p ) {
		return Math.pow( p, i + 2 );
	};
});

$.extend( baseEasings, {
	Sine: function ( p ) {
		return 1 - Math.cos( p * Math.PI / 2 );
	},
	Circ: function ( p ) {
		return 1 - Math.sqrt( 1 - p * p );
	},
	Elastic: function( p ) {
		return p === 0 || p === 1 ? p :
			-Math.pow( 2, 8 * (p - 1) ) * Math.sin( ( (p - 1) * 80 - 7.5 ) * Math.PI / 15 );
	},
	Back: function( p ) {
		return p * p * ( 3 * p - 2 );
	},
	Bounce: function ( p ) {
		var pow2,
			bounce = 4;

		while ( p < ( ( pow2 = Math.pow( 2, --bounce ) ) - 1 ) / 11 ) {}
		return 1 / Math.pow( 4, 3 - bounce ) - 7.5625 * Math.pow( ( pow2 * 3 - 2 ) / 22 - p, 2 );
	}
});

$.each( baseEasings, function( name, easeIn ) {
	$.easing[ "easeIn" + name ] = easeIn;
	$.easing[ "easeOut" + name ] = function( p ) {
		return 1 - easeIn( 1 - p );
	};
	$.easing[ "easeInOut" + name ] = function( p ) {
		return p < 0.5 ?
			easeIn( p * 2 ) / 2 :
			1 - easeIn( p * -2 + 2 ) / 2;
	};
});

})();

})(jQuery));
(function( $, undefined ) {

$.effects.effect.slide = function( o, done ) {

	// Create element
	var el = $( this ),
		props = [ "position", "top", "bottom", "left", "right", "width", "height" ],
		mode = $.effects.setMode( el, o.mode || "show" ),
		show = mode === "show",
		direction = o.direction || "left",
		ref = (direction === "up" || direction === "down") ? "top" : "left",
		positiveMotion = (direction === "up" || direction === "left"),
		distance,
		animation = {};

	// Adjust
	$.effects.save( el, props );
	el.show();
	distance = o.distance || el[ ref === "top" ? "outerHeight" : "outerWidth" ]( true );

	$.effects.createWrapper( el ).css({
		overflow: "hidden"
	});

	if ( show ) {
		el.css( ref, positiveMotion ? (isNaN(distance) ? "-" + distance : -distance) : distance );
	}

	// Animation
	animation[ ref ] = ( show ?
		( positiveMotion ? "+=" : "-=") :
		( positiveMotion ? "-=" : "+=")) +
		distance;

	// Animate
	el.animate( animation, {
		queue: false,
		duration: o.duration,
		easing: o.easing,
		complete: function() {
			if ( mode === "hide" ) {
				el.hide();
			}
			$.effects.restore( el, props );
			$.effects.removeWrapper( el );
			done();
		}
	});
};

})(jQuery);
/*
 * jQuery Templating Plugin
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */
(function( jQuery, undefined ){
	var oldManip = jQuery.fn.domManip, tmplItmAtt = "_tmplitem", htmlExpr = /^[^<]*(<[\w\W]+>)[^>]*$|\{\{\! /,
		newTmplItems = {}, wrappedItems = {}, appendToTmplItems, topTmplItem = { key: 0, data: {} }, itemKey = 0, cloneIndex = 0, stack = [];

	function newTmplItem( options, parentItem, fn, data ) {
		// Returns a template item data structure for a new rendered instance of a template (a 'template item').
		// The content field is a hierarchical array of strings and nested items (to be
		// removed and replaced by nodes field of dom elements, once inserted in DOM).
		var newItem = {
			data: data || (parentItem ? parentItem.data : {}),
			_wrap: parentItem ? parentItem._wrap : null,
			tmpl: null,
			parent: parentItem || null,
			nodes: [],
			calls: tiCalls,
			nest: tiNest,
			wrap: tiWrap,
			html: tiHtml,
			update: tiUpdate
		};
		if ( options ) {
			jQuery.extend( newItem, options, { nodes: [], parent: parentItem } );
		}
		if ( fn ) {
			// Build the hierarchical content to be used during insertion into DOM
			newItem.tmpl = fn;
			newItem._ctnt = newItem._ctnt || newItem.tmpl( jQuery, newItem );
			newItem.key = ++itemKey;
			// Keep track of new template item, until it is stored as jQuery Data on DOM element
			(stack.length ? wrappedItems : newTmplItems)[itemKey] = newItem;
		}
		return newItem;
	}

	// Override appendTo etc., in order to provide support for targeting multiple elements. (This code would disappear if integrated in jquery core).
	jQuery.each({
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after",
		replaceAll: "replaceWith"
	}, function( name, original ) {
		jQuery.fn[ name ] = function( selector ) {
			var ret = [], insert = jQuery( selector ), elems, i, l, tmplItems,
				parent = this.length === 1 && this[0].parentNode;

			appendToTmplItems = newTmplItems || {};
			if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
				insert[ original ]( this[0] );
				ret = this;
			} else {
				for ( i = 0, l = insert.length; i < l; i++ ) {
					cloneIndex = i;
					elems = (i > 0 ? this.clone(true) : this).get();
					jQuery.fn[ original ].apply( jQuery(insert[i]), elems );
					ret = ret.concat( elems );
				}
				cloneIndex = 0;
				ret = this.pushStack( ret, name, insert.selector );
			}
			tmplItems = appendToTmplItems;
			appendToTmplItems = null;
			jQuery.tmpl.complete( tmplItems );
			return ret;
		};
	});

	jQuery.fn.extend({
		// Use first wrapped element as template markup.
		// Return wrapped set of template items, obtained by rendering template against data.
		tmpl: function( data, options, parentItem ) {
			return jQuery.tmpl( this[0], data, options, parentItem );
		},

		// Find which rendered template item the first wrapped DOM element belongs to
		tmplItem: function() {
			return jQuery.tmplItem( this[0] );
		},

		// Consider the first wrapped element as a template declaration, and get the compiled template or store it as a named template.
		template: function( name ) {
			return jQuery.template( name, this[0] );
		},

		domManip: function( args, table, callback, options ) {
			// This appears to be a bug in the appendTo, etc. implementation
			// it should be doing .call() instead of .apply(). See #6227
			if ( args[0] && args[0].nodeType ) {
				var dmArgs = jQuery.makeArray( arguments ), argsLength = args.length, i = 0, tmplItem;
				while ( i < argsLength && !(tmplItem = jQuery.data( args[i++], "tmplItem" ))) {}
				if ( argsLength > 1 ) {
					dmArgs[0] = [jQuery.makeArray( args )];
				}
				if ( tmplItem && cloneIndex ) {
					dmArgs[2] = function( fragClone ) {
						// Handler called by oldManip when rendered template has been inserted into DOM.
						jQuery.tmpl.afterManip( this, fragClone, callback );
					};
				}
				oldManip.apply( this, dmArgs );
			} else {
				oldManip.apply( this, arguments );
			}
			cloneIndex = 0;
			if ( !appendToTmplItems ) {
				jQuery.tmpl.complete( newTmplItems );
			}
			return this;
		}
	});

	jQuery.extend({
		// Return wrapped set of template items, obtained by rendering template against data.
		tmpl: function( tmpl, data, options, parentItem ) {
			var ret, topLevel = !parentItem;
			if ( topLevel ) {
				// This is a top-level tmpl call (not from a nested template using {{tmpl}})
				parentItem = topTmplItem;
				tmpl = jQuery.template[tmpl] || jQuery.template( null, tmpl );
				wrappedItems = {}; // Any wrapped items will be rebuilt, since this is top level
			} else if ( !tmpl ) {
				// The template item is already associated with DOM - this is a refresh.
				// Re-evaluate rendered template for the parentItem
				tmpl = parentItem.tmpl;
				newTmplItems[parentItem.key] = parentItem;
				parentItem.nodes = [];
				if ( parentItem.wrapped ) {
					updateWrapped( parentItem, parentItem.wrapped );
				}
				// Rebuild, without creating a new template item
				return jQuery( build( parentItem, null, parentItem.tmpl( jQuery, parentItem ) ));
			}
			if ( !tmpl ) {
				return []; // Could throw...
			}
			if ( typeof data === "function" ) {
				data = data.call( parentItem || {} );
			}
			if ( options && options.wrapped ) {
				updateWrapped( options, options.wrapped );
			}
			ret = jQuery.isArray( data ) ? 
				jQuery.map( data, function( dataItem ) {
					return dataItem ? newTmplItem( options, parentItem, tmpl, dataItem ) : null;
				}) :
				[ newTmplItem( options, parentItem, tmpl, data ) ];
			return topLevel ? jQuery( build( parentItem, null, ret ) ) : ret;
		},

		// Return rendered template item for an element.
		tmplItem: function( elem ) {
			var tmplItem;
			if ( elem instanceof jQuery ) {
				elem = elem[0];
			}
			while ( elem && elem.nodeType === 1 && !(tmplItem = jQuery.data( elem, "tmplItem" )) && (elem = elem.parentNode) ) {}
			return tmplItem || topTmplItem;
		},

		// Set:
		// Use $.template( name, tmpl ) to cache a named template,
		// where tmpl is a template string, a script element or a jQuery instance wrapping a script element, etc.
		// Use $( "selector" ).template( name ) to provide access by name to a script block template declaration.

		// Get:
		// Use $.template( name ) to access a cached template.
		// Also $( selectorToScriptBlock ).template(), or $.template( null, templateString )
		// will return the compiled template, without adding a name reference.
		// If templateString includes at least one HTML tag, $.template( templateString ) is equivalent
		// to $.template( null, templateString )
		template: function( name, tmpl ) {
			if (tmpl) {
				// Compile template and associate with name
				if ( typeof tmpl === "string" ) {
					// This is an HTML string being passed directly in.
					tmpl = buildTmplFn( tmpl )
				} else if ( tmpl instanceof jQuery ) {
					tmpl = tmpl[0] || {};
				}
				if ( tmpl.nodeType ) {
					// If this is a template block, use cached copy, or generate tmpl function and cache.
					tmpl = jQuery.data( tmpl, "tmpl" ) || jQuery.data( tmpl, "tmpl", buildTmplFn( tmpl.innerHTML ));
				}
				return typeof name === "string" ? (jQuery.template[name] = tmpl) : tmpl;
			}
			// Return named compiled template
			return name ? (typeof name !== "string" ? jQuery.template( null, name ): 
				(jQuery.template[name] || 
					// If not in map, treat as a selector. (If integrated with core, use quickExpr.exec) 
					jQuery.template( null, htmlExpr.test( name ) ? name : jQuery( name )))) : null; 
		},

		encode: function( text ) {
			// Do HTML encoding replacing < > & and ' and " by corresponding entities.
			return ("" + text).split("<").join("&lt;").split(">").join("&gt;").split('"').join("&#34;").split("'").join("&#39;");
		}
	});

	jQuery.extend( jQuery.tmpl, {
		tag: {
			"tmpl": {
				_default: { $2: "null" },
				open: "if($notnull_1){_=_.concat($item.nest($1,$2));}"
				// tmpl target parameter can be of type function, so use $1, not $1a (so not auto detection of functions)
				// This means that {{tmpl foo}} treats foo as a template (which IS a function). 
				// Explicit parens can be used if foo is a function that returns a template: {{tmpl foo()}}.
			},
			"wrap": {
				_default: { $2: "null" },
				open: "$item.calls(_,$1,$2);_=[];",
				close: "call=$item.calls();_=call._.concat($item.wrap(call,_));"
			},
			"each": {
				_default: { $2: "$index, $value" },
				open: "if($notnull_1){$.each($1a,function($2){with(this){",
				close: "}});}"
			},
			"if": {
				open: "if(($notnull_1) && $1a){",
				close: "}"
			},
			"else": {
				_default: { $1: "true" },
				open: "}else if(($notnull_1) && $1a){"
			},
			"html": {
				// Unecoded expression evaluation. 
				open: "if($notnull_1){_.push($1a);}"
			},
			"=": {
				// Encoded expression evaluation. Abbreviated form is ${}.
				_default: { $1: "$data" },
				open: "if($notnull_1){_.push($.encode($1a));}"
			},
			"!": {
				// Comment tag. Skipped by parser
				open: ""
			}
		},

		// This stub can be overridden, e.g. in jquery.tmplPlus for providing rendered events
		complete: function( items ) {
			newTmplItems = {};
		},

		// Call this from code which overrides domManip, or equivalent
		// Manage cloning/storing template items etc.
		afterManip: function afterManip( elem, fragClone, callback ) {
			// Provides cloned fragment ready for fixup prior to and after insertion into DOM
			var content = fragClone.nodeType === 11 ?
				jQuery.makeArray(fragClone.childNodes) :
				fragClone.nodeType === 1 ? [fragClone] : [];

			// Return fragment to original caller (e.g. append) for DOM insertion
			callback.call( elem, fragClone );

			// Fragment has been inserted:- Add inserted nodes to tmplItem data structure. Replace inserted element annotations by jQuery.data.
			storeTmplItems( content );
			cloneIndex++;
		}
	});

	//========================== Private helper functions, used by code above ==========================

	function build( tmplItem, nested, content ) {
		// Convert hierarchical content into flat string array 
		// and finally return array of fragments ready for DOM insertion
		var frag, ret = content ? jQuery.map( content, function( item ) {
			return (typeof item === "string") ? 
				// Insert template item annotations, to be converted to jQuery.data( "tmplItem" ) when elems are inserted into DOM.
				(tmplItem.key ? item.replace( /(<\w+)(?=[\s>])(?![^>]*_tmplitem)([^>]*)/g, "$1 " + tmplItmAtt + "=\"" + tmplItem.key + "\" $2" ) : item) :
				// This is a child template item. Build nested template.
				build( item, tmplItem, item._ctnt );
		}) : 
		// If content is not defined, insert tmplItem directly. Not a template item. May be a string, or a string array, e.g. from {{html $item.html()}}. 
		tmplItem;
		if ( nested ) {
			return ret;
		}

		// top-level template
		ret = ret.join("");

		// Support templates which have initial or final text nodes, or consist only of text
		// Also support HTML entities within the HTML markup.
		ret.replace( /^\s*([^<\s][^<]*)?(<[\w\W]+>)([^>]*[^>\s])?\s*$/, function( all, before, middle, after) {
			frag = jQuery( middle ).get();

			storeTmplItems( frag );
			if ( before ) {
				frag = unencode( before ).concat(frag);
			}
			if ( after ) {
				frag = frag.concat(unencode( after ));
			}
		});
		return frag ? frag : unencode( ret );
	}

	function unencode( text ) {
		// Use createElement, since createTextNode will not render HTML entities correctly
		var el = document.createElement( "div" );
		el.innerHTML = text;
		return jQuery.makeArray(el.childNodes);
	}

	// Generate a reusable function that will serve to render a template against data
	function buildTmplFn( markup ) {
		return new Function("jQuery","$item",
			"var $=jQuery,call,_=[],$data=$item.data;" +

			// Introduce the data as local variables using with(){}
			"with($data){_.push('" +

			// Convert the template into pure JavaScript
			jQuery.trim(markup)
				.replace( /([\\'])/g, "\\$1" )
				.replace( /[\r\t\n]/g, " " )
				.replace( /\$\{([^\}]*)\}/g, "{{= $1}}" )
				.replace( /\{\{(\/?)(\w+|.)(?:\(((?:[^\}]|\}(?!\}))*?)?\))?(?:\s+(.*?)?)?(\(((?:[^\}]|\}(?!\}))*?)\))?\s*\}\}/g,
				function( all, slash, type, fnargs, target, parens, args ) {
					var tag = jQuery.tmpl.tag[ type ], def, expr, exprAutoFnDetect;
					if ( !tag ) {
						throw "Template command not found: " + type;
					}
					def = tag._default || [];
					if ( parens && !/\w$/.test(target)) {
						target += parens;
						parens = "";
					}
					if ( target ) {
						target = unescape( target ); 
						args = args ? ("," + unescape( args ) + ")") : (parens ? ")" : "");
						// Support for target being things like a.toLowerCase();
						// In that case don't call with template item as 'this' pointer. Just evaluate...
						expr = parens ? (target.indexOf(".") > -1 ? target + parens : ("(" + target + ").call($item" + args)) : target;
						exprAutoFnDetect = parens ? expr : "(typeof(" + target + ")==='function'?(" + target + ").call($item):(" + target + "))";
					} else {
						exprAutoFnDetect = expr = def.$1 || "null";
					}
					fnargs = unescape( fnargs );
					return "');" + 
						tag[ slash ? "close" : "open" ]
							.split( "$notnull_1" ).join( target ? "typeof(" + target + ")!=='undefined' && (" + target + ")!=null" : "true" )
							.split( "$1a" ).join( exprAutoFnDetect )
							.split( "$1" ).join( expr )
							.split( "$2" ).join( fnargs ?
								fnargs.replace( /\s*([^\(]+)\s*(\((.*?)\))?/g, function( all, name, parens, params ) {
									params = params ? ("," + params + ")") : (parens ? ")" : "");
									return params ? ("(" + name + ").call($item" + params) : all;
								})
								: (def.$2||"")
							) +
						"_.push('";
				}) +
			"');}return _;"
		);
	}
	function updateWrapped( options, wrapped ) {
		// Build the wrapped content. 
		options._wrap = build( options, true, 
			// Suport imperative scenario in which options.wrapped can be set to a selector or an HTML string.
			jQuery.isArray( wrapped ) ? wrapped : [htmlExpr.test( wrapped ) ? wrapped : jQuery( wrapped ).html()]
		).join("");
	}

	function unescape( args ) {
		return args ? args.replace( /\\'/g, "'").replace(/\\\\/g, "\\" ) : null;
	}
	function outerHtml( elem ) {
		var div = document.createElement("div");
		div.appendChild( elem.cloneNode(true) );
		return div.innerHTML;
	}

	// Store template items in jQuery.data(), ensuring a unique tmplItem data data structure for each rendered template instance.
	function storeTmplItems( content ) {
		var keySuffix = "_" + cloneIndex, elem, elems, newClonedItems = {}, i, l, m;
		for ( i = 0, l = content.length; i < l; i++ ) {
			if ( (elem = content[i]).nodeType !== 1 ) {
				continue;
			}
			elems = elem.getElementsByTagName("*");
			for ( m = elems.length - 1; m >= 0; m-- ) {
				processItemKey( elems[m] );
			}
			processItemKey( elem );
		}
		function processItemKey( el ) {
			var pntKey, pntNode = el, pntItem, tmplItem, key;
			// Ensure that each rendered template inserted into the DOM has its own template item,
			if ( (key = el.getAttribute( tmplItmAtt ))) {
				while ( pntNode.parentNode && (pntNode = pntNode.parentNode).nodeType === 1 && !(pntKey = pntNode.getAttribute( tmplItmAtt ))) { }
				if ( pntKey !== key ) {
					// The next ancestor with a _tmplitem expando is on a different key than this one.
					// So this is a top-level element within this template item
					// Set pntNode to the key of the parentNode, or to 0 if pntNode.parentNode is null, or pntNode is a fragment.
					pntNode = pntNode.parentNode ? (pntNode.nodeType === 11 ? 0 : (pntNode.getAttribute( tmplItmAtt ) || 0)) : 0;
					if ( !(tmplItem = newTmplItems[key]) ) {
						// The item is for wrapped content, and was copied from the temporary parent wrappedItem.
						tmplItem = wrappedItems[key];
						tmplItem = newTmplItem( tmplItem, newTmplItems[pntNode]||wrappedItems[pntNode], null, true );
						tmplItem.key = ++itemKey;
						newTmplItems[itemKey] = tmplItem;
					}
					if ( cloneIndex ) {
						cloneTmplItem( key );
					}
				}
				el.removeAttribute( tmplItmAtt );
			} else if ( cloneIndex && (tmplItem = jQuery.data( el, "tmplItem" )) ) {
				// This was a rendered element, cloned during append or appendTo etc.
				// TmplItem stored in jQuery data has already been cloned in cloneCopyEvent. We must replace it with a fresh cloned tmplItem.
				cloneTmplItem( tmplItem.key );
				newTmplItems[tmplItem.key] = tmplItem;
				pntNode = jQuery.data( el.parentNode, "tmplItem" );
				pntNode = pntNode ? pntNode.key : 0;
			}
			if ( tmplItem ) {
				pntItem = tmplItem;
				// Find the template item of the parent element. 
				// (Using !=, not !==, since pntItem.key is number, and pntNode may be a string)
				while ( pntItem && pntItem.key != pntNode ) { 
					// Add this element as a top-level node for this rendered template item, as well as for any
					// ancestor items between this item and the item of its parent element
					pntItem.nodes.push( el );
					pntItem = pntItem.parent;
				}
				// Delete content built during rendering - reduce API surface area and memory use, and avoid exposing of stale data after rendering...
				delete tmplItem._ctnt;
				delete tmplItem._wrap;
				// Store template item as jQuery data on the element
				jQuery.data( el, "tmplItem", tmplItem );
			}
			function cloneTmplItem( key ) {
				key = key + keySuffix;
				tmplItem = newClonedItems[key] = 
					(newClonedItems[key] || newTmplItem( tmplItem, newTmplItems[tmplItem.parent.key + keySuffix] || tmplItem.parent, null, true ));
			}
		}
	}

	//---- Helper functions for template item ----

	function tiCalls( content, tmpl, data, options ) {
		if ( !content ) {
			return stack.pop();
		}
		stack.push({ _: content, tmpl: tmpl, item:this, data: data, options: options });
	}

	function tiNest( tmpl, data, options ) {
		// nested template, using {{tmpl}} tag
		return jQuery.tmpl( jQuery.template( tmpl ), data, options, this );
	}

	function tiWrap( call, wrapped ) {
		// nested template, using {{wrap}} tag
		var options = call.options || {};
		options.wrapped = wrapped;
		// Apply the template, which may incorporate wrapped content, 
		return jQuery.tmpl( jQuery.template( call.tmpl ), call.data, options, call.item );
	}

	function tiHtml( filter, textOnly ) {
		var wrapped = this._wrap;
		return jQuery.map(
			jQuery( jQuery.isArray( wrapped ) ? wrapped.join("") : wrapped ).filter( filter || "*" ),
			function(e) {
				return textOnly ?
					e.innerText || e.textContent :
					e.outerHTML || outerHtml(e);
			});
	}

	function tiUpdate() {
		var coll = this.nodes;
		jQuery.tmpl( null, null, null, this).insertBefore( coll[0] );
		jQuery( coll ).remove();
	}
})( jQuery );
/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};

/*
 * Copyright (c) 2007 Josh Bush (digitalbush.com)
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:

 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE. 
 */
 
/*
 * Version: Beta 1
 * Release: 2007-06-01
 */ 
(function($) {
	var map = [];
	$.Watermark = {
		ShowAll:function(){
			for (var i=0;i<map.length;i++) {
				if (map[i].obj.val() == "") {
					map[i].obj.val(map[i].text);					
					map[i].obj.css("color", map[i].WatermarkColor);
				} else {
				    map[i].obj.css("color", map[i].DefaultColor);
				}
			}
		},
		HideAll:function(){
			for (var i=0;i<map.length;i++){
				if(map[i].obj.val()==map[i].text) {
					map[i].obj.val("");
				}
			}
		}
	}
	
	$.fn.Watermark = function(text,color) {
		if (!color) color = "#aaa";
		return this.each(
			function() {		
				var input = $(this);
				var defaultColor = input.css("color");
				map[map.length] = {
					text			: 	text,
					obj				: 	input,
					DefaultColor 	: 	defaultColor,
					WatermarkColor 	: 	color
				};

				function clearMessage(){
					if (input.val() == text) {
						input.val("");						
					}
					input.css("color", defaultColor);
				}

				function insertMessage() {
					if(input.val().length == 0 || input.val() == text){
						input.val(text);
						input.css("color",color);	
					} else {
						input.css("color",defaultColor);
					}
				}

				input.focus(clearMessage);
				input.blur(insertMessage);								
				input.change(insertMessage);
				
				insertMessage();
			}
		);
	};
})(jQuery);
/*! jQuery Validation Plugin - v1.10.0 - 9/7/2012
* https://github.com/jzaefferer/jquery-validation
* Copyright (c) 2012 Jörn Zaefferer; Licensed MIT, GPL */

(function($) {

$.extend($.fn, {
	// http://docs.jquery.com/Plugins/Validation/validate
	validate: function( options ) {

		// if nothing is selected, return nothing; can't chain anyway
		if (!this.length) {
			if (options && options.debug && window.console) {
				console.warn( "nothing selected, can't validate, returning nothing" );
			}
			return;
		}

		// check if a validator for this form was already created
		var validator = $.data(this[0], 'validator');
		if ( validator ) {
			return validator;
		}

		// Add novalidate tag if HTML5.
		this.attr('novalidate', 'novalidate');

		validator = new $.validator( options, this[0] );
		$.data(this[0], 'validator', validator);

		if ( validator.settings.onsubmit ) {

			this.validateDelegate( ":submit", "click", function(ev) {
				if ( validator.settings.submitHandler ) {
					validator.submitButton = ev.target;
				}
				// allow suppressing validation by adding a cancel class to the submit button
				if ( $(ev.target).hasClass('cancel') ) {
					validator.cancelSubmit = true;
				}
			});

			// validate the form on submit
			this.submit( function( event ) {
				if ( validator.settings.debug ) {
					// prevent form submit to be able to see console output
					event.preventDefault();
				}
				function handle() {
					var hidden;
					if ( validator.settings.submitHandler ) {
						if (validator.submitButton) {
							// insert a hidden input as a replacement for the missing submit button
							hidden = $("<input type='hidden'/>").attr("name", validator.submitButton.name).val(validator.submitButton.value).appendTo(validator.currentForm);
						}
						validator.settings.submitHandler.call( validator, validator.currentForm, event );
						if (validator.submitButton) {
							// and clean up afterwards; thanks to no-block-scope, hidden can be referenced
							hidden.remove();
						}
						return false;
					}
					return true;
				}

				// prevent submit for invalid forms or custom submit handlers
				if ( validator.cancelSubmit ) {
					validator.cancelSubmit = false;
					return handle();
				}
				if ( validator.form() ) {
					if ( validator.pendingRequest ) {
						validator.formSubmitted = true;
						return false;
					}
					return handle();
				} else {
					validator.focusInvalid();
					return false;
				}
			});
		}

		return validator;
	},
	// http://docs.jquery.com/Plugins/Validation/valid
	valid: function() {
		if ( $(this[0]).is('form')) {
			return this.validate().form();
		} else {
			var valid = true;
			var validator = $(this[0].form).validate();
			this.each(function() {
				valid &= validator.element(this);
			});
			return valid;
		}
	},
	// attributes: space seperated list of attributes to retrieve and remove
	removeAttrs: function(attributes) {
		var result = {},
			$element = this;
		$.each(attributes.split(/\s/), function(index, value) {
			result[value] = $element.attr(value);
			$element.removeAttr(value);
		});
		return result;
	},
	// http://docs.jquery.com/Plugins/Validation/rules
	rules: function(command, argument) {
		var element = this[0];

		if (command) {
			var settings = $.data(element.form, 'validator').settings;
			var staticRules = settings.rules;
			var existingRules = $.validator.staticRules(element);
			switch(command) {
			case "add":
				$.extend(existingRules, $.validator.normalizeRule(argument));
				staticRules[element.name] = existingRules;
				if (argument.messages) {
					settings.messages[element.name] = $.extend( settings.messages[element.name], argument.messages );
				}
				break;
			case "remove":
				if (!argument) {
					delete staticRules[element.name];
					return existingRules;
				}
				var filtered = {};
				$.each(argument.split(/\s/), function(index, method) {
					filtered[method] = existingRules[method];
					delete existingRules[method];
				});
				return filtered;
			}
		}

		var data = $.validator.normalizeRules(
		$.extend(
			{},
			$.validator.metadataRules(element),
			$.validator.classRules(element),
			$.validator.attributeRules(element),
			$.validator.staticRules(element)
		), element);

		// make sure required is at front
		if (data.required) {
			var param = data.required;
			delete data.required;
			data = $.extend({required: param}, data);
		}

		return data;
	}
});

// Custom selectors
$.extend($.expr[":"], {
	// http://docs.jquery.com/Plugins/Validation/blank
	blank: function(a) {return !$.trim("" + a.value);},
	// http://docs.jquery.com/Plugins/Validation/filled
	filled: function(a) {return !!$.trim("" + a.value);},
	// http://docs.jquery.com/Plugins/Validation/unchecked
	unchecked: function(a) {return !a.checked;}
});

// constructor for validator
$.validator = function( options, form ) {
	this.settings = $.extend( true, {}, $.validator.defaults, options );
	this.currentForm = form;
	this.init();
};

$.validator.format = function(source, params) {
	if ( arguments.length === 1 ) {
		return function() {
			var args = $.makeArray(arguments);
			args.unshift(source);
			return $.validator.format.apply( this, args );
		};
	}
	if ( arguments.length > 2 && params.constructor !== Array  ) {
		params = $.makeArray(arguments).slice(1);
	}
	if ( params.constructor !== Array ) {
		params = [ params ];
	}
	$.each(params, function(i, n) {
		source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
	});
	return source;
};

$.extend($.validator, {

	defaults: {
		messages: {},
		groups: {},
		rules: {},
		errorClass: "error",
		validClass: "valid",
		errorElement: "label",
		focusInvalid: true,
		errorContainer: $( [] ),
		errorLabelContainer: $( [] ),
		onsubmit: true,
		ignore: ":hidden",
		ignoreTitle: false,
		onfocusin: function(element, event) {
			this.lastActive = element;

			// hide error label and remove error class on focus if enabled
			if ( this.settings.focusCleanup && !this.blockFocusCleanup ) {
				if ( this.settings.unhighlight ) {
					this.settings.unhighlight.call( this, element, this.settings.errorClass, this.settings.validClass );
				}
				this.addWrapper(this.errorsFor(element)).hide();
			}
		},
		onfocusout: function(element, event) {
			if ( !this.checkable(element) && (element.name in this.submitted || !this.optional(element)) ) {
				this.element(element);
			}
		},
		onkeyup: function(element, event) {
			if ( event.which === 9 && this.elementValue(element) === '' ) {
				return;
			} else if ( element.name in this.submitted || element === this.lastActive ) {
				this.element(element);
			}
		},
		onclick: function(element, event) {
			// click on selects, radiobuttons and checkboxes
			if ( element.name in this.submitted ) {
				this.element(element);
			}
			// or option elements, check parent select in that case
			else if (element.parentNode.name in this.submitted) {
				this.element(element.parentNode);
			}
		},
		highlight: function(element, errorClass, validClass) {
			if (element.type === 'radio') {
				this.findByName(element.name).addClass(errorClass).removeClass(validClass);
			} else {
				$(element).addClass(errorClass).removeClass(validClass);
			}
		},
		unhighlight: function(element, errorClass, validClass) {
			if (element.type === 'radio') {
				this.findByName(element.name).removeClass(errorClass).addClass(validClass);
			} else {
				$(element).removeClass(errorClass).addClass(validClass);
			}
		}
	},

	// http://docs.jquery.com/Plugins/Validation/Validator/setDefaults
	setDefaults: function(settings) {
		$.extend( $.validator.defaults, settings );
	},

	messages: {
		required: "This field is required.",
		remote: "Please fix this field.",
		email: "Please enter a valid email address.",
		url: "Please enter a valid URL.",
		date: "Please enter a valid date.",
		dateISO: "Please enter a valid date (ISO).",
		number: "Please enter a valid number.",
		digits: "Please enter only digits.",
		creditcard: "Please enter a valid credit card number.",
		equalTo: "Please enter the same value again.",
		maxlength: $.validator.format("Please enter no more than {0} characters."),
		minlength: $.validator.format("Please enter at least {0} characters."),
		rangelength: $.validator.format("Please enter a value between {0} and {1} characters long."),
		range: $.validator.format("Please enter a value between {0} and {1}."),
		max: $.validator.format("Please enter a value less than or equal to {0}."),
		min: $.validator.format("Please enter a value greater than or equal to {0}.")
	},

	autoCreateRanges: false,

	prototype: {

		init: function() {
			this.labelContainer = $(this.settings.errorLabelContainer);
			this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm);
			this.containers = $(this.settings.errorContainer).add( this.settings.errorLabelContainer );
			this.submitted = {};
			this.valueCache = {};
			this.pendingRequest = 0;
			this.pending = {};
			this.invalid = {};
			this.reset();

			var groups = (this.groups = {});
			$.each(this.settings.groups, function(key, value) {
				$.each(value.split(/\s/), function(index, name) {
					groups[name] = key;
				});
			});
			var rules = this.settings.rules;
			$.each(rules, function(key, value) {
				rules[key] = $.validator.normalizeRule(value);
			});

			function delegate(event) {
				var validator = $.data(this[0].form, "validator"),
					eventType = "on" + event.type.replace(/^validate/, "");
				if (validator.settings[eventType]) {
					validator.settings[eventType].call(validator, this[0], event);
				}
			}
			$(this.currentForm)
				.validateDelegate(":text, [type='password'], [type='file'], select, textarea, " +
					"[type='number'], [type='search'] ,[type='tel'], [type='url'], " +
					"[type='email'], [type='datetime'], [type='date'], [type='month'], " +
					"[type='week'], [type='time'], [type='datetime-local'], " +
					"[type='range'], [type='color'] ",
					"focusin focusout keyup", delegate)
				.validateDelegate("[type='radio'], [type='checkbox'], select, option", "click", delegate);

			if (this.settings.invalidHandler) {
				$(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler);
			}
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/form
		form: function() {
			this.checkForm();
			$.extend(this.submitted, this.errorMap);
			this.invalid = $.extend({}, this.errorMap);
			if (!this.valid()) {
				$(this.currentForm).triggerHandler("invalid-form", [this]);
			}
			this.showErrors();
			return this.valid();
		},

		checkForm: function() {
			this.prepareForm();
			for ( var i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++ ) {
				this.check( elements[i] );
			}
			return this.valid();
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/element
		element: function( element ) {
			element = this.validationTargetFor( this.clean( element ) );
			this.lastElement = element;
			this.prepareElement( element );
			this.currentElements = $(element);
			var result = this.check( element ) !== false;
			if (result) {
				delete this.invalid[element.name];
			} else {
				this.invalid[element.name] = true;
			}
			if ( !this.numberOfInvalids() ) {
				// Hide error containers on last error
				this.toHide = this.toHide.add( this.containers );
			}
			this.showErrors();
			return result;
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/showErrors
		showErrors: function(errors) {
			if(errors) {
				// add items to error list and map
				$.extend( this.errorMap, errors );
				this.errorList = [];
				for ( var name in errors ) {
					this.errorList.push({
						message: errors[name],
						element: this.findByName(name)[0]
					});
				}
				// remove items from success list
				this.successList = $.grep( this.successList, function(element) {
					return !(element.name in errors);
				});
			}
			if (this.settings.showErrors) {
				this.settings.showErrors.call( this, this.errorMap, this.errorList );
			} else {
				this.defaultShowErrors();
			}
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/resetForm
		resetForm: function() {
			if ( $.fn.resetForm ) {
				$( this.currentForm ).resetForm();
			}
			this.submitted = {};
			this.lastElement = null;
			this.prepareForm();
			this.hideErrors();
			this.elements().removeClass( this.settings.errorClass ).removeData( "previousValue" );
		},

		numberOfInvalids: function() {
			return this.objectLength(this.invalid);
		},

		objectLength: function( obj ) {
			var count = 0;
			for ( var i in obj ) {
				count++;
			}
			return count;
		},

		hideErrors: function() {
			this.addWrapper( this.toHide ).hide();
		},

		valid: function() {
			return this.size() === 0;
		},

		size: function() {
			return this.errorList.length;
		},

		focusInvalid: function() {
			if( this.settings.focusInvalid ) {
				try {
					$(this.findLastActive() || this.errorList.length && this.errorList[0].element || [])
					.filter(":visible")
					.focus()
					// manually trigger focusin event; without it, focusin handler isn't called, findLastActive won't have anything to find
					.trigger("focusin");
				} catch(e) {
					// ignore IE throwing errors when focusing hidden elements
				}
			}
		},

		findLastActive: function() {
			var lastActive = this.lastActive;
			return lastActive && $.grep(this.errorList, function(n) {
				return n.element.name === lastActive.name;
			}).length === 1 && lastActive;
		},

		elements: function() {
			var validator = this,
				rulesCache = {};

			// select all valid inputs inside the form (no submit or reset buttons)
			return $(this.currentForm)
			.find("input, select, textarea")
			.not(":submit, :reset, :image, [disabled]")
			.not( this.settings.ignore )
			.filter(function() {
				if ( !this.name && validator.settings.debug && window.console ) {
					console.error( "%o has no name assigned", this);
				}

				// select only the first element for each name, and only those with rules specified
				if ( this.name in rulesCache || !validator.objectLength($(this).rules()) ) {
					return false;
				}

				rulesCache[this.name] = true;
				return true;
			});
		},

		clean: function( selector ) {
			return $( selector )[0];
		},

		errors: function() {
			var errorClass = this.settings.errorClass.replace(' ', '.');
			return $( this.settings.errorElement + "." + errorClass, this.errorContext );
		},

		reset: function() {
			this.successList = [];
			this.errorList = [];
			this.errorMap = {};
			this.toShow = $([]);
			this.toHide = $([]);
			this.currentElements = $([]);
		},

		prepareForm: function() {
			this.reset();
			this.toHide = this.errors().add( this.containers );
		},

		prepareElement: function( element ) {
			this.reset();
			this.toHide = this.errorsFor(element);
		},

		elementValue: function( element ) {
			var type = $(element).attr('type'),
				val = $(element).val();

			if ( type === 'radio' || type === 'checkbox' ) {
				return $('input[name="' + $(element).attr('name') + '"]:checked').val();
			}

			if ( typeof val === 'string' ) {
				return val.replace(/\r/g, "");
			}
			return val;
		},

		check: function( element ) {
			element = this.validationTargetFor( this.clean( element ) );

			var rules = $(element).rules();
			var dependencyMismatch = false;
			var val = this.elementValue(element);
			var result;

			for (var method in rules ) {
				var rule = { method: method, parameters: rules[method] };
				try {

					result = $.validator.methods[method].call( this, val, element, rule.parameters );

					// if a method indicates that the field is optional and therefore valid,
					// don't mark it as valid when there are no other rules
					if ( result === "dependency-mismatch" ) {
						dependencyMismatch = true;
						continue;
					}
					dependencyMismatch = false;

					if ( result === "pending" ) {
						this.toHide = this.toHide.not( this.errorsFor(element) );
						return;
					}

					if( !result ) {
						this.formatAndAdd( element, rule );
						return false;
					}
				} catch(e) {
					if ( this.settings.debug && window.console ) {
						console.log("exception occured when checking element " + element.id + ", check the '" + rule.method + "' method", e);
					}
					throw e;
				}
			}
			if (dependencyMismatch) {
				return;
			}
			if ( this.objectLength(rules) ) {
				this.successList.push(element);
			}
			return true;
		},

		// return the custom message for the given element and validation method
		// specified in the element's "messages" metadata
		customMetaMessage: function(element, method) {
			if (!$.metadata) {
				return;
			}
			var meta = this.settings.meta ? $(element).metadata()[this.settings.meta] : $(element).metadata();
			return meta && meta.messages && meta.messages[method];
		},

		// return the custom message for the given element and validation method
		// specified in the element's HTML5 data attribute
		customDataMessage: function(element, method) {
			return $(element).data('msg-' + method.toLowerCase()) || (element.attributes && $(element).attr('data-msg-' + method.toLowerCase()));
		},

		// return the custom message for the given element name and validation method
		customMessage: function( name, method ) {
			var m = this.settings.messages[name];
			return m && (m.constructor === String ? m : m[method]);
		},

		// return the first defined argument, allowing empty strings
		findDefined: function() {
			for(var i = 0; i < arguments.length; i++) {
				if (arguments[i] !== undefined) {
					return arguments[i];
				}
			}
			return undefined;
		},

		defaultMessage: function( element, method) {
			return this.findDefined(
				this.customMessage( element.name, method ),
				this.customDataMessage( element, method ),
				this.customMetaMessage( element, method ),
				// title is never undefined, so handle empty string as undefined
				!this.settings.ignoreTitle && element.title || undefined,
				$.validator.messages[method],
				"<strong>Warning: No message defined for " + element.name + "</strong>"
			);
		},

		formatAndAdd: function( element, rule ) {
			var message = this.defaultMessage( element, rule.method ),
				theregex = /\$?\{(\d+)\}/g;
			if ( typeof message === "function" ) {
				message = message.call(this, rule.parameters, element);
			} else if (theregex.test(message)) {
				message = $.validator.format(message.replace(theregex, '{$1}'), rule.parameters);
			}
			this.errorList.push({
				message: message,
				element: element
			});

			this.errorMap[element.name] = message;
			this.submitted[element.name] = message;
		},

		addWrapper: function(toToggle) {
			if ( this.settings.wrapper ) {
				toToggle = toToggle.add( toToggle.parent( this.settings.wrapper ) );
			}
			return toToggle;
		},

		defaultShowErrors: function() {
			var i, elements;
			for ( i = 0; this.errorList[i]; i++ ) {
				var error = this.errorList[i];
				if ( this.settings.highlight ) {
					this.settings.highlight.call( this, error.element, this.settings.errorClass, this.settings.validClass );
				}
				this.showLabel( error.element, error.message );
			}
			if( this.errorList.length ) {
				this.toShow = this.toShow.add( this.containers );
			}
			if (this.settings.success) {
				for ( i = 0; this.successList[i]; i++ ) {
					this.showLabel( this.successList[i] );
				}
			}
			if (this.settings.unhighlight) {
				for ( i = 0, elements = this.validElements(); elements[i]; i++ ) {
					this.settings.unhighlight.call( this, elements[i], this.settings.errorClass, this.settings.validClass );
				}
			}
			this.toHide = this.toHide.not( this.toShow );
			this.hideErrors();
			this.addWrapper( this.toShow ).show();
		},

		validElements: function() {
			return this.currentElements.not(this.invalidElements());
		},

		invalidElements: function() {
			return $(this.errorList).map(function() {
				return this.element;
			});
		},

		showLabel: function(element, message) {
			var label = this.errorsFor( element );
			if ( label.length ) {
				// refresh error/success class
				label.removeClass( this.settings.validClass ).addClass( this.settings.errorClass );

				// check if we have a generated label, replace the message then
				if ( label.attr("generated") ) {
					label.html(message);
				}
			} else {
				// create label
				label = $("<" + this.settings.errorElement + "/>")
					.attr({"for":  this.idOrName(element), generated: true})
					.addClass(this.settings.errorClass)
					.html(message || "");
				if ( this.settings.wrapper ) {
					// make sure the element is visible, even in IE
					// actually showing the wrapped element is handled elsewhere
					label = label.hide().show().wrap("<" + this.settings.wrapper + "/>").parent();
				}
				if ( !this.labelContainer.append(label).length ) {
					if ( this.settings.errorPlacement ) {
						this.settings.errorPlacement(label, $(element) );
					} else {
					label.insertAfter(element);
					}
				}
			}
			if ( !message && this.settings.success ) {
				label.text("");
				if ( typeof this.settings.success === "string" ) {
					label.addClass( this.settings.success );
				} else {
					this.settings.success( label, element );
				}
			}
			this.toShow = this.toShow.add(label);
		},

		errorsFor: function(element) {
			var name = this.idOrName(element);
			return this.errors().filter(function() {
				return $(this).attr('for') === name;
			});
		},

		idOrName: function(element) {
			return this.groups[element.name] || (this.checkable(element) ? element.name : element.id || element.name);
		},

		validationTargetFor: function(element) {
			// if radio/checkbox, validate first element in group instead
			if (this.checkable(element)) {
				element = this.findByName( element.name ).not(this.settings.ignore)[0];
			}
			return element;
		},

		checkable: function( element ) {
			return (/radio|checkbox/i).test(element.type);
		},

		findByName: function( name ) {
			return $(this.currentForm).find('[name="' + name + '"]');
		},

		getLength: function(value, element) {
			switch( element.nodeName.toLowerCase() ) {
			case 'select':
				return $("option:selected", element).length;
			case 'input':
				if( this.checkable( element) ) {
					return this.findByName(element.name).filter(':checked').length;
				}
			}
			return value.length;
		},

		depend: function(param, element) {
			return this.dependTypes[typeof param] ? this.dependTypes[typeof param](param, element) : true;
		},

		dependTypes: {
			"boolean": function(param, element) {
				return param;
			},
			"string": function(param, element) {
				return !!$(param, element.form).length;
			},
			"function": function(param, element) {
				return param(element);
			}
		},

		optional: function(element) {
			var val = this.elementValue(element);
			return !$.validator.methods.required.call(this, val, element) && "dependency-mismatch";
		},

		startRequest: function(element) {
			if (!this.pending[element.name]) {
				this.pendingRequest++;
				this.pending[element.name] = true;
			}
		},

		stopRequest: function(element, valid) {
			this.pendingRequest--;
			// sometimes synchronization fails, make sure pendingRequest is never < 0
			if (this.pendingRequest < 0) {
				this.pendingRequest = 0;
			}
			delete this.pending[element.name];
			if ( valid && this.pendingRequest === 0 && this.formSubmitted && this.form() ) {
				$(this.currentForm).submit();
				this.formSubmitted = false;
			} else if (!valid && this.pendingRequest === 0 && this.formSubmitted) {
				$(this.currentForm).triggerHandler("invalid-form", [this]);
				this.formSubmitted = false;
			}
		},

		previousValue: function(element) {
			return $.data(element, "previousValue") || $.data(element, "previousValue", {
				old: null,
				valid: true,
				message: this.defaultMessage( element, "remote" )
			});
		}

	},

	classRuleSettings: {
		required: {required: true},
		email: {email: true},
		url: {url: true},
		date: {date: true},
		dateISO: {dateISO: true},
		number: {number: true},
		digits: {digits: true},
		creditcard: {creditcard: true}
	},

	addClassRules: function(className, rules) {
		if ( className.constructor === String ) {
			this.classRuleSettings[className] = rules;
		} else {
			$.extend(this.classRuleSettings, className);
		}
	},

	classRules: function(element) {
		var rules = {};
		var classes = $(element).attr('class');
		if ( classes ) {
			$.each(classes.split(' '), function() {
				if (this in $.validator.classRuleSettings) {
					$.extend(rules, $.validator.classRuleSettings[this]);
				}
			});
		}
		return rules;
	},

	attributeRules: function(element) {
		var rules = {};
		var $element = $(element);

		for (var method in $.validator.methods) {
			var value;

			// support for <input required> in both html5 and older browsers
			if (method === 'required') {
				value = $element.get(0).getAttribute(method);
				// Some browsers return an empty string for the required attribute
				// and non-HTML5 browsers might have required="" markup
				if (value === "") {
					value = true;
				}
				// force non-HTML5 browsers to return bool
				value = !!value;
			} else {
				value = $element.attr(method);
			}

			if (value) {
				rules[method] = value;
			} else if ($element[0].getAttribute("type") === method) {
				rules[method] = true;
			}
		}

		// maxlength may be returned as -1, 2147483647 (IE) and 524288 (safari) for text inputs
		if (rules.maxlength && /-1|2147483647|524288/.test(rules.maxlength)) {
			delete rules.maxlength;
		}

		return rules;
	},

	metadataRules: function(element) {
		if (!$.metadata) {
			return {};
		}

		var meta = $.data(element.form, 'validator').settings.meta;
		return meta ?
			$(element).metadata()[meta] :
			$(element).metadata();
	},

	staticRules: function(element) {
		var rules = {};
		var validator = $.data(element.form, 'validator');
		if (validator.settings.rules) {
			rules = $.validator.normalizeRule(validator.settings.rules[element.name]) || {};
		}
		return rules;
	},

	normalizeRules: function(rules, element) {
		// handle dependency check
		$.each(rules, function(prop, val) {
			// ignore rule when param is explicitly false, eg. required:false
			if (val === false) {
				delete rules[prop];
				return;
			}
			if (val.param || val.depends) {
				var keepRule = true;
				switch (typeof val.depends) {
					case "string":
						keepRule = !!$(val.depends, element.form).length;
						break;
					case "function":
						keepRule = val.depends.call(element, element);
						break;
				}
				if (keepRule) {
					rules[prop] = val.param !== undefined ? val.param : true;
				} else {
					delete rules[prop];
				}
			}
		});

		// evaluate parameters
		$.each(rules, function(rule, parameter) {
			rules[rule] = $.isFunction(parameter) ? parameter(element) : parameter;
		});

		// clean number parameters
		$.each(['minlength', 'maxlength', 'min', 'max'], function() {
			if (rules[this]) {
				rules[this] = Number(rules[this]);
			}
		});
		$.each(['rangelength', 'range'], function() {
			if (rules[this]) {
				rules[this] = [Number(rules[this][0]), Number(rules[this][1])];
			}
		});

		if ($.validator.autoCreateRanges) {
			// auto-create ranges
			if (rules.min && rules.max) {
				rules.range = [rules.min, rules.max];
				delete rules.min;
				delete rules.max;
			}
			if (rules.minlength && rules.maxlength) {
				rules.rangelength = [rules.minlength, rules.maxlength];
				delete rules.minlength;
				delete rules.maxlength;
			}
		}

		// To support custom messages in metadata ignore rule methods titled "messages"
		if (rules.messages) {
			delete rules.messages;
		}

		return rules;
	},

	// Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
	normalizeRule: function(data) {
		if( typeof data === "string" ) {
			var transformed = {};
			$.each(data.split(/\s/), function() {
				transformed[this] = true;
			});
			data = transformed;
		}
		return data;
	},

	// http://docs.jquery.com/Plugins/Validation/Validator/addMethod
	addMethod: function(name, method, message) {
		$.validator.methods[name] = method;
		$.validator.messages[name] = message !== undefined ? message : $.validator.messages[name];
		if (method.length < 3) {
			$.validator.addClassRules(name, $.validator.normalizeRule(name));
		}
	},

	methods: {

		// http://docs.jquery.com/Plugins/Validation/Methods/required
		required: function(value, element, param) {
			// check if dependency is met
			if ( !this.depend(param, element) ) {
				return "dependency-mismatch";
			}
			if ( element.nodeName.toLowerCase() === "select" ) {
				// could be an array for select-multiple or a string, both are fine this way
				var val = $(element).val();
				return val && val.length > 0;
			}
			if ( this.checkable(element) ) {
				return this.getLength(value, element) > 0;
			}
			return $.trim(value).length > 0;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/remote
		remote: function(value, element, param) {
			if ( this.optional(element) ) {
				return "dependency-mismatch";
			}

			var previous = this.previousValue(element);
			if (!this.settings.messages[element.name] ) {
				this.settings.messages[element.name] = {};
			}
			previous.originalMessage = this.settings.messages[element.name].remote;
			this.settings.messages[element.name].remote = previous.message;

			param = typeof param === "string" && {url:param} || param;

			if ( this.pending[element.name] ) {
				return "pending";
			}
			if ( previous.old === value ) {
				return previous.valid;
			}

			previous.old = value;
			var validator = this;
			this.startRequest(element);
			var data = {};
			data[element.name] = value;
			$.ajax($.extend(true, {
				url: param,
				mode: "abort",
				port: "validate" + element.name,
				dataType: "json",
				data: data,
				success: function(response) {
					validator.settings.messages[element.name].remote = previous.originalMessage;
					var valid = response === true || response === "true";
					if ( valid ) {
						var submitted = validator.formSubmitted;
						validator.prepareElement(element);
						validator.formSubmitted = submitted;
						validator.successList.push(element);
						delete validator.invalid[element.name];
						validator.showErrors();
					} else {
						var errors = {};
						var message = response || validator.defaultMessage( element, "remote" );
						errors[element.name] = previous.message = $.isFunction(message) ? message(value) : message;
						validator.invalid[element.name] = true;
						validator.showErrors(errors);
					}
					previous.valid = valid;
					validator.stopRequest(element, valid);
				}
			}, param));
			return "pending";
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/minlength
		minlength: function(value, element, param) {
			var length = $.isArray( value ) ? value.length : this.getLength($.trim(value), element);
			return this.optional(element) || length >= param;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/maxlength
		maxlength: function(value, element, param) {
			var length = $.isArray( value ) ? value.length : this.getLength($.trim(value), element);
			return this.optional(element) || length <= param;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/rangelength
		rangelength: function(value, element, param) {
			var length = $.isArray( value ) ? value.length : this.getLength($.trim(value), element);
			return this.optional(element) || ( length >= param[0] && length <= param[1] );
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/min
		min: function( value, element, param ) {
			return this.optional(element) || value >= param;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/max
		max: function( value, element, param ) {
			return this.optional(element) || value <= param;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/range
		range: function( value, element, param ) {
			return this.optional(element) || ( value >= param[0] && value <= param[1] );
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/email
		email: function(value, element) {
			// contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
			return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/url
		url: function(value, element) {
			// contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
			return this.optional(element) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/date
		date: function(value, element) {
			return this.optional(element) || !/Invalid|NaN/.test(new Date(value));
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/dateISO
		dateISO: function(value, element) {
			return this.optional(element) || /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/number
		number: function(value, element) {
			return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/digits
		digits: function(value, element) {
			return this.optional(element) || /^\d+$/.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/creditcard
		// based on http://en.wikipedia.org/wiki/Luhn
		creditcard: function(value, element) {
			if ( this.optional(element) ) {
				return "dependency-mismatch";
			}
			// accept only spaces, digits and dashes
			if (/[^0-9 \-]+/.test(value)) {
				return false;
			}
			var nCheck = 0,
				nDigit = 0,
				bEven = false;

			value = value.replace(/\D/g, "");

			for (var n = value.length - 1; n >= 0; n--) {
				var cDigit = value.charAt(n);
				nDigit = parseInt(cDigit, 10);
				if (bEven) {
					if ((nDigit *= 2) > 9) {
						nDigit -= 9;
					}
				}
				nCheck += nDigit;
				bEven = !bEven;
			}

			return (nCheck % 10) === 0;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/equalTo
		equalTo: function(value, element, param) {
			// bind to the blur event of the target in order to revalidate whenever the target field is updated
			// TODO find a way to bind the event just once, avoiding the unbind-rebind overhead
			var target = $(param);
			if (this.settings.onfocusout) {
				target.unbind(".validate-equalTo").bind("blur.validate-equalTo", function() {
					$(element).valid();
				});
			}
			return value === target.val();
		}

	}

});

// deprecated, use $.validator.format instead
$.format = $.validator.format;

}(jQuery));

// ajax mode: abort
// usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
// if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort()
(function($) {
	var pendingRequests = {};
	// Use a prefilter if available (1.5+)
	if ( $.ajaxPrefilter ) {
		$.ajaxPrefilter(function(settings, _, xhr) {
			var port = settings.port;
			if (settings.mode === "abort") {
				if ( pendingRequests[port] ) {
					pendingRequests[port].abort();
				}
				pendingRequests[port] = xhr;
			}
		});
	} else {
		// Proxy ajax
		var ajax = $.ajax;
		$.ajax = function(settings) {
			var mode = ( "mode" in settings ? settings : $.ajaxSettings ).mode,
				port = ( "port" in settings ? settings : $.ajaxSettings ).port;
			if (mode === "abort") {
				if ( pendingRequests[port] ) {
					pendingRequests[port].abort();
				}
				return (pendingRequests[port] = ajax.apply(this, arguments));
			}
			return ajax.apply(this, arguments);
		};
	}
}(jQuery));

// provides cross-browser focusin and focusout events
// IE has native support, in other browsers, use event caputuring (neither bubbles)

// provides delegate(type: String, delegate: Selector, handler: Callback) plugin for easier event delegation
// handler is only called when $(event.target).is(delegate), in the scope of the jquery-object for event.target
(function($) {
	// only implement if not provided by jQuery core (since 1.4)
	// TODO verify if jQuery 1.4's implementation is compatible with older jQuery special-event APIs
	if (!jQuery.event.special.focusin && !jQuery.event.special.focusout && document.addEventListener) {
		$.each({
			focus: 'focusin',
			blur: 'focusout'
		}, function( original, fix ){
			$.event.special[fix] = {
				setup:function() {
					this.addEventListener( original, handler, true );
				},
				teardown:function() {
					this.removeEventListener( original, handler, true );
				},
				handler: function(e) {
					var args = arguments;
					args[0] = $.event.fix(e);
					args[0].type = fix;
					return $.event.handle.apply(this, args);
				}
			};
			function handler(e) {
				e = $.event.fix(e);
				e.type = fix;
				return $.event.handle.call(this, e);
			}
		});
	}
	$.extend($.fn, {
		validateDelegate: function(delegate, type, handler) {
			return this.bind(type, function(event) {
				var target = $(event.target);
				if (target.is(delegate)) {
					return handler.apply(target, arguments);
				}
			});
		}
	});
}(jQuery));
var SimileAjax=SimileAjax||{loaded:false,loadingScriptsCount:0,error:null,params:{bundle:"true"},Platform:{},urlPrefix:"/timelineResources/"};
/* jquery-1.2.6.min.js */
(function(){var _jQuery=window.jQuery,_$=window.$;
var jQuery=window.jQuery=window.$=function(selector,context){return new jQuery.fn.init(selector,context);
};
var quickExpr=/^[^<]*(<(.|\s)+>)[^>]*$|^#(\w+)$/,isSimple=/^.[^:#\[\.]*$/,undefined;
jQuery.fn=jQuery.prototype={init:function(selector,context){selector=selector||document;
if(selector.nodeType){this[0]=selector;
this.length=1;
return this;
}if(typeof selector=="string"){var match=quickExpr.exec(selector);
if(match&&(match[1]||!context)){if(match[1]){selector=jQuery.clean([match[1]],context);
}else{var elem=document.getElementById(match[3]);
if(elem){if(elem.id!=match[3]){return jQuery().find(selector);
}return jQuery(elem);
}selector=[];
}}else{return jQuery(context).find(selector);
}}else{if(jQuery.isFunction(selector)){return jQuery(document)[jQuery.fn.ready?"ready":"load"](selector);
}}return this.setArray(jQuery.makeArray(selector));
},jquery:"1.2.6",size:function(){return this.length;
},length:0,get:function(num){return num==undefined?jQuery.makeArray(this):this[num];
},pushStack:function(elems){var ret=jQuery(elems);
ret.prevObject=this;
return ret;
},setArray:function(elems){this.length=0;
Array.prototype.push.apply(this,elems);
return this;
},each:function(callback,args){return jQuery.each(this,callback,args);
},index:function(elem){var ret=-1;
return jQuery.inArray(elem&&elem.jquery?elem[0]:elem,this);
},attr:function(name,value,type){var options=name;
if(name.constructor==String){if(value===undefined){return this[0]&&jQuery[type||"attr"](this[0],name);
}else{options={};
options[name]=value;
}}return this.each(function(i){for(name in options){jQuery.attr(type?this.style:this,name,jQuery.prop(this,options[name],type,i,name));
}});
},css:function(key,value){if((key=="width"||key=="height")&&parseFloat(value)<0){value=undefined;
}return this.attr(key,value,"curCSS");
},text:function(text){if(typeof text!="object"&&text!=null){return this.empty().append((this[0]&&this[0].ownerDocument||document).createTextNode(text));
}var ret="";
jQuery.each(text||this,function(){jQuery.each(this.childNodes,function(){if(this.nodeType!=8){ret+=this.nodeType!=1?this.nodeValue:jQuery.fn.text([this]);
}});
});
return ret;
},wrapAll:function(html){if(this[0]){jQuery(html,this[0].ownerDocument).clone().insertBefore(this[0]).map(function(){var elem=this;
while(elem.firstChild){elem=elem.firstChild;
}return elem;
}).append(this);
}return this;
},wrapInner:function(html){return this.each(function(){jQuery(this).contents().wrapAll(html);
});
},wrap:function(html){return this.each(function(){jQuery(this).wrapAll(html);
});
},append:function(){return this.domManip(arguments,true,false,function(elem){if(this.nodeType==1){this.appendChild(elem);
}});
},prepend:function(){return this.domManip(arguments,true,true,function(elem){if(this.nodeType==1){this.insertBefore(elem,this.firstChild);
}});
},before:function(){return this.domManip(arguments,false,false,function(elem){this.parentNode.insertBefore(elem,this);
});
},after:function(){return this.domManip(arguments,false,true,function(elem){this.parentNode.insertBefore(elem,this.nextSibling);
});
},end:function(){return this.prevObject||jQuery([]);
},find:function(selector){var elems=jQuery.map(this,function(elem){return jQuery.find(selector,elem);
});
return this.pushStack(/[^+>] [^+>]/.test(selector)||selector.indexOf("..")>-1?jQuery.unique(elems):elems);
},clone:function(events){var ret=this.map(function(){if(jQuery.browser.msie&&!jQuery.isXMLDoc(this)){var clone=this.cloneNode(true),container=document.createElement("div");
container.appendChild(clone);
return jQuery.clean([container.innerHTML])[0];
}else{return this.cloneNode(true);
}});
var clone=ret.find("*").andSelf().each(function(){if(this[expando]!=undefined){this[expando]=null;
}});
if(events===true){this.find("*").andSelf().each(function(i){if(this.nodeType==3){return ;
}var events=jQuery.data(this,"events");
for(var type in events){for(var handler in events[type]){jQuery.event.add(clone[i],type,events[type][handler],events[type][handler].data);
}}});
}return ret;
},filter:function(selector){return this.pushStack(jQuery.isFunction(selector)&&jQuery.grep(this,function(elem,i){return selector.call(elem,i);
})||jQuery.multiFilter(selector,this));
},not:function(selector){if(selector.constructor==String){if(isSimple.test(selector)){return this.pushStack(jQuery.multiFilter(selector,this,true));
}else{selector=jQuery.multiFilter(selector,this);
}}var isArrayLike=selector.length&&selector[selector.length-1]!==undefined&&!selector.nodeType;
return this.filter(function(){return isArrayLike?jQuery.inArray(this,selector)<0:this!=selector;
});
},add:function(selector){return this.pushStack(jQuery.unique(jQuery.merge(this.get(),typeof selector=="string"?jQuery(selector):jQuery.makeArray(selector))));
},is:function(selector){return !!selector&&jQuery.multiFilter(selector,this).length>0;
},hasClass:function(selector){return this.is("."+selector);
},val:function(value){if(value==undefined){if(this.length){var elem=this[0];
if(jQuery.nodeName(elem,"select")){var index=elem.selectedIndex,values=[],options=elem.options,one=elem.type=="select-one";
if(index<0){return null;
}for(var i=one?index:0,max=one?index+1:options.length;
i<max;
i++){var option=options[i];
if(option.selected){value=jQuery.browser.msie&&!option.attributes.value.specified?option.text:option.value;
if(one){return value;
}values.push(value);
}}return values;
}else{return(this[0].value||"").replace(/\r/g,"");
}}return undefined;
}if(value.constructor==Number){value+="";
}return this.each(function(){if(this.nodeType!=1){return ;
}if(value.constructor==Array&&/radio|checkbox/.test(this.type)){this.checked=(jQuery.inArray(this.value,value)>=0||jQuery.inArray(this.name,value)>=0);
}else{if(jQuery.nodeName(this,"select")){var values=jQuery.makeArray(value);
jQuery("option",this).each(function(){this.selected=(jQuery.inArray(this.value,values)>=0||jQuery.inArray(this.text,values)>=0);
});
if(!values.length){this.selectedIndex=-1;
}}else{this.value=value;
}}});
},html:function(value){return value==undefined?(this[0]?this[0].innerHTML:null):this.empty().append(value);
},replaceWith:function(value){return this.after(value).remove();
},eq:function(i){return this.slice(i,i+1);
},slice:function(){return this.pushStack(Array.prototype.slice.apply(this,arguments));
},map:function(callback){return this.pushStack(jQuery.map(this,function(elem,i){return callback.call(elem,i,elem);
}));
},andSelf:function(){return this.add(this.prevObject);
},data:function(key,value){var parts=key.split(".");
parts[1]=parts[1]?"."+parts[1]:"";
if(value===undefined){var data=this.triggerHandler("getData"+parts[1]+"!",[parts[0]]);
if(data===undefined&&this.length){data=jQuery.data(this[0],key);
}return data===undefined&&parts[1]?this.data(parts[0]):data;
}else{return this.trigger("setData"+parts[1]+"!",[parts[0],value]).each(function(){jQuery.data(this,key,value);
});
}},removeData:function(key){return this.each(function(){jQuery.removeData(this,key);
});
},domManip:function(args,table,reverse,callback){var clone=this.length>1,elems;
return this.each(function(){if(!elems){elems=jQuery.clean(args,this.ownerDocument);
if(reverse){elems.reverse();
}}var obj=this;
if(table&&jQuery.nodeName(this,"table")&&jQuery.nodeName(elems[0],"tr")){obj=this.getElementsByTagName("tbody")[0]||this.appendChild(this.ownerDocument.createElement("tbody"));
}var scripts=jQuery([]);
jQuery.each(elems,function(){var elem=clone?jQuery(this).clone(true)[0]:this;
if(jQuery.nodeName(elem,"script")){scripts=scripts.add(elem);
}else{if(elem.nodeType==1){scripts=scripts.add(jQuery("script",elem).remove());
}callback.call(obj,elem);
}});
scripts.each(evalScript);
});
}};
jQuery.fn.init.prototype=jQuery.fn;
function evalScript(i,elem){if(elem.src){jQuery.ajax({url:elem.src,async:false,dataType:"script"});
}else{jQuery.globalEval(elem.text||elem.textContent||elem.innerHTML||"");
}if(elem.parentNode){elem.parentNode.removeChild(elem);
}}function now(){return +new Date;
}jQuery.extend=jQuery.fn.extend=function(){var target=arguments[0]||{},i=1,length=arguments.length,deep=false,options;
if(target.constructor==Boolean){deep=target;
target=arguments[1]||{};
i=2;
}if(typeof target!="object"&&typeof target!="function"){target={};
}if(length==i){target=this;
--i;
}for(;
i<length;
i++){if((options=arguments[i])!=null){for(var name in options){var src=target[name],copy=options[name];
if(target===copy){continue;
}if(deep&&copy&&typeof copy=="object"&&!copy.nodeType){target[name]=jQuery.extend(deep,src||(copy.length!=null?[]:{}),copy);
}else{if(copy!==undefined){target[name]=copy;
}}}}}return target;
};
var expando="jQuery"+now(),uuid=0,windowData={},exclude=/z-?index|font-?weight|opacity|zoom|line-?height/i,defaultView=document.defaultView||{};
jQuery.extend({noConflict:function(deep){window.$=_$;
if(deep){window.jQuery=_jQuery;
}return jQuery;
},isFunction:function(fn){return !!fn&&typeof fn!="string"&&!fn.nodeName&&fn.constructor!=Array&&/^[\s[]?function/.test(fn+"");
},isXMLDoc:function(elem){return elem.documentElement&&!elem.body||elem.tagName&&elem.ownerDocument&&!elem.ownerDocument.body;
},globalEval:function(data){data=jQuery.trim(data);
if(data){var head=document.getElementsByTagName("head")[0]||document.documentElement,script=document.createElement("script");
script.type="text/javascript";
if(jQuery.browser.msie){script.text=data;
}else{script.appendChild(document.createTextNode(data));
}head.insertBefore(script,head.firstChild);
head.removeChild(script);
}},nodeName:function(elem,name){return elem.nodeName&&elem.nodeName.toUpperCase()==name.toUpperCase();
},cache:{},data:function(elem,name,data){elem=elem==window?windowData:elem;
var id=elem[expando];
if(!id){id=elem[expando]=++uuid;
}if(name&&!jQuery.cache[id]){jQuery.cache[id]={};
}if(data!==undefined){jQuery.cache[id][name]=data;
}return name?jQuery.cache[id][name]:id;
},removeData:function(elem,name){elem=elem==window?windowData:elem;
var id=elem[expando];
if(name){if(jQuery.cache[id]){delete jQuery.cache[id][name];
name="";
for(name in jQuery.cache[id]){break;
}if(!name){jQuery.removeData(elem);
}}}else{try{delete elem[expando];
}catch(e){if(elem.removeAttribute){elem.removeAttribute(expando);
}}delete jQuery.cache[id];
}},each:function(object,callback,args){var name,i=0,length=object.length;
if(args){if(length==undefined){for(name in object){if(callback.apply(object[name],args)===false){break;
}}}else{for(;
i<length;
){if(callback.apply(object[i++],args)===false){break;
}}}}else{if(length==undefined){for(name in object){if(callback.call(object[name],name,object[name])===false){break;
}}}else{for(var value=object[0];
i<length&&callback.call(value,i,value)!==false;
value=object[++i]){}}}return object;
},prop:function(elem,value,type,i,name){if(jQuery.isFunction(value)){value=value.call(elem,i);
}return value&&value.constructor==Number&&type=="curCSS"&&!exclude.test(name)?value+"px":value;
},className:{add:function(elem,classNames){jQuery.each((classNames||"").split(/\s+/),function(i,className){if(elem.nodeType==1&&!jQuery.className.has(elem.className,className)){elem.className+=(elem.className?" ":"")+className;
}});
},remove:function(elem,classNames){if(elem.nodeType==1){elem.className=classNames!=undefined?jQuery.grep(elem.className.split(/\s+/),function(className){return !jQuery.className.has(classNames,className);
}).join(" "):"";
}},has:function(elem,className){return jQuery.inArray(className,(elem.className||elem).toString().split(/\s+/))>-1;
}},swap:function(elem,options,callback){var old={};
for(var name in options){old[name]=elem.style[name];
elem.style[name]=options[name];
}callback.call(elem);
for(var name in options){elem.style[name]=old[name];
}},css:function(elem,name,force){if(name=="width"||name=="height"){var val,props={position:"absolute",visibility:"hidden",display:"block"},which=name=="width"?["Left","Right"]:["Top","Bottom"];
function getWH(){val=name=="width"?elem.offsetWidth:elem.offsetHeight;
var padding=0,border=0;
jQuery.each(which,function(){padding+=parseFloat(jQuery.curCSS(elem,"padding"+this,true))||0;
border+=parseFloat(jQuery.curCSS(elem,"border"+this+"Width",true))||0;
});
val-=Math.round(padding+border);
}if(jQuery(elem).is(":visible")){getWH();
}else{jQuery.swap(elem,props,getWH);
}return Math.max(0,val);
}return jQuery.curCSS(elem,name,force);
},curCSS:function(elem,name,force){var ret,style=elem.style;
function color(elem){if(!jQuery.browser.safari){return false;
}var ret=defaultView.getComputedStyle(elem,null);
return !ret||ret.getPropertyValue("color")=="";
}if(name=="opacity"&&jQuery.browser.msie){ret=jQuery.attr(style,"opacity");
return ret==""?"1":ret;
}if(jQuery.browser.opera&&name=="display"){var save=style.outline;
style.outline="0 solid black";
style.outline=save;
}if(name.match(/float/i)){name=styleFloat;
}if(!force&&style&&style[name]){ret=style[name];
}else{if(defaultView.getComputedStyle){if(name.match(/float/i)){name="float";
}name=name.replace(/([A-Z])/g,"-$1").toLowerCase();
var computedStyle=defaultView.getComputedStyle(elem,null);
if(computedStyle&&!color(elem)){ret=computedStyle.getPropertyValue(name);
}else{var swap=[],stack=[],a=elem,i=0;
for(;
a&&color(a);
a=a.parentNode){stack.unshift(a);
}for(;
i<stack.length;
i++){if(color(stack[i])){swap[i]=stack[i].style.display;
stack[i].style.display="block";
}}ret=name=="display"&&swap[stack.length-1]!=null?"none":(computedStyle&&computedStyle.getPropertyValue(name))||"";
for(i=0;
i<swap.length;
i++){if(swap[i]!=null){stack[i].style.display=swap[i];
}}}if(name=="opacity"&&ret==""){ret="1";
}}else{if(elem.currentStyle){var camelCase=name.replace(/\-(\w)/g,function(all,letter){return letter.toUpperCase();
});
ret=elem.currentStyle[name]||elem.currentStyle[camelCase];
if(!/^\d+(px)?$/i.test(ret)&&/^\d/.test(ret)){var left=style.left,rsLeft=elem.runtimeStyle.left;
elem.runtimeStyle.left=elem.currentStyle.left;
style.left=ret||0;
ret=style.pixelLeft+"px";
style.left=left;
elem.runtimeStyle.left=rsLeft;
}}}}return ret;
},clean:function(elems,context){var ret=[];
context=context||document;
if(typeof context.createElement=="undefined"){context=context.ownerDocument||context[0]&&context[0].ownerDocument||document;
}jQuery.each(elems,function(i,elem){if(!elem){return ;
}if(elem.constructor==Number){elem+="";
}if(typeof elem=="string"){elem=elem.replace(/(<(\w+)[^>]*?)\/>/g,function(all,front,tag){return tag.match(/^(abbr|br|col|img|input|link|meta|param|hr|area|embed)$/i)?all:front+"></"+tag+">";
});
var tags=jQuery.trim(elem).toLowerCase(),div=context.createElement("div");
var wrap=!tags.indexOf("<opt")&&[1,"<select multiple='multiple'>","</select>"]||!tags.indexOf("<leg")&&[1,"<fieldset>","</fieldset>"]||tags.match(/^<(thead|tbody|tfoot|colg|cap)/)&&[1,"<table>","</table>"]||!tags.indexOf("<tr")&&[2,"<table><tbody>","</tbody></table>"]||(!tags.indexOf("<td")||!tags.indexOf("<th"))&&[3,"<table><tbody><tr>","</tr></tbody></table>"]||!tags.indexOf("<col")&&[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"]||jQuery.browser.msie&&[1,"div<div>","</div>"]||[0,"",""];
div.innerHTML=wrap[1]+elem+wrap[2];
while(wrap[0]--){div=div.lastChild;
}if(jQuery.browser.msie){var tbody=!tags.indexOf("<table")&&tags.indexOf("<tbody")<0?div.firstChild&&div.firstChild.childNodes:wrap[1]=="<table>"&&tags.indexOf("<tbody")<0?div.childNodes:[];
for(var j=tbody.length-1;
j>=0;
--j){if(jQuery.nodeName(tbody[j],"tbody")&&!tbody[j].childNodes.length){tbody[j].parentNode.removeChild(tbody[j]);
}}if(/^\s/.test(elem)){div.insertBefore(context.createTextNode(elem.match(/^\s*/)[0]),div.firstChild);
}}elem=jQuery.makeArray(div.childNodes);
}if(elem.length===0&&(!jQuery.nodeName(elem,"form")&&!jQuery.nodeName(elem,"select"))){return ;
}if(elem[0]==undefined||jQuery.nodeName(elem,"form")||elem.options){ret.push(elem);
}else{ret=jQuery.merge(ret,elem);
}});
return ret;
},attr:function(elem,name,value){if(!elem||elem.nodeType==3||elem.nodeType==8){return undefined;
}var notxml=!jQuery.isXMLDoc(elem),set=value!==undefined,msie=jQuery.browser.msie;
name=notxml&&jQuery.props[name]||name;
if(elem.tagName){var special=/href|src|style/.test(name);
if(name=="selected"&&jQuery.browser.safari){elem.parentNode.selectedIndex;
}if(name in elem&&notxml&&!special){if(set){if(name=="type"&&jQuery.nodeName(elem,"input")&&elem.parentNode){throw"type property can't be changed";
}elem[name]=value;
}if(jQuery.nodeName(elem,"form")&&elem.getAttributeNode(name)){return elem.getAttributeNode(name).nodeValue;
}return elem[name];
}if(msie&&notxml&&name=="style"){return jQuery.attr(elem.style,"cssText",value);
}if(set){elem.setAttribute(name,""+value);
}var attr=msie&&notxml&&special?elem.getAttribute(name,2):elem.getAttribute(name);
return attr===null?undefined:attr;
}if(msie&&name=="opacity"){if(set){elem.zoom=1;
elem.filter=(elem.filter||"").replace(/alpha\([^)]*\)/,"")+(parseInt(value)+""=="NaN"?"":"alpha(opacity="+value*100+")");
}return elem.filter&&elem.filter.indexOf("opacity=")>=0?(parseFloat(elem.filter.match(/opacity=([^)]*)/)[1])/100)+"":"";
}name=name.replace(/-([a-z])/ig,function(all,letter){return letter.toUpperCase();
});
if(set){elem[name]=value;
}return elem[name];
},trim:function(text){return(text||"").replace(/^\s+|\s+$/g,"");
},makeArray:function(array){var ret=[];
if(array!=null){var i=array.length;
if(i==null||array.split||array.setInterval||array.call){ret[0]=array;
}else{while(i){ret[--i]=array[i];
}}}return ret;
},inArray:function(elem,array){for(var i=0,length=array.length;
i<length;
i++){if(array[i]===elem){return i;
}}return -1;
},merge:function(first,second){var i=0,elem,pos=first.length;
if(jQuery.browser.msie){while(elem=second[i++]){if(elem.nodeType!=8){first[pos++]=elem;
}}}else{while(elem=second[i++]){first[pos++]=elem;
}}return first;
},unique:function(array){var ret=[],done={};
try{for(var i=0,length=array.length;
i<length;
i++){var id=jQuery.data(array[i]);
if(!done[id]){done[id]=true;
ret.push(array[i]);
}}}catch(e){ret=array;
}return ret;
},grep:function(elems,callback,inv){var ret=[];
for(var i=0,length=elems.length;
i<length;
i++){if(!inv!=!callback(elems[i],i)){ret.push(elems[i]);
}}return ret;
},map:function(elems,callback){var ret=[];
for(var i=0,length=elems.length;
i<length;
i++){var value=callback(elems[i],i);
if(value!=null){ret[ret.length]=value;
}}return ret.concat.apply([],ret);
}});
var userAgent=navigator.userAgent.toLowerCase();
jQuery.browser={version:(userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/)||[])[1],safari:/webkit/.test(userAgent),opera:/opera/.test(userAgent),msie:/msie/.test(userAgent)&&!/opera/.test(userAgent),mozilla:/mozilla/.test(userAgent)&&!/(compatible|webkit)/.test(userAgent)};
var styleFloat=jQuery.browser.msie?"styleFloat":"cssFloat";
jQuery.extend({boxModel:!jQuery.browser.msie||document.compatMode=="CSS1Compat",props:{"for":"htmlFor","class":"className","float":styleFloat,cssFloat:styleFloat,styleFloat:styleFloat,readonly:"readOnly",maxlength:"maxLength",cellspacing:"cellSpacing"}});
jQuery.each({parent:function(elem){return elem.parentNode;
},parents:function(elem){return jQuery.dir(elem,"parentNode");
},next:function(elem){return jQuery.nth(elem,2,"nextSibling");
},prev:function(elem){return jQuery.nth(elem,2,"previousSibling");
},nextAll:function(elem){return jQuery.dir(elem,"nextSibling");
},prevAll:function(elem){return jQuery.dir(elem,"previousSibling");
},siblings:function(elem){return jQuery.sibling(elem.parentNode.firstChild,elem);
},children:function(elem){return jQuery.sibling(elem.firstChild);
},contents:function(elem){return jQuery.nodeName(elem,"iframe")?elem.contentDocument||elem.contentWindow.document:jQuery.makeArray(elem.childNodes);
}},function(name,fn){jQuery.fn[name]=function(selector){var ret=jQuery.map(this,fn);
if(selector&&typeof selector=="string"){ret=jQuery.multiFilter(selector,ret);
}return this.pushStack(jQuery.unique(ret));
};
});
jQuery.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(name,original){jQuery.fn[name]=function(){var args=arguments;
return this.each(function(){for(var i=0,length=args.length;
i<length;
i++){jQuery(args[i])[original](this);
}});
};
});
jQuery.each({removeAttr:function(name){jQuery.attr(this,name,"");
if(this.nodeType==1){this.removeAttribute(name);
}},addClass:function(classNames){jQuery.className.add(this,classNames);
},removeClass:function(classNames){jQuery.className.remove(this,classNames);
},toggleClass:function(classNames){jQuery.className[jQuery.className.has(this,classNames)?"remove":"add"](this,classNames);
},remove:function(selector){if(!selector||jQuery.filter(selector,[this]).r.length){jQuery("*",this).add(this).each(function(){jQuery.event.remove(this);
jQuery.removeData(this);
});
if(this.parentNode){this.parentNode.removeChild(this);
}}},empty:function(){jQuery(">*",this).remove();
while(this.firstChild){this.removeChild(this.firstChild);
}}},function(name,fn){jQuery.fn[name]=function(){return this.each(fn,arguments);
};
});
jQuery.each(["Height","Width"],function(i,name){var type=name.toLowerCase();
jQuery.fn[type]=function(size){return this[0]==window?jQuery.browser.opera&&document.body["client"+name]||jQuery.browser.safari&&window["inner"+name]||document.compatMode=="CSS1Compat"&&document.documentElement["client"+name]||document.body["client"+name]:this[0]==document?Math.max(Math.max(document.body["scroll"+name],document.documentElement["scroll"+name]),Math.max(document.body["offset"+name],document.documentElement["offset"+name])):size==undefined?(this.length?jQuery.css(this[0],type):null):this.css(type,size.constructor==String?size:size+"px");
};
});
function num(elem,prop){return elem[0]&&parseInt(jQuery.curCSS(elem[0],prop,true),10)||0;
}var chars=jQuery.browser.safari&&parseInt(jQuery.browser.version)<417?"(?:[\\w*_-]|\\\\.)":"(?:[\\w\u0128-\uFFFF*_-]|\\\\.)",quickChild=new RegExp("^>\\s*("+chars+"+)"),quickID=new RegExp("^("+chars+"+)(#)("+chars+"+)"),quickClass=new RegExp("^([#.]?)("+chars+"*)");
jQuery.extend({expr:{"":function(a,i,m){return m[2]=="*"||jQuery.nodeName(a,m[2]);
},"#":function(a,i,m){return a.getAttribute("id")==m[2];
},":":{lt:function(a,i,m){return i<m[3]-0;
},gt:function(a,i,m){return i>m[3]-0;
},nth:function(a,i,m){return m[3]-0==i;
},eq:function(a,i,m){return m[3]-0==i;
},first:function(a,i){return i==0;
},last:function(a,i,m,r){return i==r.length-1;
},even:function(a,i){return i%2==0;
},odd:function(a,i){return i%2;
},"first-child":function(a){return a.parentNode.getElementsByTagName("*")[0]==a;
},"last-child":function(a){return jQuery.nth(a.parentNode.lastChild,1,"previousSibling")==a;
},"only-child":function(a){return !jQuery.nth(a.parentNode.lastChild,2,"previousSibling");
},parent:function(a){return a.firstChild;
},empty:function(a){return !a.firstChild;
},contains:function(a,i,m){return(a.textContent||a.innerText||jQuery(a).text()||"").indexOf(m[3])>=0;
},visible:function(a){return"hidden"!=a.type&&jQuery.css(a,"display")!="none"&&jQuery.css(a,"visibility")!="hidden";
},hidden:function(a){return"hidden"==a.type||jQuery.css(a,"display")=="none"||jQuery.css(a,"visibility")=="hidden";
},enabled:function(a){return !a.disabled;
},disabled:function(a){return a.disabled;
},checked:function(a){return a.checked;
},selected:function(a){return a.selected||jQuery.attr(a,"selected");
},text:function(a){return"text"==a.type;
},radio:function(a){return"radio"==a.type;
},checkbox:function(a){return"checkbox"==a.type;
},file:function(a){return"file"==a.type;
},password:function(a){return"password"==a.type;
},submit:function(a){return"submit"==a.type;
},image:function(a){return"image"==a.type;
},reset:function(a){return"reset"==a.type;
},button:function(a){return"button"==a.type||jQuery.nodeName(a,"button");
},input:function(a){return/input|select|textarea|button/i.test(a.nodeName);
},has:function(a,i,m){return jQuery.find(m[3],a).length;
},header:function(a){return/h\d/i.test(a.nodeName);
},animated:function(a){return jQuery.grep(jQuery.timers,function(fn){return a==fn.elem;
}).length;
}}},parse:[/^(\[) *@?([\w-]+) *([!*$^~=]*) *('?"?)(.*?)\4 *\]/,/^(:)([\w-]+)\("?'?(.*?(\(.*?\))?[^(]*?)"?'?\)/,new RegExp("^([:.#]*)("+chars+"+)")],multiFilter:function(expr,elems,not){var old,cur=[];
while(expr&&expr!=old){old=expr;
var f=jQuery.filter(expr,elems,not);
expr=f.t.replace(/^\s*,\s*/,"");
cur=not?elems=f.r:jQuery.merge(cur,f.r);
}return cur;
},find:function(t,context){if(typeof t!="string"){return[t];
}if(context&&context.nodeType!=1&&context.nodeType!=9){return[];
}context=context||document;
var ret=[context],done=[],last,nodeName;
while(t&&last!=t){var r=[];
last=t;
t=jQuery.trim(t);
var foundToken=false,re=quickChild,m=re.exec(t);
if(m){nodeName=m[1].toUpperCase();
for(var i=0;
ret[i];
i++){for(var c=ret[i].firstChild;
c;
c=c.nextSibling){if(c.nodeType==1&&(nodeName=="*"||c.nodeName.toUpperCase()==nodeName)){r.push(c);
}}}ret=r;
t=t.replace(re,"");
if(t.indexOf(" ")==0){continue;
}foundToken=true;
}else{re=/^([>+~])\s*(\w*)/i;
if((m=re.exec(t))!=null){r=[];
var merge={};
nodeName=m[2].toUpperCase();
m=m[1];
for(var j=0,rl=ret.length;
j<rl;
j++){var n=m=="~"||m=="+"?ret[j].nextSibling:ret[j].firstChild;
for(;
n;
n=n.nextSibling){if(n.nodeType==1){var id=jQuery.data(n);
if(m=="~"&&merge[id]){break;
}if(!nodeName||n.nodeName.toUpperCase()==nodeName){if(m=="~"){merge[id]=true;
}r.push(n);
}if(m=="+"){break;
}}}}ret=r;
t=jQuery.trim(t.replace(re,""));
foundToken=true;
}}if(t&&!foundToken){if(!t.indexOf(",")){if(context==ret[0]){ret.shift();
}done=jQuery.merge(done,ret);
r=ret=[context];
t=" "+t.substr(1,t.length);
}else{var re2=quickID;
var m=re2.exec(t);
if(m){m=[0,m[2],m[3],m[1]];
}else{re2=quickClass;
m=re2.exec(t);
}m[2]=m[2].replace(/\\/g,"");
var elem=ret[ret.length-1];
if(m[1]=="#"&&elem&&elem.getElementById&&!jQuery.isXMLDoc(elem)){var oid=elem.getElementById(m[2]);
if((jQuery.browser.msie||jQuery.browser.opera)&&oid&&typeof oid.id=="string"&&oid.id!=m[2]){oid=jQuery('[@id="'+m[2]+'"]',elem)[0];
}ret=r=oid&&(!m[3]||jQuery.nodeName(oid,m[3]))?[oid]:[];
}else{for(var i=0;
ret[i];
i++){var tag=m[1]=="#"&&m[3]?m[3]:m[1]!=""||m[0]==""?"*":m[2];
if(tag=="*"&&ret[i].nodeName.toLowerCase()=="object"){tag="param";
}r=jQuery.merge(r,ret[i].getElementsByTagName(tag));
}if(m[1]=="."){r=jQuery.classFilter(r,m[2]);
}if(m[1]=="#"){var tmp=[];
for(var i=0;
r[i];
i++){if(r[i].getAttribute("id")==m[2]){tmp=[r[i]];
break;
}}r=tmp;
}ret=r;
}t=t.replace(re2,"");
}}if(t){var val=jQuery.filter(t,r);
ret=r=val.r;
t=jQuery.trim(val.t);
}}if(t){ret=[];
}if(ret&&context==ret[0]){ret.shift();
}done=jQuery.merge(done,ret);
return done;
},classFilter:function(r,m,not){m=" "+m+" ";
var tmp=[];
for(var i=0;
r[i];
i++){var pass=(" "+r[i].className+" ").indexOf(m)>=0;
if(!not&&pass||not&&!pass){tmp.push(r[i]);
}}return tmp;
},filter:function(t,r,not){var last;
while(t&&t!=last){last=t;
var p=jQuery.parse,m;
for(var i=0;
p[i];
i++){m=p[i].exec(t);
if(m){t=t.substring(m[0].length);
m[2]=m[2].replace(/\\/g,"");
break;
}}if(!m){break;
}if(m[1]==":"&&m[2]=="not"){r=isSimple.test(m[3])?jQuery.filter(m[3],r,true).r:jQuery(r).not(m[3]);
}else{if(m[1]=="."){r=jQuery.classFilter(r,m[2],not);
}else{if(m[1]=="["){var tmp=[],type=m[3];
for(var i=0,rl=r.length;
i<rl;
i++){var a=r[i],z=a[jQuery.props[m[2]]||m[2]];
if(z==null||/href|src|selected/.test(m[2])){z=jQuery.attr(a,m[2])||"";
}if((type==""&&!!z||type=="="&&z==m[5]||type=="!="&&z!=m[5]||type=="^="&&z&&!z.indexOf(m[5])||type=="$="&&z.substr(z.length-m[5].length)==m[5]||(type=="*="||type=="~=")&&z.indexOf(m[5])>=0)^not){tmp.push(a);
}}r=tmp;
}else{if(m[1]==":"&&m[2]=="nth-child"){var merge={},tmp=[],test=/(-?)(\d*)n((?:\+|-)?\d*)/.exec(m[3]=="even"&&"2n"||m[3]=="odd"&&"2n+1"||!/\D/.test(m[3])&&"0n+"+m[3]||m[3]),first=(test[1]+(test[2]||1))-0,last=test[3]-0;
for(var i=0,rl=r.length;
i<rl;
i++){var node=r[i],parentNode=node.parentNode,id=jQuery.data(parentNode);
if(!merge[id]){var c=1;
for(var n=parentNode.firstChild;
n;
n=n.nextSibling){if(n.nodeType==1){n.nodeIndex=c++;
}}merge[id]=true;
}var add=false;
if(first==0){if(node.nodeIndex==last){add=true;
}}else{if((node.nodeIndex-last)%first==0&&(node.nodeIndex-last)/first>=0){add=true;
}}if(add^not){tmp.push(node);
}}r=tmp;
}else{var fn=jQuery.expr[m[1]];
if(typeof fn=="object"){fn=fn[m[2]];
}if(typeof fn=="string"){fn=eval("false||function(a,i){return "+fn+";}");
}r=jQuery.grep(r,function(elem,i){return fn(elem,i,m,r);
},not);
}}}}}return{r:r,t:t};
},dir:function(elem,dir){var matched=[],cur=elem[dir];
while(cur&&cur!=document){if(cur.nodeType==1){matched.push(cur);
}cur=cur[dir];
}return matched;
},nth:function(cur,result,dir,elem){result=result||1;
var num=0;
for(;
cur;
cur=cur[dir]){if(cur.nodeType==1&&++num==result){break;
}}return cur;
},sibling:function(n,elem){var r=[];
for(;
n;
n=n.nextSibling){if(n.nodeType==1&&n!=elem){r.push(n);
}}return r;
}});
jQuery.event={add:function(elem,types,handler,data){if(elem.nodeType==3||elem.nodeType==8){return ;
}if(jQuery.browser.msie&&elem.setInterval){elem=window;
}if(!handler.guid){handler.guid=this.guid++;
}if(data!=undefined){var fn=handler;
handler=this.proxy(fn,function(){return fn.apply(this,arguments);
});
handler.data=data;
}var events=jQuery.data(elem,"events")||jQuery.data(elem,"events",{}),handle=jQuery.data(elem,"handle")||jQuery.data(elem,"handle",function(){if(typeof jQuery!="undefined"&&!jQuery.event.triggered){return jQuery.event.handle.apply(arguments.callee.elem,arguments);
}});
handle.elem=elem;
jQuery.each(types.split(/\s+/),function(index,type){var parts=type.split(".");
type=parts[0];
handler.type=parts[1];
var handlers=events[type];
if(!handlers){handlers=events[type]={};
if(!jQuery.event.special[type]||jQuery.event.special[type].setup.call(elem)===false){if(elem.addEventListener){elem.addEventListener(type,handle,false);
}else{if(elem.attachEvent){elem.attachEvent("on"+type,handle);
}}}}handlers[handler.guid]=handler;
jQuery.event.global[type]=true;
});
elem=null;
},guid:1,global:{},remove:function(elem,types,handler){if(elem.nodeType==3||elem.nodeType==8){return ;
}var events=jQuery.data(elem,"events"),ret,index;
if(events){if(types==undefined||(typeof types=="string"&&types.charAt(0)==".")){for(var type in events){this.remove(elem,type+(types||""));
}}else{if(types.type){handler=types.handler;
types=types.type;
}jQuery.each(types.split(/\s+/),function(index,type){var parts=type.split(".");
type=parts[0];
if(events[type]){if(handler){delete events[type][handler.guid];
}else{for(handler in events[type]){if(!parts[1]||events[type][handler].type==parts[1]){delete events[type][handler];
}}}for(ret in events[type]){break;
}if(!ret){if(!jQuery.event.special[type]||jQuery.event.special[type].teardown.call(elem)===false){if(elem.removeEventListener){elem.removeEventListener(type,jQuery.data(elem,"handle"),false);
}else{if(elem.detachEvent){elem.detachEvent("on"+type,jQuery.data(elem,"handle"));
}}}ret=null;
delete events[type];
}}});
}for(ret in events){break;
}if(!ret){var handle=jQuery.data(elem,"handle");
if(handle){handle.elem=null;
}jQuery.removeData(elem,"events");
jQuery.removeData(elem,"handle");
}}},trigger:function(type,data,elem,donative,extra){data=jQuery.makeArray(data);
if(type.indexOf("!")>=0){type=type.slice(0,-1);
var exclusive=true;
}if(!elem){if(this.global[type]){jQuery("*").add([window,document]).trigger(type,data);
}}else{if(elem.nodeType==3||elem.nodeType==8){return undefined;
}var val,ret,fn=jQuery.isFunction(elem[type]||null),event=!data[0]||!data[0].preventDefault;
if(event){data.unshift({type:type,target:elem,preventDefault:function(){},stopPropagation:function(){},timeStamp:now()});
data[0][expando]=true;
}data[0].type=type;
if(exclusive){data[0].exclusive=true;
}var handle=jQuery.data(elem,"handle");
if(handle){val=handle.apply(elem,data);
}if((!fn||(jQuery.nodeName(elem,"a")&&type=="click"))&&elem["on"+type]&&elem["on"+type].apply(elem,data)===false){val=false;
}if(event){data.shift();
}if(extra&&jQuery.isFunction(extra)){ret=extra.apply(elem,val==null?data:data.concat(val));
if(ret!==undefined){val=ret;
}}if(fn&&donative!==false&&val!==false&&!(jQuery.nodeName(elem,"a")&&type=="click")){this.triggered=true;
try{elem[type]();
}catch(e){}}this.triggered=false;
}return val;
},handle:function(event){var val,ret,namespace,all,handlers;
event=arguments[0]=jQuery.event.fix(event||window.event);
namespace=event.type.split(".");
event.type=namespace[0];
namespace=namespace[1];
all=!namespace&&!event.exclusive;
handlers=(jQuery.data(this,"events")||{})[event.type];
for(var j in handlers){var handler=handlers[j];
if(all||handler.type==namespace){event.handler=handler;
event.data=handler.data;
ret=handler.apply(this,arguments);
if(val!==false){val=ret;
}if(ret===false){event.preventDefault();
event.stopPropagation();
}}}return val;
},fix:function(event){if(event[expando]==true){return event;
}var originalEvent=event;
event={originalEvent:originalEvent};
var props="altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode metaKey newValue originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target timeStamp toElement type view wheelDelta which".split(" ");
for(var i=props.length;
i;
i--){event[props[i]]=originalEvent[props[i]];
}event[expando]=true;
event.preventDefault=function(){if(originalEvent.preventDefault){originalEvent.preventDefault();
}originalEvent.returnValue=false;
};
event.stopPropagation=function(){if(originalEvent.stopPropagation){originalEvent.stopPropagation();
}originalEvent.cancelBubble=true;
};
event.timeStamp=event.timeStamp||now();
if(!event.target){event.target=event.srcElement||document;
}if(event.target.nodeType==3){event.target=event.target.parentNode;
}if(!event.relatedTarget&&event.fromElement){event.relatedTarget=event.fromElement==event.target?event.toElement:event.fromElement;
}if(event.pageX==null&&event.clientX!=null){var doc=document.documentElement,body=document.body;
event.pageX=event.clientX+(doc&&doc.scrollLeft||body&&body.scrollLeft||0)-(doc.clientLeft||0);
event.pageY=event.clientY+(doc&&doc.scrollTop||body&&body.scrollTop||0)-(doc.clientTop||0);
}if(!event.which&&((event.charCode||event.charCode===0)?event.charCode:event.keyCode)){event.which=event.charCode||event.keyCode;
}if(!event.metaKey&&event.ctrlKey){event.metaKey=event.ctrlKey;
}if(!event.which&&event.button){event.which=(event.button&1?1:(event.button&2?3:(event.button&4?2:0)));
}return event;
},proxy:function(fn,proxy){proxy.guid=fn.guid=fn.guid||proxy.guid||this.guid++;
return proxy;
},special:{ready:{setup:function(){bindReady();
return ;
},teardown:function(){return ;
}},mouseenter:{setup:function(){if(jQuery.browser.msie){return false;
}jQuery(this).bind("mouseover",jQuery.event.special.mouseenter.handler);
return true;
},teardown:function(){if(jQuery.browser.msie){return false;
}jQuery(this).unbind("mouseover",jQuery.event.special.mouseenter.handler);
return true;
},handler:function(event){if(withinElement(event,this)){return true;
}event.type="mouseenter";
return jQuery.event.handle.apply(this,arguments);
}},mouseleave:{setup:function(){if(jQuery.browser.msie){return false;
}jQuery(this).bind("mouseout",jQuery.event.special.mouseleave.handler);
return true;
},teardown:function(){if(jQuery.browser.msie){return false;
}jQuery(this).unbind("mouseout",jQuery.event.special.mouseleave.handler);
return true;
},handler:function(event){if(withinElement(event,this)){return true;
}event.type="mouseleave";
return jQuery.event.handle.apply(this,arguments);
}}}};
jQuery.fn.extend({bind:function(type,data,fn){return type=="unload"?this.one(type,data,fn):this.each(function(){jQuery.event.add(this,type,fn||data,fn&&data);
});
},one:function(type,data,fn){var one=jQuery.event.proxy(fn||data,function(event){jQuery(this).unbind(event,one);
return(fn||data).apply(this,arguments);
});
return this.each(function(){jQuery.event.add(this,type,one,fn&&data);
});
},unbind:function(type,fn){return this.each(function(){jQuery.event.remove(this,type,fn);
});
},trigger:function(type,data,fn){return this.each(function(){jQuery.event.trigger(type,data,this,true,fn);
});
},triggerHandler:function(type,data,fn){return this[0]&&jQuery.event.trigger(type,data,this[0],false,fn);
},toggle:function(fn){var args=arguments,i=1;
while(i<args.length){jQuery.event.proxy(fn,args[i++]);
}return this.click(jQuery.event.proxy(fn,function(event){this.lastToggle=(this.lastToggle||0)%i;
event.preventDefault();
return args[this.lastToggle++].apply(this,arguments)||false;
}));
},hover:function(fnOver,fnOut){return this.bind("mouseenter",fnOver).bind("mouseleave",fnOut);
},ready:function(fn){bindReady();
if(jQuery.isReady){fn.call(document,jQuery);
}else{jQuery.readyList.push(function(){return fn.call(this,jQuery);
});
}return this;
}});
jQuery.extend({isReady:false,readyList:[],ready:function(){if(!jQuery.isReady){jQuery.isReady=true;
if(jQuery.readyList){jQuery.each(jQuery.readyList,function(){this.call(document);
});
jQuery.readyList=null;
}jQuery(document).triggerHandler("ready");
}}});
var readyBound=false;
function bindReady(){if(readyBound){return ;
}readyBound=true;
if(document.addEventListener&&!jQuery.browser.opera){document.addEventListener("DOMContentLoaded",jQuery.ready,false);
}if(jQuery.browser.msie&&window==top){(function(){if(jQuery.isReady){return ;
}try{document.documentElement.doScroll("left");
}catch(error){setTimeout(arguments.callee,0);
return ;
}jQuery.ready();
})();
}if(jQuery.browser.opera){document.addEventListener("DOMContentLoaded",function(){if(jQuery.isReady){return ;
}for(var i=0;
i<document.styleSheets.length;
i++){if(document.styleSheets[i].disabled){setTimeout(arguments.callee,0);
return ;
}}jQuery.ready();
},false);
}if(jQuery.browser.safari){var numStyles;
(function(){if(jQuery.isReady){return ;
}if(document.readyState!="loaded"&&document.readyState!="complete"){setTimeout(arguments.callee,0);
return ;
}if(numStyles===undefined){numStyles=jQuery("style, link[rel=stylesheet]").length;
}if(document.styleSheets.length!=numStyles){setTimeout(arguments.callee,0);
return ;
}jQuery.ready();
})();
}jQuery.event.add(window,"load",jQuery.ready);
}jQuery.each(("blur,focus,load,resize,scroll,unload,click,dblclick,mousedown,mouseup,mousemove,mouseover,mouseout,change,select,submit,keydown,keypress,keyup,error").split(","),function(i,name){jQuery.fn[name]=function(fn){return fn?this.bind(name,fn):this.trigger(name);
};
});
var withinElement=function(event,elem){var parent=event.relatedTarget;
while(parent&&parent!=elem){try{parent=parent.parentNode;
}catch(error){parent=elem;
}}return parent==elem;
};
jQuery(window).bind("unload",function(){jQuery("*").add(document).unbind();
});
jQuery.fn.extend({_load:jQuery.fn.load,load:function(url,params,callback){if(typeof url!="string"){return this._load(url);
}var off=url.indexOf(" ");
if(off>=0){var selector=url.slice(off,url.length);
url=url.slice(0,off);
}callback=callback||function(){};
var type="GET";
if(params){if(jQuery.isFunction(params)){callback=params;
params=null;
}else{params=jQuery.param(params);
type="POST";
}}var self=this;
jQuery.ajax({url:url,type:type,dataType:"html",data:params,complete:function(res,status){if(status=="success"||status=="notmodified"){self.html(selector?jQuery("<div/>").append(res.responseText.replace(/<script(.|\s)*?\/script>/g,"")).find(selector):res.responseText);
}self.each(callback,[res.responseText,status,res]);
}});
return this;
},serialize:function(){return jQuery.param(this.serializeArray());
},serializeArray:function(){return this.map(function(){return jQuery.nodeName(this,"form")?jQuery.makeArray(this.elements):this;
}).filter(function(){return this.name&&!this.disabled&&(this.checked||/select|textarea/i.test(this.nodeName)||/text|hidden|password/i.test(this.type));
}).map(function(i,elem){var val=jQuery(this).val();
return val==null?null:val.constructor==Array?jQuery.map(val,function(val,i){return{name:elem.name,value:val};
}):{name:elem.name,value:val};
}).get();
}});
jQuery.each("ajaxStart,ajaxStop,ajaxComplete,ajaxError,ajaxSuccess,ajaxSend".split(","),function(i,o){jQuery.fn[o]=function(f){return this.bind(o,f);
};
});
var jsc=now();
jQuery.extend({get:function(url,data,callback,type){if(jQuery.isFunction(data)){callback=data;
data=null;
}return jQuery.ajax({type:"GET",url:url,data:data,success:callback,dataType:type});
},getScript:function(url,callback){return jQuery.get(url,null,callback,"script");
},getJSON:function(url,data,callback){return jQuery.get(url,data,callback,"json");
},post:function(url,data,callback,type){if(jQuery.isFunction(data)){callback=data;
data={};
}return jQuery.ajax({type:"POST",url:url,data:data,success:callback,dataType:type});
},ajaxSetup:function(settings){jQuery.extend(jQuery.ajaxSettings,settings);
},ajaxSettings:{url:location.href,global:true,type:"GET",timeout:0,contentType:"application/x-www-form-urlencoded",processData:true,async:true,data:null,username:null,password:null,accepts:{xml:"application/xml, text/xml",html:"text/html",script:"text/javascript, application/javascript",json:"application/json, text/javascript",text:"text/plain",_default:"*/*"}},lastModified:{},ajax:function(s){s=jQuery.extend(true,s,jQuery.extend(true,{},jQuery.ajaxSettings,s));
var jsonp,jsre=/=\?(&|$)/g,status,data,type=s.type.toUpperCase();
if(s.data&&s.processData&&typeof s.data!="string"){s.data=jQuery.param(s.data);
}if(s.dataType=="jsonp"){if(type=="GET"){if(!s.url.match(jsre)){s.url+=(s.url.match(/\?/)?"&":"?")+(s.jsonp||"callback")+"=?";
}}else{if(!s.data||!s.data.match(jsre)){s.data=(s.data?s.data+"&":"")+(s.jsonp||"callback")+"=?";
}}s.dataType="json";
}if(s.dataType=="json"&&(s.data&&s.data.match(jsre)||s.url.match(jsre))){jsonp="jsonp"+jsc++;
if(s.data){s.data=(s.data+"").replace(jsre,"="+jsonp+"$1");
}s.url=s.url.replace(jsre,"="+jsonp+"$1");
s.dataType="script";
window[jsonp]=function(tmp){data=tmp;
success();
complete();
window[jsonp]=undefined;
try{delete window[jsonp];
}catch(e){}if(head){head.removeChild(script);
}};
}if(s.dataType=="script"&&s.cache==null){s.cache=false;
}if(s.cache===false&&type=="GET"){var ts=now();
var ret=s.url.replace(/(\?|&)_=.*?(&|$)/,"$1_="+ts+"$2");
s.url=ret+((ret==s.url)?(s.url.match(/\?/)?"&":"?")+"_="+ts:"");
}if(s.data&&type=="GET"){s.url+=(s.url.match(/\?/)?"&":"?")+s.data;
s.data=null;
}if(s.global&&!jQuery.active++){jQuery.event.trigger("ajaxStart");
}var remote=/^(?:\w+:)?\/\/([^\/?#]+)/;
if(s.dataType=="script"&&type=="GET"&&remote.test(s.url)&&remote.exec(s.url)[1]!=location.host){var head=document.getElementsByTagName("head")[0];
var script=document.createElement("script");
script.src=s.url;
if(s.scriptCharset){script.charset=s.scriptCharset;
}if(!jsonp){var done=false;
script.onload=script.onreadystatechange=function(){if(!done&&(!this.readyState||this.readyState=="loaded"||this.readyState=="complete")){done=true;
success();
complete();
head.removeChild(script);
}};
}head.appendChild(script);
return undefined;
}var requestDone=false;
var xhr=window.ActiveXObject?new ActiveXObject("Microsoft.XMLHTTP"):new XMLHttpRequest();
if(s.username){xhr.open(type,s.url,s.async,s.username,s.password);
}else{xhr.open(type,s.url,s.async);
}try{if(s.data){xhr.setRequestHeader("Content-Type",s.contentType);
}if(s.ifModified){xhr.setRequestHeader("If-Modified-Since",jQuery.lastModified[s.url]||"Thu, 01 Jan 1970 00:00:00 GMT");
}xhr.setRequestHeader("X-Requested-With","XMLHttpRequest");
xhr.setRequestHeader("Accept",s.dataType&&s.accepts[s.dataType]?s.accepts[s.dataType]+", */*":s.accepts._default);
}catch(e){}if(s.beforeSend&&s.beforeSend(xhr,s)===false){s.global&&jQuery.active--;
xhr.abort();
return false;
}if(s.global){jQuery.event.trigger("ajaxSend",[xhr,s]);
}var onreadystatechange=function(isTimeout){if(!requestDone&&xhr&&(xhr.readyState==4||isTimeout=="timeout")){requestDone=true;
if(ival){clearInterval(ival);
ival=null;
}status=isTimeout=="timeout"&&"timeout"||!jQuery.httpSuccess(xhr)&&"error"||s.ifModified&&jQuery.httpNotModified(xhr,s.url)&&"notmodified"||"success";
if(status=="success"){try{data=jQuery.httpData(xhr,s.dataType,s.dataFilter);
}catch(e){status="parsererror";
}}if(status=="success"){var modRes;
try{modRes=xhr.getResponseHeader("Last-Modified");
}catch(e){}if(s.ifModified&&modRes){jQuery.lastModified[s.url]=modRes;
}if(!jsonp){success();
}}else{jQuery.handleError(s,xhr,status);
}complete();
if(s.async){xhr=null;
}}};
if(s.async){var ival=setInterval(onreadystatechange,13);
if(s.timeout>0){setTimeout(function(){if(xhr){xhr.abort();
if(!requestDone){onreadystatechange("timeout");
}}},s.timeout);
}}try{xhr.send(s.data);
}catch(e){jQuery.handleError(s,xhr,null,e);
}if(!s.async){onreadystatechange();
}function success(){if(s.success){s.success(data,status);
}if(s.global){jQuery.event.trigger("ajaxSuccess",[xhr,s]);
}}function complete(){if(s.complete){s.complete(xhr,status);
}if(s.global){jQuery.event.trigger("ajaxComplete",[xhr,s]);
}if(s.global&&!--jQuery.active){jQuery.event.trigger("ajaxStop");
}}return xhr;
},handleError:function(s,xhr,status,e){if(s.error){s.error(xhr,status,e);
}if(s.global){jQuery.event.trigger("ajaxError",[xhr,s,e]);
}},active:0,httpSuccess:function(xhr){try{return !xhr.status&&location.protocol=="file:"||(xhr.status>=200&&xhr.status<300)||xhr.status==304||xhr.status==1223||jQuery.browser.safari&&xhr.status==undefined;
}catch(e){}return false;
},httpNotModified:function(xhr,url){try{var xhrRes=xhr.getResponseHeader("Last-Modified");
return xhr.status==304||xhrRes==jQuery.lastModified[url]||jQuery.browser.safari&&xhr.status==undefined;
}catch(e){}return false;
},httpData:function(xhr,type,filter){var ct=xhr.getResponseHeader("content-type"),xml=type=="xml"||!type&&ct&&ct.indexOf("xml")>=0,data=xml?xhr.responseXML:xhr.responseText;
if(xml&&data.documentElement.tagName=="parsererror"){throw"parsererror";
}if(filter){data=filter(data,type);
}if(type=="script"){jQuery.globalEval(data);
}if(type=="json"){data=eval("("+data+")");
}return data;
},param:function(a){var s=[];
if(a.constructor==Array||a.jquery){jQuery.each(a,function(){s.push(encodeURIComponent(this.name)+"="+encodeURIComponent(this.value));
});
}else{for(var j in a){if(a[j]&&a[j].constructor==Array){jQuery.each(a[j],function(){s.push(encodeURIComponent(j)+"="+encodeURIComponent(this));
});
}else{s.push(encodeURIComponent(j)+"="+encodeURIComponent(jQuery.isFunction(a[j])?a[j]():a[j]));
}}}return s.join("&").replace(/%20/g,"+");
}});
jQuery.fn.extend({show:function(speed,callback){return speed?this.animate({height:"show",width:"show",opacity:"show"},speed,callback):this.filter(":hidden").each(function(){this.style.display=this.oldblock||"";
if(jQuery.css(this,"display")=="none"){var elem=jQuery("<"+this.tagName+" />").appendTo("body");
this.style.display=elem.css("display");
if(this.style.display=="none"){this.style.display="block";
}elem.remove();
}}).end();
},hide:function(speed,callback){return speed?this.animate({height:"hide",width:"hide",opacity:"hide"},speed,callback):this.filter(":visible").each(function(){this.oldblock=this.oldblock||jQuery.css(this,"display");
this.style.display="none";
}).end();
},_toggle:jQuery.fn.toggle,toggle:function(fn,fn2){return jQuery.isFunction(fn)&&jQuery.isFunction(fn2)?this._toggle.apply(this,arguments):fn?this.animate({height:"toggle",width:"toggle",opacity:"toggle"},fn,fn2):this.each(function(){jQuery(this)[jQuery(this).is(":hidden")?"show":"hide"]();
});
},slideDown:function(speed,callback){return this.animate({height:"show"},speed,callback);
},slideUp:function(speed,callback){return this.animate({height:"hide"},speed,callback);
},slideToggle:function(speed,callback){return this.animate({height:"toggle"},speed,callback);
},fadeIn:function(speed,callback){return this.animate({opacity:"show"},speed,callback);
},fadeOut:function(speed,callback){return this.animate({opacity:"hide"},speed,callback);
},fadeTo:function(speed,to,callback){return this.animate({opacity:to},speed,callback);
},animate:function(prop,speed,easing,callback){var optall=jQuery.speed(speed,easing,callback);
return this[optall.queue===false?"each":"queue"](function(){if(this.nodeType!=1){return false;
}var opt=jQuery.extend({},optall),p,hidden=jQuery(this).is(":hidden"),self=this;
for(p in prop){if(prop[p]=="hide"&&hidden||prop[p]=="show"&&!hidden){return opt.complete.call(this);
}if(p=="height"||p=="width"){opt.display=jQuery.css(this,"display");
opt.overflow=this.style.overflow;
}}if(opt.overflow!=null){this.style.overflow="hidden";
}opt.curAnim=jQuery.extend({},prop);
jQuery.each(prop,function(name,val){var e=new jQuery.fx(self,opt,name);
if(/toggle|show|hide/.test(val)){e[val=="toggle"?hidden?"show":"hide":val](prop);
}else{var parts=val.toString().match(/^([+-]=)?([\d+-.]+)(.*)$/),start=e.cur(true)||0;
if(parts){var end=parseFloat(parts[2]),unit=parts[3]||"px";
if(unit!="px"){self.style[name]=(end||1)+unit;
start=((end||1)/e.cur(true))*start;
self.style[name]=start+unit;
}if(parts[1]){end=((parts[1]=="-="?-1:1)*end)+start;
}e.custom(start,end,unit);
}else{e.custom(start,val,"");
}}});
return true;
});
},queue:function(type,fn){if(jQuery.isFunction(type)||(type&&type.constructor==Array)){fn=type;
type="fx";
}if(!type||(typeof type=="string"&&!fn)){return queue(this[0],type);
}return this.each(function(){if(fn.constructor==Array){queue(this,type,fn);
}else{queue(this,type).push(fn);
if(queue(this,type).length==1){fn.call(this);
}}});
},stop:function(clearQueue,gotoEnd){var timers=jQuery.timers;
if(clearQueue){this.queue([]);
}this.each(function(){for(var i=timers.length-1;
i>=0;
i--){if(timers[i].elem==this){if(gotoEnd){timers[i](true);
}timers.splice(i,1);
}}});
if(!gotoEnd){this.dequeue();
}return this;
}});
var queue=function(elem,type,array){if(elem){type=type||"fx";
var q=jQuery.data(elem,type+"queue");
if(!q||array){q=jQuery.data(elem,type+"queue",jQuery.makeArray(array));
}}return q;
};
jQuery.fn.dequeue=function(type){type=type||"fx";
return this.each(function(){var q=queue(this,type);
q.shift();
if(q.length){q[0].call(this);
}});
};
jQuery.extend({speed:function(speed,easing,fn){var opt=speed&&speed.constructor==Object?speed:{complete:fn||!fn&&easing||jQuery.isFunction(speed)&&speed,duration:speed,easing:fn&&easing||easing&&easing.constructor!=Function&&easing};
opt.duration=(opt.duration&&opt.duration.constructor==Number?opt.duration:jQuery.fx.speeds[opt.duration])||jQuery.fx.speeds.def;
opt.old=opt.complete;
opt.complete=function(){if(opt.queue!==false){jQuery(this).dequeue();
}if(jQuery.isFunction(opt.old)){opt.old.call(this);
}};
return opt;
},easing:{linear:function(p,n,firstNum,diff){return firstNum+diff*p;
},swing:function(p,n,firstNum,diff){return((-Math.cos(p*Math.PI)/2)+0.5)*diff+firstNum;
}},timers:[],timerId:null,fx:function(elem,options,prop){this.options=options;
this.elem=elem;
this.prop=prop;
if(!options.orig){options.orig={};
}}});
jQuery.fx.prototype={update:function(){if(this.options.step){this.options.step.call(this.elem,this.now,this);
}(jQuery.fx.step[this.prop]||jQuery.fx.step._default)(this);
if(this.prop=="height"||this.prop=="width"){this.elem.style.display="block";
}},cur:function(force){if(this.elem[this.prop]!=null&&this.elem.style[this.prop]==null){return this.elem[this.prop];
}var r=parseFloat(jQuery.css(this.elem,this.prop,force));
return r&&r>-10000?r:parseFloat(jQuery.curCSS(this.elem,this.prop))||0;
},custom:function(from,to,unit){this.startTime=now();
this.start=from;
this.end=to;
this.unit=unit||this.unit||"px";
this.now=this.start;
this.pos=this.state=0;
this.update();
var self=this;
function t(gotoEnd){return self.step(gotoEnd);
}t.elem=this.elem;
jQuery.timers.push(t);
if(jQuery.timerId==null){jQuery.timerId=setInterval(function(){var timers=jQuery.timers;
for(var i=0;
i<timers.length;
i++){if(!timers[i]()){timers.splice(i--,1);
}}if(!timers.length){clearInterval(jQuery.timerId);
jQuery.timerId=null;
}},13);
}},show:function(){this.options.orig[this.prop]=jQuery.attr(this.elem.style,this.prop);
this.options.show=true;
this.custom(0,this.cur());
if(this.prop=="width"||this.prop=="height"){this.elem.style[this.prop]="1px";
}jQuery(this.elem).show();
},hide:function(){this.options.orig[this.prop]=jQuery.attr(this.elem.style,this.prop);
this.options.hide=true;
this.custom(this.cur(),0);
},step:function(gotoEnd){var t=now();
if(gotoEnd||t>this.options.duration+this.startTime){this.now=this.end;
this.pos=this.state=1;
this.update();
this.options.curAnim[this.prop]=true;
var done=true;
for(var i in this.options.curAnim){if(this.options.curAnim[i]!==true){done=false;
}}if(done){if(this.options.display!=null){this.elem.style.overflow=this.options.overflow;
this.elem.style.display=this.options.display;
if(jQuery.css(this.elem,"display")=="none"){this.elem.style.display="block";
}}if(this.options.hide){this.elem.style.display="none";
}if(this.options.hide||this.options.show){for(var p in this.options.curAnim){jQuery.attr(this.elem.style,p,this.options.orig[p]);
}}}if(done){this.options.complete.call(this.elem);
}return false;
}else{var n=t-this.startTime;
this.state=n/this.options.duration;
this.pos=jQuery.easing[this.options.easing||(jQuery.easing.swing?"swing":"linear")](this.state,n,0,1,this.options.duration);
this.now=this.start+((this.end-this.start)*this.pos);
this.update();
}return true;
}};
jQuery.extend(jQuery.fx,{speeds:{slow:600,fast:200,def:400},step:{scrollLeft:function(fx){fx.elem.scrollLeft=fx.now;
},scrollTop:function(fx){fx.elem.scrollTop=fx.now;
},opacity:function(fx){jQuery.attr(fx.elem.style,"opacity",fx.now);
},_default:function(fx){fx.elem.style[fx.prop]=fx.now+fx.unit;
}}});
jQuery.fn.offset=function(){var left=0,top=0,elem=this[0],results;
if(elem){with(jQuery.browser){var parent=elem.parentNode,offsetChild=elem,offsetParent=elem.offsetParent,doc=elem.ownerDocument,safari2=safari&&parseInt(version)<522&&!/adobeair/i.test(userAgent),css=jQuery.curCSS,fixed=css(elem,"position")=="fixed";
if(elem.getBoundingClientRect){var box=elem.getBoundingClientRect();
add(box.left+Math.max(doc.documentElement.scrollLeft,doc.body.scrollLeft),box.top+Math.max(doc.documentElement.scrollTop,doc.body.scrollTop));
add(-doc.documentElement.clientLeft,-doc.documentElement.clientTop);
}else{add(elem.offsetLeft,elem.offsetTop);
while(offsetParent){add(offsetParent.offsetLeft,offsetParent.offsetTop);
if(mozilla&&!/^t(able|d|h)$/i.test(offsetParent.tagName)||safari&&!safari2){border(offsetParent);
}if(!fixed&&css(offsetParent,"position")=="fixed"){fixed=true;
}offsetChild=/^body$/i.test(offsetParent.tagName)?offsetChild:offsetParent;
offsetParent=offsetParent.offsetParent;
}while(parent&&parent.tagName&&!/^body|html$/i.test(parent.tagName)){if(!/^inline|table.*$/i.test(css(parent,"display"))){add(-parent.scrollLeft,-parent.scrollTop);
}if(mozilla&&css(parent,"overflow")!="visible"){border(parent);
}parent=parent.parentNode;
}if((safari2&&(fixed||css(offsetChild,"position")=="absolute"))||(mozilla&&css(offsetChild,"position")!="absolute")){add(-doc.body.offsetLeft,-doc.body.offsetTop);
}if(fixed){add(Math.max(doc.documentElement.scrollLeft,doc.body.scrollLeft),Math.max(doc.documentElement.scrollTop,doc.body.scrollTop));
}}results={top:top,left:left};
}}function border(elem){add(jQuery.curCSS(elem,"borderLeftWidth",true),jQuery.curCSS(elem,"borderTopWidth",true));
}function add(l,t){left+=parseInt(l,10)||0;
top+=parseInt(t,10)||0;
}return results;
};
jQuery.fn.extend({position:function(){var left=0,top=0,results;
if(this[0]){var offsetParent=this.offsetParent(),offset=this.offset(),parentOffset=/^body|html$/i.test(offsetParent[0].tagName)?{top:0,left:0}:offsetParent.offset();
offset.top-=num(this,"marginTop");
offset.left-=num(this,"marginLeft");
parentOffset.top+=num(offsetParent,"borderTopWidth");
parentOffset.left+=num(offsetParent,"borderLeftWidth");
results={top:offset.top-parentOffset.top,left:offset.left-parentOffset.left};
}return results;
},offsetParent:function(){var offsetParent=this[0].offsetParent;
while(offsetParent&&(!/^body|html$/i.test(offsetParent.tagName)&&jQuery.css(offsetParent,"position")=="static")){offsetParent=offsetParent.offsetParent;
}return jQuery(offsetParent);
}});
jQuery.each(["Left","Top"],function(i,name){var method="scroll"+name;
jQuery.fn[method]=function(val){if(!this[0]){return ;
}return val!=undefined?this.each(function(){this==window||this==document?window.scrollTo(!i?val:jQuery(window).scrollLeft(),i?val:jQuery(window).scrollTop()):this[method]=val;
}):this[0]==window||this[0]==document?self[i?"pageYOffset":"pageXOffset"]||jQuery.boxModel&&document.documentElement[method]||document.body[method]:this[0][method];
};
});
jQuery.each(["Height","Width"],function(i,name){var tl=i?"Left":"Top",br=i?"Right":"Bottom";
jQuery.fn["inner"+name]=function(){return this[name.toLowerCase()]()+num(this,"padding"+tl)+num(this,"padding"+br);
};
jQuery.fn["outer"+name]=function(margin){return this["inner"+name]()+num(this,"border"+tl+"Width")+num(this,"border"+br+"Width")+(margin?num(this,"margin"+tl)+num(this,"margin"+br):0);
};
});
})();


/* platform.js */
SimileAjax.version="pre 2.3.0";
SimileAjax.jQuery=jQuery.noConflict(true);
if(typeof window["$"]=="undefined"){window.$=SimileAjax.jQuery;
}SimileAjax.Platform.os={isMac:false,isWin:false,isWin32:false,isUnix:false};
SimileAjax.Platform.browser={isIE:false,isNetscape:false,isMozilla:false,isFirefox:false,isOpera:false,isSafari:false,majorVersion:0,minorVersion:0};
(function(){var C=navigator.appName.toLowerCase();
var A=navigator.userAgent.toLowerCase();
SimileAjax.Platform.os.isMac=(A.indexOf("mac")!=-1);
SimileAjax.Platform.os.isWin=(A.indexOf("win")!=-1);
SimileAjax.Platform.os.isWin32=SimileAjax.Platform.isWin&&(A.indexOf("95")!=-1||A.indexOf("98")!=-1||A.indexOf("nt")!=-1||A.indexOf("win32")!=-1||A.indexOf("32bit")!=-1);
SimileAjax.Platform.os.isUnix=(A.indexOf("x11")!=-1);
SimileAjax.Platform.browser.isIE=(C.indexOf("microsoft")!=-1);
SimileAjax.Platform.browser.isNetscape=(C.indexOf("netscape")!=-1);
SimileAjax.Platform.browser.isMozilla=(A.indexOf("mozilla")!=-1);
SimileAjax.Platform.browser.isFirefox=(A.indexOf("firefox")!=-1);
SimileAjax.Platform.browser.isOpera=(C.indexOf("opera")!=-1);
SimileAjax.Platform.browser.isSafari=(C.indexOf("safari")!=-1);
var E=function(G){var F=G.split(".");
SimileAjax.Platform.browser.majorVersion=parseInt(F[0]);
SimileAjax.Platform.browser.minorVersion=parseInt(F[1]);
};
var B=function(H,G,I){var F=H.indexOf(G,I);
return F>=0?F:H.length;
};
if(SimileAjax.Platform.browser.isMozilla){var D=A.indexOf("mozilla/");
if(D>=0){E(A.substring(D+8,B(A," ",D)));
}}if(SimileAjax.Platform.browser.isIE){var D=A.indexOf("msie ");
if(D>=0){E(A.substring(D+5,B(A,";",D)));
}}if(SimileAjax.Platform.browser.isNetscape){var D=A.indexOf("rv:");
if(D>=0){E(A.substring(D+3,B(A,")",D)));
}}if(SimileAjax.Platform.browser.isFirefox){var D=A.indexOf("firefox/");
if(D>=0){E(A.substring(D+8,B(A," ",D)));
}}if(!("localeCompare" in String.prototype)){String.prototype.localeCompare=function(F){if(this<F){return -1;
}else{if(this>F){return 1;
}else{return 0;
}}};
}})();
SimileAjax.Platform.getDefaultLocale=function(){return SimileAjax.Platform.clientLocale;
};


/* ajax.js */
SimileAjax.ListenerQueue=function(A){this._listeners=[];
this._wildcardHandlerName=A;
};
SimileAjax.ListenerQueue.prototype.add=function(A){this._listeners.push(A);
};
SimileAjax.ListenerQueue.prototype.remove=function(C){var A=this._listeners;
for(var B=0;
B<A.length;
B++){if(A[B]==C){A.splice(B,1);
break;
}}};
SimileAjax.ListenerQueue.prototype.fire=function(C,B){var A=[].concat(this._listeners);
for(var D=0;
D<A.length;
D++){var E=A[D];
if(C in E){try{E[C].apply(E,B);
}catch(F){SimileAjax.Debug.exception("Error firing event of name "+C,F);
}}else{if(this._wildcardHandlerName!=null&&this._wildcardHandlerName in E){try{E[this._wildcardHandlerName].apply(E,[C]);
}catch(F){SimileAjax.Debug.exception("Error firing event of name "+C+" to wildcard handler",F);
}}}}};


/* data-structure.js */
SimileAjax.Set=function(A){this._hash={};
this._count=0;
if(A instanceof Array){for(var B=0;
B<A.length;
B++){this.add(A[B]);
}}else{if(A instanceof SimileAjax.Set){this.addSet(A);
}}};
SimileAjax.Set.prototype.add=function(A){if(!(A in this._hash)){this._hash[A]=true;
this._count++;
return true;
}return false;
};
SimileAjax.Set.prototype.addSet=function(B){for(var A in B._hash){this.add(A);
}};
SimileAjax.Set.prototype.remove=function(A){if(A in this._hash){delete this._hash[A];
this._count--;
return true;
}return false;
};
SimileAjax.Set.prototype.removeSet=function(B){for(var A in B._hash){this.remove(A);
}};
SimileAjax.Set.prototype.retainSet=function(B){for(var A in this._hash){if(!B.contains(A)){delete this._hash[A];
this._count--;
}}};
SimileAjax.Set.prototype.contains=function(A){return(A in this._hash);
};
SimileAjax.Set.prototype.size=function(){return this._count;
};
SimileAjax.Set.prototype.toArray=function(){var A=[];
for(var B in this._hash){A.push(B);
}return A;
};
SimileAjax.Set.prototype.visit=function(A){for(var B in this._hash){if(A(B)==true){break;
}}};
SimileAjax.SortedArray=function(B,A){this._a=(A instanceof Array)?A:[];
this._compare=B;
};
SimileAjax.SortedArray.prototype.add=function(C){var A=this;
var B=this.find(function(D){return A._compare(D,C);
});
if(B<this._a.length){this._a.splice(B,0,C);
}else{this._a.push(C);
}};
SimileAjax.SortedArray.prototype.remove=function(C){var A=this;
var B=this.find(function(D){return A._compare(D,C);
});
while(B<this._a.length&&this._compare(this._a[B],C)==0){if(this._a[B]==C){this._a.splice(B,1);
return true;
}else{B++;
}}return false;
};
SimileAjax.SortedArray.prototype.removeAll=function(){this._a=[];
};
SimileAjax.SortedArray.prototype.elementAt=function(A){return this._a[A];
};
SimileAjax.SortedArray.prototype.length=function(){return this._a.length;
};
SimileAjax.SortedArray.prototype.find=function(D){var B=0;
var A=this._a.length;
while(B<A){var C=Math.floor((B+A)/2);
var E=D(this._a[C]);
if(C==B){return E<0?B+1:B;
}else{if(E<0){B=C;
}else{A=C;
}}}return B;
};
SimileAjax.SortedArray.prototype.getFirst=function(){return(this._a.length>0)?this._a[0]:null;
};
SimileAjax.SortedArray.prototype.getLast=function(){return(this._a.length>0)?this._a[this._a.length-1]:null;
};
SimileAjax.EventIndex=function(B){var A=this;
this._unit=(B!=null)?B:SimileAjax.NativeDateUnit;
this._events=new SimileAjax.SortedArray(function(C,D){return A._unit.compare(C.getStart(),D.getStart());
});
this._idToEvent={};
this._indexed=true;
};
SimileAjax.EventIndex.prototype.getUnit=function(){return this._unit;
};
SimileAjax.EventIndex.prototype.getEvent=function(A){return this._idToEvent[A];
};
SimileAjax.EventIndex.prototype.add=function(A){this._events.add(A);
this._idToEvent[A.getID()]=A;
this._indexed=false;
};
SimileAjax.EventIndex.prototype.removeAll=function(){this._events.removeAll();
this._idToEvent={};
this._indexed=false;
};
SimileAjax.EventIndex.prototype.getCount=function(){return this._events.length();
};
SimileAjax.EventIndex.prototype.getIterator=function(A,B){if(!this._indexed){this._index();
}return new SimileAjax.EventIndex._Iterator(this._events,A,B,this._unit);
};
SimileAjax.EventIndex.prototype.getReverseIterator=function(A,B){if(!this._indexed){this._index();
}return new SimileAjax.EventIndex._ReverseIterator(this._events,A,B,this._unit);
};
SimileAjax.EventIndex.prototype.getAllIterator=function(){return new SimileAjax.EventIndex._AllIterator(this._events);
};
SimileAjax.EventIndex.prototype.getEarliestDate=function(){var A=this._events.getFirst();
return(A==null)?null:A.getStart();
};
SimileAjax.EventIndex.prototype.getLatestDate=function(){var A=this._events.getLast();
if(A==null){return null;
}if(!this._indexed){this._index();
}var C=A._earliestOverlapIndex;
var B=this._events.elementAt(C).getEnd();
for(var D=C+1;
D<this._events.length();
D++){B=this._unit.later(B,this._events.elementAt(D).getEnd());
}return B;
};
SimileAjax.EventIndex.prototype._index=function(){var E=this._events.length();
for(var F=0;
F<E;
F++){var D=this._events.elementAt(F);
D._earliestOverlapIndex=F;
}var G=1;
for(var F=0;
F<E;
F++){var D=this._events.elementAt(F);
var C=D.getEnd();
G=Math.max(G,F+1);
while(G<E){var A=this._events.elementAt(G);
var B=A.getStart();
if(this._unit.compare(B,C)<0){A._earliestOverlapIndex=F;
G++;
}else{break;
}}}this._indexed=true;
};
SimileAjax.EventIndex._Iterator=function(A,C,D,B){this._events=A;
this._startDate=C;
this._endDate=D;
this._unit=B;
this._currentIndex=A.find(function(E){return B.compare(E.getStart(),C);
});
if(this._currentIndex-1>=0){this._currentIndex=this._events.elementAt(this._currentIndex-1)._earliestOverlapIndex;
}this._currentIndex--;
this._maxIndex=A.find(function(E){return B.compare(E.getStart(),D);
});
this._hasNext=false;
this._next=null;
this._findNext();
};
SimileAjax.EventIndex._Iterator.prototype={hasNext:function(){return this._hasNext;
},next:function(){if(this._hasNext){var A=this._next;
this._findNext();
return A;
}else{return null;
}},_findNext:function(){var B=this._unit;
while((++this._currentIndex)<this._maxIndex){var A=this._events.elementAt(this._currentIndex);
if(B.compare(A.getStart(),this._endDate)<0&&B.compare(A.getEnd(),this._startDate)>0){this._next=A;
this._hasNext=true;
return ;
}}this._next=null;
this._hasNext=false;
}};
SimileAjax.EventIndex._ReverseIterator=function(A,C,D,B){this._events=A;
this._startDate=C;
this._endDate=D;
this._unit=B;
this._minIndex=A.find(function(E){return B.compare(E.getStart(),C);
});
if(this._minIndex-1>=0){this._minIndex=this._events.elementAt(this._minIndex-1)._earliestOverlapIndex;
}this._maxIndex=A.find(function(E){return B.compare(E.getStart(),D);
});
this._currentIndex=this._maxIndex;
this._hasNext=false;
this._next=null;
this._findNext();
};
SimileAjax.EventIndex._ReverseIterator.prototype={hasNext:function(){return this._hasNext;
},next:function(){if(this._hasNext){var A=this._next;
this._findNext();
return A;
}else{return null;
}},_findNext:function(){var B=this._unit;
while((--this._currentIndex)>=this._minIndex){var A=this._events.elementAt(this._currentIndex);
if(B.compare(A.getStart(),this._endDate)<0&&B.compare(A.getEnd(),this._startDate)>0){this._next=A;
this._hasNext=true;
return ;
}}this._next=null;
this._hasNext=false;
}};
SimileAjax.EventIndex._AllIterator=function(A){this._events=A;
this._index=0;
};
SimileAjax.EventIndex._AllIterator.prototype={hasNext:function(){return this._index<this._events.length();
},next:function(){return this._index<this._events.length()?this._events.elementAt(this._index++):null;
}};


/* date-time.js */
SimileAjax.DateTime=new Object();
SimileAjax.DateTime.MILLISECOND=0;
SimileAjax.DateTime.SECOND=1;
SimileAjax.DateTime.MINUTE=2;
SimileAjax.DateTime.HOUR=3;
SimileAjax.DateTime.DAY=4;
SimileAjax.DateTime.WEEK=5;
SimileAjax.DateTime.MONTH=6;
SimileAjax.DateTime.YEAR=7;
SimileAjax.DateTime.DECADE=8;
SimileAjax.DateTime.CENTURY=9;
SimileAjax.DateTime.MILLENNIUM=10;
SimileAjax.DateTime.EPOCH=-1;
SimileAjax.DateTime.ERA=-2;
SimileAjax.DateTime.gregorianUnitLengths=[];
(function(){var B=SimileAjax.DateTime;
var A=B.gregorianUnitLengths;
A[B.MILLISECOND]=1;
A[B.SECOND]=1000;
A[B.MINUTE]=A[B.SECOND]*60;
A[B.HOUR]=A[B.MINUTE]*60;
A[B.DAY]=A[B.HOUR]*24;
A[B.WEEK]=A[B.DAY]*7;
A[B.MONTH]=A[B.DAY]*31;
A[B.YEAR]=A[B.DAY]*365;
A[B.DECADE]=A[B.YEAR]*10;
A[B.CENTURY]=A[B.YEAR]*100;
A[B.MILLENNIUM]=A[B.YEAR]*1000;
})();
SimileAjax.DateTime._dateRegexp=new RegExp("^(-?)([0-9]{4})("+["(-?([0-9]{2})(-?([0-9]{2}))?)","(-?([0-9]{3}))","(-?W([0-9]{2})(-?([1-7]))?)"].join("|")+")?$");
SimileAjax.DateTime._timezoneRegexp=new RegExp("Z|(([-+])([0-9]{2})(:?([0-9]{2}))?)$");
SimileAjax.DateTime._timeRegexp=new RegExp("^([0-9]{2})(:?([0-9]{2})(:?([0-9]{2})(.([0-9]+))?)?)?$");
SimileAjax.DateTime.setIso8601Date=function(G,C){var I=C.match(SimileAjax.DateTime._dateRegexp);
if(!I){throw new Error("Invalid date string: "+C);
}var B=(I[1]=="-")?-1:1;
var J=B*I[2];
var H=I[5];
var D=I[7];
var F=I[9];
var A=I[11];
var M=(I[13])?I[13]:1;
G.setUTCFullYear(J);
if(F){G.setUTCMonth(0);
G.setUTCDate(Number(F));
}else{if(A){G.setUTCMonth(0);
G.setUTCDate(1);
var L=G.getUTCDay();
var K=(L)?L:7;
var E=Number(M)+(7*Number(A));
if(K<=4){G.setUTCDate(E+1-K);
}else{G.setUTCDate(E+8-K);
}}else{if(H){G.setUTCDate(1);
G.setUTCMonth(H-1);
}if(D){G.setUTCDate(D);
}}}return G;
};
SimileAjax.DateTime.setIso8601Time=function(F,D){var G=D.match(SimileAjax.DateTime._timeRegexp);
if(!G){SimileAjax.Debug.warn("Invalid time string: "+D);
return false;
}var A=G[1];
var E=Number((G[3])?G[3]:0);
var C=(G[5])?G[5]:0;
var B=G[7]?(Number("0."+G[7])*1000):0;
F.setUTCHours(A);
F.setUTCMinutes(E);
F.setUTCSeconds(C);
F.setUTCMilliseconds(B);
return F;
};
SimileAjax.DateTime.timezoneOffset=new Date().getTimezoneOffset();
SimileAjax.DateTime.setIso8601=function(B,A){var D=null;
var E=(A.indexOf("T")==-1)?A.split(" "):A.split("T");
SimileAjax.DateTime.setIso8601Date(B,E[0]);
if(E.length==2){var C=E[1].match(SimileAjax.DateTime._timezoneRegexp);
if(C){if(C[0]=="Z"){D=0;
}else{D=(Number(C[3])*60)+Number(C[5]);
D*=((C[2]=="-")?1:-1);
}E[1]=E[1].substr(0,E[1].length-C[0].length);
}SimileAjax.DateTime.setIso8601Time(B,E[1]);
}if(D==null){D=B.getTimezoneOffset();
}B.setTime(B.getTime()+D*60000);
return B;
};
SimileAjax.DateTime.parseIso8601DateTime=function(A){try{return SimileAjax.DateTime.setIso8601(new Date(0),A);
}catch(B){return null;
}};
SimileAjax.DateTime.parseGregorianDateTime=function(F){if(F==null){return null;
}else{if(F instanceof Date){return F;
}}var B=F.toString();
if(B.length>0&&B.length<8){var C=B.indexOf(" ");
if(C>0){var A=parseInt(B.substr(0,C));
var G=B.substr(C+1);
if(G.toLowerCase()=="bc"){A=1-A;
}}else{var A=parseInt(B);
}var E=new Date(0);
E.setUTCFullYear(A);
return E;
}try{return new Date(Date.parse(B));
}catch(D){return null;
}};
SimileAjax.DateTime.roundDownToInterval=function(E,B,I,K,A){var F=I*SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.HOUR];
var J=new Date(E.getTime()+F);
var C=function(L){L.setUTCMilliseconds(0);
L.setUTCSeconds(0);
L.setUTCMinutes(0);
L.setUTCHours(0);
};
var D=function(L){C(L);
L.setUTCDate(1);
L.setUTCMonth(0);
};
switch(B){case SimileAjax.DateTime.MILLISECOND:var H=J.getUTCMilliseconds();
J.setUTCMilliseconds(H-(H%K));
break;
case SimileAjax.DateTime.SECOND:J.setUTCMilliseconds(0);
var H=J.getUTCSeconds();
J.setUTCSeconds(H-(H%K));
break;
case SimileAjax.DateTime.MINUTE:J.setUTCMilliseconds(0);
J.setUTCSeconds(0);
var H=J.getUTCMinutes();
J.setTime(J.getTime()-(H%K)*SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.MINUTE]);
break;
case SimileAjax.DateTime.HOUR:J.setUTCMilliseconds(0);
J.setUTCSeconds(0);
J.setUTCMinutes(0);
var H=J.getUTCHours();
J.setUTCHours(H-(H%K));
break;
case SimileAjax.DateTime.DAY:C(J);
break;
case SimileAjax.DateTime.WEEK:C(J);
var G=(J.getUTCDay()+7-A)%7;
J.setTime(J.getTime()-G*SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.DAY]);
break;
case SimileAjax.DateTime.MONTH:C(J);
J.setUTCDate(1);
var H=J.getUTCMonth();
J.setUTCMonth(H-(H%K));
break;
case SimileAjax.DateTime.YEAR:D(J);
var H=J.getUTCFullYear();
J.setUTCFullYear(H-(H%K));
break;
case SimileAjax.DateTime.DECADE:D(J);
J.setUTCFullYear(Math.floor(J.getUTCFullYear()/10)*10);
break;
case SimileAjax.DateTime.CENTURY:D(J);
J.setUTCFullYear(Math.floor(J.getUTCFullYear()/100)*100);
break;
case SimileAjax.DateTime.MILLENNIUM:D(J);
J.setUTCFullYear(Math.floor(J.getUTCFullYear()/1000)*1000);
break;
}E.setTime(J.getTime()-F);
};
SimileAjax.DateTime.roundUpToInterval=function(C,F,D,A,B){var E=C.getTime();
SimileAjax.DateTime.roundDownToInterval(C,F,D,A,B);
if(C.getTime()<E){C.setTime(C.getTime()+SimileAjax.DateTime.gregorianUnitLengths[F]*A);
}};
SimileAjax.DateTime.incrementByInterval=function(A,D,B){B=(typeof B=="undefined")?0:B;
var E=B*SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.HOUR];
var C=new Date(A.getTime()+E);
switch(D){case SimileAjax.DateTime.MILLISECOND:C.setTime(C.getTime()+1);
break;
case SimileAjax.DateTime.SECOND:C.setTime(C.getTime()+1000);
break;
case SimileAjax.DateTime.MINUTE:C.setTime(C.getTime()+SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.MINUTE]);
break;
case SimileAjax.DateTime.HOUR:C.setTime(C.getTime()+SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.HOUR]);
break;
case SimileAjax.DateTime.DAY:C.setUTCDate(C.getUTCDate()+1);
break;
case SimileAjax.DateTime.WEEK:C.setUTCDate(C.getUTCDate()+7);
break;
case SimileAjax.DateTime.MONTH:C.setUTCMonth(C.getUTCMonth()+1);
break;
case SimileAjax.DateTime.YEAR:C.setUTCFullYear(C.getUTCFullYear()+1);
break;
case SimileAjax.DateTime.DECADE:C.setUTCFullYear(C.getUTCFullYear()+10);
break;
case SimileAjax.DateTime.CENTURY:C.setUTCFullYear(C.getUTCFullYear()+100);
break;
case SimileAjax.DateTime.MILLENNIUM:C.setUTCFullYear(C.getUTCFullYear()+1000);
break;
}A.setTime(C.getTime()-E);
};
SimileAjax.DateTime.removeTimeZoneOffset=function(A,B){return new Date(A.getTime()+B*SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.HOUR]);
};
SimileAjax.DateTime.getTimezone=function(){var A=new Date().getTimezoneOffset();
return A/-60;
};


/* debug.js */
SimileAjax.Debug={silent:false};
SimileAjax.Debug.log=function(B){var A;
if("console" in window&&"log" in window.console){A=function(C){console.log(C);
};
}else{A=function(C){if(!SimileAjax.Debug.silent){alert(C);
}};
}SimileAjax.Debug.log=A;
A(B);
};
SimileAjax.Debug.warn=function(B){var A;
if("console" in window&&"warn" in window.console){A=function(C){console.warn(C);
};
}else{A=function(C){if(!SimileAjax.Debug.silent){alert(C);
}};
}SimileAjax.Debug.warn=A;
A(B);
};
SimileAjax.Debug.exception=function(B,D){var A,C=SimileAjax.parseURLParameters();
if(C.errors=="throw"||SimileAjax.params.errors=="throw"){A=function(F,E){throw (F);
};
}else{if("console" in window&&"error" in window.console){A=function(F,E){if(E!=null){console.error(E+" %o",F);
}else{console.error(F);
}throw (F);
};
}else{A=function(F,E){if(!SimileAjax.Debug.silent){alert("Caught exception: "+E+"\n\nDetails: "+("description" in F?F.description:F));
}throw (F);
};
}}SimileAjax.Debug.exception=A;
A(B,D);
};
SimileAjax.Debug.objectToString=function(A){return SimileAjax.Debug._objectToString(A,"");
};
SimileAjax.Debug._objectToString=function(D,C){var B=C+" ";
if(typeof D=="object"){var A="{";
for(E in D){A+=B+E+": "+SimileAjax.Debug._objectToString(D[E],B)+"\n";
}A+=C+"}";
return A;
}else{if(typeof D=="array"){var A="[";
for(var E=0;
E<D.length;
E++){A+=SimileAjax.Debug._objectToString(D[E],B)+"\n";
}A+=C+"]";
return A;
}else{return D;
}}};


/* dom.js */
SimileAjax.DOM=new Object();
SimileAjax.DOM.registerEventWithObject=function(C,A,D,B){SimileAjax.DOM.registerEvent(C,A,function(F,E,G){return D[B].call(D,F,E,G);
});
};
SimileAjax.DOM.registerEvent=function(C,B,D){var A=function(E){E=(E)?E:((event)?event:null);
if(E){var F=(E.target)?E.target:((E.srcElement)?E.srcElement:null);
if(F){F=(F.nodeType==1||F.nodeType==9)?F:F.parentNode;
}return D(C,E,F);
}return true;
};
if(SimileAjax.Platform.browser.isIE){C.attachEvent("on"+B,A);
}else{C.addEventListener(B,A,false);
}};
SimileAjax.DOM.getPageCoordinates=function(B){var E=0;
var D=0;
if(B.nodeType!=1){B=B.parentNode;
}var C=B;
while(C!=null){E+=C.offsetLeft;
D+=C.offsetTop;
C=C.offsetParent;
}var A=document.body;
while(B!=null&&B!=A){if("scrollLeft" in B){E-=B.scrollLeft;
D-=B.scrollTop;
}B=B.parentNode;
}return{left:E,top:D};
};
SimileAjax.DOM.getSize=function(B){var A=this.getStyle(B,"width");
var C=this.getStyle(B,"height");
if(A.indexOf("px")>-1){A=A.replace("px","");
}if(C.indexOf("px")>-1){C=C.replace("px","");
}return{w:A,h:C};
};
SimileAjax.DOM.getStyle=function(B,A){if(B.currentStyle){var C=B.currentStyle[A];
}else{if(window.getComputedStyle){var C=document.defaultView.getComputedStyle(B,null).getPropertyValue(A);
}else{var C="";
}}return C;
};
SimileAjax.DOM.getEventRelativeCoordinates=function(B,C){if(SimileAjax.Platform.browser.isIE){if(B.type=="mousewheel"){var A=SimileAjax.DOM.getPageCoordinates(C);
return{x:B.clientX-A.left,y:B.clientY-A.top};
}else{return{x:B.offsetX,y:B.offsetY};
}}else{var A=SimileAjax.DOM.getPageCoordinates(C);
if((B.type=="DOMMouseScroll")&&SimileAjax.Platform.browser.isFirefox&&(SimileAjax.Platform.browser.majorVersion==2)){return{x:B.screenX-A.left,y:B.screenY-A.top};
}else{return{x:B.pageX-A.left,y:B.pageY-A.top};
}}};
SimileAjax.DOM.getEventPageCoordinates=function(A){if(SimileAjax.Platform.browser.isIE){return{x:A.clientX+document.body.scrollLeft,y:A.clientY+document.body.scrollTop};
}else{return{x:A.pageX,y:A.pageY};
}};
SimileAjax.DOM.hittest=function(A,C,B){return SimileAjax.DOM._hittest(document.body,A,C,B);
};
SimileAjax.DOM._hittest=function(C,L,K,A){var M=C.childNodes;
outer:for(var G=0;
G<M.length;
G++){var H=M[G];
for(var F=0;
F<A.length;
F++){if(H==A[F]){continue outer;
}}if(H.offsetWidth==0&&H.offsetHeight==0){var B=SimileAjax.DOM._hittest(H,L,K,A);
if(B!=H){return B;
}}else{var J=0;
var E=0;
var D=H;
while(D){J+=D.offsetTop;
E+=D.offsetLeft;
D=D.offsetParent;
}if(E<=L&&J<=K&&(L-E)<H.offsetWidth&&(K-J)<H.offsetHeight){return SimileAjax.DOM._hittest(H,L,K,A);
}else{if(H.nodeType==1&&H.tagName=="TR"){var I=SimileAjax.DOM._hittest(H,L,K,A);
if(I!=H){return I;
}}}}}return C;
};
SimileAjax.DOM.cancelEvent=function(A){A.returnValue=false;
A.cancelBubble=true;
if("preventDefault" in A){A.preventDefault();
}};
SimileAjax.DOM.appendClassName=function(D,A){var C=D.className.split(" ");
for(var B=0;
B<C.length;
B++){if(C[B]==A){return ;
}}C.push(A);
D.className=C.join(" ");
};
SimileAjax.DOM.createInputElement=function(A){var B=document.createElement("div");
B.innerHTML="<input type='"+A+"' />";
return B.firstChild;
};
SimileAjax.DOM.createDOMFromTemplate=function(A){var B={};
B.elmt=SimileAjax.DOM._createDOMFromTemplate(A,B,null);
return B;
};
SimileAjax.DOM._createDOMFromTemplate=function(F,G,D){if(F==null){return null;
}else{if(typeof F!="object"){var C=document.createTextNode(F);
if(D!=null){D.appendChild(C);
}return C;
}else{var A=null;
if("tag" in F){var J=F.tag;
if(D!=null){if(J=="tr"){A=D.insertRow(D.rows.length);
}else{if(J=="td"){A=D.insertCell(D.cells.length);
}}}if(A==null){A=J=="input"?SimileAjax.DOM.createInputElement(F.type):document.createElement(J);
if(D!=null){D.appendChild(A);
}}}else{A=F.elmt;
if(D!=null){D.appendChild(A);
}}for(var B in F){var H=F[B];
if(B=="field"){G[H]=A;
}else{if(B=="className"){A.className=H;
}else{if(B=="id"){A.id=H;
}else{if(B=="title"){A.title=H;
}else{if(B=="type"&&A.tagName=="input"){}else{if(B=="style"){for(n in H){var I=H[n];
if(n=="float"){n=SimileAjax.Platform.browser.isIE?"styleFloat":"cssFloat";
}A.style[n]=I;
}}else{if(B=="children"){for(var E=0;
E<H.length;
E++){SimileAjax.DOM._createDOMFromTemplate(H[E],G,A);
}}else{if(B!="tag"&&B!="elmt"){A.setAttribute(B,H);
}}}}}}}}}return A;
}}};
SimileAjax.DOM._cachedParent=null;
SimileAjax.DOM.createElementFromString=function(A){if(SimileAjax.DOM._cachedParent==null){SimileAjax.DOM._cachedParent=document.createElement("div");
}SimileAjax.DOM._cachedParent.innerHTML=A;
return SimileAjax.DOM._cachedParent.firstChild;
};
SimileAjax.DOM.createDOMFromString=function(A,C,D){var B=typeof A=="string"?document.createElement(A):A;
B.innerHTML=C;
var E={elmt:B};
SimileAjax.DOM._processDOMChildrenConstructedFromString(E,B,D!=null?D:{});
return E;
};
SimileAjax.DOM._processDOMConstructedFromString=function(D,A,B){var E=A.id;
if(E!=null&&E.length>0){A.removeAttribute("id");
if(E in B){var C=A.parentNode;
C.insertBefore(B[E],A);
C.removeChild(A);
D[E]=B[E];
return ;
}else{D[E]=A;
}}if(A.hasChildNodes()){SimileAjax.DOM._processDOMChildrenConstructedFromString(D,A,B);
}};
SimileAjax.DOM._processDOMChildrenConstructedFromString=function(E,B,D){var C=B.firstChild;
while(C!=null){var A=C.nextSibling;
if(C.nodeType==1){SimileAjax.DOM._processDOMConstructedFromString(E,C,D);
}C=A;
}};


/* graphics.js */
SimileAjax.Graphics=new Object();
SimileAjax.Graphics.pngIsTranslucent=(!SimileAjax.Platform.browser.isIE)||(SimileAjax.Platform.browser.majorVersion>6);
if(!SimileAjax.Graphics.pngIsTranslucent){SimileAjax.includeCssFile(document,SimileAjax.urlPrefix+"styles/graphics-ie6.css");
}SimileAjax.Graphics._createTranslucentImage1=function(A,C){var B=document.createElement("img");
B.setAttribute("src",A);
if(C!=null){B.style.verticalAlign=C;
}return B;
};
SimileAjax.Graphics._createTranslucentImage2=function(A,C){var B=document.createElement("img");
B.style.width="1px";
B.style.height="1px";
B.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+A+"', sizingMethod='image')";
B.style.verticalAlign=(C!=null)?C:"middle";
return B;
};
SimileAjax.Graphics.createTranslucentImage=SimileAjax.Graphics.pngIsTranslucent?SimileAjax.Graphics._createTranslucentImage1:SimileAjax.Graphics._createTranslucentImage2;
SimileAjax.Graphics._createTranslucentImageHTML1=function(A,B){return'<img src="'+A+'"'+(B!=null?' style="vertical-align: '+B+';"':"")+" />";
};
SimileAjax.Graphics._createTranslucentImageHTML2=function(A,C){var B="width: 1px; height: 1px; filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+A+"', sizingMethod='image');"+(C!=null?" vertical-align: "+C+";":"");
return"<img src='"+A+"' style=\""+B+'" />';
};
SimileAjax.Graphics.createTranslucentImageHTML=SimileAjax.Graphics.pngIsTranslucent?SimileAjax.Graphics._createTranslucentImageHTML1:SimileAjax.Graphics._createTranslucentImageHTML2;
SimileAjax.Graphics.setOpacity=function(B,A){if(SimileAjax.Platform.browser.isIE){B.style.filter="progid:DXImageTransform.Microsoft.Alpha(Style=0,Opacity="+A+")";
}else{var C=(A/100).toString();
B.style.opacity=C;
B.style.MozOpacity=C;
}};
SimileAjax.Graphics.bubbleConfig={containerCSSClass:"simileAjax-bubble-container",innerContainerCSSClass:"simileAjax-bubble-innerContainer",contentContainerCSSClass:"simileAjax-bubble-contentContainer",borderGraphicSize:50,borderGraphicCSSClassPrefix:"simileAjax-bubble-border-",arrowGraphicTargetOffset:33,arrowGraphicLength:100,arrowGraphicWidth:49,arrowGraphicCSSClassPrefix:"simileAjax-bubble-arrow-",closeGraphicCSSClass:"simileAjax-bubble-close",extraPadding:20};
SimileAjax.Graphics.createBubbleForContentAndPoint=function(F,E,C,B,D,A){if(typeof B!="number"){B=300;
}if(typeof A!="number"){A=0;
}F.style.position="absolute";
F.style.left="-5000px";
F.style.top="0px";
F.style.width=B+"px";
document.body.appendChild(F);
window.setTimeout(function(){var H=F.scrollWidth+10;
var J=F.scrollHeight+10;
var G=0;
if(A>0&&J>A){J=A;
G=H-25;
}var I=SimileAjax.Graphics.createBubbleForPoint(E,C,H,J,D);
document.body.removeChild(F);
F.style.position="static";
F.style.left="";
F.style.top="";
if(G>0){var K=document.createElement("div");
F.style.width="";
K.style.width=G+"px";
K.appendChild(F);
I.content.appendChild(K);
}else{F.style.width=H+"px";
I.content.appendChild(F);
}},200);
};
SimileAjax.Graphics.createBubbleForPoint=function(B,A,J,N,F){J=parseInt(J,10);
N=parseInt(N,10);
var E=SimileAjax.Graphics.bubbleConfig;
var M=SimileAjax.Graphics.pngIsTranslucent?"pngTranslucent":"pngNotTranslucent";
var L=J+2*E.borderGraphicSize;
var O=N+2*E.borderGraphicSize;
var K=function(S){return S+" "+S+"-"+M;
};
var H=document.createElement("div");
H.className=K(E.containerCSSClass);
H.style.width=J+"px";
H.style.height=N+"px";
var D=document.createElement("div");
D.className=K(E.innerContainerCSSClass);
H.appendChild(D);
var I=function(){if(!Q._closed){document.body.removeChild(Q._div);
Q._doc=null;
Q._div=null;
Q._content=null;
Q._closed=true;
}};
var Q={_closed:false};
var R=SimileAjax.WindowManager.pushLayer(I,true,H);
Q._div=H;
Q.close=function(){SimileAjax.WindowManager.popLayer(R);
};
var G=function(T){var S=document.createElement("div");
S.className=K(E.borderGraphicCSSClassPrefix+T);
D.appendChild(S);
};
G("top-left");
G("top-right");
G("bottom-left");
G("bottom-right");
G("left");
G("right");
G("top");
G("bottom");
var C=document.createElement("div");
C.className=K(E.contentContainerCSSClass);
D.appendChild(C);
Q.content=C;
var P=document.createElement("div");
P.className=K(E.closeGraphicCSSClass);
D.appendChild(P);
SimileAjax.WindowManager.registerEventWithObject(P,"click",Q,"close");
(function(){var Y=SimileAjax.Graphics.getWindowDimensions();
var T=Y.w;
var U=Y.h;
var V=Math.ceil(E.arrowGraphicWidth/2);
var Z=function(b){var a=document.createElement("div");
a.className=K(E.arrowGraphicCSSClassPrefix+"point-"+b);
D.appendChild(a);
return a;
};
if(B-V-E.borderGraphicSize-E.extraPadding>0&&B+V+E.borderGraphicSize+E.extraPadding<T){var X=B-Math.round(J/2);
X=B<(T/2)?Math.max(X,E.extraPadding+E.borderGraphicSize):Math.min(X,T-E.extraPadding-E.borderGraphicSize-J);
if((F&&F=="top")||(!F&&(A-E.arrowGraphicTargetOffset-N-E.borderGraphicSize-E.extraPadding>0))){var S=Z("down");
S.style.left=(B-V-X)+"px";
H.style.left=X+"px";
H.style.top=(A-E.arrowGraphicTargetOffset-N)+"px";
return ;
}else{if((F&&F=="bottom")||(!F&&(A+E.arrowGraphicTargetOffset+N+E.borderGraphicSize+E.extraPadding<U))){var S=Z("up");
S.style.left=(B-V-X)+"px";
H.style.left=X+"px";
H.style.top=(A+E.arrowGraphicTargetOffset)+"px";
return ;
}}}var W=A-Math.round(N/2);
W=A<(U/2)?Math.max(W,E.extraPadding+E.borderGraphicSize):Math.min(W,U-E.extraPadding-E.borderGraphicSize-N);
if((F&&F=="left")||(!F&&(B-E.arrowGraphicTargetOffset-J-E.borderGraphicSize-E.extraPadding>0))){var S=Z("right");
S.style.top=(A-V-W)+"px";
H.style.top=W+"px";
H.style.left=(B-E.arrowGraphicTargetOffset-J)+"px";
}else{var S=Z("left");
S.style.top=(A-V-W)+"px";
H.style.top=W+"px";
H.style.left=(B+E.arrowGraphicTargetOffset)+"px";
}})();
document.body.appendChild(H);
return Q;
};
SimileAjax.Graphics.getWindowDimensions=function(){if(typeof window.innerHeight=="number"){return{w:window.innerWidth,h:window.innerHeight};
}else{if(document.documentElement&&document.documentElement.clientHeight){return{w:document.documentElement.clientWidth,h:document.documentElement.clientHeight};
}else{if(document.body&&document.body.clientHeight){return{w:document.body.clientWidth,h:document.body.clientHeight};
}}}};
SimileAjax.Graphics.createMessageBubble=function(H){var G=H.createElement("div");
if(SimileAjax.Graphics.pngIsTranslucent){var I=H.createElement("div");
I.style.height="33px";
I.style.background="url("+SimileAjax.urlPrefix+"images/message-top-left.png) top left no-repeat";
I.style.paddingLeft="44px";
G.appendChild(I);
var D=H.createElement("div");
D.style.height="33px";
D.style.background="url("+SimileAjax.urlPrefix+"images/message-top-right.png) top right no-repeat";
I.appendChild(D);
var F=H.createElement("div");
F.style.background="url("+SimileAjax.urlPrefix+"images/message-left.png) top left repeat-y";
F.style.paddingLeft="44px";
G.appendChild(F);
var B=H.createElement("div");
B.style.background="url("+SimileAjax.urlPrefix+"images/message-right.png) top right repeat-y";
B.style.paddingRight="44px";
F.appendChild(B);
var C=H.createElement("div");
B.appendChild(C);
var E=H.createElement("div");
E.style.height="55px";
E.style.background="url("+SimileAjax.urlPrefix+"images/message-bottom-left.png) bottom left no-repeat";
E.style.paddingLeft="44px";
G.appendChild(E);
var A=H.createElement("div");
A.style.height="55px";
A.style.background="url("+SimileAjax.urlPrefix+"images/message-bottom-right.png) bottom right no-repeat";
E.appendChild(A);
}else{G.style.border="2px solid #7777AA";
G.style.padding="20px";
G.style.background="white";
SimileAjax.Graphics.setOpacity(G,90);
var C=H.createElement("div");
G.appendChild(C);
}return{containerDiv:G,contentDiv:C};
};
SimileAjax.Graphics.createAnimation=function(B,E,D,C,A){return new SimileAjax.Graphics._Animation(B,E,D,C,A);
};
SimileAjax.Graphics._Animation=function(B,E,D,C,A){this.f=B;
this.cont=(typeof A=="function")?A:function(){};
this.from=E;
this.to=D;
this.current=E;
this.duration=C;
this.start=new Date().getTime();
this.timePassed=0;
};
SimileAjax.Graphics._Animation.prototype.run=function(){var A=this;
window.setTimeout(function(){A.step();
},50);
};
SimileAjax.Graphics._Animation.prototype.step=function(){this.timePassed+=50;
var A=this.timePassed/this.duration;
var B=-Math.cos(A*Math.PI)/2+0.5;
var D=B*(this.to-this.from)+this.from;
try{this.f(D,D-this.current);
}catch(C){}this.current=D;
if(this.timePassed<this.duration){this.run();
}else{this.f(this.to,0);
this["cont"]();
}};
SimileAjax.Graphics.createStructuredDataCopyButton=function(F,B,D,E){var G=document.createElement("div");
G.style.position="relative";
G.style.display="inline";
G.style.width=B+"px";
G.style.height=D+"px";
G.style.overflow="hidden";
G.style.margin="2px";
if(SimileAjax.Graphics.pngIsTranslucent){G.style.background="url("+F+") no-repeat";
}else{G.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+F+"', sizingMethod='image')";
}var A;
if(SimileAjax.Platform.browser.isIE){A="filter:alpha(opacity=0)";
}else{A="opacity: 0";
}G.innerHTML="<textarea rows='1' autocomplete='off' value='none' style='"+A+"' />";
var C=G.firstChild;
C.style.width=B+"px";
C.style.height=D+"px";
C.onmousedown=function(H){H=(H)?H:((event)?event:null);
if(H.button==2){C.value=E();
C.select();
}};
return G;
};
SimileAjax.Graphics.getWidthHeight=function(C){var A,B;
if(C.getBoundingClientRect==null){A=C.offsetWidth;
B=C.offsetHeight;
}else{var D=C.getBoundingClientRect();
A=Math.ceil(D.right-D.left);
B=Math.ceil(D.bottom-D.top);
}return{width:A,height:B};
};
SimileAjax.Graphics.getFontRenderingContext=function(A,B){return new SimileAjax.Graphics._FontRenderingContext(A,B);
};
SimileAjax.Graphics._FontRenderingContext=function(A,B){this._elmt=A;
this._elmt.style.visibility="hidden";
if(typeof B=="string"){this._elmt.style.width=B;
}else{if(typeof B=="number"){this._elmt.style.width=B+"px";
}}};
SimileAjax.Graphics._FontRenderingContext.prototype.dispose=function(){this._elmt=null;
};
SimileAjax.Graphics._FontRenderingContext.prototype.update=function(){this._elmt.innerHTML="A";
this._lineHeight=this._elmt.offsetHeight;
};
SimileAjax.Graphics._FontRenderingContext.prototype.computeSize=function(D,B){var C=this._elmt;
C.innerHTML=D;
C.className=B===undefined?"":B;
var A=SimileAjax.Graphics.getWidthHeight(C);
C.className="";
return A;
};
SimileAjax.Graphics._FontRenderingContext.prototype.getLineHeight=function(){return this._lineHeight;
};


/* html.js */
SimileAjax.HTML=new Object();
SimileAjax.HTML._e2uHash={};
(function(){var A=SimileAjax.HTML._e2uHash;
A["nbsp"]="\u00A0[space]";
A["iexcl"]="\u00A1";
A["cent"]="\u00A2";
A["pound"]="\u00A3";
A["curren"]="\u00A4";
A["yen"]="\u00A5";
A["brvbar"]="\u00A6";
A["sect"]="\u00A7";
A["uml"]="\u00A8";
A["copy"]="\u00A9";
A["ordf"]="\u00AA";
A["laquo"]="\u00AB";
A["not"]="\u00AC";
A["shy"]="\u00AD";
A["reg"]="\u00AE";
A["macr"]="\u00AF";
A["deg"]="\u00B0";
A["plusmn"]="\u00B1";
A["sup2"]="\u00B2";
A["sup3"]="\u00B3";
A["acute"]="\u00B4";
A["micro"]="\u00B5";
A["para"]="\u00B6";
A["middot"]="\u00B7";
A["cedil"]="\u00B8";
A["sup1"]="\u00B9";
A["ordm"]="\u00BA";
A["raquo"]="\u00BB";
A["frac14"]="\u00BC";
A["frac12"]="\u00BD";
A["frac34"]="\u00BE";
A["iquest"]="\u00BF";
A["Agrave"]="\u00C0";
A["Aacute"]="\u00C1";
A["Acirc"]="\u00C2";
A["Atilde"]="\u00C3";
A["Auml"]="\u00C4";
A["Aring"]="\u00C5";
A["AElig"]="\u00C6";
A["Ccedil"]="\u00C7";
A["Egrave"]="\u00C8";
A["Eacute"]="\u00C9";
A["Ecirc"]="\u00CA";
A["Euml"]="\u00CB";
A["Igrave"]="\u00CC";
A["Iacute"]="\u00CD";
A["Icirc"]="\u00CE";
A["Iuml"]="\u00CF";
A["ETH"]="\u00D0";
A["Ntilde"]="\u00D1";
A["Ograve"]="\u00D2";
A["Oacute"]="\u00D3";
A["Ocirc"]="\u00D4";
A["Otilde"]="\u00D5";
A["Ouml"]="\u00D6";
A["times"]="\u00D7";
A["Oslash"]="\u00D8";
A["Ugrave"]="\u00D9";
A["Uacute"]="\u00DA";
A["Ucirc"]="\u00DB";
A["Uuml"]="\u00DC";
A["Yacute"]="\u00DD";
A["THORN"]="\u00DE";
A["szlig"]="\u00DF";
A["agrave"]="\u00E0";
A["aacute"]="\u00E1";
A["acirc"]="\u00E2";
A["atilde"]="\u00E3";
A["auml"]="\u00E4";
A["aring"]="\u00E5";
A["aelig"]="\u00E6";
A["ccedil"]="\u00E7";
A["egrave"]="\u00E8";
A["eacute"]="\u00E9";
A["ecirc"]="\u00EA";
A["euml"]="\u00EB";
A["igrave"]="\u00EC";
A["iacute"]="\u00ED";
A["icirc"]="\u00EE";
A["iuml"]="\u00EF";
A["eth"]="\u00F0";
A["ntilde"]="\u00F1";
A["ograve"]="\u00F2";
A["oacute"]="\u00F3";
A["ocirc"]="\u00F4";
A["otilde"]="\u00F5";
A["ouml"]="\u00F6";
A["divide"]="\u00F7";
A["oslash"]="\u00F8";
A["ugrave"]="\u00F9";
A["uacute"]="\u00FA";
A["ucirc"]="\u00FB";
A["uuml"]="\u00FC";
A["yacute"]="\u00FD";
A["thorn"]="\u00FE";
A["yuml"]="\u00FF";
A["quot"]="\u0022";
A["amp"]="\u0026";
A["lt"]="\u003C";
A["gt"]="\u003E";
A["OElig"]="";
A["oelig"]="\u0153";
A["Scaron"]="\u0160";
A["scaron"]="\u0161";
A["Yuml"]="\u0178";
A["circ"]="\u02C6";
A["tilde"]="\u02DC";
A["ensp"]="\u2002";
A["emsp"]="\u2003";
A["thinsp"]="\u2009";
A["zwnj"]="\u200C";
A["zwj"]="\u200D";
A["lrm"]="\u200E";
A["rlm"]="\u200F";
A["ndash"]="\u2013";
A["mdash"]="\u2014";
A["lsquo"]="\u2018";
A["rsquo"]="\u2019";
A["sbquo"]="\u201A";
A["ldquo"]="\u201C";
A["rdquo"]="\u201D";
A["bdquo"]="\u201E";
A["dagger"]="\u2020";
A["Dagger"]="\u2021";
A["permil"]="\u2030";
A["lsaquo"]="\u2039";
A["rsaquo"]="\u203A";
A["euro"]="\u20AC";
A["fnof"]="\u0192";
A["Alpha"]="\u0391";
A["Beta"]="\u0392";
A["Gamma"]="\u0393";
A["Delta"]="\u0394";
A["Epsilon"]="\u0395";
A["Zeta"]="\u0396";
A["Eta"]="\u0397";
A["Theta"]="\u0398";
A["Iota"]="\u0399";
A["Kappa"]="\u039A";
A["Lambda"]="\u039B";
A["Mu"]="\u039C";
A["Nu"]="\u039D";
A["Xi"]="\u039E";
A["Omicron"]="\u039F";
A["Pi"]="\u03A0";
A["Rho"]="\u03A1";
A["Sigma"]="\u03A3";
A["Tau"]="\u03A4";
A["Upsilon"]="\u03A5";
A["Phi"]="\u03A6";
A["Chi"]="\u03A7";
A["Psi"]="\u03A8";
A["Omega"]="\u03A9";
A["alpha"]="\u03B1";
A["beta"]="\u03B2";
A["gamma"]="\u03B3";
A["delta"]="\u03B4";
A["epsilon"]="\u03B5";
A["zeta"]="\u03B6";
A["eta"]="\u03B7";
A["theta"]="\u03B8";
A["iota"]="\u03B9";
A["kappa"]="\u03BA";
A["lambda"]="\u03BB";
A["mu"]="\u03BC";
A["nu"]="\u03BD";
A["xi"]="\u03BE";
A["omicron"]="\u03BF";
A["pi"]="\u03C0";
A["rho"]="\u03C1";
A["sigmaf"]="\u03C2";
A["sigma"]="\u03C3";
A["tau"]="\u03C4";
A["upsilon"]="\u03C5";
A["phi"]="\u03C6";
A["chi"]="\u03C7";
A["psi"]="\u03C8";
A["omega"]="\u03C9";
A["thetasym"]="\u03D1";
A["upsih"]="\u03D2";
A["piv"]="\u03D6";
A["bull"]="\u2022";
A["hellip"]="\u2026";
A["prime"]="\u2032";
A["Prime"]="\u2033";
A["oline"]="\u203E";
A["frasl"]="\u2044";
A["weierp"]="\u2118";
A["image"]="\u2111";
A["real"]="\u211C";
A["trade"]="\u2122";
A["alefsym"]="\u2135";
A["larr"]="\u2190";
A["uarr"]="\u2191";
A["rarr"]="\u2192";
A["darr"]="\u2193";
A["harr"]="\u2194";
A["crarr"]="\u21B5";
A["lArr"]="\u21D0";
A["uArr"]="\u21D1";
A["rArr"]="\u21D2";
A["dArr"]="\u21D3";
A["hArr"]="\u21D4";
A["forall"]="\u2200";
A["part"]="\u2202";
A["exist"]="\u2203";
A["empty"]="\u2205";
A["nabla"]="\u2207";
A["isin"]="\u2208";
A["notin"]="\u2209";
A["ni"]="\u220B";
A["prod"]="\u220F";
A["sum"]="\u2211";
A["minus"]="\u2212";
A["lowast"]="\u2217";
A["radic"]="\u221A";
A["prop"]="\u221D";
A["infin"]="\u221E";
A["ang"]="\u2220";
A["and"]="\u2227";
A["or"]="\u2228";
A["cap"]="\u2229";
A["cup"]="\u222A";
A["int"]="\u222B";
A["there4"]="\u2234";
A["sim"]="\u223C";
A["cong"]="\u2245";
A["asymp"]="\u2248";
A["ne"]="\u2260";
A["equiv"]="\u2261";
A["le"]="\u2264";
A["ge"]="\u2265";
A["sub"]="\u2282";
A["sup"]="\u2283";
A["nsub"]="\u2284";
A["sube"]="\u2286";
A["supe"]="\u2287";
A["oplus"]="\u2295";
A["otimes"]="\u2297";
A["perp"]="\u22A5";
A["sdot"]="\u22C5";
A["lceil"]="\u2308";
A["rceil"]="\u2309";
A["lfloor"]="\u230A";
A["rfloor"]="\u230B";
A["lang"]="\u2329";
A["rang"]="\u232A";
A["loz"]="\u25CA";
A["spades"]="\u2660";
A["clubs"]="\u2663";
A["hearts"]="\u2665";
A["diams"]="\u2666";
})();
SimileAjax.HTML.deEntify=function(C){var D=SimileAjax.HTML._e2uHash;
var B=/&(\w+?);/;
while(B.test(C)){var A=C.match(B);
C=C.replace(B,D[A[1]]);
}return C;
};


/* json.js */
SimileAjax.JSON=new Object();
(function(){var m={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"};
var s={array:function(x){var a=["["],b,f,i,l=x.length,v;
for(i=0;
i<l;
i+=1){v=x[i];
f=s[typeof v];
if(f){v=f(v);
if(typeof v=="string"){if(b){a[a.length]=",";
}a[a.length]=v;
b=true;
}}}a[a.length]="]";
return a.join("");
},"boolean":function(x){return String(x);
},"null":function(x){return"null";
},number:function(x){return isFinite(x)?String(x):"null";
},object:function(x){if(x){if(x instanceof Array){return s.array(x);
}var a=["{"],b,f,i,v;
for(i in x){v=x[i];
f=s[typeof v];
if(f){v=f(v);
if(typeof v=="string"){if(b){a[a.length]=",";
}a.push(s.string(i),":",v);
b=true;
}}}a[a.length]="}";
return a.join("");
}return"null";
},string:function(x){if(/["\\\x00-\x1f]/.test(x)){x=x.replace(/([\x00-\x1f\\"])/g,function(a,b){var c=m[b];
if(c){return c;
}c=b.charCodeAt();
return"\\u00"+Math.floor(c/16).toString(16)+(c%16).toString(16);
});
}return'"'+x+'"';
}};
SimileAjax.JSON.toJSONString=function(o){if(o instanceof Object){return s.object(o);
}else{if(o instanceof Array){return s.array(o);
}else{return o.toString();
}}};
SimileAjax.JSON.parseJSON=function(){try{return !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(this.replace(/"(\\.|[^"\\])*"/g,"")))&&eval("("+this+")");
}catch(e){return false;
}};
})();


/* string.js */
String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"");
};
String.prototype.startsWith=function(A){return this.length>=A.length&&this.substr(0,A.length)==A;
};
String.prototype.endsWith=function(A){return this.length>=A.length&&this.substr(this.length-A.length)==A;
};
String.substitute=function(C,A){var D="";
var F=0;
while(F<C.length-1){var B=C.indexOf("%",F);
if(B<0||B==C.length-1){break;
}else{if(B>F&&C.charAt(B-1)=="\\"){D+=C.substring(F,B-1)+"%";
F=B+1;
}else{var E=parseInt(C.charAt(B+1));
if(isNaN(E)||E>=A.length){D+=C.substring(F,B+2);
}else{D+=C.substring(F,B)+A[E].toString();
}F=B+2;
}}}if(F<C.length){D+=C.substring(F);
}return D;
};


/* units.js */
SimileAjax.NativeDateUnit=new Object();
SimileAjax.NativeDateUnit.makeDefaultValue=function(){return new Date();
};
SimileAjax.NativeDateUnit.cloneValue=function(A){return new Date(A.getTime());
};
SimileAjax.NativeDateUnit.getParser=function(A){if(typeof A=="string"){A=A.toLowerCase();
}return(A=="iso8601"||A=="iso 8601")?SimileAjax.DateTime.parseIso8601DateTime:SimileAjax.DateTime.parseGregorianDateTime;
};
SimileAjax.NativeDateUnit.parseFromObject=function(A){return SimileAjax.DateTime.parseGregorianDateTime(A);
};
SimileAjax.NativeDateUnit.toNumber=function(A){return A.getTime();
};
SimileAjax.NativeDateUnit.fromNumber=function(A){return new Date(A);
};
SimileAjax.NativeDateUnit.compare=function(D,C){var B,A;
if(typeof D=="object"){B=D.getTime();
}else{B=Number(D);
}if(typeof C=="object"){A=C.getTime();
}else{A=Number(C);
}return B-A;
};
SimileAjax.NativeDateUnit.earlier=function(B,A){return SimileAjax.NativeDateUnit.compare(B,A)<0?B:A;
};
SimileAjax.NativeDateUnit.later=function(B,A){return SimileAjax.NativeDateUnit.compare(B,A)>0?B:A;
};
SimileAjax.NativeDateUnit.change=function(A,B){return new Date(A.getTime()+B);
};


/* window-manager.js */
SimileAjax.WindowManager={_initialized:false,_listeners:[],_draggedElement:null,_draggedElementCallback:null,_dropTargetHighlightElement:null,_lastCoords:null,_ghostCoords:null,_draggingMode:"",_dragging:false,_layers:[]};
SimileAjax.WindowManager.initialize=function(){if(SimileAjax.WindowManager._initialized){return ;
}SimileAjax.DOM.registerEvent(document.body,"mousedown",SimileAjax.WindowManager._onBodyMouseDown);
SimileAjax.DOM.registerEvent(document.body,"mousemove",SimileAjax.WindowManager._onBodyMouseMove);
SimileAjax.DOM.registerEvent(document.body,"mouseup",SimileAjax.WindowManager._onBodyMouseUp);
SimileAjax.DOM.registerEvent(document,"keydown",SimileAjax.WindowManager._onBodyKeyDown);
SimileAjax.DOM.registerEvent(document,"keyup",SimileAjax.WindowManager._onBodyKeyUp);
SimileAjax.WindowManager._layers.push({index:0});
SimileAjax.WindowManager._initialized=true;
};
SimileAjax.WindowManager.getBaseLayer=function(){SimileAjax.WindowManager.initialize();
return SimileAjax.WindowManager._layers[0];
};
SimileAjax.WindowManager.getHighestLayer=function(){SimileAjax.WindowManager.initialize();
return SimileAjax.WindowManager._layers[SimileAjax.WindowManager._layers.length-1];
};
SimileAjax.WindowManager.registerEventWithObject=function(D,A,E,B,C){SimileAjax.WindowManager.registerEvent(D,A,function(G,F,H){return E[B].call(E,G,F,H);
},C);
};
SimileAjax.WindowManager.registerEvent=function(D,B,E,C){if(C==null){C=SimileAjax.WindowManager.getHighestLayer();
}var A=function(G,F,I){if(SimileAjax.WindowManager._canProcessEventAtLayer(C)){SimileAjax.WindowManager._popToLayer(C.index);
try{E(G,F,I);
}catch(H){SimileAjax.Debug.exception(H);
}}SimileAjax.DOM.cancelEvent(F);
return false;
};
SimileAjax.DOM.registerEvent(D,B,A);
};
SimileAjax.WindowManager.pushLayer=function(C,D,B){var A={onPop:C,index:SimileAjax.WindowManager._layers.length,ephemeral:(D),elmt:B};
SimileAjax.WindowManager._layers.push(A);
return A;
};
SimileAjax.WindowManager.popLayer=function(B){for(var A=1;
A<SimileAjax.WindowManager._layers.length;
A++){if(SimileAjax.WindowManager._layers[A]==B){SimileAjax.WindowManager._popToLayer(A-1);
break;
}}};
SimileAjax.WindowManager.popAllLayers=function(){SimileAjax.WindowManager._popToLayer(0);
};
SimileAjax.WindowManager.registerForDragging=function(B,C,A){SimileAjax.WindowManager.registerEvent(B,"mousedown",function(E,D,F){SimileAjax.WindowManager._handleMouseDown(E,D,C);
},A);
};
SimileAjax.WindowManager._popToLayer=function(C){while(C+1<SimileAjax.WindowManager._layers.length){try{var A=SimileAjax.WindowManager._layers.pop();
if(A.onPop!=null){A.onPop();
}}catch(B){}}};
SimileAjax.WindowManager._canProcessEventAtLayer=function(B){if(B.index==(SimileAjax.WindowManager._layers.length-1)){return true;
}for(var A=B.index+1;
A<SimileAjax.WindowManager._layers.length;
A++){if(!SimileAjax.WindowManager._layers[A].ephemeral){return false;
}}return true;
};
SimileAjax.WindowManager.cancelPopups=function(A){var F=(A)?SimileAjax.DOM.getEventPageCoordinates(A):{x:-1,y:-1};
var E=SimileAjax.WindowManager._layers.length-1;
while(E>0&&SimileAjax.WindowManager._layers[E].ephemeral){var D=SimileAjax.WindowManager._layers[E];
if(D.elmt!=null){var C=D.elmt;
var B=SimileAjax.DOM.getPageCoordinates(C);
if(F.x>=B.left&&F.x<(B.left+C.offsetWidth)&&F.y>=B.top&&F.y<(B.top+C.offsetHeight)){break;
}}E--;
}SimileAjax.WindowManager._popToLayer(E);
};
SimileAjax.WindowManager._onBodyMouseDown=function(B,A,C){if(!("eventPhase" in A)||A.eventPhase==A.BUBBLING_PHASE){SimileAjax.WindowManager.cancelPopups(A);
}};
SimileAjax.WindowManager._handleMouseDown=function(B,A,C){SimileAjax.WindowManager._draggedElement=B;
SimileAjax.WindowManager._draggedElementCallback=C;
SimileAjax.WindowManager._lastCoords={x:A.clientX,y:A.clientY};
SimileAjax.DOM.cancelEvent(A);
return false;
};
SimileAjax.WindowManager._onBodyKeyDown=function(C,A,D){if(SimileAjax.WindowManager._dragging){if(A.keyCode==27){SimileAjax.WindowManager._cancelDragging();
}else{if((A.keyCode==17||A.keyCode==16)&&SimileAjax.WindowManager._draggingMode!="copy"){SimileAjax.WindowManager._draggingMode="copy";
var B=SimileAjax.Graphics.createTranslucentImage(SimileAjax.urlPrefix+"images/copy.png");
B.style.position="absolute";
B.style.left=(SimileAjax.WindowManager._ghostCoords.left-16)+"px";
B.style.top=(SimileAjax.WindowManager._ghostCoords.top)+"px";
document.body.appendChild(B);
SimileAjax.WindowManager._draggingModeIndicatorElmt=B;
}}}};
SimileAjax.WindowManager._onBodyKeyUp=function(B,A,C){if(SimileAjax.WindowManager._dragging){if(A.keyCode==17||A.keyCode==16){SimileAjax.WindowManager._draggingMode="";
if(SimileAjax.WindowManager._draggingModeIndicatorElmt!=null){document.body.removeChild(SimileAjax.WindowManager._draggingModeIndicatorElmt);
SimileAjax.WindowManager._draggingModeIndicatorElmt=null;
}}}};
SimileAjax.WindowManager._onBodyMouseMove=function(C,M,B){if(SimileAjax.WindowManager._draggedElement!=null){var L=SimileAjax.WindowManager._draggedElementCallback;
var G=SimileAjax.WindowManager._lastCoords;
var J=M.clientX-G.x;
var I=M.clientY-G.y;
if(!SimileAjax.WindowManager._dragging){if(Math.abs(J)>5||Math.abs(I)>5){try{if("onDragStart" in L){L.onDragStart();
}if("ghost" in L&&L.ghost){var P=SimileAjax.WindowManager._draggedElement;
SimileAjax.WindowManager._ghostCoords=SimileAjax.DOM.getPageCoordinates(P);
SimileAjax.WindowManager._ghostCoords.left+=J;
SimileAjax.WindowManager._ghostCoords.top+=I;
var K=P.cloneNode(true);
K.style.position="absolute";
K.style.left=SimileAjax.WindowManager._ghostCoords.left+"px";
K.style.top=SimileAjax.WindowManager._ghostCoords.top+"px";
K.style.zIndex=1000;
SimileAjax.Graphics.setOpacity(K,50);
document.body.appendChild(K);
L._ghostElmt=K;
}SimileAjax.WindowManager._dragging=true;
SimileAjax.WindowManager._lastCoords={x:M.clientX,y:M.clientY};
document.body.focus();
}catch(H){SimileAjax.Debug.exception("WindowManager: Error handling mouse down",H);
SimileAjax.WindowManager._cancelDragging();
}}}else{try{SimileAjax.WindowManager._lastCoords={x:M.clientX,y:M.clientY};
if("onDragBy" in L){L.onDragBy(J,I);
}if("_ghostElmt" in L){var K=L._ghostElmt;
SimileAjax.WindowManager._ghostCoords.left+=J;
SimileAjax.WindowManager._ghostCoords.top+=I;
K.style.left=SimileAjax.WindowManager._ghostCoords.left+"px";
K.style.top=SimileAjax.WindowManager._ghostCoords.top+"px";
if(SimileAjax.WindowManager._draggingModeIndicatorElmt!=null){var O=SimileAjax.WindowManager._draggingModeIndicatorElmt;
O.style.left=(SimileAjax.WindowManager._ghostCoords.left-16)+"px";
O.style.top=SimileAjax.WindowManager._ghostCoords.top+"px";
}if("droppable" in L&&L.droppable){var N=SimileAjax.DOM.getEventPageCoordinates(M);
var B=SimileAjax.DOM.hittest(N.x,N.y,[SimileAjax.WindowManager._ghostElmt,SimileAjax.WindowManager._dropTargetHighlightElement]);
B=SimileAjax.WindowManager._findDropTarget(B);
if(B!=SimileAjax.WindowManager._potentialDropTarget){if(SimileAjax.WindowManager._dropTargetHighlightElement!=null){document.body.removeChild(SimileAjax.WindowManager._dropTargetHighlightElement);
SimileAjax.WindowManager._dropTargetHighlightElement=null;
SimileAjax.WindowManager._potentialDropTarget=null;
}var A=false;
if(B!=null){if((!("canDropOn" in L)||L.canDropOn(B))&&(!("canDrop" in B)||B.canDrop(SimileAjax.WindowManager._draggedElement))){A=true;
}}if(A){var E=4;
var D=SimileAjax.DOM.getPageCoordinates(B);
var F=document.createElement("div");
F.style.border=E+"px solid yellow";
F.style.backgroundColor="yellow";
F.style.position="absolute";
F.style.left=D.left+"px";
F.style.top=D.top+"px";
F.style.width=(B.offsetWidth-E*2)+"px";
F.style.height=(B.offsetHeight-E*2)+"px";
SimileAjax.Graphics.setOpacity(F,30);
document.body.appendChild(F);
SimileAjax.WindowManager._potentialDropTarget=B;
SimileAjax.WindowManager._dropTargetHighlightElement=F;
}}}}}catch(H){SimileAjax.Debug.exception("WindowManager: Error handling mouse move",H);
SimileAjax.WindowManager._cancelDragging();
}}SimileAjax.DOM.cancelEvent(M);
return false;
}};
SimileAjax.WindowManager._onBodyMouseUp=function(B,A,E){if(SimileAjax.WindowManager._draggedElement!=null){try{if(SimileAjax.WindowManager._dragging){var C=SimileAjax.WindowManager._draggedElementCallback;
if("onDragEnd" in C){C.onDragEnd();
}if("droppable" in C&&C.droppable){var D=false;
var E=SimileAjax.WindowManager._potentialDropTarget;
if(E!=null){if((!("canDropOn" in C)||C.canDropOn(E))&&(!("canDrop" in E)||E.canDrop(SimileAjax.WindowManager._draggedElement))){if("onDropOn" in C){C.onDropOn(E);
}E.ondrop(SimileAjax.WindowManager._draggedElement,SimileAjax.WindowManager._draggingMode);
D=true;
}}if(!D){}}}}finally{SimileAjax.WindowManager._cancelDragging();
}SimileAjax.DOM.cancelEvent(A);
return false;
}};
SimileAjax.WindowManager._cancelDragging=function(){var A=SimileAjax.WindowManager._draggedElementCallback;
if("_ghostElmt" in A){var B=A._ghostElmt;
document.body.removeChild(B);
delete A._ghostElmt;
}if(SimileAjax.WindowManager._dropTargetHighlightElement!=null){document.body.removeChild(SimileAjax.WindowManager._dropTargetHighlightElement);
SimileAjax.WindowManager._dropTargetHighlightElement=null;
}if(SimileAjax.WindowManager._draggingModeIndicatorElmt!=null){document.body.removeChild(SimileAjax.WindowManager._draggingModeIndicatorElmt);
SimileAjax.WindowManager._draggingModeIndicatorElmt=null;
}SimileAjax.WindowManager._draggedElement=null;
SimileAjax.WindowManager._draggedElementCallback=null;
SimileAjax.WindowManager._potentialDropTarget=null;
SimileAjax.WindowManager._dropTargetHighlightElement=null;
SimileAjax.WindowManager._lastCoords=null;
SimileAjax.WindowManager._ghostCoords=null;
SimileAjax.WindowManager._draggingMode="";
SimileAjax.WindowManager._dragging=false;
};
SimileAjax.WindowManager._findDropTarget=function(A){while(A!=null){if("ondrop" in A&&(typeof A.ondrop)=="function"){break;
}A=A.parentNode;
}return A;
};


/* xmlhttp.js */
SimileAjax.XmlHttp=new Object();
SimileAjax.XmlHttp._onReadyStateChange=function(A,D,B){switch(A.readyState){case 4:try{if(A.status==0||A.status==200){if(B){B(A);
}}else{if(D){D(A.statusText,A.status,A);
}}}catch(C){SimileAjax.Debug.exception("XmlHttp: Error handling onReadyStateChange",C);
}break;
}};
SimileAjax.XmlHttp._createRequest=function(){if(SimileAjax.Platform.browser.isIE){var B=["Msxml2.XMLHTTP","Microsoft.XMLHTTP","Msxml2.XMLHTTP.4.0"];
for(var C=0;
C<B.length;
C++){try{var A=B[C];
var D=function(){return new ActiveXObject(A);
};
var F=D();
SimileAjax.XmlHttp._createRequest=D;
return F;
}catch(E){}}}try{var D=function(){return new XMLHttpRequest();
};
var F=D();
SimileAjax.XmlHttp._createRequest=D;
return F;
}catch(E){throw new Error("Failed to create an XMLHttpRequest object");
}};
SimileAjax.XmlHttp.get=function(B,D,C){var A=SimileAjax.XmlHttp._createRequest();
A.open("GET",B,true);
A.onreadystatechange=function(){SimileAjax.XmlHttp._onReadyStateChange(A,D,C);
};
A.send(null);
};
SimileAjax.XmlHttp.post=function(C,A,E,D){var B=SimileAjax.XmlHttp._createRequest();
B.open("POST",C,true);
B.onreadystatechange=function(){SimileAjax.XmlHttp._onReadyStateChange(B,E,D);
};
B.send(A);
};
SimileAjax.XmlHttp._forceXML=function(A){try{A.overrideMimeType("text/xml");
}catch(B){A.setrequestheader("Content-Type","text/xml");
}};
window.Timeline=window.Timeline||{DateTime:window.SimileAjax.DateTime,serverLocale:"en",clientLocale:"en",urlPrefix:"/timelineResources/"};
/* band.js */
Timeline._Band=function(B,G,C){if(B.autoWidth&&typeof G.width=="string"){G.width=G.width.indexOf("%")>-1?0:parseInt(G.width);
}this._timeline=B;
this._bandInfo=G;
this._index=C;
this._locale=("locale" in G)?G.locale:Timeline.getDefaultLocale();
this._timeZone=("timeZone" in G)?G.timeZone:0;
this._labeller=("labeller" in G)?G.labeller:(("createLabeller" in B.getUnit())?B.getUnit().createLabeller(this._locale,this._timeZone):new Timeline.GregorianDateLabeller(this._locale,this._timeZone));
this._theme=G.theme;
this._zoomIndex=("zoomIndex" in G)?G.zoomIndex:0;
this._zoomSteps=("zoomSteps" in G)?G.zoomSteps:null;
this._dragging=false;
this._changing=false;
this._originalScrollSpeed=5;
this._scrollSpeed=this._originalScrollSpeed;
this._onScrollListeners=[];
var A=this;
this._syncWithBand=null;
this._syncWithBandHandler=function(H){A._onHighlightBandScroll();
};
this._selectorListener=function(H){A._onHighlightBandScroll();
};
var E=this._timeline.getDocument().createElement("div");
E.className="timeline-band-input";
this._timeline.addDiv(E);
this._keyboardInput=document.createElement("input");
this._keyboardInput.type="text";
E.appendChild(this._keyboardInput);
SimileAjax.DOM.registerEventWithObject(this._keyboardInput,"keydown",this,"_onKeyDown");
SimileAjax.DOM.registerEventWithObject(this._keyboardInput,"keyup",this,"_onKeyUp");
this._div=this._timeline.getDocument().createElement("div");
this._div.id="timeline-band-"+C;
this._div.className="timeline-band timeline-band-"+C;
this._timeline.addDiv(this._div);
SimileAjax.DOM.registerEventWithObject(this._div,"mousedown",this,"_onMouseDown");
SimileAjax.DOM.registerEventWithObject(this._div,"mousemove",this,"_onMouseMove");
SimileAjax.DOM.registerEventWithObject(this._div,"mouseup",this,"_onMouseUp");
SimileAjax.DOM.registerEventWithObject(this._div,"mouseout",this,"_onMouseOut");
SimileAjax.DOM.registerEventWithObject(this._div,"dblclick",this,"_onDblClick");
var F=this._theme!=null?this._theme.mouseWheel:"scroll";
if(F==="zoom"||F==="scroll"||this._zoomSteps){if(SimileAjax.Platform.browser.isFirefox){SimileAjax.DOM.registerEventWithObject(this._div,"DOMMouseScroll",this,"_onMouseScroll");
}else{SimileAjax.DOM.registerEventWithObject(this._div,"mousewheel",this,"_onMouseScroll");
}}this._innerDiv=this._timeline.getDocument().createElement("div");
this._innerDiv.className="timeline-band-inner";
this._div.appendChild(this._innerDiv);
this._ether=G.ether;
G.ether.initialize(this,B);
this._etherPainter=G.etherPainter;
G.etherPainter.initialize(this,B);
this._eventSource=G.eventSource;
if(this._eventSource){this._eventListener={onAddMany:function(){A._onAddMany();
},onClear:function(){A._onClear();
}};
this._eventSource.addListener(this._eventListener);
}this._eventPainter=G.eventPainter;
this._eventTracksNeeded=0;
this._eventTrackIncrement=0;
G.eventPainter.initialize(this,B);
this._decorators=("decorators" in G)?G.decorators:[];
for(var D=0;
D<this._decorators.length;
D++){this._decorators[D].initialize(this,B);
}};
Timeline._Band.SCROLL_MULTIPLES=5;
Timeline._Band.prototype.dispose=function(){this.closeBubble();
if(this._eventSource){this._eventSource.removeListener(this._eventListener);
this._eventListener=null;
this._eventSource=null;
}this._timeline=null;
this._bandInfo=null;
this._labeller=null;
this._ether=null;
this._etherPainter=null;
this._eventPainter=null;
this._decorators=null;
this._onScrollListeners=null;
this._syncWithBandHandler=null;
this._selectorListener=null;
this._div=null;
this._innerDiv=null;
this._keyboardInput=null;
};
Timeline._Band.prototype.addOnScrollListener=function(A){this._onScrollListeners.push(A);
};
Timeline._Band.prototype.removeOnScrollListener=function(B){for(var A=0;
A<this._onScrollListeners.length;
A++){if(this._onScrollListeners[A]==B){this._onScrollListeners.splice(A,1);
break;
}}};
Timeline._Band.prototype.setSyncWithBand=function(B,A){if(this._syncWithBand){this._syncWithBand.removeOnScrollListener(this._syncWithBandHandler);
}this._syncWithBand=B;
this._syncWithBand.addOnScrollListener(this._syncWithBandHandler);
this._highlight=A;
this._positionHighlight();
};
Timeline._Band.prototype.getLocale=function(){return this._locale;
};
Timeline._Band.prototype.getTimeZone=function(){return this._timeZone;
};
Timeline._Band.prototype.getLabeller=function(){return this._labeller;
};
Timeline._Band.prototype.getIndex=function(){return this._index;
};
Timeline._Band.prototype.getEther=function(){return this._ether;
};
Timeline._Band.prototype.getEtherPainter=function(){return this._etherPainter;
};
Timeline._Band.prototype.getEventSource=function(){return this._eventSource;
};
Timeline._Band.prototype.getEventPainter=function(){return this._eventPainter;
};
Timeline._Band.prototype.getTimeline=function(){return this._timeline;
};
Timeline._Band.prototype.updateEventTrackInfo=function(A,B){this._eventTrackIncrement=B;
if(A>this._eventTracksNeeded){this._eventTracksNeeded=A;
}};
Timeline._Band.prototype.checkAutoWidth=function(){if(!this._timeline.autoWidth){return ;
}var C=this._eventPainter.getType()=="overview";
var A=C?this._theme.event.overviewTrack.autoWidthMargin:this._theme.event.track.autoWidthMargin;
var B=Math.ceil((this._eventTracksNeeded+A)*this._eventTrackIncrement);
B+=C?this._theme.event.overviewTrack.offset:this._theme.event.track.offset;
var D=this._bandInfo;
if(B!=D.width){D.width=B;
}};
Timeline._Band.prototype.layout=function(){this.paint();
};
Timeline._Band.prototype.paint=function(){this._etherPainter.paint();
this._paintDecorators();
this._paintEvents();
};
Timeline._Band.prototype.softLayout=function(){this.softPaint();
};
Timeline._Band.prototype.softPaint=function(){this._etherPainter.softPaint();
this._softPaintDecorators();
this._softPaintEvents();
};
Timeline._Band.prototype.setBandShiftAndWidth=function(A,D){var C=this._keyboardInput.parentNode;
var B=A+Math.floor(D/2);
if(this._timeline.isHorizontal()){this._div.style.top=A+"px";
this._div.style.height=D+"px";
C.style.top=B+"px";
C.style.left="-1em";
}else{this._div.style.left=A+"px";
this._div.style.width=D+"px";
C.style.left=B+"px";
C.style.top="-1em";
}};
Timeline._Band.prototype.getViewWidth=function(){if(this._timeline.isHorizontal()){return this._div.offsetHeight;
}else{return this._div.offsetWidth;
}};
Timeline._Band.prototype.setViewLength=function(A){this._viewLength=A;
this._recenterDiv();
this._onChanging();
};
Timeline._Band.prototype.getViewLength=function(){return this._viewLength;
};
Timeline._Band.prototype.getTotalViewLength=function(){return Timeline._Band.SCROLL_MULTIPLES*this._viewLength;
};
Timeline._Band.prototype.getViewOffset=function(){return this._viewOffset;
};
Timeline._Band.prototype.getMinDate=function(){return this._ether.pixelOffsetToDate(this._viewOffset);
};
Timeline._Band.prototype.getMaxDate=function(){return this._ether.pixelOffsetToDate(this._viewOffset+Timeline._Band.SCROLL_MULTIPLES*this._viewLength);
};
Timeline._Band.prototype.getMinVisibleDate=function(){return this._ether.pixelOffsetToDate(0);
};
Timeline._Band.prototype.getMinVisibleDateAfterDelta=function(A){return this._ether.pixelOffsetToDate(A);
};
Timeline._Band.prototype.getMaxVisibleDate=function(){return this._ether.pixelOffsetToDate(this._viewLength);
};
Timeline._Band.prototype.getMaxVisibleDateAfterDelta=function(A){return this._ether.pixelOffsetToDate(this._viewLength+A);
};
Timeline._Band.prototype.getCenterVisibleDate=function(){return this._ether.pixelOffsetToDate(this._viewLength/2);
};
Timeline._Band.prototype.setMinVisibleDate=function(A){if(!this._changing){this._moveEther(Math.round(-this._ether.dateToPixelOffset(A)));
}};
Timeline._Band.prototype.setMaxVisibleDate=function(A){if(!this._changing){this._moveEther(Math.round(this._viewLength-this._ether.dateToPixelOffset(A)));
}};
Timeline._Band.prototype.setCenterVisibleDate=function(A){if(!this._changing){this._moveEther(Math.round(this._viewLength/2-this._ether.dateToPixelOffset(A)));
}};
Timeline._Band.prototype.dateToPixelOffset=function(A){return this._ether.dateToPixelOffset(A)-this._viewOffset;
};
Timeline._Band.prototype.pixelOffsetToDate=function(A){return this._ether.pixelOffsetToDate(A+this._viewOffset);
};
Timeline._Band.prototype.createLayerDiv=function(C,A){var D=this._timeline.getDocument().createElement("div");
D.className="timeline-band-layer"+(typeof A=="string"?(" "+A):"");
D.style.zIndex=C;
this._innerDiv.appendChild(D);
var B=this._timeline.getDocument().createElement("div");
B.className="timeline-band-layer-inner";
if(SimileAjax.Platform.browser.isIE){B.style.cursor="move";
}else{B.style.cursor="-moz-grab";
}D.appendChild(B);
return B;
};
Timeline._Band.prototype.removeLayerDiv=function(A){this._innerDiv.removeChild(A.parentNode);
};
Timeline._Band.prototype.scrollToCenter=function(A,C){var B=this._ether.dateToPixelOffset(A);
if(B<-this._viewLength/2){this.setCenterVisibleDate(this.pixelOffsetToDate(B+this._viewLength));
}else{if(B>3*this._viewLength/2){this.setCenterVisibleDate(this.pixelOffsetToDate(B-this._viewLength));
}}this._autoScroll(Math.round(this._viewLength/2-this._ether.dateToPixelOffset(A)),C);
};
Timeline._Band.prototype.showBubbleForEvent=function(C){var A=this.getEventSource().getEvent(C);
if(A){var B=this;
this.scrollToCenter(A.getStart(),function(){B._eventPainter.showBubble(A);
});
}};
Timeline._Band.prototype.zoom=function(C,A,F,E){if(!this._zoomSteps){return ;
}A+=this._viewOffset;
var D=this._ether.pixelOffsetToDate(A);
var B=this._ether.zoom(C);
this._etherPainter.zoom(B);
this._moveEther(Math.round(-this._ether.dateToPixelOffset(D)));
this._moveEther(A);
};
Timeline._Band.prototype._onMouseDown=function(B,A,C){this.closeBubble();
this._dragging=true;
this._dragX=A.clientX;
this._dragY=A.clientY;
};
Timeline._Band.prototype._onMouseMove=function(D,A,E){if(this._dragging){var C=A.clientX-this._dragX;
var B=A.clientY-this._dragY;
this._dragX=A.clientX;
this._dragY=A.clientY;
this._moveEther(this._timeline.isHorizontal()?C:B);
this._positionHighlight();
}};
Timeline._Band.prototype._onMouseUp=function(B,A,C){this._dragging=false;
this._keyboardInput.focus();
};
Timeline._Band.prototype._onMouseOut=function(C,B,D){var A=SimileAjax.DOM.getEventRelativeCoordinates(B,C);
A.x+=this._viewOffset;
if(A.x<0||A.x>C.offsetWidth||A.y<0||A.y>C.offsetHeight){this._dragging=false;
}};
Timeline._Band.prototype._onMouseScroll=function(G,H,B){var A=new Date();
A=A.getTime();
if(!this._lastScrollTime||((A-this._lastScrollTime)>50)){this._lastScrollTime=A;
var I=0;
if(H.wheelDelta){I=H.wheelDelta/120;
}else{if(H.detail){I=-H.detail/3;
}}var F=this._theme.mouseWheel;
if(this._zoomSteps||F==="zoom"){var E=SimileAjax.DOM.getEventRelativeCoordinates(H,G);
if(I!=0){var D;
if(I>0){D=true;
}if(I<0){D=false;
}this._timeline.zoom(D,E.x,E.y,G);
}}else{if(F==="scroll"){var C=50*(I<0?-1:1);
this._moveEther(C);
}}}if(H.stopPropagation){H.stopPropagation();
}H.cancelBubble=true;
if(H.preventDefault){H.preventDefault();
}H.returnValue=false;
};
Timeline._Band.prototype._onDblClick=function(C,B,E){var A=SimileAjax.DOM.getEventRelativeCoordinates(B,C);
var D=A.x-(this._viewLength/2-this._viewOffset);
this._autoScroll(-D);
};
Timeline._Band.prototype._onKeyDown=function(B,A,C){if(!this._dragging){switch(A.keyCode){case 27:break;
case 37:case 38:this._scrollSpeed=Math.min(50,Math.abs(this._scrollSpeed*1.05));
this._moveEther(this._scrollSpeed);
break;
case 39:case 40:this._scrollSpeed=-Math.min(50,Math.abs(this._scrollSpeed*1.05));
this._moveEther(this._scrollSpeed);
break;
default:return true;
}this.closeBubble();
SimileAjax.DOM.cancelEvent(A);
return false;
}return true;
};
Timeline._Band.prototype._onKeyUp=function(B,A,C){if(!this._dragging){this._scrollSpeed=this._originalScrollSpeed;
switch(A.keyCode){case 35:this.setCenterVisibleDate(this._eventSource.getLatestDate());
break;
case 36:this.setCenterVisibleDate(this._eventSource.getEarliestDate());
break;
case 33:this._autoScroll(this._timeline.getPixelLength());
break;
case 34:this._autoScroll(-this._timeline.getPixelLength());
break;
default:return true;
}this.closeBubble();
SimileAjax.DOM.cancelEvent(A);
return false;
}return true;
};
Timeline._Band.prototype._autoScroll=function(D,C){var A=this;
var B=SimileAjax.Graphics.createAnimation(function(E,F){A._moveEther(F);
},0,D,1000,C);
B.run();
};
Timeline._Band.prototype._moveEther=function(A){this.closeBubble();
if(!this._timeline.shiftOK(this._index,A)){return ;
}this._viewOffset+=A;
this._ether.shiftPixels(-A);
if(this._timeline.isHorizontal()){this._div.style.left=this._viewOffset+"px";
}else{this._div.style.top=this._viewOffset+"px";
}if(this._viewOffset>-this._viewLength*0.5||this._viewOffset<-this._viewLength*(Timeline._Band.SCROLL_MULTIPLES-1.5)){this._recenterDiv();
}else{this.softLayout();
}this._onChanging();
};
Timeline._Band.prototype._onChanging=function(){this._changing=true;
this._fireOnScroll();
this._setSyncWithBandDate();
this._changing=false;
};
Timeline._Band.prototype.busy=function(){return(this._changing);
};
Timeline._Band.prototype._fireOnScroll=function(){for(var A=0;
A<this._onScrollListeners.length;
A++){this._onScrollListeners[A](this);
}};
Timeline._Band.prototype._setSyncWithBandDate=function(){if(this._syncWithBand){var A=this._ether.pixelOffsetToDate(this.getViewLength()/2);
this._syncWithBand.setCenterVisibleDate(A);
}};
Timeline._Band.prototype._onHighlightBandScroll=function(){if(this._syncWithBand){var A=this._syncWithBand.getCenterVisibleDate();
var B=this._ether.dateToPixelOffset(A);
this._moveEther(Math.round(this._viewLength/2-B));
if(this._highlight){this._etherPainter.setHighlight(this._syncWithBand.getMinVisibleDate(),this._syncWithBand.getMaxVisibleDate());
}}};
Timeline._Band.prototype._onAddMany=function(){this._paintEvents();
};
Timeline._Band.prototype._onClear=function(){this._paintEvents();
};
Timeline._Band.prototype._positionHighlight=function(){if(this._syncWithBand){var A=this._syncWithBand.getMinVisibleDate();
var B=this._syncWithBand.getMaxVisibleDate();
if(this._highlight){this._etherPainter.setHighlight(A,B);
}}};
Timeline._Band.prototype._recenterDiv=function(){this._viewOffset=-this._viewLength*(Timeline._Band.SCROLL_MULTIPLES-1)/2;
if(this._timeline.isHorizontal()){this._div.style.left=this._viewOffset+"px";
this._div.style.width=(Timeline._Band.SCROLL_MULTIPLES*this._viewLength)+"px";
}else{this._div.style.top=this._viewOffset+"px";
this._div.style.height=(Timeline._Band.SCROLL_MULTIPLES*this._viewLength)+"px";
}this.layout();
};
Timeline._Band.prototype._paintEvents=function(){this._eventPainter.paint();
};
Timeline._Band.prototype._softPaintEvents=function(){this._eventPainter.softPaint();
};
Timeline._Band.prototype._paintDecorators=function(){for(var A=0;
A<this._decorators.length;
A++){this._decorators[A].paint();
}};
Timeline._Band.prototype._softPaintDecorators=function(){for(var A=0;
A<this._decorators.length;
A++){this._decorators[A].softPaint();
}};
Timeline._Band.prototype.closeBubble=function(){SimileAjax.WindowManager.cancelPopups();
};


/* compact-painter.js */
Timeline.CompactEventPainter=function(A){this._params=A;
this._onSelectListeners=[];
this._filterMatcher=null;
this._highlightMatcher=null;
this._frc=null;
this._eventIdToElmt={};
};
Timeline.CompactEventPainter.prototype.initialize=function(B,A){this._band=B;
this._timeline=A;
this._backLayer=null;
this._eventLayer=null;
this._lineLayer=null;
this._highlightLayer=null;
this._eventIdToElmt=null;
};
Timeline.CompactEventPainter.prototype.addOnSelectListener=function(A){this._onSelectListeners.push(A);
};
Timeline.CompactEventPainter.prototype.removeOnSelectListener=function(B){for(var A=0;
A<this._onSelectListeners.length;
A++){if(this._onSelectListeners[A]==B){this._onSelectListeners.splice(A,1);
break;
}}};
Timeline.CompactEventPainter.prototype.getFilterMatcher=function(){return this._filterMatcher;
};
Timeline.CompactEventPainter.prototype.setFilterMatcher=function(A){this._filterMatcher=A;
};
Timeline.CompactEventPainter.prototype.getHighlightMatcher=function(){return this._highlightMatcher;
};
Timeline.CompactEventPainter.prototype.setHighlightMatcher=function(A){this._highlightMatcher=A;
};
Timeline.CompactEventPainter.prototype.paint=function(){var N=this._band.getEventSource();
if(N==null){return ;
}this._eventIdToElmt={};
this._prepareForPainting();
var O=this._params.theme;
var L=O.event;
var G={trackOffset:"trackOffset" in this._params?this._params.trackOffset:10,trackHeight:"trackHeight" in this._params?this._params.trackHeight:10,tapeHeight:O.event.tape.height,tapeBottomMargin:"tapeBottomMargin" in this._params?this._params.tapeBottomMargin:2,labelBottomMargin:"labelBottomMargin" in this._params?this._params.labelBottomMargin:5,labelRightMargin:"labelRightMargin" in this._params?this._params.labelRightMargin:5,defaultIcon:L.instant.icon,defaultIconWidth:L.instant.iconWidth,defaultIconHeight:L.instant.iconHeight,customIconWidth:"iconWidth" in this._params?this._params.iconWidth:L.instant.iconWidth,customIconHeight:"iconHeight" in this._params?this._params.iconHeight:L.instant.iconHeight,iconLabelGap:"iconLabelGap" in this._params?this._params.iconLabelGap:2,iconBottomMargin:"iconBottomMargin" in this._params?this._params.iconBottomMargin:2};
if("compositeIcon" in this._params){G.compositeIcon=this._params.compositeIcon;
G.compositeIconWidth=this._params.compositeIconWidth||G.customIconWidth;
G.compositeIconHeight=this._params.compositeIconHeight||G.customIconHeight;
}else{G.compositeIcon=G.defaultIcon;
G.compositeIconWidth=G.defaultIconWidth;
G.compositeIconHeight=G.defaultIconHeight;
}G.defaultStackIcon="icon" in this._params.stackConcurrentPreciseInstantEvents?this._params.stackConcurrentPreciseInstantEvents.icon:G.defaultIcon;
G.defaultStackIconWidth="iconWidth" in this._params.stackConcurrentPreciseInstantEvents?this._params.stackConcurrentPreciseInstantEvents.iconWidth:G.defaultIconWidth;
G.defaultStackIconHeight="iconHeight" in this._params.stackConcurrentPreciseInstantEvents?this._params.stackConcurrentPreciseInstantEvents.iconHeight:G.defaultIconHeight;
var B=this._band.getMinDate();
var D=this._band.getMaxDate();
var R=(this._filterMatcher!=null)?this._filterMatcher:function(S){return true;
};
var Q=(this._highlightMatcher!=null)?this._highlightMatcher:function(S){return -1;
};
var F=N.getEventIterator(B,D);
var H="stackConcurrentPreciseInstantEvents" in this._params&&typeof this._params.stackConcurrentPreciseInstantEvents=="object";
var P="collapseConcurrentPreciseInstantEvents" in this._params&&this._params.collapseConcurrentPreciseInstantEvents;
if(P||H){var M=[];
var A=null;
while(F.hasNext()){var E=F.next();
if(R(E)){if(!E.isInstant()||E.isImprecise()){this.paintEvent(E,G,this._params.theme,Q(E));
}else{if(A!=null&&A.getStart().getTime()==E.getStart().getTime()){M[M.length-1].push(E);
}else{M.push([E]);
A=E;
}}}}for(var J=0;
J<M.length;
J++){var K=M[J];
if(K.length==1){this.paintEvent(K[0],G,this._params.theme,Q(E));
}else{var C=-1;
for(var I=0;
C<0&&I<K.length;
I++){C=Q(K[I]);
}if(H){this.paintStackedPreciseInstantEvents(K,G,this._params.theme,C);
}else{this.paintCompositePreciseInstantEvents(K,G,this._params.theme,C);
}}}}else{while(F.hasNext()){var E=F.next();
if(R(E)){this.paintEvent(E,G,this._params.theme,Q(E));
}}}this._highlightLayer.style.display="block";
this._lineLayer.style.display="block";
this._eventLayer.style.display="block";
};
Timeline.CompactEventPainter.prototype.softPaint=function(){};
Timeline.CompactEventPainter.prototype._prepareForPainting=function(){var B=this._band;
if(this._backLayer==null){this._backLayer=this._band.createLayerDiv(0,"timeline-band-events");
this._backLayer.style.visibility="hidden";
var A=document.createElement("span");
A.className="timeline-event-label";
this._backLayer.appendChild(A);
this._frc=SimileAjax.Graphics.getFontRenderingContext(A);
}this._frc.update();
this._tracks=[];
if(this._highlightLayer!=null){B.removeLayerDiv(this._highlightLayer);
}this._highlightLayer=B.createLayerDiv(105,"timeline-band-highlights");
this._highlightLayer.style.display="none";
if(this._lineLayer!=null){B.removeLayerDiv(this._lineLayer);
}this._lineLayer=B.createLayerDiv(110,"timeline-band-lines");
this._lineLayer.style.display="none";
if(this._eventLayer!=null){B.removeLayerDiv(this._eventLayer);
}this._eventLayer=B.createLayerDiv(115,"timeline-band-events");
this._eventLayer.style.display="none";
};
Timeline.CompactEventPainter.prototype.paintEvent=function(B,C,D,A){if(B.isInstant()){this.paintInstantEvent(B,C,D,A);
}else{this.paintDurationEvent(B,C,D,A);
}};
Timeline.CompactEventPainter.prototype.paintInstantEvent=function(B,C,D,A){if(B.isImprecise()){this.paintImpreciseInstantEvent(B,C,D,A);
}else{this.paintPreciseInstantEvent(B,C,D,A);
}};
Timeline.CompactEventPainter.prototype.paintDurationEvent=function(B,C,D,A){if(B.isImprecise()){this.paintImpreciseDurationEvent(B,C,D,A);
}else{this.paintPreciseDurationEvent(B,C,D,A);
}};
Timeline.CompactEventPainter.prototype.paintPreciseInstantEvent=function(H,F,B,A){var C={tooltip:H.getProperty("tooltip")||H.getText()};
var E={url:H.getIcon()};
if(E.url==null){E.url=F.defaultIcon;
E.width=F.defaultIconWidth;
E.height=F.defaultIconHeight;
E.className="timeline-event-icon-default";
}else{E.width=H.getProperty("iconWidth")||F.customIconWidth;
E.height=H.getProperty("iconHeight")||F.customIconHeight;
}var J={text:H.getText(),color:H.getTextColor()||H.getColor(),className:H.getClassName()};
var G=this.paintTapeIconLabel(H.getStart(),C,null,E,J,F,B,A);
var I=this;
var D=function(L,K,M){return I._onClickInstantEvent(G.iconElmtData.elmt,K,H);
};
SimileAjax.DOM.registerEvent(G.iconElmtData.elmt,"mousedown",D);
SimileAjax.DOM.registerEvent(G.labelElmtData.elmt,"mousedown",D);
this._eventIdToElmt[H.getID()]=G.iconElmtData.elmt;
};
Timeline.CompactEventPainter.prototype.paintCompositePreciseInstantEvents=function(J,H,D,B){var K=J[0];
var A=[];
for(var C=0;
C<J.length;
C++){A.push(J[C].getProperty("tooltip")||J[C].getText());
}var E={tooltip:A.join("; ")};
var G={url:H.compositeIcon,width:H.compositeIconWidth,height:H.compositeIconHeight,className:"timeline-event-icon-composite"};
var M={text:String.substitute(this._params.compositeEventLabelTemplate,[J.length])};
var I=this.paintTapeIconLabel(K.getStart(),E,null,G,M,H,D,B);
var L=this;
var F=function(O,N,P){return L._onClickMultiplePreciseInstantEvent(I.iconElmtData.elmt,N,J);
};
SimileAjax.DOM.registerEvent(I.iconElmtData.elmt,"mousedown",F);
SimileAjax.DOM.registerEvent(I.labelElmtData.elmt,"mousedown",F);
for(var C=0;
C<J.length;
C++){this._eventIdToElmt[J[C].getID()]=I.iconElmtData.elmt;
}};
Timeline.CompactEventPainter.prototype.paintStackedPreciseInstantEvents=function(T,j,c,E){var S="limit" in this._params.stackConcurrentPreciseInstantEvents?this._params.stackConcurrentPreciseInstantEvents.limit:10;
var G="moreMessageTemplate" in this._params.stackConcurrentPreciseInstantEvents?this._params.stackConcurrentPreciseInstantEvents.moreMessageTemplate:"%0 More Events";
var Q=S<=T.length-2;
var B=this._band;
var L=function(i){return Math.round(B.dateToPixelOffset(i));
};
var O=function(i){var r={url:i.getIcon()};
if(r.url==null){r.url=j.defaultStackIcon;
r.width=j.defaultStackIconWidth;
r.height=j.defaultStackIconHeight;
r.className="timeline-event-icon-stack timeline-event-icon-default";
}else{r.width=i.getProperty("iconWidth")||j.customIconWidth;
r.height=i.getProperty("iconHeight")||j.customIconHeight;
r.className="timeline-event-icon-stack";
}return r;
};
var C=O(T[0]);
var V=5;
var D=0;
var g=0;
var p=0;
var U=0;
var l=[];
for(var n=0;
n<T.length&&(!Q||n<S);
n++){var b=T[n];
var a=b.getText();
var X=O(b);
var W=this._frc.computeSize(a);
var K={text:a,iconData:X,labelSize:W,iconLeft:C.width+n*V-X.width};
K.labelLeft=C.width+n*V+j.iconLabelGap;
K.top=p;
l.push(K);
D=Math.min(D,K.iconLeft);
p+=W.height;
g=Math.max(g,K.labelLeft+W.width);
U=Math.max(U,K.top+X.height);
}if(Q){var e=String.substitute(G,[T.length-S]);
var H=this._frc.computeSize(e);
var J=C.width+(S-1)*V+j.iconLabelGap;
var m=p;
p+=H.height;
g=Math.max(g,J+H.width);
}g+=j.labelRightMargin;
p+=j.labelBottomMargin;
U+=j.iconBottomMargin;
var F=L(T[0].getStart());
var Y=[];
var N=Math.ceil(Math.max(U,p)/j.trackHeight);
var M=C.width+(T.length-1)*V;
for(var n=0;
n<N;
n++){Y.push({start:D,end:M});
}var f=Math.ceil(p/j.trackHeight);
for(var n=0;
n<f;
n++){var P=Y[n];
P.end=Math.max(P.end,g);
}var k=this._fitTracks(F,Y);
var Z=k*j.trackHeight+j.trackOffset;
var q=this._timeline.getDocument().createElement("div");
q.className="timeline-event-icon-stack";
q.style.position="absolute";
q.style.overflow="visible";
q.style.left=F+"px";
q.style.top=Z+"px";
q.style.width=M+"px";
q.style.height=U+"px";
q.innerHTML="<div style='position: relative'></div>";
this._eventLayer.appendChild(q);
var I=this;
var R=function(r){try{var w=parseInt(this.getAttribute("index"));
var u=q.firstChild.childNodes;
for(var s=0;
s<u.length;
s++){var v=u[s];
if(s==w){v.style.zIndex=u.length;
}else{v.style.zIndex=u.length-s;
}}}catch(t){}};
var d=function(u){var w=l[u];
var r=T[u];
var i=r.getProperty("tooltip")||r.getText();
var v=I._paintEventLabel({tooltip:i},{text:w.text},F+w.labelLeft,Z+w.top,w.labelSize.width,w.labelSize.height,c);
v.elmt.setAttribute("index",u);
v.elmt.onmouseover=R;
var t=SimileAjax.Graphics.createTranslucentImage(w.iconData.url);
var s=I._timeline.getDocument().createElement("div");
s.className="timeline-event-icon"+("className" in w.iconData?(" "+w.iconData.className):"");
s.style.left=w.iconLeft+"px";
s.style.top=w.top+"px";
s.style.zIndex=(l.length-u);
s.appendChild(t);
s.setAttribute("index",u);
s.onmouseover=R;
q.firstChild.appendChild(s);
var x=function(z,y,AA){return I._onClickInstantEvent(v.elmt,y,r);
};
SimileAjax.DOM.registerEvent(s,"mousedown",x);
SimileAjax.DOM.registerEvent(v.elmt,"mousedown",x);
I._eventIdToElmt[r.getID()]=s;
};
for(var n=0;
n<l.length;
n++){d(n);
}if(Q){var o=T.slice(S);
var A=this._paintEventLabel({tooltip:e},{text:e},F+J,Z+m,H.width,H.height,c);
var h=function(r,i,s){return I._onClickMultiplePreciseInstantEvent(A.elmt,i,o);
};
SimileAjax.DOM.registerEvent(A.elmt,"mousedown",h);
for(var n=0;
n<o.length;
n++){this._eventIdToElmt[o[n].getID()]=A.elmt;
}}};
Timeline.CompactEventPainter.prototype.paintImpreciseInstantEvent=function(I,G,B,A){var C={tooltip:I.getProperty("tooltip")||I.getText()};
var E={start:I.getStart(),end:I.getEnd(),latestStart:I.getLatestStart(),earliestEnd:I.getEarliestEnd(),isInstant:true};
var F={url:I.getIcon()};
if(F.url==null){F=null;
}else{F.width=I.getProperty("iconWidth")||G.customIconWidth;
F.height=I.getProperty("iconHeight")||G.customIconHeight;
}var K={text:I.getText(),color:I.getTextColor()||I.getColor(),className:I.getClassName()};
var H=this.paintTapeIconLabel(I.getStart(),C,E,F,K,G,B,A);
var J=this;
var D=F!=null?function(M,L,N){return J._onClickInstantEvent(H.iconElmtData.elmt,L,I);
}:function(M,L,N){return J._onClickInstantEvent(H.labelElmtData.elmt,L,I);
};
SimileAjax.DOM.registerEvent(H.labelElmtData.elmt,"mousedown",D);
SimileAjax.DOM.registerEvent(H.impreciseTapeElmtData.elmt,"mousedown",D);
if(F!=null){SimileAjax.DOM.registerEvent(H.iconElmtData.elmt,"mousedown",D);
this._eventIdToElmt[I.getID()]=H.iconElmtData.elmt;
}else{this._eventIdToElmt[I.getID()]=H.labelElmtData.elmt;
}};
Timeline.CompactEventPainter.prototype.paintPreciseDurationEvent=function(I,G,B,A){var C={tooltip:I.getProperty("tooltip")||I.getText()};
var E={start:I.getStart(),end:I.getEnd(),isInstant:false};
var F={url:I.getIcon()};
if(F.url==null){F=null;
}else{F.width=I.getProperty("iconWidth")||G.customIconWidth;
F.height=I.getProperty("iconHeight")||G.customIconHeight;
}var K={text:I.getText(),color:I.getTextColor()||I.getColor(),className:I.getClassName()};
var H=this.paintTapeIconLabel(I.getLatestStart(),C,E,F,K,G,B,A);
var J=this;
var D=F!=null?function(M,L,N){return J._onClickInstantEvent(H.iconElmtData.elmt,L,I);
}:function(M,L,N){return J._onClickInstantEvent(H.labelElmtData.elmt,L,I);
};
SimileAjax.DOM.registerEvent(H.labelElmtData.elmt,"mousedown",D);
SimileAjax.DOM.registerEvent(H.tapeElmtData.elmt,"mousedown",D);
if(F!=null){SimileAjax.DOM.registerEvent(H.iconElmtData.elmt,"mousedown",D);
this._eventIdToElmt[I.getID()]=H.iconElmtData.elmt;
}else{this._eventIdToElmt[I.getID()]=H.labelElmtData.elmt;
}};
Timeline.CompactEventPainter.prototype.paintImpreciseDurationEvent=function(I,G,B,A){var C={tooltip:I.getProperty("tooltip")||I.getText()};
var E={start:I.getStart(),end:I.getEnd(),latestStart:I.getLatestStart(),earliestEnd:I.getEarliestEnd(),isInstant:false};
var F={url:I.getIcon()};
if(F.url==null){F=null;
}else{F.width=I.getProperty("iconWidth")||G.customIconWidth;
F.height=I.getProperty("iconHeight")||G.customIconHeight;
}var K={text:I.getText(),color:I.getTextColor()||I.getColor(),className:I.getClassName()};
var H=this.paintTapeIconLabel(I.getLatestStart(),C,E,F,K,G,B,A);
var J=this;
var D=F!=null?function(M,L,N){return J._onClickInstantEvent(H.iconElmtData.elmt,L,I);
}:function(M,L,N){return J._onClickInstantEvent(H.labelElmtData.elmt,L,I);
};
SimileAjax.DOM.registerEvent(H.labelElmtData.elmt,"mousedown",D);
SimileAjax.DOM.registerEvent(H.tapeElmtData.elmt,"mousedown",D);
if(F!=null){SimileAjax.DOM.registerEvent(H.iconElmtData.elmt,"mousedown",D);
this._eventIdToElmt[I.getID()]=H.iconElmtData.elmt;
}else{this._eventIdToElmt[I.getID()]=H.labelElmtData.elmt;
}};
Timeline.CompactEventPainter.prototype.paintTapeIconLabel=function(V,O,S,I,a,X,c,Z){var R=this._band;
var F=function(e){return Math.round(R.dateToPixelOffset(e));
};
var d=F(V);
var W=[];
var b=0;
var B=0;
var C=0;
if(S!=null){b=X.tapeHeight+X.tapeBottomMargin;
B=Math.ceil(X.tapeHeight/X.trackHeight);
var A=F(S.end)-d;
var L=F(S.start)-d;
for(var Q=0;
Q<B;
Q++){W.push({start:L,end:A});
}C=X.trackHeight-(b%X.tapeHeight);
}var N=0;
var U=0;
if(I!=null){if("iconAlign" in I&&I.iconAlign=="center"){N=-Math.floor(I.width/2);
}U=N+I.width+X.iconLabelGap;
if(B>0){W[B-1].end=Math.max(W[B-1].end,U);
}var E=I.height+X.iconBottomMargin+C;
while(E>0){W.push({start:N,end:U});
E-=X.trackHeight;
}}var P=a.text;
var H=this._frc.computeSize(P);
var M=H.height+X.labelBottomMargin+C;
var J=U+H.width+X.labelRightMargin;
if(B>0){W[B-1].end=Math.max(W[B-1].end,J);
}for(var Y=0;
M>0;
Y++){if(B+Y<W.length){var T=W[B+Y];
T.end=J;
}else{W.push({start:0,end:J});
}M-=X.trackHeight;
}var G=this._fitTracks(d,W);
var K=G*X.trackHeight+X.trackOffset;
var D={};
D.labelElmtData=this._paintEventLabel(O,a,d+U,K+b,H.width,H.height,c);
if(S!=null){if("latestStart" in S||"earliestEnd" in S){D.impreciseTapeElmtData=this._paintEventTape(O,S,X.tapeHeight,K,F(S.start),F(S.end),c.event.duration.impreciseColor,c.event.duration.impreciseOpacity,X,c);
}if(!S.isInstant&&"start" in S&&"end" in S){D.tapeElmtData=this._paintEventTape(O,S,X.tapeHeight,K,d,F("earliestEnd" in S?S.earliestEnd:S.end),S.color,100,X,c);
}}if(I!=null){D.iconElmtData=this._paintEventIcon(O,I,K+b,d+N,X,c);
}return D;
};
Timeline.CompactEventPainter.prototype._fitTracks=function(F,C){var H;
for(H=0;
H<this._tracks.length;
H++){var E=true;
for(var B=0;
B<C.length&&(H+B)<this._tracks.length;
B++){var G=this._tracks[H+B];
var A=C[B];
if(F+A.start<G){E=false;
break;
}}if(E){break;
}}for(var D=0;
D<C.length;
D++){this._tracks[H+D]=F+C[D].end;
}return H;
};
Timeline.CompactEventPainter.prototype._paintEventIcon=function(C,D,H,G,E,F){var B=SimileAjax.Graphics.createTranslucentImage(D.url);
var A=this._timeline.getDocument().createElement("div");
A.className="timeline-event-icon"+("className" in D?(" "+D.className):"");
A.style.left=G+"px";
A.style.top=H+"px";
A.appendChild(B);
if("tooltip" in C&&typeof C.tooltip=="string"){A.title=C.tooltip;
}this._eventLayer.appendChild(A);
return{left:G,top:H,width:E.iconWidth,height:E.iconHeight,elmt:A};
};
Timeline.CompactEventPainter.prototype._paintEventLabel=function(E,I,C,F,A,G,D){var H=this._timeline.getDocument();
var B=H.createElement("div");
B.className="timeline-event-label";
B.style.left=C+"px";
B.style.width=(A+1)+"px";
B.style.top=F+"px";
B.innerHTML=I.text;
if("tooltip" in E&&typeof E.tooltip=="string"){B.title=E.tooltip;
}if("color" in I&&typeof I.color=="string"){B.style.color=I.color;
}if("className" in I&&typeof I.className=="string"){B.className+=" "+I.className;
}this._eventLayer.appendChild(B);
return{left:C,top:F,width:A,height:G,elmt:B};
};
Timeline.CompactEventPainter.prototype._paintEventTape=function(G,H,K,J,D,A,E,C,I,F){var B=A-D;
var L=this._timeline.getDocument().createElement("div");
L.className="timeline-event-tape";
L.style.left=D+"px";
L.style.top=J+"px";
L.style.width=B+"px";
L.style.height=K+"px";
if("tooltip" in G&&typeof G.tooltip=="string"){L.title=G.tooltip;
}if(E!=null&&typeof H.color=="string"){L.style.backgroundColor=E;
}if("backgroundImage" in H&&typeof H.backgroundImage=="string"){L.style.backgroundImage="url("+backgroundImage+")";
L.style.backgroundRepeat=("backgroundRepeat" in H&&typeof H.backgroundRepeat=="string")?H.backgroundRepeat:"repeat";
}SimileAjax.Graphics.setOpacity(L,C);
if("className" in H&&typeof H.className=="string"){L.className+=" "+H.className;
}this._eventLayer.appendChild(L);
return{left:D,top:J,width:B,height:K,elmt:L};
};
Timeline.CompactEventPainter.prototype._createHighlightDiv=function(A,C,E){if(A>=0){var D=this._timeline.getDocument();
var G=E.event;
var B=G.highlightColors[Math.min(A,G.highlightColors.length-1)];
var F=D.createElement("div");
F.style.position="absolute";
F.style.overflow="hidden";
F.style.left=(C.left-2)+"px";
F.style.width=(C.width+4)+"px";
F.style.top=(C.top-2)+"px";
F.style.height=(C.height+4)+"px";
this._highlightLayer.appendChild(F);
}};
Timeline.CompactEventPainter.prototype._onClickMultiplePreciseInstantEvent=function(E,A,B){var F=SimileAjax.DOM.getPageCoordinates(E);
this._showBubble(F.left+Math.ceil(E.offsetWidth/2),F.top+Math.ceil(E.offsetHeight/2),B);
var D=[];
for(var C=0;
C<B.length;
C++){D.push(B[C].getID());
}this._fireOnSelect(D);
A.cancelBubble=true;
SimileAjax.DOM.cancelEvent(A);
return false;
};
Timeline.CompactEventPainter.prototype._onClickInstantEvent=function(C,A,B){var D=SimileAjax.DOM.getPageCoordinates(C);
this._showBubble(D.left+Math.ceil(C.offsetWidth/2),D.top+Math.ceil(C.offsetHeight/2),[B]);
this._fireOnSelect([B.getID()]);
A.cancelBubble=true;
SimileAjax.DOM.cancelEvent(A);
return false;
};
Timeline.CompactEventPainter.prototype._onClickDurationEvent=function(F,B,C){if("pageX" in B){var A=B.pageX;
var E=B.pageY;
}else{var D=SimileAjax.DOM.getPageCoordinates(F);
var A=B.offsetX+D.left;
var E=B.offsetY+D.top;
}this._showBubble(A,E,[C]);
this._fireOnSelect([C.getID()]);
B.cancelBubble=true;
SimileAjax.DOM.cancelEvent(B);
return false;
};
Timeline.CompactEventPainter.prototype.showBubble=function(A){var B=this._eventIdToElmt[A.getID()];
if(B){var C=SimileAjax.DOM.getPageCoordinates(B);
this._showBubble(C.left+B.offsetWidth/2,C.top+B.offsetHeight/2,[A]);
}};
Timeline.CompactEventPainter.prototype._showBubble=function(A,F,B){var E=document.createElement("div");
B=("fillInfoBubble" in B)?[B]:B;
for(var D=0;
D<B.length;
D++){var C=document.createElement("div");
E.appendChild(C);
B[D].fillInfoBubble(C,this._params.theme,this._band.getLabeller());
}SimileAjax.WindowManager.cancelPopups();
SimileAjax.Graphics.createBubbleForContentAndPoint(E,A,F,this._params.theme.event.bubble.width);
};
Timeline.CompactEventPainter.prototype._fireOnSelect=function(B){for(var A=0;
A<this._onSelectListeners.length;
A++){this._onSelectListeners[A](B);
}};


/* decorators.js */
Timeline.SpanHighlightDecorator=function(A){this._unit=A.unit!=null?A.unit:SimileAjax.NativeDateUnit;
this._startDate=(typeof A.startDate=="string")?this._unit.parseFromObject(A.startDate):A.startDate;
this._endDate=(typeof A.endDate=="string")?this._unit.parseFromObject(A.endDate):A.endDate;
this._startLabel=A.startLabel!=null?A.startLabel:"";
this._endLabel=A.endLabel!=null?A.endLabel:"";
this._color=A.color;
this._cssClass=A.cssClass!=null?A.cssClass:null;
this._opacity=A.opacity!=null?A.opacity:100;
this._zIndex=(A.inFront!=null&&A.inFront)?113:10;
};
Timeline.SpanHighlightDecorator.prototype.initialize=function(B,A){this._band=B;
this._timeline=A;
this._layerDiv=null;
};
Timeline.SpanHighlightDecorator.prototype.paint=function(){if(this._layerDiv!=null){this._band.removeLayerDiv(this._layerDiv);
}this._layerDiv=this._band.createLayerDiv(this._zIndex);
this._layerDiv.setAttribute("name","span-highlight-decorator");
this._layerDiv.style.display="none";
var E=this._band.getMinDate();
var A=this._band.getMaxDate();
if(this._unit.compare(this._startDate,A)<0&&this._unit.compare(this._endDate,E)>0){E=this._unit.later(E,this._startDate);
A=this._unit.earlier(A,this._endDate);
var F=this._band.dateToPixelOffset(E);
var I=this._band.dateToPixelOffset(A);
var H=this._timeline.getDocument();
var K=function(){var L=H.createElement("table");
L.insertRow(0).insertCell(0);
return L;
};
var B=H.createElement("div");
B.className="timeline-highlight-decorator";
if(this._cssClass){B.className+=" "+this._cssClass;
}if(this._color!=null){B.style.backgroundColor=this._color;
}if(this._opacity<100){SimileAjax.Graphics.setOpacity(B,this._opacity);
}this._layerDiv.appendChild(B);
var J=K();
J.className="timeline-highlight-label timeline-highlight-label-start";
var C=J.rows[0].cells[0];
C.innerHTML=this._startLabel;
if(this._cssClass){C.className="label_"+this._cssClass;
}this._layerDiv.appendChild(J);
var G=K();
G.className="timeline-highlight-label timeline-highlight-label-end";
var D=G.rows[0].cells[0];
D.innerHTML=this._endLabel;
if(this._cssClass){D.className="label_"+this._cssClass;
}this._layerDiv.appendChild(G);
if(this._timeline.isHorizontal()){B.style.left=F+"px";
B.style.width=(I-F)+"px";
J.style.right=(this._band.getTotalViewLength()-F)+"px";
J.style.width=(this._startLabel.length)+"em";
G.style.left=I+"px";
G.style.width=(this._endLabel.length)+"em";
}else{B.style.top=F+"px";
B.style.height=(I-F)+"px";
J.style.bottom=F+"px";
J.style.height="1.5px";
G.style.top=I+"px";
G.style.height="1.5px";
}}this._layerDiv.style.display="block";
};
Timeline.SpanHighlightDecorator.prototype.softPaint=function(){};
Timeline.PointHighlightDecorator=function(A){this._unit=A.unit!=null?A.unit:SimileAjax.NativeDateUnit;
this._date=(typeof A.date=="string")?this._unit.parseFromObject(A.date):A.date;
this._width=A.width!=null?A.width:10;
this._color=A.color;
this._cssClass=A.cssClass!=null?A.cssClass:"";
this._opacity=A.opacity!=null?A.opacity:100;
};
Timeline.PointHighlightDecorator.prototype.initialize=function(B,A){this._band=B;
this._timeline=A;
this._layerDiv=null;
};
Timeline.PointHighlightDecorator.prototype.paint=function(){if(this._layerDiv!=null){this._band.removeLayerDiv(this._layerDiv);
}this._layerDiv=this._band.createLayerDiv(10);
this._layerDiv.setAttribute("name","span-highlight-decorator");
this._layerDiv.style.display="none";
var C=this._band.getMinDate();
var E=this._band.getMaxDate();
if(this._unit.compare(this._date,E)<0&&this._unit.compare(this._date,C)>0){var A=this._band.dateToPixelOffset(this._date);
var B=A-Math.round(this._width/2);
var D=this._timeline.getDocument();
var F=D.createElement("div");
F.className="timeline-highlight-point-decorator";
F.className+=" "+this._cssClass;
if(this._color!=null){F.style.backgroundColor=this._color;
}if(this._opacity<100){SimileAjax.Graphics.setOpacity(F,this._opacity);
}this._layerDiv.appendChild(F);
if(this._timeline.isHorizontal()){F.style.left=B+"px";
F.style.width=this._width;
}else{F.style.top=B+"px";
F.style.height=this._width;
}}this._layerDiv.style.display="block";
};
Timeline.PointHighlightDecorator.prototype.softPaint=function(){};


/* detailed-painter.js */
Timeline.DetailedEventPainter=function(A){this._params=A;
this._onSelectListeners=[];
this._filterMatcher=null;
this._highlightMatcher=null;
this._frc=null;
this._eventIdToElmt={};
};
Timeline.DetailedEventPainter.prototype.initialize=function(B,A){this._band=B;
this._timeline=A;
this._backLayer=null;
this._eventLayer=null;
this._lineLayer=null;
this._highlightLayer=null;
this._eventIdToElmt=null;
};
Timeline.DetailedEventPainter.prototype.getType=function(){return"detailed";
};
Timeline.DetailedEventPainter.prototype.addOnSelectListener=function(A){this._onSelectListeners.push(A);
};
Timeline.DetailedEventPainter.prototype.removeOnSelectListener=function(B){for(var A=0;
A<this._onSelectListeners.length;
A++){if(this._onSelectListeners[A]==B){this._onSelectListeners.splice(A,1);
break;
}}};
Timeline.DetailedEventPainter.prototype.getFilterMatcher=function(){return this._filterMatcher;
};
Timeline.DetailedEventPainter.prototype.setFilterMatcher=function(A){this._filterMatcher=A;
};
Timeline.DetailedEventPainter.prototype.getHighlightMatcher=function(){return this._highlightMatcher;
};
Timeline.DetailedEventPainter.prototype.setHighlightMatcher=function(A){this._highlightMatcher=A;
};
Timeline.DetailedEventPainter.prototype.paint=function(){var C=this._band.getEventSource();
if(C==null){return ;
}this._eventIdToElmt={};
this._prepareForPainting();
var I=this._params.theme.event;
var G=Math.max(I.track.height,this._frc.getLineHeight());
var F={trackOffset:Math.round(this._band.getViewWidth()/2-G/2),trackHeight:G,trackGap:I.track.gap,trackIncrement:G+I.track.gap,icon:I.instant.icon,iconWidth:I.instant.iconWidth,iconHeight:I.instant.iconHeight,labelWidth:I.label.width};
var D=this._band.getMinDate();
var B=this._band.getMaxDate();
var J=(this._filterMatcher!=null)?this._filterMatcher:function(K){return true;
};
var A=(this._highlightMatcher!=null)?this._highlightMatcher:function(K){return -1;
};
var E=C.getEventReverseIterator(D,B);
while(E.hasNext()){var H=E.next();
if(J(H)){this.paintEvent(H,F,this._params.theme,A(H));
}}this._highlightLayer.style.display="block";
this._lineLayer.style.display="block";
this._eventLayer.style.display="block";
this._band.updateEventTrackInfo(this._lowerTracks.length+this._upperTracks.length,F.trackIncrement);
};
Timeline.DetailedEventPainter.prototype.softPaint=function(){};
Timeline.DetailedEventPainter.prototype._prepareForPainting=function(){var B=this._band;
if(this._backLayer==null){this._backLayer=this._band.createLayerDiv(0,"timeline-band-events");
this._backLayer.style.visibility="hidden";
var A=document.createElement("span");
A.className="timeline-event-label";
this._backLayer.appendChild(A);
this._frc=SimileAjax.Graphics.getFontRenderingContext(A);
}this._frc.update();
this._lowerTracks=[];
this._upperTracks=[];
if(this._highlightLayer!=null){B.removeLayerDiv(this._highlightLayer);
}this._highlightLayer=B.createLayerDiv(105,"timeline-band-highlights");
this._highlightLayer.style.display="none";
if(this._lineLayer!=null){B.removeLayerDiv(this._lineLayer);
}this._lineLayer=B.createLayerDiv(110,"timeline-band-lines");
this._lineLayer.style.display="none";
if(this._eventLayer!=null){B.removeLayerDiv(this._eventLayer);
}this._eventLayer=B.createLayerDiv(110,"timeline-band-events");
this._eventLayer.style.display="none";
};
Timeline.DetailedEventPainter.prototype.paintEvent=function(B,C,D,A){if(B.isInstant()){this.paintInstantEvent(B,C,D,A);
}else{this.paintDurationEvent(B,C,D,A);
}};
Timeline.DetailedEventPainter.prototype.paintInstantEvent=function(B,C,D,A){if(B.isImprecise()){this.paintImpreciseInstantEvent(B,C,D,A);
}else{this.paintPreciseInstantEvent(B,C,D,A);
}};
Timeline.DetailedEventPainter.prototype.paintDurationEvent=function(B,C,D,A){if(B.isImprecise()){this.paintImpreciseDurationEvent(B,C,D,A);
}else{this.paintPreciseDurationEvent(B,C,D,A);
}};
Timeline.DetailedEventPainter.prototype.paintPreciseInstantEvent=function(L,P,S,Q){var T=this._timeline.getDocument();
var J=L.getText();
var G=L.getStart();
var H=Math.round(this._band.dateToPixelOffset(G));
var A=Math.round(H+P.iconWidth/2);
var C=Math.round(H-P.iconWidth/2);
var E=this._frc.computeSize(J);
var F=this._findFreeTrackForSolid(A,H);
var B=this._paintEventIcon(L,F,C,P,S);
var K=A+S.event.label.offsetFromLine;
var O=F;
var D=this._getTrackData(F);
if(Math.min(D.solid,D.text)>=K+E.width){D.solid=C;
D.text=K;
}else{D.solid=C;
K=H+S.event.label.offsetFromLine;
O=this._findFreeTrackForText(F,K+E.width,function(U){U.line=H-2;
});
this._getTrackData(O).text=C;
this._paintEventLine(L,H,F,O,P,S);
}var N=Math.round(P.trackOffset+O*P.trackIncrement+P.trackHeight/2-E.height/2);
var R=this._paintEventLabel(L,J,K,N,E.width,E.height,S);
var M=this;
var I=function(V,U,W){return M._onClickInstantEvent(B.elmt,U,L);
};
SimileAjax.DOM.registerEvent(B.elmt,"mousedown",I);
SimileAjax.DOM.registerEvent(R.elmt,"mousedown",I);
this._createHighlightDiv(Q,B,S);
this._eventIdToElmt[L.getID()]=B.elmt;
};
Timeline.DetailedEventPainter.prototype.paintImpreciseInstantEvent=function(O,S,W,T){var X=this._timeline.getDocument();
var M=O.getText();
var I=O.getStart();
var U=O.getEnd();
var K=Math.round(this._band.dateToPixelOffset(I));
var B=Math.round(this._band.dateToPixelOffset(U));
var A=Math.round(K+S.iconWidth/2);
var D=Math.round(K-S.iconWidth/2);
var G=this._frc.computeSize(M);
var H=this._findFreeTrackForSolid(B,K);
var E=this._paintEventTape(O,H,K,B,W.event.instant.impreciseColor,W.event.instant.impreciseOpacity,S,W);
var C=this._paintEventIcon(O,H,D,S,W);
var F=this._getTrackData(H);
F.solid=D;
var N=A+W.event.label.offsetFromLine;
var J=N+G.width;
var R;
if(J<B){R=H;
}else{N=K+W.event.label.offsetFromLine;
J=N+G.width;
R=this._findFreeTrackForText(H,J,function(Y){Y.line=K-2;
});
this._getTrackData(R).text=D;
this._paintEventLine(O,K,H,R,S,W);
}var Q=Math.round(S.trackOffset+R*S.trackIncrement+S.trackHeight/2-G.height/2);
var V=this._paintEventLabel(O,M,N,Q,G.width,G.height,W);
var P=this;
var L=function(Z,Y,a){return P._onClickInstantEvent(C.elmt,Y,O);
};
SimileAjax.DOM.registerEvent(C.elmt,"mousedown",L);
SimileAjax.DOM.registerEvent(E.elmt,"mousedown",L);
SimileAjax.DOM.registerEvent(V.elmt,"mousedown",L);
this._createHighlightDiv(T,C,W);
this._eventIdToElmt[O.getID()]=C.elmt;
};
Timeline.DetailedEventPainter.prototype.paintPreciseDurationEvent=function(K,O,T,Q){var U=this._timeline.getDocument();
var I=K.getText();
var E=K.getStart();
var R=K.getEnd();
var F=Math.round(this._band.dateToPixelOffset(E));
var A=Math.round(this._band.dateToPixelOffset(R));
var C=this._frc.computeSize(I);
var D=this._findFreeTrackForSolid(A);
var P=K.getColor();
P=P!=null?P:T.event.duration.color;
var B=this._paintEventTape(K,D,F,A,P,100,O,T);
var H=this._getTrackData(D);
H.solid=F;
var J=F+T.event.label.offsetFromLine;
var N=this._findFreeTrackForText(D,J+C.width,function(V){V.line=F-2;
});
this._getTrackData(N).text=F-2;
this._paintEventLine(K,F,D,N,O,T);
var M=Math.round(O.trackOffset+N*O.trackIncrement+O.trackHeight/2-C.height/2);
var S=this._paintEventLabel(K,I,J,M,C.width,C.height,T);
var L=this;
var G=function(W,V,X){return L._onClickDurationEvent(B.elmt,V,K);
};
SimileAjax.DOM.registerEvent(B.elmt,"mousedown",G);
SimileAjax.DOM.registerEvent(S.elmt,"mousedown",G);
this._createHighlightDiv(Q,B,T);
this._eventIdToElmt[K.getID()]=B.elmt;
};
Timeline.DetailedEventPainter.prototype.paintImpreciseDurationEvent=function(M,T,Y,V){var Z=this._timeline.getDocument();
var K=M.getText();
var G=M.getStart();
var S=M.getLatestStart();
var W=M.getEnd();
var O=M.getEarliestEnd();
var H=Math.round(this._band.dateToPixelOffset(G));
var E=Math.round(this._band.dateToPixelOffset(S));
var A=Math.round(this._band.dateToPixelOffset(W));
var F=Math.round(this._band.dateToPixelOffset(O));
var C=this._frc.computeSize(K);
var D=this._findFreeTrackForSolid(A);
var U=M.getColor();
U=U!=null?U:Y.event.duration.color;
var R=this._paintEventTape(M,D,H,A,Y.event.duration.impreciseColor,Y.event.duration.impreciseOpacity,T,Y);
var B=this._paintEventTape(M,D,E,F,U,100,T,Y);
var J=this._getTrackData(D);
J.solid=H;
var L=E+Y.event.label.offsetFromLine;
var Q=this._findFreeTrackForText(D,L+C.width,function(a){a.line=E-2;
});
this._getTrackData(Q).text=E-2;
this._paintEventLine(M,E,D,Q,T,Y);
var P=Math.round(T.trackOffset+Q*T.trackIncrement+T.trackHeight/2-C.height/2);
var X=this._paintEventLabel(M,K,L,P,C.width,C.height,Y);
var N=this;
var I=function(b,a,c){return N._onClickDurationEvent(B.elmt,a,M);
};
SimileAjax.DOM.registerEvent(B.elmt,"mousedown",I);
SimileAjax.DOM.registerEvent(X.elmt,"mousedown",I);
this._createHighlightDiv(V,B,Y);
this._eventIdToElmt[M.getID()]=B.elmt;
};
Timeline.DetailedEventPainter.prototype._findFreeTrackForSolid=function(D,A){for(var C=0;
true;
C++){if(C<this._lowerTracks.length){var B=this._lowerTracks[C];
if(Math.min(B.solid,B.text)>D&&(!(A)||B.line>A)){return C;
}}else{this._lowerTracks.push({solid:Number.POSITIVE_INFINITY,text:Number.POSITIVE_INFINITY,line:Number.POSITIVE_INFINITY});
return C;
}if(C<this._upperTracks.length){var B=this._upperTracks[C];
if(Math.min(B.solid,B.text)>D&&(!(A)||B.line>A)){return -1-C;
}}else{this._upperTracks.push({solid:Number.POSITIVE_INFINITY,text:Number.POSITIVE_INFINITY,line:Number.POSITIVE_INFINITY});
return -1-C;
}}};
Timeline.DetailedEventPainter.prototype._findFreeTrackForText=function(C,A,I){var B;
var E;
var F;
var H;
if(C<0){B=true;
F=-C;
E=this._findFreeUpperTrackForText(F,A);
H=-1-E;
}else{if(C>0){B=false;
F=C+1;
E=this._findFreeLowerTrackForText(F,A);
H=E;
}else{var G=this._findFreeUpperTrackForText(0,A);
var J=this._findFreeLowerTrackForText(1,A);
if(J-1<=G){B=false;
F=1;
E=J;
H=E;
}else{B=true;
F=0;
E=G;
H=-1-E;
}}}if(B){if(E==this._upperTracks.length){this._upperTracks.push({solid:Number.POSITIVE_INFINITY,text:Number.POSITIVE_INFINITY,line:Number.POSITIVE_INFINITY});
}for(var D=F;
D<E;
D++){I(this._upperTracks[D]);
}}else{if(E==this._lowerTracks.length){this._lowerTracks.push({solid:Number.POSITIVE_INFINITY,text:Number.POSITIVE_INFINITY,line:Number.POSITIVE_INFINITY});
}for(var D=F;
D<E;
D++){I(this._lowerTracks[D]);
}}return H;
};
Timeline.DetailedEventPainter.prototype._findFreeLowerTrackForText=function(A,C){for(;
A<this._lowerTracks.length;
A++){var B=this._lowerTracks[A];
if(Math.min(B.solid,B.text)>=C){break;
}}return A;
};
Timeline.DetailedEventPainter.prototype._findFreeUpperTrackForText=function(A,C){for(;
A<this._upperTracks.length;
A++){var B=this._upperTracks[A];
if(Math.min(B.solid,B.text)>=C){break;
}}return A;
};
Timeline.DetailedEventPainter.prototype._getTrackData=function(A){return(A<0)?this._upperTracks[-A-1]:this._lowerTracks[A];
};
Timeline.DetailedEventPainter.prototype._paintEventLine=function(J,E,D,A,G,F){var H=Math.round(G.trackOffset+D*G.trackIncrement+G.trackHeight/2);
var I=Math.round(Math.abs(A-D)*G.trackIncrement);
var C="1px solid "+F.event.label.lineColor;
var B=this._timeline.getDocument().createElement("div");
B.style.position="absolute";
B.style.left=E+"px";
B.style.width=F.event.label.offsetFromLine+"px";
B.style.height=I+"px";
if(D>A){B.style.top=(H-I)+"px";
B.style.borderTop=C;
}else{B.style.top=H+"px";
B.style.borderBottom=C;
}B.style.borderLeft=C;
this._lineLayer.appendChild(B);
};
Timeline.DetailedEventPainter.prototype._paintEventIcon=function(J,B,C,F,E){var H=J.getIcon();
H=H!=null?H:F.icon;
var G=F.trackOffset+B*F.trackIncrement+F.trackHeight/2;
var I=Math.round(G-F.iconHeight/2);
var D=SimileAjax.Graphics.createTranslucentImage(H);
var A=this._timeline.getDocument().createElement("div");
A.style.position="absolute";
A.style.left=C+"px";
A.style.top=I+"px";
A.appendChild(D);
A.style.cursor="pointer";
if(J._title!=null){A.title=J._title;
}this._eventLayer.appendChild(A);
return{left:C,top:I,width:F.iconWidth,height:F.iconHeight,elmt:A};
};
Timeline.DetailedEventPainter.prototype._paintEventLabel=function(I,J,C,F,A,G,E){var H=this._timeline.getDocument();
var K=H.createElement("div");
K.style.position="absolute";
K.style.left=C+"px";
K.style.width=A+"px";
K.style.top=F+"px";
K.style.height=G+"px";
K.style.backgroundColor=E.event.label.backgroundColor;
SimileAjax.Graphics.setOpacity(K,E.event.label.backgroundOpacity);
this._eventLayer.appendChild(K);
var B=H.createElement("div");
B.style.position="absolute";
B.style.left=C+"px";
B.style.width=A+"px";
B.style.top=F+"px";
B.innerHTML=J;
B.style.cursor="pointer";
if(I._title!=null){B.title=I._title;
}var D=I.getTextColor();
if(D==null){D=I.getColor();
}if(D!=null){B.style.color=D;
}this._eventLayer.appendChild(B);
return{left:C,top:F,width:A,height:G,elmt:B};
};
Timeline.DetailedEventPainter.prototype._paintEventTape=function(L,B,D,A,G,C,I,H){var F=A-D;
var E=H.event.tape.height;
var K=I.trackOffset+B*I.trackIncrement+I.trackHeight/2;
var J=Math.round(K-E/2);
var M=this._timeline.getDocument().createElement("div");
M.style.position="absolute";
M.style.left=D+"px";
M.style.width=F+"px";
M.style.top=J+"px";
M.style.height=E+"px";
M.style.backgroundColor=G;
M.style.overflow="hidden";
M.style.cursor="pointer";
if(L._title!=null){M.title=L._title;
}SimileAjax.Graphics.setOpacity(M,C);
this._eventLayer.appendChild(M);
return{left:D,top:J,width:F,height:E,elmt:M};
};
Timeline.DetailedEventPainter.prototype._createHighlightDiv=function(A,C,E){if(A>=0){var D=this._timeline.getDocument();
var G=E.event;
var B=G.highlightColors[Math.min(A,G.highlightColors.length-1)];
var F=D.createElement("div");
F.style.position="absolute";
F.style.overflow="hidden";
F.style.left=(C.left-2)+"px";
F.style.width=(C.width+4)+"px";
F.style.top=(C.top-2)+"px";
F.style.height=(C.height+4)+"px";
F.style.background=B;
this._highlightLayer.appendChild(F);
}};
Timeline.DetailedEventPainter.prototype._onClickInstantEvent=function(C,A,B){var D=SimileAjax.DOM.getPageCoordinates(C);
this._showBubble(D.left+Math.ceil(C.offsetWidth/2),D.top+Math.ceil(C.offsetHeight/2),B);
this._fireOnSelect(B.getID());
A.cancelBubble=true;
SimileAjax.DOM.cancelEvent(A);
return false;
};
Timeline.DetailedEventPainter.prototype._onClickDurationEvent=function(F,B,C){if("pageX" in B){var A=B.pageX;
var E=B.pageY;
}else{var D=SimileAjax.DOM.getPageCoordinates(F);
var A=B.offsetX+D.left;
var E=B.offsetY+D.top;
}this._showBubble(A,E,C);
this._fireOnSelect(C.getID());
B.cancelBubble=true;
SimileAjax.DOM.cancelEvent(B);
return false;
};
Timeline.DetailedEventPainter.prototype.showBubble=function(A){var B=this._eventIdToElmt[A.getID()];
if(B){var C=SimileAjax.DOM.getPageCoordinates(B);
this._showBubble(C.left+B.offsetWidth/2,C.top+B.offsetHeight/2,A);
}};
Timeline.DetailedEventPainter.prototype._showBubble=function(B,E,C){var D=document.createElement("div");
var A=this._params.theme.event.bubble;
C.fillInfoBubble(D,this._params.theme,this._band.getLabeller());
SimileAjax.WindowManager.cancelPopups();
SimileAjax.Graphics.createBubbleForContentAndPoint(D,B,E,A.width,null,A.maxHeight);
};
Timeline.DetailedEventPainter.prototype._fireOnSelect=function(A){for(var B=0;
B<this._onSelectListeners.length;
B++){this._onSelectListeners[B](A);
}};


/* ether-painters.js */
Timeline.GregorianEtherPainter=function(A){this._params=A;
this._theme=A.theme;
this._unit=A.unit;
this._multiple=("multiple" in A)?A.multiple:1;
};
Timeline.GregorianEtherPainter.prototype.initialize=function(C,B){this._band=C;
this._timeline=B;
this._backgroundLayer=C.createLayerDiv(0);
this._backgroundLayer.setAttribute("name","ether-background");
this._backgroundLayer.className="timeline-ether-bg";
this._markerLayer=null;
this._lineLayer=null;
var D=("align" in this._params&&this._params.align!=undefined)?this._params.align:this._theme.ether.interval.marker[B.isHorizontal()?"hAlign":"vAlign"];
var A=("showLine" in this._params)?this._params.showLine:this._theme.ether.interval.line.show;
this._intervalMarkerLayout=new Timeline.EtherIntervalMarkerLayout(this._timeline,this._band,this._theme,D,A);
this._highlight=new Timeline.EtherHighlight(this._timeline,this._band,this._theme,this._backgroundLayer);
};
Timeline.GregorianEtherPainter.prototype.setHighlight=function(A,B){this._highlight.position(A,B);
};
Timeline.GregorianEtherPainter.prototype.paint=function(){if(this._markerLayer){this._band.removeLayerDiv(this._markerLayer);
}this._markerLayer=this._band.createLayerDiv(100);
this._markerLayer.setAttribute("name","ether-markers");
this._markerLayer.style.display="none";
if(this._lineLayer){this._band.removeLayerDiv(this._lineLayer);
}this._lineLayer=this._band.createLayerDiv(1);
this._lineLayer.setAttribute("name","ether-lines");
this._lineLayer.style.display="none";
var C=this._band.getMinDate();
var F=this._band.getMaxDate();
var A=this._band.getTimeZone();
var E=this._band.getLabeller();
SimileAjax.DateTime.roundDownToInterval(C,this._unit,A,this._multiple,this._theme.firstDayOfWeek);
var D=this;
var B=function(G){for(var H=0;
H<D._multiple;
H++){SimileAjax.DateTime.incrementByInterval(G,D._unit);
}};
while(C.getTime()<F.getTime()){this._intervalMarkerLayout.createIntervalMarker(C,E,this._unit,this._markerLayer,this._lineLayer);
B(C);
}this._markerLayer.style.display="block";
this._lineLayer.style.display="block";
};
Timeline.GregorianEtherPainter.prototype.softPaint=function(){};
Timeline.GregorianEtherPainter.prototype.zoom=function(A){if(A!=0){this._unit+=A;
}};
Timeline.HotZoneGregorianEtherPainter=function(G){this._params=G;
this._theme=G.theme;
this._zones=[{startTime:Number.NEGATIVE_INFINITY,endTime:Number.POSITIVE_INFINITY,unit:G.unit,multiple:1}];
for(var F=0;
F<G.zones.length;
F++){var C=G.zones[F];
var E=SimileAjax.DateTime.parseGregorianDateTime(C.start).getTime();
var B=SimileAjax.DateTime.parseGregorianDateTime(C.end).getTime();
for(var D=0;
D<this._zones.length&&B>E;
D++){var A=this._zones[D];
if(E<A.endTime){if(E>A.startTime){this._zones.splice(D,0,{startTime:A.startTime,endTime:E,unit:A.unit,multiple:A.multiple});
D++;
A.startTime=E;
}if(B<A.endTime){this._zones.splice(D,0,{startTime:E,endTime:B,unit:C.unit,multiple:(C.multiple)?C.multiple:1});
D++;
A.startTime=B;
E=B;
}else{A.multiple=C.multiple;
A.unit=C.unit;
E=A.endTime;
}}}}};
Timeline.HotZoneGregorianEtherPainter.prototype.initialize=function(C,B){this._band=C;
this._timeline=B;
this._backgroundLayer=C.createLayerDiv(0);
this._backgroundLayer.setAttribute("name","ether-background");
this._backgroundLayer.className="timeline-ether-bg";
this._markerLayer=null;
this._lineLayer=null;
var D=("align" in this._params&&this._params.align!=undefined)?this._params.align:this._theme.ether.interval.marker[B.isHorizontal()?"hAlign":"vAlign"];
var A=("showLine" in this._params)?this._params.showLine:this._theme.ether.interval.line.show;
this._intervalMarkerLayout=new Timeline.EtherIntervalMarkerLayout(this._timeline,this._band,this._theme,D,A);
this._highlight=new Timeline.EtherHighlight(this._timeline,this._band,this._theme,this._backgroundLayer);
};
Timeline.HotZoneGregorianEtherPainter.prototype.setHighlight=function(A,B){this._highlight.position(A,B);
};
Timeline.HotZoneGregorianEtherPainter.prototype.paint=function(){if(this._markerLayer){this._band.removeLayerDiv(this._markerLayer);
}this._markerLayer=this._band.createLayerDiv(100);
this._markerLayer.setAttribute("name","ether-markers");
this._markerLayer.style.display="none";
if(this._lineLayer){this._band.removeLayerDiv(this._lineLayer);
}this._lineLayer=this._band.createLayerDiv(1);
this._lineLayer.setAttribute("name","ether-lines");
this._lineLayer.style.display="none";
var C=this._band.getMinDate();
var A=this._band.getMaxDate();
var I=this._band.getTimeZone();
var L=this._band.getLabeller();
var B=this;
var J=function(N,M){for(var O=0;
O<M.multiple;
O++){SimileAjax.DateTime.incrementByInterval(N,M.unit);
}};
var D=0;
while(D<this._zones.length){if(C.getTime()<this._zones[D].endTime){break;
}D++;
}var E=this._zones.length-1;
while(E>=0){if(A.getTime()>this._zones[E].startTime){break;
}E--;
}for(var H=D;
H<=E;
H++){var G=this._zones[H];
var K=new Date(Math.max(C.getTime(),G.startTime));
var F=new Date(Math.min(A.getTime(),G.endTime));
SimileAjax.DateTime.roundDownToInterval(K,G.unit,I,G.multiple,this._theme.firstDayOfWeek);
SimileAjax.DateTime.roundUpToInterval(F,G.unit,I,G.multiple,this._theme.firstDayOfWeek);
while(K.getTime()<F.getTime()){this._intervalMarkerLayout.createIntervalMarker(K,L,G.unit,this._markerLayer,this._lineLayer);
J(K,G);
}}this._markerLayer.style.display="block";
this._lineLayer.style.display="block";
};
Timeline.HotZoneGregorianEtherPainter.prototype.softPaint=function(){};
Timeline.HotZoneGregorianEtherPainter.prototype.zoom=function(A){if(A!=0){for(var B=0;
B<this._zones.length;
++B){if(this._zones[B]){this._zones[B].unit+=A;
}}}};
Timeline.YearCountEtherPainter=function(A){this._params=A;
this._theme=A.theme;
this._startDate=SimileAjax.DateTime.parseGregorianDateTime(A.startDate);
this._multiple=("multiple" in A)?A.multiple:1;
};
Timeline.YearCountEtherPainter.prototype.initialize=function(C,B){this._band=C;
this._timeline=B;
this._backgroundLayer=C.createLayerDiv(0);
this._backgroundLayer.setAttribute("name","ether-background");
this._backgroundLayer.className="timeline-ether-bg";
this._markerLayer=null;
this._lineLayer=null;
var D=("align" in this._params)?this._params.align:this._theme.ether.interval.marker[B.isHorizontal()?"hAlign":"vAlign"];
var A=("showLine" in this._params)?this._params.showLine:this._theme.ether.interval.line.show;
this._intervalMarkerLayout=new Timeline.EtherIntervalMarkerLayout(this._timeline,this._band,this._theme,D,A);
this._highlight=new Timeline.EtherHighlight(this._timeline,this._band,this._theme,this._backgroundLayer);
};
Timeline.YearCountEtherPainter.prototype.setHighlight=function(A,B){this._highlight.position(A,B);
};
Timeline.YearCountEtherPainter.prototype.paint=function(){if(this._markerLayer){this._band.removeLayerDiv(this._markerLayer);
}this._markerLayer=this._band.createLayerDiv(100);
this._markerLayer.setAttribute("name","ether-markers");
this._markerLayer.style.display="none";
if(this._lineLayer){this._band.removeLayerDiv(this._lineLayer);
}this._lineLayer=this._band.createLayerDiv(1);
this._lineLayer.setAttribute("name","ether-lines");
this._lineLayer.style.display="none";
var B=new Date(this._startDate.getTime());
var F=this._band.getMaxDate();
var E=this._band.getMinDate().getUTCFullYear()-this._startDate.getUTCFullYear();
B.setUTCFullYear(this._band.getMinDate().getUTCFullYear()-E%this._multiple);
var C=this;
var A=function(G){for(var H=0;
H<C._multiple;
H++){SimileAjax.DateTime.incrementByInterval(G,SimileAjax.DateTime.YEAR);
}};
var D={labelInterval:function(G,I){var H=G.getUTCFullYear()-C._startDate.getUTCFullYear();
return{text:H,emphasized:H==0};
}};
while(B.getTime()<F.getTime()){this._intervalMarkerLayout.createIntervalMarker(B,D,SimileAjax.DateTime.YEAR,this._markerLayer,this._lineLayer);
A(B);
}this._markerLayer.style.display="block";
this._lineLayer.style.display="block";
};
Timeline.YearCountEtherPainter.prototype.softPaint=function(){};
Timeline.QuarterlyEtherPainter=function(A){this._params=A;
this._theme=A.theme;
this._startDate=SimileAjax.DateTime.parseGregorianDateTime(A.startDate);
};
Timeline.QuarterlyEtherPainter.prototype.initialize=function(C,B){this._band=C;
this._timeline=B;
this._backgroundLayer=C.createLayerDiv(0);
this._backgroundLayer.setAttribute("name","ether-background");
this._backgroundLayer.className="timeline-ether-bg";
this._markerLayer=null;
this._lineLayer=null;
var D=("align" in this._params)?this._params.align:this._theme.ether.interval.marker[B.isHorizontal()?"hAlign":"vAlign"];
var A=("showLine" in this._params)?this._params.showLine:this._theme.ether.interval.line.show;
this._intervalMarkerLayout=new Timeline.EtherIntervalMarkerLayout(this._timeline,this._band,this._theme,D,A);
this._highlight=new Timeline.EtherHighlight(this._timeline,this._band,this._theme,this._backgroundLayer);
};
Timeline.QuarterlyEtherPainter.prototype.setHighlight=function(A,B){this._highlight.position(A,B);
};
Timeline.QuarterlyEtherPainter.prototype.paint=function(){if(this._markerLayer){this._band.removeLayerDiv(this._markerLayer);
}this._markerLayer=this._band.createLayerDiv(100);
this._markerLayer.setAttribute("name","ether-markers");
this._markerLayer.style.display="none";
if(this._lineLayer){this._band.removeLayerDiv(this._lineLayer);
}this._lineLayer=this._band.createLayerDiv(1);
this._lineLayer.setAttribute("name","ether-lines");
this._lineLayer.style.display="none";
var B=new Date(0);
var E=this._band.getMaxDate();
B.setUTCFullYear(Math.max(this._startDate.getUTCFullYear(),this._band.getMinDate().getUTCFullYear()));
B.setUTCMonth(this._startDate.getUTCMonth());
var C=this;
var A=function(F){F.setUTCMonth(F.getUTCMonth()+3);
};
var D={labelInterval:function(G,H){var F=(4+(G.getUTCMonth()-C._startDate.getUTCMonth())/3)%4;
if(F!=0){return{text:"Q"+(F+1),emphasized:false};
}else{return{text:"Y"+(G.getUTCFullYear()-C._startDate.getUTCFullYear()+1),emphasized:true};
}}};
while(B.getTime()<E.getTime()){this._intervalMarkerLayout.createIntervalMarker(B,D,SimileAjax.DateTime.YEAR,this._markerLayer,this._lineLayer);
A(B);
}this._markerLayer.style.display="block";
this._lineLayer.style.display="block";
};
Timeline.QuarterlyEtherPainter.prototype.softPaint=function(){};
Timeline.EtherIntervalMarkerLayout=function(I,L,C,E,M){var A=I.isHorizontal();
if(A){if(E=="Top"){this.positionDiv=function(O,N){O.style.left=N+"px";
O.style.top="0px";
};
}else{this.positionDiv=function(O,N){O.style.left=N+"px";
O.style.bottom="0px";
};
}}else{if(E=="Left"){this.positionDiv=function(O,N){O.style.top=N+"px";
O.style.left="0px";
};
}else{this.positionDiv=function(O,N){O.style.top=N+"px";
O.style.right="0px";
};
}}var D=C.ether.interval.marker;
var K=C.ether.interval.line;
var B=C.ether.interval.weekend;
var H=(A?"h":"v")+E;
var G=D[H+"Styler"];
var J=D[H+"EmphasizedStyler"];
var F=SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.DAY];
this.createIntervalMarker=function(T,c,a,Y,P){var U=Math.round(L.dateToPixelOffset(T));
if(M&&a!=SimileAjax.DateTime.WEEK){var V=I.getDocument().createElement("div");
V.className="timeline-ether-lines";
if(K.opacity<100){SimileAjax.Graphics.setOpacity(V,K.opacity);
}if(A){V.style.left=U+"px";
}else{V.style.top=U+"px";
}P.appendChild(V);
}if(a==SimileAjax.DateTime.WEEK){var N=C.firstDayOfWeek;
var R=new Date(T.getTime()+(6-N-7)*F);
var b=new Date(R.getTime()+2*F);
var Q=Math.round(L.dateToPixelOffset(R));
var S=Math.round(L.dateToPixelOffset(b));
var W=Math.max(1,S-Q);
var X=I.getDocument().createElement("div");
X.className="timeline-ether-weekends";
if(B.opacity<100){SimileAjax.Graphics.setOpacity(X,B.opacity);
}if(A){X.style.left=Q+"px";
X.style.width=W+"px";
}else{X.style.top=Q+"px";
X.style.height=W+"px";
}P.appendChild(X);
}var Z=c.labelInterval(T,a);
var O=I.getDocument().createElement("div");
O.innerHTML=Z.text;
O.className="timeline-date-label";
if(Z.emphasized){O.className+=" timeline-date-label-em";
}this.positionDiv(O,U);
Y.appendChild(O);
return O;
};
};
Timeline.EtherHighlight=function(B,E,D,C){var A=B.isHorizontal();
this._highlightDiv=null;
this._createHighlightDiv=function(){if(this._highlightDiv==null){this._highlightDiv=B.getDocument().createElement("div");
this._highlightDiv.setAttribute("name","ether-highlight");
this._highlightDiv.className="timeline-ether-highlight";
var F=D.ether.highlightOpacity;
if(F<100){SimileAjax.Graphics.setOpacity(this._highlightDiv,F);
}C.appendChild(this._highlightDiv);
}};
this.position=function(H,J){this._createHighlightDiv();
var I=Math.round(E.dateToPixelOffset(H));
var G=Math.round(E.dateToPixelOffset(J));
var F=Math.max(G-I,3);
if(A){this._highlightDiv.style.left=I+"px";
this._highlightDiv.style.width=F+"px";
this._highlightDiv.style.height=(E.getViewWidth()-4)+"px";
}else{this._highlightDiv.style.top=I+"px";
this._highlightDiv.style.height=F+"px";
this._highlightDiv.style.width=(E.getViewWidth()-4)+"px";
}};
};


/* ethers.js */
Timeline.LinearEther=function(A){this._params=A;
this._interval=A.interval;
this._pixelsPerInterval=A.pixelsPerInterval;
};
Timeline.LinearEther.prototype.initialize=function(B,A){this._band=B;
this._timeline=A;
this._unit=A.getUnit();
if("startsOn" in this._params){this._start=this._unit.parseFromObject(this._params.startsOn);
}else{if("endsOn" in this._params){this._start=this._unit.parseFromObject(this._params.endsOn);
this.shiftPixels(-this._timeline.getPixelLength());
}else{if("centersOn" in this._params){this._start=this._unit.parseFromObject(this._params.centersOn);
this.shiftPixels(-this._timeline.getPixelLength()/2);
}else{this._start=this._unit.makeDefaultValue();
this.shiftPixels(-this._timeline.getPixelLength()/2);
}}}};
Timeline.LinearEther.prototype.setDate=function(A){this._start=this._unit.cloneValue(A);
};
Timeline.LinearEther.prototype.shiftPixels=function(B){var A=this._interval*B/this._pixelsPerInterval;
this._start=this._unit.change(this._start,A);
};
Timeline.LinearEther.prototype.dateToPixelOffset=function(B){var A=this._unit.compare(B,this._start);
return this._pixelsPerInterval*A/this._interval;
};
Timeline.LinearEther.prototype.pixelOffsetToDate=function(B){var A=B*this._interval/this._pixelsPerInterval;
return this._unit.change(this._start,A);
};
Timeline.LinearEther.prototype.zoom=function(D){var A=0;
var B=this._band._zoomIndex;
var C=B;
if(D&&(B>0)){C=B-1;
}if(!D&&(B<(this._band._zoomSteps.length-1))){C=B+1;
}this._band._zoomIndex=C;
this._interval=SimileAjax.DateTime.gregorianUnitLengths[this._band._zoomSteps[C].unit];
this._pixelsPerInterval=this._band._zoomSteps[C].pixelsPerInterval;
A=this._band._zoomSteps[C].unit-this._band._zoomSteps[B].unit;
return A;
};
Timeline.HotZoneEther=function(A){this._params=A;
this._interval=A.interval;
this._pixelsPerInterval=A.pixelsPerInterval;
this._theme=A.theme;
};
Timeline.HotZoneEther.prototype.initialize=function(I,H){this._band=I;
this._timeline=H;
this._unit=H.getUnit();
this._zones=[{startTime:Number.NEGATIVE_INFINITY,endTime:Number.POSITIVE_INFINITY,magnify:1}];
var D=this._params;
for(var E=0;
E<D.zones.length;
E++){var G=D.zones[E];
var F=this._unit.parseFromObject(G.start);
var B=this._unit.parseFromObject(G.end);
for(var C=0;
C<this._zones.length&&this._unit.compare(B,F)>0;
C++){var A=this._zones[C];
if(this._unit.compare(F,A.endTime)<0){if(this._unit.compare(F,A.startTime)>0){this._zones.splice(C,0,{startTime:A.startTime,endTime:F,magnify:A.magnify});
C++;
A.startTime=F;
}if(this._unit.compare(B,A.endTime)<0){this._zones.splice(C,0,{startTime:F,endTime:B,magnify:G.magnify*A.magnify});
C++;
A.startTime=B;
F=B;
}else{A.magnify*=G.magnify;
F=A.endTime;
}}}}if("startsOn" in this._params){this._start=this._unit.parseFromObject(this._params.startsOn);
}else{if("endsOn" in this._params){this._start=this._unit.parseFromObject(this._params.endsOn);
this.shiftPixels(-this._timeline.getPixelLength());
}else{if("centersOn" in this._params){this._start=this._unit.parseFromObject(this._params.centersOn);
this.shiftPixels(-this._timeline.getPixelLength()/2);
}else{this._start=this._unit.makeDefaultValue();
this.shiftPixels(-this._timeline.getPixelLength()/2);
}}}};
Timeline.HotZoneEther.prototype.setDate=function(A){this._start=this._unit.cloneValue(A);
};
Timeline.HotZoneEther.prototype.shiftPixels=function(A){this._start=this.pixelOffsetToDate(A);
};
Timeline.HotZoneEther.prototype.dateToPixelOffset=function(A){return this._dateDiffToPixelOffset(this._start,A);
};
Timeline.HotZoneEther.prototype.pixelOffsetToDate=function(A){return this._pixelOffsetToDate(A,this._start);
};
Timeline.HotZoneEther.prototype.zoom=function(D){var A=0;
var B=this._band._zoomIndex;
var C=B;
if(D&&(B>0)){C=B-1;
}if(!D&&(B<(this._band._zoomSteps.length-1))){C=B+1;
}this._band._zoomIndex=C;
this._interval=SimileAjax.DateTime.gregorianUnitLengths[this._band._zoomSteps[C].unit];
this._pixelsPerInterval=this._band._zoomSteps[C].pixelsPerInterval;
A=this._band._zoomSteps[C].unit-this._band._zoomSteps[B].unit;
return A;
};
Timeline.HotZoneEther.prototype._dateDiffToPixelOffset=function(H,C){var D=this._getScale();
var I=H;
var B=C;
var E=0;
if(this._unit.compare(I,B)<0){var G=0;
while(G<this._zones.length){if(this._unit.compare(I,this._zones[G].endTime)<0){break;
}G++;
}while(this._unit.compare(I,B)<0){var F=this._zones[G];
var A=this._unit.earlier(B,F.endTime);
E+=(this._unit.compare(A,I)/(D/F.magnify));
I=A;
G++;
}}else{var G=this._zones.length-1;
while(G>=0){if(this._unit.compare(I,this._zones[G].startTime)>0){break;
}G--;
}while(this._unit.compare(I,B)>0){var F=this._zones[G];
var A=this._unit.later(B,F.startTime);
E+=(this._unit.compare(A,I)/(D/F.magnify));
I=A;
G--;
}}return E;
};
Timeline.HotZoneEther.prototype._pixelOffsetToDate=function(E,B){var G=this._getScale();
var D=B;
if(E>0){var F=0;
while(F<this._zones.length){if(this._unit.compare(D,this._zones[F].endTime)<0){break;
}F++;
}while(E>0){var A=this._zones[F];
var H=G/A.magnify;
if(A.endTime==Number.POSITIVE_INFINITY){D=this._unit.change(D,E*H);
E=0;
}else{var C=this._unit.compare(A.endTime,D)/H;
if(C>E){D=this._unit.change(D,E*H);
E=0;
}else{D=A.endTime;
E-=C;
}}F++;
}}else{var F=this._zones.length-1;
while(F>=0){if(this._unit.compare(D,this._zones[F].startTime)>0){break;
}F--;
}E=-E;
while(E>0){var A=this._zones[F];
var H=G/A.magnify;
if(A.startTime==Number.NEGATIVE_INFINITY){D=this._unit.change(D,-E*H);
E=0;
}else{var C=this._unit.compare(D,A.startTime)/H;
if(C>E){D=this._unit.change(D,-E*H);
E=0;
}else{D=A.startTime;
E-=C;
}}F--;
}}return D;
};
Timeline.HotZoneEther.prototype._getScale=function(){return this._interval/this._pixelsPerInterval;
};


/* event-utils.js */
Timeline.EventUtils={};
Timeline.EventUtils.getNewEventID=function(){if(this._lastEventID==null){this._lastEventID=0;
}this._lastEventID+=1;
return"e"+this._lastEventID;
};
Timeline.EventUtils.decodeEventElID=function(C){var D=C.split("-");
if(D[1]!="tl"){alert("Internal Timeline problem 101, please consult support");
return{band:null,evt:null};
}var B=Timeline.getTimelineFromID(D[2]);
var E=B.getBand(D[3]);
var A=E.getEventSource.getEvent(D[4]);
return{band:E,evt:A};
};
Timeline.EventUtils.encodeEventElID=function(B,D,C,A){return C+"-tl-"+B.timelineID+"-"+D.getIndex()+"-"+A.getID();
};


/* labellers.js */
Timeline.GregorianDateLabeller=function(B,A){this._locale=B;
this._timeZone=A;
};
Timeline.GregorianDateLabeller.monthNames=[];
Timeline.GregorianDateLabeller.dayNames=[];
Timeline.GregorianDateLabeller.labelIntervalFunctions=[];
Timeline.GregorianDateLabeller.getMonthName=function(B,A){return Timeline.GregorianDateLabeller.monthNames[A][B];
};
Timeline.GregorianDateLabeller.prototype.labelInterval=function(A,C){var B=Timeline.GregorianDateLabeller.labelIntervalFunctions[this._locale];
if(B==null){B=Timeline.GregorianDateLabeller.prototype.defaultLabelInterval;
}return B.call(this,A,C);
};
Timeline.GregorianDateLabeller.prototype.labelPrecise=function(A){return SimileAjax.DateTime.removeTimeZoneOffset(A,this._timeZone).toUTCString();
};
Timeline.GregorianDateLabeller.prototype.defaultLabelInterval=function(B,C){var D;
var F=false;
B=SimileAjax.DateTime.removeTimeZoneOffset(B,this._timeZone);
switch(C){case SimileAjax.DateTime.MILLISECOND:D=B.getUTCMilliseconds();
break;
case SimileAjax.DateTime.SECOND:D=B.getUTCSeconds();
break;
case SimileAjax.DateTime.MINUTE:var A=B.getUTCMinutes();
if(A==0){D=B.getUTCHours()+":00";
F=true;
}else{D=A;
}break;
case SimileAjax.DateTime.HOUR:D=B.getUTCHours()+"hr";
break;
case SimileAjax.DateTime.DAY:D=Timeline.GregorianDateLabeller.getMonthName(B.getUTCMonth(),this._locale)+" "+B.getUTCDate();
break;
case SimileAjax.DateTime.WEEK:D=Timeline.GregorianDateLabeller.getMonthName(B.getUTCMonth(),this._locale)+" "+B.getUTCDate();
break;
case SimileAjax.DateTime.MONTH:var A=B.getUTCMonth();
if(A!=0){D=Timeline.GregorianDateLabeller.getMonthName(A,this._locale);
break;
}case SimileAjax.DateTime.YEAR:case SimileAjax.DateTime.DECADE:case SimileAjax.DateTime.CENTURY:case SimileAjax.DateTime.MILLENNIUM:var E=B.getUTCFullYear();
if(E>0){D=B.getUTCFullYear();
}else{D=(1-E)+"BC";
}F=(C==SimileAjax.DateTime.MONTH)||(C==SimileAjax.DateTime.DECADE&&E%100==0)||(C==SimileAjax.DateTime.CENTURY&&E%1000==0);
break;
default:D=B.toUTCString();
}return{text:D,emphasized:F};
};


/* original-painter.js */
Timeline.OriginalEventPainter=function(A){this._params=A;
this._onSelectListeners=[];
this._eventPaintListeners=[];
this._filterMatcher=null;
this._highlightMatcher=null;
this._frc=null;
this._eventIdToElmt={};
};
Timeline.OriginalEventPainter.prototype.initialize=function(B,A){this._band=B;
this._timeline=A;
this._backLayer=null;
this._eventLayer=null;
this._lineLayer=null;
this._highlightLayer=null;
this._eventIdToElmt=null;
};
Timeline.OriginalEventPainter.prototype.getType=function(){return"original";
};
Timeline.OriginalEventPainter.prototype.addOnSelectListener=function(A){this._onSelectListeners.push(A);
};
Timeline.OriginalEventPainter.prototype.removeOnSelectListener=function(B){for(var A=0;
A<this._onSelectListeners.length;
A++){if(this._onSelectListeners[A]==B){this._onSelectListeners.splice(A,1);
break;
}}};
Timeline.OriginalEventPainter.prototype.addEventPaintListener=function(A){this._eventPaintListeners.push(A);
};
Timeline.OriginalEventPainter.prototype.removeEventPaintListener=function(B){for(var A=0;
A<this._eventPaintListeners.length;
A++){if(this._eventPaintListeners[A]==B){this._eventPaintListeners.splice(A,1);
break;
}}};
Timeline.OriginalEventPainter.prototype.getFilterMatcher=function(){return this._filterMatcher;
};
Timeline.OriginalEventPainter.prototype.setFilterMatcher=function(A){this._filterMatcher=A;
};
Timeline.OriginalEventPainter.prototype.getHighlightMatcher=function(){return this._highlightMatcher;
};
Timeline.OriginalEventPainter.prototype.setHighlightMatcher=function(A){this._highlightMatcher=A;
};
Timeline.OriginalEventPainter.prototype.paint=function(){var C=this._band.getEventSource();
if(C==null){return ;
}this._eventIdToElmt={};
this._fireEventPaintListeners("paintStarting",null,null);
this._prepareForPainting();
var I=this._params.theme.event;
var G=Math.max(I.track.height,I.tape.height+this._frc.getLineHeight());
var F={trackOffset:I.track.offset,trackHeight:G,trackGap:I.track.gap,trackIncrement:G+I.track.gap,icon:I.instant.icon,iconWidth:I.instant.iconWidth,iconHeight:I.instant.iconHeight,labelWidth:I.label.width,maxLabelChar:I.label.maxLabelChar,impreciseIconMargin:I.instant.impreciseIconMargin};
var D=this._band.getMinDate();
var B=this._band.getMaxDate();
var J=(this._filterMatcher!=null)?this._filterMatcher:function(K){return true;
};
var A=(this._highlightMatcher!=null)?this._highlightMatcher:function(K){return -1;
};
var E=C.getEventReverseIterator(D,B);
while(E.hasNext()){var H=E.next();
if(J(H)){this.paintEvent(H,F,this._params.theme,A(H));
}}this._highlightLayer.style.display="block";
this._lineLayer.style.display="block";
this._eventLayer.style.display="block";
this._band.updateEventTrackInfo(this._tracks.length,F.trackIncrement);
this._fireEventPaintListeners("paintEnded",null,null);
};
Timeline.OriginalEventPainter.prototype.softPaint=function(){};
Timeline.OriginalEventPainter.prototype._prepareForPainting=function(){var B=this._band;
if(this._backLayer==null){this._backLayer=this._band.createLayerDiv(0,"timeline-band-events");
this._backLayer.style.visibility="hidden";
var A=document.createElement("span");
A.className="timeline-event-label";
this._backLayer.appendChild(A);
this._frc=SimileAjax.Graphics.getFontRenderingContext(A);
}this._frc.update();
this._tracks=[];
if(this._highlightLayer!=null){B.removeLayerDiv(this._highlightLayer);
}this._highlightLayer=B.createLayerDiv(105,"timeline-band-highlights");
this._highlightLayer.style.display="none";
if(this._lineLayer!=null){B.removeLayerDiv(this._lineLayer);
}this._lineLayer=B.createLayerDiv(110,"timeline-band-lines");
this._lineLayer.style.display="none";
if(this._eventLayer!=null){B.removeLayerDiv(this._eventLayer);
}this._eventLayer=B.createLayerDiv(115,"timeline-band-events");
this._eventLayer.style.display="none";
};
Timeline.OriginalEventPainter.prototype.paintEvent=function(B,C,D,A){if(B.isInstant()){this.paintInstantEvent(B,C,D,A);
}else{this.paintDurationEvent(B,C,D,A);
}};
Timeline.OriginalEventPainter.prototype.paintInstantEvent=function(B,C,D,A){if(B.isImprecise()){this.paintImpreciseInstantEvent(B,C,D,A);
}else{this.paintPreciseInstantEvent(B,C,D,A);
}};
Timeline.OriginalEventPainter.prototype.paintDurationEvent=function(B,C,D,A){if(B.isImprecise()){this.paintImpreciseDurationEvent(B,C,D,A);
}else{this.paintPreciseDurationEvent(B,C,D,A);
}};
Timeline.OriginalEventPainter.prototype.paintPreciseInstantEvent=function(N,S,V,T){var W=this._timeline.getDocument();
var L=N.getText();
var H=N.getStart();
var I=Math.round(this._band.dateToPixelOffset(H));
var A=Math.round(I+S.iconWidth/2);
var C=Math.round(I-S.iconWidth/2);
var F=this._getLabelDivClassName(N);
var D=this._frc.computeSize(L,F);
var M=A+V.event.label.offsetFromLine;
var J=M+D.width;
var Q=J;
var P=this._findFreeTrack(N,Q);
var R=Math.round(S.trackOffset+P*S.trackIncrement+S.trackHeight/2-D.height/2);
var B=this._paintEventIcon(N,P,C,S,V,0);
var U=this._paintEventLabel(N,L,M,R,D.width,D.height,V,F,T);
var E=[B.elmt,U.elmt];
var O=this;
var K=function(Y,X,Z){return O._onClickInstantEvent(B.elmt,X,N);
};
SimileAjax.DOM.registerEvent(B.elmt,"mousedown",K);
SimileAjax.DOM.registerEvent(U.elmt,"mousedown",K);
var G=this._createHighlightDiv(T,B,V,N);
if(G!=null){E.push(G);
}this._fireEventPaintListeners("paintedEvent",N,E);
this._eventIdToElmt[N.getID()]=B.elmt;
this._tracks[P]=C;
};
Timeline.OriginalEventPainter.prototype.paintImpreciseInstantEvent=function(P,U,Z,W){var b=this._timeline.getDocument();
var N=P.getText();
var J=P.getStart();
var X=P.getEnd();
var K=Math.round(this._band.dateToPixelOffset(J));
var B=Math.round(this._band.dateToPixelOffset(X));
var A=Math.round(K+U.iconWidth/2);
var D=Math.round(K-U.iconWidth/2);
var H=this._getLabelDivClassName(P);
var F=this._frc.computeSize(N,H);
var O=A+Z.event.label.offsetFromLine;
var L=O+F.width;
var S=Math.max(L,B);
var R=this._findFreeTrack(P,S);
var a=Z.event.tape.height;
var T=Math.round(U.trackOffset+R*U.trackIncrement+a);
var C=this._paintEventIcon(P,R,D,U,Z,a);
var Y=this._paintEventLabel(P,N,O,T,F.width,F.height,Z,H,W);
var V=P.getColor();
V=V!=null?V:Z.event.instant.impreciseColor;
var E=this._paintEventTape(P,R,K,B,V,Z.event.instant.impreciseOpacity,U,Z,0);
var G=[C.elmt,Y.elmt,E.elmt];
var Q=this;
var M=function(d,c,e){return Q._onClickInstantEvent(C.elmt,c,P);
};
SimileAjax.DOM.registerEvent(C.elmt,"mousedown",M);
SimileAjax.DOM.registerEvent(E.elmt,"mousedown",M);
SimileAjax.DOM.registerEvent(Y.elmt,"mousedown",M);
var I=this._createHighlightDiv(W,C,Z,P);
if(I!=null){G.push(I);
}this._fireEventPaintListeners("paintedEvent",P,G);
this._eventIdToElmt[P.getID()]=C.elmt;
this._tracks[R]=D;
};
Timeline.OriginalEventPainter.prototype.paintPreciseDurationEvent=function(M,R,W,T){var X=this._timeline.getDocument();
var K=M.getText();
var G=M.getStart();
var U=M.getEnd();
var H=Math.round(this._band.dateToPixelOffset(G));
var A=Math.round(this._band.dateToPixelOffset(U));
var E=this._getLabelDivClassName(M);
var C=this._frc.computeSize(K,E);
var L=H;
var I=L+C.width;
var P=Math.max(I,A);
var O=this._findFreeTrack(M,P);
var Q=Math.round(R.trackOffset+O*R.trackIncrement+W.event.tape.height);
var S=M.getColor();
S=S!=null?S:W.event.duration.color;
var B=this._paintEventTape(M,O,H,A,S,100,R,W,0);
var V=this._paintEventLabel(M,K,L,Q,C.width,C.height,W,E,T);
var D=[B.elmt,V.elmt];
var N=this;
var J=function(Z,Y,a){return N._onClickDurationEvent(B.elmt,Y,M);
};
SimileAjax.DOM.registerEvent(B.elmt,"mousedown",J);
SimileAjax.DOM.registerEvent(V.elmt,"mousedown",J);
var F=this._createHighlightDiv(T,B,W,M);
if(F!=null){D.push(F);
}this._fireEventPaintListeners("paintedEvent",M,D);
this._eventIdToElmt[M.getID()]=B.elmt;
this._tracks[O]=H;
};
Timeline.OriginalEventPainter.prototype.paintImpreciseDurationEvent=function(O,W,b,Y){var c=this._timeline.getDocument();
var M=O.getText();
var I=O.getStart();
var V=O.getLatestStart();
var Z=O.getEnd();
var Q=O.getEarliestEnd();
var K=Math.round(this._band.dateToPixelOffset(I));
var F=Math.round(this._band.dateToPixelOffset(V));
var A=Math.round(this._band.dateToPixelOffset(Z));
var G=Math.round(this._band.dateToPixelOffset(Q));
var E=this._getLabelDivClassName(O);
var C=this._frc.computeSize(M,E);
var N=F;
var J=N+C.width;
var S=Math.max(J,A);
var R=this._findFreeTrack(O,S);
var T=Math.round(W.trackOffset+R*W.trackIncrement+b.event.tape.height);
var X=O.getColor();
X=X!=null?X:b.event.duration.color;
var U=this._paintEventTape(O,R,K,A,b.event.duration.impreciseColor,b.event.duration.impreciseOpacity,W,b,0);
var B=this._paintEventTape(O,R,F,G,X,100,W,b,1);
var a=this._paintEventLabel(O,M,N,T,C.width,C.height,b,E,Y);
var D=[U.elmt,B.elmt,a.elmt];
var P=this;
var L=function(e,d,f){return P._onClickDurationEvent(B.elmt,d,O);
};
SimileAjax.DOM.registerEvent(B.elmt,"mousedown",L);
SimileAjax.DOM.registerEvent(a.elmt,"mousedown",L);
var H=this._createHighlightDiv(Y,B,b,O);
if(H!=null){D.push(H);
}this._fireEventPaintListeners("paintedEvent",O,D);
this._eventIdToElmt[O.getID()]=B.elmt;
this._tracks[R]=K;
};
Timeline.OriginalEventPainter.prototype._encodeEventElID=function(B,A){return Timeline.EventUtils.encodeEventElID(this._timeline,this._band,B,A);
};
Timeline.OriginalEventPainter.prototype._findFreeTrack=function(E,D){var A=E.getTrackNum();
if(A!=null){return A;
}for(var C=0;
C<this._tracks.length;
C++){var B=this._tracks[C];
if(B>D){break;
}}return C;
};
Timeline.OriginalEventPainter.prototype._paintEventIcon=function(K,B,C,G,F,D){var I=K.getIcon();
I=I!=null?I:G.icon;
var J;
if(D>0){J=G.trackOffset+B*G.trackIncrement+D+G.impreciseIconMargin;
}else{var H=G.trackOffset+B*G.trackIncrement+G.trackHeight/2;
J=Math.round(H-G.iconHeight/2);
}var E=SimileAjax.Graphics.createTranslucentImage(I);
var A=this._timeline.getDocument().createElement("div");
A.className=this._getElClassName("timeline-event-icon",K,"icon");
A.id=this._encodeEventElID("icon",K);
A.style.left=C+"px";
A.style.top=J+"px";
A.appendChild(E);
if(K._title!=null){A.title=K._title;
}this._eventLayer.appendChild(A);
return{left:C,top:J,width:G.iconWidth,height:G.iconHeight,elmt:A};
};
Timeline.OriginalEventPainter.prototype._paintEventLabel=function(K,L,D,H,A,J,G,E,C){var I=this._timeline.getDocument();
var B=I.createElement("div");
B.className=E;
B.id=this._encodeEventElID("label",K);
B.style.left=D+"px";
B.style.width=A+"px";
B.style.top=H+"px";
B.innerHTML=L;
if(K._title!=null){B.title=K._title;
}var F=K.getTextColor();
if(F==null){F=K.getColor();
}if(F!=null){B.style.color=F;
}if(G.event.highlightLabelBackground&&C>=0){B.style.background=this._getHighlightColor(C,G);
}this._eventLayer.appendChild(B);
return{left:D,top:H,width:A,height:J,elmt:B};
};
Timeline.OriginalEventPainter.prototype._paintEventTape=function(N,B,D,A,G,C,J,I,M){var F=A-D;
var E=I.event.tape.height;
var K=J.trackOffset+B*J.trackIncrement;
var O=this._timeline.getDocument().createElement("div");
O.className=this._getElClassName("timeline-event-tape",N,"tape");
O.id=this._encodeEventElID("tape"+M,N);
O.style.left=D+"px";
O.style.width=F+"px";
O.style.height=E+"px";
O.style.top=K+"px";
if(N._title!=null){O.title=N._title;
}if(G!=null){O.style.backgroundColor=G;
}var L=N.getTapeImage();
var H=N.getTapeRepeat();
H=H!=null?H:"repeat";
if(L!=null){O.style.backgroundImage="url("+L+")";
O.style.backgroundRepeat=H;
}SimileAjax.Graphics.setOpacity(O,C);
this._eventLayer.appendChild(O);
return{left:D,top:K,width:F,height:E,elmt:O};
};
Timeline.OriginalEventPainter.prototype._getLabelDivClassName=function(A){return this._getElClassName("timeline-event-label",A,"label");
};
Timeline.OriginalEventPainter.prototype._getElClassName=function(D,C,A){var E=C.getClassName(),B=[];
if(E){if(A){B.push(A+"-"+E+" ");
}B.push(E+" ");
}B.push(D);
return(B.join(""));
};
Timeline.OriginalEventPainter.prototype._getHighlightColor=function(A,B){var C=B.event.highlightColors;
return C[Math.min(A,C.length-1)];
};
Timeline.OriginalEventPainter.prototype._createHighlightDiv=function(A,D,F,B){var G=null;
if(A>=0){var E=this._timeline.getDocument();
var C=this._getHighlightColor(A,F);
G=E.createElement("div");
G.className=this._getElClassName("timeline-event-highlight",B,"highlight");
G.id=this._encodeEventElID("highlight0",B);
G.style.position="absolute";
G.style.overflow="hidden";
G.style.left=(D.left-2)+"px";
G.style.width=(D.width+4)+"px";
G.style.top=(D.top-2)+"px";
G.style.height=(D.height+4)+"px";
G.style.background=C;
this._highlightLayer.appendChild(G);
}return G;
};
Timeline.OriginalEventPainter.prototype._onClickInstantEvent=function(C,A,B){var D=SimileAjax.DOM.getPageCoordinates(C);
this._showBubble(D.left+Math.ceil(C.offsetWidth/2),D.top+Math.ceil(C.offsetHeight/2),B);
this._fireOnSelect(B.getID());
A.cancelBubble=true;
SimileAjax.DOM.cancelEvent(A);
return false;
};
Timeline.OriginalEventPainter.prototype._onClickDurationEvent=function(F,B,C){if("pageX" in B){var A=B.pageX;
var E=B.pageY;
}else{var D=SimileAjax.DOM.getPageCoordinates(F);
var A=B.offsetX+D.left;
var E=B.offsetY+D.top;
}this._showBubble(A,E,C);
this._fireOnSelect(C.getID());
B.cancelBubble=true;
SimileAjax.DOM.cancelEvent(B);
return false;
};
Timeline.OriginalEventPainter.prototype.showBubble=function(A){var B=this._eventIdToElmt[A.getID()];
if(B){var C=SimileAjax.DOM.getPageCoordinates(B);
this._showBubble(C.left+B.offsetWidth/2,C.top+B.offsetHeight/2,A);
}};
Timeline.OriginalEventPainter.prototype._showBubble=function(B,E,C){var D=document.createElement("div");
var A=this._params.theme.event.bubble;
C.fillInfoBubble(D,this._params.theme,this._band.getLabeller());
SimileAjax.WindowManager.cancelPopups();
SimileAjax.Graphics.createBubbleForContentAndPoint(D,B,E,A.width,null,A.maxHeight);
};
Timeline.OriginalEventPainter.prototype._fireOnSelect=function(A){for(var B=0;
B<this._onSelectListeners.length;
B++){this._onSelectListeners[B](A);
}};
Timeline.OriginalEventPainter.prototype._fireEventPaintListeners=function(D,A,C){for(var B=0;
B<this._eventPaintListeners.length;
B++){this._eventPaintListeners[B](this._band,D,A,C);
}};


/* overview-painter.js */
Timeline.OverviewEventPainter=function(A){this._params=A;
this._onSelectListeners=[];
this._filterMatcher=null;
this._highlightMatcher=null;
};
Timeline.OverviewEventPainter.prototype.initialize=function(B,A){this._band=B;
this._timeline=A;
this._eventLayer=null;
this._highlightLayer=null;
};
Timeline.OverviewEventPainter.prototype.getType=function(){return"overview";
};
Timeline.OverviewEventPainter.prototype.addOnSelectListener=function(A){this._onSelectListeners.push(A);
};
Timeline.OverviewEventPainter.prototype.removeOnSelectListener=function(B){for(var A=0;
A<this._onSelectListeners.length;
A++){if(this._onSelectListeners[A]==B){this._onSelectListeners.splice(A,1);
break;
}}};
Timeline.OverviewEventPainter.prototype.getFilterMatcher=function(){return this._filterMatcher;
};
Timeline.OverviewEventPainter.prototype.setFilterMatcher=function(A){this._filterMatcher=A;
};
Timeline.OverviewEventPainter.prototype.getHighlightMatcher=function(){return this._highlightMatcher;
};
Timeline.OverviewEventPainter.prototype.setHighlightMatcher=function(A){this._highlightMatcher=A;
};
Timeline.OverviewEventPainter.prototype.paint=function(){var C=this._band.getEventSource();
if(C==null){return ;
}this._prepareForPainting();
var H=this._params.theme.event;
var F={trackOffset:H.overviewTrack.offset,trackHeight:H.overviewTrack.height,trackGap:H.overviewTrack.gap,trackIncrement:H.overviewTrack.height+H.overviewTrack.gap};
var D=this._band.getMinDate();
var B=this._band.getMaxDate();
var I=(this._filterMatcher!=null)?this._filterMatcher:function(J){return true;
};
var A=(this._highlightMatcher!=null)?this._highlightMatcher:function(J){return -1;
};
var E=C.getEventReverseIterator(D,B);
while(E.hasNext()){var G=E.next();
if(I(G)){this.paintEvent(G,F,this._params.theme,A(G));
}}this._highlightLayer.style.display="block";
this._eventLayer.style.display="block";
this._band.updateEventTrackInfo(this._tracks.length,F.trackIncrement);
};
Timeline.OverviewEventPainter.prototype.softPaint=function(){};
Timeline.OverviewEventPainter.prototype._prepareForPainting=function(){var A=this._band;
this._tracks=[];
if(this._highlightLayer!=null){A.removeLayerDiv(this._highlightLayer);
}this._highlightLayer=A.createLayerDiv(105,"timeline-band-highlights");
this._highlightLayer.style.display="none";
if(this._eventLayer!=null){A.removeLayerDiv(this._eventLayer);
}this._eventLayer=A.createLayerDiv(110,"timeline-band-events");
this._eventLayer.style.display="none";
};
Timeline.OverviewEventPainter.prototype.paintEvent=function(B,C,D,A){if(B.isInstant()){this.paintInstantEvent(B,C,D,A);
}else{this.paintDurationEvent(B,C,D,A);
}};
Timeline.OverviewEventPainter.prototype.paintInstantEvent=function(I,H,E,A){var F=I.getStart();
var B=Math.round(this._band.dateToPixelOffset(F));
var C=I.getColor(),D=I.getClassName();
if(D){C=null;
}else{C=C!=null?C:E.event.duration.color;
}var G=this._paintEventTick(I,B,C,100,H,E);
this._createHighlightDiv(A,G,E);
};
Timeline.OverviewEventPainter.prototype.paintDurationEvent=function(L,K,H,B){var A=L.getLatestStart();
var I=L.getEarliestEnd();
var J=Math.round(this._band.dateToPixelOffset(A));
var C=Math.round(this._band.dateToPixelOffset(I));
var F=0;
for(;
F<this._tracks.length;
F++){if(C<this._tracks[F]){break;
}}this._tracks[F]=C;
var E=L.getColor(),G=L.getClassName();
if(G){E=null;
}else{E=E!=null?E:H.event.duration.color;
}var D=this._paintEventTape(L,F,J,C,E,100,K,H,G);
this._createHighlightDiv(B,D,H);
};
Timeline.OverviewEventPainter.prototype._paintEventTape=function(K,B,D,L,E,C,H,G,F){var I=H.trackOffset+B*H.trackIncrement;
var A=L-D;
var J=H.trackHeight;
var M=this._timeline.getDocument().createElement("div");
M.className="timeline-small-event-tape";
if(F){M.className+=" small-"+F;
}M.style.left=D+"px";
M.style.width=A+"px";
M.style.top=I+"px";
M.style.height=J+"px";
if(E){M.style.backgroundColor=E;
}if(C<100){SimileAjax.Graphics.setOpacity(M,C);
}this._eventLayer.appendChild(M);
return{left:D,top:I,width:A,height:J,elmt:M};
};
Timeline.OverviewEventPainter.prototype._paintEventTick=function(J,C,D,B,G,F){var I=F.event.overviewTrack.tickHeight;
var H=G.trackOffset-I;
var A=1;
var K=this._timeline.getDocument().createElement("div");
K.className="timeline-small-event-icon";
K.style.left=C+"px";
K.style.top=H+"px";
var E=J.getClassName();
if(E){K.className+=" small-"+E;
}if(B<100){SimileAjax.Graphics.setOpacity(K,B);
}this._eventLayer.appendChild(K);
return{left:C,top:H,width:A,height:I,elmt:K};
};
Timeline.OverviewEventPainter.prototype._createHighlightDiv=function(A,C,E){if(A>=0){var D=this._timeline.getDocument();
var G=E.event;
var B=G.highlightColors[Math.min(A,G.highlightColors.length-1)];
var F=D.createElement("div");
F.style.position="absolute";
F.style.overflow="hidden";
F.style.left=(C.left-1)+"px";
F.style.width=(C.width+2)+"px";
F.style.top=(C.top-1)+"px";
F.style.height=(C.height+2)+"px";
F.style.background=B;
this._highlightLayer.appendChild(F);
}};
Timeline.OverviewEventPainter.prototype.showBubble=function(A){};


/* sources.js */
Timeline.DefaultEventSource=function(A){this._events=(A instanceof Object)?A:new SimileAjax.EventIndex();
this._listeners=[];
};
Timeline.DefaultEventSource.prototype.addListener=function(A){this._listeners.push(A);
};
Timeline.DefaultEventSource.prototype.removeListener=function(B){for(var A=0;
A<this._listeners.length;
A++){if(this._listeners[A]==B){this._listeners.splice(A,1);
break;
}}};
Timeline.DefaultEventSource.prototype.loadXML=function(G,A){var C=this._getBaseURL(A);
var H=G.documentElement.getAttribute("wiki-url");
var J=G.documentElement.getAttribute("wiki-section");
var F=G.documentElement.getAttribute("date-time-format");
var E=this._events.getUnit().getParser(F);
var D=G.documentElement.firstChild;
var I=false;
while(D!=null){if(D.nodeType==1){var L="";
if(D.firstChild!=null&&D.firstChild.nodeType==3){L=D.firstChild.nodeValue;
}var B=(D.getAttribute("isDuration")===null&&D.getAttribute("durationEvent")===null)||D.getAttribute("isDuration")=="false"||D.getAttribute("durationEvent")=="false";
var K=new Timeline.DefaultEventSource.Event({id:D.getAttribute("id"),start:E(D.getAttribute("start")),end:E(D.getAttribute("end")),latestStart:E(D.getAttribute("latestStart")),earliestEnd:E(D.getAttribute("earliestEnd")),instant:B,text:D.getAttribute("title"),description:L,image:this._resolveRelativeURL(D.getAttribute("image"),C),link:this._resolveRelativeURL(D.getAttribute("link"),C),icon:this._resolveRelativeURL(D.getAttribute("icon"),C),color:D.getAttribute("color"),textColor:D.getAttribute("textColor"),hoverText:D.getAttribute("hoverText"),classname:D.getAttribute("classname"),tapeImage:D.getAttribute("tapeImage"),tapeRepeat:D.getAttribute("tapeRepeat"),caption:D.getAttribute("caption"),eventID:D.getAttribute("eventID"),trackNum:D.getAttribute("trackNum")});
K._node=D;
K.getProperty=function(M){return this._node.getAttribute(M);
};
K.setWikiInfo(H,J);
this._events.add(K);
I=true;
}D=D.nextSibling;
}if(I){this._fire("onAddMany",[]);
}};
Timeline.DefaultEventSource.prototype.loadJSON=function(H,B){var D=this._getBaseURL(B);
var J=false;
if(H&&H.events){var I=("wikiURL" in H)?H.wikiURL:null;
var K=("wikiSection" in H)?H.wikiSection:null;
var F=("dateTimeFormat" in H)?H.dateTimeFormat:null;
var E=this._events.getUnit().getParser(F);
for(var G=0;
G<H.events.length;
G++){var A=H.events[G];
var C=A.isDuration||(A.durationEvent!=null&&!A.durationEvent);
var L=new Timeline.DefaultEventSource.Event({id:("id" in A)?A.id:undefined,start:E(A.start),end:E(A.end),latestStart:E(A.latestStart),earliestEnd:E(A.earliestEnd),instant:C,text:A.title,description:A.description,image:this._resolveRelativeURL(A.image,D),link:this._resolveRelativeURL(A.link,D),icon:this._resolveRelativeURL(A.icon,D),color:A.color,textColor:A.textColor,hoverText:A.hoverText,classname:A.classname,tapeImage:A.tapeImage,tapeRepeat:A.tapeRepeat,caption:A.caption,eventID:A.eventID,trackNum:A.trackNum});
L._obj=A;
L.getProperty=function(M){return this._obj[M];
};
L.setWikiInfo(I,K);
this._events.add(L);
J=true;
}}if(J){this._fire("onAddMany",[]);
}};
Timeline.DefaultEventSource.prototype.loadSPARQL=function(I,B){var E=this._getBaseURL(B);
var H="iso8601";
var G=this._events.getUnit().getParser(H);
if(I==null){return ;
}var F=I.documentElement.firstChild;
while(F!=null&&(F.nodeType!=1||F.nodeName!="results")){F=F.nextSibling;
}var J=null;
var L=null;
if(F!=null){J=F.getAttribute("wiki-url");
L=F.getAttribute("wiki-section");
F=F.firstChild;
}var K=false;
while(F!=null){if(F.nodeType==1){var D={};
var A=F.firstChild;
while(A!=null){if(A.nodeType==1&&A.firstChild!=null&&A.firstChild.nodeType==1&&A.firstChild.firstChild!=null&&A.firstChild.firstChild.nodeType==3){D[A.getAttribute("name")]=A.firstChild.firstChild.nodeValue;
}A=A.nextSibling;
}if(D["start"]==null&&D["date"]!=null){D["start"]=D["date"];
}var C=(D["isDuration"]===null&&D["durationEvent"]===null)||D["isDuration"]=="false"||D["durationEvent"]=="false";
var M=new Timeline.DefaultEventSource.Event({id:D["id"],start:G(D["start"]),end:G(D["end"]),latestStart:G(D["latestStart"]),earliestEnd:G(D["earliestEnd"]),instant:C,text:D["title"],description:D["description"],image:this._resolveRelativeURL(D["image"],E),link:this._resolveRelativeURL(D["link"],E),icon:this._resolveRelativeURL(D["icon"],E),color:D["color"],textColor:D["textColor"],hoverText:D["hoverText"],caption:D["caption"],classname:D["classname"],tapeImage:D["tapeImage"],tapeRepeat:D["tapeRepeat"],eventID:D["eventID"],trackNum:D["trackNum"]});
M._bindings=D;
M.getProperty=function(N){return this._bindings[N];
};
M.setWikiInfo(J,L);
this._events.add(M);
K=true;
}F=F.nextSibling;
}if(K){this._fire("onAddMany",[]);
}};
Timeline.DefaultEventSource.prototype.add=function(A){this._events.add(A);
this._fire("onAddOne",[A]);
};
Timeline.DefaultEventSource.prototype.addMany=function(A){for(var B=0;
B<A.length;
B++){this._events.add(A[B]);
}this._fire("onAddMany",[]);
};
Timeline.DefaultEventSource.prototype.clear=function(){this._events.removeAll();
this._fire("onClear",[]);
};
Timeline.DefaultEventSource.prototype.getEvent=function(A){return this._events.getEvent(A);
};
Timeline.DefaultEventSource.prototype.getEventIterator=function(A,B){return this._events.getIterator(A,B);
};
Timeline.DefaultEventSource.prototype.getEventReverseIterator=function(A,B){return this._events.getReverseIterator(A,B);
};
Timeline.DefaultEventSource.prototype.getAllEventIterator=function(){return this._events.getAllIterator();
};
Timeline.DefaultEventSource.prototype.getCount=function(){return this._events.getCount();
};
Timeline.DefaultEventSource.prototype.getEarliestDate=function(){return this._events.getEarliestDate();
};
Timeline.DefaultEventSource.prototype.getLatestDate=function(){return this._events.getLatestDate();
};
Timeline.DefaultEventSource.prototype._fire=function(B,A){for(var C=0;
C<this._listeners.length;
C++){var D=this._listeners[C];
if(B in D){try{D[B].apply(D,A);
}catch(E){SimileAjax.Debug.exception(E);
}}}};
Timeline.DefaultEventSource.prototype._getBaseURL=function(A){if(A.indexOf("://")<0){var C=this._getBaseURL(document.location.href);
if(A.substr(0,1)=="/"){A=C.substr(0,C.indexOf("/",C.indexOf("://")+3))+A;
}else{A=C+A;
}}var B=A.lastIndexOf("/");
if(B<0){return"";
}else{return A.substr(0,B+1);
}};
Timeline.DefaultEventSource.prototype._resolveRelativeURL=function(A,B){if(A==null||A==""){return A;
}else{if(A.indexOf("://")>0){return A;
}else{if(A.substr(0,1)=="/"){return B.substr(0,B.indexOf("/",B.indexOf("://")+3))+A;
}else{return B+A;
}}}};
Timeline.DefaultEventSource.Event=function(A){function D(E){return(A[E]!=null&&A[E]!="")?A[E]:null;
}var C=A.id?A.id.trim():"";
this._id=C.length>0?C:Timeline.EventUtils.getNewEventID();
this._instant=A.instant||(A.end==null);
this._start=A.start;
this._end=(A.end!=null)?A.end:A.start;
this._latestStart=(A.latestStart!=null)?A.latestStart:(A.instant?this._end:this._start);
this._earliestEnd=(A.earliestEnd!=null)?A.earliestEnd:this._end;
var B=[];
if(this._start>this._latestStart){this._latestStart=this._start;
B.push("start is > latestStart");
}if(this._start>this._earliestEnd){this._earliestEnd=this._latestStart;
B.push("start is > earliestEnd");
}if(this._start>this._end){this._end=this._earliestEnd;
B.push("start is > end");
}if(this._latestStart>this._earliestEnd){this._earliestEnd=this._latestStart;
B.push("latestStart is > earliestEnd");
}if(this._latestStart>this._end){this._end=this._earliestEnd;
B.push("latestStart is > end");
}if(this._earliestEnd>this._end){this._end=this._earliestEnd;
B.push("earliestEnd is > end");
}this._eventID=D("eventID");
this._text=(A.text!=null)?SimileAjax.HTML.deEntify(A.text):"";
if(B.length>0){this._text+=" PROBLEM: "+B.join(", ");
}this._description=SimileAjax.HTML.deEntify(A.description);
this._image=D("image");
this._link=D("link");
this._title=D("hoverText");
this._title=D("caption");
this._icon=D("icon");
this._color=D("color");
this._textColor=D("textColor");
this._classname=D("classname");
this._tapeImage=D("tapeImage");
this._tapeRepeat=D("tapeRepeat");
this._trackNum=D("trackNum");
if(this._trackNum!=null){this._trackNum=parseInt(this._trackNum);
}this._wikiURL=null;
this._wikiSection=null;
};
Timeline.DefaultEventSource.Event.prototype={getID:function(){return this._id;
},isInstant:function(){return this._instant;
},isImprecise:function(){return this._start!=this._latestStart||this._end!=this._earliestEnd;
},getStart:function(){return this._start;
},getEnd:function(){return this._end;
},getLatestStart:function(){return this._latestStart;
},getEarliestEnd:function(){return this._earliestEnd;
},getEventID:function(){return this._eventID;
},getText:function(){return this._text;
},getDescription:function(){return this._description;
},getImage:function(){return this._image;
},getLink:function(){return this._link;
},getIcon:function(){return this._icon;
},getColor:function(){return this._color;
},getTextColor:function(){return this._textColor;
},getClassName:function(){return this._classname;
},getTapeImage:function(){return this._tapeImage;
},getTapeRepeat:function(){return this._tapeRepeat;
},getTrackNum:function(){return this._trackNum;
},getProperty:function(A){return null;
},getWikiURL:function(){return this._wikiURL;
},getWikiSection:function(){return this._wikiSection;
},setWikiInfo:function(B,A){this._wikiURL=B;
this._wikiSection=A;
},fillDescription:function(A){A.innerHTML=this._description;
},fillWikiInfo:function(D){D.style.display="none";
if(this._wikiURL==null||this._wikiSection==null){return ;
}var C=this.getProperty("wikiID");
if(C==null||C.length==0){C=this.getText();
}if(C==null||C.length==0){return ;
}D.style.display="inline";
C=C.replace(/\s/g,"_");
var B=this._wikiURL+this._wikiSection.replace(/\s/g,"_")+"/"+C;
var A=document.createElement("a");
A.href=B;
A.target="new";
A.innerHTML=Timeline.strings[Timeline.clientLocale].wikiLinkLabel;
D.appendChild(document.createTextNode("["));
D.appendChild(A);
D.appendChild(document.createTextNode("]"));
},fillTime:function(A,B){if(this._instant){if(this.isImprecise()){A.appendChild(A.ownerDocument.createTextNode(B.labelPrecise(this._start)));
A.appendChild(A.ownerDocument.createElement("br"));
A.appendChild(A.ownerDocument.createTextNode(B.labelPrecise(this._end)));
}else{A.appendChild(A.ownerDocument.createTextNode(B.labelPrecise(this._start)));
}}else{if(this.isImprecise()){A.appendChild(A.ownerDocument.createTextNode(B.labelPrecise(this._start)+" ~ "+B.labelPrecise(this._latestStart)));
A.appendChild(A.ownerDocument.createElement("br"));
A.appendChild(A.ownerDocument.createTextNode(B.labelPrecise(this._earliestEnd)+" ~ "+B.labelPrecise(this._end)));
}else{A.appendChild(A.ownerDocument.createTextNode(B.labelPrecise(this._start)));
A.appendChild(A.ownerDocument.createElement("br"));
A.appendChild(A.ownerDocument.createTextNode(B.labelPrecise(this._end)));
}}},fillInfoBubble:function(A,E,M){var K=A.ownerDocument;
var J=this.getText();
var H=this.getLink();
var B=this.getImage();
if(B!=null){var D=K.createElement("img");
D.src=B;
E.event.bubble.imageStyler(D);
A.appendChild(D);
}var L=K.createElement("div");
var C=K.createTextNode(J);
if(H!=null){var I=K.createElement("a");
I.href=H;
I.appendChild(C);
L.appendChild(I);
}else{L.appendChild(C);
}E.event.bubble.titleStyler(L);
A.appendChild(L);
var N=K.createElement("div");
this.fillDescription(N);
E.event.bubble.bodyStyler(N);
A.appendChild(N);
var G=K.createElement("div");
this.fillTime(G,M);
E.event.bubble.timeStyler(G);
A.appendChild(G);
var F=K.createElement("div");
this.fillWikiInfo(F);
E.event.bubble.wikiStyler(F);
A.appendChild(F);
}};


/* themes.js */
Timeline.ClassicTheme=new Object();
Timeline.ClassicTheme.implementations=[];
Timeline.ClassicTheme.create=function(B){if(B==null){B=Timeline.getDefaultLocale();
}var A=Timeline.ClassicTheme.implementations[B];
if(A==null){A=Timeline.ClassicTheme._Impl;
}return new A();
};
Timeline.ClassicTheme._Impl=function(){this.firstDayOfWeek=0;
this.autoWidth=false;
this.autoWidthAnimationTime=500;
this.timeline_start=null;
this.timeline_stop=null;
this.ether={backgroundColors:[],highlightOpacity:50,interval:{line:{show:true,opacity:25},weekend:{opacity:30},marker:{hAlign:"Bottom",vAlign:"Right"}}};
this.event={track:{height:10,gap:2,offset:2,autoWidthMargin:1.5},overviewTrack:{offset:20,tickHeight:6,height:2,gap:1,autoWidthMargin:5},tape:{height:4},instant:{icon:Timeline.urlPrefix+"images/dull-blue-circle.png",iconWidth:10,iconHeight:10,impreciseOpacity:20,impreciseIconMargin:3},duration:{impreciseOpacity:20},label:{backgroundOpacity:50,offsetFromLine:3},highlightColors:["#FFFF00","#FFC000","#FF0000","#0000FF"],highlightLabelBackground:false,bubble:{width:250,maxHeight:0,titleStyler:function(A){A.className="timeline-event-bubble-title";
},bodyStyler:function(A){A.className="timeline-event-bubble-body";
},imageStyler:function(A){A.className="timeline-event-bubble-image";
},wikiStyler:function(A){A.className="timeline-event-bubble-wiki";
},timeStyler:function(A){A.className="timeline-event-bubble-time";
}}};
this.mouseWheel="scroll";
};


/* timeline.js */
Timeline.version="2.3.0";
Timeline.ajax_lib_version=SimileAjax.version;
Timeline.display_version=Timeline.version+" (with Ajax lib "+Timeline.ajax_lib_version+")";
Timeline.strings={};
Timeline.HORIZONTAL=0;
Timeline.VERTICAL=1;
Timeline._defaultTheme=null;
Timeline.getDefaultLocale=function(){return Timeline.clientLocale;
};
Timeline.create=function(D,C,E,F){if(Timeline.timelines==null){Timeline.timelines=[];
}var B=Timeline.timelines.length;
Timeline.timelines[B]=null;
var A=new Timeline._Impl(D,C,E,F,B);
Timeline.timelines[B]=A;
return A;
};
Timeline.createBandInfo=function(F){var G=("theme" in F)?F.theme:Timeline.getDefaultTheme();
var D=("eventSource" in F)?F.eventSource:null;
var H=new Timeline.LinearEther({centersOn:("date" in F)?F.date:new Date(),interval:SimileAjax.DateTime.gregorianUnitLengths[F.intervalUnit],pixelsPerInterval:F.intervalPixels,theme:G});
var C=new Timeline.GregorianEtherPainter({unit:F.intervalUnit,multiple:("multiple" in F)?F.multiple:1,theme:G,align:("align" in F)?F.align:undefined});
var I={showText:("showEventText" in F)?F.showEventText:true,theme:G};
if("eventPainterParams" in F){for(var A in F.eventPainterParams){I[A]=F.eventPainterParams[A];
}}if("trackHeight" in F){I.trackHeight=F.trackHeight;
}if("trackGap" in F){I.trackGap=F.trackGap;
}var B=("overview" in F&&F.overview)?"overview":("layout" in F?F.layout:"original");
var E;
if("eventPainter" in F){E=new F.eventPainter(I);
}else{switch(B){case"overview":E=new Timeline.OverviewEventPainter(I);
break;
case"detailed":E=new Timeline.DetailedEventPainter(I);
break;
default:E=new Timeline.OriginalEventPainter(I);
}}return{width:F.width,eventSource:D,timeZone:("timeZone" in F)?F.timeZone:0,ether:H,etherPainter:C,eventPainter:E,theme:G,zoomIndex:("zoomIndex" in F)?F.zoomIndex:0,zoomSteps:("zoomSteps" in F)?F.zoomSteps:null};
};
Timeline.createHotZoneBandInfo=function(F){var G=("theme" in F)?F.theme:Timeline.getDefaultTheme();
var D=("eventSource" in F)?F.eventSource:null;
var H=new Timeline.HotZoneEther({centersOn:("date" in F)?F.date:new Date(),interval:SimileAjax.DateTime.gregorianUnitLengths[F.intervalUnit],pixelsPerInterval:F.intervalPixels,zones:F.zones,theme:G});
var C=new Timeline.HotZoneGregorianEtherPainter({unit:F.intervalUnit,zones:F.zones,theme:G,align:("align" in F)?F.align:undefined});
var I={showText:("showEventText" in F)?F.showEventText:true,theme:G};
if("eventPainterParams" in F){for(var A in F.eventPainterParams){I[A]=F.eventPainterParams[A];
}}if("trackHeight" in F){I.trackHeight=F.trackHeight;
}if("trackGap" in F){I.trackGap=F.trackGap;
}var B=("overview" in F&&F.overview)?"overview":("layout" in F?F.layout:"original");
var E;
if("eventPainter" in F){E=new F.eventPainter(I);
}else{switch(B){case"overview":E=new Timeline.OverviewEventPainter(I);
break;
case"detailed":E=new Timeline.DetailedEventPainter(I);
break;
default:E=new Timeline.OriginalEventPainter(I);
}}return{width:F.width,eventSource:D,timeZone:("timeZone" in F)?F.timeZone:0,ether:H,etherPainter:C,eventPainter:E,theme:G,zoomIndex:("zoomIndex" in F)?F.zoomIndex:0,zoomSteps:("zoomSteps" in F)?F.zoomSteps:null};
};
Timeline.getDefaultTheme=function(){if(Timeline._defaultTheme==null){Timeline._defaultTheme=Timeline.ClassicTheme.create(Timeline.getDefaultLocale());
}return Timeline._defaultTheme;
};
Timeline.setDefaultTheme=function(A){Timeline._defaultTheme=A;
};
Timeline.loadXML=function(A,C){var D=function(G,F,E){alert("Failed to load data xml from "+A+"\n"+G);
};
var B=function(F){var E=F.responseXML;
if(!E.documentElement&&F.responseStream){E.load(F.responseStream);
}C(E,A);
};
SimileAjax.XmlHttp.get(A,D,B);
};
Timeline.loadJSON=function(url,f){var fError=function(statusText,status,xmlhttp){alert("Failed to load json data from "+url+"\n"+statusText);
};
var fDone=function(xmlhttp){f(eval("("+xmlhttp.responseText+")"),url);
};
SimileAjax.XmlHttp.get(url,fError,fDone);
};
Timeline.getTimelineFromID=function(A){return Timeline.timelines[A];
};
Timeline.writeVersion=function(A){document.getElementById(A).innerHTML=this.display_version;
};
Timeline._Impl=function(C,B,D,E,A){SimileAjax.WindowManager.initialize();
this._containerDiv=C;
this._bandInfos=B;
this._orientation=D==null?Timeline.HORIZONTAL:D;
this._unit=(E!=null)?E:SimileAjax.NativeDateUnit;
this._starting=true;
this._autoResizing=false;
this.autoWidth=B&&B[0]&&B[0].theme&&B[0].theme.autoWidth;
this.autoWidthAnimationTime=B&&B[0]&&B[0].theme&&B[0].theme.autoWidthAnimationTime;
this.timelineID=A;
this.timeline_start=B&&B[0]&&B[0].theme&&B[0].theme.timeline_start;
this.timeline_stop=B&&B[0]&&B[0].theme&&B[0].theme.timeline_stop;
this.timeline_at_start=false;
this.timeline_at_stop=false;
this._initialize();
};
Timeline._Impl.prototype.dispose=function(){for(var A=0;
A<this._bands.length;
A++){this._bands[A].dispose();
}this._bands=null;
this._bandInfos=null;
this._containerDiv.innerHTML="";
Timeline.timelines[this.timelineID]=null;
};
Timeline._Impl.prototype.getBandCount=function(){return this._bands.length;
};
Timeline._Impl.prototype.getBand=function(A){return this._bands[A];
};
Timeline._Impl.prototype.finishedEventLoading=function(){this._autoWidthCheck(true);
this._starting=false;
};
Timeline._Impl.prototype.layout=function(){this._autoWidthCheck(true);
this._distributeWidths();
};
Timeline._Impl.prototype.paint=function(){for(var A=0;
A<this._bands.length;
A++){this._bands[A].paint();
}};
Timeline._Impl.prototype.getDocument=function(){return this._containerDiv.ownerDocument;
};
Timeline._Impl.prototype.addDiv=function(A){this._containerDiv.appendChild(A);
};
Timeline._Impl.prototype.removeDiv=function(A){this._containerDiv.removeChild(A);
};
Timeline._Impl.prototype.isHorizontal=function(){return this._orientation==Timeline.HORIZONTAL;
};
Timeline._Impl.prototype.isVertical=function(){return this._orientation==Timeline.VERTICAL;
};
Timeline._Impl.prototype.getPixelLength=function(){return this._orientation==Timeline.HORIZONTAL?this._containerDiv.offsetWidth:this._containerDiv.offsetHeight;
};
Timeline._Impl.prototype.getPixelWidth=function(){return this._orientation==Timeline.VERTICAL?this._containerDiv.offsetWidth:this._containerDiv.offsetHeight;
};
Timeline._Impl.prototype.getUnit=function(){return this._unit;
};
Timeline._Impl.prototype.getWidthStyle=function(){return this._orientation==Timeline.HORIZONTAL?"height":"width";
};
Timeline._Impl.prototype.loadXML=function(B,D){var A=this;
var E=function(H,G,F){alert("Failed to load data xml from "+B+"\n"+H);
A.hideLoadingMessage();
};
var C=function(G){try{var F=G.responseXML;
if(!F.documentElement&&G.responseStream){F.load(G.responseStream);
}D(F,B);
}finally{A.hideLoadingMessage();
}};
this.showLoadingMessage();
window.setTimeout(function(){SimileAjax.XmlHttp.get(B,E,C);
},0);
};
Timeline._Impl.prototype.loadJSON=function(url,f){var tl=this;
var fError=function(statusText,status,xmlhttp){alert("Failed to load json data from "+url+"\n"+statusText);
tl.hideLoadingMessage();
};
var fDone=function(xmlhttp){try{f(eval("("+xmlhttp.responseText+")"),url);
}finally{tl.hideLoadingMessage();
}};
this.showLoadingMessage();
window.setTimeout(function(){SimileAjax.XmlHttp.get(url,fError,fDone);
},0);
};
Timeline._Impl.prototype._autoWidthScrollListener=function(A){A.getTimeline()._autoWidthCheck(false);
};
Timeline._Impl.prototype._autoWidthCheck=function(C){var A=this;
var B=A._starting;
var D=0;
function E(){var G=A.getWidthStyle();
if(B){A._containerDiv.style[G]=D+"px";
}else{A._autoResizing=true;
var H={};
H[G]=D+"px";
SimileAjax.jQuery(A._containerDiv).animate(H,A.autoWidthAnimationTime,"linear",function(){A._autoResizing=false;
});
}}function F(){var H=0;
var G=A.getPixelWidth();
if(A._autoResizing){return ;
}for(var I=0;
I<A._bands.length;
I++){A._bands[I].checkAutoWidth();
H+=A._bandInfos[I].width;
}if(H>G||C){D=H;
E();
A._distributeWidths();
}}if(!A.autoWidth){return ;
}F();
};
Timeline._Impl.prototype._initialize=function(){var H=this._containerDiv;
var E=H.ownerDocument;
H.className=H.className.split(" ").concat("timeline-container").join(" ");
var C=(this.isHorizontal())?"horizontal":"vertical";
H.className+=" timeline-"+C;
while(H.firstChild){H.removeChild(H.firstChild);
}var A=SimileAjax.Graphics.createTranslucentImage(Timeline.urlPrefix+(this.isHorizontal()?"images/copyright-vertical.png":"images/copyright.png"));
A.className="timeline-copyright";
A.title="Timeline copyright SIMILE - www.code.google.com/p/simile-widgets/";
SimileAjax.DOM.registerEvent(A,"click",function(){window.location="http://code.google.com/p/simile-widgets/";
});
H.appendChild(A);
this._bands=[];
for(var B=0;
B<this._bandInfos.length;
B++){var G=new Timeline._Band(this,this._bandInfos[B],B);
this._bands.push(G);
}this._distributeWidths();
for(var B=0;
B<this._bandInfos.length;
B++){var F=this._bandInfos[B];
if("syncWith" in F){this._bands[B].setSyncWithBand(this._bands[F.syncWith],("highlight" in F)?F.highlight:false);
}}if(this.autoWidth){for(var B=0;
B<this._bands.length;
B++){this._bands[B].addOnScrollListener(this._autoWidthScrollListener);
}}var D=SimileAjax.Graphics.createMessageBubble(E);
D.containerDiv.className="timeline-message-container";
H.appendChild(D.containerDiv);
D.contentDiv.className="timeline-message";
D.contentDiv.innerHTML="<img src='"+Timeline.urlPrefix+"images/progress-running.gif' /> Loading...";
this.showLoadingMessage=function(){D.containerDiv.style.display="block";
};
this.hideLoadingMessage=function(){D.containerDiv.style.display="none";
};
};
Timeline._Impl.prototype._distributeWidths=function(){var G=this.getPixelLength();
var B=this.getPixelWidth();
var C=0;
for(var F=0;
F<this._bands.length;
F++){var J=this._bands[F];
var I=this._bandInfos[F];
var E=I.width;
var D;
if(typeof E=="string"){var H=E.indexOf("%");
if(H>0){var A=parseInt(E.substr(0,H));
D=Math.round(A*B/100);
}else{D=parseInt(E);
}}else{D=E;
}J.setBandShiftAndWidth(C,D);
J.setViewLength(G);
C+=D;
}};
Timeline._Impl.prototype.shiftOK=function(C,B){var F=B>0,A=B<0;
if((F&&this.timeline_start==null)||(A&&this.timeline_stop==null)||(B==0)){return(true);
}var H=false;
for(var E=0;
E<this._bands.length&&!H;
E++){H=this._bands[E].busy();
}if(H){return(true);
}if((F&&this.timeline_at_start)||(A&&this.timeline_at_stop)){return(false);
}var D=false;
for(var E=0;
E<this._bands.length&&!D;
E++){var G=this._bands[E];
if(F){D=(E==C?G.getMinVisibleDateAfterDelta(B):G.getMinVisibleDate())>=this.timeline_start;
}else{D=(E==C?G.getMaxVisibleDateAfterDelta(B):G.getMaxVisibleDate())<=this.timeline_stop;
}}if(F){this.timeline_at_start=!D;
this.timeline_at_stop=false;
}else{this.timeline_at_stop=!D;
this.timeline_at_start=false;
}return(D);
};
Timeline._Impl.prototype.zoom=function(D,A,G,F){var C=new RegExp("^timeline-band-([0-9]+)$");
var E=null;
var B=C.exec(F.id);
if(B){E=parseInt(B[1]);
}if(E!=null){this._bands[E].zoom(D,A,G,F);
}this.paint();
};


/* units.js */
Timeline.NativeDateUnit=new Object();
Timeline.NativeDateUnit.createLabeller=function(B,A){return new Timeline.GregorianDateLabeller(B,A);
};
Timeline.NativeDateUnit.makeDefaultValue=function(){return new Date();
};
Timeline.NativeDateUnit.cloneValue=function(A){return new Date(A.getTime());
};
Timeline.NativeDateUnit.getParser=function(A){if(typeof A=="string"){A=A.toLowerCase();
}return(A=="iso8601"||A=="iso 8601")?Timeline.DateTime.parseIso8601DateTime:Timeline.DateTime.parseGregorianDateTime;
};
Timeline.NativeDateUnit.parseFromObject=function(A){return Timeline.DateTime.parseGregorianDateTime(A);
};
Timeline.NativeDateUnit.toNumber=function(A){return A.getTime();
};
Timeline.NativeDateUnit.fromNumber=function(A){return new Date(A);
};
Timeline.NativeDateUnit.compare=function(D,C){var B,A;
if(typeof D=="object"){B=D.getTime();
}else{B=Number(D);
}if(typeof C=="object"){A=C.getTime();
}else{A=Number(C);
}return B-A;
};
Timeline.NativeDateUnit.earlier=function(B,A){return Timeline.NativeDateUnit.compare(B,A)<0?B:A;
};
Timeline.NativeDateUnit.later=function(B,A){return Timeline.NativeDateUnit.compare(B,A)>0?B:A;
};
Timeline.NativeDateUnit.change=function(A,B){return new Date(A.getTime()+B);
};
Timeline.GregorianDateLabeller.monthNames.en=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];Timeline.GregorianDateLabeller.dayNames.en=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
Timeline.strings.en={wikiLinkLabel:"Discuss"};

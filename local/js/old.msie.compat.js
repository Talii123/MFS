var noop = function() {
	;
};

var console = console || {
	"log": noop,
	"error": noop,
	"trace": noop,
	"profile": noop
};
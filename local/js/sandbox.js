// code based off of p104 in Stoyan Stefanov's "Javascript Patterns"

function Sandbox() {
		// turning arguments into an array
	var args = Array.prototype.slice.call(arguments),
		// the last argument is the callback
		callback = args.pop(),
		// modules can be passed as an array or as individual parameters
		modules = (args[0] && typeof args[0] === "string") ? args : args[0],
		i;

	// make sure the function is called as a constructor
	if (!(this instanceof Sandbox)) {
		return new Sandbox(modules, callback);
	}

	// now add modules to the core 'this' object
	// no modules or "*" both mean "use all modules"
	if (!modules || (modules[0] && modules[0] === '*')) {
		modules = [];
		for (i in Sandbox.modules) {
			if (Sandbox.modules.hasOwnProperty(i)) {
				modules.push(i);
			}
		}
	}


	// initialize the required modules
	for (i=0; i < modules.length; ++i) {
		try {
			Sandbox.modules[modules[i]](this);
		} catch (e) {
			console.log("modules[i]=", modules[i]);
			console.log(e);
		}
	}

	// call the callback
	callback(this);
}

// any prototype properties as needed
Sandbox.prototype = {
	name : "My Application",
	version : "1.0",
	getName : function() {
		return this.name;
	}
};


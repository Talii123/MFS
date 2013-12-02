var errorMsg = "Sandbox is not defined.  DAO module will not be loaded.";

if (!Sandbox) {
	console.error(errorMsg);
	throw {
		name: 		"NoSandboxError",
		message: 	errorMsg
	};
}

if (!Sandbox.modules) {
	Sandbox.modules = {};
}

Sandbox.modules.dao = function (app) {

	var HELP_CHAPTER_JSON = [
            {
                "title"     	:   "Help",
                "start"     	:   "January 4, 2013",
                "end"       	:   "January 17, 2013",
                "typeIndex"		: 	-1,
                "type"			: 	"CHAPTER",
                "typeDetails" 	: 	{		                    	
                		"text"      :   "This is where 'chapters' of your story show up.  Click the 'Add Chapter' button to start telling your story."
                }
            }
        ],
		dummyDAO = (function() {
			var createDummyFunction = function (dummyFunctionName) {
					return function() {
						console.log(dummyFunctionName, "(", arguments, ")");
					};
				},
				testDummyDAO = function() {
					for (method in dummyDAO) {
						if (dummyDAO.hasOwnProperty(method)) {
							dummyDAO[method]();
						}
					}
				},
				createDummyObj = function(dummyMethodNames) {
				var dummyObj = {};

				$.each(dummyMethodNames, function(index, dummyMethodName) {
					dummyObj[dummyMethodName] = createDummyFunction(dummyMethodName);
				});

				dummyObj.testDummyDAO = testDummyDAO;

				return dummyObj; 
			}

			return createDummyObj(["updateEvent", "addEvent", "deleteEvent", "loadEvent", "addChapter", "deleteChapter", "initAutoCompletes"]);

		})();

	$.extend(dummyDAO, {
        "getEvents"		: 	function() {
    							return {
									"dateTimeFormat"	: 	"Gregorian",
    								"events" 			: 	[]
    							};
    						},
        "getChapters"	: 	function() {
    							return {
    								"chapters" 	: 	HELP_CHAPTER_JSON
    							};
    						}
	});

	app.getDAO = function() {
		return dummyDAO;
	}
}
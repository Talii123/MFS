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

	var dummyDAO = (function() {

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

			return createDummyObj(["updateEvent", "addEvent", "deleteEvent", "loadEvent"]);

		})(),

		dao = (function() {
			var successFunc = function (data, textStatus, jqXHR) {
					console.log("Successfully posted event to server.");
					console.log("data = ", data);
					console.log("textStatus = ", textStatus);
					console.log("jqXHR = ", jqXHR);
				},
				/* copied from createEventInfoUpdater function in timeline-view-module.js */
                addEvents = function(events) {
                    var i, 
                        numEvents;

                    console.log("addEvents called!");

                    if (!events) {
                        console.error("addEvents called, but with invalid events argument: ", events);
                        return;
                    }

                    for (i = 0, numEvents = events.length; i < numEvents; ++i) {
                        addEvent(events[i]);
                    }
                    console.log("done adding events.");                        
                },				
				addEvent = function (timelineLibEvent) {
					var eventToAdd;
					console.log("dao is adding the event: ", timelineLibEvent);
					eventToAdd = timelineLibEvent._obj;
					eventToAdd.id = timelineLibEvent.getID();
					console.log("sending reformatted event: ", eventToAdd , "... ");
					$.ajax("/myStory/events/", {
						type		: 	"POST",
						//mimeType 	: 	"application/json",
						contentType : 	"application/json",
						data 		: 	JSON.stringify(eventToAdd),
						dataType	: 	"json", 
						success 	: 	successFunc,
						//crossDomain : 	true
					});

					console.log("request sent.");
				};

			return {
				//"addEvent"	: 	addEvent
                "addEvent"      :       addEvent,
                "addEvents"     :       addEvents,
                "onAddOne"      :       addEvents,  // for some reason, eventSource was written to retutn the single event as an array :(
                "onAddMany"     :       addEvents				
			};
		})(),

		isHosted = (document.location.protocol != "file:"),
		activeDAO = dao; //isHosted ? dao : dummyDAO;

	//dummyDAO.testDummyDAO();



	app.getDAO = function() {
		return activeDAO;
	}

}
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

		dataloader = {
			"loadData" 	: 	(function() { 
				var dataBindingsMap = {
					"events"		: 		"#eventsToLoad",
					"chapters"		: 		"#chaptersToLoad",
					"doctors"		: 		"#doctorAutocompleteData",
					"hospitals"		: 		"#hospitalAutocompleteData",
					"locations"		: 		"#locationAutocompleteData",
					"chemos" 	 	: 		"#chemoAutocompleteData"
				};

				return function(dataName) {
					var $dataNode = $(dataBindingsMap[dataName]),
						data;

					if ($dataNode.length > 0) {
						data = JSON.parse($dataNode.text());
						//$dataNode.remove();
					} 
					if (!data) {
						console.log("No data loaded for: ", dataName);
					}

					return data;
				};
			})()
		},

		expandEvents = function(events) {
			var i,
				numEvents,
				event;

			/*console.log("expanding Events...");
			if (!events || events.length <= 0) return;

			numEvents = events.length;
			for (i=0; i < numEvents; ++i) {
				event = events[i];
				if (!event.end) {
					console.log("event does not have an end, so fixing it now.  Event title: ", event.title);
					event.end = event.start;
					event.instant = true;
				}
			}
			console.log("done expanding.");*/

			return events;
		},

		parseEvents = function(events) {
			var i,
				numEvents,
				evt,
				details,
				sites;

			numEvents = events && events.length;
			for (i=0; i < numEvents; ++i) {
				evt = events[i];
				if (evt.type === "DIAGNOSIS") {
					details = evt.typeDetails;
					if (details) {
						sites = details.diseaseSites;
						if (sites) {
							details.diseaseSites = sites.split(":");
						}
					}
				}
			}
			return events;
		},		

		dao = (function() {
			var events = parseEvents(expandEvents(dataloader.loadData("events"))),
				chapters = dataloader.loadData("chapters"),
				doctors = dataloader.loadData("doctors"),
				hospitals = dataloader.loadData("hospitals"),
				locations = dataloader.loadData("locations"),
				chemos = dataloader.loadData("chemos"),
		        HELP_CHAPTER_JSON = [
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
				log = function(textStatus, jqXHR) {
					console.log("textStatus = ", textStatus);
					if (jqXHR) {
						console.dir("jqXHR = ", jqXHR);						
					}
				},
				successFunc = function (data, textStatus, jqXHR) {
					console.log("Successfully posted event to server.");
					log(textStatus);
					console.log("data = ", data);
				},
				genericErrorFunc = function(jqXHR, textStatus, errorThrown) {
					console.log("Error: '", errorThrown, "'; request failed.");
					log(textStatus, jqXHR);
				},
				deleteResource = function(resoureToDeleteURL, onSuccess, onFail) {
					onSuccess = onSuccess || successFunc;
					onFail = onFail || genericErrorFunc;
					$.ajax(resoureToDeleteURL, {
						type		: 	"POST",
						headers		: 	{
							"x-post-override"	: 	"DELETE"
						},
						success 	: 	onSuccess,
						error 		: 	onFail
					});
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
					var eventToAdd,
						eventDetails,
						diseaseSites;
					console.log("dao is adding the event: ", timelineLibEvent);
					eventToAdd = timelineLibEvent._obj;
					eventToAdd.id = timelineLibEvent.getID();

					// TODO: clean up this ugly one-off reformatting code
					eventDetails = eventToAdd.typeDetails;
					if (eventToAdd.type === "DIAGNOSIS" && eventDetails) {
						diseaseSites = eventDetails.diseaseSites;
						if (diseaseSites) {
							eventDetails.diseaseSites = diseaseSites.join(":");
						}						
					} 

					console.log("sending reformatted event: ", eventToAdd , "... ");
					$.ajax("/myStory/events/", {
						type		: 	"POST",
						//mimeType 	: 	"application/json",
						contentType : 	"application/json",
						data 		: 	JSON.stringify(eventToAdd),
						dataType	: 	"json", 
						success 	: 	successFunc,
						error 		: 	genericErrorFunc
					});

					console.log("request sent.");
				},

				deleteEvent = function(eventID) {
					console.log("dao is deleting eventID: ", eventID);									
					deleteResource("/myStory/events/"+eventID);
					console.log("request sent.");
				},

				addChapter = function(chapterEvent) {
					console.log("dao is adding chapter: ", chapterEvent);

					$.ajax("/myStory/events/", {
						type		: 	"POST",
						//mimeType 	: 	"application/json",
						contentType : 	"application/json",
						data 		: 	JSON.stringify(chapterEvent),
						dataType	: 	"json", 
						success 	: 	successFunc,
						error 		: 	genericErrorFunc
					});

					console.log("request sent.");
				},

				deleteChapter = function(chapterID) {
					console.log("dao is deleting chapterID: ", chapterID);									
					deleteResource("/myStory/chapters/"+chapterID);
					console.log("request sent.");
				},

				initAutoCompletes = function() {
					console.log("setting up autocomplete for doctor fields.");
					$(".doctor").autocomplete({
						source 	: 	doctors
					});
					console.log("setting up autocomplete for hospital fields.");
					$(".hospital").autocomplete({
						source 	: 	hospitals
					});						
					console.log("setting up autocomplete for location fields.");
					$(".location").autocomplete({
						source 	: 	locations
					});	
					console.log("setting up autocomplete for chemo fields.");
					$(".chemoProtocol").autocomplete({
						source 	: 	chemos
					});						
				};

			console.log("events loaded: ", events);
			console.log("chapters loaded: ", chapters);
			if (chapters.length <= 0) {
				chapters = HELP_CHAPTER_JSON;
			}
			console.log("since no chapters were loaded, I set it to HELP_CHAPTER_JSON; chapters = ", chapters);

			console.log("doctors loaded: ", doctors);
			console.log("hospitals loaded: ", hospitals);
			console.log("locations loaded: ", locations);
			console.log("chemos loaded: ", chemos);

			return {
				//"addEvent"	: 		addEvent
                "addEvent"      :   	addEvent,
                "addEvents"     :   	addEvents,
                "onAddOne"      :       addEvents,  // for some reason, eventSource was written to retutn the single event as an array :(
                "onAddMany"     :       addEvents,
                "deleteEvent"	: 		deleteEvent,
                "addChapter"	: 		addChapter,
                "deleteChapter" : 		deleteChapter,
                "getEvents"		: 		function() {
                							return {
   												"dateTimeFormat"	: 	"Gregorian",
                								"events" 			: 	events
                							};
                						},
                "getChapters"	: 		function() {
                							return {
                								"chapters" 	: 	chapters
                							};
                						},
                "initAutoCompletes"	: 	initAutoCompletes,
                "deleteMyAccount"	: 	function() {
                							if (confirm("Are you sure you want to delete your account?\nWe cannot undo this later.")) {
                								deleteResource("/myAccount", function onSuccess() {
                									alert("Your account has been deleted.  You will now be forwarded to the demo page.");
                									location.href="/demo";
                								}, function onFail() {
                									alert("I'm sorry, but I was unable to delete your account at this time.");
                									genericErrorFunc();
                								});
                							}
                						}
			};
		})(),

		isHosted = (document.location.protocol != "file:"),
		activeDAO = dao; //isHosted ? dao : dummyDAO;

	//dummyDAO.testDummyDAO();



	app.getDAO = function() {
		return activeDAO;
	}

}

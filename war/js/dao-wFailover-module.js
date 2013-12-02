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

		log = function(textStatus, jqXHR, errorThrown) {
			console.error("textStatus = ", textStatus, " errorThrown =", errorThrown);
			if (jqXHR) {
				console.dir("jqXHR = ", jqXHR);						
			}
		},	

        createSaveHelper = function() {
            var saveHelperClassname = "saveHelper",
                EL_SELECTOR = "." + saveHelperClassname,
                $el,
                state = "INIT",
                onSaving = function() {
                	if (state != "SAVING") {
	                	state = "SAVING";
	                    $el.text("Saving...");
	                    $el.fadeIn(400);                		
                	}
                },
                onAllSaved = function() {
                	if (state != "ALL_SAVED") {
                		state = "ALL_SAVED";
	                    $el.text("Saved!");
	                    $el.fadeOut(1800, function() {
	                        //
	                    });                		
                	}
                },
                onError = function(errorMsg) {
                	console.log("onError called with errorMsg: ", errorMsg);
                	// don't need to check state; even if in error state, still want to do onError handler
                	state = "ERROR";
                	$el.text("ERROR!!");
                	$el.data("errorMsg", errorMsg || "An error occurred while trying to save your changes.");
                	$el.fadeIn(400);
                },
				setState = function(state) {
                    switch (state) {
                        case "saving" :
                            onSaving();
                            break;
                        case "all-saved" :
                            onAllSaved();
                            break;
                        case "error" :
                        	onError();
                        	break;
                        /*case "waiting" :
                            break;*/
                        default:
                            console.warn("unknown state: ", state);
                    }
                };                          

            return {
                "setState" : setState,
                "attach" : function(appendTarget) {
		            appendTarget = appendTarget || body;
		            //$(appendTarget).append($el);
		            $("<div class='" + saveHelperClassname + "'></div>").appendTo(appendTarget);
		            $el = $(EL_SELECTOR);  
		            $el.on("click", function() {
		            	alert($(this).data("errorMsg"));
		            });              	
                },
                "onSaving" 	: onSaving,
                "onAllSaved" : onAllSaved,
                "onError" : onError
            };
        }, 

		makeSyncer = function() {
			var retryTimer = null,
				MAX_NUM_RETRIES = 5,
				INIT_RETRY_INTERVAL = 1000,
				retryCount = 0,
				retryMultiplier = 2,
				retryTimeout = INIT_RETRY_INTERVAL,
				listeners = [],

				notifyAll = function(eventName) {
					console.log("numListeners: ", listeners.length);
					$.each(listeners, function() {
						if (this[eventName]) {
							this[eventName]();
						}					
						else {
							console.error("object: ", this, " does not support event named: ", eventName);
						}	
					})
				},

				onSuccess = function(data, textStatus, jqXHR) {
					var httpVerb;
					console.log("Received success response from server.");
					log(textStatus, jqXHR);
					console.log("data = ", data);

					retryCount = 0;
					retryTimeout = INIT_RETRY_INTERVAL;

					if (this.type == "POST") {
						httpVerb = this.headers && this.headers["x-post-override"];
						switch (httpVerb) {
							case "DELETE" :
								console.log("a delete request was completed successfully");
								deleteActionsHandler.onSuccess(this.url);
								break;
							case "" :
								postActionsHandler.onSuccess(this);
								break;
							default :
								console.warn("unknown override header value: ", httpVerb);
								break;
						}
					}
					if (postActionsHandler.isEmpty() && deleteActionsHandler.isEmpty()) {
						console.log("All outstanding requests have been saved.  Notifying all listeners.");
						notifyAll("onAllSaved");
					}					
				},

				postActionsHandler = (function() {
					var unPostedResources = {},

				 	postResource = function(resourceURL, resourceObj, ajaxOptions) {					
						var pendingPost,
							retryCount,
							resourceID;

						/*if (!ajaxOptions) {
							console.error("no ajaxOptions provided to postResource!!!");
							return;
						}*/
						if (!resourceURL) {
							console.error("no resourceURL provided to postResource!!!");
							return;
						}						
						if (!resourceObj) {
							console.error("no resourceObj provided to postResource!!!");
							return;
						}

						ajaxOptions = ajaxOptions || {};
						resourceID = resourceURL + resourceObj.id;
						pendingPost = unPostedResources[resourceID];
						
						if (!pendingPost) {
							pendingPost = {
								retryCount : 0,
								numTimesFailed : 0,
								ajaxOptions: ajaxOptions
							};
							unPostedResources[resourceID] = pendingPost;
							console.log("created pending post; key = ", resourceID, ", pendingPost = ", pendingPost);

							$.extend(ajaxOptions, {
								url 		: 	resourceURL,
								type		: 	"POST",
								contentType : 	"application/json",
								data 		: 	JSON.stringify(resourceObj),
								dataType	: 	"json"/*,
								resourceID  : 	resourceID,
								resourceObj : 	resourceObj,
								// if want context to be the ajaxOptions, don't set context to 'this'
								//context		: 	this
								myQ 		: 	unPostedResources*/
							});

							notifyAll("onSaving");
							$.ajax(ajaxOptions).fail(handlePostError).done(onSuccess);
							
						} else {
							/*retryCount = pendingPost.retryCount;
							if (retryCount > 0) {
								handleRetry(resourceURL, pendingPost);
							}
							else { // retryCount == 0
								// this shouldn't happen; user has no option to manually retry requests
							}*/

							console.warn("Trying to resubmit a pending request, but retry initiated by UI; should not happen.  Ignoring it.");
							console.warn("resourceURL: ", resourceURL, " pending request: ", pendingPost);						
						}
					},	

					handlePostError = function(jqXHR, textStatus, errorThrown) {
						var resourceID,
							statusCode;
						log(jqXHR, textStatus, errorThrown);
						
						notifyAll("onError", "Unable to post data.");
						statusCode = jqXHR.statusCode();
						console.log("statusCode: ", statusCode);
						// 'this' should refer to the ajaxOptions of the original request
						if (statusCode >= 400 && statusCode < 500) {							
							console.log("error was not a server error so will not retry");
						}
						else {
							//requestRetry(JSON.parse(this.data).id, this.myQ);

							resourceID = this.url + JSON.parse(this.data).id;
							console.log("going to request a retry of post for resourceID: ", resourceID);
							requestRetry(resourceID, unPostedResources);						
						}
					};									
				
					return {
						"isEmpty"	: function() {
							return $.isEmptyObject(unPostedResources);
						},
						"handlePostError"	: 	handlePostError,
						"retryAll"			: 	function() {
							return retryAllRequestsInMap(unPostedResources, handlePostError);
						},
						"post"				:  	postResource,
						"onSuccess"			: 	function(ajaxOptions) {
							var postID;
							console.log("onSuccess called on post handler with param: ", ajaxOptions);
							postID = ajaxOptions.url + JSON.parse(ajaxOptions.data).id;
							delete unPostedResources[postID];
						}
					};
				})(),

				deleteActionsHandler = (function() {
					var unDeletedResources = {},

					deleteResource = function(resourceURL, ajaxOptions) {
						var resourceID = resourceURL,
							pendingDelete;

						if (!resourceURL) {
							console.error("no resourceURL provided to deleteResource!!!");
							return;
						}						

						ajaxOptions = ajaxOptions || {};
						pendingDelete = unDeletedResources[resourceID];	;
						if (!pendingDelete) {							
							pendingDelete = {
								retryCount : 0,
								numTimesFailed : 0,
								ajaxOptions: ajaxOptions
							};
							unDeletedResources[resourceID] = pendingDelete;
							console.log("created pending delete; key = ", resourceID, ", pendingPost = ", pendingDelete);

							
							$.extend(ajaxOptions, {
								url 		: 	resourceURL,
								type		: 	"POST",
								headers		: 	{
									"x-post-override"	: 	"DELETE"
								}/*,
								/*
								// want context to be the ajaxOptions so can't set 'this'
								context		: 	this

								myQ 		: 	unDeletedResources*/
							});			

							notifyAll("onSaving");						
							$.ajax(ajaxOptions).fail(handleDeleteError).done(onSuccess);

						} else {
							console.warn("Trying to resubmit a pending request, but retry initiated by UI; should not happen.  Ignoring it.");
							console.warn("resourceURL: ", resourceURL, " pending request: ", pendingPost);						
						}

					},	

					handleDeleteError = function(jqXHR, textStatus, errorThrown) {
						var resourceID,
							statusCode;
						log(jqXHR, textStatus, errorThrown);
						
						notifyAll("onError", "Unable to delete data.");

						statusCode = jqXHR.statusCode();			
						
						log("statusCode: ", jqXHR.statusCode());
						// 'this' should refer to the ajaxOptions of the original request
						if (statusCode >= 400 && statusCode < 500) {							
							console.log("error was not a server error so will not retry");
						}
						else {
							resourceID = this.url;
							console.log("going to request a retry of deletion for resourceID: ", resourceID);							
							requestRetry(resourceID, unDeletedResources);
						}
					};	
				
					return {
						"isEmpty"	: function() {
							return $.isEmptyObject(unDeletedResources);
						},
						"handleDeleteError"		: 	handleDeleteError,
						"retryAll"			: 	function() {
							return retryAllRequestsInMap(unDeletedResources, handleDeleteError);
						},
						"delete"				: 	deleteResource,
						"onSuccess"			: 	function(deleteID) {
							console.log("onSuccess called on delete handler with param: ", deleteID);
							delete unDeletedResources[deleteID];
						}												
					};
				})(),

				retryAllRequestsInMap = function(aMap, failHandler) {
					var pending,
						numRequestsRetried = 0;

					console.log("Beginning to retry all requests in : ", aMap, " using handler: ", failHandler);
					for (resourceID in aMap) {
						if (aMap.hasOwnProperty(resourceID)) {
							pending = aMap[resourceID];
							console.log("pending request: ", pending);
							if (pending.numTimesFailed > 0 && pending.retryCount <= MAX_NUM_RETRIES) {
								console.log("since this pending request has failed at least once and has not been retried <= ", MAX_NUM_RETRIES, " times.");
								$.ajax(pending.ajaxOptions).fail(failHandler).done(onSuccess);
								pending.retryCount += 1;
								++numRequestsRetried;
							}
							else if (pending.numTimesFailed <= 0) {
								console.log("not retrying this request since it has never failed (it's probably in progress right now.) ");
							}
							else {
								console.log("not retrying this request since it has been tried the max number of times. ");
							}
						}
					}
					return numRequestsRetried;
				},		

				resetRetryer = function() {
					retryCount = 0;
					retryTimeout = INIT_RETRY_INTERVAL;
				},		

				doRetry = function() {
					var totalNumRequestsRetried = 0;

					if (retryCount > MAX_NUM_RETRIES) {
						console.error("max number of retries exceeded; retryCount = ", retryCount);
						alert("Unfortunately we cannot save events or chapters at this time.  We are having technical difficulties (maybe the internet connection is down?) \n\nPlease try reloading the page.");
						resetRetryer();
					}
					else {
						/*totalNumRequestsRetried = retryAllRequestsInMap(unPostedResources, handlePostError);
						totalNumRequestsRetried = retryAllRequestsInMap(unDeletedResources, handleDeleteError);*/
						totalNumRequestsRetried = postActionsHandler.retryAll();
						console.log("number of post requests retried: ", totalNumRequestsRetried);
						totalNumRequestsRetried += deleteActionsHandler.retryAll();

						if (totalNumRequestsRetried == 0) {
							resetRetryer();
							console.log("no requests were retried, so there are no pending requests; resetting the retry logic to initial values.");
						}
						else {
							++retryCount;
							setTimeout(doRetry, retryTimeout);
							retryTimeout = retryTimeout * retryMultiplier;
							console.log(totalNumRequestsRetried, " requests were retried, so the doRetry function will be called again soon to see if any failed.");
						}
					}
				},

				requestRetry = function(resourceID, resourceMap) {
					var pendingResource = resourceMap[resourceID],
						retryCount;

					console.log("retry requested for pending request: ", pendingResource);
					retryCount = pendingResource.retryCount;
					console.log("retry count for pending request: ", retryCount);


					pendingResource.numTimesFailed++;

					if (retryCount <= MAX_NUM_RETRIES) {
						//pendingResource.retryCount++;
						console.log("pendingResource will be retried; resource = ", pendingResource);
						if (retryTimer != null) {
							console.log("There is already a retry timer set so no need to recreate it.");
						}
						else {
							console.log("There is no active retry time, so starting one now.");
							retryTimer = setTimeout(doRetry, INIT_RETRY_INTERVAL);
						}							
					}
					else {
						console.error("request: ", pendingResource, " has exceeded the max number of retries.  It will be discarded.");
						delete resourceMap[resourceID];
					}					
				};

				return {
					"postResource" : function(resourceURL, resourceObj, ajaxOptions) {
						postActionsHandler.post.call(postActionsHandler, resourceURL, resourceObj, ajaxOptions);
					},
					"deleteResource" : function(resourceURL, ajaxOptions) {
						deleteActionsHandler.delete.call(deleteActionsHandler, resourceURL, ajaxOptions)
					},
					"addListener" : function(aListener) {
						listeners.push(aListener);
					}
				};

		},

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
				/*syncer = makeSyncer(),
				chaptersSyncer = makeSyncer(),*/
				saveHelper = createSaveHelper(),
				syncer = makeSyncer(),
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

				/*successFunc = function (data, textStatus, jqXHR) {
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
				},*/

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
					/*$.ajax("/myStory/events/", {
						type		: 	"POST",
						//mimeType 	: 	"application/json",
						contentType : 	"application/json",
						data 		: 	JSON.stringify(eventToAdd),
						dataType	: 	"json", 
						success 	: 	successFunc,
						error 		: 	genericErrorFunc
					});*/

					//eventsSyncer.postResource("/myStory/events/", eventToAdd, {
					syncer.postResource("/myStory/events/", eventToAdd, {
						/*type		: 	"POST",
						//mimeType 	: 	"application/json",
						contentType : 	"application/json",
						data 		: 	JSON.stringify(eventToAdd),
						dataType	: 	"json", 
						//context		: 	this
						/*success 	: 	successFunc,
						error 		: 	genericErrorFunc*/
					});

					console.log("request sent.");
				},

				deleteEvent = function(eventID) {
					console.log("dao is deleting eventID: ", eventID);
					var eventURL = "/myStory/events/"+eventID;
					//deleteResource("/myStory/events/"+eventID);
					//eventsSyncer.deleteResource(eventURL);
					syncer.deleteResource(eventURL);
					console.log("request sent.");
				},

				addChapter = function(chapterEvent) {
					console.log("dao is adding chapter: ", chapterEvent);

					/*$.ajax("/myStory/events/", {
						type		: 	"POST",
						//mimeType 	: 	"application/json",
						contentType : 	"application/json",
						data 		: 	JSON.stringify(chapterEvent),
						dataType	: 	"json", 
						context		: 	this
						//success 	: 	successFunc,
						//error 		: 	genericErrorFunc
					});*/

					//chaptersSyncer.postResource("/myStory/events/", {
					syncer.postResource("/myStory/events/", chapterEvent, {
						//mimeType 	: 	"application/json",
						/*contentType : 	"application/json",
						data 		: 	JSON.stringify(chapterEvent),
						dataType	: 	"json", */
						//context		: 	this
						//success 	: 	successFunc,
						//error 		: 	genericErrorFunc
					});

					console.log("request sent.");
				},

				deleteChapter = function(chapterID) {
					console.log("dao is deleting chapterID: ", chapterID);									
					var chapterURL = "/myStory/chapters/"+chapterID;
					//deleteResource("/myStory/chapters/"+chapterID);
					//chaptersSyncer.deleteResource("chapterURL");
					syncer.deleteResource(chapterURL);
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
                						},
                "attachSaveHelper"	: 	function(appendTarget) {
                							if (appendTarget.length <= 0) {
                								appendTarget = $(appendTarget);
                							}
                							if (appendTarget.length > 0) {
                								saveHelper.attach(appendTarget);
                								syncer.addListener(saveHelper);
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
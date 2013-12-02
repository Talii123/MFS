var errorMsg = "Sandbox is not defined.  Timeline module will not be loaded.";

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

Sandbox.modules.timeline_view = function (app) {
	var DEFAULT_TIMELINE_CONTAINER_ID = "#my-timeline",
		DEFAULT_EVENT_DATA_URL = "events.json",
		DEFAULT_EVENT_SOURCE = "",// = new Timeline.DefaultEventSource(),
		DEFAULT_START_PROJ = new Date(),
		DEFAULT_END_PROJ = DEFAULT_START_PROJ,

		hasOwn = Object.prototype.hasOwnProperty,
		isEnhanced = false,

		getDefaultTheme = function(themeOptions) {
			var theme = Timeline.ClassicTheme.create(),
				options = themeOptions || {};

		    theme.autoWidth = false; // Set the Timeline's "width" automatically.
		    theme.autoWidthMargin = 10;
		    theme.event.bubble.width = 220;
		    theme.event.bubble.height = 120;
		    
		    theme.ether.backgroundColors = ["#E6E6E6", "#F7F7F7"];
		    
		    theme.timeline_start = options["startProj"] || DEFAULT_START_PROJ;
		    theme.timeline_stop = options["endProj"] || DEFAULT_END_PROJ;
		    
		    // theme.event.track.height = "20";
		    // theme.event.tape.height = 10; // px
		    // theme.event.track.height = theme.event.tape.height + 6;
		    
		    // for compact painting
		    theme.event.instant.icon = "no-image-40.png";
		    theme.event.instant.iconWidth = 40;  // These are for the default stand-alone icon
		    theme.event.instant.iconHeight = 40;

		    return theme;
		},

		isAbsoluteURL = function(url) {
			return url && url.indexOf("://") > 0;
		},

		getDomain = function(url) {
			return url && url.substr(0, url.indexOf("/", url.indexOf("://") + 3));
		},

        /* //original
        Timeline.DefaultEventSource.prototype._getBaseURL = function(url) {
		    if (url.indexOf("://") < 0) {
		        var url2 = this._getBaseURL(document.location.href);
		        if (url.substr(0,1) == "/") {
		            url = url2.substr(0, url2.indexOf("/", url2.indexOf("://") + 3)) + url;
		        } else {
		            url = url2 + url;
		        }
		    }
		    
		    var i = url.lastIndexOf("/");
		    if (i < 0) {
		        return "";
		    } else {
		        return url.substr(0, i+1);
		    }
		};*/
		// this new implementation will be added to the DefaultEventSource prototype in the enhanceXXX() function;
		// the function is defined here so that it will be available to the entire timeline library
		getBaseURL = function(url) {
			if (!url) return;

		    if (!isAbsoluteURL(url)) {
		        var url2 = getBaseURL(document.location.href);
		        if (url.substr(0,1) == "/") {	// url is "/...", so we need to remove the path component
		            url = getDomain(url2) + url;
		        } else {	// url is "..." so just concatenate the two
		            url = url2 + url;
		        }
		    }
		    
		    var i = url.lastIndexOf("/");
		    if (i < 0) {
		        return "";
		    } else {
		        return url.substr(0, i+1);
		    }
		},

		/* //original
		Timeline.DefaultEventSource.prototype._resolveRelativeURL = function(url, base) {
		    if (url == null || url == "") {
		        return url;
		    } else if (url.indexOf("://") > 0) {
		        return url;
		    } else if (url.substr(0,1) == "/") {
		        return base.substr(0, base.indexOf("/", base.indexOf("://") + 3)) + url;
		    } else {
		        return base + url;
		    }
		};*/
		// this new implementation will be added to the DefaultEventSource prototype in the enhanceXXX() function;
		// the function is defined here so that it will be available to the entire timeline library
		resolveRelativeURL = function(url, base) {
		    if (url == null || url == "" || isAbsoluteURL(url)) {
		    	return url;
		    } else if (url.substr(0,1) == "/") {
		    	return getDomain(base) + url;
		    } else {
		    	return base + url;
		    }
		},

		findEvent = function(aTimeline, anEventID) {
			var event;
			aTimeline.applyToBands(function() {	// 'this' is a band object
				if (!event) {
					event = this.getEventSource().getEvent(anEventID);
					return;
				}
			});

			if (!event) {
				console.error("Unable to find an event for ID ", anEventID, " so cannot center timeline around event specified.");
				return;
			}

			return event;			
		}

		centerOnDate = function (aTimeline, aGregorianDateTime) {
			aTimeline.getBand(0).setCenterVisibleDate(SimileAjax.DateTime.parseGregorianDateTime(aGregorianDateTime));
			return false;
		},

		centerOnEvent = function (aTimeline, anEventID) {
			var event;
			// aTimeline.applyToBands(function() {	// 'this' is a band object
			// 	if (!event) {
			// 		event = this.getEventSource().getEvent(anEventID);
			// 		return;
			// 	}
			// });

			// if (!event) {
			// 	console.error("Unable to find an event for ID ", anEventID, " so cannot center timeline around event specified.");
			// 	return;
			// }
			event = findEvent(aTimeline, anEventID);
			aTimeline.applyToBands(function() {
				this.setCenterVisibleDate(event.getStart());
			}, true);
		},

		makeUpdater = function makeUpdater(aTimeline) {
            var timeline = aTimeline,
				hideEvents = {}, //[],
				//highlightEvents = {},
				highlightedEvent,
				
				highlightIndex = 0,

				filterMatcher = function(evt) {
					var eventType = evt.getProperty("typeIndex");
					if (typeof eventType != "number") return true;
					
					return !hideEvents[eventType];
				},
				highlightMatcher = function(evt) {
					//return highlightEvents[evt.getID()];
					return (highlightedEvent === evt.getID()) ? highlightIndex++ : -1;
				},

				repaintEvents = function() {
					timeline.applyToBands(function () {
						this.getEventPainter().paint();
					});
				};

            timeline.applyToBands(function() {
            	var eventPainter = this.getEventPainter();

                eventPainter.setFilterMatcher(filterMatcher);
                eventPainter.setHighlightMatcher(highlightMatcher);
            });
			
			return {
				"show" : function(eventType) {
					hideEvents[eventType] = false;
					repaintEvents();
					//timeline.paint();
					//timeline.layout();
				},
				"hide" : function(eventType) {
					hideEvents[eventType] = true;							
					repaintEvents();
					//timeline.paint();
					//timeline.layout();
				},
				"highlight"	: function(eventID) {
					//highlightEvents[event.getID()] = highlightIndex++;
					highlightedEvent = eventID;
					repaintEvents();
					//timeline.paint();
				},
				"unhighlight" : function(eventID) {
					//delete highlightEvents[event.getID()];
					if (eventID === highlightedEvent) highlightedEvent = null;
					repaintEvents();					
					// timeline.paint();
				}
			};
		}, 

		makeTimelineController = function makeUpdater(aTimeline) {
            var timeline = aTimeline,
				hideEvents = {}, //[],
				//highlightEvents = {},
				highlightedEvent,
				
				highlightIndex = 0,

				filterMatcher = function(evt) {
					var eventType = evt.getProperty("typeIndex");
					if (typeof eventType != "number") return true;
					
					return !hideEvents[eventType];
				},
				highlightMatcher = function(evt) {
					//return highlightEvents[evt.getID()];
					return (highlightedEvent === evt.getID()) ? highlightIndex++ : -1;
				},

				repaintEvents = function() {
					timeline.applyToBands(function () {
						this.getEventPainter().paint();
					});
				};

            timeline.applyToBands(function() {
            	var eventPainter = this.getEventPainter();

                eventPainter.setFilterMatcher(filterMatcher);
                eventPainter.setHighlightMatcher(highlightMatcher);
            });
			
			return {
				"show" : function(eventType) {
					hideEvents[eventType] = false;
					repaintEvents();
					//timeline.paint();
					//timeline.layout();
				},
				"hide" : function(eventType) {
					hideEvents[eventType] = true;							
					repaintEvents();
					//timeline.paint();
					//timeline.layout();
				},
				"highlight"	: function(eventID) {
					//highlightEvents[event.getID()] = highlightIndex++;
					highlightedEvent = eventID;
					repaintEvents();
					//timeline.paint();
				},
				"unhighlight" : function(eventID) {
					//delete highlightEvents[event.getID()];
					if (eventID === highlightedEvent) highlightedEvent = null;
					repaintEvents();					
					// timeline.paint();
				}
			};
		}, 

        enhanceTimelineLibrary = function () {
        	//var validDecorators = ["Timeline.SpanHighlightDecorator", "Timeline.PointHighlightDecorator"];

			Timeline.DefaultEventSource.prototype._getBaseURL = getBaseURL;
			Timeline.DefaultEventSource.prototype._resolveRelativeURL = resolveRelativeURL;

			Timeline.DefaultEventSource.Event.prototype.fillDescription = function(element) {
				element.innerHTML = (this._description || "").replace(/\\n/g, "<br/>");
			}

			// library way of doing this is to just assign the last colour but I wanted to experiment with some variety
			Timeline.OriginalEventPainter.prototype._getHighlightColor = function(highlightIndex, theme) {
			    var highlightColors = theme.event.highlightColors;    
			    // assert highlightIndex >= 0
			    return highlightColors[highlightIndex % (highlightColors.length - 1)];
			};

		

			Timeline._Band.prototype.addDecorator = function (aDecorator) {
				if (!aDecorator /*|| !validDecorators[typeof aDecorator]*/) {
					console.error("Attempted to add invalid decorator.");
					return;
				}

			    this._decorators.push(aDecorator);
			    aDecorator.initialize(this, this._timeline);
			}			


            // replaced use of "eval" in original with JSON.parse(); eval is evil and less secure            
            // NOTE: JSON.parse is very strict!!!  JSON can't have comments, extra commas at the end of an array or object
            Timeline._Impl.prototype.loadJSON = function(url, f) {
			    var tl = this;	// need to maintain reference to "this" for later as the callbacks will be called
			    				// asynchronously, in a different context where "this" will mean something else
			    
			    var successHandler = function(data, textStatus, jqXHR) {
			    	try {
			    		f(data, url);
			    	} finally {
			    		tl.hideLoadingMessage();
			    	}
			    };

			    var errorHandler = function(jqXHR, textStatus, errorThrown) {
			    	console.error("Failed to load json data from ", url, "\n", textStatus);
			    	tl.hideLoadingMessage();
			    }
			    
			    this.showLoadingMessage();
			    	//SimileAjax.XmlHttp.get(url, fError, fDone); 

		    	$.ajax({
					url: 		url,
					dataType: 	'json',
					//data: 		data,
					success: 	successHandler,
					error: 		errorHandler
				});


			};

            // augment Timelines so that there is a simple method for applying a function to each band
            Timeline._Impl.prototype.applyToBands = function (method, isSynchedBandSkipped) {
                var numBands = this.getBandCount(),
                    band,
                    bandInfos,
                    syncWith,
                    i,
                    isSkipped = {};

                if (typeof method !== 'function') {
                	console.error("Method not supplied or is not a function, so there is nothing to apply to the bands.");
                	return;
                }

                if (isSynchedBandSkipped) {
                	bandInfos = this._bandInfos;
                	for (i = 0; i < numBands; ++i) {
                		syncWith = bandInfos[i].syncWith;
                		if (typeof syncWith === 'number') {
                			isSkipped[i] = true;
                		}
                	}
                }
                
                for (i = 0; i < numBands; ++i) {
                	if (!isSkipped[i]) {
                    	console.log("Applying method to band: ", i);
                        method.apply(this.getBand(i));
                    }
                    else {
                    	console.log("Skipping applying method to band", i, " cuz it's synched with another band; don't need to apply to EVERY band.");
                    	console.trace();
                    }
                }                	                
            }        
        }, 

        createEventInfoUpdater = function(containersSelector) {
            var eventInfoTemplates = [
                    "#diagnosisDetailsTemplate",
                    "#surgeryDetailsTemplate",
                    "#chemoDetailsTemplate", 
                    "#radiationDetailsTemplate",
                    "#immunoDetailsTemplate",
                    "#testDetailsTemplate"
                    
                ],
                eventTypeContentContainers = $(containersSelector).get(),
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
                addEvent = function(event) {
                    var eventTypeIndex,
                        eventTypeTemplate;

                    console.log("adding event: ", event);

                    eventTypeIndex = event.getProperty("typeIndex");// - 1;
                    //$("#dummyTemplate").tmpl(event).appendTo($(".eventTypeContent").eq(event.getProperty("typeIndex")-1));
                    eventTypeTemplate = eventInfoTemplates[eventTypeIndex] || "#notImplementedTemplate";
                    
                    // this works but I'm trying to optimize
                    //$(eventTypeTemplate).tmpl(event).appendTo($(".eventTypeContent").eq(eventTypeIndex).find("ul"));
                    
                    // optimized?
                    $(eventTypeTemplate).tmpl($.extend(event, {
                    	"getDebugJSON" 	: 	function(anObj) {                    			
                    		return (anObj !== undefined) ? JSON.stringify(anObj) : JSON.stringify(this);
                    	},
                    	"getProperty"	: 	function(aPropertyName) {
                    		var details = this._obj.typeDetails;
                    		return details && details[aPropertyName];
                    	}
                    	})).appendTo(eventTypeContentContainers[eventTypeIndex]);

                    //$(eventTypeTemplate).tmpl(event, {"getPatientDescription" : function() {return this.data.getProperty("pDescription").replace(/\n/g, "<br/>")}}).appendTo(eventTypeContentContainers[eventTypeIndex]);

                    //$("#dummyTemplate").tmpl(event).appendTo($(".eventTypeContent").filter("."+event.getProperty("type")));
                    //$("#chemoDetailsTemplate2").tmpl(event).appendTo(eventTypeContentContainers[eventTypeIndex]);
                };

            return {
                "addEvent"      :       addEvent,
                "addEvents"     :       addEvents,
                "onAddOne"      :       addEvents,  // for some reason, eventSource was written to retutn the single event as an array :(
                "onAddMany"     :       addEvents
            };
        },

        // TODO: Tal, make this pretty!
        updateEventTypeVis = function updateEventTypeVis(aRadioButton){
            var eventTypeIndex = $(".eventTypeContent").index($(aRadioButton).parents(".eventTypeContent"));
            if (aRadioButton && aRadioButton.value == "show") {
                //Timeline.Cancer.updater.show(aCheckbox.id); // should probably set ID to be {something}_i instead of i
                updater.show(eventTypeIndex);
            }
            else {
                //Timeline.Cancer.updater.hide(aCheckbox.id);
                updater.hide(eventTypeIndex);
            }
        };


	//enhanceTimelineLibrary();

	//app.enhanceTimelineLibrary = enhanceTimelineLibrary;
	app.getDefaultTheme = getDefaultTheme;
	app.isAbsoluteURL = isAbsoluteURL;
	app.getDomain = getDomain;
	app.centerOnDate = centerOnDate;
	app.centerOnEvent = centerOnEvent;
	app.makeUpdater = makeUpdater;
	app.createEventInfoUpdater = createEventInfoUpdater;
	app.makeTimelineController = makeTimelineController;
	app.updateEventTypeVis = updateEventTypeVis;

	app.createTimeline = function (timelineConfig) {
		var config = timelineConfig || {},
			tl,
			updater,
			// optional, but needs to be defined before bandInfos
			eventSource = config["eventSource"] || DEFAULT_EVENT_SOURCE,
            startProj = config["startProj"] || DEFAULT_START_PROJ,
            endProj = config["endProj"] || DEFAULT_END_PROJ,
            theme = config["theme"] || getDefaultTheme({	// Timeline Impl Object uses the theme's startProj and endProj as it's own
            	"startProj"	: 	startProj,
            	"endProj"	: 	endProj
            }),

	        // required!
	        bandInfos = config["bandInfos"],
	        timelineContainerID = config["timelineContainerID"] || DEFAULT_TIMELINE_CONTAINER_ID,
	        eventDataURL = config["eventDataURL"] || DEFAULT_EVENT_DATA_URL;
	    
	    if (!isEnhanced) {
	    	//app.enhanceTimelineLibrary();
	    	enhanceTimelineLibrary();
	    	isEnhanced = true;
	    }
	    
	    // apply my theme to bandinfos?
	    bandInfos[0].theme = bandInfos[1].theme = theme;

	    tl = Timeline.create($(timelineContainerID)[0], bandInfos);	    

	    // moved to timeline-edit module
	    //tl.augmentListeners();

	    /*tl.loadJSON(eventDataURL, function(data, url){
	    	// this only works when delivered from a server; when using a file URI, the path to the project gets cleared out
	    	// need a more robust solution
	        //eventSource.loadJSON(data, "/images/");
	        eventSource.loadJSON(data, url);
	    });

	    tl.layout();*/

	    return tl;  
	}

}


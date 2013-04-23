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

Sandbox.modules.timeline = function (app) {
	var DEFAULT_TIMELINE_CONTAINER_ID = "#my-timeline",
		DEFAULT_EVENT_DATA_URL = "events.json",
		DEFAULT_EVENT_SOURCE = new Timeline.DefaultEventSource(),
		DEFAULT_START_PROJ = new Date(),
		DEFAULT_END_PROJ = DEFAULT_START_PROJ,

		hasOwn = Object.prototype.hasOwnProperty,

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

        enhanceTimelineLibrary = function () {
            // enhance Simile library?
            SimileAjax.EventIndex.prototype.remove = function (evt) {
                this._events.remove(evt);
                delete this._idToEvent[evt.getID()];
                this._indexed = false;
            };

			Timeline.DefaultEventSource.prototype._getBaseURL = getBaseURL;
			Timeline.DefaultEventSource.prototype._resolveRelativeURL = resolveRelativeURL;

            Timeline.DefaultEventSource.prototype.convertToTimelineEvent = function (event, url, data) {
	            var timelineEvent,
	            	instant,
	                parseDateTimeFunction,
	                url = url || "events.json",
	                data = data || {},

	                base = this._getBaseURL(url),

			        /*wikiURL = ("wikiURL" in data) ? data.wikiURL : null;
			        wikiSection = ("wikiSection" in data) ? data.wikiSection : null;*/
			    
			        dateTimeFormat = ("dateTimeFormat" in data) ? data.dateTimeFormat : "Gregorian",
			        parseDateTimeFunction = this._events.getUnit().getParser(dateTimeFormat);


				instant = event.isDuration || (event.durationEvent != null && !event.durationEvent);

	            timelineEvent = new Timeline.DefaultEventSource.Event({
	                          id: ("id" in event) ? event.id : undefined,
	                       start: parseDateTimeFunction(event.start),
	                         end: parseDateTimeFunction(event.end),
	                 latestStart: parseDateTimeFunction(event.latestStart),
	                 earliestEnd: parseDateTimeFunction(event.earliestEnd),
	                     instant: instant,
	                        text: event.title,
	                 description: event.description,
	                       image: this._resolveRelativeURL(event.image, base),
	                        link: this._resolveRelativeURL(event.link , base),
	                        icon: this._resolveRelativeURL(event.icon , base),
	                       color: event.color,                                      
	                   textColor: event.textColor,
	                   hoverText: event.hoverText,
	                   classname: event.classname,
	                   tapeImage: event.tapeImage,
	                  tapeRepeat: event.tapeRepeat,
	                     caption: event.caption,
	                     eventID: event.eventID,
	                    trackNum: event.trackNum
	            });
	            timelineEvent._obj = event;
	            timelineEvent.getProperty = function(name) {
	                return this._obj[name];
	            };
	            /*timelineEvent.setWikiInfo(wikiURL, wikiSection); */

	            return timelineEvent;           	
            }

            Timeline.DefaultEventSource.prototype.deleteEvent = function (evtID) {
                var evt = this._events.getEvent(evtID);
                this._events.remove(evt);   // calls remove() on EventIndex, which inherits a remove() method from SimileAjax.EventIndex.prototype
                this._fire("onDelete", [evt]);
            };

            Timeline.DefaultEventSource.prototype.updateEvent = function (updatedEventSpec) {
                var updatedEvent,
                	existingEvent,
                	existingEventID,
                	onUpdateChangeObj;

                /*var existingEventID = updatedEvent.id,
                    existingEvent = this._events.getEvent(existingEventID); ,
                    

                updatedEvent.start = parseDateTimeFunction(updatedEvent.start);
                updatedEvent.end = parseDateTimeFunction(updatedEvent.end);
                */

                /*var existingEventID = updatedEvent.getID(),
                    existingEvent = this._events.getEvent(existingEventID);*/

				parseDateTimeFunction = this._events.getUnit().getParser("Gregorian"/*dateTimeFormat*/);

                // updatedEvent is not an actual event object, it's a pojo w key event properties so make it into an event the same way that it happens in eventSource.loadJSON()
                updatedEvent = //new Timeline.DefaultEventSource.Event(updatedEventSpec);
                	this.convertToTimelineEvent(updatedEventSpec);
                updatedEvent._obj = updatedEventSpec;
                updatedEvent.getProperty = function (propertyName) {
                	return this._obj[propertyName];
                }
                console.log("updatedEvent is now: ", updatedEvent);

				existingEventID = updatedEvent.getID();
                existingEvent = this._events.getEvent(existingEventID);
                if (!existingEvent) {
                    console.error("Unable to find an existing event with ID: ", existingEventID);
                    return;
                }

                /*$.each(updatedEvent, function (index, value) {
                    console.log("index: ", index, ", value: ", value);
                    if (hasOwn.apply(updatedEvent, [index])) {
                        existingEvent["_" + index] = value;
                        existingEvent._obj[index] = value;
                    } else {
                        console.log("ignoring it.");
                    }
                });*/

				this._events.remove(existingEvent);
				this._events.add(updatedEvent);

				onUpdateChangeObj = {
                	"before"	: 	existingEvent,
                	"after"		: 	updatedEvent
                };

                console.log("onUpdateChangeObj.. ");
                console.dir(onUpdateChangeObj);
                this._fire("onUpdate", [onUpdateChangeObj]);


                /*console.log("Existing event is now: ", existingEvent);
                console.log("after lookup it's now: ", this._events.getEvent(existingEventID));*/
            };

            // replaced use of "eval" in original with JSON.parse(); eval is evil and less secure            
            // NOTE: JSON.parse is very strict!!!  JSON can't have comments, extra commas at the end of an array or object
            Timeline._Impl.prototype.loadJSON = function(url, f) {
			    var tl = this;	// need to maintain reference to "this" for later as the callbacks will be called
			    				// asynchronously, in a different context where "this" will mean something else
			    
			    var fError = function(statusText, status, xmlhttp) {
			        alert("Failed to load json data from " + url + "\n" + statusText);
			        tl.hideLoadingMessage();
			    };
			    var fDone = function(xmlhttp) {
			    	var jsonData;

			    	//console.log("response: \n", xmlhttp.responseText);
			        try {
			        	jsonData = JSON.parse(xmlhttp.responseText);
			            //f(eval('(' + xmlhttp.responseText + ')'), url);
			            f(jsonData, url);
			        } finally {
			            tl.hideLoadingMessage();
			        }
			    };
			    
			    this.showLoadingMessage();
			    window.setTimeout(function() { SimileAjax.XmlHttp.get(url, fError, fDone); }, 0);
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
                    	console.log("Skipping applying method to band cuz it's synched with another band; don't need to apply to EVERY band.");
                    }
                }                	                
            }

            Timeline._Impl.prototype.augmentListeners = (function () {
            	var onDeleteHandler = function() {
		                console.log("onDelete called on band: ", this.band);
		                this.band._onDelete();
		            },
		            onUpdateHandler = function() {
		                console.log("onUpdate called on band: ", this.band);
		                this.band._onUpdate();
		            };

            	return function () {
		        	this.applyToBands(function() {
			            var eventListener;  // the per-band listener object; each band has a separate listener registered with the eventSource			                

			            // augment each band's listener object with the ability to react to
			            // delete and edit events
			            if (this._eventListener) {
							eventListener = this._eventListener;
			            } else { // probably should never happen
			                eventListener = {};
			                this._eventSource.addListener(eventListener);
			            }

			            eventListener.band = this;
			            eventListener.onDelete = onDeleteHandler;
			            eventListener.onUpdate = onUpdateHandler;
			        });            		
            	}
        	})();

            Timeline._Band.prototype._onDelete = function() {
                this._paintEvents();
            };  

            Timeline._Band.prototype._onUpdate = function() {
                this._paintEvents();
            };              
        };


	enhanceTimelineLibrary();

	app.getDefaultTheme = getDefaultTheme;
	app.isAbsoluteURL = isAbsoluteURL;
	app.getDomain = getDomain;
	app.centerOnDate = centerOnDate;
	app.centerOnEvent = centerOnEvent;

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
	    
	    
	    // apply my theme to bandinfos?
	    bandInfos[0].theme = bandInfos[1].theme = theme;

	    tl = Timeline.create($(timelineContainerID)[0], bandInfos);	    

	    tl.augmentListeners();

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


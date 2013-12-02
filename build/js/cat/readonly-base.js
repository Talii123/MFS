var noop = function() {;};

var console = {
	"log"		: 		noop,
	"error"		: 		noop,
	"trace"		: 		noop,
	"profile"	: 		noop,
	"warn"		: 		noop,
	"dir"		: 		noop
};
/**
 * @author Talii
 */
/*==================================================
 *  Cancer Event Source
 *==================================================
 *
 * @Todo
 * This class should inherit from Default Event Source and just override
 * event creation so that events can be inflated based on their type
 */
Timeline.CancerEventSource = function(eventIndex){
	var that = new Timeline.DefaultEventSource(eventIndex);
	// override default event source's data loading methods with our own
	that.loadJSON = Timeline.CancerEventSource.prototype.loadJSON;
	return that;
};

Timeline.CancerEventSource.prototype.getIconURLForEventType = function(event) {
    var eventType = event.type,
        iconURL;
    console.log("eventType: ", eventType);
    switch (eventType) {
        case "DIAGNOSIS" : 
            iconURL = "diagnosis_40_40.jpg";
            break;
        case "SURGERY" :
            iconURL = "surgery_40_40.jpg";
            break;
        case "CHEMO" :
            iconURL = "chemo_40_40.jpg";
            break;
        case "RADIATION" : 
            iconURL = "radiation_40_40.jpg";
            break;
        case "IMMUNO" :
            iconURL = "immuno_40_40.jpg";
            break;
        case "TEST" :
            var testType = (event.typeDetails != null) ? event.typeDetails.testType : "default";
            switch (testType) {
                case "CT_SCAN" :
                    iconURL = "ctscan_40_40.jpg";
                    break;
                case "MRI" :
                    iconURL = "mri_40_40.jpg";
                    break;
                case "ULTRASOUND" :
                    iconURL = "ultrasound_40_40.jpg";
                    break;
                default:
                    console.log("Unknown test type: ", testType);
                    break;
            }
            break;
        default:
            iconURL = "";
            break;
    } 
    console.log("iconURL: ", iconURL);
    return iconURL;   
}

Timeline.CancerEventSource.prototype.loadJSON = function(data, url){
    var base = this._getBaseURL(url),
        addedEvents = [];
    //var added = false;
	
	// my vars
	var eventType;
	var painterConfig;
	
    if (data && data.events) {
        var wikiURL = ("wikiURL" in data) ? data.wikiURL : null;
        var wikiSection = ("wikiSection" in data) ? data.wikiSection : null;
        
        var dateTimeFormat = ("dateTimeFormat" in data) ? data.dateTimeFormat : null;
        var parseDateTimeFunction = this._events.getUnit().getParser(dateTimeFormat);

        
        for (var i = 0; i < data.events.length; i++) {
            var event = data.events[i];
            // Fixing issue 33:
            // instant event: default (for JSON only) is false. Or use values from isDuration or durationEvent
            // isDuration was negated (see issue 33, so keep that interpretation
            var instant = event.isDuration || (event.durationEvent != null && !event.durationEvent);
 
 			// if event has a "type" and it's NOT overriding the default values for icon, color and textcolor that are
			// defined for its type, then copy these values from the configuration into the event object so that they
			// will become part of the new "Event" object created below
			// NOTE: even if event types are used, the 
 			/*eventType = event.getProperty("type");
			if (eventType) { // note: events (even cancer events) are NOT required to have an event type
				painterConfig = Timeline.CancerEventSource.painterConfigs[eventType];
				if (painterConfig) {
					if (!event.icon) event.icon = this._resolveRelativeURL(painterConfig["icon"], base);
					if (!event.color) event.color = painterConfig["color"];
					if (!event.textColor) event.textColor = painterConfig["textColor"];
				}
			}*/
            
            var oldIcon = this._resolveRelativeURL(event.icon, base);
            console.log("oldIcon: ", oldIcon);

            var newIcon = "/images/" + Timeline.CancerEventSource.prototype.getIconURLForEventType(event);
            console.log("newIcon: ", newIcon);

           // var evt = new Timeline.CancerEventSource.Event({
		   	var evt = new Timeline.DefaultEventSource.Event({
                id: ("id" in event) ? event.id : undefined,
                start: parseDateTimeFunction(event.start),
                end: parseDateTimeFunction(event.end),
                latestStart: parseDateTimeFunction(event.latestStart),
                earliestEnd: parseDateTimeFunction(event.earliestEnd),
                instant: instant,
                text: event.title,
                description: event.description,
                image: this._resolveRelativeURL(event.image, base),
                link: this._resolveRelativeURL(event.link, base),
                //icon: this._resolveRelativeURL(event.icon, base),
                icon: newIcon,
				//icon: this._resolveRelativeURL("dark-red-circle.png", base),
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
			

            evt._obj = event;
            evt.getProperty = function(name){
                return this._obj[name];
            };
            evt.setWikiInfo(wikiURL, wikiSection);
            
            this._events.add(evt);
            /*  original code in Timeline library
            added = true;
            */
            addedEvents.push(evt);
        }
    }
    
    /*  original code in Timeline library
    if (added) {
        this._fire("onAddMany", []);
    }*/

    if (addedEvents.length > 0) {
        console.log("firing the 'onAddMany' event with: ", addedEvents);      
        // we need to wrap all arguments to the "onAddMany" handler in an array so that function.apply() will work,
        // so wrap the "addedEvents" array in an array
        this._fire("onAddMany", [addedEvents]);
    }
};
  
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

Sandbox.modules.common = function (app) {

	var removeEmail = function removeEmail(event, ui) {
	        $(".email", this).remove();
	    },
	    getEmailHTML = function getEmailHTML() {
	        return "<div class='email'><a href='mailto:TallFry"+"@facebook.com'>TallFry"+"@facebook.com</a></div>";
	    };

    // from jQuery website
    $.prefetchCachedScript = function(url, options) {
        // allow user to set any option except for dataType, cache, and url
            options = $.extend(options || {}, {
                dataType: "text",   // prevent script from running
                cache: true,
                url: url
            });
            // Use $.ajax() since it is more flexible than $.getScript
            // Return the jqXHR object so we can chain callbacks
            return jQuery.ajax(options);
    };        

    app.initThemer = function initThemer() {
        var currentTheme = $(document).data("theme"),
            $themeSelector = $("#themeSelector"),
            selectedIndex = $("option[value='"+currentTheme+"']", $themeSelector).index(),

        // handle case where the default selection is explicitly chosen via the URL
        selectedIndex = selectedIndex >= 0 ? selectedIndex : 0;
        $themeSelector
            .prop("selectedIndex", selectedIndex)
            .change(function(event) {
                themer.setTheme(this.options[this.selectedIndex].value);
            });
    };

    app.getEmailHTML = getEmailHTML;

    app.removeEmail = removeEmail;

    app.clipText = function(value, numKeep) {
        console.log("\n\n\n\n\nvalue: ", value, "\n\n\n\n\n");
        return (value.length > numKeep) ? value = value.substring(0, numKeep) + "..." : value;
    };

    app.createCounter = function createCounter() {
        var count = 0;

        return {
            "nextInt" : function () {
                return ++count;
            },
            "init" : function (aCount) {
                if (typeof aCount === 'number' && aCount > 0) {
                    count = aCount;
                }
            }
        }
    };

    app.setupDialogs = function setupDialogs(defaults) {
        $(".dialog").dialog(defaults);

        $("#designedByDialog").bind("dialogbeforeclose", removeEmail);
        $("#designedByDialog").dialog({
            open:   function() {
                        $("#designedByDialog").append($(getEmailHTML()).prepend("email: "));
                    }
        });

        $(".menu").click(function($event) {
            var dialogToOpen = $event.target.id;
            $("#" + dialogToOpen + "Dialog").dialog("open");
        });
    };
    
    app.getResizer = function (tl){
    	var resizeTimerID = null;
    	
    	return function () {
	        console.log("onResize()");
	        if (resizeTimerID == null) {
	            resizeTimerID = window.setTimeout(function(){
	                resizeTimerID = null;
	                tl.layout();
	            }, 500);
	        }    		
    	}
    };    

   app.doPreFetch = function(scriptURLs) {
        var numScripts,
            i,
            scriptURL;

      /*  
      $.ajax("/images/bubble-top-left.png");
        $.ajax("/images/bubble-top-right.png");
        $.ajax("/images/bubble-bottom-left.png");
        $.ajax("/images/bubble-bottom-right.png");
        $.ajax("/images/bubble-left.png");
        $.ajax("/images/bubble-right.png");
        $.ajax("/images/bubble-top.png");
        $.ajax("/images/bubble-bottom.png");
        $.ajax("/images/close-button.png");
        $.ajax("/images/bubble-arrow-point-right.png");
        $.ajax("/images/bubble-arrow-point-left.png");
        $.ajax("/images/bubble-arrow-point-up.png");
        $.ajax("/images/bubble-arrow-point-down.png");  
        */

        /*

            This worked better than the above - images were returned, but still NOT cached!! :(
                */

        //console.log("\n\n\n\ninserting images...\n\n\n");


        numScripts = scriptURLs.length;
        for (i=0; i < numScripts; ++i) {
            scriptURL = scriptURLs[i];
            console.log("going to try to prefetch url: ", scriptURL);
            $.prefetchCachedScript(scriptURL);
            console.log("request sent");
        }


        $("<div style='display:none'>" +
            "<img src='/images/bubble-top-left.png'/>" +
            "<img src='/images/bubble-top-right.png'/>" +
            "<img src='/images/bubble-bottom-left.png'/>" +
            "<img src='/images/bubble-bottom-right.png'/>" +
            "<img src='/images/bubble-left.png'/>" +
            "<img src='/images/bubble-right.png'/>" +
            "<img src='/images/bubble-top.png'/>" +
            "<img src='/images/bubble-bottom.png'/>" +
            "<img src='/images/close-button.png'/>" +
            "<img src='/images/bubble-arrow-point-right.png'/>" +
            "<img src='/images/bubble-arrow-point-left.png'/>" +
            "<img src='/images/bubble-arrow-point-up.png'/>" +
            "<img src='/images/bubble-arrow-point-down.png'/>" +                                                
          "</div>").appendTo("head");
   }; 
}
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
					//var eventType = evt.getProperty("typeIndex");
					var eventType = +evt._obj.typeIndex;
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

/*		makeTimelineController = function makeUpdater(aTimeline) {
            var timeline = aTimeline,
				hideEvents = {}, //[],
				//highlightEvents = {},
				highlightedEvent,
				
				highlightIndex = 0,

				filterMatcher = function(evt) {
					//var eventType = evt.getProperty("typeIndex");
					var eventType = +evt._obj.typeIndex;
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
		}, */

        enhanceTimelineLibrary = function () {
        	//var validDecorators = ["Timeline.SpanHighlightDecorator", "Timeline.PointHighlightDecorator"];

        	/*
				Timeline.CompactEventPainter.prototype._paintEventIcon = function(commonData, iconData, top, left, metrics, theme) {
				    var img = SimileAjax.Graphics.createTranslucentImage(iconData.url);
				    var iconDiv = this._timeline.getDocument().createElement("div");
				    iconDiv.className = 'timeline-event-icon' + ("className" in iconData ? (" " + iconData.className) : "");
				    iconDiv.style.left = left + "px";
				    iconDiv.style.top = top + "px";
				    iconDiv.appendChild(img);
				    
				    if ("tooltip" in commonData && typeof commonData.tooltip == "string") {
				        iconDiv.title = commonData.tooltip;
				    }
				    
				    this._eventLayer.appendChild(iconDiv);
				    
				    return {
				        left:   left,
				        top:    top,
				        width:  metrics.iconWidth,
				        height: metrics.iconHeight,
				        elmt:   iconDiv
				    };
				};
        	*/

        	Timeline.EventUtils = $.extend(Timeline.EventUtils, (function() {
        		var counter = app.createCounter();
        		return {
        			// overwrite existing definition for this method
					"getNewEventID" : function () {
                    	// almost impossible for two clients to be trying to add an event to the same timeline at the same time
                   		var eventID = "e" + counter.nextInt()+ "_" + new Date().getTime();
						console.log("assigning eventID: ", eventID);
						return eventID;
					},
					// add this method so that we can set the count based on existing events
					"counterInit"	: function (aCount) {
						console.log("initializing counter to: ", aCount);
						counter.init(aCount);
					}
        		};
        	})());

			Timeline.CompactEventPainter.prototype._paintEventIcon = function(commonData, iconData, top, left, metrics, theme) {
			    //var img = SimileAjax.Graphics.createTranslucentImage(iconData.url);
			    var iconDiv = this._timeline.getDocument().createElement("div"),
			    	url,
			    	spriteClass,
			    	beginIndex,
			    	endIndex;
			    iconDiv.className = 'timeline-event-icon' + ("className" in iconData ? (" " + iconData.className) : "");
			    iconDiv.style.left = left + "px";
			    iconDiv.style.top = top + "px";
			    //iconDiv.appendChild(img);

			    //console.log("\n\n\n\n");
			    url = iconData.url;
			    //console.log("url: ", url);
			    beginIndex = url.lastIndexOf("/");
			    endIndex = url.lastIndexOf(".");
			    //console.log("beginIndex: ", beginIndex, ", endIndex: ", endIndex);
			    spriteClass = url.substring(beginIndex+1, endIndex);
			    console.log("spriteClass: ", spriteClass)
			    //console.log("\n\n\n\n");
			    iconDiv.className += " sprite-" + spriteClass;

			    
			    if ("tooltip" in commonData && typeof commonData.tooltip == "string") {
			        iconDiv.title = commonData.tooltip;
			    }
			    
			    this._eventLayer.appendChild(iconDiv);
			    
			    return {
			        left:   left,
			        top:    top,
			        width:  metrics.iconWidth,
			        height: metrics.iconHeight,
			        elmt:   iconDiv
			    };
			};



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
                    console.log("applying template: ", eventTypeTemplate, " to event: ", event, " and appending it to container: ",  eventTypeContentContainers[eventTypeIndex]);
                    // this works but I'm trying to optimize
                    //$(eventTypeTemplate).tmpl(event).appendTo($(".eventTypeContent").eq(eventTypeIndex).find("ul"));
                    
                    // optimized?
                    $(eventTypeTemplate).tmpl($.extend(event, {
                    	"getDebugJSON" 	: 	function(anObj) {                    			
                    		return (anObj !== undefined) ? JSON.stringify(anObj) : JSON.stringify(this);
                    	},
                    	"getProperty"	: 	function(aPropertyName) {
                    		var details = this._obj.typeDetails,
                    			prop = details && details[aPropertyName];
                    		if (aPropertyName === "result") {
                    			prop = this.formatResult(prop);
                    		}
                    		else {
	                    		if (typeof prop === "boolean") {
	                    			prop = prop ? "YES" : "NO";
	                    		}
	                    		else if (prop === "true") {
	                    			prop = "YES";
	                    		}
	                    		else if (prop === "false") {
	                    			prop = "NO";
	                    		}                    			
                    		}


                    		return prop;
                    	},
                    	"hasProperty"	: 	function(aPropertyName) {
                    		var details = this._obj.typeDetails;
                    		return details && hasOwn.call(details, aPropertyName);
                    	},
                    	"formatResult" 	: 	function(aResult) {
                    		// TODO: all of these are taken from text embedded in templates;
                    		// that text should be externalized
                    		switch(aResult) {
                    			case "CR" : 
                    				aResult = "Remission - no sign of cancer after the treatment";
                    				break;
                    			case "PR1" : 
                    				aResult = "Some spots got smaller, others stayed the same";
                    				break;
                    			case "PR2" : 
                    				aResult = "Some spots got smaller, but others got bigger";
                    				break;
                    			case "SD" : 
                    				aResult = "All spots stayed the same or got worse";
                    				break;
                    			case "PD" : 
                    				aResult = "No Change";
                    				break;   
                    			case "DK" : 
                    				aResult = "Not sure";
                    				break; 
                    			case "ALL" :
                    				aResult = "All of the cancer was removed.";
                    				break;
                    			case "SOME" :
                    				aResult = "Some of the cancer was removed.";
                    				break;
                    			case "NONE" :
                    				aResult = "None of the cancer was removed.";
                    				break;                    				                    				
                    			default: 
                    				console.warn("unknown 'result': ", aResult);
                    		}
                    		return aResult;
                    	}
                    })).appendTo(eventTypeContentContainers[eventTypeIndex]);

                    //$(eventTypeTemplate).tmpl(event, {"getPatientDescription" : function() {return this.data.getProperty("pDescription").replace(/\n/g, "<br/>")}}).appendTo(eventTypeContentContainers[eventTypeIndex]);

                    //$("#dummyTemplate").tmpl(event).appendTo($(".eventTypeContent").filter("."+event.getProperty("type")));
                    //$("#chemoDetailsTemplate2").tmpl(event).appendTo(eventTypeContentContainers[eventTypeIndex]);
                };

            console.log("\n\n\n eventTypeContentContainers: ", eventTypeContentContainers, "\n\n\n");
            console.dir(eventTypeContentContainers);

            return {
                "addEvent"      :       addEvent,
                "addEvents"     :       addEvents,
                "onAddOne"      :       addEvents,  // for some reason, eventSource was written to retutn the single event as an array :(
                "onAddMany"     :       addEvents
            };
        },

        updateEventTypeVis = function(aRadioButton){
            var eventTypeIndex = $(".eventTypeContent").index($(aRadioButton).parents(".eventTypeContent"));
            if (aRadioButton && aRadioButton.value == "show") {
                //Timeline.Cancer.updater.show(aCheckbox.id); // should probably set ID to be {something}_i instead of i
                updater.show(eventTypeIndex);
            }
            else {
                //Timeline.Cancer.updater.hide(aCheckbox.id);
                updater.hide(eventTypeIndex);
            }
        }

        // TODO: Tal, make this pretty!
        makeVisibilityUpdater = function(tlUpdater) {
	        return function updateEventTypeVis(aRadioButton){
	            var eventTypeIndex = $(".eventTypeContent").index($(aRadioButton).parents(".eventTypeContent"));
	            if (aRadioButton && aRadioButton.value == "show") {
	                //Timeline.Cancer.updater.show(aCheckbox.id); // should probably set ID to be {something}_i instead of i
	                tlUpdater.show(eventTypeIndex);
	            }
	            else {
	                //Timeline.Cancer.updater.hide(aCheckbox.id);
	                tlUpdater.hide(eventTypeIndex);
	            }
	        }
	    };


	//enhanceTimelineLibrary();

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

	//app.enhanceTimelineLibrary = enhanceTimelineLibrary;
	app.getDefaultTheme = getDefaultTheme;
	app.isAbsoluteURL = isAbsoluteURL;
	app.getDomain = getDomain;
	app.centerOnDate = centerOnDate;
	app.centerOnEvent = centerOnEvent;
	app.makeUpdater = makeUpdater;
	app.createEventInfoUpdater = createEventInfoUpdater;
	//app.makeTimelineController = makeTimelineController;
	app.makeVisibilityUpdater = makeVisibilityUpdater;
	app.updateEventTypeVis = updateEventTypeVis;
}

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

Sandbox.modules.chapter_viewer = function (app) {
    var HIGHLIGHTED_INDEX_BASE_CLASSNAME = "chapter-index-",
        //app.HIGHLIGHTED_INDEX_BASE_CLASSNAME = HIGHLIGHTED_INDEX_BASE_CLASSNAME;  
        
        ChaptersUtil = (function() {
            var counter = app.createCounter();
            return {
                "getNewChapterID" : function () {
                    // almost impossible for two clients to be trying to add a chapter to the same timeline at the same time
                    var chapterID = "c" + counter.nextInt()+ "_" + new Date().getTime();
                    console.log("assigning chapterID: ", chapterID);
                    return chapterID;
                },
                "counterInit"   : function (aCount) {
                    console.log("initializing counter to: ", aCount);
                    counter.init(aCount);
                }
            };  
        })(),        

        renderChapters = function renderChapters(chapters, anOffset) {
            // should not need try block?
            console.log("\n\n\nchapters: ", chapters, "\n\n\n");
            try {
                // TODO: rename these templates to renderXXX instead of addXXX (it's confusing the way it is now)
                $("#addChapterTabTemplate").tmpl({"chapters" : chapters, "offset" : anOffset, "clip" : app.clipText}).appendTo("#patientNotesNav");
                $("#addChapterTextTemplate").tmpl({"chapters" : chapters, "offset" : anOffset}).appendTo("#patientNotes ul");

            } catch (e) {
                console.error(e);
            }
        },

        makeChapterHighlighter = function(ownerNode) {
            return function chapterHighlighter($event) {
                var HIGHLIGHTED_CHAPTER_DATUM_NAME = "highlightedChapter",
                    chapterIndex,
                    $highlightedChapter;

                $highlightedChapter = ownerNode.data(HIGHLIGHTED_CHAPTER_DATUM_NAME) || {};
                console.log("$highlightedChapter = ", $highlightedChapter);

                chapterIndex = $($event.target).data("chapterIndex");
                console.log("chapterIndex = ", chapterIndex);

                if ($highlightedChapter.length > 0) {
                    $highlightedChapter.addClass("hidden");                
                }
                $highlightedChapter = $(".ui-state-highlight."+HIGHLIGHTED_INDEX_BASE_CLASSNAME + chapterIndex);
                $highlightedChapter.removeClass("hidden");//.show();
                ownerNode.data(HIGHLIGHTED_CHAPTER_DATUM_NAME, $highlightedChapter);
            }
        },

        addHighlightSpan = function(band, chapter, highlightIndexClass) {
            if (band) {
                band.addDecorator(new Timeline.SpanHighlightDecorator({
                        startDate   :   chapter.start,
                        endDate     :   chapter.end,
                        cssClass    :   "ui-state-highlight hidden "+highlightIndexClass, 
                        opacity     :   30
                }));                     
            }
        },

        createChapterButton = function(chapter, chapterIndex) {
            var centerDate = new Date(
                (new Date(chapter.start).getTime() + 
                new Date(chapter.end).getTime()) / 2),
                
                
                $labelNode = $(this.nextSibling);

            console.log("centerDate = ", centerDate);

            // since page is pre-rendered, need to remove the span that is added by calls to $().button()
            // before we can call it later to set up these buttons
            //$labelNode.text($labelNode.find("span").text());
            
            $(this).data("centerDate", centerDate)
                .data("chapterIndex", chapterIndex)
                .data("chapterID", chapter.id)
                .button();     // it's already been pre-rendered as a button
                //.click();
        },

        makeAddChaptersFunc = function makeAddChaptersFunc($ownerNode) {
            return function addChapters(data, aTimeline, anOffset, skipRendering) {
                var band = aTimeline ? aTimeline.getBand(0) : null,
                    chapters = data.chapters,
                    anOffset = anOffset || 0;

                if (!skipRendering) {
                    renderChapters(chapters, anOffset);                    
                }

                $("#patientNotesNav input:radio").slice(anOffset).each(function(index, value) {
                    var chapter = chapters[index],
                        chapterIndex = index + anOffset,
                        highlightIndexClass = HIGHLIGHTED_INDEX_BASE_CLASSNAME + chapterIndex;

                    createChapterButton.call(this, chapter, chapterIndex);
                    addHighlightSpan(band, chapter, highlightIndexClass);
                });//.first().click();
                

                if (aTimeline) {
                    aTimeline.paint();                
                }

                /*
                // since JSON is already preloaded, we know that this will always happen
                $("body").off("click", disableUI);
                disableUI = function(){};            */

                enableChapterNav($ownerNode, aTimeline);

                console.log("done loading chapters");
            };
        },

        enableChapterNav = function($ownerNode, aTimeline) {
            var highlightChapter = makeChapterHighlighter($ownerNode),
                selectChapter = function() {
                    var centerDate,
                        $this;

                    $this = $(this);
                    centerDate = $(this).data("centerDate");
                    console.log("centering on date...", centerDate);
                    // scroll timeline
                    app.centerOnDate(aTimeline, centerDate);
                    // show text
                    $("#patientNotes .chapter").hide();
                    $("#"+this.id+"_text").show();
                },
                onClickHandler = function($event) {
                    console.log("inside onClickHandler, this: ", this);
                    selectChapter.call(this, $event);
                    highlightChapter.call(this, $event);                    
                };

            $ownerNode.on("click", "input:radio", onClickHandler/*app.makeChapterHighlighter($patientNotesNav)*/)
                .find("input:radio").first().click();
            //  don't need this if a chapter is selected by default, as the selection handler will take care of this
            //$("#patientNotes p").hide();      	
        },

        makeChaptersUpdater = function makeChaptersUpdater($ownerNode) {        
            return {
                "addChapters"  :   makeAddChaptersFunc($ownerNode)
            };
        };

    $.extend(app, {
        "ChaptersUtil"              :           ChaptersUtil,
        /*"HIGHLIGHTED_INDEX_BASE_CLASSNAME" :    HIGHLIGHTED_INDEX_BASE_CLASSNAME,
        //"makeChapterHighlighter"    :           makeChapterHighlighter,
        "addChapters"              :           addChapters,  // moved to chaptersUpdater
        "enableChapterNav"          :           enableChapterNav,*/
        "renderChapters"            :           renderChapters,
        "makeChaptersUpdater"       :           makeChaptersUpdater
    });
}


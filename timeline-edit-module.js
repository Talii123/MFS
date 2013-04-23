
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

Sandbox.modules.timeline_edit = function (app) {

	var enhanceTimelineLibrary = function() {

        // enhance Simile library?
        SimileAjax.EventIndex.prototype.remove = function (evt) {
            this._events.remove(evt);
            delete this._idToEvent[evt.getID()];
            this._indexed = false;
        };

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
	} 

	enhanceTimelineLibrary();
}

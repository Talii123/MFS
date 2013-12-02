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
  
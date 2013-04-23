var eventInfoUpdater = (function() {
    var eventInfoTemplates = [
    		"#diagnosisDetailsTemplate",
            "#surgeryDetailsTemplate",
            "#chemoDetailsTemplate", 
            "#radiationDetailsTemplate",
            "#immunoDetailsTemplate",
            "#testDetailsTemplate"
            
        ],
        eventTypeContentContainers = [],
        addEvents = function(events) {

            // one-time initialization
            $(".eventTypeContent").each(function(index, element) {
                eventTypeContentContainers[index] = $(this).find("ul");
            });

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
            }

            addEvents(events);
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
            $(eventTypeTemplate).tmpl(event).appendTo(eventTypeContentContainers[eventTypeIndex]);
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

})(); 

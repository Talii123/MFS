Sandbox("timeline_view", function (app) {

    var tl,
        updater,
        eventSource = //new Timeline.DefaultEventSource();
            new Timeline.CancerEventSource(),
        eventDataURL = "json/demo_events_images_prefixes.json",
        chapterDataURL = "json/demo_chapters.json",
        					//"json/demo_chapters_longer.json",

        buildTimeline = function () {

            var startProj = SimileAjax.DateTime.parseGregorianDateTime("Sep 1 2006 00:08:00 GMT-0600"),
                endProj = SimileAjax.DateTime.parseGregorianDateTime("Nov 27 2012 00:00:00 GMT-0600"),
                theme = app.getDefaultTheme(startProj, endProj),

                compactEventPainter = Timeline.CompactEventPainter,
				compactEventPainterParams = {
                    iconLabelGap: 5,
                    labelRightMargin: 20,
                    
                    iconWidth: 40, // These are for per-event custom icons
                    iconHeight: 40,
                     
                    stackConcurrentPreciseInstantEvents: {
                        limit: 5,
                        moreMessageTemplate: "%0 More Events",
                        icon: "no-image-40.png", // default icon in stacks
                        iconWidth: 40,
                        iconHeight: 40
                    }
                },

                /*bandInfos = [Timeline.createBandInfo({
                    eventSource: eventSource,
                    eventPainter: compactEventPainter,
                    eventPainterParams: compactEventPainterParams,
                    //layout 			: 	"original",
                    date 			: 	"Nov 28 2006 00:00:00 GMT-0600",
                    width 			: 	"85%",
                    intervalUnit 	: 	Timeline.DateTime.MONTH,
                    intervalPixels	: 	100,
                    theme 			: 	theme
                }), Timeline.createBandInfo({
                    eventSource 	: 	eventSource,
					layout 			: 	"overview",
                    //eventPainter: compactEventPainter,
                    //eventPainterParams: compactEventPainterParams,                   					
                    date 			: 	"Nov 28 2006 00:00:00 GMT-0600",
                    width 			: 	"15%",
                    intervalUnit 	: 	Timeline.DateTime.YEAR,
                    intervalPixels 	: 	200,
                    theme 			: 	theme
                })];*/

                bandInfos = [Timeline.createHotZoneBandInfo({
                     zones: [
                         {   start:    "Sep 01 2006 00:00:00 GMT-0500",
                             end:      "Oct 01 2006 00:00:00 GMT-0500",
                             magnify:  5,
                             unit:     Timeline.DateTime.WEEK
                         },
                         {   start:    "Sep 07 2006 00:00:00 GMT-0500",
                             end:      "Sep 14 2006 00:00:00 GMT-0500",
                             magnify:  7,
                             unit:     Timeline.DateTime.DAY
                         }/*,
                         {   start:    "Aug 02 2006 06:00:00 GMT-0500",
                             end:      "Aug 02 2006 12:00:00 GMT-0500",
                             magnify:  5,
                             unit:     Timeline.DateTime.HOUR
                         }*/
                     ],
                     timeZone:       -5,                    
                    eventSource: eventSource,
                    eventPainter: compactEventPainter,
                    eventPainterParams: compactEventPainterParams,
                    //layout            :   "original",
                    date            :   "Nov 28 2006 00:00:00 GMT-0600",
                    width           :   "85%",
                    intervalUnit    :   Timeline.DateTime.MONTH,
                    intervalPixels  :   100,
                    theme           :   theme
                }), Timeline.createBandInfo({
                    eventSource     :   eventSource,
                    layout          :   "overview",
                    //eventPainter: compactEventPainter,
                    //eventPainterParams: compactEventPainterParams,                                    
                    date            :   "Nov 28 2006 00:00:00 GMT-0600",
                    width           :   "15%",
                    intervalUnit    :   Timeline.DateTime.YEAR,
                    intervalPixels  :   200,
                    theme           :   theme
                })];

				bandInfos[0].eventPainter.addOnSelectListener(function onSelect(anEventId) {
					var event = eventSource.getEvent(anEventId);
					//alert("Event with ID: '"+anEventId+"' selected!");
													   
					//alert("Event description: "+event.getProperty("description"));
					$("#doctorNotes > textarea").html(event.getProperty("description") || "");
					$("#patientNotes > textarea").html(event.getProperty("pDescription") || "");
				});

                bandInfos[1].syncWith = 0;
                bandInfos[1].highlight = true;
                
                bandInfos[1].decorators = [new Timeline.SpanHighlightDecorator({
                    startDate: startProj,
                    endDate: endProj,
                    inFront: false,
                    color: "#FFC080",
                    opacity: 30,
                    /*startLabel: "Begin",
                    endLabel:   "End",*/
                    theme: theme
                })/*, new Timeline.SpanHighlightDecorator({
                    startDate: "September 17, 2007",
                    endDate: "November 27, 2007",
                    color: "#FDCC00",
                    opacity: 20,
                    startLabel: "Tal",
                    endLabel: "Rocks",
                    cssClass: "Tal"
                })*/];  

                /*bandInfos[0].decorators = [new Timeline.SpanHighlightDecorator({
                    startDate: "September 17, 2007",
                    endDate: "November 27, 2007",
                    //color: "#FDCC00",
                    opacity: 20,
                    /*startLabel: "Tal",
                    endLabel: "Rocks",*//*
                    cssClass: "ui-state-highlight"
                })];                                    
                        /*                    [new Timeline.PointHighlightDecorator({
                    date: new Date("October 17, 2007"),
                    width: 1000,
                    color: "blue",
                    opacity: 50                                                
                                            })

                ];*/

                 
                /*tl = Timeline.create(document.getElementById("my-timeline"), bandInfos);
                //Timeline.loadXML("example1.xml", function(xml, url) { eventSource.loadXML(xml, url); });
                
                tl.loadJSON("events.json", function(data, url){
                    eventSource.loadJSON(data, url);
                });
								
				tl.layout();	*/

                tl = app.createTimeline({
	                "bandInfos"     :   bandInfos,
	                "eventSource"   :   eventSource,
	                "startProj"		: 	startProj,
	                "endProj"		: 	endProj,
	                // temporarily, so that we can see images even without launching page via server
	                // switch back to tal_events.json if we properly support base image urls
	                // for file protocol
	                "eventDataURL" 	: 	eventDataURL
	            }); 	

				updater = makeUpdater(tl);
				//createTimelineControls();
            
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

    
    // 	updateEventTypeVis = function updateEventTypeVis(aCheckbox){
	   //      if (aCheckbox && aCheckbox.checked) {
	   //          //Timeline.Cancer.updater.show(aCheckbox.id); // should probably set ID to be {something}_i instead of i
				// updater.show(aCheckbox.id);
	   //      }
	   //      else {
	   //          //Timeline.Cancer.updater.hide(aCheckbox.id);
				// updater.hide(aCheckbox.id);
	   //      }
	   //  },

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
        },

	    resizeTimerID = null,
	    onResize = function (){
            console.log("onResize()");
	        if (resizeTimerID == null) {
	            resizeTimerID = window.setTimeout(function(){
	                resizeTimerID = null;
	                tl.layout();
	            }, 500);
	        }
	    },

        eventInfoUpdater = (function() {
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

    eventSource.addListener(eventInfoUpdater);


    $(function() {
        var currentTheme = $(document).data("theme"),
            $themeSelector = $("#themeSelector"),
            selectedIndex = $("option[value='"+currentTheme+"']", $themeSelector).index(),
            getEmailHTML =  function () {
                return "<div class='email'><a href='mailto:TallFry"+"@facebook.com'>TallFry"+"@facebook.com</a></div>";
            },
            removeEmail = function (event, ui) {
                $(".email", this).remove();
            };


        // DEPENDANCY: themer.js
        // handle case where the default selection is explicitly chosen via the URL
        selectedIndex = selectedIndex >= 0 ? selectedIndex : 0;
        $themeSelector
            .prop("selectedIndex", selectedIndex)
            .change(function(event) {
                themer.setTheme(this.options[this.selectedIndex].value);
            });
        // END DEPENDANCY: themer.js
        
        // DEPENDENCY: jQueryUI.js

        $(".tabs").tabs();

        var dialogConfig = 
        $(".dialog").dialog({
            autoOpen: false,
            width: 550,
            resizable: false
            /* horribly ugly right now

            buttons: {
                Ok: function() {
                    $( this ).dialog( "close" );
                }
            }
            */
        });

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

        // END DEPENDENCY jQueryUI.js


        // DEPENDENCY: timeline js
        buildTimeline();

        $("#eventInfoBox").on("click", "a.eventTitle", function($event) {
            var targetEventID;

            $event.preventDefault();

            targetEventID = this.href || "";
            if (targetEventID.indexOf("/") >= 0) {
                targetEventID = targetEventID.substring(targetEventID.lastIndexOf("/") + 1);
            }
            app.centerOnEvent(tl, targetEventID);
            updater.highlight(targetEventID); 
        });

        $(window).resize(onResize);
        
        // END DEPENDENCY Timeline.js


        // DEPENDENCY: Timeline.js, JSON files
        $("input:radio").button().click(function() {
            updateEventTypeVis(this);
        });          

        console.log("loading events...");
        tl.loadJSON(eventDataURL, function(data, url){
            // this only works when delivered from a server; when using a file URI, the path to the project gets cleared out
            // need a more robust solution
            //eventSource.loadJSON(data, "/images/");
            console.log("done loading events.  Now adding events into Timeline.");
            eventSource.loadJSON(data, url);
            console.log("done adding events to Timeline.");
        });

        tl.layout();


        console.log("loading chapters...");
        //$.getJSON(chapterDataURL, function(data) {
        tl.loadJSON(chapterDataURL, function(data, url) {
            var band = tl.getBand(0),
                chapters = data.chapters,
                                        // dummy object to simplify code later
                $highlightedChapter = {"addClass" : function(){}};

            $("#patientNotesTemplate").tmpl(data).appendTo("#patientNotesContainer"); 

            /*$.each(data.chapters, function() {
                band.addDecorator(new Timeline.SpanHighlightDecorator({
                    startDate   :   this.start,
                    endDate     :   this.end,
                    cssClass    :   "ui-state-highlight", 
                    opacity     :   30
                }));
            });
            tl.paint();*/

            $("#patientNotesNav input:radio").each(function(index, value) {
                var chapter = chapters[index],
                    centerDate = new Date(
                        (new Date(chapter.start).getTime() + 
                         new Date(chapter.end).getTime()) / 2),
                    highlightIndexClass = "chapter-index-"+index;


                console.log("centerDate = ", centerDate);
                $(this).data("centerDate", centerDate)
                    .data("chapterIndex", highlightIndexClass)
                    .button()
                    .click(function(event) {
                        console.log("centering on date...");
                console.log("index = ", index);


                        app.centerOnDate(tl, $(this).data("centerDate"));
                        $highlightedChapter.addClass("hidden");
                        $highlightedChapter = $(".ui-state-highlight.chapter-index-"+index).removeClass("hidden");//.show();

                        $("#patientNotes p").hide();
                        $("#"+this.id+"_text").show();

                    });

                band.addDecorator(new Timeline.SpanHighlightDecorator({
                    startDate   :   chapter.start,
                    endDate     :   chapter.end,
                    cssClass    :   "ui-state-highlight hidden "+highlightIndexClass, 
                    opacity     :   30
                }));          

            })//.first().click();

            tl.paint();

            $("#patientNotesNav input:radio").first().click();
            //  don't need this if a chapter is selected by default, as the selection handler will take care of this
            //$("#patientNotes p").hide();  

            console.log("done loading chapters");
        });
    });
});

/*window.Sandbox = function() {
	alert("Sandbox has completed it's work and can no longer be used.")
};*/

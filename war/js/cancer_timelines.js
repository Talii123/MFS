            var tl;
			var updater;
            
			function centerOnDate(aGregorianDateTime) {
				tl.getBand(0).setCenterVisibleDate(SimileAjax.DateTime.parseGregorianDateTime(aGregorianDateTime));
				return false;
			}

            function onLoad(){
            
                // TODO: this code should be encapsulated in a namespace and externalized to a js file
                
                // the problem appears to have been that the band infos were not being initialized with the "theme" object,
                //  NOT that there is some problem parsing Iso8601 DateTimes or comparing them to Gregorian ones
                // var startProj = SimileAjax.DateTime.parseIso8601DateTime("2006-08-10T00:00:00");
                //var endProj = SimileAjax.DateTime.parseIso8601DateTime("2011-04-30T00:00:00");
                var startProj = SimileAjax.DateTime.parseGregorianDateTime(" Sep 1 2005 00:08:00 GMT-0600");
                var endProj = SimileAjax.DateTime.parseGregorianDateTime("Tue Oct 27 2011 00:00:00 GMT-0600");
                
                var eventSource = //new Timeline.DefaultEventSource();
                new Timeline.CancerEventSource(); 
                var theme = Timeline.ClassicTheme.create();
                theme.autoWidth = false; // Set the Timeline's "width" automatically.
                theme.autoWidthMargin = 10;
                theme.event.bubble.width = 220;
                theme.event.bubble.height = 120;
                
                theme.ether.backgroundColors = ["#E6E6E6", "#F7F7F7"];
                
                theme.timeline_start = startProj;
                theme.timeline_stop = endProj;
                
                // theme.event.track.height = "20";
                // theme.event.tape.height = 10; // px
                // theme.event.track.height = theme.event.tape.height + 6;
				
				// for compact painting
				theme.event.instant.icon = "no-image-40.png";
            	theme.event.instant.iconWidth = 40;  // These are for the default stand-alone icon
            	theme.event.instant.iconHeight = 40;

                var compactEventPainter = Timeline.CompactEventPainter;								
				var compactEventPainterParams = {
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
                    };
                var bandInfos = [Timeline.createBandInfo({
                    eventSource: eventSource,
                    eventPainter: compactEventPainter,
                    eventPainterParams: compactEventPainterParams,
                    date: "Nov 28 2006 00:00:00 GMT-0600",
                    width: "85%",
                    intervalUnit: Timeline.DateTime.MONTH,
                    intervalPixels: 100,
                    theme: theme
                }), Timeline.createBandInfo({
                    eventSource: eventSource,
					layout : "overview",
                    //eventPainter: compactEventPainter,
                    //eventPainterParams: compactEventPainterParams,                   					
                    date: "Nov 28 2006 00:00:00 GMT-0600",
                    width: "15%",
                    intervalUnit: Timeline.DateTime.YEAR,
                    intervalPixels: 200,
                    theme: theme
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
                    startLabel: "Begin",
                    endLabel:   "End",
                    theme: theme
                })];         
                
                 
                tl = Timeline.create(document.getElementById("my-timeline"), bandInfos);
                //Timeline.loadXML("example1.xml", function(xml, url) { eventSource.loadXML(xml, url); });
                
                tl.loadJSON("events.json", function(data, url){
                    eventSource.loadJSON(data, url);
                });

				
				//eventSource = new Timeline.DefaultEventSource();
				//tl.eventSource = eventSource;
				/*tl.loadJSON("doctorEvents.json", function(data, url) {
							//		eventSource.clear();

					eventSource.loadJSON(data, url);
				});*/
				
				
				tl.layout();				

			/*	var updater = (function(aTimeline) {
					var timeline = aTimeline;
					var hideEvents = [];
					var matcher = function(evt) {
						var eventType = evt.getProperty("type");
						if (!eventType) return true;
						/*var i = 0; 
						for (i = 0; i < hideEvents.length; ++i) {
							if (hideEvents[i] == eventType) {
								return false
							}
						}
						return true;*//*
						
						return !hideEvents[eventType];
					}
					
					var bandCount = timeline.getBandCount();
					var i;
					for (i = 0; i < bandCount; ++i) {
						timeline.getBand(i).getEventPainter().setFilterMatcher(matcher);
					}
					
					return {
						"show" : function(eventType) {
							hideEvents[eventType] = false;
							timeline.paint();
						},
						"hide" : function(eventType) {
							hideEvents[eventType] = true;
							timeline.paint();
						}
					};
				})(tl);*/
				
				updater = makeUpdater(tl);
				createTimelineControls();
            }
            
            var resizeTimerID = null;
            function onResize(){
                if (resizeTimerID == null) {
                    resizeTimerID = window.setTimeout(function(){
                        resizeTimerID = null;
                        tl.layout();
                    }, 500);
                }
            }

 			function makeUpdater(aTimeline) {
					var timeline = aTimeline;
					var hideEvents = [];
					var matcher = function(evt) {
						var eventType = evt.getProperty("type");
						if (!eventType) return true;
						
						return !hideEvents[eventType];
					}
					
					var bandCount = timeline.getBandCount();
					var i;
					for (i = 0; i < bandCount; ++i) {
						timeline.getBand(i).getEventPainter().setFilterMatcher(matcher);
					}
					
					return {
						"show" : function(eventType) {
							hideEvents[eventType] = false;
							//timeline.paint();
							timeline.layout();
						},
						"hide" : function(eventType) {
							hideEvents[eventType] = true;							
							//timeline.paint();
							timeline.layout();
						}
					};
				} 

            
            function updateEventTypeVis(aCheckbox){
                if (aCheckbox && aCheckbox.checked) {
                    //Timeline.Cancer.updater.show(aCheckbox.id); // should probably set ID to be {something}_i instead of i
					updater.show(aCheckbox.id);
                }
                else {
                    //Timeline.Cancer.updater.hide(aCheckbox.id);
					updater.hide(aCheckbox.id);
                }
            }
            
            /*function createTimelineControls(){
                var controlsContainer = document.getElementById("my-timeline-controls");
                var controlsStr = "<h3>Filter By Event Type:</h3>";
                //var eventTypes = Timeline.Cancer.getEventTypes();
                //alert("now eventTypes="+eventTypes);
				eventTypes = [
					"default",
					"surgery",
					"chemotherapy",
					"radiation",
					"immunotherapy",
					"diagnostic test"
				];
                var i;
                // start at i because for now, there is nothing to show for "default" events
                for (i = 1; i < eventTypes.length; ++i) {
                    // should probably set ID to be {something}_i instead of i
                    controlsStr += '<input type="checkbox" id="' + i + '" onclick="updateEventTypeVis(this);" checked="checked"/><label for="' + i + '">' + eventTypes[i] + '</label><br/>';
                }
                controlsContainer.innerHTML = controlsStr;
            }*/

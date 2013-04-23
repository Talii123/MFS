Sandbox(["common", "timeline_view", "chapter_viewer", "dao"], function (app) {
                    
    var tl,
        updater,
        

        eventSource = //new Timeline.DefaultEventSource();
            new Timeline.CancerEventSource(),
        eventDataURL = "json/demo_events_images_prefixes.json",
        chapterDataURL = "json/demo_chapters.json",
        					//"json/demo_chapters_longer.json",
        // this doesn't really make sense for timelineViewer!                            
        /*chaptersJSON = {
            "chapters" : [
                {
                    "title"     :   "Help",
                    "start"     :   "January 4, 2013",
                    "end"       :   "January 17, 2013",
                    "text"      :   "This is where 'chapters' of your story show up.  Click the 'Add Chapter' button to start telling your story."
                }
            ]
        },*/

        buildTimeline = function () {

            var startProj = SimileAjax.DateTime.parseGregorianDateTime("Sep 1 1898 00:08:00 GMT-0600"),
                endProj = SimileAjax.DateTime.parseGregorianDateTime("Nov 27 2112 00:00:00 GMT-0600"),
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

                bandInfos = [Timeline.createBandInfo({
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
                })];  

           
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

				updater = app.makeUpdater(tl);            
        },

        makeTitlesSelectEventsInTL = function($event) {
            var targetEventID;

            //alert("preventing default...");
            $event.preventDefault();
            //alert("done");

            targetEventID = this.href || "";
            if (targetEventID.indexOf("/") >= 0) {
                targetEventID = targetEventID.substring(targetEventID.lastIndexOf("/") + 1);
            }
            app.centerOnEvent(tl, targetEventID);
            updater.highlight(targetEventID); 
        };


    $(function() {
        var dao = app.getDAO();

        // DEPENDANCY: themer.js
        app.initThemer();
        // END DEPENDANCY: themer.js
        
        // DEPENDENCY: jQueryUI.js
        $(".tabs").tabs();

        // END DEPENDENCY jQueryUI.js



        $("#eventInfoBox").on("click", "a.eventTitle", makeTitlesSelectEventsInTL);
        $("#eventInfoTabs input:radio").button().click(function() {
            app.updateEventTypeVis(this);
        });   

        buildTimeline();

/*        $.when(dao.getEvents()).then(function(data) {
            var numEvents;
            console.log("events data loaded: ", data);
            //buildTimeline();
            $(window).resize(app.getResizer(tl));

            eventSource.loadJSON(data, "/");

            try {
                numEvents = data.events.length;
            } catch (e) {
                console.warn("attempting to access data.events.length caused exception; setting numChapters to 0");
                numEvents = 0;
            }
            Timeline.EventUtils.counterInit(numEvents);
            tl.layout();         

            //eventsLoaded.resolve();  
            
            /*app.loadChapters(chaptersJSON, tl);
            app.enableChapterNav($("#patientNotesNav"));*/

            // only add DAO as a listener after initial events have been loaded
           /* eventSource.addListener(dao);        
        });*/

        $.when(dao.getChapters()).then(function(data) {
            var numChapters;
            console.log("chapters data loaded: ", data);

           /* app.loadChapters(data, tl);
            app.enableChapterNav($("#patientNotesNav"));*/
            //chaptersUpdater = app.makeChaptersUpdater($("#patientNotesNav"));
            chaptersUpdater = app.makeChaptersUpdater($("#patientNotesNav")),
            chaptersUpdater.addChapters(data, tl, null, true);

            try {
                numChapters = data.chapters.length;
            } catch (e) {
                console.warn("attempting to access data.chapters.length caused exception; setting numChapters to 0");
                numChapters = 0;
            }
            app.ChaptersUtil.counterInit(numChapters);
            //chaptersLoaded.resolve();
        });

                
        // END DEPENDENCY Timeline.js
        

        app.setupDialogs({
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

        app.doPreFetch();
    });
});

/*window.Sandbox = function() {
	alert("Sandbox has completed it's work and can no longer be used.")
};*/

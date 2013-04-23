Sandbox(["timeline_view", "chapter_viewer", "common"], function (app) {
                    
    var tl,
        updater,
        user = app.user,
        dao = app.getDAO(),

        eventSource = //new Timeline.DefaultEventSource();
            new Timeline.CancerEventSource(),
        eventDataURL = "json/demo_events_images_prefixes.json",
        chapterDataURL = "json/demo_chapters.json",
        					//"json/demo_chapters_longer.json",
        chaptersJSON = {
            "chapters" : [
                {
                    "title"     :   "Help",
                    "start"     :   "January 4, 2013",
                    "end"       :   "January 17, 2013",
                    "text"      :   "This is where 'chapters' of your story show up.  Click the 'Add Chapter' button to start telling your story."
                }
            ]
        },

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

            $event.preventDefault();

            targetEventID = this.href || "";
            if (targetEventID.indexOf("/") >= 0) {
                targetEventID = targetEventID.substring(targetEventID.lastIndexOf("/") + 1);
            }
            app.centerOnEvent(tl, targetEventID);
            updater.highlight(targetEventID); 
        };




    $(function() {
        // DEPENDANCY: themer.js
        app.initThemer();
        // END DEPENDANCY: themer.js
        
        // DEPENDENCY: jQueryUI.js
        $(".tabs").tabs();

        // END DEPENDENCY jQueryUI.js


        // DEPENDENCY: timeline js
        buildTimeline();
       
        eventSource.addListener(app.createEventInfoUpdater(".eventTypeContent ul"));
        eventSource.addListener(dao);

        $("#eventInfoBox").on("click", ".eventTitle a", makeTitlesSelectEventsInTL);

        $(window).resize(app.getResizer(tl));
        
        // END DEPENDENCY Timeline.js


        // DEPENDENCY: Timeline.js, JSON files
        $("#eventInfoTabs input:radio").button().click(function() {
            app.updateEventTypeVis(this);
        });          

        tl.layout();

        app.loadChapters(chaptersJSON, tl);
        app.enableChapterNav($("#patientNotesNav"));

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

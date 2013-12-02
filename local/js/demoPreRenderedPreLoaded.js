Sandbox("timeline_view", function (app) {

    var tl,
        updater,
        eventSource = //new Timeline.DefaultEventSource();
            new Timeline.CancerEventSource(),
        eventDataURL = "json/demo_events_images_prefixes.json",
        chapterDataURL = "json/demo_chapters.json",
        					//"json/demo_chapters_longer.json",

        eventsJSON = {
           "dateTimeFormat" :   "Gregorian",
           "extension"  :   {
                "namespace" :   "My_Cancer_Story"
           },
           "events": [
            {
                "start"             :       "Fri Sep 8 2006 10:00:00 ",
                "end"               :       "Fri Sep 8 2006 11:00:00 ",
                "eventID"           :       "001",
                "id"                :       "001a",
                "title"             :       "Abdominal Ultrasound",
                "durationEvent"     :       false,
                "typeIndex"         :       5,
                "type"              :       "test",
                "icon"              :       "../images/ultrasound_40_40.jpg",
                "description"       :       "Up to 3 masses detected in and around the liver.",
                "pDescription"      :       "An ultrasound was performed to try to figure out what was wrong with me.  The technician was very concerned after he performed it and told me to go see my GP immediately.  My GP wrote me a note to have me admitted urgently into the hospital ER.  On the drive down to the hospital I looked at the report from my ultrasound.  The report said that there were up to 3 masses in and around my liver.",
                "details"           :       {
                    "typeDescription"       :       "test"  
                }
            }, {
                "start"             :       "Fri Sep 8 2006 23:00:00",
                "title"             :       "CT scan",
                "durationEvent"     :       false,
                "typeIndex"         :       5,
                "type"              :       "test",
                "icon"              :       "../images/ctscan_40_40.jpg",
                "description"       :       "CT scan demonstrated 8cm tumor infiltrating the common bile duct.  Further testing needed to determine tumor type.  \\n\\nPossible diagnosis: \\n\\nCholangiocarcinoma \\nHepatocellular Carcinoma \\nFibrolamellar Hepatocellular Carcinoma \\nFocal Nodular Hyperplasia",
                "pDescription"      :       "After a few hours in the ER, they took me upstairs to do a CT scan.  Afterwards they told me that there was an 8cm tumor blocking the bile duct - a tube that connects to the liver.  They were not sure if it was a liver tumor that grew into the bile duct or a bile duct tumor that grew into the liver."
            }, {
                "start"             :       "Mon Sep 11 2006 10:00:00",
                "title"             :       "CT scan",
                "durationEvent"     :       false,
                "typeIndex"         :       5,
                "type"              :       "test",
                "icon"              :       "../images/ctscan_40_40.jpg"
            }, {
                "start"             :       "Tue Sep 12 2006 10:00:00",
                "title"             :       "Ultrasound",
                "durationEvent"     :       false,
                "typeIndex"         :       5,
                "type"              :       "test",
                "icon"              :       "../images/ultrasound_40_40.jpg"
            }, {
                "start"             :       "Tue Sep 11 2006 11:00:00",
                "title"             :       "MRI",
                "durationEvent"     :       false,
                "typeIndex"         :       5,
                "type"              :       "test",
                "icon"              :       "../images/mri_40_40.jpg"
            }, {
                "start"             :       "Thu Sep 14 2006 15:00:00",
                "title"             :       "Stent + Percutaneous Drain implanted",
                "durationEvent"     :       false,
                "typeIndex"         :       5,
                "type"              :       "test",
                "icon"              :       "../images/ultrasound_40_40.jpg"
            }, {
                "start"             :       "Thu Sep 14 2006 15:00:00",
                "title"             :       "Fine Needle Biopsy",
                "durationEvent"     :       false,
                "typeIndex"         :       5,
                "type"              :       "test",
                "icon"              :       "../images/ultrasound_40_40.jpg"
            }, {
                "start"             :       "September 15, 2006",
                "end"               :       "September 15, 2006",
                "title"             :       "First Diagnosis",
                "durationEvent"     :       false,
                "description"       :       "After all the tests were completed, I was diganosed with Fibrolamellar Hepatocellular Carcinoma.  I had an 8cm tumor in my liver, blocking the bile duct.",
                "typeIndex"         :       0,
                "type"              :       "diagnosis",
                "icon"              :       "../images/diagnosis_40_40.jpg",
                "age"               :       25,
                "stage"             :       "II ?",
                "metastatic"        :       "no",
                "diseaseSites"      :       ["liver"],
                "lymphNodes"        :       "no",
                "vascularInvasion"  :       "no",
                "microVascularInvastion" :  "yes"
            }, {
                "start"             :       "Wed Nov 29 2006 00:08:00",
                "end"               :       "Nov 29 2006 00:16:00",
                "title"             :       "Liver Resection",
                "durationEvent"     :       false,
                "description"       :       "En bloc resection of the liver. 60% of the liver removed as well as the gall bladder, the entire biliary tree and a 10cm x 9cm x 8cm tumor.  Percutaneous drain and stent also removed.",
                "pDescription"      :       "My surgical oncologist, Dr. Newton, performed an 8 hour surgery.  She removed 60% of my liver, and also took out my gall bladder and all of the tubing connecting the liver and gall bladder to the other organs.  She then surgically attached the leftover liver to my intestines.  She also cut out a piece of my diaphragm because the liver tumor was abutting it.  Finally, she took out the tube that they put in my abdomen earlier to bypass the blocked bile duct and allow the bile to drain.\\n\\nFinally, she removed three lymph nodes, which were all negative (no cancer in them).\\n\\nShe told me that she got all of the cancer out and that hopefully it didn't have a chance to spread before the surgery.",
                "typeIndex"         :       1, 
                "type"              :       "surgery",
                "icon"              :       "../images/surgery3_40_40.jpg",
                "surgeon"           :       "Dr. Melissa Newton",
                "resident"          :       ["Dr. Shamir", "Dr. Betzal"],
                "hospital"          :       "A Metro Hospital",
                "location"          :       "Toronto, ON, Canada",
                "recoveryTimeHospital"  :   "7 days",
                "recoveryTimeHome"  :       "about 3 months"
            }, {
                "start"             :       "Sep 17 2007",
                "title"             :       "Recurrence",
                "description"       :       "There were two large tumors, one in my chest and one in my diaphragm.  There were also enlarged lymph nodes throughout my abdomen.",
                "typeIndex"         :       0,
                "type"              :       "diagnosis",
                "icon"              :       "../images/diagnosis_40_40.jpg",
                "age"               :       26,
                "stage"             :       "IV",
                "metastatic"        :       "yes",
                "diseaseSites"      :       ["diaphragm", "chest", "lymph nodes"],
                "lymphNodes"        :       "yes",
                "vascularInvasion"  :       "no",
                "microVascularInvastion" :  "unknown"
            }, {
                "start"             :       "Oct 20 2007 00:00:00",
                "end"               :       "Oct 30 2007 00:00:00",
                "title"             :       "Nexavar (Sorafenib)",
                "durationEvent"     :       true,
                "description"       :       "Nexavar pills BID.",   
                "pDescription"      :       "I tried Nexavar for 10 days but had really bad side effects.\\n\\n  For a week I had terrible stomach cramps.  When that finally went away, I got a full body rash, my feet were so swollen I could barely get my shoes on and it hurt like hell to stand up.  Worst of all, my red blood cell counts were way off and I had to see a hematologist to make sure I wasn't in any danger from the chemo.\\n\\nIt took 2 weeks of prednisone for me to recover.  The medical oncologist wanted to try again at 1/8 the original dose, but I wanted to try a different treatment.",        
                "typeIndex"         :       2,
                "type"              :       "chemo",
                "result"            :       "Progressive Disease",
                "isRecommended"     :       "NO",
                "oncologist"        :       "-- censored --",
                "duration"          :       "10 days",
                "sideEffects"       :       ["Full Body Rash", "Extreme Swelling of the Feet", "Pain When Standing", "Elevated Red Blood Cell Counts", "Green Growths on My Fingers", "Hair Loss", "Fatigue"]
            }, {
                "start"             :       "Dec 15 2007 00:08:00",
                "end"               :       "Dec 15 2007 00:16:00",
                "title"             :       "Diaphragm & Lymph Nodes Resection",
                "durationEvent"     :       false,
                "typeIndex"         :       1,
                "type"              :       "surgery",
                "icon"              :       "../images/surgery3_40_40.jpg",
                "description"       :       "Resection of enlarged lymph node from diaphragm.  Disection of diaphragm to access thoracic mass, completely excised.  Diaphragm repair.",
                "pDescription"      :       "Dr. Tremblay performed an 8 and a 1/2 hour surgery.  He removed an enlarged lymph node from my diaphragm, then cut a hole in my diaphragm so that he could get into my chest cavity where the other tumor was.  He then removed a mass from my chest.  \\n\\n He used the same incision site as last time so there is no new scar.  He also used a glue to close up the wound instead of staples, so the scar was much thinner.",
                "surgeon"           :       "Dr. Tremblay",
                "hospital"          :       "M.D. Anderson Cancer Center",
                "location"          :       "Houston, TX, USA",
                "recoveryTimeHospital"  :   "7 days",
                "recoveryTimeHome"  :       "2 weeks"
            },  {
                "start"             :       "Jan 28 2008 00:00:00",
                "end"               :       "Dec 08 2008 00:00:00",
                "title"             :       "5FU and Interferon Alpha",
                "durationEvent"     :       true,
                "description"       :       "3 week cycles of continuous 5FU infusion (2525mg/week) with subcutaneous injections of 8 million units of Interferon Alpha 3x weekly.",
                "pDescription"      :       "Cycles would last 3 weeks, with one week off between them.\\n\\nThe 5FU was administered with a bottle around the size of a baby bottle full of 5FU, which would slowly infuse into the body over the course of the week. At the end of each week, the empty bottle was replaced with a full one. Three bottles over three weeks would constitute one round.\\n\\nThe Interferon Alpha is administered with injections into fatty tissue - either in the belly or the thigh.",
                "typeIndex"         :       2,
                "type"              :       "chemo",
                "icon"              :       "../images/chemo2_40_40.jpg",
                "result"            :       "Partial Response",
                "isRecommended"     :       "YES",
                "duration"          :       "9 months",
                "oncologist"        :       "-- censored --",
                "sideEffects"       :       ["Extreme Fatigue", "Mouth Sores", "Thrush", "Muscle Aches", "Headaches", "Difficulty Thinking/Focusing", "Elevated Heart Rate (at the beginning of rounds 1 and 2 only)"]
            },  {
                "start"             :       "Dec 09 2008 00:00:00",
                "end"               :       "Feb 28 2009 00:00:00",
                "title"             :       "Unmatched Donor Lymphocyte Infusions",
                "durationEvent"     :       true,
                "description"       :       "Injected with T-cells and Natural Killer cells from various unmatched donors.  Small non-chemotherapeutic doses of Avastin and Erbitux were administered to enhance the donated cells' ability to target the tumors.",
                "pDescription"      :       "Injected with T-cells and Natural Killer cells from various unmatched donors.  Small non-chemotherapeutic doses of Avastin and Erbitux were administered to enhance the donated cells' ability to target the tumors.",
                "typeIndex"         :       4,
                "type"              :       "immuno",
                "result"            :       "Stable Disease",
                "duration"          :       "3 months"  
            },  {
                "start"             :       "Apr 09 2009 00:00:00",
                "end"               :       "June 28 2009 00:00:00",
                "title"             :       "Three different cancer cell vaccines administered.",
                "durationEvent"     :       true,
                "description"       :       "Three different cancer 'vaccines' were prepared and administered. White blood cells were taken from my brother, who is an 80% match for me.\\n\\n Vaccine #1: My brother's T-cells and Natural Killer cells were mixed with my frozen tumor in a lab and then infused into me, along with IL2, Avastin and Erbitux.  \\nVaccine #2: My brother's dendritic cells were exposed to my frozen tumor and then infused into me along with IL2, Avastin and Erbitux.  \\nVaccine #3: My own T-cells were extracted and mixed with my brother's dendritic cells and my frozen tumor in the lab, and then infused into my body.",
                "pDescription"      :       "Three different cancer 'vaccines' were prepared and administered. White blood cells were taken from my brother, who is an 80% match for me.\\n\\n Vaccine #1: My brother's T-cells and Natural Killer cells were mixed with my frozen tumor in a lab and then infused into me, along with IL2, Avastin and Erbitux.  \\nVaccine #2: My brother's dendritic cells were exposed to my frozen tumor and then infused into me along with IL2, Avastin and Erbitux.  \\nVaccine #3: My own T-cells were extracted and mixed with my brother's dendritic cells and my frozen tumor in the lab, and then infused into my body.",
                "typeIndex"         :       4,
                "type"              :       "immuno",
                "result"            :       "Stable Disease",
                "duration"          :       "3 months"              
            },  {
                "start"             :       "Jun 28 2009 00:00:00",
                "end"               :       "Oct 29 2009 00:00:00",
                "title"             :       "Second Remission?!?  Impossible cure?",
                "durationEvent"     :       true,
                "description"       :       "Only sign of cancer was a couple of enlarged lymph nodes that initially shrunk and then remained stable during chemotherapy and cell therapy.  We thought and hoped the immunotherapy might have been curative"
            }, {
                "start"             :       "Oct 29 2009",
                "title"             :       "Lymph Nodes Growing Again",
                "description"       :       "The lymph nodes in front of my heart were significantly larger than on the previous scan.  As well, the abdominal lymph nodes were also larger.",
                "typeIndex"         :       0,
                "type"              :       "diagnosis",
                "icon"              :       "../images/diagnosis_40_40.jpg",
                "age"               :       28,
                "stage"             :       "IV ?",
                "metastatic"        :       "yes",
                "diseaseSites"      :       ["lymph nodes in front of the heart", "lymph nodes in the abdomen"],
                "lymphNodes"        :       "yes",
                "vascularInvasion"  :       "no",
                "microVascularInvastion" :  "no"
            }, {
                "start"             :       "Dec 17 2009 00:08:00",
                "end"               :       "Dec 17 2009 00:16:30",
                "title"             :       "Lymph Nodes Resection",
                "durationEvent"     :       false,
                "description"       :       "This surgery required two surgeons.  First, one surgeon removed the lymph nodes from in front of my heart.  Then, Dr. Tremblay came in to do the abdominal surgery.  Because Dr. Tremblay knew from the previous surgery about the scarring around my pancreas, he planned a different route to reach the suspicious lymph nodes and was able to remove them all.  Before closing me up, he did an ultrasound directly on my liver, which showed no sign of disease.",
                "pDescription"      :       "This surgery required two surgeons.  First, one surgeon removed the lymph nodes from in front of my heart.  Then, Dr. Tremblay came in to do the abdominal surgery.  Because Dr. Tremblay knew from the previous surgery about the scarring around my pancreas, he planned a different route to reach the suspicious lymph nodes and was able to remove them all.  Before closing me up, he did an ultrasound directly on my liver, which showed no sign of disease.",
                "typeIndex"         :       1,
                "type"              :       "surgery",
                "icon"              :       "../images/surgery3_40_40.jpg",
                "surgeon"           :       "Dr. Tremblay",
                "hospital"          :       "M.D. Anderson Cancer Center",
                "location"          :       "Houston, TX, USA",
                "recoveryTimeHospital"  :   "7 days",
                "recoveryTimeHome"  :       "2 and a half weeks"
            },  {
                "start"             :       "Feb 1 2010 00:00:00",
                "end"               :       "May 31 2010 00:00:00",
                "title"             :       "Xeloda and Interferon Alpha",
                "durationEvent"     :       true,
                "description"       :       "Xeloda (oral 5FU) for 2 weeks at a time with subcutaneous injections of Interferon Alpha thrice weekly.",
                "pDescription"      :       "Xeloda (Capecitabine) is a very similar drug to 5FU, except it is delivered in a pill form, while 5FU is given intravenously.  Xeloda actually gets turned into 5FU by the human body.\\n\\nI did this chemo as a precaution.  There was no evidence of disease, but because I recently had cancer growing in my body, we were concerned that there could still be cancerous cells hiding in my blood, lymph, or some other tissues.\\n\\nWe figured that since the 5FU & Interferon worked so well in the past, I should do some additional chemo now.\\n\\nI opted for Xeloda this time because of quality of life issues - it's much more convenient to take Xeloda pills than to have a bottle of 5FU attached to your PICC line at all times.  Although we heard some people say that 5FU works better than Xeloda in this disease, we figured that since this was just preventative chemo anyway, my quality of life should count for more.  If I had active disease, I probably would have gone with 5FU not Xeloda.",
                "typeIndex"         :       2,
                "type"              :       "chemo",
                "result"            :       "unknown",
                "duration"          :       "3 months",
                "oncologist"        :       "-- censored --",
                "sideEffects"       :       ["Swollen Hands and Feet", "Hot Feeling in Hands and Feet", "Elevated Heart Rate (only in the beginning)"]
            }]
        },
        chaptersJSON = {
            "chapters" : [
                {
                    "title"     :   "Diagnosis",
                    "start"     :   "September 4, 2006",
                    "end"       :   "September 17, 2006",
                    "text"      :   "I was diagnosed in September 2006 at the age of 25. I was very lucky. The tumor blocked my bile duct which made me more yellow than Bart Simpson, so we caught it early. "    
                }, {
                    "title"     :   "1st Round",
                    "start"     :   "September 31, 2006",
                    "end"       :   "February 21, 2007",
                    "text"      :   "Two painful procedures and an 8hr surgery later and the doctors told me to get on with my life."
                }, {
                    "title"     :   "Metastasis",
                    "start"     :   "September 17, 2007",
                    "end"       :   "November 27, 2007",
                    "text"      :   "In September 2007, it came back. They spotted two tumors - one in the chest and one in my diaphragm. I also had enlarged lymph nodes. The only thing my doctors wanted to try was Sorafenib (\"Nexavar\"). After 10 days, I had to stop - it was killing me faster than the cancer was. My doctors wanted to give up, but my family didn't, so we found other doctors."
                }, {
                    "title"     :   "2nd Round",
                    "start"     :   "December 5, 2007",
                    "end"       :   "June 28, 2009",
                    "text"      :   "Eventually I had a surgery to remove the tumors. They couldn't safely remove the lymph nodes so they gave me some radiation during the surgery. After that, I did 9 rounds of chemotherapy - 5FU and Interferon Alpha. The lymph nodes shrunk somewhat after the first 3 rounds and stayed stable after that. I then went and tried some cell therapy (like Sarah) and the nodes continued to be stable."
                }, {
                    "title"     :   "3rd Round" ,
                    "start"     :   "October 9, 2009",
                    "end"       :   "May 31, 2010",
                    "text"      :   "In October 2009, the lymph nodes started growing again. I had surgery for a 3rd time, and this time, they got it all. I did 3 more rounds of chemo as a precaution, and now I have no evidence of disease."
                } 
            ]
        },

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

				updater = makeUpdater(tl);            
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

        doPreFetch = function() {

          /*  $.ajax("/images/bubble-top-left.png");
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
            /*

                This worked better than the above - images were returned, but still NOT cached!! :(
                    */

            //console.log("\n\n\n\ninserting images...\n\n\n");

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
        $("#eventInfoTabs input:radio").button().click(function() {
            updateEventTypeVis(this);
        });          

        console.log("loading events...");
        /*tl.loadJSON(eventDataURL, function(data, url){
            // this only works when delivered from a server; when using a file URI, the path to the project gets cleared out
            // need a more robust solution
            //eventSource.loadJSON(data, "/images/");
            console.log("done loading events.  Now adding events into Timeline.");
            eventSource.loadJSON(data, url);
            console.log("done adding events to Timeline.");
        });*/
    
        tl.showLoadingMessage();
        console.log("done loading events.  Now adding events into Timeline.");
        eventSource.loadJSON(eventsJSON, eventDataURL);
        console.log("done adding events to Timeline.");
        tl.hideLoadingMessage();

        tl.layout();


        console.log("loading chapters...");
        //$.getJSON(chapterDataURL, function(data) {
        //tl.loadJSON(chapterDataURL, function(data, url) {
        (function(data) {
            var band = tl.getBand(0),
                chapters = data.chapters,
                                        // dummy object to simplify code later
                $highlightedChapter = {"addClass" : function(){}};

            /*$("#patientNotesTemplate").tmpl(data).appendTo("#patientNotesContainer"); 

            $.each(data.chapters, function() {
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
                    highlightIndexClass = "chapter-index-"+index,
                    $labelNode = $(this.nextSibling);

                console.log("centerDate = ", centerDate);

                // since page is pre-rendered, need to remove the span that is added by calls to $().button()
                // before we can call it later to set up these buttons
                $labelNode.text($labelNode.find("span").text());
                

                $(this).data("centerDate", centerDate)
                    .data("chapterIndex", highlightIndexClass)
                    .button()     // it's already been pre-rendered as a button
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

            // since JSON is already preloaded, we know that this will always happen
            $("body").off("click", disableUI);
            disableUI = function(){};            

            $("#patientNotesNav input:radio").first().click();
            //  don't need this if a chapter is selected by default, as the selection handler will take care of this
            //$("#patientNotes p").hide();  

            console.log("done loading chapters");
        })(chaptersJSON);

        doPreFetch();
    });
});

/*window.Sandbox = function() {
	alert("Sandbox has completed it's work and can no longer be used.")
};*/

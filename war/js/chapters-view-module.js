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


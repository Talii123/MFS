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
        renderChapters = function renderChapters(chapters, anOffset) {
            // should not need try block?
            try {
                // TODO: rename these templates to renderXXX instead of addXXX (it's confusing the way it is now)
                $("#addChapterTabTemplate").tmpl({"chapters" : chapters, "offset" : anOffset}).appendTo("#patientNotesNav");
                $("#addChapterTextTemplate").tmpl({"chapters" : chapters, "offset" : anOffset}).appendTo("#patientNotes ul");

            } catch (e) {
                console.error(e);
            }
        };

    app.makeChapterHighlighter = function(ownerNode) {
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
    };

    app.loadChapters = function loadChapters(data, aTimeline, anOffset) {
        var band = aTimeline ? aTimeline.getBand(0) : null,
            chapters = data.chapters,
            anOffset = anOffset || 0;

        renderChapters(chapters, anOffset);


        $("#patientNotesNav input:radio").slice(anOffset).each(function(index, value) {
            var chapter = chapters[index],
                centerDate = new Date(
                    (new Date(chapter.start).getTime() + 
                     new Date(chapter.end).getTime()) / 2),
                chapterIndex = index + anOffset,
                highlightIndexClass = HIGHLIGHTED_INDEX_BASE_CLASSNAME + chapterIndex,
                $labelNode = $(this.nextSibling);

            console.log("centerDate = ", centerDate);

            // since page is pre-rendered, need to remove the span that is added by calls to $().button()
            // before we can call it later to set up these buttons
            //$labelNode.text($labelNode.find("span").text());
            

            $(this).data("centerDate", centerDate)
                .data("chapterIndex", chapterIndex)
                .button()     // it's already been pre-rendered as a button
                .click(function(event) {
                    var centerDate,
                        $this;

                    $this = $(this);
                    centerDate = $(this).data("centerDate");
                    console.log("centering on date...", centerDate);
                    app.centerOnDate(aTimeline, centerDate);

                    $("#patientNotes .chapter").hide();
                    $("#"+this.id+"_text").show();
                });

            if (band) {
                band.addDecorator(new Timeline.SpanHighlightDecorator({
                    startDate   :   chapter.start,
                    endDate     :   chapter.end,
                    cssClass    :   "ui-state-highlight hidden "+highlightIndexClass, 
                    opacity     :   30
                }));                     
            }         

        });//.first().click();

        if (aTimeline) {
            aTimeline.paint();                
        }

        /*
        // since JSON is already preloaded, we know that this will always happen
        $("body").off("click", disableUI);
        disableUI = function(){};            */

        console.log("done loading chapters");
    }

    app.enableChapterNav = function($patientNotesNav) {
        $patientNotesNav.on("click", "input:radio", app.makeChapterHighlighter($patientNotesNav))
            .find("input:radio").first().click();
        //  don't need this if a chapter is selected by default, as the selection handler will take care of this
        //$("#patientNotes p").hide();      	
    }
}


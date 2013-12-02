// WHOOPS!!  This is a viewer not an editor;
// TODO: remove this from all parts of the code; replaced with chapters-view-module.js

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

Sandbox.modules.chapter_editor = function (app) {
    var HIGHLIGHTED_INDEX_BASE_CLASSNAME = "chapter-index-";

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

    app.addChapters = function addChapters(data, aTimeline, anOffset) {
        var band = aTimeline ? aTimeline.getBand(0) : null,
            chapters = data.chapters,
            anOffset = anOffset || 0;

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

        // should not need try block?
        try {
            $("#addChapterTabTemplate").tmpl({"chapters" : chapters, "offset" : anOffset}).appendTo("#patientNotesNav");
            $("#addChapterTextTemplate").tmpl({"chapters" : chapters, "offset" : anOffset}).appendTo("#patientNotes ul");

        } catch (e) {
            console.error(e);
        }

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



        /*checkRequiredParam = function(paramName, paramValue) {
            if (!paramValue) {
                console.error("missing required parameter: ", paramName);
                return false;
            }

            return true;
        },

        /* later?
        makeChapterHighlighter = function(aSelector, chapterHighlighters, aTimeline) {
            
            var isValid = checkRequiredParam("chapters container", aSelector) &&
                        checkRequiredParam("chapterHighlighters", chapterHighlighters) && 
                        checkRequiredParam("aTimeline", aTimeline),
                $highlightedChapter = {"addClass" : function(){}};

            /* should not need to do this; no client input provided; if this is called wrong, it's a developer error 
            if (!isValid) {
                console.warn("invalid parameters passed to chapterHighlighter; chapter Highlighter will not be created. parameters=",arguments);
                return;
            }

            

            function updateHighlightedChapter($event) {

            }

            aSelector.on("click", chapterHighlighters, updateHighlightedChapter);

        }("#patientNotesNav", "input:radio", ),,*/
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
    var HIGHLIGHTED_INDEX_BASE_CLASSNAME = app.HIGHLIGHTED_INDEX_BASE_CLASSNAME; //"chapter-index-";



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


        //  This has been moved to chapters-viewer
        // should not need try block?
        // try {
        //     $("#addChapterTabTemplate").tmpl({"chapters" : chapters, "offset" : anOffset}).appendTo("#patientNotesNav");
        //     $("#addChapterTextTemplate").tmpl({"chapters" : chapters, "offset" : anOffset}).appendTo("#patientNotes ul");

        // } catch (e) {
        //     console.error(e);
        // }
        app.renderChapters(chapters, anOffset);

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

}
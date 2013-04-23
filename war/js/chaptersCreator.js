

(function(data) {
    var chapters = data.chapters;

    console.log("chapters data: ", data);

    $("#patientNotesTemplate").tmpl(data).appendTo("#patientNotesContainer"); 

    $("#patientNotesNav input:radio").each(function(index, value) {
        $(this)
            .button()
            .click(function(event) {
                $("#patientNotes p").hide();
                $("#"+this.id+"_text").show();
            });

    }).first().click();

    // should not be needed anymore
    //tl.paint();

    //$("#patientNotesNav input:radio").first().click();
    //  don't need this if a chapter is selected by default, as the selection handler will take care of this
    //$("#patientNotes p").hide();

})(chaptersJSONData);       
 
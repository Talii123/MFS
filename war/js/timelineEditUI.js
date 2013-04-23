
$(function() {

	//$("#addEventFormControlsTemplate").tmpl().appendTo("#eventInfoTabs-surgery > .eventTypeVisibilityToggle");
	//$("#addSurgeryEventFormTemplate").tmpl({suffix: "_top", dateType: "range"}).prependTo("#eventInfoTabs-surgery > ul");
	$("#addEventFormTemplate").tmpl({suffix: "_top", eventType: ["Diagnosis", "Diagnosis"]}).appendTo("#eventInfoTabs-diagnosis > .eventTypeVisibilityToggle");	
	$("#addEventFormTemplate").tmpl({suffix: "_top", eventType: ["Surgery", "Surgery"]}).appendTo("#eventInfoTabs-surgery > .eventTypeVisibilityToggle");
	$("#addEventFormTemplate").tmpl({suffix: "_top", eventType: ["Chemo", "Chemotherapy"]}).appendTo("#eventInfoTabs-chemotherapy > .eventTypeVisibilityToggle");
	//$("#addEventFormTemplate").tmpl({suffix: "_top", eventType: ["Radiation", "Radiation"]}).appendTo("#eventInfoTabs-radiation > .eventTypeVisibilityToggle");
	$("#addEventFormTemplate").tmpl({suffix: "_top", eventType: ["Immuno", "Cell Therapy"]}).appendTo("#eventInfoTabs-immunotherapy > .eventTypeVisibilityToggle");
	$("#addEventFormTemplate").tmpl({suffix: "_top", eventType: ["Test", "Test"]}).appendTo("#eventInfoTabs-test > .eventTypeVisibilityToggle");
	

	$(".addEventFormLink").button().click(function($event) {
		var $this = $(this);
		$event.preventDefault();


		$( ".addEventForm", $this.parent().parent() ).slideDown();
		$this.hide().next().show();

		/*$(this).hide();
		$(this).nextAll(".cancelButton").show();*/
	});

	$(".cancelButton").button().click(function() {
		var $this = $(this);

		$(".addEventForm", $this.parent().parent() ).slideUp();
		$this.hide().prev().show();
	})


    $(".addEvent").click(addEvent);
    //$("#updateEvent").click(updateEvent);
    //$("#deleteEvent").click(deleteEvent);
    //$("#cancelEditEvent").click(cancelEditEvent);	
});
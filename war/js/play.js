Sandbox(["common", "timeline_view", "timeline_edit", "chapter_viewer", "chapter_editor"], function (app) {

    var CANONICAL_DATE_FORMAT = "longDate",
        ERROR_WRAPPER_EL = "li",
        DEFAULT_VALIDATION_CONFIG = {
            debug   :   true,   // always keep this (even in production) 
            // make this point to nothing on purpose; don't want default labels,
            //      but we do want other default behaviours 
            errorLabelContainer: "#theAbyss .hidden", //ERROR_LABEL_CONTAINER_SELECTOR,
            wrapper: ERROR_WRAPPER_EL,
            focusInvalid: false,
            highlight: function(element, errorClass, validClass) {
                console.log("highlight called");
                $(element).addClass(errorClass).removeClass(validClass);
                $(element.form).find("label[for=" + element.id + "]")
                    .addClass(errorClass);
                console.log("done highlighting");
            },
            unhighlight: function(element, errorClass, validClass) {
                console.log("unhighlight called");
                $(element).removeClass(errorClass).addClass(validClass);
                $(element.form).find("label[for=" + element.id + "]")
                    .removeClass(errorClass);
                console.log("done unhighlighting");
            }
        }, 
        makeShowErrors = function(errorHelper) {
            return function(errorMap, errorList) {
                var fieldToRemove,
                    invalidFields;

                //$(".msgBox").html("Oops!  There are a couple of <a class='errorsDialogLink'>errors</a>");
                
                if (errorList.length === 0) {
                    // this was an eager validation of a single input field, which is now valid
                    fieldToRemove = this.successList[0].name;
                    console.log("going to remove ", fieldToRemove, " from errors");
                    errorHelper.clearError(fieldToRemove);
                }
                else {
                    // should probably not be accessing internals of the validator but..
                    invalidFields = this.invalid;

                    if (errorList.length > 1) {
                        // entire form validated
                        errorHelper.setErrors(errorMap);
                    }
                    else {  // errorList.length === 1
                        // eager validation of a single field has failed or validation of an entire
                        // form with exactly one error
                        // DO NOT call errorHelper.setErrors({}) as that will replace all errors
                        $.each(errorMap, function(errorField, msg) {
                            errorHelper.setError(errorField, msg);
                        });
                    }
                }       

                // this mutates the errorMap in strange ways; do your own processing before calling it.
                this.defaultShowErrors();                          
            }
        },
                    
        tl,
        updater,
        user = app.user,
        /* { TAL TODO: remove before going live} dao = app.getDAO(), */
        eventIDGenerator = (function (aUser, aSeed) {
            var SEPARATOR_CHAR = "_"
                seed = aSeed || new Date().getTime(),
                user = aUser || "anonUser",
                count = 0,
                lastID = "",

                makeID = function () {
                    ++count;
                    lastID = user + SEPARATOR_CHAR + seed + SEPARATOR_CHAR + count;
                    return lastID;
                },
                getLastID = function () {
                    return lastID;
                };

            return {
                "makeID"        :   makeID,
                "getLastID"     :   getLastID
            };
        })(user, new Date().getTime()),

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

        // depends on dateFormat.js from http://blog.stevenlevithan.com/archives/date-time-format
        normalizeDateString = (function(theCanonicalDateStringFormat) {
            return function(aDateString) {
                return aDateString && dateFormat(aDateString, theCanonicalDateStringFormat)
            };
        })(CANONICAL_DATE_FORMAT),

        formatDateString = function(aDateString, aFormat) {
            return aDateString && aFormat && dateFormat(aDateString, aFormat);
        },

        formToJSON = function(aForm) {
            var obj = {};

            if (aForm) {
                /* this should have already happened, since form validation should happen before
                 * the form is converted to an event specifier

                 * $.Watermark.HideAll();
                 */

                $("input[type!='checkbox'], select, textarea", aForm).not("[type='button']").each(function() {
                    obj[this.name] = this.value;
                });
                $("input[type='checkbox']", aForm).each(function() {
                    obj[this.name] = this.checked ? "YES" : "NO";
                })

                /*
                 * In theory, this could happen here, since the form shas already been validated,
                 * and the form data extracted; however, we don't want to reset the form until
                 * the event is actually added; if for some reason there was a bug that prevented
                 * the event from being added, and there was a way to recover from that bug, we
                 * don't want to wipeout the user's data from the form just yet
                 *
                 * $.Watermark.ShowAll();
                 */

                // all events have a start!
                obj.start = normalizeDateString(obj.start);
                if (typeof obj.end === "string") {
                    obj.end = $.trim(obj.end);
                    if (obj.end.length > 0) {
                        obj.end = normalizeDateString(obj.end);
                    }
                    else {
                        delete obj.end;
                    }
                }
            }
            return obj;
        },

        fillEditDiv = function(anEvent) {
            $("#editEventDiv").find("input, select, textarea").not("[type='button']").each(function() {
                this.value = anEvent.getProperty(this.name) || "";  // need to set to "" in case where property isn't found so that we clear out any leftover value from previously edited event
            });
        },       

        addEvent = function(/* $clickEvent */ formObj) {
            var eventsJSON = {
                    "dateTimeFormat": "Gregorian"
                },
                //formObj,
                eventDataObj,
                eventID;

            /*// prevent default before doing anything that might fail
            clickEvent.preventDefault();*/

            eventID = eventIDGenerator.makeID();
            //formObj = $clickEvent.target.form;
            eventDataObj = formToJSON(formObj);
            eventDataObj["eventID"] = eventID;
            eventDataObj["id"] = eventID;
            console.log("eventData", eventDataObj);
            eventsJSON["events"] = [eventDataObj];
            console.log("eventsJSON", eventsJSON);
            eventSource.loadJSON(eventsJSON, eventDataURL);
            tl.getBand(0).setCenterVisibleDate(SimileAjax.DateTime.parseGregorianDateTime(eventDataObj["start"]));
            
            /* saving data on the server is the responsibility of the DAO; we are not going to 
             * wait for an ack that the data is saved before allowing the user to enter/modify
             * more data, so reset the input form now, and trust the DAO to save the data
             */
            formObj.reset();
            $.Watermark.ShowAll();

            /* { TAL TODO: remove before going live}
            dao.addEvent(eventDataObj);
            //dao.addEvent(eventSource.getEvent(eventID));
            */
        },

        updateEvent = function(clickEvent) {
            var formDataObj,
                editForm,
                updatedEvent;

            /*// prevent default before doing anything that might fail
            clickEvent.preventDefault();*/

            editForm = $("#editEventForm");
            formDataObj = formToJSON(editForm);
            /*formDataObj.text = formDataObj.title;
            if (!formDataObj.end) formDataObj.end = formDataObj.start;*/
            console.log("eventData", formDataObj);
            /*updatedEvent = new Timeline.DefaultEventSource.Event(formDataObj);
            console.log("updatedEvent: ", updatedEvent);
            eventSource.updateEvent(updatedEvent);*/
            eventSource.updateEvent(formDataObj);
            toggleAddEdit("add");
        },

        deleteEvent = function($eventObj) {
            var eventNode,
                eventID;

            // TODO: make this a dialog not a popup!!!
            if (confirm("Are you sure you want to delete this event?")) {
                $eventNode = $($eventObj.target).parents(".event");
                eventID = $eventNode[0].id;
                console.log("deleteing event with ID: ", eventID);
                eventSource.deleteEvent(eventID);

                $eventNode.remove();

                /* { TAL TODO: remove before going live}
                dao.deleteEvent(eventID);
                */
            } 
        },

        makeErrorHelper = function (anErrorsContainerSelector, aWrapper) {
            var INVALID_DIALOG_TITLE = "Just a couple of things for you to correct",
                VALID_DIALOG_TITLE = "Looking good!",
                currentErrors = {},
                errorsContainerSelector = anErrorsContainerSelector,
                mode = "valid",

                getErrorHTML = function(anErrorField, aMsg) {
                   return "<" + aWrapper + " name='" + anErrorField + "'>" + aMsg /* + " "  + anErrorField + ERROR_WRAPPER_END_TAG*/ +"<\/" + aWrapper +">";
                },
                getErrorNode = function(anErrorField) {
                    return $(errorsContainerSelector + " " + aWrapper + "[name='"+anErrorField+"']");
                },
                toggleIfNeeded = function() {
                    if (mode === "valid" && !$.isEmptyObject(currentErrors)) {
                        mode = "invalid";

                        $(errorsContainerSelector).parent()
                            .find(".invalid").show().end()
                            .find(".valid").hide().end()
                            .parent().find(".ui-dialog-title").text(INVALID_DIALOG_TITLE);
                    }
                    else if (mode ==="invalid" && $.isEmptyObject(currentErrors)) {
                        mode = "valid";

                        $(errorsContainerSelector).parent()
                            .find(".valid").show().end()
                            .find(".invalid").hide().end()
                            .parent().find(".ui-dialog-title").text(VALID_DIALOG_TITLE);
                    }
                }; 

            $(anErrorsContainerSelector).parent().parent().find(".ui-dialog-title").text(VALID_DIALOG_TITLE);

            return {
                setError :  function (errorField, msg) {
                    var $node = getErrorNode(errorField),
                        errorHTML;

                    currentErrors[errorField] = msg;
                    if ($node.length > 0) {
                        $node.html(msg);
                    }
                    else {
                        $(errorsContainerSelector).prepend(getErrorHTML(errorField, msg));
                    }
                    toggleIfNeeded();
                },
                setErrors : function (anErrorMap) {
                    var htmlStrs = [];
                    $.extend(currentErrors, anErrorMap);
                    $.each(currentErrors, function (field, msg) {
                        htmlStrs.push(getErrorHTML(field, msg));
                    });
                    $(errorsContainerSelector).html(htmlStrs.join(""));

                    toggleIfNeeded();
                },
                clearError : function(errorField) {
                    delete currentErrors[errorField];
                    getErrorNode(errorField).remove();

                    toggleIfNeeded();
                },
            };

        },

        chapterEditor = (function makeChapterEditor(anErrorHelper) {
            var CHAPTER_NAV_SELECTOR = "#patientNotesNav",
                CHAPTER_TXT_CONTAINER_SELECTOR = "#patientNotesContainer",
                //CHECKED_RADIO_BTN_SELECTOR = "input[type='radio']:checked",
                ALL_CHAPTER_BUTTONS_SELECTOR = CHAPTER_NAV_SELECTOR + " input[type='radio']",
                TAB_TITLE_ID = "newChapterTabTitle",               
                $MODIFY_CHAPTERS_CONTROLS_DIV,
                theChapterEditor = this,
                CHAPTER_ERROR_LABEL_CONTAINER_SELECTOR = "#errorsDialog .errors";

            getChapterButtons = function() {
                return $(ALL_CHAPTER_BUTTONS_SELECTOR);
            },

            getCurrentChapterBtn = function () { 
                //return $(CHAPTER_NAV_SELECTOR).find(CHECKED_RADIO_BTN_SELECTOR);
                return getChapterButtons().filter(":checked");
            },

            getCurrentChapterID = function () {
                var $currentBtn = getCurrentChapterBtn();
                return $currentBtn.length > 0 ? currentBtn.prop("id") : "";
            },

            getChapterCount = function () {
                return getChapterButtons().length;
            }

            getChapterTextIDFromButtonID = function (aButtonID) {
                return "#"+aButtonID+"_text";
            },

            getNextButton = function($thisButton) {
                return $thisButton.next().next();
            },
            getPrevButton = function($thisButton) {
                return $thisButton.prev().prev();
            },            

            deleteChapter = function($eventObj) {
                var $patientNotesNav = $(CHAPTER_NAV_SELECTOR),
                    $patientNotesContainer = $(CHAPTER_TXT_CONTAINER_SELECTOR),
                    $chapterTextDiv,
                    $chapterSelectorButton,
                    currentChapterID,
                    //eventID,
                    $buttonToSelect;

                $eventObj.preventDefault();

                $chapterSelectorButton = getCurrentChapterBtn();
                if ($chapterSelectorButton.length <= 0) {
                    console.error("User is trying to delete a chapter, but none is selected.");
                    return;
                }
                currentChapterID = $chapterSelectorButton.prop("id");
                if (currentChapterID.length <= 0) {
                    console.error("User is trying to delete a chapter, but none is selected.");
                    return;
                }

                // TODO: make this a dialog not a popup!!!
                if (confirm("Are you sure you want to delete this chapter?")) {

                    $chapterTextDiv = $(getChapterTextIDFromButtonID(currentChapterID), $patientNotesContainer);

                    $buttonToSelect = getNextButton($chapterSelectorButton);
                    if ($buttonToSelect.length <= 0) {
                        $buttonToSelect = getPrevButton($chapterSelectorButton);
                    }

                    $chapterSelectorButton
                        .hide()
                        .button("destroy")
                        .next().remove()
                        .end().remove();

                    $chapterTextDiv.remove();

                    if ($buttonToSelect.length > 0) {
                        //$buttonToSelect.find("span").click();
                        $buttonToSelect.click();
                    }
                    else {
                        $(".deleteEventTrigger", $MODIFY_CHAPTERS_CONTROLS_DIV).hide();
                    }

                    /* { TAL TODO: remove before going live}
                    dao.deleteChapter(eventID);
                    */
                } 
            },  

            addChapter = function(formObj) {
                var chaptersJSON = {},
                    chapterDataObj,
                    eventID;

                /*// prevent default before doing anything that might fail
                clickEvent.preventDefault();*/

                eventID = eventIDGenerator.makeID();
                //formObj = $clickEvent.target.form;
                chapterDataObj = formToJSON(formObj);
                // need this for now; should try to standardize on just one name for this field;
                chapterDataObj.text = chapterDataObj.description;

                chapterDataObj["eventID"] = eventID;
                chapterDataObj["id"] = eventID;
                console.log("chapter data: ", chapterDataObj);
                chaptersJSON["chapters"] = [chapterDataObj];
                console.log("chaptersJSON", chaptersJSON);

                app.addChapters(chaptersJSON, tl, getChapterButtons().length);
                
                /* saving data on the server is the responsibility of the DAO; we are not going to 
                 * wait for an ack that the data is saved before allowing the user to enter/modify
                 * more data, so reset the input form now, and trust the DAO to save the data
                 */
                formObj.reset();
                $.Watermark.ShowAll();

                // there is now at least one chapter so show the 'delete chapter' button
                // (it may have been hidden if there were zero chapters at some point)
                if ($(".addEventFormLink", $MODIFY_CHAPTERS_CONTROLS_DIV).not(":hidden").length > 0) {
                    // but only if the add chapter button is showing!
                    $(".deleteEventTrigger", $MODIFY_CHAPTERS_CONTROLS_DIV).show();    
                }

                getChapterButtons().last().click();

                /* { TAL TODO: remove before going live}
                dao.addChapter(chaptersJSON);
                */
            },  

            enableAddingChapters = function() {
                var CHAPTER_ERRORS_CONTAINER_SELECTOR = "#patientNotesContainer .msgBox",   
                    validationConfig = $.extend(
                        {}, 
                        DEFAULT_VALIDATION_CONFIG, 
                        {
                            errorContainer: CHAPTER_ERRORS_CONTAINER_SELECTOR,
                            messages: {
                                "title"         :   "Every chapter has to have a title",
                                "start"         :   "Every chapter has to have a beginning.. (start date)",
                                "end"           :   "Every chapter has to have an end. (end date) ",
                                "description"   :   "Every chapter needs to tell a story!  (description)"
                            },
                            showErrors      :   makeShowErrors(makeErrorHelper(CHAPTER_ERROR_LABEL_CONTAINER_SELECTOR, ERROR_WRAPPER_EL))
                        }
                    ),

                    $patientNotesContainer = $(CHAPTER_TXT_CONTAINER_SELECTOR),

                    createAddChapterForm = function() {
                        //$("#addEventFormControlsTemplate").tmpl({eventType: ["Chapter", "Chapter"]}).appendTo("#patientNotesHeader");
                        $("#modifyChaptersControlsTemplate").tmpl().appendTo("#patientNotesHeader");
                        $MODIFY_CHAPTERS_CONTROLS_DIV = $(".modifyChaptersControls");

                        $("#addEventFormTemplate").tmpl({eventType: ["Chapter", "Chapter"]}).appendTo("#patientNotes");
                        //$("#addChapterFormTemplate").tmpl().appendTo("#patientNotes");
                        // extra template needed for the chapters GUI only
                        $("#addNewChapterTabTemplate").tmpl({tabTitleID : TAB_TITLE_ID})
                            .css("display", "none")
                            .appendTo("#patientNotesNav");
                    },
                    addValidator = function() {
                        var $this = $(this);
                        //$(CHAPTER_ERRORS_CONTAINER_SELECTOR).html("Oops!  There are a couple of <a class='errorsDialogLink'>errors</a>");

                        validationConfig.submitHandler = function(validatedFormObj) {
                            theChapterEditor.addChapter(validatedFormObj);
                        }
                        $this.validate(validationConfig);
                    },
                    showAddChapterForm = function($event) {
                        var $addEventForm;

                        $event.preventDefault();

                        $addEventForm = $( ".addEventForm", $patientNotesContainer);
                        $addEventForm.prev().slideUp();

                        $addEventForm.slideDown();
                        
                        $(".addEventFormLink, .deleteEventTrigger", $MODIFY_CHAPTERS_CONTROLS_DIV).hide();
                        $(".cancelButton", $MODIFY_CHAPTERS_CONTROLS_DIV).show();

                        $("#l_"+TAB_TITLE_ID).show();
                    },
                    hideAddChapterForm = function($event) {
                        var $this = $(this),
                            $addEventForm;

                        $addEventForm = $( ".addEventForm", $patientNotesContainer);
                        $addEventForm.prev().slideDown();
                        $addEventForm.slideUp();

                        $(CHAPTER_ERRORS_CONTAINER_SELECTOR).hide();
                        $(".cancelButton", $MODIFY_CHAPTERS_CONTROLS_DIV).hide();
                        $(".addEventFormLink, .deleteEventTrigger", $MODIFY_CHAPTERS_CONTROLS_DIV).show();                    

                        $("#l_"+TAB_TITLE_ID).hide();
                    };
                        
                createAddChapterForm();
                $("form").each(addValidator);
                $("#patientNotesContainer").on("click", "a.errorsDialogLink", function($event) {
                    $event.preventDefault();

                    $("#errorsDialog").dialog("open");
                });

                $modifyChaptersControls = $(".modifyChaptersControls");
                $(".addEventFormLink", $modifyChaptersControls).button().click(showAddChapterForm);
                $(".cancelButton", $modifyChaptersControls).button().click(hideAddChapterForm);
                $(".deleteEventTrigger", $modifyChaptersControls).button().click(deleteChapter);
            }

            return {
                "deleteChapter"     :   deleteChapter,
                "addChapter"        :   addChapter,
                "init"              :   enableAddingChapters
            };
        })(/*errorHelper*/),


        cancelEditEvent = function(clickEvent) {

            /*// prevent default before doing anything that might fail
            clickEvent.preventDefault();*/
            toggleAddEdit("add");
        },



        enableAddingEvents = function() {    
            var eventValidationConfig = $.extend(
                    {},
                    DEFAULT_VALIDATION_CONFIG,
                    {
                        submitHandler   :   addEvent,
                        /*errorContainer:  {filled in when setting up validators, based on eventType } */
                        messages: {
                            "title"  :   "Every medical event has to have a title",
                            "start"  :   "Every medical event has to have a beginning.. (start date)",
                            "description" : "This medical event needs to include a description!  (description)"
                        }
                    }
                ),
                formTmplConfig = {
                    suffix: "_top" 
                    //intoDOM: appendToFunc,
                },
                eventTypes = [
                    ["Diagnosis", "Diagnosis"],
                    ["Surgery", "Surgery"],
                    ["Chemo", "Chemotherapy"],
                    ["Radiation", "Radiation"],
                    ["Immuno", "Cell Therapy"],
                    ["Test", "Test"]
                ],
                locations = [
                    "#eventInfoTabs-diagnosis > .eventTypeVisibilityToggle",
                    "#eventInfoTabs-surgery > .eventTypeVisibilityToggle",
                    "#eventInfoTabs-chemotherapy > .eventTypeVisibilityToggle",
                    "#eventInfoTabs-radiation > .eventTypeVisibilityToggle",
                    "#eventInfoTabs-immunotherapy > .eventTypeVisibilityToggle",
                    "#eventInfoTabs-test > .eventTypeVisibilityToggle"
                ],

                createAddEventForm = function(index, eventTypeKeyAndStr) {
                    var $location = $(locations[index]),
                        $tab = $location.parent(),
                        validationConfig,
                        eventTypeKey = eventTypeKeyAndStr[0],
                        errorsContainerSelector = ".eventTypeContent." + eventTypeKey + " .msgBox",
                        errorsDialogSelector = "#errorsDialog"+eventTypeKey,
                        errorMsgsContainerSelector = errorsDialogSelector + " .errors";
                    
                    formTmplConfig.eventType = eventTypeKeyAndStr;

                    $("#addEventFormControlsTemplate").tmpl(formTmplConfig).appendTo($location);
                    $("#addEventFormTemplate").tmpl(formTmplConfig).appendTo($location);

                    validationConfig = $.extend(
                        {
                            errorContainer  :   errorsContainerSelector,
                            showErrors      :   makeShowErrors(makeErrorHelper(errorMsgsContainerSelector, ERROR_WRAPPER_EL))
                        },
                        eventValidationConfig/*,
                        anEventTypeValidationConfig*/
                    );

                    $("#errorsDialogTemplate").tmpl(formTmplConfig).appendTo($tab);
                    $location.find("form").validate(validationConfig);

                    // should really be just one function at the tabs container level..
                    $tab.on("click", "a.errorsDialogLink", function($event) {
                        $event.preventDefault();

                        //$(".dialog", $tab).dialog("open");
                        $(errorsDialogSelector).dialog("open");
                    });                    
                },

                showAddEventForm = function($event) {
                    var $this = $(this);

                    $event.preventDefault();

                    $( ".addEventForm", $this.parent().parent() ).slideDown();
                    $this.hide().next().show();
                },

                hideAddEventForm = function() {
                    var $this = $(this);

                    $(".addEventForm", $this.parent().parent() ).slideUp();
                    $this.hide().prev().show();
                };

            // Modify the DOM - add forms and buttons needed for adding medical events and chapters
            $.each(eventTypes, createAddEventForm);


            // validate ALL forms
            // NOTE: this cannot happen before all the templating is done and the forms are
            // inserted into the DOM
            //$("form").each(addValidator);

            // setup behaviours for newly added links and buttons used to add events

            /* these should be set once, at the tabs container level */

            // button/link for showing an add event/chapter form
            $(".addEventFormLink").not(".Chapter")
                .button()
                .click(showAddEventForm);
            

            // button for cancelling the add event process and hiding the form
            $(".cancelButton").not(".Chapter")
                .button()
                .click(hideAddEventForm);
        },        

        setupEventInputValidation = function() {
            $.validator.setDefaults(DEFAULT_VALIDATION_CONFIG);
            /*$.validator.addMethod("dateRange", 
                function dateRangeValidator( value, element, param ) {
                    
                    return this.optional(element) || 
                }, 
                [message]
            );*/

            $.validator.addMethod("name", 
                function nameValidator( value, element, param) {
                    // simple charatcter class from "Javascript the Good Parts" + the '.' chracter for inputs including things like "Dr."
                    return this.optional(element) || /[A-Za-z\u00C0-\u1FFF\u2800-\uFFFD\.]*/.test(value);
                },
                "Please enter a name.  (e.g. 'Dr. John Smith III')"
            );

            $.validator.addClassRules("maxLength-10", {
                maxlength   :   10
            });           
        },

        setupWatermarks = function() {
            $("input[name='title']")
                .not(".Chapter").Watermark("Please enter a name for this event")
            .end()
                .filter(".Chapter").Watermark("Please enter a title for this chapter");
            $("input[type='text'][name!='title'][name!='start'][name!='end'][id!='newChapterTabTitle']").Watermark("(optional)");

            $("#newChapterTabTitle").Watermark("Tab Title");
        },

        initDatePickers = function(defaults) {
            var fixDatePickerStupidity = function () {
                /* remove the zIndex value set by the OTB showDatePicker function because it's stupid;
                 * the OTB functinon relies on a function called zIndex, which is used by other
                 * code so I don't want to change it.  
                 * that zIndex function will look for a z-index on the specified element (in this case,
                 * the form input), and move up the DOM tree until it finds one. 
                 * The reason why it fails here is because the inputs on the form are statically 
                 * positioned, and the z-index function ignores those elements cuz z-index doesn't make
                 * sense for those elements.  That's fine, but then the input div shouldn't be setting
                 * it's z-index based on those guys.
                 */                
                $("#ui-datepicker-div").css("zIndex", "");
            };

            $.datepicker.setDefaults(defaults);

            $("input[name='start'], input[name='end']").each(function() {
                $(this)
                    .after('<span class="datePicker" style="float: right;"></span>')
                    .datepicker()
                    .on("click focus", fixDatePickerStupidity)
                    .next().on("click focus", fixDatePickerStupidity);
            });
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
        },

        makeControlsToggle = function controlsToggle(containerClass, controlsClass, displayVal) {
            return function($UIevent) {
                var $element = $($UIevent.target);
                if (!$element.hasClass(containerClass)) {
                    $element = $element.parents("."+containerClass)[0];
                }
                $("."+controlsClass, $element).css("display", displayVal);
            }
        },

        /*showChapterControls = makeControlsToggle("chapter", "chapterControls", "inline-block"),
        hideChapterControls = makeControlsToggle("chapter", "chapterControls", "none"),*/
        showEventControls = makeControlsToggle("event", "eventControls", "inline-block"),
        hideEventControls = makeControlsToggle("event", "eventControls", "none");


    $(function() {
        // DEPENDANCY: themer.js
        app.initThemer();
        // END DEPENDANCY: themer.js
        
        // DEPENDENCY: jQueryUI.js
        $(".tabs").tabs();

        // END DEPENDENCY jQueryUI.js


        // DEPENDENCY: timeline js
        buildTimeline();
        // this should probably be merged with augmentListeners()
        eventSource.addListener(app.createEventInfoUpdater(".eventTypeContent ul"));
        // set up tl for delete and edit events
        tl.augmentListeners();

        $("#eventInfoBox")
            .on("click", ".eventTitle a", makeTitlesSelectEventsInTL)
            .on("mouseenter", ".event", showEventControls)
            .on("mouseleave", ".event", hideEventControls)
            .on("click", ".eventTypeContent .deleteEventTrigger", deleteEvent);
        // endableDeletingEvents() ? :)
        //$("#eventInfoBox").on("click", ".eventTypeContent .deleteEventTrigger", deleteEvent);

        $("#patientNotes")
            /*.on("mouseenter", ".chapter", showChapterControls)
            .on("mouseleave", ".chapter", hideChapterControls)*/
            .on("click", ".deleteEventTrigger", deleteChapter);

        setupEventInputValidation();
        enableAddingEvents();
        //$("#updateEvent").click(updateEvent);
        //$("#cancelEditEvent").click(cancelEditEvent); 

        $(window).resize(app.getResizer(tl));
        
        // END DEPENDENCY Timeline.js


        // DEPENDENCY: Timeline.js, JSON files
        $("#eventInfoTabs input:radio").button().click(function() {
            app.updateEventTypeVis(this);
        });          

        tl.layout();

        enableAddingChapters();
        app.addChapters(chaptersJSON, tl);
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


        //setupWatermarks();
        initDatePickers({
            altField    :   $(this).prevAll(".date")[0],
            altFormat   :   "MM d, yy",
            showOn      :   "both",
            buttonImage :   "images/calendar.gif",
            buttonImageOnly     :   true,
            changeMonth :   true,
            changeYear  :   true  
        });

        // make sure watermarks are not confused for user input during validation
        // by removing them;
        // the watermarks will be restored after successful validation; (maybe this should
        //   be changed so that it's restored in other situations as well)
        $(".addEvent").click(function beforeValidate() {
            $.Watermark.HideAll();
        }); 

        // maybe this will rid the calendar bug once and for all?
        $("#ui-datepicker-div").css("zIndex", "");

        (function (box) {
            var nextFormPart = function($UIevent) {
                var thisFormPart = $(this).parents(".formPart").first(),
                    nextFormPart = thisFormPart.next(".formPart");
                
                thisFormPart.hide("slide");
                nextFormPart.show("drop");
            },
            prevFormPart = function($UIevent) {
                var thisFormPart = $(this).parents(".formPart").first(),
                    prevFormPart = thisFormPart.prev(".formPart");
                
                prevFormPart.show("drop");
                thisFormPart.hide("slide");                
            };

            box.on("click", ".nextFormPartButton", nextFormPart)
                .on("click", ".prevFormPartButton", prevFormPart)
                .find(".formPart").not(":first").hide();

        })($(".slidingBox"));

        app.doPreFetch();
    });
});

/*window.Sandbox = function() {
	alert("Sandbox has completed it's work and can no longer be used.")
};*/

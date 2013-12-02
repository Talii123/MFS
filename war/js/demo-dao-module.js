var errorMsg = "Sandbox is not defined.  DAO module will not be loaded.";

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

Sandbox.modules.dao = function (app) {

	var chaptersJSON = {
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
                "type"              :       "TEST",
                "typeDetails"       :       {
                    "testType"   :      "ULTRASOUND"
                },
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
                "type"              :       "TEST",
                "typeDetails"       :       {
                    "testType"   :      "CT_SCAN"
                },
                "description"       :       "CT scan demonstrated 8cm tumor infiltrating the common bile duct.  Further testing needed to determine tumor type.  \\n\\nPossible diagnosis: \\n\\nCholangiocarcinoma \\nHepatocellular Carcinoma \\nFibrolamellar Hepatocellular Carcinoma \\nFocal Nodular Hyperplasia",
                "pDescription"      :       "After a few hours in the ER, they took me upstairs to do a CT scan.  Afterwards they told me that there was an 8cm tumor blocking the bile duct - a tube that connects to the liver.  They were not sure if it was a liver tumor that grew into the bile duct or a bile duct tumor that grew into the liver."
            }, {
                "start"             :       "Mon Sep 11 2006 10:00:00",
                "title"             :       "CT scan",
                "durationEvent"     :       false,
                "typeIndex"         :       5,
                "type"              :       "TEST",
                "typeDetails"       :       {
                    "testType"   :      "CT_SCAN"
                }
            }, {
                "start"             :       "Tue Sep 12 2006 10:00:00",
                "title"             :       "Ultrasound",
                "durationEvent"     :       false,
                "typeIndex"         :       5,
                "type"              :       "TEST",
                "typeDetails"       :       {
                    "testType"   :      "ULTRASOUND"
                }
            }, {
                "start"             :       "Tue Sep 11 2006 11:00:00",
                "title"             :       "MRI",
                "durationEvent"     :       false,
                "typeIndex"         :       5,
                "type"              :       "TEST",
                "typeDetails"       :       {
                    "testType"   :      "MRI"
                }
            }, {
                "start"             :       "Thu Sep 14 2006 15:00:00",
                "title"             :       "Stent + Percutaneous Drain implanted",
                "durationEvent"     :       false,
                "typeIndex"         :       5,
                "type"              :       "TEST",
                "typeDetails"       :       {
                    "testType"   :      "ULTRASOUND"
                }
            }, {
                "start"             :       "Thu Sep 14 2006 15:00:00",
                "title"             :       "Fine Needle Biopsy",
                "durationEvent"     :       false,
                "typeIndex"         :       5,
                "type"              :       "TEST",
                "typeDetails"       :       {
                    "testType"   :      "ULTRASOUND"
                }
            }, {
                "start"             :       "September 15, 2006",
                "end"               :       "September 15, 2006",
                "title"             :       "First Diagnosis",
                "durationEvent"     :       false,
                "description"       :       "After all the tests were completed, I was diganosed with Fibrolamellar Hepatocellular Carcinoma.  I had an 8cm tumor in my liver, blocking the bile duct.",
                "typeIndex"         :       0,
                "type"              :       "DIAGNOSIS",
                "typeDetails"       :       {
                    "age"                       :       25,
                    "stage"                     :       "II ?",
                    "metastatic"                :       "no",
                    "diseaseSites"              :       ["liver"],
                    "lymphNodes"                :       "no",
                    "macroVascularInvasion"     :       "no",
                    "microVascularInvastion"    :       "yes"                    
                }
            }, {
                "start"             :       "Wed Nov 29 2006 00:08:00",
                "end"               :       "Nov 29 2006 00:16:00",
                "title"             :       "Liver Resection",
                "durationEvent"     :       false,
                "description"       :       "En bloc resection of the liver. 60% of the liver removed as well as the gall bladder, the entire biliary tree and a 10cm x 9cm x 8cm tumor.  Percutaneous drain and stent also removed.",
                "pDescription"      :       "My surgical oncologist, Dr. Newton, performed an 8 hour surgery.  She removed 60% of my liver, and also took out my gall bladder and all of the tubing connecting the liver and gall bladder to the other organs.  She then surgically attached the leftover liver to my intestines.  She also cut out a piece of my diaphragm because the liver tumor was abutting it.  Finally, she took out the tube that they put in my abdomen earlier to bypass the blocked bile duct and allow the bile to drain.\\n\\nFinally, she removed three lymph nodes, which were all negative (no cancer in them).\\n\\nShe told me that she got all of the cancer out and that hopefully it didn't have a chance to spread before the surgery.",
                "typeIndex"         :       1, 
                "type"              :       "SURGERY",
                "typeDetails"       :       {
                    "surgeon"                   :       "Dr. Melissa Newton",
                    "resident"                  :       ["Dr. Shamir", "Dr. Betzal"],
                    "hospital"                  :       "A Metro Hospital",
                    "location"                  :       "Toronto, ON, Canada",
                    "recoveryTimeHospital"      :       "7 days",
                    "recoveryTimeHome"          :       "about 3 months"                    
                }
            }, {
                "start"             :       "Sep 17 2007",
                "title"             :       "Recurrence",
                "description"       :       "There were two large tumors, one in my chest and one in my diaphragm.  There were also enlarged lymph nodes throughout my abdomen.",
                "typeIndex"         :       0,
                "type"              :       "DIAGNOSIS",
                "typeDetails"       :       {
                    "age"                       :       26,
                    "stage"                     :       "IV",
                    "metastatic"                :       "yes",
                    "diseaseSites"              :       ["diaphragm", "chest", "lymph nodes"],
                    "lymphNodes"                :       "yes",
                    "vascularInvasion"          :       "no",
                    "microVascularInvastion"    :       "unknown"
                }
            }, {
                "start"             :       "Oct 20 2007 00:00:00",
                "end"               :       "Oct 30 2007 00:00:00",
                "title"             :       "Nexavar (Sorafenib)",
                "durationEvent"     :       true,
                "description"       :       "Nexavar pills BID.",   
                "pDescription"      :       "I tried Nexavar for 10 days but had really bad side effects.\\n\\n  For a week I had terrible stomach cramps.  When that finally went away, I got a full body rash, my feet were so swollen I could barely get my shoes on and it hurt like hell to stand up.  Worst of all, my red blood cell counts were way off and I had to see a hematologist to make sure I wasn't in any danger from the chemo.\\n\\nIt took 2 weeks of prednisone for me to recover.  The medical oncologist wanted to try again at 1/8 the original dose, but I wanted to try a different treatment.",        
                "typeIndex"         :       2,
                "type"              :       "CHEMO",
                "typeDetails"       :       {
                    "result"                    :       "Progressive Disease",
                    "isRecommended"             :       "NO",
                    "oncologist"                :       "-- censored --",
                    "duration"                  :       "10 days",
                    "sideEffects"               :       ["Full Body Rash", "Extreme Swelling of the Feet", "Pain When Standing", "Elevated Red Blood Cell Counts", "Green Growths on My Fingers", "Hair Loss", "Fatigue"]
                }
            }, {
                "start"             :       "Dec 15 2007 00:08:00",
                "end"               :       "Dec 15 2007 00:16:00",
                "title"             :       "Diaphragm & Lymph Nodes Resection",
                "durationEvent"     :       false,
                "typeIndex"         :       1,
                "type"              :       "SURGERY",
                "description"       :       "Resection of enlarged lymph node from diaphragm.  Disection of diaphragm to access thoracic mass, completely excised.  Diaphragm repair.",
                "pDescription"      :       "Dr. Tremblay performed an 8 and a 1/2 hour surgery.  He removed an enlarged lymph node from my diaphragm, then cut a hole in my diaphragm so that he could get into my chest cavity where the other tumor was.  He then removed a mass from my chest.  \\n\\n He used the same incision site as last time so there is no new scar.  He also used a glue to close up the wound instead of staples, so the scar was much thinner.",
                "typeDetails"       :       {
                    "surgeon"                   :       "Dr. Tremblay",
                    "hospital"                  :       "M.D. Anderson Cancer Center",
                    "location"                  :       "Houston, TX, USA",
                    "recoveryTimeHospital"      :       "7 days",
                    "recoveryTimeHome"          :       "2 weeks"                    
                }
            },  {
                "start"             :       "Jan 28 2008 00:00:00",
                "end"               :       "Dec 08 2008 00:00:00",
                "title"             :       "5FU and Interferon Alpha",
                "durationEvent"     :       true,
                "description"       :       "3 week cycles of continuous 5FU infusion (2525mg/week) with subcutaneous injections of 8 million units of Interferon Alpha 3x weekly.",
                "pDescription"      :       "Cycles would last 3 weeks, with one week off between them.\\n\\nThe 5FU was administered with a bottle around the size of a baby bottle full of 5FU, which would slowly infuse into the body over the course of the week. At the end of each week, the empty bottle was replaced with a full one. Three bottles over three weeks would constitute one round.\\n\\nThe Interferon Alpha is administered with injections into fatty tissue - either in the belly or the thigh.",
                "typeIndex"         :       2,
                "type"              :       "CHEMO",
                "typeDetails"       :       {
                    "result"            :       "Partial Response",
                    "isRecommended"     :       "YES",
                    "duration"          :       "9 months",
                    "oncologist"        :       "-- censored --",
                    "sideEffects"       :       ["Extreme Fatigue", "Mouth Sores", "Thrush", "Muscle Aches", "Headaches", "Difficulty Thinking/Focusing", "Elevated Heart Rate (at the beginning of rounds 1 and 2 only)"]                    
                }
            },  {
                "start"             :       "Dec 09 2008 00:00:00",
                "end"               :       "Feb 28 2009 00:00:00",
                "title"             :       "Unmatched Donor Lymphocyte Infusions",
                "durationEvent"     :       true,
                "description"       :       "Injected with T-cells and Natural Killer cells from various unmatched donors.  Small non-chemotherapeutic doses of Avastin and Erbitux were administered to enhance the donated cells' ability to target the tumors.",
                "pDescription"      :       "Injected with T-cells and Natural Killer cells from various unmatched donors.  Small non-chemotherapeutic doses of Avastin and Erbitux were administered to enhance the donated cells' ability to target the tumors.",
                "typeIndex"         :       4,
                "type"              :       "IMMUNO",
                "typeDetails"       :       {
                    "result"            :       "Stable Disease",
                    "duration"          :       "3 months"                      
                }
            },  {
                "start"             :       "Apr 09 2009 00:00:00",
                "end"               :       "June 28 2009 00:00:00",
                "title"             :       "Three different cancer cell vaccines administered.",
                "durationEvent"     :       true,
                "description"       :       "Three different cancer 'vaccines' were prepared and administered. White blood cells were taken from my brother, who is an 80% match for me.\\n\\n Vaccine #1: My brother's T-cells and Natural Killer cells were mixed with my frozen tumor in a lab and then infused into me, along with IL2, Avastin and Erbitux.  \\nVaccine #2: My brother's dendritic cells were exposed to my frozen tumor and then infused into me along with IL2, Avastin and Erbitux.  \\nVaccine #3: My own T-cells were extracted and mixed with my brother's dendritic cells and my frozen tumor in the lab, and then infused into my body.",
                "pDescription"      :       "Three different cancer 'vaccines' were prepared and administered. White blood cells were taken from my brother, who is an 80% match for me.\\n\\n Vaccine #1: My brother's T-cells and Natural Killer cells were mixed with my frozen tumor in a lab and then infused into me, along with IL2, Avastin and Erbitux.  \\nVaccine #2: My brother's dendritic cells were exposed to my frozen tumor and then infused into me along with IL2, Avastin and Erbitux.  \\nVaccine #3: My own T-cells were extracted and mixed with my brother's dendritic cells and my frozen tumor in the lab, and then infused into my body.",
                "typeIndex"         :       4,
                "type"              :       "IMMUNO",
                "typeDetails"       :       {
                    "result"            :       "Stable Disease",
                    "duration"          :       "3 months"              
                }
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
                "type"              :       "DIAGNOSIS",
                "typeDetails"       :       {
                    "age"                       :       28,
                    "stage"                     :       "IV ?",
                    "metastatic"                :       "yes",
                    "diseaseSites"              :       ["lymph nodes in front of the heart", "lymph nodes in the abdomen"],
                    "lymphNodes"                :       "yes",
                    "vascularInvasion"          :       "no",
                    "microVascularInvastion"    :       "no"                    
                }
            }, {
                "start"             :       "Dec 17 2009 00:08:00",
                "end"               :       "Dec 17 2009 00:16:30",
                "title"             :       "Lymph Nodes Resection",
                "durationEvent"     :       false,
                "description"       :       "This surgery required two surgeons.  First, one surgeon removed the lymph nodes from in front of my heart.  Then, Dr. Tremblay came in to do the abdominal surgery.  Because Dr. Tremblay knew from the previous surgery about the scarring around my pancreas, he planned a different route to reach the suspicious lymph nodes and was able to remove them all.  Before closing me up, he did an ultrasound directly on my liver, which showed no sign of disease.",
                "pDescription"      :       "This surgery required two surgeons.  First, one surgeon removed the lymph nodes from in front of my heart.  Then, Dr. Tremblay came in to do the abdominal surgery.  Because Dr. Tremblay knew from the previous surgery about the scarring around my pancreas, he planned a different route to reach the suspicious lymph nodes and was able to remove them all.  Before closing me up, he did an ultrasound directly on my liver, which showed no sign of disease.",
                "typeIndex"         :       1,
                "type"              :       "SURGERY",
                "typeDetails"       :       {
                    "surgeon"               :       "Dr. Tremblay",
                    "hospital"              :       "M.D. Anderson Cancer Center",
                    "location"              :       "Houston, TX, USA",
                    "recoveryTimeHospital"  :       "7 days",
                    "recoveryTimeHome"      :       "2 and a half weeks"                    
                }
            },  {
                "start"             :       "Feb 1 2010 00:00:00",
                "end"               :       "May 31 2010 00:00:00",
                "title"             :       "Xeloda and Interferon Alpha",
                "durationEvent"     :       true,
                "description"       :       "Xeloda (oral 5FU) for 2 weeks at a time with subcutaneous injections of Interferon Alpha thrice weekly.",
                "pDescription"      :       "Xeloda (Capecitabine) is a very similar drug to 5FU, except it is delivered in a pill form, while 5FU is given intravenously.  Xeloda actually gets turned into 5FU by the human body.\\n\\nI did this chemo as a precaution.  There was no evidence of disease, but because I recently had cancer growing in my body, we were concerned that there could still be cancerous cells hiding in my blood, lymph, or some other tissues.\\n\\nWe figured that since the 5FU & Interferon worked so well in the past, I should do some additional chemo now.\\n\\nI opted for Xeloda this time because of quality of life issues - it's much more convenient to take Xeloda pills than to have a bottle of 5FU attached to your PICC line at all times.  Although we heard some people say that 5FU works better than Xeloda in this disease, we figured that since this was just preventative chemo anyway, my quality of life should count for more.  If I had active disease, I probably would have gone with 5FU not Xeloda.",
                "typeIndex"         :       2,
                "type"              :       "CHEMO",
                "typeDetails"       :       {
                    "result"            :       "unknown",
                    "duration"          :       "3 months",
                    "oncologist"        :       "-- censored --",
                    "sideEffects"       :       ["Swollen Hands and Feet", "Hot Feeling in Hands and Feet", "Elevated Heart Rate (only in the beginning)"]                    
                }
            }]
        },
		dummyDAO = (function() {
			var createDummyFunction = function (dummyFunctionName) {
					return function() {
						console.log(dummyFunctionName, "(", arguments, ")");
					};
				},
				testDummyDAO = function() {
					for (method in dummyDAO) {
						if (dummyDAO.hasOwnProperty(method)) {
							dummyDAO[method]();
						}
					}
				},
				createDummyObj = function(dummyMethodNames) {
				var dummyObj = {};

				$.each(dummyMethodNames, function(index, dummyMethodName) {
					dummyObj[dummyMethodName] = createDummyFunction(dummyMethodName);
				});

				dummyObj.testDummyDAO = testDummyDAO;

				return dummyObj; 
			}

			return createDummyObj(["updateEvent", "addEvent", "deleteEvent", "loadEvent", "addChapter", "deleteChapter", "initAutoCompletes"]);

		})();

	$.extend(dummyDAO, {
        "getEvents"		: 	function() {
    							return eventsJSON;
    						},
        "getChapters"	: 	function() {
    							return chaptersJSON;
    						}
	});

	app.getDAO = function() {
		return dummyDAO;
	}
}
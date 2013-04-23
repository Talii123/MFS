package test.friedman.tal.validation;

import org.junit.Test;

public class TestChemoValidationAnnotation extends TestValidationNonEmptyAnnotationsBase {

	@Override
	public void doTestExpectPass(String testValue, String testDescription) {
		doTestExpectPass(testValue, testDescription, "chemoValue");
	}

	@Override
	public void doTestExpectFail(String testValue, String testDescription) {
		doTestExpectFail(testValue, testDescription, "chemoValue");
	}

	@Override
	public String getAnnotationName() {
		return "Chemo";
	}
	
	public static final String[][] INVALID_CHEMOS = {
		{ "<chemo>5FU</chemo>", "no angle brackets are allowed" }
	};
	
	public static final String[][] VALID_CHEMOS = {
			{ "5FU", "valid chemo" },
			{ "5FU abc", "valid chemo" },
			{ "(Fluorouracil)", "valid chemo" },
			{ "5FU (Fluorouracil)", "valid chemo" },
	        { "5FU (Fluorouracil) and Interferon Alpha", "valid chemo" }, 
	        { "5FU (Fluorouracil) and Eloxatin (Oxaliplatin)", "valid chemo" }, 
	        { "GEMOX - Gemzar (Gemcitabine) and Eloxatin (Oxaliplatin)", "valid chemo" }, 
	        { "AVATAR - Avastin (Bevacizumab) and Tarceva (Erlotinib)", "valid chemo" },
	        { "Nexavar (Sorafenib)", "valid chemo" },
	        { "Sutent (Sunitinib)", "valid chemo" },
	        { "Linifanib", "valid chemo" },
	        { "5-FU (fluorouracil)", "valid chemo" },
	        { "Xeloda (capecitabine)", "valid chemo" },
	        { "Nexavar (sorafenib)", "valid chemo" },
	        { "Interferon Alpha", "valid chemo" },
	        { "Sutent (sunitinib)", "valid chemo" },
	        { "Eloxatin (oxaliplatin)", "valid chemo" },
	        { "Platinol (cisplatin)", "valid chemo" },
	        { "Adriamycin (doxorubicin)", "valid chemo" },
	        { "Gemzar (gemcitabine)", "valid chemo" },
	        { "Tarceva (erlotinib)", "valid chemo" },
	        { "Afinitor (everolimus)", "valid chemo" },
	        { "Alkeran (melphalan)", "valid chemo" },
	        { "Ara-C (cytarabine)", "valid chemo" },
	        { "Aredia (pamidronate)", "valid chemo" },
	        { "Arimidex (anastrozole)", "valid chemo" },
	        { "Aromasin (exemestane)", "valid chemo" },
	        { "Arranon (nelarabine)", "valid chemo" },
	        { "Avastin (bevacizumab)", "valid chemo" },
	        { "Bexxar (tositumomab)", "valid chemo" },
	        { "BiCNU (carmustine)", "valid chemo" },
	        { "Blenoxane (bleomycin)", "valid chemo" },
	        { "Campath (alemtuzumab)", "valid chemo" },
	        { "Camptosar (irinotecan)", "valid chemo" },
	        { "Casodex (bicalutamide)", "valid chemo" },
	        { "CeeNU (lomustine)", "valid chemo" },
	        { "Cerubidine (daunorubicin)", "valid chemo" },
	        { "Cosmegen (dactinomycin)", "valid chemo" },
	        { "Cytoxan (cyclophosphamide)", "valid chemo" },
	        { "Ellence (epirubicin)", "valid chemo" },
	        { "Elspar (asparaginase)", "valid chemo" },
	        { "Emcyt (estramustine)", "valid chemo" },
	        { "Erbitux (cetuximab)", "valid chemo" },
	        { "Ethyol (amifostine)", "valid chemo" },
	        { "Eulexin (flutamide)", "valid chemo" },
	        { "Fareston (toremifene)", "valid chemo" },
	        { "Faslodex (fulvestrant)", "valid chemo" },
	        { "Femara (letrozole)", "valid chemo" },
	        { "Fludara (fludarabine)", "valid chemo" },
	        { "FUDR (floxuridine)", "valid chemo" },
	        { "Gleevec (imatinib mesylate)", "valid chemo" },
	        { "Herceptin (trastuzumab)", "valid chemo" },
	        { "Hexalen (altretamine)", "valid chemo" },
	        { "Hycamtin (topotecan)", "valid chemo" },
	        { "Hydrea (hydroxyurea)", "valid chemo" },
	        { "Idamycin (idarubicin)", "valid chemo" },
	        { "Ifex (ifosfamide)", "valid chemo" },
	        { "Iressa (gefitinib)", "valid chemo" },
	        { "Camptosar (irinotecan)", "valid chemo" },
	        { "Elspar (asparaginase)", "valid chemo" },
	        { "Leukeran (chlorambucil)", "valid chemo" },
	        { "Leukine (sargramostim)", "valid chemo" },
	        { "Leustatin (cladribine)", "valid chemo" },
	        { "Lupron (leuprolide)", "valid chemo" },
	        { "Matulane (procarbazine)", "valid chemo" },
	        { "Mesnex (mesna)", "valid chemo" },
	        { "Meticorten (prednisone)", "valid chemo" },
	        { "Myleran (busulfan)", "valid chemo" },
	        { "Navelbine (vinorelbine)", "valid chemo" },
	        { "Neulasta (pegfilgrastim)", "valid chemo" },
	        { "Neupogen (filgrastim)", "valid chemo" },
	        { "Nipent (pentostatin)", "valid chemo" },
	        { "Nitrogen Mustard (mechlorethamine)", "valid chemo" },
	        { "Novaldex (tamoxifen)", "valid chemo" },
	        { "Novantrone (mitoxantrone)", "valid chemo" },
	        { "Oncaspar (pegaspargase)", "valid chemo" },
	        { "Oncovin (vincristine)", "valid chemo" },
	        { "Panretin (alitretinoin)", "valid chemo" },
	        { "Paraplatin (carboplatin)", "valid chemo" },
	        { "Proleukin (aldesleukin)", "valid chemo" },
	        { "Purinethol (mercaptopurine)", "valid chemo" },
	        { "Retina-A (tretinoin)", "valid chemo" },
	        { "Rituxan (rituximab)", "valid chemo" },
	        { "Roferon-A (interferon alfa-2a)", "valid chemo" },
	        { "Sandostatin (octreotide)", "valid chemo" },
	        { "SPRYCEL (dasatinib)", "valid chemo" },
	        { "Tabloid (thioguanine)", "valid chemo" },
	        { "Targretin (bexarotene)", "valid chemo" },
	        { "Taxotere (docetaxel)", "valid chemo" },
	        { "Temodar (temozolomide)", "valid chemo" },
	        { "Thalomid (thalidomide)", "valid chemo" },
	        { "TICE BCG (bcg)", "valid chemo" },
	        { "Toposar (etoposide)", "valid chemo" },
	        { "Torisel (temsirolimus)", "valid chemo" },
	        { "Trexall (methotrexate)", "valid chemo" },
	        { "Trisenox (arsenic trioxide)", "valid chemo" },
	        { "TYKERB (lapatinib)", "valid chemo" },
	        { "Vectibix (panitumumab)", "valid chemo" },
	        { "Velban (vinblastine)", "valid chemo" },
	        { "Velcade (bortezomib)", "valid chemo" },
	        { "Vidaza (azacitidine)", "valid chemo" },
	        { "Vumon (teniposide)", "valid chemo" },
	        { "Zanosar (streptozocin)", "valid chemo" },
	        { "Zoladex (goserelin)", "valid chemo" },
	        { "Zometa (zoledronic acid)", "valid chemo" },	
	};
	
	@Test
	public void testInvalidChemos() {
//		System.out.println("\n\n\n\n CHEMO_REGEX_PATTERN: "+ValidationUtils.CHEMO_REGEX_PATTERN+"\n\n\n\n");
		for (String[] chemoTestSpec : INVALID_CHEMOS) {
			String chemoName = chemoTestSpec[0];
			String chemoTestDescription = 
					chemoTestSpec.length > 1 ? chemoTestSpec[chemoTestSpec.length - 1] : "invalid chemo";
			doTestExpectFail(chemoName, chemoTestDescription);
		}
	}

	@Test
	public void testValidChemos() {
//		System.out.println("\n\n\n\n CHEMO_REGEX_PATTERN: "+ValidationUtils.CHEMO_REGEX_PATTERN+"\n\n\n\n");
		for (String[] chemoTestSpec : VALID_CHEMOS) {
			String chemoName = chemoTestSpec[0];
			String chemoTestDescription = 
					chemoTestSpec.length > 1 ? chemoTestSpec[chemoTestSpec.length - 1] : "valid chemo";
			doTestExpectPass(chemoName, chemoTestDescription);
		}
		
		/*doTestExpectPass("5FU", "valid chemo");
		doTestExpectPass("5FU abc", "valid chemo");
		doTestExpectPass("(Fluorouracil)", "valid chemo");
		doTestExpectPass("5FU (Fluorouracil)", "valid chemo");
        doTestExpectPass("5FU (Fluorouracil) and Interferon Alpha", "valid chemo"); 
        doTestExpectPass("5FU (Fluorouracil) and Eloxatin (Oxaliplatin)", "valid chemo"); 
        doTestExpectPass("GEMOX - Gemzar (Gemcitabine) and Eloxatin (Oxaliplatin)", "valid chemo"); 
        doTestExpectPass("AVATAR - Avastin (Bevacizumab) and Tarceva (Erlotinib)", "valid chemo");
        doTestExpectPass("Nexavar (Sorafenib)", "valid chemo");
        doTestExpectPass("Sutent (Sunitinib)", "valid chemo");
        doTestExpectPass("Linifanib", "valid chemo");
        doTestExpectPass("5-FU (fluorouracil)", "valid chemo");
        doTestExpectPass("Xeloda (capecitabine)", "valid chemo");
        doTestExpectPass("Nexavar (sorafenib)", "valid chemo");
        doTestExpectPass("Interferon Alpha", "valid chemo");
        doTestExpectPass("Sutent (sunitinib)", "valid chemo");
        doTestExpectPass("Eloxatin (oxaliplatin)", "valid chemo");
        doTestExpectPass("Platinol (cisplatin)", "valid chemo");
        doTestExpectPass("Adriamycin (doxorubicin)", "valid chemo");
        doTestExpectPass("Gemzar (gemcitabine)", "valid chemo");
        doTestExpectPass("Tarceva (erlotinib)", "valid chemo");
        doTestExpectPass("Afinitor (everolimus)", "valid chemo");
        doTestExpectPass("Alkeran (melphalan)", "valid chemo");
        doTestExpectPass("Ara-C (cytarabine)", "valid chemo");
        doTestExpectPass("Aredia (pamidronate)", "valid chemo");
        doTestExpectPass("Arimidex (anastrozole)", "valid chemo");
        doTestExpectPass("Aromasin (exemestane)", "valid chemo");
        doTestExpectPass("Arranon (nelarabine)", "valid chemo");
        doTestExpectPass("Avastin (bevacizumab)", "valid chemo");
        doTestExpectPass("Bexxar (tositumomab)", "valid chemo");
        doTestExpectPass("BiCNU (carmustine)", "valid chemo");
        doTestExpectPass("Blenoxane (bleomycin)", "valid chemo");
        doTestExpectPass("Campath (alemtuzumab)", "valid chemo");
        doTestExpectPass("Camptosar (irinotecan)", "valid chemo");
        doTestExpectPass("Casodex (bicalutamide)", "valid chemo");
        doTestExpectPass("CeeNU (lomustine)", "valid chemo");
        doTestExpectPass("Cerubidine (daunorubicin)", "valid chemo");
        doTestExpectPass("Cosmegen (dactinomycin)", "valid chemo");
        doTestExpectPass("Cytoxan (cyclophosphamide)", "valid chemo");
        doTestExpectPass("Ellence (epirubicin)", "valid chemo");
        doTestExpectPass("Elspar (asparaginase)", "valid chemo");
        doTestExpectPass("Emcyt (estramustine)", "valid chemo");
        doTestExpectPass("Erbitux (cetuximab)", "valid chemo");
        doTestExpectPass("Ethyol (amifostine)", "valid chemo");
        doTestExpectPass("Eulexin (flutamide)", "valid chemo");
        doTestExpectPass("Fareston (toremifene)", "valid chemo");
        doTestExpectPass("Faslodex (fulvestrant)", "valid chemo");
        doTestExpectPass("Femara (letrozole)", "valid chemo");
        doTestExpectPass("Fludara (fludarabine)", "valid chemo");
        doTestExpectPass("FUDR (floxuridine)", "valid chemo");
        doTestExpectPass("Gleevec (imatinib mesylate)", "valid chemo");
        doTestExpectPass("Herceptin (trastuzumab)", "valid chemo");
        doTestExpectPass("Hexalen (altretamine)", "valid chemo");
        doTestExpectPass("Hycamtin (topotecan)", "valid chemo");
        doTestExpectPass("Hydrea (hydroxyurea)", "valid chemo");
        doTestExpectPass("Idamycin (idarubicin)", "valid chemo");
        doTestExpectPass("Ifex (ifosfamide)", "valid chemo");
        doTestExpectPass("Iressa (gefitinib)", "valid chemo");
        doTestExpectPass("Camptosar (irinotecan)", "valid chemo");
        doTestExpectPass("Elspar (asparaginase)", "valid chemo");
        doTestExpectPass("Leukeran (chlorambucil)", "valid chemo");
        doTestExpectPass("Leukine (sargramostim)", "valid chemo");
        doTestExpectPass("Leustatin (cladribine)", "valid chemo");
        doTestExpectPass("Lupron (leuprolide)", "valid chemo");
        doTestExpectPass("Matulane (procarbazine)", "valid chemo");
        doTestExpectPass("Mesnex (mesna)", "valid chemo");
        doTestExpectPass("Meticorten (prednisone)", "valid chemo");
        doTestExpectPass("Myleran (busulfan)", "valid chemo");
        doTestExpectPass("Navelbine (vinorelbine)", "valid chemo");
        doTestExpectPass("Neulasta (pegfilgrastim)", "valid chemo");
        doTestExpectPass("Neupogen (filgrastim)", "valid chemo");
        doTestExpectPass("Nipent (pentostatin)", "valid chemo");
        doTestExpectPass("Nitrogen Mustard (mechlorethamine)", "valid chemo");
        doTestExpectPass("Novaldex (tamoxifen)", "valid chemo");
        doTestExpectPass("Novantrone (mitoxantrone)", "valid chemo");
        doTestExpectPass("Oncaspar (pegaspargase)", "valid chemo");
        doTestExpectPass("Oncovin (vincristine)", "valid chemo");
        doTestExpectPass("Panretin (alitretinoin)", "valid chemo");
        doTestExpectPass("Paraplatin (carboplatin)", "valid chemo");
        doTestExpectPass("Proleukin (aldesleukin)", "valid chemo");
        doTestExpectPass("Purinethol (mercaptopurine)", "valid chemo");
        doTestExpectPass("Retina-A (tretinoin)", "valid chemo");
        doTestExpectPass("Rituxan (rituximab)", "valid chemo");
        doTestExpectPass("Roferon-A (interferon alfa-2a)", "valid chemo");
        doTestExpectPass("Sandostatin (octreotide)", "valid chemo");
        doTestExpectPass("SPRYCEL (dasatinib)", "valid chemo");
        doTestExpectPass("Tabloid (thioguanine)", "valid chemo");
        doTestExpectPass("Targretin (bexarotene)", "valid chemo");
        doTestExpectPass("Taxotere (docetaxel)", "valid chemo");
        doTestExpectPass("Temodar (temozolomide)", "valid chemo");
        doTestExpectPass("Thalomid (thalidomide)", "valid chemo");
        doTestExpectPass("TICE BCG (bcg)", "valid chemo");
        doTestExpectPass("Toposar (etoposide)", "valid chemo");
        doTestExpectPass("Torisel (temsirolimus)", "valid chemo");
        doTestExpectPass("Trexall (methotrexate)", "valid chemo");
        doTestExpectPass("Trisenox (arsenic trioxide)", "valid chemo");
        doTestExpectPass("TYKERB (lapatinib)", "valid chemo");
        doTestExpectPass("Vectibix (panitumumab)", "valid chemo");
        doTestExpectPass("Velban (vinblastine)", "valid chemo");
        doTestExpectPass("Velcade (bortezomib)", "valid chemo");
        doTestExpectPass("Vidaza (azacitidine)", "valid chemo");
        doTestExpectPass("Vumon (teniposide)", "valid chemo");
        doTestExpectPass("Zanosar (streptozocin)", "valid chemo");
        doTestExpectPass("Zoladex (goserelin)", "valid chemo");
        doTestExpectPass("Zometa (zoledronic acid)", "valid chemo");
*/
	}

}

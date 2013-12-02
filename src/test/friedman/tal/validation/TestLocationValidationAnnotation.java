package test.friedman.tal.validation;

import org.junit.Test;

public class TestLocationValidationAnnotation extends TestValidationNonEmptyAnnotationsBase {


	@Override
	public void doTestExpectPass(String testValue, String testDescription) {
		doTestExpectPass(testValue, testDescription, "locationValue");	
	}
	
	@Override
	public void doTestExpectFail(String testValue, String testDescription) {
		doTestExpectFail(testValue, testDescription, "locationValue");		
	}
	
	@Override
	public String getAnnotationName() {
		return "Location";
	}

	@Test
	public void testCommasOk() {
		doTestExpectPass("Houston, TX",  "Locations can have one comma");
		doTestExpectPass("Houston, TX, USA",  "Locations can have two commas");
		doTestExpectPass("Houston,TX,USA",  "Locations can have commas without spaces");
		doTestExpectFail("Houston ,TX,USA",  "Locations cannot have spaces before commas");
		doTestExpectFail("Houston,TX ,USA",  "Locations cannot have spaces before commas");
		doTestExpectFail("Houston ,TX ,USA",  "Locations cannot have spaces before commas");
	}
	
	@Test
	public void testCommasNotNeeded() {
		doTestExpectPass("Toronto ON",  "Locations can have two places and no comma between them");
		doTestExpectPass("Toronto ON Canada",  "Locations can have three places and no comma between them");
		doTestExpectPass("Toronto",  "Locations can have one place");
	}
	
	@Test
	public void testLocationsCannotHaveNumbers() {
		doTestExpectFail("Vancouver3", "no number at the end");
		doTestExpectFail("4Vancouver3", "no number at the beginning and end");
		doTestExpectFail("578Vancouver", "no number at the beginning");
	}
	
	@Test 
	public void testLocationsCannotHavePunctuationExceptCommas() {
		doTestExpectFail("Vancouver.BC", "punctuation other than comma");
		doTestExpectFail("Vancouver. BC", "punctuation other than comma");
		doTestExpectFail("Vancouver .BC", "punctuation other than comma");
		doTestExpectFail(".Vancouver .BC", "punctuation other than comma");
		doTestExpectFail("Vancouver .BC.", "punctuation other than comma");
		doTestExpectFail("?Vancouver BC", "punctuation other than comma");
		doTestExpectFail("Vancouver ~BC", "punctuation other than comma");
		doTestExpectFail("%Vancouver %BC", "punctuation other than comma");
		doTestExpectFail("Vancouver BC%", "punctuation other than comma");
		doTestExpectFail("%Vancouver BC", "punctuation other than comma");
		
	}
	
	public static final String[][] INVALID_LOCATIONS = {
		{"Vancouver.BC", "punctuation other than comma"},
		{"Vancouver. BC", "punctuation other than comma"},
		{"Vancouver .BC", "punctuation other than comma"},
		{".Vancouver .BC", "punctuation other than comma"},
		{"Vancouver .BC.", "punctuation other than comma"},
		{"?Vancouver BC", "punctuation other than comma"},
		{"Vancouver ~BC", "punctuation other than comma"},
		{"%Vancouver %BC", "punctuation other than comma"},
		{"Vancouver BC%", "punctuation other than comma"},
		{"%Vancouver BC", "punctuation other than comma"},
		{"Vancouver3", "no number at the end"},
		{"4Vancouver3", "no number at the beginning and end"},
		{"578Vancouver", "no number at the beginning"},
		{"Houston ,TX,USA",  "Locations cannot have spaces before commas"},
		{"Houston,TX ,USA",  "Locations cannot have spaces before commas"},
		{"Houston ,TX ,USA",  "Locations cannot have spaces before commas"},
	};
	
	@Test
	public void testInvalidLocations() {
		for (String[] validLocation : INVALID_LOCATIONS) {
			doTestExpectFail(validLocation[0], validLocation[1]);
		}		
	}
	
	public static final String[][] VALID_LOCATIONS = {
		{"Houston, TX",  "Locations can have one comma"},
		{"Houston, TX, USA",  "Locations can have two commas"},
		{"Houston,TX,USA",  "Locations can have commas without spaces"},
		{"Toronto ON",  "Locations can have two places and no comma between them"},
		{"Toronto ON Canada",  "Locations can have three places and no comma between them"},
		{"Toronto",  "Locations can have one place"},
		{"Fairfax, Virginia", "valid location"},
        {"Rogers, AR  USA", "valid location"},
        {"Houston, TX", "valid location"},
        {"Greenville, NC", "valid location"},
        {"Philadelphia, PA", "valid location"},
        {"Kansas City, KS", "valid location"},
        {"Huntsville AL", "valid location"},
        {"Conway, NH", "valid location"},
        {"Scarborough, ME", "valid location"},
        {"Portland, ME", "valid location"},
        {"Los Angeles, CA", "valid location"},
        {"Beverly Hills, CA", "valid location"},
        {"New York City, NY", "valid location"},
        {"Rochester, MN", "valid location"},
        {"Madison, WI", "valid location"},
        {"Waukesha, WI USA", "valid location"},
        {"Rochester, MN, USA", "valid location"},
        { "Cambridge, UK", "valid location" },
        { "Oakland, CA", "valid location" },
        { "Cleveland, OH", "valid location" },
        { "Potsdam, NY", "valid location" },
        { "Pensacola, FL", "valid location"}        
	};
	
	@Test
	public void testValidLocations() {
		for (String[] validLocation : VALID_LOCATIONS) {
			System.out.println("testing: "+validLocation[0]);
			doTestExpectPass(validLocation[0], validLocation[1]);	

			
		}
        /*doTestExpectPass("Fairfax, Virginia", "valid location");
        doTestExpectPass("Rogers, AR  USA", "valid location");
        doTestExpectPass("Houston, TX", "valid location");
        doTestExpectPass("Greenville, NC", "valid location");
        doTestExpectPass("Philadelphia, PA", "valid location");
        doTestExpectPass("Kansas City, KS", "valid location");
        doTestExpectPass("Huntsville AL", "valid location");
        doTestExpectPass("Conway, NH", "valid location");
        doTestExpectPass("Scarborough, ME", "valid location");
        doTestExpectPass("Portland, ME", "valid location");
        doTestExpectPass("Los Angeles, CA", "valid location");
        doTestExpectPass("Beverly Hills, CA", "valid location");
        doTestExpectPass("New York City, NY", "valid location");
        doTestExpectPass("Rochester, MN", "valid location");
        doTestExpectPass("Madison, WI", "valid location");
        doTestExpectPass("Waukesha, WI USA", "valid location");
        doTestExpectPass("Rochester, MN, USA", "valid location");*/
	}
}

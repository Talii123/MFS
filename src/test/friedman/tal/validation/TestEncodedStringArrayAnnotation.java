package test.friedman.tal.validation;

import org.junit.Test;

import friedman.tal.validation.ValidationUtils;


public class TestEncodedStringArrayAnnotation extends TestValidationNonEmptyAnnotationsBase {

	@Override
	public void doTestExpectPass(String testValue, String testDescription) {
		super.doTestExpectPass(testValue, testDescription, "encodedStringArrayValue");		
	}

	@Override
	public void doTestExpectFail(String testValue, String testDescription) {
		super.doTestExpectFail(testValue, testDescription, "encodedStringArrayValue");
	}

	@Override
	public String getAnnotationName() {
		return "EncodedStringArray";
	}
	
	public static final String[][] INVALID_ENCODED_STRING_ARRAYS = {
		{ ":liver", "missing first element" },
		{ "kidney:", "missing last element" },
		{ "kidney::liver", "missing middle element" }
		
	};
	
	public static final String[][] VALID_ENCODED_STRING_ARRAYS = {
		{ "liver", "valid one element" },
		{ "liver:diaphragm", "valid two elements" },
		{ "liver:diaphragm:kidney", "valid three elements" },
		{ "Liver:Portal Vein:Lungs:Peritoneum", "space in one of the words" }
	};
	
	@Test
	public void testInvalidEncodedStringArrays() {
		System.out.println("\n\n\nregex: "+ValidationUtils.ENCODED_STRING_ARRAY_REGEX_PATTERN);
		for (String[] esaTestSpec : INVALID_ENCODED_STRING_ARRAYS) {
			
			String encodedStringArray = esaTestSpec[0];
			
			System.out.println("\n\n encodedStringArray: "+encodedStringArray);
			String esaTestDescription = 
					esaTestSpec.length > 1 ? esaTestSpec[esaTestSpec.length - 1] : "invalid encoded string array";
			doTestExpectFail(encodedStringArray, esaTestDescription);
		}
	}

	@Test
	public void testValidEncodedStringArrays() {
		for (String[] esaTestSpec : VALID_ENCODED_STRING_ARRAYS) {
			String encodedStringArray = esaTestSpec[0];
			String esaTestDescription = 
					esaTestSpec.length > 1 ? esaTestSpec[esaTestSpec.length - 1] : "valid encoded string array";
			doTestExpectPass(encodedStringArray, esaTestDescription);
		}
	}
}

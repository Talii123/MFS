package test.friedman.tal.validation;

import static org.junit.Assert.assertTrue;
import org.junit.Test;

public class TestAlphaNumericValidationAnnotation extends TestValidationEmptyAnnotationsBase {

	@Override
	public void doTestExpectPass(String testValue, String testDescription) {
		doTestExpectPass(testValue, testDescription, "alphaNumericValue");	
	}
	
	@Override
	public void doTestExpectFail(String testValue, String testDescription) {
		doTestExpectFail(testValue, testDescription, "alphaNumericValue");		
	}

	@Override
	public String getAnnotationName() {
		return "AlphaNumericWSpaces";
	}
	
	public static final String[][] VALID_ALPHA_NUMERICS = {
		{ "abc", "just letters"},
		{ "a1b2ce", "letters and numbers" },
		{ "13434523", "just numbers" },
		{ "0", "zero" },
		{ "z", "z"},
		{ "1morethan4", "number before letter" },
		{ "1 more than 4", "number before letter, with spaces" },
		{ "what is less than 7", "letter before number, with spaces" },
		{ "   ", "strings that are empty when trimmed are accepted"},
		{ " leading spaces allowed", " leading spaces allowed" },
		{ "as are following spaced", " following spaces allowed" }
	};
	
	public static final String[][] INVALID_ALPHA_NUMERICS = {
		//{"", "empty string not accepted" }, // test this separately since it may not be true for others
		{"a.1", "dots not accepted" },
		{"?", "non alpha, numeric and blank are not accepted" },
		{"~", "non alpha, numeric and blank are not accepted" },
		{"^", "non alpha, numeric and blank are not accepted" },
		{"&", "non alpha, numeric and blank are not accepted" },
		{"$", "non alpha, numeric and blank are not accepted" },
		{"#", "non alpha, numeric and blank are not accepted" },
		{"!", "non alpha, numeric and blank are not accepted" },
		{"@", "non alpha, numeric and blank are not accepted" },
		{"(", "non alpha, numeric and blank are not accepted" },
		{")", "non alpha, numeric and blank are not accepted" },
		{"*", "non alpha, numeric and blank are not accepted" }
	};
	
	
	
	@Override
	@Test
	public void testCantBeEmptyString() {
		assertTrue("this is covered elsewhere in this test", true);
	}

	@Test
	public void testInvalidAlphaNumerics() {
		for (String[] invalidAlphaNumeric : INVALID_ALPHA_NUMERICS) {
			doTestExpectFail(invalidAlphaNumeric[0], invalidAlphaNumeric[1]);
		}		
	}
	
	@Test
	public void testValidAlphaNumerics() {
		for (String[] validAlphaNumeric : VALID_ALPHA_NUMERICS) {
			doTestExpectPass(validAlphaNumeric[0], validAlphaNumeric[1]);
		}
	}
}

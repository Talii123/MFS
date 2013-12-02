package test.friedman.tal.validation;

import org.junit.Test;

public abstract class TestValidationNonEmptyAnnotationsBase extends TestValidationBase {

	
	@Test
	public void testCannotBeEmptyString() {
		String annotationName = getAnnotationName();
		doTestExpectFail("", String.format("%s cannot be empty", annotationName));		
		doTestExpectFail("   ", String.format("%s cannot be whitespace", annotationName));	
	}
	
	@Test
	public void testCannotHaveLeadingOrTrailingWhitespace() {
		String annotationName = getAnnotationName();
		doTestExpectFail("  Eden", String.format("%s cannot begin with whitespace", annotationName));
		doTestExpectFail("Eden ", String.format("%s cannot end with whitespace", annotationName));		
		doTestExpectFail("  Paradise City  ", String.format("%s cannot be surrounded with whitespace", annotationName));		
	}

}

package test.friedman.tal.validation;

import org.junit.Test;

public abstract class TestValidationEmptyAnnotationsBase extends TestValidationBase {

	@Test
	public void testCantBeEmptyString() {
		String annotationName = getAnnotationName();
		doTestExpectPass("", String.format("%s can be empty", annotationName));		
		doTestExpectPass("   ", String.format("%s can be whitespace", annotationName));	
	}

	@Test
	public void testCanHaveLeadingOrTrailingWhitespace() {
	 	String annotationName = getAnnotationName();
		doTestExpectPass("  Eden", String.format("%s can begin with whitespace", annotationName));
		doTestExpectPass("Eden ", String.format("%s can end with whitespace", annotationName));		
		doTestExpectPass("  Paradise City  ", String.format("%s can be surrounded with whitespace", annotationName));		
	}
	
}

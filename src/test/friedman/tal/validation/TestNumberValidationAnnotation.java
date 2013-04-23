package test.friedman.tal.validation;

import org.junit.Test;

public class TestNumberValidationAnnotation extends TestValidationNonEmptyAnnotationsBase {

	@Override
	public void doTestExpectPass(String testValue, String testDescription) {
		doTestExpectPass(testValue, testDescription, "numberValue");
	}

	@Override
	public void doTestExpectFail(String testValue, String testDescription) {
		doTestExpectFail(testValue, testDescription, "numberValue");
	}

	@Override
	public String getAnnotationName() {
		return "Number";
	}

	@Test
	public void testNumbersOk() {
//		doTestExpectPass("0", "valid number");
//		doTestExpectPass("-1", "valid number");
//		doTestExpectPass("1.5", "valid number");
//		doTestExpectPass("0", "valid number");
//		doTestExpectPass("0", "valid number");
//		doTestExpectPass("0", "valid number");
//		doTestExpectPass("0", "valid number");
//		doTestExpectPass("0", "valid number");
//		doTestExpectPass("0", "valid number");
//		doTestExpectPass("0", "valid number");
//		doTestExpectPass("0", "valid number");
//		doTestExpectPass("0", "valid number");
//		doTestExpectPass("0", "valid number");
//		doTestExpectPass("0", "valid number");

		throw new AssertionError("Not implemented yet");
	}
}

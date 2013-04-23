package test.friedman.tal.validation;


import static test.friedman.tal.validation.TestValidationUtils.*;
import static org.junit.Assert.assertTrue;

import java.util.Set;

import javax.validation.ConstraintViolation;

import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TestName;

import test.friedman.tal.validation.TestValidationUtils.MockObject;

public abstract class TestValidationBase {

	public MockObject testObj = new MockObject(null);
	
	public Set<ConstraintViolation<MockObject>> violations;
	
	
	@Rule
	public TestName testname = new TestName();
	
	public void doTestExpectPass(String testValue, String testDescription, String aPropertyName) {
		testObj.setValue(testValue);
		violations = doCommonsValidation(testObj, aPropertyName);
		listValidationErrors(testname.getMethodName(), violations);
		assertTrue(testDescription, violations.isEmpty());		
	}		
	
	public void doTestExpectFail(String testValue, String testDescription, String aPropertyName) {
		testObj.setValue(testValue);
		violations = doCommonsValidation(testObj, aPropertyName);
		listValidationErrors(testname.getMethodName(), violations);
		assertTrue(testDescription, !violations.isEmpty());		
	}	
	
	public abstract void doTestExpectPass(String testValue, String testDescription);
	
	public abstract void doTestExpectFail(String testValue, String testDescription);
	
	public abstract String getAnnotationName();
	
	// common tests
	@Test
	public void testAllowedNull() {
		doTestExpectPass(null, String.format("%s can be null", getAnnotationName()));
	}
}

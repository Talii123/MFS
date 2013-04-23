package test.friedman.tal.validation;


import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

import friedman.tal.validation.AlphaNumericWSpaces;
import friedman.tal.validation.Chemo;
import friedman.tal.validation.EncodedStringArray;
import friedman.tal.validation.Location;
import friedman.tal.validation.Name;
import friedman.tal.validation.NoHTML;
import friedman.tal.validation.Number;
import friedman.tal.validation.ValidDateRange;
import friedman.tal.validation.ValidationUtils;

public class TestValidationUtils {
	
	private static final ValidatorFactory VFACTORY = Validation.buildDefaultValidatorFactory();
	//private final Validator VALIDATOR;

	
	public static Validator getValidator() {
		return VFACTORY.getValidator();
	}
	
	/*private MethodValidator getMethodValidator() {
		//return VFACTORY.getValidator();
		
		MethodValidator methodValidator = Validation.byProvider( HibernateValidator.class )
			    .configure()
			    .buildValidatorFactory()
			    .getValidator()
			    .unwrap( MethodValidator.class ); 
		return methodValidator;
	}*/
	

	
	public static void listValidationErrors(String testMethod, Set<? extends ConstraintViolation<MockObject>> violations) {
		for (ConstraintViolation<MockObject> violation : violations) {
			System.out.println(String.format("\n\n\n\n %s\n Message: %s", testMethod, violation.getMessage()));
			System.out.println(String.format("Invalid Value: %s", violation.getInvalidValue()));
			System.out.println(String.format("Invalid Value: %s \n\n\n\n", violation.getConstraintDescriptor()));
		}
	}
		

	public static class MockObject {
		private String value;
		
		public MockObject(String toValidate) {
			this.value = toValidate;
		}
		
		@Name
		//@javax.validation.constraints.Pattern(regexp = ValidationUtils.NAME_REGEX_PATTERN)
		public String getNameValue() {
			return this.value;
		}
		
		@Location
		public String getLocationValue() {
			return this.value;
		}
		
		@Chemo
		public String getChemoValue() {
			return this.value;
		}
		
		@Number
		public String getNumberValue() {
			return this.value;
		}
		
		@NoHTML
		public String getHtmlValue() {
			return this.value;
		}
		
		@AlphaNumericWSpaces
		public String getAlphaNumericValue() {
			return this.value;
		}
		
		@EncodedStringArray
		public String getEncodedStringArrayValue() {
			return this.value;
		}
		
		public void setValue(String aString) {
			this.value = aString;
		}
	}

	public static Set<ConstraintViolation<MockObject>> doCommonsValidation(MockObject testObj, String aPropertyName) {
		//System.out.println("\n\n\n\n begin doCommonsValidation");
		Validator validator = getValidator();
		//System.out.println("end doCommonsValidation  \n\n\n\n ");		
		return validator.validateProperty(testObj, aPropertyName);
	}
	
	public static void doOldFashionedRegex(MockObject testObj) {
		String testValue = testObj.getNameValue();
		Pattern p = Pattern.compile(ValidationUtils.NAME_REGEX_PATTERN);
		Matcher m = p.matcher(testObj.getNameValue());
		if (Pattern.matches(ValidationUtils.NAME_REGEX_PATTERN, testValue)) {
			System.out.print(String.format("\n\n\nit matches!!  Pattern: %s  testValue: %s \n\n\n", ValidationUtils.NAME_REGEX_PATTERN, testValue));
		}
		else {
			System.out.print(String.format("\n\n\n NO MATCH!!! Pattern: %s  testValue: %s \n\n\n", ValidationUtils.NAME_REGEX_PATTERN, testValue));
		}
		if (m.find()) {
			System.out.println(String.format("\n\n\n find() returned true for %s", testObj.getNameValue()));
			System.out.println(String.format("result of find(): %s  \n\n\n", m.group()));
		}
		else {
			System.out.print(String.format("\n\n\n\n FOUND NOTHING for Pattern: %s  testValue: %s \n\n\n", ValidationUtils.NAME_REGEX_PATTERN, testValue));
		}
	}
	
	/*private static Set<MethodConstraintViolation<MockObject>> doMethodValidation(MockObject testObj) {
	System.out.println("\n\n\n\n begin doMethodValidation");
	MethodValidator validator = getMethodValidator();
	Set<MethodConstraintViolation<MockObject>> results = Collections.EMPTY_SET;
	try {
		Method method = MockObject.class.getMethod("getValue");
		results = validator.validateReturnValue(testObj, method, method.invoke(testObj));	
	} catch (Throwable t) {
		System.err.println("Error: "+t.getMessage());
		t.printStackTrace();
	}
	System.out.println("end doMethodValidation  \n\n\n\n ");
	return results;
}*/
}

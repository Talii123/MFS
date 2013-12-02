package test.friedman.tal.validation;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;
import org.junit.runners.Suite.SuiteClasses;

@RunWith(Suite.class)
@SuiteClasses({
	TestChemoValidationAnnotation.class,
	TestLocationValidationAnnotation.class,
	TestNameValidationAnnotation.class,
	TestNoHTMLValidationAnnotation.class,
	TestAlphaNumericValidationAnnotation.class,
	TestEncodedStringArrayAnnotation.class
})
public class AllValidationAnnotationTests {

}

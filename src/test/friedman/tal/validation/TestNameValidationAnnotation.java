package test.friedman.tal.validation;


import org.junit.Test;



public class TestNameValidationAnnotation extends TestValidationNonEmptyAnnotationsBase {

	
	//private final Validator VALIDATOR;
	
	public TestNameValidationAnnotation() {		
		//VALIDATOR = TestValidationUtils.getValidator();
		
	}
	
	@Override
	public void doTestExpectPass(String testValue, String testDescription) {
		doTestExpectPass(testValue, testDescription, "nameValue");	
	}
	
	@Override
	public void doTestExpectFail(String testValue, String testDescription) {
		doTestExpectFail(testValue, testDescription, "nameValue");		
	}
	
	@Override
	public String getAnnotationName() {
		return "Name";
	}
 
/*	done automatically thanks to inheritance from TestValidationBase
 * @Test
	public void testAllowedNull() {*/
		/*testObj.setValue(null);
		//Set<MethodConstraintViolation<MockObject>> violations = doMethodValidation(testObj);
		Set<? extends ConstraintViolation<MockObject>> violations = doCommonsValidation(testObj);
		assertNotNull("valid objects don't result in null violation sets.", violations);
		assertTrue("names can be null", violations.isEmpty());*/
		
/*		doTestExpectPass(null, "names can be null");
	}
	
	@Test
	public void testNamesCannotBeEmptyString() {
		doTestExpectFail("", "names cannot be empty");
		
		doTestExpectFail("   ", "names cannot be whitespace");	
	}
	
	@Test
	public void NamesCannotHaveLeadingOrTrailingWhitespace() {
		doTestExpectFail("  Alice", "names cannot begin with whitespace");
		doTestExpectFail("Nic ", "names cannot end with whitespace");		
		doTestExpectFail("  Alice Wei  ", "names cannot be surrounded with whitespace");		
	}*/
	
	/*WHy limit spaces?  Should have a function on the client to trim excess space, 
	 * but we have no good reason to limit this
	 * @Test
	public void NamesCanHaveOneSpaceButNotMoreBetweenParts() {
		doTestExpectPass("Alice Wei", "names with one space pass");
		doTestExpectFail("Alice  Wei", "names with two spaces fail");
		doTestExpectPass("Alice Wei III", "names with one space more than once pass");
		doTestExpectPass("Cal Ripken Sr.", "names with one space more than once and end in a dot pass");
		doTestExpectFail("Cal Ripken  Sr.", "names with more than one space near the end fail.");
		doTestExpectFail(" Cal Ripken Sr.", "names with one space at the beginning fail.");
		doTestExpectFail("Cal Ripken Sr. ", "names with one space at the end fail.");
	}*/
	
	@Test
	public void testNamesCannotHaveNumbers() {
		doTestExpectFail("Johnny 5", "names cannot have numbers");
		doTestExpectFail("123", "names cannot have numbers");
		doTestExpectFail("123 456", "names cannot have numbers");
	}
	
	@Test
	public void testNamesCanHaveDots() {
		doTestExpectPass("Dr. J. N. Vauthey", "names can have dots in the middle");
		doTestExpectPass("Cal Ripken Sr.", "names can have dots at the end");
		doTestExpectFail(".Cal Ripken.", "names cannot have dots at the beginning");
	}
	
	@Test
	public void testNamesDontNeedDrPrefix() {
		testObj.setValue("Jim Brewer");
	}
	
	@Test
	public void testNamesCanHaveLetters() {
		doTestExpectPass("Alice Wei", "test names can have letters");
	}
	
	public static final String[][] VALID_HOSPITAL_NAMES = {
        { "Inova Fairfax" },
        { "Mercy Hospital" },
        { "MD Anderson Cancer Center" },
        { "Leo Jenkins Cancer Center" },
        { "Fox Chase Cancer Center" },
        { "University of Kansas Hospital" },
        { "Eastern Interventional Radiology" },
        { "Huntsville Hospital" },
        { "Saco River Medical Group" },
        { "Maine Center for Cancer Medicine" },
        { "Maine surgical care group" },
        { "Cedars Sanai Meical Center" },
        { "Tore Hematology Oncology" },
        { "Memorial Sloan Kettering Cancer Center" },
        { "Mayo Cinic" },
        { "University of Wisconsin Hospital" },
        { "Waukesha Memorial Hospital" },
        { "Texas Children's Hospital" },
        { "Sacred Heart Hospital" },
        { "Nemours Children's Hospital" },
        { "Canton-Potsdam Hospital" },
        { "Cleveland Clinic" },
        { "Childrens Hospital" },
        { "Addenbrookes Hospital" }				
	};
	
	/*@Test
	public void testValidHospitals() {
        doTestExpectPass("Inova Fairfax", "valid hospital");
        doTestExpectPass("Mercy Hospital", "valid hospital");
        doTestExpectPass("MD Anderson Cancer Center", "valid hospital");
        doTestExpectPass("MD  Anderson Cancer Center", "valid hospital");
        doTestExpectPass("M.D. Anderson Cancer Center", "valid hospital");
        doTestExpectPass("Leo Jenkins Cancer Center", "valid hospital");
        doTestExpectPass("Fox Chase Cancer Center", "valid hospital");
        doTestExpectPass("University of Kansas Hospital", "valid hospital");
        doTestExpectPass("Eastern Interventional Radiology", "valid hospital");
        doTestExpectPass("Huntsville Hospital", "valid hospital");
        doTestExpectPass("Saco River Medical Group", "valid hospital");
        doTestExpectPass("Maine Center for Cancer Medicine", "valid hospital");
        doTestExpectPass("Maine surgical care group", "valid hospital");
        doTestExpectPass("Cedars Sanai Meical Center", "valid hospital");
        doTestExpectPass("Tore Hematology Oncology", "valid hospital");
        doTestExpectPass("Memorial Sloan Kettering Cancer Center", "valid hospital");
        doTestExpectPass("Mayo Cinic", "valid hospital");
        doTestExpectPass("University of Wisconsin Hospital", "valid hospital");
        doTestExpectPass("Waukesha Memorial Hospital", "valid hospital");		
	}*/
	

	
	public static final String[][] VALID_DOCTOR_NAMES = {
		{ "Marshall Schorin" },
	    { "Patrick Travis" },
	    { "Ahmed Kaseb" },
	    { "Prashanti Atluri" },
	    { "Stephen Cohen" },
	    { "Emmanuel Zervos" },
	    { "Winston Dunn" },
	    { "Dr. Barry" },
	    { "Richard J. Gualtieri" },
	    { "Filip Janku" },
	    { "Prasad S. Vankineni" },
	    { "Sohaib Siddiqui" },
	    { "Devon Evans" },
	    { "Lisa Rutstein" },
	    { "Tracey Wiegel" },
	    { "J. N. Vauthey" },
	    { "Steven Calquhoun" },
	    { "Solomon Hamburg" },
	    { "Michael Laquaglia" },
	    { "David M. Nagorney" },
	    { "Cifford Cho" },
	    { "Stephen R Bartos" },
	    { "Cynthia Herzog" },
	    { "Paul Gibbs" },
	    { "Graeme Alexander" },
	    { "James Fuesner" },
	    { "Robert Pelley" },
	    { "Mir Ali" },
	    { "Howard Gold" },
	    { "Jeffery Schwartz" },
	    { "Thomas Sunnenberg" },
	    { "Harry Cramer" },
	    { "Patrick Thompson" }	
	};
	

	@Test
	public void testValidHospitalNames() {
		testNames(VALID_HOSPITAL_NAMES);
	}

	@Test
	public void testValidDoctorNames() {
		testNames(VALID_DOCTOR_NAMES);
	}
		
	private void testNames(String[][] names) { 
		for (String[] nameTestSpec : names) {
			String name = nameTestSpec[0];
			String nameTestDescription = 
					nameTestSpec.length > 1 ? nameTestSpec[nameTestSpec.length - 1] : "valid name";
			System.out.println("\n\n\n\n Testing doctorName: "+name+" \n\n\n");
			doTestExpectPass(name, nameTestDescription);	
			
		}
	} 
    
/*	@Test
	public void testValidDoctors() {
        doTestExpectPass("Marshall Schorin", "valid doctor");
        doTestExpectPass("Patrick Travis", "valid doctor");
        doTestExpectPass("Ahmed Kaseb", "valid doctor");
        doTestExpectPass("Prashanti Atluri", "valid doctor");
        doTestExpectPass("Stephen Cohen", "valid doctor");
        doTestExpectPass("Emmanuel Zervos", "valid doctor");
        doTestExpectPass("Winston Dunn", "valid doctor");
        doTestExpectPass("Dr. Barry", "valid doctor");
        doTestExpectPass("Richard J. Gualtieri", "valid doctor");
        doTestExpectPass("Filip Janku", "valid doctor");
        doTestExpectPass("Prasad S. Vankineni", "valid doctor");
        doTestExpectPass("Sohaib Siddiqui", "valid doctor");
        doTestExpectPass("Devon Evans", "valid doctor");
        doTestExpectPass("Lisa Rutstein", "valid doctor");
        doTestExpectPass("Tracey Wiegel", "valid doctor");
        doTestExpectPass("J. N. Vauthey", "valid doctor");
        doTestExpectPass("Steven Calquhoun", "valid doctor");
        doTestExpectPass("Solomon Hamburg", "valid doctor");
        doTestExpectPass("Michael Laquaglia", "valid doctor");
        doTestExpectPass("Dr. Nagorney", "valid doctor");
        doTestExpectPass("Cifford Cho", "valid doctor");
        doTestExpectPass("Stephen R Bartos", "valid doctor");
        doTestExpectPass("Dr. Herzog", "valid doctor");
	}*/
}

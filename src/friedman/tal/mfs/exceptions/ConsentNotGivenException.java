package friedman.tal.mfs.exceptions;

public class ConsentNotGivenException extends Exception {

	public static final String DEFAULT_ERROR_MSG = "Please agree to the Terms and Conditions if you would like to sign up.";

	public ConsentNotGivenException() {
		super();	
	}
	
	public ConsentNotGivenException(String message) {
		super(message);
	}
	
	public ConsentNotGivenException(Throwable cause) {
		super(cause);
	}
	
	public ConsentNotGivenException(String message, Throwable cause) {
		super(message, cause);
	}
	
}

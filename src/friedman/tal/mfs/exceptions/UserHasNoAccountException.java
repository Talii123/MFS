package friedman.tal.mfs.exceptions;

public class UserHasNoAccountException extends Exception {
	public UserHasNoAccountException() {
		super();	
	}
	
	public UserHasNoAccountException(String message) {
		super(message);
	}
	
	public UserHasNoAccountException(Throwable cause) {
		super(cause);
	}
	
	public UserHasNoAccountException(String message, Throwable cause) {
		super(message, cause);
	}
}

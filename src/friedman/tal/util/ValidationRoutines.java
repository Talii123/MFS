package friedman.tal.util;

public class ValidationRoutines {

	public static String requireTrimmedNonEmptyString(String anInputString) {
		return ValidationRoutines.requireTrimmedNonEmptyString(anInputString, Utils.DEFAULT_ERROR_STRING);
	}

	public static String requireTrimmedNonEmptyString(String anInputString, String anErrorString) {
		String errorString = anErrorString != null ? anErrorString : Utils.DEFAULT_ERROR_STRING;
	
		if (anInputString == null) {
			if (!Utils.DEFAULT_ERROR_STRING.equals(errorString)) {
				throw new IllegalArgumentException(errorString);
			}
			else {
				throw new IllegalArgumentException(String.format(anErrorString, "it's null"));
			}
		}
		anInputString = anInputString.trim();
	
		if (anInputString.isEmpty()) {
			if (!Utils.DEFAULT_ERROR_STRING.equals(errorString)) {
				throw new IllegalArgumentException(errorString);
			}
			else {
				throw new IllegalArgumentException(String.format(anErrorString, "it's the empty string!"));
			}
		}
	
		return anInputString;
	}

	public static String getTrimmedNonEmptyString(String anInputString) {
		return anInputString != null ? anInputString.trim() : "";
	}

}

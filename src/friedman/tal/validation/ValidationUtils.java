package friedman.tal.validation;


public class ValidationUtils {
	public static final String LETTERS = "[\\pL]+";
	public static final String LETTERS_AND_OPT_DOT = "[\\pL\\'\\-]+[\\.]?";
	public static final String LETTERS_AND_OPT_COMMA = "[\\pL]+[,]?";
	public static final String LETTERS_AND_OR_NUMBERS = "[\\pL\\pN]+";
	public static final String ALPHANUMERIC_W_SPACES_REGEX_PATTERN = "^[\\pL\\pN\\p{Blank}]+$";
	
    public static final String BLANK = "\\p{Blank}";
	public static final String OPT_BLANK = "\\p{Blank}?";
	public static final String LETTERS_AND_BLANKS = "[\\pL](?:\\p{Blank}*[\\pL]+)*";
	
	public static final String NAME_REGEX_PATTERN = 
			"^"+LETTERS_AND_OPT_DOT+"(?:"+BLANK+"*" + LETTERS_AND_OPT_DOT + "+)*$"; //"^[\\pL]*$";
	public static final String LOCATION_REGEX_PATTERN = 
			"^"+LETTERS_AND_OPT_COMMA + "(?:" + BLANK + "*" + LETTERS_AND_OPT_COMMA +"+)*$";
	
	public static final String VALID_CHEMO_SEPARATORS = "[,\\/\\+\\-" + BLANK + "]";			
	public static final String CHEMO_NAME_REGEX_PATTERN = "[\\pL\\pN\\-]+";
	public static final String CHEMO_NAME_IN_BRACKETS_PATTERN = 
			"\\(" + CHEMO_NAME_REGEX_PATTERN + 
				"(?:" +BLANK +"*" + CHEMO_NAME_REGEX_PATTERN + ")*" + 
			"\\)";
	
	public static final String SINGLE_CHEMO_REGEX_PATTERN = 
			"(?:(?:" +CHEMO_NAME_IN_BRACKETS_PATTERN +")|(?:" + CHEMO_NAME_REGEX_PATTERN + "))";
			//CHEMO_NAME_REGEX_PATTERN;
	public static final String CHEMO_REGEX_PATTERN =
			"^" + SINGLE_CHEMO_REGEX_PATTERN + ""
			+ "(?:" + VALID_CHEMO_SEPARATORS + "+" + SINGLE_CHEMO_REGEX_PATTERN + ")*$";
	
	public static final String ENCODED_STRING_ARRAY_DELIM = "\\:";
	public static final String ENCODED_STRING_ARRAY_REGEX_PATTERN =
			"^" + LETTERS_AND_BLANKS + "(?:"+ENCODED_STRING_ARRAY_DELIM+LETTERS_AND_BLANKS+")*$";
}

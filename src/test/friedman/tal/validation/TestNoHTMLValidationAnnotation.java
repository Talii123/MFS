package test.friedman.tal.validation;

import org.junit.Test;

public class TestNoHTMLValidationAnnotation extends TestValidationEmptyAnnotationsBase {

	public static final String[][] HTML_TAGS_NESTING_PAIRS = new String[][] {
		{ "div", "span" },
		{ "span", "img" },
		{ "span", "a" },
		{ "img", "a" },
		{ "a", "img" }
	};
	
	public static final String[] DISALLOWED_HTML_TAGS = new String[]{
		"a",
		"img",
		"br",
		"cite",
		"code",
		"b",
		"i",
		"u",
		"strong",
		"em",
		"q",
		"pre",
		"p",
		"div",
		"span",
		"blockquote",
		"script",
		"table",
		"dl",
		"dd",
		"dt",
		"ol",
		"ul",
		"li",
		"h1",
		"h2",
		"h3",
		"h4",
		"h5",
		"h6",
		"small",
		"strike",
		"sub",
		"sup",
		"article",
		"section",
		"form",
		"input",
		"button",
		"legend",
		"select",
		"option",
		"optgroup",
		"fieldset",
		"acronym",
		"abbr",
		"address",
		"applet",
		"area",
		"base",
		"bdo",
		"big",
		"center",
		"del",
		"dfn",
		"dir",
		"font",
		"iframe",
		"ins",
		"isindex",
		"kbd",
		"label",
		"link",
		"map",
		"menu",
		"meta",
		"noframes",
		"noscript",
		"object",
		"param",
		"s",
		"samp",
		"style",
		"textarea",
		"tt",
		"var"
		
		/* ???
		 * I guess these are considered safe HTML tags?  none of them fail validation as expected
		 * 
		 
		"body",

		"caption",		
		"tr",
		"td",
		"th",
		"tbody",
		"thead",
		"tfoot",
		"col",
		"colgroup",
		"frame",
		"frameset",
		"html",
		
		"!doctype",*/
		
	};
	
	@Override
	public void doTestExpectPass(String testValue, String testDescription) {
		doTestExpectPass(testValue, testDescription, "htmlValue");
	}

	@Override
	public void doTestExpectFail(String testValue, String testDescription) {
		doTestExpectFail(testValue, testDescription, "htmlValue");
	}

	@Override
	public String getAnnotationName() {
		return "noHTML";
	}

	@Test
	public void testCanHaveNonHTML() {
		doTestExpectPass("This is a description", "plain string");
		doTestExpectPass("This is a description, but with punctuation.", "comma and period allowed");
		doTestExpectPass("$4.00 is less than 534 cents", "number and currency is allowed");
		doTestExpectPass("Line 1 \n\t Line 2\n\r line 3 \f ", "tabs, line feeds and carriage returns are allowed");
	}
	
	
	@Test
	public void testCannotHaveHTML() {
		for (String disallowedHTMLStr : DISALLOWED_HTML_TAGS) {
			doTestTagPermutations(disallowedHTMLStr);
		}

		for (String[] testPair : HTML_TAGS_NESTING_PAIRS) {
			doTestTagPermutations(testPair[0], testPair[1]);
		}
	}
	
	
	public void doTestTagPermutations(String t1) {
		String[][] singleTagTests = getSingleTagTests(t1);
		for (String[] valueAndDescription : singleTagTests) {
			doTestExpectFail(valueAndDescription[0], valueAndDescription[1]);
		}
	}	
	
	public static String[][] getSingleTagTests(String t1) {
		return new String[][] {
			{ String.format("<%s>", t1), String.format("single %s open tag.", t1) },
			{ String.format("<%s></%s>", t1, t1), String.format("%s open and close tag.", t1) },
			{ String.format("<%s/>", t1), String.format("%s empty tag.", t1) },
			{ String.format("<%s />", t1), String.format("%s empty tag.", t1) },
			{ String.format("<%s />", t1), String.format("%s empty tag.", t1) },
			{ String.format("<%s>Some content</%s>", t1, t1), String.format("%s with some content (may not make sense in HTML)", t1) }
		};
	}

	
	public void doTestTagPermutations(String t1, String t2) {
		String[][] singleTagTests = getTwoTagTests(t1, t2);
		for (String[] valueAndDescription : singleTagTests) {
			doTestExpectFail(valueAndDescription[0], valueAndDescription[1]);
		}
	}
	
	public static String[][] getTwoTagTests(String t1, String t2) {
		return new String[][] {	
			{ String.format("<%s><%s></%s></%s>", t1, t2, t2, t1), String.format("%s and %s, properly nested.", t1, t2) },
			{ String.format("<%s></%s><%s></%s>", t1, t1, t2, t2), String.format("%s and %s not nested.", t1, t2) },
			{ String.format("<%s></%s></%s><%s></%s>", t1, t1, t1, t2, t2), String.format("%s and %s, improperly nested.", t1, t2) },
			{ String.format("<%s></%s><%s></%s></%s>", t1, t1, t2, t2, t2), String.format("%s and %s, improperly nested.", t1, t2) }
		};
	}
	
}

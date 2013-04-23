package friedman.tal.util;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.SortedSet;
import java.util.TreeSet;

import javax.servlet.http.HttpServletRequest;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.SerializationConfig;

import friedman.tal.mfs.MyFibroStoryApplication;
import friedman.tal.mfs.users.IUserInfo;
import friedman.tal.mfs.users.UserInfo;


public class Utils {
	private static final String EMPTY_STRING = "";

	public static final String DEFAULT_ERROR_STRING = "String is invalid because: %s";
	
	public static final String HTML_FORM_MEDIATYPE = "application/x-www-form-urlencoded";
	
	public static <E> List<E> newList() {
		return new ArrayList<E>();
	}
	
	public static <K, V> Map<K, V> newMap() {
		return new HashMap<K, V>();
	}
	
	public static <E> Set<E> newSet() {
		return new HashSet<E>();
	}
	
	public static <E> SortedSet<E> newSortedSet() {
		return new TreeSet<E>();
	}
	
	
	public static void read(InputStream in) {
		read(new InputStreamReader(in));
	}

	public static void read(Reader aReader) {
		BufferedReader reader = new BufferedReader(aReader);
		try {
			String line;
			while ((line = reader.readLine()) != null) {
				System.out.println(line);
			}			
			reader.close();
		} catch (Exception e) {
			e.printStackTrace(System.err);
		}
	}

	public static String getValueOrEmptyString(String value) {
		return value != null ? value.trim() : EMPTY_STRING;
	}
	
	public static String getValueOrDefault(String value, String defaultValue) {
		return value != null ? value.trim() : defaultValue;
	}
	
	public static String getValueOrEmptyString(String value, boolean isTrimWanted) {
		return value != null ? (isTrimWanted ? value.trim() : value) : EMPTY_STRING;
	}
	
	public static String getValueOrDefault(String value, String defaultValue, boolean isTrimWanted) {
		return value != null ? (isTrimWanted ? value.trim() : value) : defaultValue;
	}	

	public static IUserInfo getRemoteUserInfo(HttpServletRequest request) {
		return new UserInfo(request.getRemoteAddr(), request.getRemoteHost(), request.getRemotePort(), request.getRemoteUser());
	}

	public static String stackTraceToLogString(StackTraceElement[] elements) {
		StringBuilder sb = new StringBuilder();
		for (StackTraceElement element : elements) {
			sb.append("\n").append(element.toString());
		}
		
		return sb.toString();
	}

	public static ObjectMapper getDebuggingMapper() {
		ObjectMapper mapper = MyFibroStoryApplication.getMapper();
		mapper.configure(SerializationConfig.Feature.INDENT_OUTPUT, true);
		return mapper;
	}
	
}

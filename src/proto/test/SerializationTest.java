package proto.test;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

import javax.ws.rs.WebApplicationException;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.SerializationConfig;

public class SerializationTest {

	public static final ObjectMapper MAPPER;
	static {
		MAPPER = new ObjectMapper();
		
		//SerializationConfig.Feature.
		MAPPER.configure(SerializationConfig.Feature.INDENT_OUTPUT, true);
		MAPPER.configure(SerializationConfig.Feature.FAIL_ON_EMPTY_BEANS, false);
	 	SimpleDateFormat sdf = new SimpleDateFormat("MMM dd yyyy HH:mm:ss Z", Locale.US);
	 
		MAPPER.setDateFormat(sdf);
		
	}
	
	public static void main(String args[]) throws JsonGenerationException, JsonMappingException, IOException {
		
		
	
		writeDate(new Simple());
		writeDate(new Simple(new Date(1979, 04, 26)));
		writeDate(new Simple(new Date(1979, 03, 26)));
	}

	private static void writeDate(Simple test)
			throws IOException, JsonGenerationException, JsonMappingException {
		String serialized = MAPPER.writeValueAsString(test);
		System.out.println("serialized: " + serialized);
	}
	
	private static class Simple {
		private long longTime;
		private Date dateTime;
		
		private Simple() {
			this.dateTime = new Date();
			this.longTime = this.dateTime.getTime();
		}
		
		private Simple(Date aDate) {
			this.dateTime = aDate;
			this.longTime = this.dateTime.getTime();
		}
		
		public long getLongTime() {
			System.out.println("getLongTime called");
			return this.longTime;
		}
		
		public Date getDateTime() {
			System.out.println("getDateTime called");
			return this.dateTime;
		}
	}
	
}

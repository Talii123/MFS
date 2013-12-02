package nolongerused;

import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class JacksonTest {
	
	public static final Logger LOGGER = LoggerFactory.getLogger(JacksonTest.class);

	public static void main(String[] args) throws Exception {
		System.out.println("Tal this is fucked up!");
		LOGGER.info("hi tal!");
		/*_logger.info("array! {}, {}", new String[]{"1", "two", "3.0"});
		StringBuilder sb = new StringBuilder("TimelineEventTypeDefinition.values() = ");
		TimelineEventTypeDefinition[] defs = TimelineEventTypeDefinition.values();
		for (int i=0; i < defs.length; ++i) {
			sb.append("{} ");
		}
		_logger.info(sb.toString(), defs);

		_logger.info("Another try: {}", (Object[])defs);*/
		LOGGER.info("TimelineEventTypeDefinition.values() = {}", (Object)TimelineEventTypeDefinition.values());
		//ObjectMapper mapper = new ObjectMapper();
		//mapper.writeValue(System.out, TimelineEventType.values());
		//System.out.flush();
		//mapper.writeValue(System.out, TimelineEventTypeDefinition.SURGERY);
		//System.out.flush();
		
		
	}
}

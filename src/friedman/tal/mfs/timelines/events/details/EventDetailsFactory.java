package friedman.tal.mfs.timelines.events.details;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import friedman.tal.mfs.timelines.events.EventType;
import friedman.tal.mfs.timelines.events.IEventDetails;
import friedman.tal.util.Utils;


public class EventDetailsFactory {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(EventDetailsFactory.class);
	
	private static final Map<String, EventType> detailsTypeEventTypeMap;
	
	static {
		detailsTypeEventTypeMap = Utils.newMap();
		detailsTypeEventTypeMap.put(ChapterDetails.class.getSimpleName(), EventType.CHAPTER);
		detailsTypeEventTypeMap.put(DiagnosisDetails.class.getSimpleName(), EventType.DIAGNOSIS);		
		detailsTypeEventTypeMap.put(SurgeryDetails.class.getSimpleName(), EventType.SURGERY);
		detailsTypeEventTypeMap.put(ChemoDetails.class.getSimpleName(), EventType.CHEMO);		
		detailsTypeEventTypeMap.put(RadiationDetails.class.getSimpleName(), EventType.RADIATION);
		detailsTypeEventTypeMap.put(ImmunoDetails.class.getSimpleName(), EventType.IMMUNO);
		detailsTypeEventTypeMap.put(TestDetails.class.getSimpleName(), EventType.TEST);
	}
	
	public static final EventType getEventTypeForDetails(IEventDetails anEventDetails) {
		return detailsTypeEventTypeMap.get(anEventDetails.getClass().getSimpleName());
	}

	public static IEventDetails getAsEventDetails(EventType anEventType, Map<String, String> anEventDetailsMap) {
		LOGGER.debug("anEventType: {} , anEventDetailsMap: {}", anEventType, anEventDetailsMap);
		
		IEventDetails details;
		
		switch (anEventType) {
		case CHAPTER:
			details = ChapterDetails.fromMap(anEventDetailsMap);
			break;
			
		case DIAGNOSIS:
			details = DiagnosisDetails.fromMap(anEventDetailsMap);
			break;

		case SURGERY: 
			details = SurgeryDetails.fromMap(anEventDetailsMap);
			break;
			
		case CHEMO:
			details = ChemoDetails.fromMap(anEventDetailsMap);
			break;
			
		case RADIATION:
			details = RadiationDetails.fromMap(anEventDetailsMap);
			break;
			
		case IMMUNO:
			details = ImmunoDetails.fromMap(anEventDetailsMap);
			break;
			
		case TEST:
			details = TestDetails.fromMap(anEventDetailsMap);
			break;
		default:
			LOGGER.error("Unrecognized Event Details type: {}; cannot create an Event Details object.", anEventType);
			throw new IllegalArgumentException(String.format("Unrecognized Event Details type: %s; cannot create an Event Details object.", anEventType));
		}
		
		return details;
	}	
}

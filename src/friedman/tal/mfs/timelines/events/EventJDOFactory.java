package friedman.tal.mfs.timelines.events;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import friedman.tal.mfs.timelines.EventJDO;


public class EventJDOFactory {
	private static final Logger LOGGER = LoggerFactory.getLogger(EventJDOFactory.class);

	public static EventJDO createEvent(IEvent anEvent) {
		EventJDO eventJDO;
		EventType eventType = anEvent.getType(); 
		switch (eventType) {
		case CHAPTER:
			eventJDO = new ChapterEventJDO(anEvent);
			break;
			
		case DIAGNOSIS:
			eventJDO = new DiagnosisEventJDO(anEvent);
			break;

		case SURGERY: 
			eventJDO = new SurgeryEventJDO(anEvent);
			break;
			
		case CHEMO:
			eventJDO = new ChemoEventJDO(anEvent);
			break;
			
		case RADIATION:
			eventJDO = new RadiationEventJDO(anEvent);
			break;
			
		case IMMUNO:
			eventJDO = new ImmunoEventJDO(anEvent);
			break;
			
		case TEST:
			eventJDO = new TestEventJDO(anEvent);
			break;
		default:
			LOGGER.error("Unrecognized Event type: {}; cannot create an EventJDO object.", eventType);
			throw new IllegalArgumentException(String.format("Unrecognized Event type: %s; cannot create an EventJDO object.", eventType));
		}
		
		return eventJDO;
	}	

}

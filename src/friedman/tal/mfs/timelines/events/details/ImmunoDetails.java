package friedman.tal.mfs.timelines.events.details;

import java.util.Map;

import javax.jdo.annotations.EmbeddedOnly;
import javax.jdo.annotations.PersistenceCapable;

import friedman.tal.mfs.resources.IImmunoDetails;
import friedman.tal.mfs.timelines.events.EventDetails;


@PersistenceCapable
@EmbeddedOnly
public class ImmunoDetails extends EventDetails implements IImmunoDetails {

	
	/*public enum Field {
		
	}*/
	
	private ImmunoDetails(Map<String, String> aMap) {		
		// this check cannot be moved to the super class constructor
		if (aMap == null) return;
		
		/*String value;
		
		value = Utils.getValueOrEmptyString(aMap.get(Field.oncologist.name()));
		*/
		
	}
	
	public static ImmunoDetails fromMap(Map<String, String> aMap) {
		return new ImmunoDetails(aMap);
	}
	
	/*@Override
	public final EventType getType() {
		return EventType.IMMUNO;
	}*/
}

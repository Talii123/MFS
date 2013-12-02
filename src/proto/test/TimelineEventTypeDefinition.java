package proto.test;

import java.util.Arrays;

public enum TimelineEventTypeDefinition {
	SURGERY(TimelineEventType.SURGERY, new String[] {
			"surgeon", 
			"fellow", 
			"resident", 
			"physicianAssistant", 
			"hospital", 
			"location", 
			"recoveryTimeHospital", 
			"recoveryTimeHome"}),
			
	CHEMOTHERAPY(TimelineEventType.CHEMOTHERAPY, new String[] {
			"oncologist"
	}),
	
	RADIATION(TimelineEventType.RADIATION, new String[] {
			"oncologist"
	}),
	IMMUNOTHERAPY(TimelineEventType.IMMUNOTHERAPY, new String[] {			
	}),
	TEST(TimelineEventType.TEST, new String[] {			
	});
	
	
	private final TimelineEventType _eventType;
	private final String[] _expectedFields;
	
	private TimelineEventTypeDefinition(TimelineEventType aTimelineEventType, String[] fieldsExpectedForThisEventType) {
		this._eventType = aTimelineEventType;
		this._expectedFields = fieldsExpectedForThisEventType;
	}
	
	public String[] getExpectedFields() {
		return Arrays.copyOf(this._expectedFields, this._expectedFields.length) ;
	}
	
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("{");
		sb.append("eventType : ").append(this._eventType);
		sb.append(", expectedFields : ");
		sb.append("[");
		
		for (String field : _expectedFields) {
			sb.append(field).append(", ");
		}
		int length = sb.length();
		sb.delete(length-2, length);
		sb.append("]");
		sb.append("}");
		
		return sb.toString();
	}
	
}

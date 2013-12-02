package friedman.tal.mfs.timelines;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.SerializationConfig;
import org.hibernate.validator.constraints.SafeHtml;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import friedman.tal.NotSet;
import friedman.tal.mfs.timelines.events.EventType;
import friedman.tal.mfs.timelines.events.IEvent;
import friedman.tal.mfs.timelines.events.IEventDetails;
import friedman.tal.mfs.timelines.events.details.EventDetailsFactory;
import friedman.tal.util.IDeserializationProblemHandler;
import friedman.tal.util.Utils;
import friedman.tal.util.SavePropsDeserializationProblemHandler.UnhandledProperty;

// NOTE: data in this object is unsafe/unreliable; it comes from data provided by the end user
public class EventTO implements IEvent, IDeserializationProblemHandler {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(EventTO.class);
	
	private Long _start;
	private Long _end;
	private String _title;
	
	//private String _type;
	//private byte _typeIndex;
	private EventType _type;
	
	// works but don't want to support for now
	//private String _icon;
	
	private String _id;
	private String _eventID;
	
	private String _description;
	
	private Map<String, String> _eventDetailsMap = Utils.newMap();
	
	private List<UnhandledProperty> _unhandledProperties;

	//private EventDetails _eventDetails;
	
	
	public EventTO() {	
		this._unhandledProperties = Utils.newList();
	}
	
	@Override
	public void addUnhandledProperty(UnhandledProperty anUnhandledProperty) {
		System.out.println(String.format("UnhandledProperty: %s", anUnhandledProperty));
		this._unhandledProperties.add(anUnhandledProperty);		
	}


	public void setTypeDetails(Map<String, String> aTypeDetailsMap) {
		this._eventDetailsMap = aTypeDetailsMap;
		/*System.out.println("map.size(): "+aTypeDetailsMap.size());
		System.out.println("map: "+aTypeDetailsMap);
		
		if (this._type != null) {	// type has already been set, but because typeDetailsMap was not set before it, now
											// it's time to set the type details
			setTypeDetails();
		}*/
	
	}	
	
	/*private void setTypeDetails() {
		this._eventDetails = EventDetailsFactory.getEventDetailsFor(this._type, this._eventDetailsMap);
	}*/
		
	@Override
	public IEventDetails getTypeDetails() {
		//LOGGER.debug("getTypeDetails; this._type = {},\n this._eventDetailsMap = {}", this._type, this._eventDetailsMap);
		return EventDetailsFactory.getAsEventDetails(this._type, this._eventDetailsMap);
		//return EventDetailsFactory.getAsEventDetails(EventType.DIAGNOSIS, this.getTypeDetailsMap());
	}	
	
	public Map<String, String> getTypeDetailsMap() {
		return _eventDetailsMap;
	}
	
	
	public Long getStartMillis() {
		return this._start;
	}
	
	public Long getEndMillis() {
		return this._end;
	}	

	private Long convertDateStringToLong(String aDateString) {
		if (aDateString == null) return NotSet.LONG;
		
		Long result;		
		aDateString = aDateString.trim();
		try {
			result = Long.parseLong(aDateString);
		} catch (NumberFormatException e) {
			result = aDateString.length() > 0 ? new Date(aDateString).getTime() : NotSet.LONG;	
		}
		return result;
	}
	
	public void setStart(String aStart) {
		//LOGGER.debug("aStart: '{}' ", aStart);
		this._start = convertDateStringToLong(aStart);		
	}

	public void setEnd(String anEnd) {
		//LOGGER.debug("anEnd: '{}' ", anEnd);
		this._end = convertDateStringToLong(anEnd);
	}


	public void setTitle(String aTitle) {
		this._title = aTitle;
	}



	@Override
	public Date getStart() {
		return this._start != NotSet.LONG ? new Date(this._start) : null;
	}

	@Override
	public Date getEnd() {
		return this._end != NotSet.LONG ? new Date(this._end) : null;
	}

	@Override
	public String getTitle() {
		return this._title;
	}

	@Override
	public EventType getType() {
		return _type;
	}

	/*public void setType(String aType) {
		this._type = EventType.valueOf(aType);
		
		/*if (this._eventDetailsMap != null) {	// when the type details map was set, the type wasn't known yet, so the type
			setTypeDetails();						// details have not been set yet; set them now.
		}*//*
	}*/

	/*@Override
	public byte getTypeIndex() {
		return this._typeIndex;
	}*/

	public void setType(EventType anEventType) {
		LOGGER.debug("setType called to set the type");
		this._type = anEventType;
	}
	
	public void setTypeIndex(byte aTypeIndex) {
		LOGGER.debug("setTypeIndex(byte) called to set the type");
		this._type = EventType.values()[aTypeIndex+1];
	}
	
	/*public void setTypeIndex(EventType anEventType) {
		LOGGER.debug("setTypeIndex(eventType) called to set the type");
		this._type = anEventType;
	}	*/

	
	/* works but don't want to support now
	@Override
	public String getIcon() {
		return _icon;
	}
	*/
	

	@Override
	@SafeHtml
	public String getDescription() {
		return this._description;
	}
	
	public void setDescription(String aDescription) {
		if (aDescription != null ) {
			aDescription = aDescription.trim();
			if (aDescription.length() > 0) {
				this._description = aDescription;	
			}
		}
	}

	/* works but don't want to support for now
	public void setIcon(String anIcon) {
		this._icon = anIcon;
	}
	*/

	@Override
	public String getID() {
		return _id;
	}

	public void setId(String anID) {
		this._id = anID;
	}

	public String getEventID() {
		return _eventID;
	}

	public void setEventID(String anEventID) {
		this._eventID = anEventID;
	}

	@Override
	public String toString() {
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(SerializationConfig.Feature.INDENT_OUTPUT, true);
		try {
			return mapper.writeValueAsString(this);
		} catch (Exception e) {			
			e.printStackTrace();
			return this.getClass().getName() + "(\"" + this._title + "\" from " + this._start + " to " + this._end + ")";
		}		
	}
	
}

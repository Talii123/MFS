package friedman.tal.mfs.timelines;


import java.util.Date;

import javax.jdo.annotations.Column;
import javax.jdo.annotations.Embedded;
import javax.jdo.annotations.Extension;
import javax.jdo.annotations.Inheritance;
import javax.jdo.annotations.InheritanceStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.SerializationConfig;

import com.google.appengine.api.datastore.Text;

import friedman.tal.NotSet;
import friedman.tal.jdo.GAEJKeyType;
import friedman.tal.jdo.TypedKey;
import friedman.tal.mfs.timelines.events.EventType;
import friedman.tal.mfs.timelines.events.IEvent;
import friedman.tal.mfs.timelines.events.details.EventDetailsFactory;

@PersistenceCapable
@Inheritance(strategy = InheritanceStrategy.SUBCLASS_TABLE)
public abstract class EventJDO implements IEvent, Comparable<EventJDO> {

    @PrimaryKey
    @Persistent//(valueStrategy = IdGeneratorStrategy.IDENTITY)
    @Extension(vendorName="datanucleus", key="gae.encoded-pk", value="true")
    private String _encodedKey;
    
    /*@Persistent
    @Extension(vendorName="datanucleus", key="gae.pk-id", value="true")
    private Long _keyId;*/
    
    @Persistent
    //@Extension(vendorName="datanucleus", key="gae.pk-name", value="true")
    private String _eventName;
    
    @Persistent
    @Embedded(members = {
    		@Persistent(name = "_objectType", columns = @Column( name = "_timelineObjectType" )),
    		@Persistent(name = "_keyType", columns = @Column( name = "_timelineKeyType" )),
    		@Persistent(name = "_keyValueString", columns = @Column( name = "_timelineKeyValueString" ))
    })
    private TypedKey<? extends ITimeline, ?> _timelineKey;

	
	@Persistent
	private Long _start;
	
	@Persistent
	private Long _end;
	
	@Persistent
	private String _title;
		
	/* works but don't want to support for now
	@Persistent
	private String _icon;
	*/
	
	@Persistent
	private Text _description;
	
	/*@Persistent
	private EventType _type;
	
	@Persistent
	private EventDetails _eventDetails;*/
	
	
	
	/*EventJDO(Date aStartDate, Date anEndDate, String aTitle) {
		this(aStartDate.getTime(), anEndDate.getTime(), aTitle);
	}
	
	EventJDO(long aStartTime, long anEndTime, String aTitle) {
		this._start = aStartTime;
		this._start = anEndTime;
		this._title = aTitle;
	}*/
	
	protected TypedKey<? extends EventJDO, String> getTypedKey() throws IllegalAccessException {
		if (this._encodedKey == null) {
			throw new IllegalAccessException("Cannot provide a Key before one is generated.  You have to pass a valid Timeline into setTimeline() before this method can be called.");
		}
		return TypedKey.create(this.getClass(), this._encodedKey, GAEJKeyType.KEY_STRING);
	}
	
	// for now, use default .equals() method -> events are only equal if it they have the same key
	
	public EventJDO(IEvent anEvent) {
		//this.keyName = TypedKey.create(this.getClass(), anEvent.getID(), GAEJKeyType.) ;
		//this._timelineKey = aTimelineKey.getKeyValue();
		this._eventName = anEvent.getID();
		
		Date startDate = anEvent.getStart();	
		this._start = startDate != null ? startDate.getTime() : NotSet.LONG;
		Date endDate = anEvent.getEnd();
		// for some bizarre reason, sometimes the ternary operator does not work properly with JDO
		if (endDate != null) {
			this._end = endDate.getTime();
		}
		else {
			this._end = NotSet.LONG;
		}
		//this._end = (endDate != null) ? endDate.getTime() : NotSet.LONG; 
		this._title = anEvent.getTitle();
		
		/* works but don't want to support for now
		this._icon = anEvent.getIcon();
		*/
		
		//this._type = anEvent.getType();
		//this._eventDetails = EventDetailsFactory.getAsEventDetails(this._type, anEvent.getTypeDetailsMap());
		
		String description = anEvent.getDescription();
		if (description != null) {
			description = description.trim();
			if (description.length() > 0) {
				this._description = new Text(description);	
			}			
		}
		
	}
	
	// TODO: should we also provide a 'logical equals' method?
	
	// TODO: do not allow events to be reassigned to different timelines - check to see it does not already have a timeline
	void setTimeline(TimelineJDO aTimelineJDO) {
		this._timelineKey = aTimelineJDO.getTypedKey();
		TypedKey<? extends ITimeline, ?> key  = this._timelineKey;
		System.out.println(String.format("timeline key: %s", key));
		System.out.println(String.format("timeline key.getKeyValue(): %s", key.getKeyValue()));
		
		this._encodedKey = TypedKey.createEncoded(this.getClass(), this._eventName, this._timelineKey).getKeyValue();		
		System.out.println(String.format("encodedKey : %s", this._encodedKey));
	}
	
	// NOTE: this must not change based on mutating the values of the various fields of this class, as per the Set/HashSet specs;
	// from the point of view of any code, including a set of this object, any two EventJDOs with the same key are the same
	// object, even if their data differs.  This syncs well with the PersistenceManager implementation which will overwrite an
	// object in the datastore if it exists with the same key as an object being written.
	@Override
	public boolean equals(Object other) {
		if (this == other) return true;
		try {
			EventJDO otherEventJDO = (EventJDO)other;
			return this._encodedKey == otherEventJDO._encodedKey || (this._encodedKey != null && this._encodedKey.equals(otherEventJDO._encodedKey));
			
		} catch (ClassCastException e) {
			return false;
		}
	}

	@Override
	public int hashCode() {
		return this._encodedKey != null ? this._encodedKey.hashCode() : 0;
	}
	
	// TODO: verify this is right
	@Override
	public int compareTo(EventJDO other) {
		return this._encodedKey != null ?  this._encodedKey.compareTo(other._encodedKey) : 
			// String.compareTo(null) is probably a well defined constant - we should be able to avoid the method call here
			(other._encodedKey != null ? other._encodedKey.compareTo(null) : 0);
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

	


	@Override
	public String getID() {
		return this._eventName;
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

	/* works but don't want to support for now
	@Override
	public String getIcon() {
		return this._icon;
	}
	*/
	
	@Override
	public String getDescription() {
		return this._description != null ?  this._description.getValue() : null;
	}

	public byte getTypeIndex() {
		return (byte)(getType().ordinal() - 1);
	}

	@Override
	public EventType getType() {
		return EventDetailsFactory.getEventTypeForDetails(this.getTypeDetails());
	}

	/*@Override
	public EventDetails getTypeDetails() {
		return this._eventDetails;
	}*/

}

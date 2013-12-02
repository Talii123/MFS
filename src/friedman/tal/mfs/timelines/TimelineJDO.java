package friedman.tal.mfs.timelines;

import java.util.Collection;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.jdo.annotations.Extension;
import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.NotPersistent;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.SecurityContext;

import org.codehaus.jackson.map.ObjectMapper;
import org.jboss.resteasy.spi.UnauthorizedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.appengine.api.datastore.Text;


import friedman.tal.IUserID;
import friedman.tal.UserIDStringImpl;
import friedman.tal.jdo.GAEJKeyType;
import friedman.tal.jdo.IJDO;
import friedman.tal.jdo.TypedKey;
import friedman.tal.mfs.MyFibroStoryApplication;
import friedman.tal.mfs.SharingOption;
import friedman.tal.mfs.timelines.events.EventType;
import friedman.tal.mfs.timelines.events.IEvent;
import friedman.tal.mfs.users.UserAccountJDO;
import friedman.tal.util.Utils;

@PersistenceCapable
public class TimelineJDO implements ITimeline {
	
	@NotPersistent
	private static final String ID_PATTERN_STR = "\"id\"\\s*\\:\\s*\"([^\\\"]+)\"";
	
	@NotPersistent
	private static final Pattern ID_PATTERN = Pattern.compile(ID_PATTERN_STR);
	
	@NotPersistent
	public static final Logger LOGGER = LoggerFactory.getLogger(TimelineJDO.class);
	
	@NotPersistent
	private static final String UNAUTHORIZED_ACCESS_ERROR = "Error: Security Context does not have permission to access this timeline!  \n timeline: %s \n securityContext: %s ";

	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	@Extension(vendorName = "datanucleus", key = "gae.encoded-pk", value="true")
	private String _encodedKey;
	
	// @Unique
	@Persistent
	private String _publicID;
	
	
	@Persistent(serialized = "true")
	private TimelineAccessController _ac;
	
	/*@Persistent
	private UniqueID _publicID;
	
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	private String _timelineLookupKey;*/
	
	/*@Persistent
	@Embedded
	private PublicTimelineID _publicID;*/
	
	
	/* Maps cannot be persisted in a deserialized format by GAEJ :(
	*/
	
	//private Set<EventJDO> _events; // do we need a concrete subtype of Set?
	//@Unowned
	/*@Persistent
	private Set<TypedKey<? extends EventJDO, String>> _events;*/
	
	@Persistent
	private String _ownerID;

	@Persistent(serialized = "true")
	//private Set<String> _eventJSONS;
	private Set<Text> _eventJSONS;

	@Persistent(serialized = "true")
	//private Set<String> _chapterJSONS;
	private Set<Text> _chapterJSONS;
	
	// TODO: check - I think this is no longer used
	public TimelineJDO(UserAccountJDO owner, SharingOption aSharingOption) {
		this(owner, null, aSharingOption);
		LOGGER.debug("autogenerated an ID for the timeline. (NOTE: it's generated by the application, not the datastore)");		
	}
	
	public TimelineJDO(UserAccountJDO owner, String aPublicTimelineID, SharingOption aSharingOption) {
		owner.setTimeline(this);
		LOGGER.debug("Naming timeline '{}' ", aPublicTimelineID);
		//this._publicID = makeID(aPublicTimelineID);  // note that outside of a transaction context, this has to happen before the timeline is added to the owning UserAccount object.				
		this._publicID = aPublicTimelineID;
		
		setOwnerID(owner.getUserId().getStringId());
		this._ac = TimelineAccessController.getAccessControllerFor(aSharingOption);
		
		//this._events = Utils.newSet();
		this._eventJSONS = Utils.newSet();
		this._chapterJSONS = Utils.newSet();
	}	
	
	private void setOwnerID(String aUserIDString) {
		// for now, store the raw userID string (which is currently an email address)
		// in future, if we want to encode or encrypt the userID somehow, this would be a good place to do it
		this._ownerID = aUserIDString;
	}

	TypedKey<? extends ITimeline, String> getTypedKey() {
		return TypedKey.create(this.getClass(), this._encodedKey, GAEJKeyType.KEY_STRING);
	}
	
	
	boolean deleteEventJSONForId(String anEventID, SecurityContext requestor) {
		LOGGER.debug("delete Event JSON called for eventID: {} and requestor: {}", anEventID, requestor);
		return deleteEventJSON(anEventID, this._eventJSONS, requestor);
	}
	
	boolean deleteChapterJSONForId(String anEventID, SecurityContext requestor) {
		LOGGER.debug("delete Chapter JSON called for eventID: {} and requestor: {}", anEventID, requestor);
		return deleteEventJSON(anEventID, this._chapterJSONS, requestor);
	}	

	private boolean deleteEventJSON(String anEventID, Collection<Text> jsons, SecurityContext requestor) {
		boolean isDeleted;
		if (this.canWrite(requestor)) {
			String eventToDelete = findById(anEventID, jsons);
			if (eventToDelete != null) {
				isDeleted = jsons.remove(new Text(eventToDelete));
				LOGGER.debug("deleted event/chapter with ID: {}", anEventID);
				return isDeleted;
			}
		}
		else {
			LOGGER.error("User does not have permission to delete events from this timeline.  \n Requestor: {} \n anEventID: {}", requestor, anEventID);
		}
		return false;
	}

	
	private String findById(String anID, Collection<Text> jsonsToSearch) {
		if (anID == null) {
			throw new IllegalArgumentException("Cannot find JSON object with a null ID");
		}
		
		anID = anID.trim();
		if (anID.length() < 0)  {
			throw new IllegalArgumentException("Cannot find JSON object with an empty ID");
		}
				
		String result = null; 
		for (Text jsonText : jsonsToSearch) {
			// null check is probably overly cautious
			String json = jsonText != null ? jsonText.getValue() : null;
			if (json != null) {
				 Matcher m = ID_PATTERN.matcher(json);
				 if (m.find()) {
					 String id = m.group(1);
					 if (anID.equals(id)) {
						 result = json;
					 }
				 }				
			}

		 }
		return result;
	}
	
	@Override
	public String getPublicId() {
		return this._publicID;
	}
	
	@Override
	public IUserID getOwnerId() {
		return new UserIDStringImpl(this._ownerID);
	}

	@Override
	public String getEventJSON(SecurityContext aSecurityContext) {
		return getJSONDataIfAllowed(aSecurityContext, this._eventJSONS);
	}
	
	@Override
	public String getChapterJSON(SecurityContext aSecurityContext) {
		return getJSONDataIfAllowed(aSecurityContext, this._chapterJSONS);
	}	

	public String getJSONDataIfAllowed(SecurityContext aSecurityContext, Collection<Text> jsonDataCollection) {
		if (!this.canRead(aSecurityContext)) {			
			String errorMsg = String.format(UNAUTHORIZED_ACCESS_ERROR, this, aSecurityContext);
			LOGGER.error(errorMsg);
			throw new UnauthorizedException(errorMsg);
		}
		
		StringBuilder sb = new StringBuilder("[");
		
		if (jsonDataCollection.size() > 0) {
			for (Text anEventJSON : jsonDataCollection) {
				String json = anEventJSON != null ? anEventJSON.getValue() : null;
				if (json != null) {
					sb.append(json).append(", ");	
				}
				
			}
			
			// trim last comma
			sb.setLength(sb.lastIndexOf(","));			
		}		
		sb.append("]");
		
		return sb.toString();
	}
	
	@Override
	public <T extends IEvent> void addEvent(T anEvent, SecurityContext aCallingContext) {
		try {
			addEvent((EventJDO)anEvent, aCallingContext);
		} catch (ClassCastException e) {
			throw new UnsupportedOperationException("Only an eventJDO is currently supported.");
		}
	}
	
	private void addEvent(EventJDO eventJDO, SecurityContext aCallingContext) {
		if (!canWrite(aCallingContext)) {
			// TODO: change this to be a non JBoss exception
			final String errorString = String.format("User does not have permission to add an event to this timeline.  Calling Context: %s ", aCallingContext);
			LOGGER.error(errorString);
			throw new UnauthorizedException(errorString);
		}
		
		LOGGER.info("Context: '{}' has permission to add events to this timeline (ID: '{}') so proceeding to add the event.", aCallingContext, this.getPublicId());
		
		//TypedKey<? extends EventJDO, String> eventKey;
		
		// have to set this as the Timeline/owner of the event before it can be queried for a valid key
		eventJDO.setTimeline(this);
		
		/*try {
			eventKey = eventJDO.getTypedKey();	
		} catch (IllegalAccessException e) {
			// this should never happen as long as eventJDO.setTimeline() is called before eventJDO.getKey()
			LOGGER.error("This exception should never have been thrown: {}", e);
			throw new WebApplicationException(Status.INTERNAL_SERVER_ERROR);
		}*/
		
		//this._events.add(eventJDO);
		//this._events.add(eventKey);
		
		ObjectMapper mapper = MyFibroStoryApplication.getMapper();
		try {
			if (!EventType.CHAPTER.equals(eventJDO.getType())) {
				this._eventJSONS.add(new Text(mapper.writeValueAsString(eventJDO)));	
			}
			else {
				this._chapterJSONS.add(new Text(mapper.writeValueAsString(eventJDO)));
			}
		} catch (Exception e) {
			LOGGER.error("Exception thrown while trying to add event JSON to timeline.  Exception: \n {} ", e.getMessage());
			throw new WebApplicationException(e);
		}
	}

	@Override
	public boolean canWrite(SecurityContext aCallingContext) {
		return this._ac.canWrite(aCallingContext, this);
	}	

	@Override
	public boolean canRead(SecurityContext aCallingContext) {
		return this._ac.canRead(aCallingContext, this);
	}
	
	
	@Override
	public SharingOption getSharingSetting() {
		return this._ac.getSharingSetting();
	}

	// TODO: probably should not be passing in userAccount as a separate arg, but need to make it accessible from Timeline in order to change this
	public static TimelineJDO from(ITimeline aTimeline, UserAccountJDO aUserAccount) {
		return aTimeline instanceof TimelineJDO ?  (TimelineJDO)aTimeline : new TimelineJDO(aUserAccount, aTimeline.getSharingSetting());
	}
	
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append(IJDO.JDO_STR_START_TOKEN).append(this.getClass()).append(": ")
			.append("_encodedKey=").append(_encodedKey != null ? _encodedKey : "[null]").append(IJDO.JDO_PROPERTY_DELIMITER)
			.append("_ownerID=").append(_ownerID != null ? _ownerID : "[null]").append(IJDO.JDO_PROPERTY_DELIMITER)
			.append("_publicID=").append(_publicID != null ? _publicID : "[null]").append(IJDO.JDO_PROPERTY_DELIMITER)
			.append("_ac=").append(_ac != null ? _ac : "[null]").append(IJDO.JDO_PROPERTY_DELIMITER)
			.append(IJDO.JDO_PROPERTY_DELIMITER)
		.append(IJDO.JDO_STR_END_TOKEN);
				
		return sb.toString();
	}


}

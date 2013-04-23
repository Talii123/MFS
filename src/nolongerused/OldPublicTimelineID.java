package nolongerused;

import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;

import friedman.tal.UniqueID;
import friedman.tal.jdo.IJDO;
import friedman.tal.mfs.timelines.ITimeline;
import friedman.tal.mfs.timelines.TimelineJDO;


/*
 * The main problem with this class is that it doesn't actually allow you to lookup an object by a unique ID without also
 * specifying the key of its parent Timeline, but the whole point of having this unique ID is to not need to know the parent
 * key(s).
 */
@PersistenceCapable
public class OldPublicTimelineID extends UniqueID {

//	@PrimaryKey
//	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
//	private Long _ID;
	
	@Persistent(mappedBy = "_publicID")
	private TimelineJDO _owner;
	
	/* don't want to rely on database generated IDs since they're just ascending and not random
	 * public PublicTimelineID(TimelineJDO myTimelineJDO) {
		super();  // making this explicit so that it's clear that we're not providing an unique ID so the database will have to.
		this._owner = myTimelineJDO;
	}*/
	
	
	public OldPublicTimelineID(TimelineJDO myTimelineJDO, String anUniqueID) {
		super(anUniqueID);
		this._owner = myTimelineJDO;
	}
	
	public ITimeline getOwner() {
		return this._owner;
	}

	/*@Override
	public boolean equals(Object other) {
		if (this == other) return true;
		if (!(other instanceof PublicTimelineID)) return false;
		PublicTimelineID otherPublicTimelineID = (PublicTimelineID)other;
		return (this._owner == otherPublicTimelineID._owner || (this._owner != null && this._owner.equals(otherPublicTimelineID._owner))) &&
				(super.equals(otherPublicTimelineID));
	}

	@Override
	public int hashCode() {
		int result = 17;
		result = 31 * result + (this._owner != null ? this._owner.hashCode() : 0);
		result = 31 * result + super.hashCode();
		return result;
	}

	@Override
	public String toString() {
		return this.getClass().getSimpleName() + "(" + this.getUniqueString() + ")";
	}*/
	
	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append(IJDO.JDO_STR_START_TOKEN).append(this.getClass()).append(": ")
			.append("super.toString() =").append(super.toString()).append(IJDO.JDO_PROPERTY_DELIMITER)			
			.append("_owner.hashcode=").append(_owner != null ? _owner.hashCode() : "[null]").append(IJDO.JDO_PROPERTY_DELIMITER)
			.append(IJDO.JDO_PROPERTY_DELIMITER)
		.append(IJDO.JDO_STR_END_TOKEN);
				
		return sb.toString();
	}		
		
}

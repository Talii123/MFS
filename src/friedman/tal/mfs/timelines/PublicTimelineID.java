package friedman.tal.mfs.timelines;

import javax.jdo.annotations.PersistenceCapable;

import friedman.tal.jdo.GAEJKeyType;
import friedman.tal.jdo.TypedKey;
import friedman.tal.jdo.UniqueID;


@PersistenceCapable
public class PublicTimelineID extends UniqueID {
		
	public PublicTimelineID(String anUniqueID) {
		super(anUniqueID);
	}
	
	@Override
	public boolean equals(Object other) {
		if (this == other) return true;
		if (!(other instanceof PublicTimelineID)) return false;	// should this be a tighter check, i.e. making sure the Class objects are both PublicTimelineID.class ?
		//PublicTimelineID otherPublicTimelineID = (PublicTimelineID)other;
		return super.equals(UniqueID.class.cast(other));
	}

	@Override
	public int hashCode() {
		int result = 17;
		result = 31 * result + PublicTimelineID.class.hashCode();
		result = 31 * result + super.hashCode();
		return result;
	}

	@Override
	public String toString() {
		return this.getClass().getSimpleName() + "(" + this.getUniqueString() + ")";
	}
	
	public TypedKey<? extends PublicTimelineID, String> getReference() {
		return TypedKey.create(this.getClass(), this.getUniqueString(), GAEJKeyType.STRING);
	}
		
}

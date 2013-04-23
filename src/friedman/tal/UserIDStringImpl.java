package friedman.tal;

public class UserIDStringImpl implements IUserID {
	private final String userID;
	
	public UserIDStringImpl(String aUserID) {
		this.userID = aUserID;
	}

	@Override
	public String getStringId() {
		return this.userID;
	}

	@Override
	public boolean equals(Object other) {
		if (this == other) return true;
		if (!(other instanceof UserIDStringImpl)) return false;
		UserIDStringImpl otherUserIDString = (UserIDStringImpl)other;
		
		return this.userID == otherUserIDString.userID || 
				(this.userID != null && this.userID.equals(otherUserIDString.userID));
	}

	@Override
	public int hashCode() {
		return this.userID != null ? this.userID.hashCode() : 0;
	}

	@Override
	public String toString() {
		return String.format("UserIDStringImpl(userID=%s)", this.userID);
	}
	
	
}
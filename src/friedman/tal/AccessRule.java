package friedman.tal;

import org.jboss.resteasy.spi.UnauthorizedException;

public enum AccessRule {

	MUST_OWN,
	MUST_BE_MEMBER,
	ANYONE;
	
	public static final String ANONYMOUS_ID = null;
	
	// askerID can be null, indictating an anonymous requester (i.e. a user that is not logged in)
	// the code does not require ownerID to not be null; in future, a null ownerID could signify an unowned resource that still has some form of AC attached to it
	public void verify(String askerID, String ownerID) throws UnauthorizedException {
	
		// NOTE: the rules are ordered from most restrictive to least restrictive.  If, by mistake, a 'break' statement is
		// omitted, the logic will probably still be correct.  That said, please always include 'break' statements where possible
		
		switch (this) {
		
			case MUST_OWN:
				if (askerID == null) { // don't use ANONYMOUS_ID here since we want to be clear that we're explicitly checking for null
					throw new UnauthorizedException(new IllegalArgumentException("AskerID is null.  Anonymous requests are not permitted for the 'MUST_OWN' access rule.")); 
				}
				if (!askerID.equals(ownerID)) {
					throw new UnauthorizedException(new IllegalAccessException(String.format("Asker is not owner.  Asker: '%s', Owner: '%s'", askerID, ownerID))); 
				}
				
				break;			
				
			case MUST_BE_MEMBER:
				throw new UnauthorizedException(new UnsupportedOperationException("The membership verification algorithm has not been implemented yet."));
				
				//TODO: add this in when you implement this method!!  Cannot put it in right now - compiler error - unreachable code
				//break;
			
			case ANYONE:
				break;
				
			default:
				throw new UnauthorizedException(new UnsupportedOperationException(String.format("Unrecognized access rule: '%s' ", this)));
				
		}
	}
	
}

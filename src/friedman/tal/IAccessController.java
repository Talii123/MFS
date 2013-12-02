package friedman.tal;

import javax.ws.rs.core.SecurityContext;


public interface IAccessController {
	public boolean canRead(SecurityContext aCallingContext, IOwnedResource anOwnedResource);
	public boolean canWrite(SecurityContext aCallingContext, IOwnedResource anOwnedResource);
}

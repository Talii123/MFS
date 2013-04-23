package friedman.tal.resources;

import javax.ws.rs.core.SecurityContext;

public interface IProtectableResource {

	public boolean canRead(SecurityContext aCallingContext);

	public boolean canWrite(SecurityContext aCallingContext);

}

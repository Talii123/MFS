package friedman.tal.mfs.timelines;

import javax.ws.rs.core.SecurityContext;

import friedman.tal.IOwnedResource;
import friedman.tal.mfs.SharingOption;
import friedman.tal.mfs.timelines.events.IEvent;
import friedman.tal.resources.IProtectableResource;

public interface ITimeline extends IProtectableResource, IOwnedResource {

	public <T extends IEvent> void addEvent(T anEvent, SecurityContext aCallingContext);

	public SharingOption getSharingSetting();

	public String getPublicId();
	
	public String getEventJSON(SecurityContext aSecurityContext);
	
	public String getChapterJSON(SecurityContext aSecurityContext);

}

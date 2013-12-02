package friedman.tal.mfs.timelines.events;

import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.validation.Valid;

import friedman.tal.mfs.timelines.EventJDO;
import friedman.tal.mfs.timelines.events.details.SurgeryDetails;

@PersistenceCapable
public class SurgeryEventJDO extends EventJDO {

	@Persistent
	private SurgeryDetails _eventDetails;
	
	SurgeryEventJDO(IEvent anEvent) {
		super(anEvent);
		this._eventDetails = (SurgeryDetails)anEvent.getTypeDetails();
	}

	@Override
	@Valid
	public SurgeryDetails getTypeDetails() {
		return this._eventDetails;
	}
}

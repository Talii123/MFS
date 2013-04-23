package friedman.tal.mfs.timelines.events;

import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.validation.Valid;

import friedman.tal.mfs.timelines.EventJDO;
import friedman.tal.mfs.timelines.events.details.RadiationDetails;

@PersistenceCapable
public class RadiationEventJDO extends EventJDO {

	@Persistent
	private RadiationDetails _eventDetails;
	
	
	RadiationEventJDO(IEvent anEvent) {
		super(anEvent);
		this._eventDetails = (RadiationDetails)anEvent.getTypeDetails();
	}

	@Override
	@Valid
	public RadiationDetails getTypeDetails() {
		return this._eventDetails;
	}
}

package friedman.tal.mfs.timelines.events;

import javax.jdo.annotations.Embedded;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.validation.Valid;

import friedman.tal.mfs.timelines.EventJDO;
import friedman.tal.mfs.timelines.events.details.ChemoDetails;

@PersistenceCapable
public class ChemoEventJDO extends EventJDO {

	@Persistent
	@Embedded
	private ChemoDetails _eventDetails;
	
	ChemoEventJDO(IEvent anEventTO) {
		super(anEventTO);
		this._eventDetails = (ChemoDetails)anEventTO.getTypeDetails();
	}
	
	@Override
	@Valid
	public ChemoDetails getTypeDetails() {
		return this._eventDetails;
	}
}

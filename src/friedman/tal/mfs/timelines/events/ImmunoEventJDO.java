package friedman.tal.mfs.timelines.events;

import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.validation.Valid;

import friedman.tal.mfs.timelines.EventJDO;
import friedman.tal.mfs.timelines.events.details.ImmunoDetails;


@PersistenceCapable
public class ImmunoEventJDO extends EventJDO{

	@Persistent
	private ImmunoDetails _eventDetails;
	

	ImmunoEventJDO(IEvent anEvent) {
		super(anEvent);
		this._eventDetails = (ImmunoDetails)anEvent.getTypeDetails();
	}	
	
	@Override
	@Valid
	public ImmunoDetails getTypeDetails() {
		return this._eventDetails;
	}
}

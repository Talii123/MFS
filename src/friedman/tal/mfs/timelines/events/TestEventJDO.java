package friedman.tal.mfs.timelines.events;

import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.validation.Valid;

import friedman.tal.mfs.timelines.EventJDO;
import friedman.tal.mfs.timelines.events.details.TestDetails;

@PersistenceCapable
public class TestEventJDO extends EventJDO {

	@Persistent
	private TestDetails _eventDetails;
	
	public TestEventJDO(IEvent anEvent) {
		super(anEvent);
		this._eventDetails = (TestDetails)anEvent.getTypeDetails();
	}

	@Override
	@Valid
	public TestDetails getTypeDetails() {
		return this._eventDetails;
	}
	
}

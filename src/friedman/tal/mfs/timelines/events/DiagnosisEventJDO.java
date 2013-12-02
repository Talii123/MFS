package friedman.tal.mfs.timelines.events;

import javax.jdo.annotations.Embedded;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.validation.Valid;

import friedman.tal.mfs.timelines.EventJDO;
import friedman.tal.mfs.timelines.events.details.DiagnosisDetails;

@PersistenceCapable
public class DiagnosisEventJDO extends EventJDO {

	@Persistent
	@Embedded
	private DiagnosisDetails _eventDetails;
	
	DiagnosisEventJDO(IEvent anEvent) {
		super(anEvent);
		this._eventDetails = (DiagnosisDetails)anEvent.getTypeDetails();
	}

	@Override
	@Valid
	public DiagnosisDetails getTypeDetails() {
		return this._eventDetails;
	}

	
}

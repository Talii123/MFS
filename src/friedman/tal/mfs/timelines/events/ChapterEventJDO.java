package friedman.tal.mfs.timelines.events;

import javax.jdo.annotations.Embedded;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.validation.Valid;

import friedman.tal.mfs.timelines.EventJDO;
import friedman.tal.mfs.timelines.events.details.ChapterDetails;

@PersistenceCapable
public class ChapterEventJDO extends EventJDO {

	@Persistent
	@Embedded
	private final ChapterDetails _eventDetails;
	
	ChapterEventJDO(IEvent anEvent) {
		super(anEvent);
		this._eventDetails = (ChapterDetails)anEvent.getTypeDetails();
	}

	@Override
	@Valid
	public ChapterDetails getTypeDetails() {
		return this._eventDetails;
	}
}

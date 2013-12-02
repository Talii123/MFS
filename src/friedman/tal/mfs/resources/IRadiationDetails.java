package friedman.tal.mfs.resources;

import friedman.tal.mfs.timelines.events.IEventDetails;
import friedman.tal.mfs.timelines.events.details.ChemoResult;
import friedman.tal.validation.Name;

public interface IRadiationDetails extends IEventDetails {

	public enum Field implements IField {
		oncologist,
		result,
		recommended;
	}
	
	@Name
	public String getOncologist();
	
	
	// validation done by ensuring that value is converted to a value of the enum type
	// this should probably be on a common interface for all treatment events, but not sure if
	// HibernateValidator can handle validation on multiple interfaces in an inheritance tree
	public ChemoResult getResult();
	
	public Boolean isRecommended();
}



package friedman.tal.mfs.resources;

import friedman.tal.mfs.timelines.events.IEventDetails;
import friedman.tal.mfs.timelines.events.details.ChemoResult;
import friedman.tal.validation.Chemo;
import friedman.tal.validation.Name;

public interface IChemoDetails extends IEventDetails {

	public enum Field implements IField {
		oncologist,
		chemo,
		result,
		recommended;
	}

	@Name
	public String getOncologist();
	
	@Chemo
	public String getChemo();
	
	// validation done by ensuring that value is converted to a value of the enum type
	// this should probably be on a common interface for all treatment events, but not sure if
	// HibernateValidator can handle validation on multiple interfaces in an inheritance tree
	public ChemoResult getResult();
	
	public Boolean isRecommended();
}


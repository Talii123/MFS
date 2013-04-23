package friedman.tal.mfs.resources;

import friedman.tal.mfs.timelines.events.IEventDetails;
import friedman.tal.mfs.timelines.events.details.SurgeryResult;
import friedman.tal.validation.AlphaNumericWSpaces;
import friedman.tal.validation.Location;
import friedman.tal.validation.Name;

public interface ISurgeryDetails extends IEventDetails {

	
	public enum Field implements IField {
		surgeon,
		fellow,
		physicianAssistant,
		hospital,
		location,
		recoveryTimeHospital,
		recoveryTimeHome,
		result,
		recommended;
	}

	
	@Name
	public String getSurgeon();
	
	@Name
	public String getFellow();

	@Name
	public String getPhysicianAssistant();
	
	@Name
	public String getHospital();

	@Location
	public String getLocation();
	
	//@NoHTML
	@AlphaNumericWSpaces
	public String getRecoveryTimeHospital();
	
	//@NoHTML
	@AlphaNumericWSpaces
	public String getRecoveryTimeHome();	

	// validation done by ensuring that value is converted to a value of the enum type
	// this should probably be on a common interface for all treatment events, but not sure if
	// HibernateValidator can handle validation on multiple interfaces in an inheritance tree
	public SurgeryResult getResult();
	
	public Boolean isRecommended();

}

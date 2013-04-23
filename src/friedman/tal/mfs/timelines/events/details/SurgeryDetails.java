package friedman.tal.mfs.timelines.events.details;

import java.util.Map;

import javax.jdo.annotations.EmbeddedOnly;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;

import friedman.tal.mfs.NotSet;
import friedman.tal.mfs.resources.ISurgeryDetails;
import friedman.tal.mfs.timelines.events.EventDetails;
import friedman.tal.util.Utils;

@PersistenceCapable
@EmbeddedOnly
public class SurgeryDetails extends EventDetails implements ISurgeryDetails {
	@Persistent
	private String _surgeon;
	
	@Persistent
	private String _fellow;
	
	@Persistent
	private String _physicianAssistant;
	
	@Persistent
	private String _hospital;
	
	@Persistent
	private String _location;
	/*private byte _recoveryTimeHospitalQty;
	private TimeUnit _recoveryTimeHospitalUnit;
	private byte _recoveryTimeHomeQty;
	private TimeUnit _recoveryTimeHomeUnit;*/
	
	@Persistent
	private String _recoveryTimeHospital;
	
	@Persistent
	private String _recoveryTimeHome;
	
	@Persistent
	private SurgeryResult _result;

	@Persistent
	private Boolean _isRecommended;	
	
	
	
	@Override
	public String getSurgeon() {
		return this._surgeon;
	}
	
	@Override
	public String getFellow() {
		return this._fellow;
	}
	
	@Override
	public String getPhysicianAssistant() {
		return this._physicianAssistant;
	}
	
	@Override
	public String getHospital() {
		return this._hospital;
	}
	
	@Override
	public String getLocation() {
		return this._location;
	}

	@Override
	public String getRecoveryTimeHospital() {
		return this._recoveryTimeHospital;
	}	
	
	@Override
	public String getRecoveryTimeHome() {
		return this._recoveryTimeHome;
	}
	
	
	@Override
	public SurgeryResult getResult() {
		return this._result;
	}

	@Override
	public Boolean isRecommended() {
		return this._isRecommended;
	}

	private SurgeryDetails(Map<String, String> aMap) {		
		// this check cannot be moved to the super class constructor
		if (aMap == null) return;
		
		String value;
		
		value = Utils.getValueOrEmptyString(aMap.get(Field.surgeon.name()));
		this._surgeon = value.length() > 0 ? value : NotSet.STRING;
		
		value = Utils.getValueOrEmptyString(aMap.get(Field.fellow.name()));
		this._fellow = value.length() > 0 ? value : NotSet.STRING;
		
		value = Utils.getValueOrEmptyString(aMap.get(Field.physicianAssistant.name()));
		this._physicianAssistant = value.length() > 0 ? value : NotSet.STRING;
		
		value = Utils.getValueOrEmptyString(aMap.get(Field.hospital.name()));
		this._hospital = value.length() > 0 ? value : NotSet.STRING;
		
		value = Utils.getValueOrEmptyString(aMap.get(Field.location.name()));
		this._location = value.length() > 0 ? value : NotSet.STRING;
		
		value = Utils.getValueOrEmptyString(aMap.get(Field.recoveryTimeHome.name()));
		this._recoveryTimeHome = value.length() > 0 ? value : NotSet.STRING;
		
		value = Utils.getValueOrEmptyString(aMap.get(Field.recoveryTimeHospital.name()));
		this._recoveryTimeHospital = value.length() > 0 ? value : NotSet.STRING;
		
		value = Utils.getValueOrEmptyString(aMap.get(Field.result.name()));
		this._result = value.length() > 0 ? SurgeryResult.valueOf(value) : NotSet.SURGERY_RESULT;
		
		value = Utils.getValueOrEmptyString(aMap.get(Field.recommended.name()));
		this._isRecommended = value.length() > 0 ? Boolean.valueOf(value) : NotSet.BOOLEAN;
		
	}
	
	static SurgeryDetails fromMap(Map<String, String> aMap) {
		return new SurgeryDetails(aMap); 
	}
	
	/*@Override
	public final EventType getType() {
		return EventType.SURGERY;
	}*/

}

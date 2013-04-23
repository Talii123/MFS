package friedman.tal.mfs.timelines.events.details;

import java.util.Map;

import javax.jdo.annotations.EmbeddedOnly;
import javax.jdo.annotations.NotPersistent;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import friedman.tal.mfs.NotSet;
import friedman.tal.mfs.resources.IDiagnosisDetails;
import friedman.tal.mfs.timelines.events.EventDetails;
import friedman.tal.util.Utils;

@PersistenceCapable
@EmbeddedOnly
public class DiagnosisDetails extends EventDetails implements IDiagnosisDetails {
	// cannot make @Persistent fields 'final', so enforce immutability as best we can using no setters and private fields
	
	@NotPersistent
	private static Logger LOGGER = LoggerFactory.getLogger(DiagnosisDetails.class);
	
	@Persistent
	private Byte _age;
	
	@Persistent
	private CancerStage _stage;
	
	/*@Persistent
	private Boolean _isMetastatic;
	
	@Persistent
	private Boolean _isLymphNodeInvolvement;
	
	@Persistent
	private Boolean _isMajorVascularInvasion;
	
	@Persistent
	private Boolean _isMicroVascularInvasion;*/
	
	@Persistent
	private String _diseaseSites;
	
	private DiagnosisDetails(Map<String, String> aMap) {
		LOGGER.debug("aMap: {}", aMap);
		
		// this check cannot be moved to the super class constructor
		if (aMap == null) return;
		
		String value;
		
		// note: if the field is not specified it is set to null; we're using object type wrappers for primitives 
		// so that we can have nillable fields;  We don't want to store "false" for fields the user does not specify
		value = Utils.getValueOrEmptyString(aMap.get(Field.age.name()));
		this._age = value.length() > 0 ? Byte.valueOf(value) : NotSet.BYTE;	
		
		value = Utils.getValueOrEmptyString(aMap.get(Field.stage.name()));
		this._stage = value.length() > 0 ? CancerStage.valueOf(value) : NotSet.CANCER_STAGE;
		
		value = Utils.getValueOrEmptyString(aMap.get(Field.diseaseSites.name()));
		this._diseaseSites = value.length() > 0 ? value : NotSet.STRING;	

		
		/*value = Utils.getValueOrEmptyString(aMap.get(Field.metastatic.name()));
		this._isMetastatic = value.length() > 0 ? Boolean.valueOf(value) : NotSet.BOOLEAN;
		
		value = Utils.getValueOrEmptyString(aMap.get(Field.lymphNodes.name()));
		this._isLymphNodeInvolvement = value.length() > 0 ? Boolean.valueOf(value) : NotSet.BOOLEAN;
		
		value = Utils.getValueOrEmptyString(aMap.get(Field.majorVascularInvasion.name()));
		this._isMajorVascularInvasion = value.length() > 0 ? Boolean.valueOf(value) : NotSet.BOOLEAN;
		
		value = Utils.getValueOrEmptyString(aMap.get(Field.microVascularInvasion.name()));
		this._isMicroVascularInvasion = value.length() > 0 ? Boolean.valueOf(value) : NotSet.BOOLEAN;*/
	}
	
	static DiagnosisDetails fromMap(Map<String, String> aMap) {
		return new DiagnosisDetails(aMap);
	}
	
	/*@Override
	public final EventType getType() {
		return EventType.DIAGNOSIS;
	}*/
	
	@Override
	public Byte getAge() {
		return this._age;
	}
		
	// NOTE: accessor names must follow bean naming convention (so that Jackson can serialize them) 
	//		 AND they MUST MUST MUST correspond to the bean property names used in the templates
	@Override
	public CancerStage getStage() {
		return this._stage;
	}
	
	/*@Override
	public Boolean isMetastatic() {
		return this._isMetastatic;
	}

	@Override
	public Boolean isLymphNodes() {
		return this._isLymphNodeInvolvement;
	}	

	@Override
	public Boolean isMajorVascularInvasion() {
		return this._isMajorVascularInvasion;
	}
	
	@Override
	public Boolean isMicroVascularInvasion() {
		return this._isMicroVascularInvasion;
	}*/
	
	@Override
	public String getDiseaseSites() {
		return this._diseaseSites;
	}
	
/*
 * make this read-only
 * 
	public void setMicroVascularInvasion(boolean isMicroVascularInvasion) {
		this._isMicroVascularInvasion = isMicroVascularInvasion;
	}
	
	public void setAge(byte anAge) {
		this._age = anAge;
	}

	public void setStage(CancerStage aCancerStage) {
		this._stage = aCancerStage;
	}

	public void setMetastatic(boolean isMetastatic) {
		this._isMetastatic = isMetastatic;
	}
	
	public void setMajorVascularInvasion(boolean majorVascularInvasion) {
		this._isMajorVascularInvasion = majorVascularInvasion;
	}

*/	

}

package friedman.tal.mfs.agreements;

import java.util.Date;

import javax.jdo.annotations.Embedded;
import javax.jdo.annotations.Extension;
import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.google.appengine.api.datastore.KeyFactory;

import friedman.tal.jdo.IJDO;
import friedman.tal.mfs.users.IUserAccount;
import friedman.tal.mfs.users.IUserInfo;
import friedman.tal.mfs.users.UserInfo;

//TODO: write unit tests for equals() and hashcode()
//TODO: validate inputs to constructor? 
@PersistenceCapable(identityType = IdentityType.APPLICATION)
public class AgreementJDO implements IAgreement, IJDO<String> {

    @Persistent
    @Extension(vendorName="datanucleus", key="gae.parent-pk", value="true")
    private String _parentKey; 
	
	/*@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	private Key _key;*/
    
    // This gets set automatically when object is made persistent.
    @PrimaryKey
    @Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
    @Extension(vendorName = "datanucleus", key = "gae.encoded-pk", value="true")
    private String _key; 
	
	@Persistent(types = friedman.tal.mfs.users.UserAccountJDO.class)
	private IUserAccount _agreer;
	
	@Persistent
    @Embedded
    // TODO: figure out how to store interface rather than implementation?
    //@Persistent(types = friedman.tal.mfs.users.UserInfo.class)	
    //private IUserInfo _agreerInfo;    
	private UserInfo _agreerInfo;
	
	/*@Persistent(/*types = friedman.tal.mfs.agreements.AgreementFormJDO.class*//*)
	private /*IAgreementForm*//* IAgreementForm _agreementTerms;*/
    
    /*@Persistent
    @Embedded
    private TypedKey<? extends IAgreementForm, ?> _agreementTerms;*/
	
	@Persistent(serialized = "true")
	private AgreementFormLogicalKey _agreementTermsLogicalKey;
	
	@Persistent
	private Date _timeOfAgreement;
	
	AgreementJDO(IUserAccount anAgreer, IUserInfo anAgreerInfo, IAgreementForm anAgreementForm) {
		this(anAgreer, anAgreerInfo, anAgreementForm, new Date());
	}
	
	AgreementJDO(IUserAccount anAgreer, IUserInfo anAgreerInfo, IAgreementForm anAgreementForm, Date aTimeOfAgreement) {
		// should this be a method on UserAccountJDO and on the IUserAccount interface ?
		// TODO: remove dependency on KeyFactory by having UserAccountJDO provide a TypedKey
		//this._parentKey = KeyFactory.createKeyString(anAgreer.getClass().getSimpleName(), anAgreer.getName());
		this._parentKey = KeyFactory.createKeyString(anAgreer.getClass().getSimpleName(), anAgreer.getUserId().getStringId());
		this._agreer = anAgreer;
		this._agreerInfo = new UserInfo(anAgreerInfo);
		//this._agreementTerms = anAgreementForm instanceof AgreementFormJDO ? (AgreementFormJDO)anAgreementForm : new AgreementFormJDO(anAgreementForm);
		//this._agreementTerms = anAgreementForm.getKey();
		this._agreementTermsLogicalKey = new AgreementFormLogicalKey(anAgreementForm.getName(), anAgreementForm.getRevisionNum());
		this._timeOfAgreement = aTimeOfAgreement;
		
	}
	
	AgreementJDO(IAgreement anAgreement) {
		this._agreerInfo = new UserInfo(anAgreement.getAgreerInfo());
		/*IAgreementForm agreementForm = anAgreement.getAgreementTerms(); 
		/this._agreementTerms = agreementForm  instanceof AgreementFormJDO ? (AgreementFormJDO)agreementForm : new AgreementFormJDO(agreementForm);*/
		//this._agreementTerms = anAgreement.getAgreementTerms();//.getKey();
		
		this._agreementTermsLogicalKey = anAgreement.getAgreementTermsLogicalKey();
		
		this._timeOfAgreement = anAgreement.getTimeofAgreement();
		
		IUserAccount userAccount = anAgreement.getAgreer();
		//this._parentKey = KeyFactory.createKeyString(userAccount.getClass().getSimpleName(), userAccount.getName());
		this._parentKey = KeyFactory.createKeyString(userAccount.getClass().getSimpleName(), userAccount.getUserId().getStringId());
	}
	
	
	
	@Override
	public Class<String> getKeyType() {
		return String.class;
	}

	@Override
	public boolean equals(Object other) {
		if (this == other) return true;
		if (!(other instanceof IAgreement)) return false;
		IAgreement otherAgreement = (IAgreement)other;
		return this._timeOfAgreement.equals(otherAgreement.getTimeofAgreement()) && 
				this._agreerInfo.equals(otherAgreement.getAgreerInfo())  &&
				this._agreer.equals(otherAgreement.getAgreer()) &&
				this._agreementTermsLogicalKey.equals(otherAgreement.getAgreementTermsLogicalKey());
	}

	@Override
	public int hashCode() {
		int result = 17;
		result = 31 * result + this._timeOfAgreement.hashCode();
		result = 31 * result + this._agreerInfo.hashCode();
		result = 31 * result + this._agreer.hashCode();
		result = 31 * result + this._agreementTermsLogicalKey.hashCode();
		return result;
	}

	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append(IJDO.JDO_STR_START_TOKEN).append(this.getClass()).append(": ")
			//.append("_id=").append(_id).append(", ")
			.append("_parentKey=").append(_parentKey != null ? _parentKey : "[null]").append(IJDO.JDO_PROPERTY_DELIMITER)
			.append("_key=").append(_key != null ? _key : "[null]").append(IJDO.JDO_PROPERTY_DELIMITER)
			.append("_timeOfAgreement=").append(_timeOfAgreement != null ? _timeOfAgreement : "[null]").append(IJDO.JDO_PROPERTY_DELIMITER)
			.append("_agreerInfo=").append(_agreerInfo != null ? _agreerInfo : "[null]").append(IJDO.JDO_PROPERTY_DELIMITER)
			.append("_agreer=").append(_agreer != null ? _agreer : "[null]").append(IJDO.JDO_PROPERTY_DELIMITER)
			.append("_agreementTermsLogicalKey=").append(_agreementTermsLogicalKey != null ? _agreementTermsLogicalKey.toString() : "[null]").append(IJDO.JDO_PROPERTY_DELIMITER)
			.append(IJDO.JDO_STR_END_TOKEN);
				
		return sb.toString();
	}

	/*@Override
	public TypedKey<? extends IAgreementForm, ?> getAgreementTerms() {
		return this._agreementTerms;
	}*/
	
	@Override
	public AgreementFormLogicalKey getAgreementTermsLogicalKey() {
		return this._agreementTermsLogicalKey;
	}

	@Override
	public Date getTimeofAgreement() {
		return this._timeOfAgreement;
	}

	@Override
	public IUserAccount getAgreer() {
		return this._agreer;
	}

	@Override
	public IUserInfo getAgreerInfo() {
		return this._agreerInfo;
	}

	public static AgreementJDO from(IAgreement anAgreement) {
		return anAgreement instanceof AgreementJDO ? (AgreementJDO)anAgreement : new AgreementJDO(anAgreement);
	}

}

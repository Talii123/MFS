package friedman.tal.mfs.agreements;

import java.util.Date;

import javax.jdo.annotations.Embedded;
import javax.jdo.annotations.Extension;
import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;

import friedman.tal.jdo.IJDO;
import friedman.tal.mfs.users.IUserAccount;
import friedman.tal.mfs.users.IUserInfo;
import friedman.tal.mfs.users.UserAccountJDO;

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
	
	/*@Persistent(mappedBy = "_agreement", types = friedman.tal.mfs.users.UserAccountJDO.class)
	private IUserAccount _agreer;*/
	
	/*@Persistent(types = friedman.tal.mfs.users.UserInfo.class)
	@Embedded
	private IUserInfo _agreerInfo;*/
	
	@Persistent(/*types = friedman.tal.mfs.agreements.AgreementFormJDO.class*/)
	private /*IAgreementForm*/ AgreementFormJDO _agreementTerms;
	
	@Persistent
	private Date _timeOfAgreement;
	
	public AgreementJDO(IUserAccount anAgreer, IUserInfo anAgreerInfo, IAgreementForm anAgreementForm) {
		this(anAgreer, anAgreerInfo, anAgreementForm, new Date());
	}
	
	public AgreementJDO(IUserAccount anAgreer, IUserInfo anAgreerInfo, IAgreementForm anAgreementForm, Date aTimeOfAgreement) {
		// should this be a method on UserAccountJDO and on the IUserAccount interface ?
		this._parentKey = KeyFactory.createKeyString(anAgreer.getClass().getSimpleName(), anAgreer.getName()); 
		//this._agreer = anAgreer;
		//this._agreerInfo = anAgreerInfo;
		this._agreementTerms = anAgreementForm instanceof AgreementFormJDO ? (AgreementFormJDO)anAgreementForm : new AgreementFormJDO(anAgreementForm);
		this._timeOfAgreement = aTimeOfAgreement;
	}
	
	public AgreementJDO(IAgreement anAgreement) {
		//this._agreerInfo = anAgreement.getAgreerInfo();
		IAgreementForm agreementForm = anAgreement.getAgreementTerms(); 
		this._agreementTerms = agreementForm  instanceof AgreementFormJDO ? (AgreementFormJDO)agreementForm : new AgreementFormJDO(agreementForm);
		this._timeOfAgreement = anAgreement.getTimeofAgreement();
		
		IUserAccount userAccount = anAgreement.getAgreer();
		this._parentKey = KeyFactory.createKeyString(userAccount.getClass().getSimpleName(), userAccount.getName());
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
				//this._agreerInfo.equals(otherAgreement.getAgreerInfo())  &&
				//this._agreer.equals(otherAgreement.getAgreer()) &&
				this._agreementTerms.equals(otherAgreement.getAgreementTerms());
	}

	@Override
	public int hashCode() {
		int result = 17;
		result = 31 * result + this._timeOfAgreement.hashCode();
		//result = 31 * result + this._agreerInfo.hashCode();
		//result = 31 * result + this._agreer.hashCode();
		result = 31 * result + this._agreementTerms.hashCode();
		return result;
	}

	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append(IJDO.JDO_STR_START_TOKEN).append(this.getClass()).append(": ")
			//.append("_id=").append(_id).append(", ")
			.append("_parentKey=").append(_parentKey != null ? _parentKey : "[null]").append(IJDO.JDO_PROPERTY_DELIMITER)
			.append("_key=").append(_key != null ? _key : "[null]").append(IJDO.JDO_PROPERTY_DELIMITER)
			.append("_timeOfAgreement=").append(_timeOfAgreement != null ? _timeOfAgreement : "[null]").append(IJDO.JDO_PROPERTY_DELIMITER)
			//.append("_agreerInfo=").append(_agreerInfo != null ? _agreerInfo : "[null]").append(IJDO.JDO_PROPERTY_DELIMITER)
			//.append("_agreer=").append(_agreer != null ? _agreer : "[null]").append(IJDO.JDO_PROPERTY_DELIMITER)
			.append("_agreementTerms=").append(_agreementTerms != null ? _agreementTerms : "[null]").append(IJDO.JDO_PROPERTY_DELIMITER)
			.append(IJDO.JDO_STR_END_TOKEN);
				
		return sb.toString();
	}

	@Override
	public IAgreementForm getAgreementTerms() {
		return this._agreementTerms;
	}

	@Override
	public Date getTimeofAgreement() {
		return this._timeOfAgreement;
	}

	@Override
	public IUserAccount getAgreer() {
		//return this._agreer;
		return null;
	}

	@Override
	public IUserInfo getAgreerInfo() {
		//return this._agreerInfo;
		return null;
	}

}

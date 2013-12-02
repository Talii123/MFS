package friedman.tal.mfs.agreements;

import java.util.Date;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.appengine.api.datastore.Text;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserServiceFactory;

import friedman.tal.jdo.GAEJKeyType;
import friedman.tal.jdo.IJDO;
import friedman.tal.jdo.TypedKey;
import friedman.tal.util.ValidationRoutines;

// TODO: write unit tests for equals() and hashcode()
//TODO: validate inputs to constructor?
@PersistenceCapable
public class AgreementFormJDO implements IAgreementForm {
	
	public static Logger LOGGER = LoggerFactory.getLogger(AgreementFormJDO.class);  
 
	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	private Long _ID;
	
	@Persistent
	private String _name;
	
	@Persistent
	private Date _createdDate;
	
	@Persistent
	private Text _text;
	
	@Persistent
	private int _revision;
	
	@Persistent
	private String _firstRelease;
	
	@Persistent
	private String _creator;
	
	// package private so that only the AgreementFormResource can create this class; other resources should go through
	// the AgreementFormResource if they need to create a new IAgreementForm
	AgreementFormJDO(String aName, int aRevisionNum, String aText, String aFirstRelease) {		 
		 this._name = ValidationRoutines.requireTrimmedNonEmptyString(aName);		 
		 this._text = new Text(aText); //new Text(Utils.getTrimmedNonEmptyString(aText));
		 this._createdDate = new Date();
		 this._firstRelease = ValidationRoutines.requireTrimmedNonEmptyString(aFirstRelease);
		 this._revision = aRevisionNum;
		 
		 setCreatorID();  
	}
	
	/* AgreementFormJDO(String aName, String aText) {
		
	}*/
	
	AgreementFormJDO(IAgreementForm anAgreementForm) {
		this._name = ValidationRoutines.requireTrimmedNonEmptyString(anAgreementForm.getName());
		this._text = anAgreementForm instanceof AgreementFormJDO ? ((AgreementFormJDO)anAgreementForm)._text :  new Text(anAgreementForm.getText());
		this._createdDate = anAgreementForm.getCreatedDate();
		this._firstRelease = ValidationRoutines.requireTrimmedNonEmptyString(anAgreementForm.getFirstRelease());
		this._revision = anAgreementForm.getRevisionNum();
		this._creator = anAgreementForm.getCreator();
	}
	
	@Override
	public TypedKey<? extends AgreementFormJDO, Long> getKey() {
		return TypedKey.create(this.getClass(), this._ID, GAEJKeyType.LONG);
	}

	@Override
	public boolean equals(Object other) {
		if (this == other) return true;
		if (!(other instanceof IAgreementForm)) return false;
		IAgreementForm otherForm = (IAgreementForm)other;
		
		return this._name.equals(otherForm.getName()) &&
					this._revision == otherForm.getRevisionNum() &&
					this._creator.equals(otherForm.getCreator()) &&
					this._createdDate.equals(otherForm.getCreatedDate()) &&
					this._text.getValue().equals(otherForm.getText());
	}

	@Override
	public int hashCode() {
		int result = 17;
		result = 31 * result + this._name.hashCode();
		result = 31 * result + this._revision;
		result = 31 * result + this._creator.hashCode();
		result = 31 * result + this._createdDate.hashCode();
		result = 31 * result + this._text.getValue().hashCode();
		return result;
	}

	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append(IJDO.JDO_STR_START_TOKEN).append(this.getClass()).append(": ")
			.append("_id=").append(_ID).append(", ")
			//.append("_key=").append(getKey()).append(IJDO.JDO_PROPERTY_DELIMITER)
			.append("_name=").append(_name).append(IJDO.JDO_PROPERTY_DELIMITER)
			.append("_revision=").append(_revision).append(IJDO.JDO_PROPERTY_DELIMITER)
			.append("_creator=").append(_creator).append(IJDO.JDO_PROPERTY_DELIMITER)
			.append("_createdDate=").append(_createdDate).append(IJDO.JDO_PROPERTY_DELIMITER)
			.append("_firstRelease=").append(_firstRelease).append(IJDO.JDO_PROPERTY_DELIMITER)
			.append("_text=").append(_text)
			.append(IJDO.JDO_STR_END_TOKEN);
				
		return sb.toString();
	}
	

	@Override
	public String getCreator() {
		return this._creator;
	}


	// this needs to be private!!
	// I created a method rather than putting it in the constructor to abstract away the definition of what a 'creator' is;
	// clients should NEVER call this
	private void setCreatorID() {
		User currentUser =	UserServiceFactory.getUserService().getCurrentUser();
		 if (currentUser != null) {
			 this._creator = ValidationRoutines.getTrimmedNonEmptyString(currentUser.getNickname()); 
			 if (this._creator.length() < 1) {
				 this._creator = currentUser.getEmail();
			 }
		 }
	}


	@Override
	public String getID() {
		return String.valueOf(this._ID);
		//return String.valueOf(this.getKey());
	}	
	
	@Override
	public String getName() {
		return this._name;
	}

	@Override
	public Date getCreatedDate() {
		return new Date(this._createdDate.getTime());
	}

	@Override
	public String getText() {
		return this._text.getValue();
	}

	@Override
	public int getRevisionNum() {
		return this._revision;
	}

	@Override
	public String getFirstRelease() {
		return this._firstRelease;
	}
	
//	public EntityRef<AgreementFormJDO> createRef() {
//		@SuppressWarnings("unchecked")
//		Class<AgreementFormJDO> entityClass = (Class<AgreementFormJDO>) this.getClass();
//		Key key = KeyFactory.createKey(entityClass.getSimpleName(), getKey());
//		return new EntityRef<AgreementFormJDO>(this, key);
//	}	
	

}

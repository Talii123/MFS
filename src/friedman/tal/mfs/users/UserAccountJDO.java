package friedman.tal.mfs.users;

import java.util.List;
import java.util.Set;

import javax.jdo.annotations.Element;
import javax.jdo.annotations.Extension;
import javax.jdo.annotations.NotPersistent;
import javax.jdo.annotations.Order;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import friedman.tal.IUserID;
import friedman.tal.UserIDStringImpl;
import friedman.tal.jdo.IJDO;
import friedman.tal.mfs.agreements.AgreementFormLogicalKey;
import friedman.tal.mfs.agreements.AgreementJDO;
import friedman.tal.mfs.agreements.IAgreement;
import friedman.tal.mfs.timelines.ITimeline;
import friedman.tal.mfs.timelines.TimelineJDO;
import friedman.tal.util.Utils;

//TODO: write unit tests for equals() and hashcode()
//TODO: validate inputs to constructor?

@PersistenceCapable
public class UserAccountJDO implements IUserAccount {
	 
	@NotPersistent
	private static final Logger LOGGER = LoggerFactory.getLogger(UserAccountJDO.class);

	@PrimaryKey
	private String _name;
	
	/*  this doesn't work!  Transaction where AgreementJDO is created fails on commit when this is used.  I think it's because
	 * the values of the objects in the trxn need to be read at the end of the trxn to ensure that it can be committed but reading
	 * an UserAccountJDO with a null timeline whose concrete type is not known throws a Null Pointer Exception when attempting
	 * to fetch its metadata.  I think that's a bug - the runtime should look at the "types" annotation value and see what type to
	 * look to for the metadata, but that doesn't seem to be happening right now
	@Persistent(types=friedman.tal.mfs.timelines.TimelineJDO.class)
	private ITimeline _timeline;*/
	
	@Persistent(dependent = "true") 	// timeline should be deleted if this object is deleted or if it's replaced by a new timeline; only works via JDO not Admin Console - see: https://developers.google.com/appengine/docs/java/datastore/jdo/relationships#Dependent_Children_and_Cascading_Deletes
	private TimelineJDO _timeline;		// TODO: figure out why delete is not happening for dependent elements
		
	// only need "types" if the type stored by the List is an interface type.  However, currently Google/Datanucleus only support a single element in the list
	@Persistent(mappedBy = "_agreer" /*, types = friedman.tal.mfs.agreements.AgreementJDO.class/*, defaultFetchGroup = "true"*/)
	@Element(dependent = "true")	// dependent elements will be deleted if this object is deleted or if the field is changed and they are removed from it; only works via JDO not Admin Console - see: https://developers.google.com/appengine/docs/java/datastore/jdo/relationships#Dependent_Children_and_Cascading_Deletes
	@Order(extensions = @Extension(vendorName="datanucleus",key="list-ordering", value="_timeOfAgreement desc"))
	//private List<IAgreement> _agreements;
	private List<AgreementJDO> _agreements;
	
	// cache the {name, version} of agreement forms to make it simpler to check that a user has a given agreement
	@Persistent(serialized = "true")
	private Set<AgreementFormLogicalKey> _agreementFormKeys;
	
	/*@Persistent
	private AgreementJDO _agreement;*/
	
	public UserAccountJDO(String anEmail) {
		this._name = anEmail;
		this._agreements = Utils.newList();
		this._agreementFormKeys = Utils.newSet();
	}
	
	public UserAccountJDO(String anEmail, ITimeline aTimeline) {
		this(anEmail);
		this._timeline = TimelineJDO.from(aTimeline, this);
	}
	
	/*public UserAccountJDO(IUserAccount anUserAccount) {
		this._name = anUserAccount.getName();
		this._agreements = 
		this._timeline = TimelineJDO.from(anUserAccount.getTimeline(), anUserAccount);
	}

	public UserAccountJDO from(IUserAccount anUserAccount) {
		return anUserAccount instanceof UserAccountJDO ? (UserAccountJDO)anUserAccount : new UserAccountJDO(anUserAccount);
	}*/

	@Override
	public boolean equals(Object other) {
		if (this == other) return true;
		if (!(other instanceof IUserAccount)) return false;
		IUserAccount otherUserAccount = (IUserAccount)other;
		// agreements should not be part of equals method - should be able to distinguish user by identity
		IUserID userID = this.getUserId();
		IUserID otherUserID = otherUserAccount.getUserId();
		
		return userID  == otherUserID || (userID != null && userID.equals(otherUserID));
		
		// loading timeline may be an expensive operation so do it only once
		//ITimeline otherTimeline = otherUserAccount.getTimeline();
		//return this._name.equals(otherUserAccount.) &&
					//(this._timeline == otherTimeline || (this._timeline != null && this._timeline.equals(otherTimeline)));
	}

	// TODO: make sure all calls to all fields in hashCode(), equals() and toString() in all JDOs are null-safe
	@Override
	public int hashCode() {
		int result = 17;
		result = 31 * result + (this._name != null ?  this._name.hashCode() : 0);
		result = 31 * result + (this._timeline != null ?  this._timeline.hashCode() : 0);
		return result;
	}

	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append(IJDO.JDO_STR_START_TOKEN).append(this.getClass()).append(": ")
			//.append("_id=").append(_id).append(", ")
			.append("_name=").append(_name != null ? _name : "[null]").append(IJDO.JDO_PROPERTY_DELIMITER)
			.append("_timeline=").append((_timeline != null ? _timeline : "[null]")).append(IJDO.JDO_PROPERTY_DELIMITER);
			/* ITimeline timeline = getTimeline();
			if (timeline != null) {
				sb.append(timeline);
			}
			else {
				sb.append("[null]");
			}*/
			sb.append(IJDO.JDO_PROPERTY_DELIMITER).append(IJDO.JDO_STR_END_TOKEN);
				
		return sb.toString();
	}

	@Override
	public boolean hasAgreement(AgreementFormLogicalKey anAgreementFormKey) {
		return this._agreementFormKeys.contains(anAgreementFormKey);
	}
	
	@Override
	public void addAgreement(IAgreement anAgreement) {
		LOGGER.debug("\n\n\nadding agreement: ({}) \n to current user ({})\n\n\n\n", anAgreement, this);
		System.out.println(String.format("\n\n\nadding agreement: (%s) \n to current user (%s)\n\n\n\n", anAgreement, this));
		System.out.flush();
		
		//try {
			this._agreements.add(AgreementJDO.from(anAgreement));
			this._agreementFormKeys.add(anAgreement.getAgreementTermsLogicalKey());
		/*} catch (NullPointerException e) {
			LOGGER.error("Caught null pointer exception!  THIS SHOULD NOT HAPPEN!!! \n this: {} \n  exception: \n{}", this, e);
			throw e;
		}*/

	}
	
	/*@Override
	public Set<TypedKey<? extends IAgreementForm, ?>> getAgreementFormKeys(IAgreementFormResource anAgreementFormResource) {
		Set<TypedKey<? extends IAgreementForm, ?>> keys = Utils.newSet();
		if (this._agreements == null || this._agreements.isEmpty()) return keys;		
		
		Iterator<AgreementJDO> iter = this._agreements.iterator(); 
		while (iter.hasNext()) {
			AgreementJDO agreement = iter.next();
			keys.add(agreement.getAgreementTerms());			
		}
		
		return keys;
	}*/

	//@Override
	public String getName() {
		return _name;
	}
	
	
	@Override
	public IUserID getUserId() {		
		return new UserIDStringImpl(this.getName());
	}

	@Override
	public ITimeline getTimeline() {
		return this._timeline;
	}

	@Override
	public void setTimeline(ITimeline timeline) {
		//throw new UnsupportedOperationException("Currently not supporting timelines.");
		this._timeline = TimelineJDO.from(timeline, this);
	}
	
}

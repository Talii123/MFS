package friedman.tal.mfs.users;


import friedman.tal.IUserID;
import friedman.tal.mfs.agreements.AgreementFormLogicalKey;
import friedman.tal.mfs.agreements.IAgreement;
import friedman.tal.mfs.timelines.ITimeline;

public interface IUserAccount {

	public IUserID getUserId();
	
	//public String getName();

	public void setTimeline(ITimeline timeline);

	public ITimeline getTimeline();

	//public void addAgreement(IAgreement agreement);
	
	public <T extends IAgreement> void addAgreement(T anAgreement);
	
	public boolean hasAgreement(AgreementFormLogicalKey anAgreementFormKey);
	
	//public Set<TypedKey<? extends IAgreementForm, ?>> getAgreementFormKeys(IAgreementFormResource anAgreementFormResource);

}
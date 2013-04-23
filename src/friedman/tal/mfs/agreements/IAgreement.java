package friedman.tal.mfs.agreements;

import java.util.Date;

import friedman.tal.mfs.users.IUserAccount;
import friedman.tal.mfs.users.IUserInfo;

public interface IAgreement {

	// the return type should probably just be IAgreementForm, with retrieval logic for getting the agreement form pushed down in to the JDO/data layer
	//public TypedKey<? extends IAgreementForm, ?> getAgreementTerms();
	public AgreementFormLogicalKey getAgreementTermsLogicalKey();
	public Date getTimeofAgreement();
	public IUserAccount getAgreer();
	public IUserInfo getAgreerInfo();
}

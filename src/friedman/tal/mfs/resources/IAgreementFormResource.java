package friedman.tal.mfs.resources;

import friedman.tal.mfs.agreements.IAgreementForm;

public interface IAgreementFormResource {

	public IAgreementForm getAgreementForm(String name, Integer revisionNum);
}

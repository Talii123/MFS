package friedman.tal.mfs.agreements;

import java.util.List;
import java.util.Map;

interface IAgreementFormDAO {

	IAgreementForm postResource(String aName, String aText, String aFirstRelease);

	Map<String, List<IAgreementForm>> getAllAgreementForms();

}
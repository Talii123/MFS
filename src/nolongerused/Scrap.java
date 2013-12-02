package nolongerused;

public class Scrap {
	/*

	| From: AgreementFormResource.java |

	PersistenceManager pm = PMF.get().getPersistenceManager();
	IAgreementForm theAgreementForm = null;
	
	Query q = pm.newQuery(AgreementFormJDO.class);
	q.setFilter("_name == nameParam && _revision == revisionParam");
	q.declareParameters("String nameParam, Integer revisionParam");
	@SuppressWarnings("unchecked")
	List<IAgreementForm> results =  (List<IAgreementForm>)q.execute(name, revisionNum);
	
	int size = results.size();
	_logger.debug("results.size(): {}", size);
	
	if (results.size() > 1) {
		throw new IllegalStateException("There should only be one agreement form with a given name and revision number.");
	}
	
	Iterator<IAgreementForm> iter = results.iterator();
	if (iter.hasNext()) {
		theAgreementForm = iter.next();
		
		if (iter.hasNext()) {
			throw new IllegalStateException("There should only be one agreement form with a given name and revision number.");
		}
	}
	else {
		throw new JDOObjectNotFoundException(String.format("There is no IAgreement form with name: %s and revision number: %i", name, revisionNum));
	}

	_logger.debug("theAgreementForm = {}", theAgreementForm);
	pm.close();
	
	*/
	

}

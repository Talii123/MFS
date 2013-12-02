package friedman.tal.mfs.agreements;

import javax.ws.rs.Path;
import javax.ws.rs.core.MultivaluedMap;

import friedman.tal.jdo.IJDO;
import friedman.tal.mfs.exceptions.ConsentNotGivenException;
import friedman.tal.mfs.resources.IAgreementResource;
import friedman.tal.mfs.users.IUserAccount;
import friedman.tal.mfs.users.IUserInfo;
import friedman.tal.resources.IResourceDAOContext;
import friedman.tal.resources.Resource;
import friedman.tal.resources.ResourceDAO;

@Path(AgreementResource.RESOURCE_URL)
public class AgreementResource extends Resource<IAgreement> implements IAgreementResource {
	
	public static final String RESOURCE_URL = "/agreements";

	@Deprecated
	public AgreementResource() {
		//this._dao = new AgreementDAO(AgreementJDO.class);
	}
	
	/*public AgreementResource(PersistenceManager aPM, SecurityContext anSC) {
		super(aPM, anSC);
		//this._dao = new AgreementDAO(AgreementJDO.class, aPM, anSC);
	}*/
	
	public AgreementResource(IResourceDAOContext aContext) {
		super(aContext);
	}
	
	/*@POST
	@Consumes(Utils.HTML_FORM_MEDIATYPE)
	public void makeAgreement(@FormParam("") String anAgreementFormName, @FormParam("") Integer anAgreementRevisionNum, @FormParam("next") MY_TIMELINE_RESOURCE_URL aNextURL) throws IOException {
		HttpServletResponse response = getDAOContext().getResponse();
		if (makeAgreement(anAgreementFormName, anAgreementRevisionNum)) {
			response.sendRedirect(aNextURL.toExternalForm());
		}
		else {
			throw new WebApplicationException(Response.Status.BAD_REQUEST);
		}
	}*/
	

	public static AgreementFormLogicalKey getAgreementFormLogicalKey(MultivaluedMap<String, String> aSignUpForm) {
		String agreementFormName = aSignUpForm.getFirst("agreementName");
		Integer agreementRevisionNum = Integer.valueOf(aSignUpForm.getFirst("agreementRevision"));
		return new AgreementFormLogicalKey(agreementFormName, agreementRevisionNum);
	}
	
	public IAgreement makeAgreement(MultivaluedMap<String, String> aSignUpForm) throws ConsentNotGivenException {
		boolean isConsentGiven = CONSENT_YES_VALUE.equals(aSignUpForm.getFirst(CONSENT_PARAM_NAME));

		AgreementFormLogicalKey key = getAgreementFormLogicalKey(aSignUpForm);
		
		if (isConsentGiven) {			
			return this.makeAgreement(key);			
		}
		
		throw new ConsentNotGivenException(String.format("Cannot make this agreement; user has NOT provided consent.  AgreementFormKey: %s ", key));
	}
	
	/**
	 * 
	 * @param anAgreementFormName TODO
	 * @param anAgremeentRevisionNum TODO
	 */
	public IAgreement makeAgreement(AgreementFormLogicalKey anAgreementFormLogicalKey) {
		// TODO: validate anAgreer (and anAgreerInfo?)
		IAgreement newAgreement = null;
		AgreementDAO<? extends IAgreement> dao = getDAO();
		try {
			dao.initIfLocalTrxn();		

			IResourceDAOContext myContext = getDAOContext();
			
			AgreementFormResource agreementFormResource = new AgreementFormResource(myContext);
			IAgreementForm agreementForm = agreementFormResource.getAgreementForm(anAgreementFormLogicalKey.getFormName(), anAgreementFormLogicalKey.getFormVersion());

//			UserAccountResource userAccountResource = new UserAccountResource(myContext);
//			IUserAccount agreer = userAccountResource.getUserAccount();
			
			/*HttpServletRequest request = myContext.getRequest();
			_logger.debug("request: {}", StringMaker.requestToString(request));
			IUserInfo agreerInfo = Utils.getRemoteUserInfo(request);
			_logger.debug("agreerInfo: {}", agreerInfo);*/
			
			newAgreement = dao.makeAgreement(/*agreer, agreerInfo, */agreementForm);
			dao.commitIfLocalTrxn();
		} finally {
			dao.cleanupIfLocalTrxn();
		}
		
		return newAgreement;
	}
	
	/*
	@Override
	protected <U extends ResourceDAO<IAgreement> & IJDO<IAgreement, ?>> U getDAO() {
		// TODO Auto-generated method stub
		return null;
	}	*/
	
	@Override
	protected AgreementDAO<AgreementJDO>/*<? extends IAgreement & IJDO<IAgreement, Key>>*/ getDAO() {
		logContextFields();
		return new AgreementDAO<AgreementJDO>(AgreementJDO.class, getDAOContext());		
	}
	
	private final class AgreementDAO<T extends IAgreement & IJDO<String>> extends ResourceDAO<T> {
		
//		private AgreementDAO(Class<T> theDBClass) {
//			super(theDBClass);
//		}
		
		private AgreementDAO(Class<T> theDBClass, IResourceDAOContext aDAOContext) {
			super(theDBClass, aDAOContext);
		}
		
		private IAgreement makeAgreement(/*IUserAccount anAgreer, IUserInfo anAgreerInfo,*/ IAgreementForm anAgreementForm) {
			IAgreement newAgreement = null;
			
			this.initIfLocalTrxn();
			try {
				// this doesn't always work; I think it's because the newly created object isn't available from the database yet
				// what about now?  I just added ability of calling context to add data from its DAO, so UserAccount should be cached
				IUserAccount agreer = getUserAccount();
				IUserInfo agreerInfo = getUserInfo();
				newAgreement = new AgreementJDO(agreer, agreerInfo, anAgreementForm);
				// NOTE: if IUserAccount is NOT persistable, this code would be needed to persist the new agreement form
				//this._pm.makePersistent(newAgreement);
				agreer.addAgreement(newAgreement);
				
				this.commitIfLocalTrxn();
			} /*catch (Exception e) {
				this.exceptionThrown(e);			
			} */
			finally {
				this.cleanupIfLocalTrxn();
			}
			return newAgreement;
		}
	}


}

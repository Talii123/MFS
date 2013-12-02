package friedman.tal.mfs.agreements;

import java.io.IOException;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.jdo.JDOObjectNotFoundException;
import javax.jdo.PersistenceManager;
import javax.jdo.Query;
import javax.jdo.Transaction;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

import com.google.appengine.api.utils.SystemProperty;

import friedman.tal.SimpleCache;
import friedman.tal.resources.IResourceDAOContext;
import friedman.tal.resources.Resource;
import friedman.tal.resources.ResourceDAO;
import friedman.tal.util.StringMaker;
import friedman.tal.util.Utils;
import friedman.tal.views.IView;
import friedman.tal.views.JSPView;
import friedman.tal.mfs.resources.IAgreementFormResource;

@Path("/admin/agreementForms")
public class AgreementFormResource extends Resource<IAgreementForm> implements IAgreementFormResource {

	public static final String AGREEMENT_FORMS_ATTR_NAME = "agreementForms";
	public static final String CURRENT_AGREEMENT_FORM_ATTR_NAME = "currentAgreementForm";
	
	private static final String AGREEMENT_FORMS_LIST_URI = "/WEB-INF/AgreementFormsList.jsp";
	private static final IView AGREEMENT_FORMS_VIEW = new JSPView(AGREEMENT_FORMS_LIST_URI);
	
	// don't need to enforce a singleton contract, just don't want to waste resources by making a DAO object for each request; since the resource is per-request,
	// not a singleton resource, if we didn't share an instance of this DAO statically, we'd have to create one for each request.  Only the result set(s)/object(s)
	// returned by or passed to the resource cannot be shared.
		
	// belay that; want to have one DAO per Resource instance so that we can initialize it with a PM and an SC so that we don't have to pass those into every method
	//private final AgreementFormDAO<AgreementFormJDO> _dao = new AgreementFormDAO<AgreementFormJDO>(AgreementFormJDO.class);

	// this should probably be a request param not a field; I only put it here cuz I wanted to print it from all methods conveniently while learning more about the SecurityContext object
	/*@Context
	private SecurityContext sc;*/
	
	@Deprecated
	public AgreementFormResource() {
		//this._dao = new AgreementFormDAO<AgreementFormJDO>(AgreementFormJDO.class);
		//this._dao = new AgreementFormDAO<AgreementFormJDO>(AgreementFormJDO.class, _pm, null);
	}
	
	/*public AgreementFormResource(PersistenceManager aPM, SecurityContext anSC) {
		super(aPM, anSC);	
	}	*/
	
	public AgreementFormResource(IResourceDAOContext aDAOContext) {
		super(aDAOContext);
	}
	
	@POST
	@Consumes(Utils.HTML_FORM_MEDIATYPE)
	public void createNewAgreementForm(@FormParam("agreementName") String anAgreementName,
			@FormParam("agreementText") String anAgreementText, 
			@Context UriInfo uriInfo/* Reader in*/,
			@Context HttpServletRequest request,
			@Context HttpServletResponse response) 
				throws IOException, ServletException {
		
		LOGGER.debug("URIInfo: {}\n\n\n", StringMaker.uriInfoToString(uriInfo));
		
		AgreementFormDAO<AgreementFormJDO> dao = getDAO();
		IAgreementForm newAgreementForm = dao.postResource(anAgreementName, anAgreementText, SystemProperty.applicationVersion.get());
		if (newAgreementForm != null) {
			String locationURI = uriInfo.getAbsolutePath() + "/" + newAgreementForm.getName()+"-"+newAgreementForm.getRevisionNum();
			LOGGER.debug("locationURI: {}", locationURI);
			/*try {
				//return // should be using 201 Created response Response.created(new URI(locationURI)).header("Refresh", "0; "+locationURI).build();
						// lazy way for now..
						//Response.seeOther(new URI(locationURI)).build();*/
				request.setAttribute(CURRENT_AGREEMENT_FORM_ATTR_NAME, newAgreementForm);
				AGREEMENT_FORMS_VIEW.render(request, response);		
			
			/*} catch (URISyntaxException urise) {
				// should not happen
				_logger.error("Just created an Agreement Form but for some reason, the MY_TIMELINE_RESOURCE_URL is not valid; exception={}", urise);
				//return Response.serverError().build();
			}*/			
		}
		else {
			//return Response.serverError().build();
			LOGGER.error("An error occurred while creating an Agreement Form with name: '{}' and text: '{}' ", anAgreementName, anAgreementText);
			throw new WebApplicationException(Response.serverError().entity(String.format("An error occurred while creating an Agreement Form with name: '%s' and text: '%s' ", anAgreementName, anAgreementText)).build());
		}
		
	}
	
	@GET
	@Path("/{name}-{revisionNum}")
	@Produces("text/html;charset=UTF-8")
	public void getAgreementForm(@PathParam("name") String name, @PathParam("revisionNum") Integer revisionNum, 
			@Context HttpServletRequest request, @Context HttpServletResponse response) 
				throws IOException, ServletException {
				
		IAgreementForm theAgreementForm = getAgreementForm(name, revisionNum);
		LOGGER.debug("the agreement form: {}", theAgreementForm);
		request.setAttribute(CURRENT_AGREEMENT_FORM_ATTR_NAME, theAgreementForm);
		AGREEMENT_FORMS_VIEW.render(request, response);
	}
	
	@Override
	public IAgreementForm getAgreementForm(String name, Integer revisionNum) {
		AgreementFormDAO<AgreementFormJDO> dao = getDAO();
		return dao.findResource(name, revisionNum);
	}

	@GET
	@Produces("text/html;charset=UTF-8")
	public void getAllAgreementForms(@Context HttpServletRequest request, @Context HttpServletResponse response) 
			throws IOException, ServletException {
		
		LOGGER.debug("\n\n\n\n this resource = {} \n\n\n\n\n", this);
		AgreementFormDAO<AgreementFormJDO> dao = getDAO();
		Map<String, List<IAgreementForm>> agreementFormsToRevision = dao.getAllAgreementForms();
		
		request.setAttribute(AGREEMENT_FORMS_ATTR_NAME, agreementFormsToRevision);
		AGREEMENT_FORMS_VIEW.render(request, response);
		//request.getRequestDispatcher(AGREEMENT_FORMS_LIST_URI).forward(request, response);
	}


	@SuppressWarnings("unchecked")
	public AgreementFormDAO<AgreementFormJDO> getDAO() {
		logContextFields();
		return new AgreementFormDAO<AgreementFormJDO>(AgreementFormJDO.class, getDAOContext());		
	}
	
/*	
 * DO NOT support PUT operation for Agreements.  This makes it much harder to audit agreements since a revision can be
 * overwritten at any time.  Instead, only allow agreements to be revised by always creating a new object to represent the 
 * latest revision of the agreement.  Old revisions can always be retrieved this way.
 * 
  	@PUT
	@Path("{agreementFormID}")
	@Consumes("application/x-www-form-urlencoded")
	public Response updateAgreementForm(@PathParam("agreementFormID") String anAgreementID, ) {		
	}
	
*/

	
	private static class AgreementFormDAO<T extends IAgreementForm> extends ResourceDAO<T> implements IAgreementFormDAO {

		private static final String ERROR_NON_UNIQUE_VERSIONING = "There should only be one agreement form with a given name and revision number. (name='{}', revisionNum='{}')";
		
		// TODO: fix this!  this defeats the purpose of having a pluggable dbClass at runtime that implements the IAgreementForm interface
		private static final SimpleCache<AgreementFormLogicalKey, ? super AgreementFormJDO> agreementFormCache = new SimpleCache<AgreementFormLogicalKey, AgreementFormJDO>();
				
		private AgreementFormDAO(Class<T> theDBClass, IResourceDAOContext aDAOContext) {
			super(theDBClass, aDAOContext);
		}
		
		/* (non-Javadoc)
		 * @see friedman.tal.mfs.agreements.IAgreementFormDAO#postResource(java.lang.String, java.lang.String, java.lang.String)
		 */
		@Override
		public IAgreementForm postResource(String aName, String aText, String aFirstRelease) {
			// use a transaction because we are first reading the max revision number from the database and then creating a new
			// object based on the assumption that that value has not changed
			Transaction trx = this._pm.currentTransaction();
			trx.begin();
			
			// pass in the persistence manager so that we can share the same transaction (pm.currentTransaction())
			int version = getMaxRevisionID(aName, this._pm) + 1; 
			IAgreementForm newAgreementForm = new AgreementFormJDO(aName, version, aText, aFirstRelease);
			try {				
				this._pm.makePersistent(newAgreementForm);
				trx.commit();				
			} 
			finally {
				if (trx.isActive()) {
					trx.rollback();
				}
			}
			return newAgreementForm;
		}

		
		protected IAgreementForm findResource(String name, Integer revisionNum) {
			AgreementFormLogicalKey formKey = new AgreementFormLogicalKey(name, revisionNum);
			IAgreementForm theAgreementForm = (IAgreementForm) agreementFormCache.get(formKey);
			
			if (theAgreementForm != null) {
				LOGGER.debug("\n\n\n\n  Found agreement form (name: '{}', version: '{}') in cache.  \n\n\n\n", name, revisionNum);
				return theAgreementForm;
			}
					
			try {
				this.initIfLocalTrxn();
				
				Query q = this._pm.newQuery(this._theDBClass);
				q.setFilter("_name == nameParam && _revision == revisionParam");
				q.declareParameters("String nameParam, Integer revisionParam");
				@SuppressWarnings("unchecked")
				List<IAgreementForm> results =  (List<IAgreementForm>)q.execute(name, revisionNum);
												
				Iterator<IAgreementForm> iter = results.iterator();
				if (iter.hasNext()) {
					theAgreementForm = iter.next();
					
					if (iter.hasNext()) {
						_logger.error(ERROR_NON_UNIQUE_VERSIONING, name, revisionNum);
					}
				}
				else {
					throw new JDOObjectNotFoundException(String.format("There is no Agreement Form with name: '%s' and revision number: '%d'", name, revisionNum));
				}

				_logger.debug("theAgreementForm = {}", theAgreementForm);
				this.commitIfLocalTrxn();
				LOGGER.debug("\n\n\n\n  Agreement form (name: '{}', version: '{}') was not in cache, so created one and putting it there now.  \n\n\n\n", name, revisionNum);
				agreementFormCache.put(formKey, (AgreementFormJDO)theAgreementForm);
			} finally {
				//this._pm.close();				
				this.cleanupIfLocalTrxn();
			}
			
			return theAgreementForm;						
		}
		
		
		private int getMaxRevisionID(String aName, PersistenceManager pm) {
			
			Query query = pm.newQuery(AgreementFormJDO.class);
			query.setFilter("_name == nameParam");
			query.declareParameters("String nameParam");
			query.setOrdering("_revision desc");
			query.setRange(0, 1);
			
			@SuppressWarnings("unchecked")
			List<AgreementFormJDO> results =  (List<AgreementFormJDO>)query.execute(aName);
			if (results != null && results.size() > 0) {
				return Integer.valueOf(results.get(0).getRevisionNum());
			}
			
			return 0;
		}		

		
		@Override
		public Map<String, List<IAgreementForm>> getAllAgreementForms() {			
			Map<String, List<IAgreementForm>> agreementFormsToRevision = Utils.newMap();
			
			try {
				//final QuerySpec<AgreementFormJDO> qSpec = (QuerySpec<AgreementFormJDO>) QuerySpec.makeQuerySpec(_theDBClass, "", "", "_name asc, _revision desc", "");
//				Query q = qSpec.prepareQuery(pm);
				Query q = this._pm.newQuery(AgreementFormJDO.class);
				q.setOrdering("_name asc, _revision desc");				

				@SuppressWarnings("unchecked")
				List<IAgreementForm> results = (List<IAgreementForm>)q.execute();				
				
				for (IAgreementForm agreementForm : results) {
					_logger.debug("agreementForm: {} \n", agreementForm);
				}
				List<IAgreementForm> allAgreementForms = (List<IAgreementForm>)this._pm.detachCopyAll(results);			
				
				String currentAgreementName = "", agreementName;
				List<IAgreementForm> agreementFormsCopyList = null;
				for (IAgreementForm agreementForm : allAgreementForms) {
					agreementName = agreementForm.getName();
					if (!agreementName.equals(currentAgreementName)) {
						agreementFormsCopyList = Utils.newList();
						currentAgreementName = agreementName;
						agreementFormsToRevision.put(currentAgreementName, agreementFormsCopyList);
					}
					agreementFormsCopyList.add(agreementForm);				
				}		
				
				for (String name : agreementFormsToRevision.keySet()) {
					_logger.debug("name= {}, forms={}", name, agreementFormsToRevision.get(name).toArray());
				}	
				
				return agreementFormsToRevision;
			} finally {
				this._pm.close();
			}			
		}

	}
	
}

package friedman.tal.mfs.users;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLEncoder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

import com.google.appengine.api.users.UserServiceFactory;

import friedman.tal.mfs.MyFibroStoryApplication;
import friedman.tal.mfs.agreements.AgreementFormLogicalKey;
import friedman.tal.mfs.agreements.AgreementFormResource;
import friedman.tal.mfs.agreements.AgreementResource;
import friedman.tal.mfs.agreements.IAgreementForm;
import friedman.tal.mfs.exceptions.ConsentNotGivenException;
import friedman.tal.mfs.resources.ITimelineResource;
import friedman.tal.mfs.resources.IUserAccountResource;
import friedman.tal.mfs.timelines.TimelineResource;
import friedman.tal.resources.IResourceDAOContext;
import friedman.tal.resources.Resource;
import friedman.tal.resources.ResourceDAO;
import friedman.tal.util.StringMaker;
import friedman.tal.util.Utils;
import friedman.tal.views.IView;
import friedman.tal.views.JSPView;


@Path("")
public class UserAccountResource extends Resource<IUserAccount> implements IUserAccountResource {

	private static Response PING_RESPONSE;

	public static final String SIGNUP_FORM_AGREEMENT_FORM_PARAM_NAME = "agreementForm";
	public static final String POST_SIGN_UP_FORM_URL_PARAM_NAME = "postSignUpFormURL";
	
	
	private static final String SIGNUP_FORM_LIST_URI = "/WEB-INF/SignupForm.jsp";
	
	private static final IView SIGNUP_VIEW = new JSPView(SIGNUP_FORM_LIST_URI);
	
	@Deprecated
	public UserAccountResource() {
	}
	
	public UserAccountResource(IResourceDAOContext aDAOContext) {
		super(aDAOContext);
	}
	
	/*  NOOO!!!  DO NOT return UserAccounts to anybody!
	@Override
	public IUserAccount getCurrentUserAccount() {
		return this.getDAO().getCurrentUserAccount();
	}
	*/

	
	@GET
	@Path(IUserAccountResource.RESOURCE_URL)
	@Produces("text/html")
	public void getSignupForm(@Context HttpServletRequest request, @Context HttpServletResponse response) 
			throws IOException, ServletException {
		getSignupForm(request, response, null);
	}

	private void getSignupForm(HttpServletRequest request, HttpServletResponse response, String errorMsg) throws ServletException, IOException {
		LOGGER.debug("request: "+StringMaker.requestToString(request));
		LOGGER.debug("user: "+StringMaker.googleUserToString((UserServiceFactory.getUserService().getCurrentUser())));
		
		
		AgreementFormLogicalKey requiredAgreementFormKey = MyFibroStoryApplication.getRequiredKey();
		
		// TODO add support for security context
		
		AgreementFormResource agreementFormResource = new AgreementFormResource(getDAOContext());
		IAgreementForm requiredAgreementForm = agreementFormResource.getAgreementForm(requiredAgreementFormKey.getFormName(), Integer.valueOf(requiredAgreementFormKey.getFormVersion()));
				
		request.setAttribute(SIGNUP_FORM_AGREEMENT_FORM_PARAM_NAME, requiredAgreementForm);
		request.setAttribute(POST_SIGN_UP_FORM_URL_PARAM_NAME, IUserAccountResource.RESOURCE_URL);
		if (Utils.getValueOrEmptyString(errorMsg).length() > 0) {
			request.setAttribute(ERROR_MSG_STRING_ATTR, errorMsg);
		}
		SIGNUP_VIEW.render(request, response);
	}
	
	
	/*
	 * @FormParam("agreementName") String anAgreementFormName, 
								@FormParam("agreementRevision") Integer anAgreementRevisionNum,
								@FormParam("firstName") String aFirstName,
								@FormParam("lastName") String aLastName,
								@FormParam("email") String anEmail,
								@FormParam("timelineID") String aTimelineID,
								
	 */

	private void getRequiredAgreementFormKey() {
		// TODO: cache requiredAgreementForm in the MyFibroStoryApplication object
		MyFibroStoryApplication application = MyFibroStoryApplication.getApplication();

		
	}

	@POST
	@Path(IUserAccountResource.RESOURCE_URL)
	@Consumes(Utils.HTML_FORM_MEDIATYPE)
	public Response signUp(@Context UriInfo uriInfo, MultivaluedMap<String, String> aSignUpForm) 								
			throws ServletException, IOException, URISyntaxException {

		String locationURI;
		LOGGER.debug("URIInfo: {}\n\n\n", StringMaker.uriInfoToString(uriInfo));
		
		Response timelineCreationResponse;
		UserResourceDAO<? extends IUserAccount> userDAO = getDAO();
		
		try {			
			userDAO.initIfLocalTrxn();
			// trxn 1
			IUserAccount userAccount = userDAO.createUserAccount();
			
			userDAO.commitIfLocalTrxn();

			
			// passing the userAccount into the context via this method, rather than passing the variable;
			// don't want callers to be able to pass userAccount objects around explicitly (more to the point, don't want mutators that
			// accept UserAccount objects; let the IResourceDAOContext worry about propagating data
			IResourceDAOContext myContext = getDAOContext();
			myContext.addToContext(userDAO);
			
			// myContext should now have the new userAccount cached in it so that is available to anyone using the context even if
			// the database is not completely updated
			
			
			// trxn 2			
			userDAO.initIfLocalTrxn();

			AgreementResource agreementResource = new AgreementResource(myContext);
			if (!userAccount.hasAgreement(AgreementResource.getAgreementFormLogicalKey(aSignUpForm))) {
				agreementResource.makeAgreement(aSignUpForm);	
			}
			
			
			// NOTE: trxn 2 cannot rely on any data created by trxn 1 that is fetched via queries as indexes will likely not yet be up to date;
			// all data required for trxn 2 should be retrieved by key only
			// UserAccounts are retrieved by key only
			// Agreements are OWNED by UserAccounts; since it's a collection I believe it is fetched by a query
			
			// NOTE: if combine into 1 transaction, cannot read data created by the operations of trxn 1 in trxn 2 as GAEJ uses 
			// 'snapshot isolation'; since here we want to require that the appropriate agreement is IN THE DATABASE for the user before
			// he/she can create a timeline, I've opted for 2 separate transactions; if it turns out that the data from trxn 1 is not always
			// available inside transaction 2, will have to settle for combining the transactions and therefore will not be able to read
			// the 'agreements' from the database but rather from the transaction context.
			
			// trxn 2
			//PersistenceManager pm = PMF.getNewPM();
			TimelineResource timelineResource = new TimelineResource(myContext/*, null*/);
			//timelineResource.createAndRenderTimeline(aSignUpForm);		
			timelineResource.createTimeline(aSignUpForm);
			
			userDAO.commitIfLocalTrxn();
			
			// use substring(1) to drop the leading "/"
			locationURI = uriInfo.getBaseUri() + ITimelineResource.MY_TIMELINE_RESOURCE_URL.substring(1);
			LOGGER.debug("locationURI: {}", locationURI);
			
				// would like to use "created" response here, but Firefox does not follow the "location" header in "created" responses
				timelineCreationResponse = Response.seeOther(new URI(locationURI)).build();
			
		} catch (ConsentNotGivenException e) {
			// use substring(1) to drop the leading "/"
			
			locationURI = uriInfo.getBaseUri() + IUserAccountResource.RESOURCE_URL.substring(1) + "?errorMsg=" + URLEncoder.encode(ConsentNotGivenException.DEFAULT_ERROR_MSG, "UTF-8");
			timelineCreationResponse = Response.seeOther(new URI(locationURI)).build();
		} finally {
			userDAO.cleanupIfLocalTrxn();
		}		
		
		return timelineCreationResponse;
	}
		
	
	@Override
	public Response deleteMyAccount() {
		UserResourceDAO<? extends IUserAccount> userResourceDAO = getDAO();
		boolean isDeleted = userResourceDAO.deleteMyAccount();
		if (isDeleted) {
			return Response.ok().build();
		}
		else {
			return Response.serverError().build();
		}
	}
	
	@GET
	@Path("/admin/ping")
	public Response ping() {
		// lazily construct in case it's not really used 
		if (PING_RESPONSE == null) PING_RESPONSE = Response.ok().entity("pong").build();
		return PING_RESPONSE;
	}


	@Override
	@SuppressWarnings("unchecked")
	protected UserResourceDAO<? extends IUserAccount> getDAO() {
		logContextFields();
		return new UserResourceDAO<UserAccountJDO>(UserAccountJDO.class, getDAOContext());		
	}		
	
	private final class UserResourceDAO<T extends IUserAccount> extends ResourceDAO<T> {
		private UserResourceDAO(Class<T> theDBClass, IResourceDAOContext aDAOContext) {
			super(theDBClass, aDAOContext);
		}
		
		public boolean deleteMyAccount() {
			boolean isDeleted = false;
			this.initIfLocalTrxn();
			
			try {
				IUserAccount userAccount = getUserAccount();
				this._pm.deletePersistent(userAccount);
				this.commitIfLocalTrxn();
				
				LOGGER.debug("\n\n\n Account successfully deleted and transaction committed. \n\n\n");
				isDeleted = true;

			} finally {
				this.cleanupIfLocalTrxn();
			}
			return isDeleted;			
			
		}

		private IUserAccount getCurrentUserAccount() {
			return super.getUserAccount();
		}
		
		private IUserAccount createUserAccount() {		
			IUserAccount userAccount = null;
			try {
				this.initIfLocalTrxn();
				
				userAccount = getUserAccount();
				// this should throw an exception if the user already exists 
				//throw new IllegalStateException("User account already exists!");
				if (userAccount == null) {
					userAccount = new UserAccountJDO(getDAOContext().getUser().getName());
					this._pm.makePersistent(userAccount);
					this.cacheUserAccount(userAccount);
				}
				
				_logger.debug("commit transaction if it's local;  is local? {}", (this.isLocalTrxn() ? "yes" : "no"));
				this.commitIfLocalTrxn();				
				
			} finally {
				this.cleanupIfLocalTrxn();
			}
			
			return userAccount;
		}
		
		
//		private IUserAccount createUserAccount() {		
//			IUserAccount userAccount = null;
//			try {
//				this.initIfLocalTrxn();
//				
//				userAccount = getUserAccount();
//				// this should throw an exception if the user already exists 
//				//throw new IllegalStateException("User account already exists!");
//			} catch (JDOObjectNotFoundException nfe) {
//				try {
//					userAccount = new UserAccountJDO(getDAOContext().getUser().getName());
//					this._pm.makePersistent(userAccount);
//					
//					_logger.debug("commit transaction if it's local;  is local? {}", (this.isLocalTrxn() ? "yes" : "no"));
//					this.commitIfLocalTrxn();
//				} finally {
//					// do nothing
//				}
//				
//			} finally {
//				this.cleanupIfLocalTrxn();
//			}
//			
//			return userAccount;
//		}


		/*private IUserAccount getUserAccount() {
			this.initIfLocalTrxn();
			
			IUserAccount userAccount = null;
			
			try {
				Principal user = getDAOContext().getUser();				
				String username = user.getName();
				_logger.debug("getting UserAccountJDO for username: '{}' ", username);
				userAccount = this._pm.getObjectById(UserAccountJDO.class, username);
				_logger.debug("retrieved userAccount: '{}' ", userAccount);
				this.commitIfLocalTrxn();
			} /*catch (Exception e) {
				this.exceptionThrown(e);
			} *//*
			finally {
				this.cleanupIfLocalTrxn();
			}

			return userAccount;
		}	*/	
	}

}

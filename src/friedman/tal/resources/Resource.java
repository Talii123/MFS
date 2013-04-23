package friedman.tal.resources;

import java.security.Principal;

import javax.jdo.PersistenceManager;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.SecurityContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import friedman.tal.jdo.IJDO;
import friedman.tal.mfs.users.IUserAccount;
import friedman.tal.mfs.users.IUserInfo;
import friedman.tal.util.PMF;
import friedman.tal.util.StringMaker;

public abstract class Resource<T> {
	

	
	private final PersistenceManager _pm;
	
	protected final Logger LOGGER = LoggerFactory.getLogger(this.getClass());
	
	@Context
	private SecurityContext _sc;
	
	@Context
	private HttpServletRequest _request;
	
	@Context
	private HttpServletResponse _response;
	
	private ResourceDAOContext _resourceDAOContext;
	
	public Resource() {
		this._pm = null;

		logContextFields();
	}
	
	/*protected Resource(PersistenceManager aPM, SecurityContext anSC) {
		this._pm = aPM;
		this._sc = anSC;
		
		logContextFields();
	}*/
	
	protected Resource(IResourceDAOContext callingContext) {
		this._resourceDAOContext = new ResourceDAOContext(callingContext);
		this._pm = this._resourceDAOContext.getPM();
		/*this._pm = callingContext.getPM();
		this._sc = callingContext.getSecurityContext();
		this._request = callingContext.getRequest();
		this._response = callingContext.getResponse();*/
	}
	
	protected Resource(IResourceDAOContext callingContext, PersistenceManager pm) {
		this._resourceDAOContext = new ResourceDAOContext(callingContext, pm);
		this._pm = pm;		
	}
	
	// this doesn't seem to work!! :(
	/*
	protected void sendRedirect(String aRedirectURL) throws IOException {
		LOGGER.debug("sending redirect. URL: '{}' \n  Response: {}", aRedirectURL, this._response);
		this._response.sendRedirect(aRedirectURL);
	}*/
	
	/*protected final SecurityContext getSecurityContext() {
		return this._sc;
	}
	
	protected final PersistenceManager getPM() {
		return this._pm != null ? this._pm : PMF.getNewPM();
	}*/
	
	
	protected void logContextFields() {
		LOGGER.debug("_pm = {}", this._pm);
		LOGGER.debug("_sc = {}", StringMaker.securityContextToString(this._sc));
	}
	
	protected IResourceDAOContext getDAOContext() {
		// if this resource was created by another resource, it should have passed in the required fields and therefore 
		// _resourceDAOContext should already have been created (in the constructor); therefore, this resource has been called
		// by the JAX-RS runtime, so the fields were injected; by creating an object with all the fields declared 'final', we're freezing
		// the values of those fields; if the JAX-RS runtime is creating this resource, it should have already populated all these fields
		// before calling the Resource method; therefore, any subsequent changes to these fields could only be harmful.
		// IN other words, the JAX-RS does not need to change these fields later, and since the JAX-RS runtime should be the only
		// caller of this code that does not pass in an IResourceDAOContext, there should be no legal reason to change these fields later.
		if (this._resourceDAOContext == null) {
			synchronized (this) {
				if (this._resourceDAOContext == null) {
					this._resourceDAOContext = new ResourceDAOContext(this._pm, this._sc, this._request, this._response);
				}
			}
		}
		return this._resourceDAOContext;
	}
	
	protected abstract <U extends ResourceDAO<T> & IJDO<?>> U getDAO();
	//protected abstract ResourceDAO<T> getDAO();
	
	final class ResourceDAOContext implements IResourceDAOContext {
		private final PersistenceManager _pm;
		private final SecurityContext _sc;
		private final HttpServletRequest _request;
		private final HttpServletResponse _response;
		
		private IUserAccount _userAccount;
		private IUserInfo _userInfo;
		
		// used when invoked by other resources
		private ResourceDAOContext(IResourceDAOContext aCallingContext) {
			this._sc = aCallingContext.getSecurityContext();
			this._pm = aCallingContext.getPM();
			this._request = aCallingContext.getRequest();
			this._response = aCallingContext.getResponse();
			
			this._userAccount = aCallingContext.getUserAccount();
			this._userInfo = aCallingContext.getUserInfo();
		}
		
		// used when invoked by other resources
		private ResourceDAOContext(IResourceDAOContext aCallingContext, PersistenceManager aPM) {
			this._pm = aPM;
			this._sc = aCallingContext.getSecurityContext();
			this._request = aCallingContext.getRequest();
			this._response = aCallingContext.getResponse();		
			
			this._userAccount = aCallingContext.getUserAccount();
			this._userInfo = aCallingContext.getUserInfo();			
		}		
		
		// used when invoked by JAX-RS runtime
		private ResourceDAOContext(PersistenceManager aPM, SecurityContext anSC, HttpServletRequest aRequest, HttpServletResponse aResponse) {
			this._pm = aPM;
			this._sc = anSC;
			this._request = aRequest;
			this._response = aResponse;
		}
		
		@Override
		public SecurityContext getSecurityContext() {
			return this._sc;
		}

		@Override
		public HttpServletResponse getResponse() {
			return this._response;
		}

		@Override
		public HttpServletRequest getRequest() {
			return this._request;
		}

		@Override
		public PersistenceManager getPM() {
			return this._pm != null ? this._pm : PMF.getNewPM();
		}

		@Override
		public Principal getUser() {
			return getSecurityContext().getUserPrincipal();
		}

		@Override
		public IUserAccount getUserAccount() {
			// I think this will cause a circular dependency!			
//			if (this._userAccount == null) {
//				this._userAccount = Resource.this.getDAO().getUserAccount(); 
//			}			
			
			return this._userAccount; 		
		}
		

		@Override
		public IUserInfo getUserInfo() {
			// I think this will cause a circular dependency!
//			if (this._userInfo == null) {
//				this._userInfo = Resource.this.getDAO().getUserInfo();
//			}
//			
			return this._userInfo;
		}

		@Override
		public void addToContext(ResourceDAO<?> aResourceDAO) {
			if (aResourceDAO != null && aResourceDAO.hasUserAccount()) {
				this._userAccount = aResourceDAO.getUserAccount();
			}
			
		}

		/*void setUserAccount(IUserAccount anUserAccount) {
			this._userAccount = anUserAccount;
		}*/
		
		
		
	}	
}
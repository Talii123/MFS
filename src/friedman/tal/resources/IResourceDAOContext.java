package friedman.tal.resources;

import java.security.Principal;

import javax.jdo.PersistenceManager;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.SecurityContext;

import friedman.tal.mfs.users.IUserAccount;
import friedman.tal.mfs.users.IUserInfo;

public interface IResourceDAOContext {

	public SecurityContext getSecurityContext();
	public PersistenceManager getPM();
	public HttpServletRequest getRequest();
	public HttpServletResponse getResponse();
	public Principal getUser();
	public IUserAccount getUserAccount();
	public IUserInfo getUserInfo();
	
	public void addToContext(ResourceDAO<?> aResourceDAO);
}

package friedman.tal.mfs.resources;

import javax.ws.rs.DELETE;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;


public interface IUserAccountResource {

	public static final String RESOURCE_URL = "/signup";
	public static final String LOGOUT_URL_ATTR_NAME = "logoutURL";
	public static final String LOGIN_URL_ATTR_NAME = "loginURL";
	public static final String SIGNUP_URL_ATTR_NAME = "signupURL";

	public static final String NICKNAME_ATTR_NAME = "nickname";
	public static final String ERROR_MSG_STRING_ATTR = "errorMsg";
	
	
	@DELETE
	@Path("/myAccount")
	public Response deleteMyAccount();
	
	
	/*  NOOO!!!  DO NOT return UserAccounts to anybody!
	@GET
	public IUserAccount getCurrentUserAccount();
	*/
}

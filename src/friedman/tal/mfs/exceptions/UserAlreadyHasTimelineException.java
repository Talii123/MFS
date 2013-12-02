package friedman.tal.mfs.exceptions;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.WebApplicationException;

public class UserAlreadyHasTimelineException extends WebApplicationException {

	private HttpServletRequest _request;
	private HttpServletResponse _response;
	
	public static final String DEFAULT_ERROR_MSG = "You already have a timeline.  Currently, each person can only have one timeline.";
	
	public void setRequestAndResponse(HttpServletRequest aRequest, HttpServletResponse aResponse) {
		this._request = aRequest;
		this._response = aResponse;
	}
	
	public HttpServletRequest getHttpServletRequest() {
		return this._request;
	}
	
	public HttpServletResponse getHttpServletResponse() {
		return this._response;
	}	
}
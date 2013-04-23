package friedman.tal.filters;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

import org.slf4j.LoggerFactory;

import org.slf4j.Logger;

import friedman.tal.util.StringMaker;

public class PostOverrideRequestWrapper extends HttpServletRequestWrapper{

	public static final String DELETE_METHOD_VALUE = "DELETE";

	public static final String X_POST_OVERRIDE_HEADER_NAME = "x-post-override";
	
	public static final Logger LOGGER = LoggerFactory.getLogger(PostOverrideRequestWrapper.class);
	
	public PostOverrideRequestWrapper(HttpServletRequest request) {
		super(request);
	}

	@Override
	public String getMethod() {
		HttpServletRequest request = (HttpServletRequest)super.getRequest();
		String method = request.getMethod();
		LOGGER.debug("Wrapper: method="+method);
		
		if (!"POST".equals(method)) {
			LOGGER.trace("Since the method isn't POST, don't need to look for overriding HTTP method; my work here is done.");
			return method;
		}
		else {
			LOGGER.trace("Since the method is POST, I need to check to see if this is a tunneling request.");
			
			String overrideHeader = request.getHeader(X_POST_OVERRIDE_HEADER_NAME);
			LOGGER.trace("overrideHeader: "+overrideHeader);
			
			if (overrideHeader == null || (overrideHeader = overrideHeader.trim()).length() <= 0) {
				return method;
			}
			// only support tunneling for DELETE and PUT requests for now
			if (overrideHeader.equals(DELETE_METHOD_VALUE)) {
				LOGGER.debug("Looks like this was a DELETE request tunneled through a POST request.");
				method = "DELETE";
			}
			else if (overrideHeader.equals("PUT")) {
				LOGGER.debug("Looks like this was a PUT request tunneled through a POST request.");
				method = "PUT";
			}
			else {
				LOGGER.error("Attempted to tunnel an unsupported HTTP verb ({}) with a POST request.  Need to return an error so that the request does not get routed to any service on the server.", overrideHeader);
				// TODO figure out why this does not return an appropriate error to the caller
				throw new WebApplicationException(Response.Status.BAD_REQUEST);
			}
			
			return method;
		}			
	}

	@Override
	public String toString() {
		return StringMaker.requestToString(this);
	}
	
	
}

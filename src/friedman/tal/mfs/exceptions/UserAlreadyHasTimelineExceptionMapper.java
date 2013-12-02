package friedman.tal.mfs.exceptions;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.ExceptionMapper;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;

import javax.ws.rs.ext.Provider;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import friedman.tal.mfs.resources.ITimelineResource;
import friedman.tal.mfs.resources.IUserAccountResource;
import friedman.tal.mfs.timelines.TimelineResource;
import friedman.tal.resources.IResourceDAOContext;
import friedman.tal.views.JSPView;


@Provider
public class UserAlreadyHasTimelineExceptionMapper implements ExceptionMapper<UserAlreadyHasTimelineException> {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(UserAlreadyHasTimelineExceptionMapper.class);
	
	@Override
	public Response toResponse(UserAlreadyHasTimelineException exception) {
			LOGGER.error("\n\n\n Handling a UserAlreadyHasTimelineException; exception = {}\n\n\n", exception.getMessage());
		
			HttpServletRequest request = exception.getHttpServletRequest();
			
			// NOTE: cannot be singleton instance!
			JSPView errorView = new JSPView("/WEB-INF/error.jsp");
			errorView.setRequestAndResponse(request, exception.getHttpServletResponse());
			
			Map<String, String> errorsMap = new HashMap<String, String>();
			errorsMap.put("msg", "Sorry but your sign up request was cancelled because you have already signed up and created a timeline.");
			errorsMap.put("gotoLink", "/myStory");
			errorsMap.put("gotoText", "To view/edit your timeline, click here");
			request.setAttribute("error", errorsMap);
			//errorView.setRequestAndResponse(request, response);
			
			LOGGER.debug("\n\n\n returning bad request with error view...\n\n\n");
			return Response.status(Status.BAD_REQUEST).entity(errorView).build();					
	}
}

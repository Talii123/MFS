package friedman.tal.mfs.exceptions;

import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;

import java.net.URI;
import java.net.URISyntaxException;

import javax.ws.rs.ext.Provider;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import friedman.tal.mfs.resources.ITimelineResource;
import friedman.tal.mfs.resources.IUserAccountResource;
import friedman.tal.mfs.timelines.TimelineResource;


@Provider
public class UserAlreadyHasTimelineExceptionMapper implements ExceptionMapper<UserAlreadyHasTimelineException> {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(TimelineResource.class);
	
	@Override
	public Response toResponse(UserAlreadyHasTimelineException exception) {
		try {
			LOGGER.error("\n\n\n Handling a UserAlreadyHasTimelineException; exception = {}\n\n\n", exception.getMessage());
			return Response.seeOther(new URI(ITimelineResource.MY_TIMELINE_RESOURCE_URL)).build();
		} catch (URISyntaxException e) {
			// this should never happen
			final String errorMsg = String.format("Could not form a valid redirect URI from: '%s' ", IUserAccountResource.RESOURCE_URL);
			return Response.serverError().entity(errorMsg).build();
		}
		
	}
}

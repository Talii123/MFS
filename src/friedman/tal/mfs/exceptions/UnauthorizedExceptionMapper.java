package friedman.tal.mfs.exceptions;

import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

import org.jboss.resteasy.spi.UnauthorizedException;

@Provider
public class UnauthorizedExceptionMapper implements ExceptionMapper<UnauthorizedException> {

	private static final String UNAUTHORIZED_USER_MESSAGE = "I'm sorry but the creator of the timeline you've requested has not granted you permission to view it.";

	@Override
	public Response toResponse(UnauthorizedException exception) {
		return Response.status(Status.UNAUTHORIZED).entity(UNAUTHORIZED_USER_MESSAGE).build();
	}

	
}

package friedman.tal.mfs.exceptions;

import java.net.URI;
import java.net.URISyntaxException;

import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;


import friedman.tal.mfs.resources.IUserAccountResource;


@Provider
public class UserHasNoAccountExceptionMapper implements ExceptionMapper<UserHasNoAccountException> {
	
	@Override
	public Response toResponse(UserHasNoAccountException exception) {
		try {
			return Response.temporaryRedirect(new URI(IUserAccountResource.RESOURCE_URL)).build();	
		} catch (URISyntaxException e) {
			// this should never happen
			final String errorMsg = String.format("Could not form a valid redirect URI from: '%s' ", IUserAccountResource.RESOURCE_URL);
			return Response.serverError().entity(errorMsg).build();
		}
		
	}
}

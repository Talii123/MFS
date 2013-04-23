package friedman.tal.mfs.exceptions;

import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

@Provider
public class ConsentNotGivenExceptionMapper implements ExceptionMapper<ConsentNotGivenException> {

	@Override
	public Response toResponse(ConsentNotGivenException exception) {
		return Response.status(Status.BAD_REQUEST).entity(ConsentNotGivenException.DEFAULT_ERROR_MSG).build();
	}

}

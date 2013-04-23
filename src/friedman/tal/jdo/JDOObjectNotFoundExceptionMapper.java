package friedman.tal.jdo;

import javax.jdo.JDOObjectNotFoundException;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

@Provider
public class JDOObjectNotFoundExceptionMapper implements ExceptionMapper<JDOObjectNotFoundException> {

	
	
	@Override
	public Response toResponse(JDOObjectNotFoundException exception) {
		return Response.status(Response.Status.NOT_FOUND).entity(exception.toString()).build();
	}

	
}

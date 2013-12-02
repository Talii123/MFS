package friedman.tal.mfs.exceptions;

import java.net.URISyntaxException;

import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Provider
public class URISyntaxExceptionMapper implements ExceptionMapper<URISyntaxException> {

	private static final Logger LOGGER = LoggerFactory.getLogger(URISyntaxException.class);
	
	@Override
	public Response toResponse(URISyntaxException exception) {
		LOGGER.error("Caught a URISyntaxException: {}", exception);
		return Response.serverError().build();
	}

}

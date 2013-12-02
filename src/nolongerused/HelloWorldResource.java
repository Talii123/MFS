package nolongerused;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class HelloWorldResource implements IHelloWorld {
	
	public final static Logger LOGGER = LoggerFactory.getLogger(HelloWorldResource.class);

	@Override
	@GET
	@Produces("text/plain")
	public String getSalutation() {
		LOGGER.trace("GET called on /hello");
		return "Hello World!";
	}
	
	@Override
	@POST
	public String postHello(@Context HttpServletRequest request, @HeaderParam("x-post-override") String postOverrideHeader) {
		LOGGER.trace("POST called on /hello");
		String greeting = request.getParameter("greeting");
		
		System.out.println("x-post-override: "+postOverrideHeader);
		//System.out.println("httpMethod: "+request.getMethod());
		
		LOGGER.debug("I received the following greeting: {}", greeting);
		
		return "Server received the message: " + greeting;
	}
	
	@Override
	@DELETE
	public String deleteHello() {
		LOGGER.trace("DELETE called on /hello");
		final String deleteMsg = "You can't delete the world!!  What are you, Mayan?!?";
		LOGGER.debug(deleteMsg);
		
		return deleteMsg;
	}
	
	@Override
	@PUT
	public String fakePut() {
		LOGGER.trace("PUT called on /hello");
		final String putMsg = "I'm not really supporting PUT at the moment..";
		LOGGER.debug(putMsg);
		return putMsg;
	}
}

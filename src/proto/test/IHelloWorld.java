package proto.test;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;

@Path("hello")
public interface IHelloWorld {

	@GET
	@Produces("text/plain")
	public String getSalutation();

	@POST
	public String postHello(@Context HttpServletRequest request,
			@HeaderParam("x-post-override") String postOverrideHeader);

	@DELETE
	public String deleteHello();

	@PUT
	public String fakePut();

}
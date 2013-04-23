package friedman.tal.mfs;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;


@Path("/sandbox")
public class PublicSandboxResource {

	@GET
	@Produces("text/html")
	public void getSandboxedTimeline(@Context HttpServletRequest request, @Context HttpServletResponse response) 
			throws IOException, ServletException {
		request.getRequestDispatcher("/WEB-INF/sandboxedTimeline.jsp").forward(request, response);
		
	}
}

package nolongerused;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;

@Path("/admin/huh")
public class HuhResource {

	@GET
	@Produces("text/html")
	protected void doGet(@Context HttpServletRequest req, @Context HttpServletResponse resp)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		req.getRequestDispatcher("/WEB-INF/AgreementFormsList.jsp").forward(req, resp);
	}

	
}

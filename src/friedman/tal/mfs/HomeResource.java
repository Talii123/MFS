package friedman.tal.mfs;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import friedman.tal.jdo.IJDO;
import friedman.tal.mfs.exceptions.UserHasNoAccountException;
import friedman.tal.mfs.resources.ITimelineResource;
import friedman.tal.mfs.resources.IUserAccountResource;
import friedman.tal.mfs.timelines.TimelineResource;
import friedman.tal.resources.Resource;
import friedman.tal.resources.ResourceDAO;
import friedman.tal.views.IView;
import friedman.tal.views.JSPView;

@Path("/")
public class HomeResource extends Resource<Object> {

	public static final Logger LOGGER = LoggerFactory.getLogger(HomeResource.class);
	
	
	@GET
	@Path("")
	@Produces("text/html")		
	public void getHomePage(@Context HttpServletRequest request, @Context HttpServletResponse response) throws ServletException, IOException, UserHasNoAccountException {
		boolean isLoggedIn = request.getAttribute(IUserAccountResource.LOGOUT_URL_ATTR_NAME) != null;
		
		if (isLoggedIn) {
			LOGGER.debug("forwarding logged in user to his/her timeline...");
			//request.getRequestDispatcher(ITimelineResource.MY_TIMELINE_RESOURCE_URL).forward(request, response);
			ITimelineResource timelineResource = new TimelineResource(getDAOContext());
			timelineResource.getMyTimelineHTML();
		}
		else {
			TimelineResource.getDemoTimeline(request, response);
		}
	}
	
	@Override
	protected <U extends ResourceDAO<Object> & IJDO<?>> U getDAO() {
		throw new UnsupportedOperationException("Home resource does not have a DAO.");
	}
}

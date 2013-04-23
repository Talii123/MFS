package friedman.tal.mfs.resources;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;

import org.jboss.resteasy.spi.UnauthorizedException;

import friedman.tal.mfs.exceptions.UserHasNoAccountException;
import friedman.tal.mfs.timelines.ITimeline;
import friedman.tal.mfs.timelines.events.IEvent;
import friedman.tal.util.Utils;

public interface ITimelineResource {
	
	public static final String PUBLIC_TIMELINE_RESOURCE_URL = "public/{timelineID}";
	
	public static final String MY_TIMELINE_RESOURCE_URL = "/myStory";
	
	public static final String MY_TIMELINE_RESOURCE_EVENTS_URL = MY_TIMELINE_RESOURCE_URL + "/events";
	
	public static final String MY_TIMELINE_RESOURCE_CHAPTERS_URL = MY_TIMELINE_RESOURCE_URL + "/chapters";

	public static final String TIMELINE_ATTR_NAME = "timeline";

	public static final String EVENTS_JSON_ATTR_NAME = "eventsJSON";
	
	public static final String CHAPTERS_JSON_ATTR_NAME = "chaptersJSON";


	@POST
	@Path(MY_TIMELINE_RESOURCE_EVENTS_URL)
	@Consumes({MediaType.APPLICATION_JSON, "application/*+json"})
	public Response addEventForCurrentUser(IEvent anEvent);
	
	@DELETE
	@Path(MY_TIMELINE_RESOURCE_CHAPTERS_URL+"/{chapterID}")
	public Response deleteChapterForCurrentUser(@PathParam("chapterID") String aChapterID) throws UnauthorizedException, UserHasNoAccountException;
	
	@DELETE
	@Path(MY_TIMELINE_RESOURCE_EVENTS_URL+"/{eventID}")
	public Response deleteEventForCurrentUser(@PathParam("eventID") String anEventID) throws UnauthorizedException, UserHasNoAccountException;
	
	@GET
	@Path(MY_TIMELINE_RESOURCE_URL)
	@Produces("text/html")
	public Response getMyTimelineHTML() throws ServletException, IOException, UserHasNoAccountException;

	// TODO: come up with better resource path for this
	@GET
	@Path(MY_TIMELINE_RESOURCE_URL+"/java")
	public ITimeline getMyTimeline() throws UserHasNoAccountException;
	
	@GET
	@Path(PUBLIC_TIMELINE_RESOURCE_URL)
	@Produces("text/html")
	public Response getPublicTimelineHTML(@PathParam("timelineID") String aTimelineID) throws ServletException, IOException;

	/*@GET
	@Path(PUBLIC_TIMELINE_RESOURCE_URL)
	@Produces("application/json")
	public <T extends ITimeline> T getPublicTimelineJSON(@PathParam("timelineID") String aTimelineID);
*/
	
	@Path("timelines")
	@POST
	@Consumes(Utils.HTML_FORM_MEDIATYPE)
	public void createAndRenderTimeline(MultivaluedMap<String, String> aTimelineSpecForm) throws ServletException, IOException;
	

}

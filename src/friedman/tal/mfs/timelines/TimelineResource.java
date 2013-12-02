package friedman.tal.mfs.timelines;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Set;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.xml.bind.ValidationException;

import org.jboss.resteasy.spi.UnauthorizedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import friedman.tal.mfs.MyFibroStoryApplication;
import friedman.tal.mfs.SharingOption;
import friedman.tal.mfs.exceptions.UserAlreadyHasTimelineException;
import friedman.tal.mfs.exceptions.UserHasNoAccountException;
import friedman.tal.mfs.resources.ITimelineResource;
import friedman.tal.mfs.resources.IUserAccountResource;
import friedman.tal.mfs.timelines.events.EventJDOFactory;
import friedman.tal.mfs.timelines.events.IEvent;
import friedman.tal.mfs.users.IUserAccount;
import friedman.tal.mfs.users.UserAccountJDO;
import friedman.tal.resources.IResourceDAOContext;
import friedman.tal.resources.Resource;
import friedman.tal.resources.ResourceDAO;
import friedman.tal.util.Utils;
import friedman.tal.views.IView;
//import friedman.tal.views.IView;
import friedman.tal.views.JSPView;

@Path("")	// TODO: find out: is this the same as @Path("/")?  I'd rather not use the slash
public class TimelineResource extends Resource<ITimeline> implements ITimelineResource {
	
	private static final String TIMELINE_VIEW_JSP_URL = "/WEB-INF/Timeline.jsp";
	//private static final IView TIMELINE_VIEW = new JSPView(TimelineResource.TIMELINE_VIEW_JSP_URL);
	
	private static final IView DEMO_VIEW = new JSPView("/WEB-INF/Demo.jsp");
	
	private static final Logger LOGGER = LoggerFactory.getLogger(TimelineResource.class);

	public TimelineResource(IResourceDAOContext aResourceDAOContext) {
		super(aResourceDAOContext);
	}
	
	public TimelineResource(IResourceDAOContext aResourceDAOContext, PersistenceManager aPM) {
		super(aResourceDAOContext, aPM);
	}
	
	@Deprecated
	public TimelineResource() {		
	}
	
	

	
	@Override
	public Response deleteChapterForCurrentUser(@PathParam("chapterID") String aChapterID) throws UnauthorizedException, UserHasNoAccountException {		
		return deleteEventForCurrentUser(aChapterID, true);
	}

	@Override
	public Response deleteEventForCurrentUser(@PathParam("eventID") String anEventID) throws UnauthorizedException, UserHasNoAccountException {		
		return deleteEventForCurrentUser(anEventID, false);
	}
	
	private Response deleteEventForCurrentUser(String aChapterID, boolean isChapter) throws UnauthorizedException, UserHasNoAccountException {
		TimelineDAO<? extends ITimeline> timelineDAO = getDAO();
		boolean isDeleted = timelineDAO.deleteEventForCurrentUser(aChapterID, isChapter);
		if (isDeleted) {
			return Response.ok().build();
		}
		else {
			return Response.serverError().entity(String.format("Unable to delete chapter with ID: %s",aChapterID)).build();
		}
	}
	
	// TODO: is there a way to use an interface rather than a concrete type?
	@Override
	public Response addEventForCurrentUser(IEvent anEvent) {
		LOGGER.debug("received event: '{}' ", anEvent);
				
		TimelineDAO<? extends ITimeline> timelineDAO = getDAO();
		// TODO: confirm: should logic to transform the event object to a JDO and validate it be placed here rather than at the DAO level?		
		EventJDO eventJDO = timelineDAO.convert(anEvent);
		
		try {
			// the DAO only returns validated EventJDOs
			timelineDAO.addEventForCurrentUser(eventJDO);	
			return Response.ok().build();
		} catch (UserHasNoAccountException e) {
			try {
				return Response.temporaryRedirect(new URI(IUserAccountResource.RESOURCE_URL)).build();
			} catch (URISyntaxException e1) {
				// this should never happen
				final String errorString = String.format("Error: unable to redirect user due to invalid URI (%s)", IUserAccountResource.RESOURCE_URL);
				LOGGER.error(errorString);
				e1.printStackTrace();
				
				return Response.serverError().entity(errorString).build();
			}
			//sendRedirect(IUserAccountResource.RESOURCE_URL);
		}
	}
	

	@Override
	public Response getMyTimelineHTML() throws ServletException, IOException, UserHasNoAccountException {
		//try {
		
			ITimeline timeline = getMyTimeline();
			/*LOGGER.debug("getMyTimelineHTML() retrieved a timeline; now going to render it;\n timeline: {}", timeline);
			  renderTimeline(timeline, getDAOContext(), false);*/
	
			if (timeline == null) {
				LOGGER.debug("Inside getMyTimelineHTML(), timeline is null, so cannot render it.  Redirect user to create timeline.");
				try {
					return Response.seeOther(new URI("/timelineForm")).build();
				} catch (URISyntaxException e) {
					LOGGER.debug("Caught an exception while trying to redirect user to create a timeline");
					e.printStackTrace();
					return Response.serverError().build();
				}
			}
			else {
				LOGGER.debug("Inside getMyTimelineHTML(), found timeline: {}", timeline);
			}
			
			IResourceDAOContext context = this.getDAOContext();
			//LOGGER.debug("in getMyTimelineHTML()... Going to try returning the JSPStreamingOUtputView...");
			//return new JSPStreamingOutputView(TIMELINE_VIEW_JSP_URL, context.getRequest(), context.getResponse());
			
			
			
			LOGGER.debug("Going to return a JSPView as a Response payload.");
			return Response.ok(renderTimeline(timeline, context, false)).build(); 

		/*TODO: confirm this has been moved to an ExceptionMapper
		 * 
		 * } catch (UserHasNoAccountException e) {
			LOGGER.debug("Since user does not have an account, redirect the user to the signup URL.");
			//sendRedirect(IUserAccountResource.RESOURCE_URL);
			
		}*/
	}

	@Override
	public ITimeline getMyTimeline() throws UserHasNoAccountException {
		ITimeline timeline = getDAO().getCurrentUserTimeline();
		LOGGER.debug("timeline: {}", timeline);
		return timeline;
	}
	
	
//	@GET
//	@Path(PUBLIC_TIMELINE_RESOURCE_URL)
//	@Produces("text/html")
	@Override
	public Response getPublicTimelineHTML(@PathParam("timelineID") String aTimelineID) throws ServletException, IOException {
		ITimeline publicTimeline = getPublicTimeline(aTimelineID);
		if (publicTimeline == null) {
			return Response.status(Status.NOT_FOUND).build();
		}
		
		renderTimeline(publicTimeline, getDAOContext(), true);
		return null;
	}
	
	/*
	 * Actually, we should not be returning Timeline objects (JSON or otherwise) to clients; only the html form
	@Override
	public TimelineJDO getPublicTimelineJSON(@PathParam("timelineID") String aTimelineID) {
		return (TimelineJDO) getPublicTimeline(aTimelineID);
	}*/
	
	private ITimeline getPublicTimeline(String aTimelineID) {
		return getDAO().findTimelineByPublicID(aTimelineID);
	}
	
//	@Path("timelines")
//	@POST
//	@Consumes(Utils.HTML_FORM_MEDIATYPE)
	@Override
	public void createAndRenderTimeline(MultivaluedMap<String, String> aTimelineSpecForm) throws ServletException, IOException {
		renderTimeline(createTimeline(aTimelineSpecForm), getDAOContext(), false);
	}
	
	public ITimeline createTimeline(MultivaluedMap<String, String> aTimelineSpecForm) throws UserAlreadyHasTimelineException {
		String timelineID = aTimelineSpecForm.getFirst("timelineID");
		String sharingOptionsParam = aTimelineSpecForm.getFirst("viewPermissions");
		
		ITimeline newTimeline = createTimeline(timelineID, SharingOption.valueOf(sharingOptionsParam));
		return newTimeline;
	}
	
	
	private ITimeline createTimeline(String timelineID, SharingOption aSharingSetting) throws UserAlreadyHasTimelineException {
		ITimeline newTimeline = null;
		timelineID = Utils.getValueOrEmptyString(timelineID);
		boolean hasTimelineID = timelineID.length() > 0;
		TimelineDAO<? extends ITimeline> timelineDAO = null;
		
		try {			
			timelineDAO = getDAO();
			timelineDAO.initIfLocalTrxn();
			
			IUserAccount userAccount = timelineDAO.getCurrentUserAccount();
			
			checkRequiredAgreements(userAccount);
			checkHasNoTimeline(userAccount);			
			
			if (hasTimelineID) {
				newTimeline = timelineDAO.createTimeline((UserAccountJDO)userAccount, timelineID, aSharingSetting);
			}
			else {
				newTimeline = timelineDAO.createTimeline((UserAccountJDO)userAccount, aSharingSetting);
			}
			
			LOGGER.debug("before committing transaction, newTimeline is: \n {}", newTimeline);
			timelineDAO.commitIfLocalTrxn();
		} finally {
			if (timelineDAO != null) {
				timelineDAO.cleanupIfLocalTrxn();	
			}			
		}

		return newTimeline;
	}

	
	private void checkRequiredAgreements(IUserAccount aUserAccount) {
		if (!aUserAccount.hasAgreement(MyFibroStoryApplication.getRequiredKey())) {
			throw new IllegalStateException("User has not signed the proper agreements.");		
		}
	}

	private void checkHasNoTimeline(IUserAccount aUser) throws UserAlreadyHasTimelineException {
		if (aUser.getTimeline() != null) {
			IResourceDAOContext context = getDAOContext();
			UserAlreadyHasTimelineException exception = new UserAlreadyHasTimelineException();
			exception.setRequestAndResponse(context.getRequest(), context.getResponse());
			
			throw exception;
		}
	}
	
	private JSPView renderTimeline(ITimeline timeline, IResourceDAOContext myContext, boolean isReadonly)
			throws ServletException, IOException {
		HttpServletRequest request = myContext.getRequest();

		// only check if the timeline is editable if calling code has not explicitly stated it's readonly 
		boolean isEditable = !isReadonly && timeline.canWrite(myContext.getSecurityContext());
		// should I be passing just the events or the whole timeline object?
		request.setAttribute(ITimelineResource.TIMELINE_ATTR_NAME, timeline);
		request.setAttribute(ITimelineResource.EVENTS_JSON_ATTR_NAME, timeline.getEventJSON(myContext.getSecurityContext()));
		request.setAttribute(ITimelineResource.CHAPTERS_JSON_ATTR_NAME, timeline.getChapterJSON(myContext.getSecurityContext()));
		
		request.setAttribute("isEditable", isEditable);
		LOGGER.debug("rendering a timeline... isEditable = {} \n timeline = {}", isEditable, timeline);
		//TimelineResource.TIMELINE_VIEW.render(request, myContext.getResponse());
		
		JSPView view = new JSPView(TIMELINE_VIEW_JSP_URL);
		view.setRequestAndResponse(myContext.getRequest(), myContext.getResponse());
		return view;
	}	
	
	/*private void renderTimeline(ITimeline timeline, IResourceDAOContext myContext, boolean isReadonly)
			throws ServletException, IOException {
		HttpServletRequest request = myContext.getRequest();

		// only check if the timeline is editable if calling code has not explicitly stated it's readonly 
		boolean isEditable = !isReadonly && timeline.canWrite(myContext.getSecurityContext());
		// should I be passing just the events or the whole timeline object?
		request.setAttribute(ITimelineResource.TIMELINE_ATTR_NAME, timeline);
		request.setAttribute(ITimelineResource.EVENTS_JSON_ATTR_NAME, timeline.getEventJSON(myContext.getSecurityContext()));
		
		request.setAttribute("isEditable", isEditable);
		LOGGER.debug("rendering a timeline... isEditable = {} \n timeline = {}", isEditable, timeline);
		TimelineResource.TIMELINE_VIEW.render(request, myContext.getResponse());
	}*/
	
	
	
	
	/*public void deleteTimeline(IUserAccount aUser) {
		if (aUser.getTimeline() == null) {
			throw new IllegalArgumentException("User does not have a timeline!");
		}
		
		getDAO().deleteTimeline(aUser);
	}*/

	@SuppressWarnings("unchecked")
	@Override
	protected TimelineDAO<? extends ITimeline> getDAO() {
		logContextFields();
		return new TimelineDAO<TimelineJDO>(TimelineJDO.class, getDAOContext());
	}	
	
	@GET
	@Path("/demo")
	@Produces("text/html")	
	public static void getDemoTimeline(@Context HttpServletRequest request, @Context HttpServletResponse response)
			throws ServletException, IOException {
		// go to demo page and/or allow signup and login
		LOGGER.debug("user is not logged in so allow fallthrough to demo page.");
		
		DEMO_VIEW.render(request, response);
		//InputStream in = getClass().getResourceAsStream("/DemoPreRenderedPreLoaded.html");
		//return Response.ok().entity(in).build();
	
	}

	private final class TimelineDAO<T extends ITimeline> extends ResourceDAO<T> {

		private static final String USER_NOT_AUTHORIZED_TO_VIEW_TIMELINE_ERROR_MSG = "User does not have permission to read/view this timeline.  Context: %s";

		protected TimelineDAO(Class<T> aDBClass, IResourceDAOContext aDAOContext) {
			super(aDBClass, aDAOContext);
		}



		private ITimeline findTimelineByPublicID(String aTimelineID) throws UnauthorizedException {
			ITimeline timeline = null;
			Query q = this._pm.newQuery(this._theDBClass);
			q.setFilter("_publicID == timelineIDParam");
			q.declareParameters("String timelineIDParam");
			
			@SuppressWarnings("unchecked")
			List<? extends ITimeline> results = (List<? extends ITimeline>) q.execute(aTimelineID);
			int numResults = results != null ? results.size() : 0;
			
			if (numResults > 0) {
				if (numResults > 1) {
					_logger.warn("Found more than one object with the supposedly unique _publicID of: '{}' ", aTimelineID);
				}
				
				timeline = results.get(0);
			}

			if (timeline.canRead(this._sc)) {
				LOGGER.info("Context: '{}' has permission to view timeline with ID: '{}' so returning it now.", this._sc, timeline.getPublicId());
				return timeline;	
			}
			else {				
				throw makeUnauthorizedException();
			}
		}

		private IUserAccount getCurrentUserAccount() {
			return super.getUserAccount();
		}

		private ITimeline getCurrentUserTimeline() throws UnauthorizedException, UserHasNoAccountException {
			// TODO: add proper handling of null user accounts
			IUserAccount userAccount = getUserAccount();
			
			if (userAccount == null) {
				LOGGER.debug("userAccount is null.  Current User does not have an account with us.");
				throw new UserHasNoAccountException();
			}
			
			ITimeline timeline = userAccount.getTimeline();
			if (timeline == null) {
				return null;
			}
			else if (timeline.canRead(this._sc)) {
				LOGGER.info("Context: '{}' has permission to view timeline with ID: '{}' so returning it now.", this._sc, timeline.getPublicId());
				return timeline;
			}
			else {				
				throw makeUnauthorizedException();
			}
		}

		private UnauthorizedException makeUnauthorizedException()  {
			final String errorString = String.format(USER_NOT_AUTHORIZED_TO_VIEW_TIMELINE_ERROR_MSG, this._sc);
			LOGGER.error(errorString);
			return new UnauthorizedException(errorString);
		}

		private ITimeline createTimeline(UserAccountJDO aUser, SharingOption aSharingSetting) {
			ITimeline timeline = new TimelineJDO(aUser, aSharingSetting); 
			return timeline;
		}
		
		private ITimeline createTimeline(UserAccountJDO aUser, String aTimelineID, SharingOption aSharingSetting) {			
			PublicTimelineID publicID = ResourceDAO.makeUniqueID(PublicTimelineID.class, aTimelineID, this._pm);
			ITimeline timeline = new TimelineJDO(aUser, publicID.getUniqueString(), aSharingSetting);
			return timeline;
		}		
		
		
		private boolean deleteEventForCurrentUser(String anEventID, boolean isChapter) throws UnauthorizedException, UserHasNoAccountException {
			this.initIfLocalTrxn();
			boolean result = false;
			try {			
				TimelineJDO currentUserTimeline = (TimelineJDO)getCurrentUserTimeline();
				if (isChapter) {
					result = currentUserTimeline.deleteChapterJSONForId(anEventID, this._sc);	
				}
				else {
					result = currentUserTimeline.deleteEventJSONForId(anEventID, this._sc);
				}
				
				this.commitIfLocalTrxn();
			} finally {
				this.cleanupIfLocalTrxn();
			}
			
			return result;
			
		}
		
		private void addEventForCurrentUser(EventJDO anEvent) throws UserHasNoAccountException {
			this.initIfLocalTrxn();
			
			try {
				//wrap lookup of current timeline in the same transaction context as the adding of the event so that
				// if the timeline has been modified outside the transaction, this add event operation will fail.
				// TODO: verify this is the most appropriate behaviour
				TimelineJDO timeline = (TimelineJDO)getCurrentUserTimeline();
				addEventToTimeline(anEvent, timeline);
				
				this.commitIfLocalTrxn();
			} finally {
				this.cleanupIfLocalTrxn();
			}
			
		}

		
		private void addEventToTimeline(EventJDO eventJDO, TimelineJDO aTimeline) {
			
			
			// now that the event has been created and validated, add it to the timeline within a local transaction since
			// multiple objects are being updated 
			
			this.initIfLocalTrxn();
			try {
								
				// since event is in the same entity group as the timeline that forms an unowned relationship with it, they can be
				// updated within the same transaction.
				// the new event added to the timeline will be persisted once the transaction is commited
				aTimeline.addEvent(eventJDO, this._sc);
				
//				try {
//					LOGGER.debug("aTimeline.getKey(): {}", aTimeline.getTypedKey());
//					
//					LOGGER.debug("eventJDO.getKey(): {}", eventJDO.getTypedKey());					
//				} catch (IllegalAccessException e) {
//					LOGGER.error("That's weird.  I caught an exception while debugging.  {}", e);
//				}

				
				/* instead of saving the event object when it's first added, let's index it later after the user is "happy" with
				 * his/her accounting of this event and less likely to change it much.
				// this is needed because the relationship between the Timeline and the Event is unowned
				this._pm.makePersistent(eventJDO);
				*/

				this.commitIfLocalTrxn();
			} finally {
				this.cleanupIfLocalTrxn();
			}		
			
		}

		private EventJDO convert(IEvent anEvent) {
			// NOTE: validation is done on the EventJDO rather than the EventTO since we would like to defensively copy
			// all fields before performing validation; may as well copy them into the object that will eventually be persisted
			// into the database.
			EventJDO eventJDO = EventJDOFactory.createEvent(anEvent);
			try {
				validateEvent(eventJDO);	
			} catch (Exception e) {
				LOGGER.error("Caught validation exception: {}", e.getMessage());
				throw new WebApplicationException(Status.BAD_REQUEST);
			}
						
			// eventJDO created from EventTO will only be returned to caller if no validation exception was thrown  
			return eventJDO;
		}
		
		private void validateEvent(EventJDO anEventJDO) throws ValidationException {
			ValidatorFactory vFactory = Validation.buildDefaultValidatorFactory();
			Validator validator = vFactory.getValidator();
			
			Set<ConstraintViolation<EventJDO>> violations = validator.validate(anEventJDO);
			if (violations.size() > 0) {
				for (ConstraintViolation<EventJDO> violation : violations) {
					LOGGER.debug("Validation error while trying to add an event; \n Invalid Value: {} \n violationMsg: {}", violation.getInvalidValue(), violation.getMessage());
				}
				throw new ValidationException(String.format("Invalid Event!!  (%s) ", anEventJDO));
			}
		}
		
		/*public void deleteTimeline(IUserAccount aUser) {
			_pm.deletePersistent(aUser.getTimeline());
		}*/
		
	}
	
/*
 * miscelaneous stuff
 * 
 * 			
			/*try {
				eventJDO = (EventJDO)anEvent;
			} catch (ClassCastException e) {
			
			LOGGER.debug("anEvent is not of type EventJDO, so cannot cast it. Trying to create a new EventJDO using a constructor that accepts the EventTO object.  anEvent = {}", anEvent);
			try {*/
				//eventJDO = new EventJDO((EventTO)anEvent);
	
	
	/*} catch (ClassCastException e2) {
	// LOGGER.debug("Cannot cast anEvent to type EventTO either.  Have to create an EventJDO object from it; anEvent= {}", anEvent);
	// eventJDO = new EventJDO(anEvent);
	LOGGER.error("Cannot cast anEvent to type EventTO either.  Don't have another constructor for EventTO right now, so unable to create it. anEvent= {}", anEvent);
	throw new IllegalArgumentException(e2);
}
	
}

 * 	
 */
}

package friedman.tal.mfs.exceptions;

import javax.ws.rs.WebApplicationException;

public class UserAlreadyHasTimelineException extends WebApplicationException {

	public static final String DEFAULT_ERROR_MSG = "You already have a timeline.  Currently, each person can only have one timeline.";
}
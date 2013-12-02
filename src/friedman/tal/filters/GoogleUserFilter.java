package friedman.tal.filters;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

import friedman.tal.mfs.resources.ITimelineResource;
import friedman.tal.mfs.resources.IUserAccountResource;

public class GoogleUserFilter implements Filter {

	public static final String GOOGLE_NICKNAME = "googleNickname";
	public static final String GOOGLE_EMAIL = "googleEmail";
	
	private static final Logger LOGGER = LoggerFactory.getLogger(GoogleUserFilter.class);
	
	@Override
	public void destroy() {
	}

	@Override
	public void doFilter(ServletRequest servletRequest, ServletResponse response, FilterChain filterChain) 
			throws IOException, ServletException {
		
		UserService userService = UserServiceFactory.getUserService();
		// initialize these fields to empty string so that the request attributes set are not null
		String logoutURL = "";
		String email = "";
		String nickname = "";
		
		if (userService.isUserLoggedIn()) {
			logoutURL = userService.createLogoutURL("/");
			
			User user = userService.getCurrentUser();
			email = user.getEmail();			
			nickname = user.getNickname();
		}


		String loginURL = userService.createLoginURL(ITimelineResource.MY_TIMELINE_RESOURCE_URL);
		
		setIdentityAttr(servletRequest, IUserAccountResource.LOGIN_URL_ATTR_NAME, loginURL);
		setIdentityAttr(servletRequest, IUserAccountResource.LOGOUT_URL_ATTR_NAME, logoutURL);
		setIdentityAttr(servletRequest, GOOGLE_EMAIL, email);
		setIdentityAttr(servletRequest, GOOGLE_NICKNAME, nickname);
		// set nickname to be Google Nickname
		setIdentityAttr(servletRequest, IUserAccountResource.NICKNAME_ATTR_NAME, nickname);
				
		filterChain.doFilter(servletRequest, response);
	}

	private void setIdentityAttr(ServletRequest servletRequest, String paramName, String paramValue) {
		servletRequest.setAttribute(paramName, paramValue);
		LOGGER.trace("set '{}' to '{}' ", paramName, servletRequest.getAttribute(paramName));
	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {
	}

}

package friedman.tal.util;

import java.security.Principal;
import java.util.Enumeration;
import java.util.Locale;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.SecurityContext;
import javax.ws.rs.core.UriInfo;

import com.google.appengine.api.users.User;

public class StringMaker {

	private static final String DEFAULT_SEPARATOR = "\n\t";

	public static String securityContextToString(SecurityContext aSecurityContext) {
		return securityContextToString(aSecurityContext, DEFAULT_SEPARATOR);
	}
	
	public static String securityContextToString(SecurityContext aSecurityContext, String separator) {
		StringBuilder sb = new StringBuilder();
		
		if (aSecurityContext != null) {
			sb.append("{")
				.append(separator).append("className: ").append(aSecurityContext.getClass().getName())
				.append(separator).append("authenticationScheme: ").append(aSecurityContext.getAuthenticationScheme())
				.append(separator).append("userPrincipal: ").append(StringMaker.principalToString(aSecurityContext.getUserPrincipal()))
			.append("\n}");
		}
		else {
			sb.append("[null SecurityContext]");
		}
				
		return sb.toString();
	}

	public static String principalToString(Principal aPrincipal) {
		return principalToString(aPrincipal, DEFAULT_SEPARATOR);
	}
	
	public static String principalToString(Principal aPrincipal, String aSeparator) {
		StringBuilder sb = new StringBuilder();
		
		if (aPrincipal != null) {
			sb.append("{")
				.append(aSeparator).append("className: ").append(aPrincipal.getClass().getName())
				.append(aSeparator).append("name: ").append(aPrincipal.getName())
			.append("\n}");
		}
		else {
			sb.append("[null Principal]");
		}
		
		return sb.toString();
	}

	public static String uriInfoToString(UriInfo anUriInfo) {
		return uriInfoToString(anUriInfo, DEFAULT_SEPARATOR);
	}
	
	public static String uriInfoToString(UriInfo anUriInfo, String aSeparator) {
		StringBuilder sb = new StringBuilder();
		
		if (anUriInfo != null) {
			sb.append("{")
				.append(aSeparator).append("className: ").append(anUriInfo.getClass().getName())
				.append(aSeparator).append("path: ").append(anUriInfo.getPath())
				.append(aSeparator).append("path(false): ").append(anUriInfo.getPath(false))
				.append(aSeparator).append("absolutePath: ").append(anUriInfo.getAbsolutePath())
				.append(aSeparator).append("baseURI: ").append(anUriInfo.getBaseUri())
				.append(aSeparator).append("requestURI: ").append(anUriInfo.getRequestUri())
			.append("\n}");
		}
		else {
			sb.append("[null UriInfo]");
		}
		
		return sb.toString();
	}
	
	public static StringBuilder googleUserToString(User aUser) {
		return googleUserToString(aUser, DEFAULT_SEPARATOR);
	}
	
	public static StringBuilder googleUserToString(User aUser, String aSeparator) {
		StringBuilder sb = new StringBuilder();
		
		if (aUser != null) {
			sb.append("{")
				.append(aSeparator).append("classname: ").append(aUser.getClass().getName())
				.append(aSeparator).append("authDomain: ").append(aUser.getAuthDomain())
				.append(aSeparator).append("email: ").append(aUser.getEmail())
				.append(aSeparator).append("federated Identity: ").append(aUser.getFederatedIdentity())
				.append(aSeparator).append("nickname: ").append(aUser.getNickname())
				.append(aSeparator).append("userId: ").append(aUser.getUserId())
			.append("\n}");
		}
		else {
			sb.append("[null User]");
		}
		
		return sb;
	}


	public static String requestToString(HttpServletRequest request) {
		return requestToString(request, DEFAULT_SEPARATOR);
	}
	
	public static String requestToString(HttpServletRequest request, String aSeparator) {
		StringBuilder sb = new StringBuilder();
	
		sb.append("{")
			.append(aSeparator).append("classname: ").append(request.getClass().getName())
			.append(aSeparator).append("method: ").append(request.getMethod())
			.append(aSeparator).append("protocol: ").append(request.getProtocol())
			.append(aSeparator).append("scheme: ").append(request.getScheme());		
			
			sb.append(StringMaker.headersToString(request))
				
			.append(aSeparator).append("character encoding: ").append(request.getCharacterEncoding())
			.append(aSeparator).append("content length: ").append(request.getContentLength())
			.append(aSeparator).append("content type: ").append(request.getContentType())
		
			.append(aSeparator).append("query string: ").append(request.getQueryString())
			.append(aSeparator).append("requested session id: ").append(request.getRequestedSessionId())
			.append(aSeparator).append("request URI: ").append(request.getRequestURI())
			.append(aSeparator).append("request URL: ").append(request.getRequestURL())
		
			.append(aSeparator).append("path info: ").append(request.getPathInfo())
			.append(aSeparator).append("path translated: ").append(request.getPathTranslated())
		
			.append(aSeparator).append("context path: ").append(request.getContextPath())
			.append(aSeparator).append("locale: ").append(request.getLocale())
			.append(aSeparator).append("local addr: ").append(request.getLocalAddr())
			.append(aSeparator).append("local name: ").append(request.getLocalName())
			.append(aSeparator).append("local port: ").append(request.getLocalPort())
			.append(aSeparator).append("remote addr: ").append(request.getRemoteAddr())
			.append(aSeparator).append("remote host: ").append(request.getRemoteHost())
			.append(aSeparator).append("remote port: ").append(request.getRemotePort())
			.append(aSeparator).append("remote user: ").append(request.getRemoteUser())
			.append(aSeparator).append("server name: ").append(request.getServerName())
			.append(aSeparator).append("server port: ").append(request.getServerPort())
			.append(aSeparator).append("servlet path: ").append(request.getServletPath())
		
			.append(StringMaker.attributesToString(request))	
			.append(StringMaker.parametersToString(request))
			.append(StringMaker.cookiesToString(request))	
			.append(StringMaker.localesToString(request))			
		
		
			.append(aSeparator).append("session: ").append(request.getSession(false))
			.append(aSeparator).append("user principal: ").append(principalToString(request.getUserPrincipal(), aSeparator+"\t"))
			.append(aSeparator).append("auth type: ").append(request.getAuthType())
			
		.append("\n}")
		.append("\n");
		
		return sb.toString();
	}
	
	public static StringBuilder localesToString(HttpServletRequest request) {
		
		StringBuilder sb = new StringBuilder();
		@SuppressWarnings("unchecked")
		Enumeration<Locale> locales = (Enumeration<Locale>)request.getLocales();
		//Locale locale;
		sb.append(DEFAULT_SEPARATOR).append("locales: [");
		while (locales.hasMoreElements()) {
			//locale = locales.nextElement();
			sb.append(DEFAULT_SEPARATOR).append(locales.nextElement());
		}
		sb.append(DEFAULT_SEPARATOR).append("]");
		
		return sb;
	}

	public static StringBuilder cookiesToString(HttpServletRequest request) {
		StringBuilder sb = new StringBuilder();
		Cookie[] cookies = request.getCookies();
		sb.append(DEFAULT_SEPARATOR).append("cookies: [");
		if (cookies != null) {	
			for (Cookie cookie : cookies) {
				sb.append(DEFAULT_SEPARATOR).append(cookie);
			}			
		}
		sb.append(DEFAULT_SEPARATOR).append("]");
		
		return sb;
	}

	public static StringBuilder parametersToString(HttpServletRequest request) {
		StringBuilder sb = new StringBuilder();
		
		@SuppressWarnings("unchecked")
		Enumeration<String> names = (Enumeration<String>)request.getParameterNames();
		String name;
		
		sb.append(DEFAULT_SEPARATOR).append("parameters: [");
		while (names.hasMoreElements()) {
			name = names.nextElement();
			sb.append(DEFAULT_SEPARATOR).append(name).append(" = ").append(request.getParameter(name));
		}
		sb.append(DEFAULT_SEPARATOR).append("]");
		
		return sb;
	}

	public static StringBuilder attributesToString(HttpServletRequest request) {
		StringBuilder sb = new StringBuilder();
		sb.append(DEFAULT_SEPARATOR).append("attributes: [");
		
		@SuppressWarnings("unchecked")
		Enumeration<String> names = (Enumeration<String>)request.getAttributeNames();
		String name;
		while (names.hasMoreElements()) {
			name = names.nextElement();
			sb.append(DEFAULT_SEPARATOR).append(name).append(" = ").append(request.getAttribute(name));
		}
		sb.append("]");
		
		return sb;
	}

	public static StringBuilder headersToString(HttpServletRequest request) {
		StringBuilder sb = new StringBuilder();
		
		@SuppressWarnings("unchecked")
		Enumeration<String> names = (Enumeration<String>)request.getHeaderNames();
		sb.append(DEFAULT_SEPARATOR).append("headers: [");
		while (names.hasMoreElements()) {
			String name = names.nextElement();
			sb.append(DEFAULT_SEPARATOR).append(name).append(" = ").append(request.getHeader(name));
		}
		sb.append(DEFAULT_SEPARATOR).append("]");
		
		return sb;		
	}

}

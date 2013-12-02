package friedman.tal.filters;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import friedman.tal.util.StringMaker;

public class LogFilter implements Filter {

	private static final Logger LOGGER = LoggerFactory.getLogger(LogFilter.class);
	
	@Override
	public void destroy() {
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain) 
			throws IOException, ServletException {
		HttpServletRequest httpRequest = (HttpServletRequest)request;
		LOGGER.debug("request: {}", StringMaker.requestToString(httpRequest));

		filterChain.doFilter(new LogRequestWrapper(httpRequest), response);
	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {
	}

}

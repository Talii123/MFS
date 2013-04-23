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

public class PostOverrideFilter implements Filter {
	
	public static final Logger LOGGER = LoggerFactory.getLogger(PostOverrideFilter.class);

	@Override
	public void destroy() {
		// TODO Auto-generated method stub

	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		LOGGER.trace("Inside the PostOverrideFilter, I'm about to add the wrapper and continue.");
		
		chain.doFilter(new PostOverrideRequestWrapper((HttpServletRequest)request), response);
		
		LOGGER.trace("Inside the PostOverrideFilter, I'm done what I needed to do.");
	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {
		// TODO Auto-generated method stub

	}

}

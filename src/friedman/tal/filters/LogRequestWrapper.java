package friedman.tal.filters;

import java.util.Enumeration;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LogRequestWrapper extends HttpServletRequestWrapper {

	private static Logger LOGGER = LoggerFactory.getLogger(LogRequestWrapper.class);
	
	public LogRequestWrapper(HttpServletRequest aRequest) {
		super(aRequest);
	}
	
	@Override
	public Object getAttribute(String name) {
		LOGGER.info("\n\n\n\ngetAttribute({})", name);
		Object result = super.getAttribute(name);
		LOGGER.info("returns {}\n\n\n\n", result);
		return result;			
	}

	@Override
	public Enumeration getAttributeNames() {
		LOGGER.info("\n\n\n\ngetAttributeNames()");
		Enumeration result = super.getAttributeNames();
		LOGGER.info("returns {}\n\n\n\n", result);
		return result;		
	}

	@Override
	public String getParameter(String name) {
		LOGGER.info("\n\n\n\ngetParameter({})", name);
		String result =  super.getParameter(name);
		LOGGER.info("returns {}\n\n\n\n", result);
		return result;
	}

	@Override
	public Map getParameterMap() {
		LOGGER.info("\n\n\n\ngetParameterMap()");
		Map result = super.getParameterMap();
		LOGGER.info("returns {}\n\n\n\n", result);
		return result;
	}

	@Override
	public Enumeration getParameterNames() {
		LOGGER.info("\n\n\n\ngetParameterNames()");
		Enumeration result = super.getParameterNames();
		LOGGER.info("returns {}\n\n\n\n", result);
		return result;
	}

	@Override
	public String[] getParameterValues(String name) {
		LOGGER.info("\n\n\n\ngetParameterValues({})", name);
		String[] result = super.getParameterValues(name);
		LOGGER.info("returns {}\n\n\n\n", (Object[])result);
		return result; 
	}
	
	
}

package nolongerused;

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

@Path("/what")
public class WhatResource {

	public static Logger LOGGER = LoggerFactory.getLogger(WhatResource.class);
	
	@Context
	private HttpServletRequest _request;
	
	@Context
	private HttpServletResponse _response;

	// NOTE: is it wise to inject request info into constructor?   
	public WhatResource(@Context HttpServletRequest request, @Context HttpServletResponse response) {
		LOGGER.info("I just totally called a non default constructor with an HTTP Servlet request ({}) and response ({})", request, response);
		
		LOGGER.info("have fields been injected yet?  _request = {} and _response = {}", _request, _response);
		LOGGER.info("request.equals(_request)?  {}", request.equals(_request));
		LOGGER.info("response.equals(_response)?  {}", response.equals(_response));
	}

	@GET
	@Produces("text/html;charset=UTF-8") // add UTF-8 charset
	public void getWhat(@Context HttpServletRequest request, @Context HttpServletResponse response) 
			throws IOException, ServletException {
		//request.getRequestDispatcher("/WEB-INF/agreementFormsList.jsp").forward(request, response);
		
		LOGGER.info("surely fields have been injected by now!  _request = {} and _response = {}", _request, _response);
		LOGGER.info("request.equals(_request)?  {}", request.equals(_request));
		LOGGER.info("response.equals(_response)?  {}", response.equals(_response));
		LOGGER.info("and I even set the fields to be private!!! :)");

		
		request.getRequestDispatcher("/WEB-INF/agreementFormsList.jsp").include(request, response);
	}
}

package proto.notworking;

import java.io.IOException;
import java.io.OutputStream;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.StreamingOutput;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import friedman.tal.views.IView;

public class JSPStreamingOutputView implements StreamingOutput, IView {
	private final String _jspPath;
	private final HttpServletRequest _request;
	private final HttpServletResponse _response;
	
	private static final Logger LOGGER = LoggerFactory.getLogger(JSPStreamingOutputView.class);
	
	public JSPStreamingOutputView(String aJSPPath, HttpServletRequest request, HttpServletResponse response) {
		this._jspPath = aJSPPath;
		this._request = request;
		this._response = response;
	}

	@Override
	public void write(OutputStream output) throws IOException, WebApplicationException {		
		LOGGER.debug("write method of the streaming output interface called. ");
		try {
			// wrap the HttpServletResponse in an adapter that allows the JSP engine to get the ServletOutputStream or PrintWriter
			// as normal, but have the output piped to the supplied OutputStream
			this._response.setBufferSize(1024);
			LOGGER.debug("bufferSize: {}", this._response.getBufferSize());
			render(this._request, new JSPResponseWrapper(this._response, output));
			/*LOGGER.debug("2nd flush.");
			this._response.flushBuffer();*/
			LOGGER.debug("bufferSize: {}", this._response.getBufferSize());
			//output.flush();
		} catch (ServletException e) {
			e.printStackTrace();
			this._response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Sorry, but I am unable to process your request at this time.");
		}

	}

	@Override
	public void render(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {		
			request.getRequestDispatcher(this._jspPath)/*.forward(request, response); */.include(request, response);
			/*LOGGER.debug("flush.");
			response.flushBuffer();*/		
	}
	
	

}

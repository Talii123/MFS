package proto.notworking;

import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class JSPResponseWrapper extends HttpServletResponseWrapper {

	private final PrintWriterServletOutputStream out;
	
	private static final Logger LOGGER = LoggerFactory.getLogger(JSPResponseWrapper.class);
	
	public JSPResponseWrapper(HttpServletResponse response, OutputStream anOutstream) {
		super(response);
		this.out = new PrintWriterServletOutputStream(anOutstream);
	}

	@Override
	public PrintWriter getWriter() throws IOException {
		LOGGER.debug("using PrintWriter, not ServletOutputStream");	
		//flushBuffer();
		return out.getPrintWriter();
	}

	@Override
	public ServletOutputStream getOutputStream() throws IOException {
		LOGGER.debug("using ServletOutputStream, not PrintWriter");
		//flushBuffer();
		return out;
	}

	@Override
	public void flushBuffer() throws IOException {
		LOGGER.debug("super.flushBuffer");
		//super.flushBuffer();
		LOGGER.debug("out.flush()");
		out.flush();
	}

	

}


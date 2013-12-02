package nolongerused;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DummyResponseWrapper extends HttpServletResponseWrapper {

	public static final Logger LOGGER = LoggerFactory.getLogger(DummyResponseWrapper.class);
	
	public DummyResponseWrapper(HttpServletResponse response) {
		super(response);
	}

	@Override
	public PrintWriter getWriter() throws IOException {
		System.out.println("\n\n\n\nLook Tal!! - I got called!!!\n\n\n");
		return super.getWriter();
	}

	
}

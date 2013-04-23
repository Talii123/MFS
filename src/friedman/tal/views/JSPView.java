package friedman.tal.views;

import java.io.IOException;
import java.io.OutputStream;
import java.lang.annotation.Annotation;
import java.lang.reflect.Type;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;

public class JSPView implements IView {
	
	private final String _jspPath;
	private  HttpServletRequest _request;
	private  HttpServletResponse _response;
	
	public JSPView(String aJSPPath) {
		this._jspPath = aJSPPath;
	}
	
	public void setRequestAndResponse(HttpServletRequest request, HttpServletResponse response) {
		this._request = request;
		this._response = response;
	}


	@Override
	public void render(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.getRequestDispatcher(this._jspPath).include(request, response);
		response.flushBuffer();
	}
	
	public void render() throws ServletException, IOException {
		render(this._request, this._response);
	}

	public void writeTo(Class<?> type, 
			Type genericType,
			Annotation[] annotations, 
			MediaType mediaType,
			MultivaluedMap<String, Object> httpHeaders,
			OutputStream entityStream) 
					throws ServletException, IOException {
		
		this.render();
	}

	
}

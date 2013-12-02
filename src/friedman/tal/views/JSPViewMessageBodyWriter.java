package friedman.tal.views;

import java.io.IOException;
import java.io.OutputStream;
import java.lang.annotation.Annotation;
import java.lang.reflect.Type;

import javax.servlet.ServletException;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.ext.MessageBodyWriter;
import javax.ws.rs.ext.Provider;

@Provider
@Produces("text/html")
public class JSPViewMessageBodyWriter implements MessageBodyWriter<JSPView> {

	@Override
	public boolean isWriteable(Class<?> toMarshallType, Type genericType, Annotation[] annotations, MediaType mediaType) {
		try {
			toMarshallType.asSubclass(JSPView.class);	
			return true;
		} catch (ClassCastException e) {
			return false;
		}
	}

	@Override
	public long getSize(JSPView t, Class<?> type, Type genericType, Annotation[] annotations, MediaType mediaType) {
		return -2;
	}

	@Override
	public void writeTo(JSPView t, 
			Class<?> type, 
			Type genericType,
			Annotation[] annotations, 
			MediaType mediaType,
			MultivaluedMap<String, Object> httpHeaders,
			OutputStream entityStream) 
					throws IOException, WebApplicationException {
		try {
			t.writeTo(type, genericType, annotations, mediaType, httpHeaders, entityStream); 	
		} catch (ServletException e) {
			e.printStackTrace();
			throw new WebApplicationException(e);
		}
		
	}
	
}

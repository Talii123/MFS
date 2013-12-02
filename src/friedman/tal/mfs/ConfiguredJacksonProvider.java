package friedman.tal.mfs;

import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.ext.ContextResolver;
import javax.ws.rs.ext.Provider;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.DeserializationConfig;
import org.codehaus.jackson.map.SerializationConfig;

import org.jboss.resteasy.plugins.providers.jackson.ResteasyJacksonProvider;

import friedman.tal.util.SavePropsDeserializationProblemHandler;


// Customized {@code ContextResolver} implementation to pass ObjectMapper to use
@Provider
@Produces(MediaType.APPLICATION_JSON)
public class ConfiguredJacksonProvider extends ResteasyJacksonProvider implements ContextResolver<ObjectMapper> {

	private ObjectMapper objectMapper;

    public ConfiguredJacksonProvider() {
        this.objectMapper = new ObjectMapper().configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        // this appears to be dangerous; for null objects, it returns a LinkedHashMap, which will likely result in a ClassCastException downstream
        //this.objectMapper.configure(SerializationConfig.Feature.FAIL_ON_EMPTY_BEANS, false);
        this.objectMapper.getDeserializationConfig().addHandler(new SavePropsDeserializationProblemHandler());
    }
    public ObjectMapper getContext(Class<?> objectType) {
        return objectMapper;
    }
}

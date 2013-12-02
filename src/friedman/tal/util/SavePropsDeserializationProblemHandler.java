package friedman.tal.util;

import java.io.IOException;

import org.codehaus.jackson.JsonParser;
import org.codehaus.jackson.JsonProcessingException;
import org.codehaus.jackson.map.DeserializationContext;
import org.codehaus.jackson.map.DeserializationProblemHandler;
import org.codehaus.jackson.map.JsonDeserializer;

public class SavePropsDeserializationProblemHandler extends
		DeserializationProblemHandler {
	
	public static class UnhandledProperty {
		public final String _propertyName;
		
		/*private final long _startIndex;
		
		private final long _endIndex;*/
		
		public final String _propertyValue;
		
		//private final Object _beanOrClass;
		
		private UnhandledProperty(String aPropertyName, String aPropertyValue  /*long startIndex, long endIndex, Object aBeanOrClass*/) {
			this._propertyName = aPropertyName;
			this._propertyValue = aPropertyValue;
			/*this._startIndex = startIndex;
			this._endIndex = endIndex;
			this._beanOrClass = aBeanOrClass;*/
		}

		@Override
		public boolean equals(Object other) {
			if (this == other) return true;
			if (!(other instanceof UnhandledProperty)) return false;
			
			UnhandledProperty otherUnhandledProperty = (UnhandledProperty)other;
			return (this._propertyName == otherUnhandledProperty._propertyName || (this._propertyName != null && this._propertyName.equals(otherUnhandledProperty._propertyName))) &&
					(this._propertyValue == otherUnhandledProperty._propertyValue || (this._propertyValue != null && this._propertyValue.equals(otherUnhandledProperty._propertyValue)));
		}

		@Override
		public int hashCode() {
			int result = 17;
			result = 31 * result + this._propertyName.hashCode();
			result = 31 * result + this._propertyValue.hashCode();
			return result;
		}

		@Override
		public String toString() {
			return "UnhandledProperty(propertyName = " + (this._propertyName != null ? this._propertyName : "[null]") +
					", propertyValue = " + (this._propertyValue != null ? this._propertyValue : "[null]");
		}
		
		
	}

	@Override
	public boolean handleUnknownProperty(DeserializationContext ctxt,
			JsonDeserializer<?> deserializer, Object beanOrClass,
			String propertyName) throws IOException, JsonProcessingException {
		
		try {
			JsonParser parser = ctxt.getParser();
			/*long startIndex = parser.getCurrentLocation().getCharOffset();
			parser.skipChildren();
			long endIndex = parser.getCurrentLocation().getCharOffset();*/
			String propertyValue = parser.getText();
			((IDeserializationProblemHandler)beanOrClass).addUnhandledProperty(//new UnhandledProperty(propertyName, startIndex, endIndex));
					new UnhandledProperty(propertyName, propertyValue));
			return true;
		} catch (ClassCastException e) {
			return false;
		}
	}
	
}

package nolongerused;

import java.util.List;
import java.util.Set;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;

import com.google.appengine.api.datastore.KeyFactory;

public class OldTypedKey<E> {

	private OldTypedKey() {
		throw new AssertionError("Typed Key cannot be instantiated.");
	}
	
	public static final class KeyField<T> {
		private Class<T> _fieldClass;
		private String _fieldName;
		private T _fieldValue;
		
		public KeyField(Class<T> fieldClass, String fieldName, T fieldValue) {
			this._fieldClass = fieldClass;
			this._fieldName = fieldName;
			this._fieldValue = fieldValue;
		}
		
		/*public KeyField(Class<T> fieldClass, String fieldName, T fieldValue) {
			this(fieldClass, fieldName);
			setValue(fieldValue);
		}
		
		public void setValue(T aValue) {
			this._fieldValue = aValue;
		}*/
	}
	
	public static class ObjectTypedKey<E>  {
		private final List<KeyField<?>> _keyFields;

		public ObjectTypedKey (List<KeyField<?>> keyFields) {
			this._keyFields = keyFields;
		}
		
		/*public E getObject() {
			//KeyFactory factory = KeyFactory.
			
		}*/
	}
	
	public static final class QueryTypedKey<E> {
		private static final String SEPARATOR = "&& ";
		private final List<KeyField<?>> _keyFields;
		private final Class<E> _elementClass;
		
		public QueryTypedKey (List<KeyField<?>> keyFields, Class<E> elementClass) {
			this._keyFields = keyFields;
			this._elementClass = elementClass;
		}
		
		/*public E getObject() {
			PersistenceManager pm = PMF.get().getPersistenceManager();
			StringBuilder filterSB = new StringBuilder();
			StringBuilder paramSB = new StringBuilder();
			String paramName;
			//String[] constraints = new String[this._keyFields.size()];
			//byte index = 0;
			try {
				Query query =  pm.newQuery(this._elementClass);
				for (KeyField<?> keyField : this._keyFields) {
					//constraints[index++] = keyField._fieldName + " == " + keyField._fieldValue;
					paramName = keyField._fieldName + "Param";
					filterSB.append(SEPARATOR+ keyField._fieldName + " == " + paramName);
					paramSB.append(SEPARATOR+ keyField._fieldClass.getSimpleName() + " " + paramName);
				}
				query.setFilter(filterSB.substring(SEPARATOR.length()));
				query.declareParameters(paramSB.substring(SEPARATOR.length()));
				query.ex
			}
		}*/
	}
}

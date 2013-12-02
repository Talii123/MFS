package friedman.tal.jdo;

import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;

public enum GAEJKeyType {
	LONG(Long.class), STRING(String.class), KEY(Key.class), KEY_STRING(String.class);
	
	private GAEJKeyType(Class<?> aClass) {
		this._class = aClass;
	}
	private final Class<?> _class;
	
	public Class<?> getKeyClass() {
		return this._class;
	}
	
	public static KeyFactory.Builder getBuilderWithParent(TypedKey<?, ?> aParentKey) {
		String parentKind = aParentKey.getObjectClass().getSimpleName();
		GAEJKeyType parentKeyType = aParentKey.getKeyClass();
		KeyFactory.Builder builder;

		switch (parentKeyType) {
			case KEY:
				builder = new KeyFactory.Builder((Key)aParentKey.getKeyValue());
				break;
				
			case KEY_STRING:
				builder = new KeyFactory.Builder(KeyFactory.stringToKey((String)aParentKey.getKeyValue()));
				break;
				
			case STRING:
				builder = new KeyFactory.Builder(parentKind, (String)aParentKey.getKeyValue());
				break;
				
			case LONG:
				builder = new KeyFactory.Builder(parentKind, (Long)aParentKey.getKeyValue());
				break;
				
			default:
				throw new IllegalArgumentException(String.format("Unknown GAEJ key type: %s", parentKeyType));				
		}
		
		return builder;
	}
	
	public static Key getKeyValueOf(Class<?> anEntityType, String anEntityName, TypedKey<?, ?> aParentKey) {
		KeyFactory.Builder builder = getBuilderWithParent(aParentKey);
		builder.addChild(anEntityType.getSimpleName(), anEntityName);
		
		return builder.getKey();
	}
	
	public static Key getKeyValueOf(Class<?> anEntityType, Long anEntityID, TypedKey<?, ?> aParentKey) {
		KeyFactory.Builder builder = getBuilderWithParent(aParentKey);
		builder.addChild(anEntityType.getSimpleName(), anEntityID);

		return builder.getKey();		
	}	
	
	public static String getEncodedKeyValueOf(Class<?> anEntityType, String anEntityName, TypedKey<?, ?> aParentKey) {
		return KeyFactory.keyToString(getKeyValueOf(anEntityType, anEntityName, aParentKey)); 
	}
	
	public static String getEncodedKeyValueOf(Class<?> anEntityType, Long anEntityID, TypedKey<?, ?> aParentKey) {
		return KeyFactory.keyToString(getKeyValueOf(anEntityType, anEntityID, aParentKey)); 
	}
	
	
}

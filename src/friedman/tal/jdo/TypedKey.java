package friedman.tal.jdo;

import java.io.Serializable;
import java.util.EnumSet;
import java.util.Set;

import javax.jdo.annotations.NotPersistent;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;


@PersistenceCapable
public class TypedKey<T, K> {

	// do you need "NotPersistent" annotations on static fields?
	@NotPersistent
	//private static final Set<Class<?>> kClasses;
	private static final Set<GAEJKeyType> kClasses;
	
	@NotPersistent
	private static final Logger LOGGER;
	
	static {
		LOGGER = LoggerFactory.getLogger(TypedKey.class);
		
		/*kClasses = Utils.newSet();
		for (GAEJKeyType keyType : GAEJKeyType.values()) {
			Class<?> keyTypeClass = keyType.getKeyClass();
			LOGGER.debug("\n keyTypeClass: {} \n", keyTypeClass);
			if (!(kClasses.contains(keyTypeClass))) {
				kClasses.add(keyTypeClass);
			}
		}	*/
		
		kClasses = EnumSet.allOf(GAEJKeyType.class);
	}
	
	@Persistent
	// can't be 'final' if it's persistent; make it pseudo final by not providing mutators
	// private final Class<T> _objectType;
	private Class<T> _objectType;
	
	/*@NotPersistent
	// can't be 'final' if it's persistent	; make it pseudo final by not providing mutators
	// private final Class<K> _keyType;
	private Class<K> _keyType;*/
	
	@Persistent
	private GAEJKeyType _keyType;
	
	//@PrimaryKey
    @Persistent
    //@Extension(vendorName="datanucleus", key="gae.pk-name", value="true")
	private String _keyValueString;
	
	/*
	// need to serialize this value to allow it to be parametric; JDO on GAEJ does not support polymorphism or type parameters
	@Persistent(serialized = "true")
	private K _keyValue;*/
	
	


	private void setKeyValue(K aKeyValue, GAEJKeyType aKeyType) {
		switch(aKeyType) {
			case KEY_STRING:
			case STRING:
				this._keyValueString = (String)aKeyValue;
				break;
				
			case LONG:
				this._keyValueString = ((Long)aKeyValue).toString();
				break;
				
			case KEY:
				this._keyValueString = KeyFactory.keyToString((Key)aKeyValue);
				break;
				
			default:
				throw new IllegalArgumentException(String.format("Unsupported key type: %s", aKeyType));
		}
		
		this._keyType = aKeyType;
	}
	
	public K getKeyValue() {
		switch (this._keyType) {
			case KEY_STRING:
			case STRING:
					return (K) this._keyValueString;
					
			case KEY:
					return (K) KeyFactory.stringToKey(this._keyValueString);
					
			case LONG:
					return (K) Long.valueOf(this._keyValueString);
				
			default:
				// should never happen!!
				throw new IllegalArgumentException(String.format("Unsupported key type: %s", this._keyType));
		}
	}
	
	private TypedKey(Class<T> anObjectType, K aKeyValue, GAEJKeyType aKeyType) {
		checkValidKeyType(aKeyValue, aKeyType);
		checkValidKey(aKeyValue, aKeyType);
		
		this._objectType = anObjectType;
		//this._keyType = aKeyType;
		//this._keyValue = aKeyValue;
		setKeyValue(aKeyValue, aKeyType);
	}
	


	public static <T> TypedKey<T, String> createEncoded(Class<T> aChildObjectType, String aChildKeyName, TypedKey<?, ?> aParentKey) {
		return new TypedKey<T, String>(aChildObjectType, GAEJKeyType.getEncodedKeyValueOf(aChildObjectType, aChildKeyName, aParentKey) , GAEJKeyType.KEY_STRING);		
	}

	public static <T> TypedKey<T, String> createEncoded(Class<T> aChildObjectType, Long aChildKeyID, TypedKey<?, ?> aParentKey) {
		return new TypedKey<T, String>(aChildObjectType, GAEJKeyType.getEncodedKeyValueOf(aChildObjectType, aChildKeyID, aParentKey) , GAEJKeyType.KEY_STRING);		
	}

	public static <T> TypedKey<T, Key> createUnencoded(Class<T> aChildObjectType, String aChildKeyName, TypedKey<?, ?> aParentKey, boolean doEncodeResultingKey) {
		return new TypedKey<T, Key>(aChildObjectType, GAEJKeyType.getKeyValueOf(aChildObjectType, aChildKeyName, aParentKey), GAEJKeyType.KEY);
	}	
	
	public static <T> TypedKey<T, Key> createUnencoded(Class<T> aChildObjectType, Long aChildKeyID, TypedKey<?, ?> aParentKey, boolean doEncodeResultingKey) {
		return new TypedKey<T, Key>(aChildObjectType, GAEJKeyType.getKeyValueOf(aChildObjectType, aChildKeyID, aParentKey), GAEJKeyType.KEY);
	}	
	
	/*
	 
	public static <T> TypedKey<T, ?> create(Class<T> aChildObjectType, String aChildKeyName, TypedKey<?, ?> aParentKey, boolean doEncodeResultingKey) {
		if (doEncodeResultingKey) {
			return new TypedKey<T, String>(aChildObjectType, GAEJKeyType.getEncodedKeyValueOf(aChildObjectType, aChildKeyName, aParentKey) , GAEJKeyType.KEY_STRING);
		}
		else {
			return new TypedKey<T, Key>(aChildObjectType, GAEJKeyType.getKeyValueOf(aChildObjectType, aChildKeyName, aParentKey), GAEJKeyType.KEY);
		}			
	} 
	 
	public static <T> TypedKey<T, ?> create(Class<T> aChildObjectType, Long aChildKeyID, TypedKey<?, ?> aParentKey, boolean doEncodeResultingKey) {
		if (doEncodeResultingKey) {
			return new TypedKey<T, String>(aChildObjectType, GAEJKeyType.getEncodedKeyValueOf(aChildObjectType, aChildKeyID, aParentKey) , GAEJKeyType.KEY_STRING);
		}
		else {
			return new TypedKey<T, Key>(aChildObjectType, GAEJKeyType.getKeyValueOf(aChildObjectType, aChildKeyID, aParentKey), GAEJKeyType.KEY);
		}			
	}	
	
	@SuppressWarnings("unchecked")
	private <T, K extends String> TypedKey<T, K>(Class<T> aChildObjectType, K aChildKeyValue, GAEJKeyType aChildKeyType, TypedKey<?, ?> aParentKey, boolean isEncoded) {
		checkValidKeyType(aChildKeyValue, aChildKeyType);
		checkValidKey(aChildKeyValue, aChildKeyType);
		
		this._objectType = aChildObjectType;
		
		Class<?> keyClass = aChildKeyValue.getClass();
		if (String.class.equals(keyClass)) {
			if (isEncoded) {
				this._keyType = GAEJKeyType.KEY_STRING;
				this._keyValue = (K) GAEJKeyType.getEncodedKeyValueOf(this._objectType, (String)aChildKeyValue, aParentKey);
			}
			else {
				this._keyType = GAEJKeyType.KEY;
				this._keyValue = (K) GAEJKeyType.getKeyValueOf(this._objectType, (String)aChildKeyValue, aParentKey);
			}			
		}
		else if (Long.class.equals(keyClass)) {
			if (isEncoded) {
				this._keyType = GAEJKeyType.KEY_STRING;
				this._keyValue = (K) GAEJKeyType.getEncodedKeyValueOf(this._objectType, (Long)aChildKeyValue, aParentKey);
			}
			else {
				this._keyType = GAEJKeyType.KEY;
				this._keyValue = (K) GAEJKeyType.getKeyValueOf(this._objectType, (Long)aChildKeyValue, aParentKey);
			}
		}
		else {
			throw new IllegalArgumentException();
		}
	}	*/
	
	
	public  static <T, K extends Serializable> TypedKey<T, K> create(Class<T> anObjectClass, K aKeyValue, GAEJKeyType aKeyType) {
		return new TypedKey<T, K>(anObjectClass, aKeyValue, aKeyType);
	}	
	
	
	private void checkValidKeyType(K aKeyValue, GAEJKeyType aKeyType) {
		//Class<?> keyClass = aKeyValue.getClass();
		
		if (!kClasses.contains(aKeyType /*keyClass*/)) {
			LOGGER.debug("keyClass: {},  kClasses: {}", aKeyType, kClasses);
			throw new IllegalArgumentException(String.format("%s is not a supported key class.", aKeyType));
		}
	}
	
	private void checkValidKey(K aKeyValue, GAEJKeyType aKeyType) {
		Class<?> keyValueClass = aKeyValue.getClass();
		// using .equals() for class comparison, as per this:
		//		http://stackoverflow.com/questions/3738919/does-java-guarantee-that-object-getclass-object-getclass
		// using == for enum comparison, as per this: 
		//		http://stackoverflow.com/questions/1750435/comparing-java-enum-members-or-equals
		if (((aKeyType == GAEJKeyType.KEY_STRING || aKeyType == GAEJKeyType.STRING) && String.class.equals(keyValueClass)) ||
				(aKeyType == GAEJKeyType.LONG && Long.class.equals(keyValueClass)) || 
				(aKeyType == GAEJKeyType.KEY && Key.class.equals(keyValueClass))) {
			// valid
			return;
		}
		
		throw new IllegalArgumentException(String.format("key: {} is not valid for key type: {}", aKeyValue, aKeyType));
		
	}	

	
	//@SuppressWarnings("unchecked")
	//public Class<K> getKeyClass() {
	public GAEJKeyType getKeyClass() {
		/*if (this._keyType == null) {
			assert(this._keyValue != null);		// can you have a TypedKey without a keyValue?
			this._keyType = (Class<K>) this._keyValue.getClass();
		}
		return this._keyType;*/
		return this._keyType;
	}
	
	public Class<T> getObjectClass() {
		return this._objectType;
	}
	
	/*public K getKeyValue() {
		return this._keyValue;
	}
	
	/*public void setKeyValue(K aKeyValue) {
		this._keyValue = aKeyValue;
	}*/

	@Override
	public boolean equals(Object other) {
		if (other == this) return true;
		if (!(other instanceof TypedKey)) return false;
		TypedKey<?, ?> otherTypedKey = (TypedKey<?, ?>)other;
		return (this.getKeyValue() == otherTypedKey.getKeyValue() || (this.getKeyValue() != null && this.getKeyValue().equals(otherTypedKey.getKeyValue()))) &&
				(this._objectType == otherTypedKey._objectType || (this._objectType != null && this._objectType.equals(otherTypedKey._objectType))) &&
				(this._keyType == otherTypedKey._keyType || (this._keyType != null && this._keyType.equals(otherTypedKey._keyType)));
	}

	@Override
	public int hashCode() {
		int result = 17;
		
		result = result * 31 + (this.getKeyValue() != null ? this.getKeyValue().hashCode() : 0);
		result = result * 31 + (this._objectType != null ? this._objectType.hashCode() : 0);
		result = result * 31 + (this._keyType != null ? this._keyType.hashCode() : 0);
		
		return result;
	}

	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		
		sb.append("{")
			.append("\n \t").append("classname: ").append(this.getClass().getName())
			.append("\n \t").append("_objectType: ").append(this._objectType != null ? this._objectType.toString() : "[null]")		
			.append("\n \t").append("_keyType: ").append(this._keyType != null ? this._keyType.toString() /*this._keyType.getName()*/ : "[null]")
			.append("\n \t").append("_keyValue: ").append(this.getKeyValue() != null ? this.getKeyValue().toString() : "[null]")
			.append("\n")
		.append("}");
		
		return sb.toString();
	}


}

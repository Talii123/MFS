package friedman.tal.jdo;

import javax.jdo.annotations.PersistenceCapable;


@PersistenceCapable
public interface IJDO<K> {

	public static final String JDO_PROPERTY_DELIMITER = ", \n\t";
	public static final String JDO_STR_START_TOKEN = "{";
	public static final String JDO_STR_END_TOKEN = "}";

	/*public Key getKey();

	Key createKey(T simpleKeyValue);*/
	
	public Class<K> getKeyType();
}

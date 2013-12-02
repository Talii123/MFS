package nolongerused;

import javax.jdo.annotations.Inheritance;
import javax.jdo.annotations.InheritanceStrategy;
import javax.jdo.annotations.PrimaryKey;

import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;

@Inheritance(strategy = InheritanceStrategy.SUBCLASS_TABLE)
public abstract class UnencodedStringKeyJDO /*extends AbstractJDO<String> /*implements IJDO<String>*/ {
	
	@PrimaryKey
	private String _name;
	
	public UnencodedStringKeyJDO(String aName) {
		this._name = aName;
	}
	
	/*@Override
	public String getKey() {
		return this._name;
	}*/

	//@Override
	public Key getKey() {
		return KeyFactory.createKey(this.getClass().getSimpleName(), this._name);
	}		
	
	//@Override
	public Key createKey(String simpleKeyValue) {
		return KeyFactory.createKey(this.getClass().getSimpleName(), simpleKeyValue);
	}

	
//	public <E> EntityRef<E> createRef() {
//		Class<?> entityClass = this.getClass();
//		Key key = KeyFactory.createKey(entityClass.getSimpleName(), getKey());
//		return new EntityRef<E>(entityClass, key);
//	}	
	
}

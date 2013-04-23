package nolongerused;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.Inheritance;
import javax.jdo.annotations.InheritanceStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;

@PersistenceCapable
@Inheritance(strategy = InheritanceStrategy.SUBCLASS_TABLE)
public abstract class LongKeyJDO /*extends AbstractJDO<Long> /*implements IJDO<Long>*/ {

	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	private Long _ID;
	
	/*@Override
	public Long getKey() {
		return _ID;
	}*/
	
	//@Override
	public Key getKey() {
		return KeyFactory.createKey(this.getClass().getSimpleName(), this._ID);
	}

	//@Override
	public Key createKey(Long simpleKeyValue) {
		return KeyFactory.createKey(this.getClass().getSimpleName(), simpleKeyValue);
	}

	
	
}

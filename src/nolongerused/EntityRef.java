package nolongerused;

import javax.jdo.PersistenceManager;

import com.google.appengine.api.datastore.Key;

import friedman.tal.util.PMF;

public class EntityRef<E /*extends AbstractJDO<?>*/> {
	private Key _key;
	private E _entity;
	
	public EntityRef(E anEntity) {
		this._entity = anEntity;
	}

	/*public EntityRef(E) {
		this._entity
	}
	
	@SuppressWarnings("unchecked")
	public T getEntity() {
		PersistenceManager pm = PMF.get().getPersistenceManager();
		T entity = null;
		try {			
			entity = pm.detachCopy((T) pm.getObjectById(this._type.getClass(), this._key));
		} finally {
			pm.close();
		}
		return entity;
	}
	
	@SuppressWarnings("unchecked")
	public T getEntity(PersistenceManager pm) {
		return (T) pm.getObjectById(this._type.getClass(), this._key);
	}*/
}

package proto.test;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;

public class QueryBuilder {
	private Class<?> _entityClass;
	private String _filter;
	
	
	public QueryBuilder(Class<?> queryClass) {
		this._entityClass = queryClass;
	}
	
	/*public Query build(PersistenceManager pm) {
		return pm.newQuery(this._entityClass).setFilter(this._filter)
	}*/
}

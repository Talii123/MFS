package proto.test;

import java.util.List;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import friedman.tal.util.Utils;

public class BaseTestResource {

	public Logger LOGGER = LoggerFactory.getLogger(getClass());
	
	@SuppressWarnings("unchecked")
	protected <T /*extends LongJDO*/> List<T> findObjsWithValue(Class<T> objectClass,
			String value, PersistenceManager pm) {
				Query q = pm.newQuery(objectClass);
				q.setFilter("_field == fieldValueParam");
				q.declareParameters("String fieldValueParam");
				return (List<T>) q.execute(value);
			}

	protected List<?> findObjsWithValue(Class<ParentJDO> parentClass, String parentValue, String value,
			PersistenceManager pm) {
			
				List<?> results;
				List<? extends ParentJDO> parents = findObjsWithValue(parentClass, parentValue, pm);
				if (value == null || value.trim().equals("")) {
					results = parents;
				}
				else {
					List<EncodedStringJDO> children = Utils.newList();
					results = children;
					for (ParentJDO parent : parents) {
						EncodedStringJDO child = parent.getChild();
						if (child != null) {
							String childValue = Utils.getValueOrEmptyString(child.getValue());
							if (childValue.equals(value)) {
								children.add(child);
							}
						}
						else {
							LOGGER.debug("child is null for parent: {}", parent);
						}
					}
				}
				
				return results;
			}

	@SuppressWarnings("unchecked")
	protected <T extends ParentJDO> T createChildValueObject(Class<T> parentObjectClass,
			String parentValue, String value, PersistenceManager pm) {
				T parent;
				List<T> resultsList = findObjsWithValue(parentObjectClass, parentValue, pm);
				if (resultsList.size() == 0) {
					LOGGER.debug("parent does not exist, so need to create one");
					
					parent = (T) new ParentJDO(parentValue, value);
					pm.makePersistent(parent);
				}
				else {
					parent = resultsList.get(0);
					pm.deletePersistent(parent.getChild());
					parent.setChild(new EncodedStringJDO(value));			
				}		
				return parent;
			}

}

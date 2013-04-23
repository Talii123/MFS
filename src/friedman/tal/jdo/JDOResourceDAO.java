package friedman.tal.jdo;

import friedman.tal.resources.IResourceDAOContext;
import friedman.tal.resources.ResourceDAO;

public class JDOResourceDAO<T extends IJDO<?>> extends ResourceDAO<T>{

	protected JDOResourceDAO(Class<T> aDBClass, IResourceDAOContext aDAOContext) {
		super(aDBClass, aDAOContext);
	}
}

package friedman.tal.resources;

import java.lang.reflect.Constructor;
import java.security.Principal;

import javax.jdo.JDOObjectNotFoundException;
import javax.jdo.PersistenceManager;
import javax.jdo.Transaction;
import javax.ws.rs.core.SecurityContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import friedman.tal.IGlobalTrxnSupport;
import friedman.tal.jdo.GlobalTrxnSupport;
import friedman.tal.jdo.TypedKey;
import friedman.tal.jdo.UniqueID;
import friedman.tal.mfs.users.IUserAccount;
import friedman.tal.mfs.users.IUserInfo;
import friedman.tal.mfs.users.UserAccountJDO;
import friedman.tal.util.GUIDMaker;
import friedman.tal.util.Utils;


public abstract class ResourceDAO<T /*extends IJDO<?>*/> implements IGlobalTrxnSupport {
	public static final Logger LOGGER = LoggerFactory.getLogger(ResourceDAO.class);
	protected final Logger _logger = LoggerFactory.getLogger(this.getClass());
	
	protected final Class<T> _theDBClass;
	protected final PersistenceManager _pm;
	protected final SecurityContext _sc;
	protected final IResourceDAOContext _rdc;
		
	private final IGlobalTrxnSupport _localTrxSupport;
	
	private IUserAccount _userAccount;
	private IUserInfo _userInfo;
	
	protected ResourceDAO(Class<T> aDBClass, IResourceDAOContext aDAOContext) {
		this._theDBClass = aDBClass;
		this._rdc = aDAOContext;
		this._pm = aDAOContext.getPM();
		this._sc = aDAOContext.getSecurityContext();
		
		this._userAccount = aDAOContext.getUserAccount();
		this._userInfo = aDAOContext.getUserInfo();
		
		this._localTrxSupport = new GlobalTrxnSupport(this._pm, _logger);
	}

	/*@SuppressWarnings("unchecked")
	public T getResource(Key resourceKey) {		
		try {
			return (T) this._pm.getObjectById(resourceKey);
		} finally {
			this._pm.close();
		}		
	}*/
	
	protected T getResourceByKey(TypedKey<T, ?> aResourceKey) {
		T resource = null;
		
		this.initIfLocalTrxn();

		try {
			_logger.debug("Trying to fetch object with key: ({}) ", aResourceKey);
			resource = this._pm.getObjectById(aResourceKey.getObjectClass(), aResourceKey.getKeyValue());
			this.commitIfLocalTrxn();
		} catch (JDOObjectNotFoundException jdoe) {
			//this.exceptionThrown(jdoe);
			_logger.debug("Caught an object not found exception.  Returning null instead");
			resource = null;
		} 
		finally {
			this.cleanupIfLocalTrxn();
		}

		return resource;
	}
	
	
	// should be able to parameterize by KeyType no?  only want there to exist a version of this method that fits the key type for the JDO
	/*protected T getResourceByKey(Long aLongResourceKey) {
		return getResourceByKey(TypedKey.createTypedKey(_theDBClass, aLongResourceKey));
	}*/
	
	// we're using 'U' rather than 'T' here to allow resources to create UniqueID's of an arbitrary type.  If we used T, the Unique ID would have to be of the same type
	// as the data objects returned by this resource DAO
	// should this be static?  Don't like having to pass in the Persistance Manager, but it seems wasteful to have the same exact method on every DAO 
	protected static <U extends UniqueID> U makeUniqueID(Class<U> uniqueClass, String anID, PersistenceManager pm) {
		U newUniqueID;
		final String className = uniqueClass.getName();
		LOGGER.debug("raw input: anID = {}", anID);
		anID = (anID != null) ? anID.trim() : "";
		if (anID.length() <= 0) {
			Long uniqueLong = GUIDMaker.getUniqueLong().longValue();
			anID = String.valueOf(Long.signum(uniqueLong) < 0 ? -uniqueLong : uniqueLong);
		}
		LOGGER.debug("after cleansing: anID = {}", anID);
		
		
		try {			
			U existingID = ResourceDAO.lookupByUniqueID(uniqueClass, anID, pm);
			LOGGER.info("UniqueID of class: '{}' with key: '{}' already exists, so a new one is needed.  Existing object: '{}' ", className, anID, existingID);
			throw new IllegalArgumentException(String.format("UniqueID of class: '%s' with key: '%s' is already in use.  Existing object: '%s' ", className, anID, existingID));
		} catch (JDOObjectNotFoundException jdoe) {
			//newUniqueID = uniqueClass.newInstance();
			try {
				Constructor<U> stringConstructor = uniqueClass.getConstructor(String.class);
				newUniqueID = stringConstructor.newInstance(anID);
				pm.makePersistent(newUniqueID);					
			} catch (Exception e) {
				// above reflection can throw a lot of exceptions, including: SecurityException, NoSuchMethodException, IllegalArgumentException, InstantiationException, IllegalAccessException, InvocationTargetException
				
				LOGGER.error("Unable to create new unique ID of type: {} ", className);
				throw new IllegalArgumentException(String.format("Unable to create new unique ID of type: %s ", className));					
			}
		}
		
		LOGGER.debug("returning new UniqueID of class: {} with value: {} ", className,  newUniqueID);
		return newUniqueID;
	}
	
	protected static <U extends UniqueID> U lookupByUniqueID(Class<U> uniqueClass, String anUniqueID, PersistenceManager pm) 
			throws JDOObjectNotFoundException {
		return pm.getObjectById(uniqueClass, anUniqueID);
	}
	
	
/*	protected List<T> findResources(/*QuerySpec<T> aQuerySpec,*//* Object aQueryValue) {		
		Query query = this._pm.newQuery(this._theDBClass);
//		if (aQuerySpec.hasFilter()) {
//			query.setFilter(aQuerySpec.getFilter());
//		/*
//		 * if the query has a filter, it must have parameters; if it doesn't have a filter, it doesn't need parameters
//		 * }
//		if (aQuerySpec.hasParameters()) {*/
//			query.declareParameters(aQuerySpec.getParameters());
//		}
//		if (aQuerySpec.hasOrdering()) {
//			query.setOrdering(aQuerySpec.getOrdering());
//		}
//		if (aQuerySpec.hasRange()) {
//			query.setRange(aQuerySpec.getRange());
//		}		
	/*
		return (List<T>)query.execute(aQueryValue);		
	}*/
	/*public EntityRef<T> createRef(T entity) {
		return new EntityRef<T>(entity, entity.getKey());
	}	*/

	@Override
	public Transaction initIfLocalTrxn() {
		return this._localTrxSupport.initIfLocalTrxn();
	}

	@Override
	public void exceptionThrown(Exception anException) throws Exception{
		this._localTrxSupport.exceptionThrown(anException);
	}
	
	@Override
	public boolean isLocalTrxn() {
		return this._localTrxSupport.isLocalTrxn();
	}

	@Override
	public void commitIfLocalTrxn() {
		this._localTrxSupport.commitIfLocalTrxn();
	}

	@Override
	public void cleanupIfLocalTrxn() {
		this._localTrxSupport.cleanupIfLocalTrxn();
	}

	protected final IUserAccount getUserAccount() {		
		if (this._userAccount == null) {			
			
			String username = "";
			this.initIfLocalTrxn();
						
			try {
				Principal user = this._sc.getUserPrincipal(); //getDAOContext().getUser();				
				
				if (user != null ) {
					username = user.getName();
					_logger.debug("getting UserAccountJDO for username: '{}' ", username);
					this._userAccount = this._pm.getObjectById(UserAccountJDO.class, username);
					_logger.debug("retrieved userAccount: '{}' ", this._userAccount);	
					this.commitIfLocalTrxn();
					
					/*if (this._rdc instanceof Resource<?>.ResourceDAOContext) {
						((Resource<?>.ResourceDAOContext)this._rdc).setUserAccount(this._userAccount);
					}*/
				}
				else {
					_logger.debug("cannot retrieve a user account since the current user is not signed in.");
				}
			} catch (JDOObjectNotFoundException e) {
				_logger.debug("Looks like there is no user account for username: {}; \n\t caught an JDOObjectNotFoundException while trying to look it up by key: {}", username, e);
				// don't think this is necessary
				// this.exceptionThrown(e);
			} finally {
				this.cleanupIfLocalTrxn();
			}			
		}
		return this._userAccount;
	}
	
	protected boolean hasUserAccount() {
		return this._userAccount != null;
	}
	
	protected final IUserInfo getUserInfo() {
		return Utils.getRemoteUserInfo(this._rdc.getRequest());
	}
	
	// don't want this called by anyone except descendants of this class; restrict classes in this package to the bare minimum;
	// it's probably ok that Resource and IResourceDAOContext have access to it
	protected void cacheUserAccount(IUserAccount anUserAccount) {
		this._userAccount = anUserAccount;
	}

				
}

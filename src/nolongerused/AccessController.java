package friedman.tal;

import java.util.Map;
import java.util.Set;

import friedman.tal.mfs.users.IUserAccount;
import friedman.tal.util.Utils;

public class AccessController implements IAccessController {
	private static final String WRITE_OP = "write";
	private static final String READ_OP = "read";
	private Map<String, Set<IUserAccount>> _permitted;
	
	public AccessController() {
		this._permitted = Utils.newMap();
		
		Set<IUserAccount> readSet = Utils.newSet(); 
		this._permitted.put(READ_OP, readSet);
		
		Set<IUserAccount> writeSet = Utils.newSet();
		this._permitted.put(WRITE_OP, writeSet);
		
	}
	
	@Override
	public boolean canRead(IUserAccount aUser) {
		return this._permitted.get(READ_OP).contains(aUser);
	}

	@Override
	public boolean canWrite(IUserAccount aUser) {
		return this._permitted.get(WRITE_OP).contains(aUser);
	}

}

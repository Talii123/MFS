package friedman.tal;

import javax.jdo.Transaction;

public interface IGlobalTrxnSupport {

	public Transaction initIfLocalTrxn();

	public void exceptionThrown(Exception anException) throws Exception;

	public void commitIfLocalTrxn();

	// NOTE: only call this from a 'finally' block
	public void cleanupIfLocalTrxn();

	public boolean isLocalTrxn();

}
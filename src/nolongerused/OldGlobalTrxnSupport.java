package nolongerused;

import javax.jdo.PersistenceManager;
import javax.jdo.Transaction;

import org.slf4j.Logger;

import friedman.tal.IGlobalTrxnSupport;


public class OldGlobalTrxnSupport implements IGlobalTrxnSupport {

	//private static final Logger _logger = LoggerFactory.getLogger(GlobalTrxnSupport.class);
		private final Logger _logger;
		private final PersistenceManager _pm;
		
		private boolean _isLocalTrxn;
		private Exception _exception;
		private Transaction _trxn;
		
		/*public GlobalTrxnSupport(PersistenceManager aPM) {
			this._pm = aPM;
			this._logger = _logger;
		}*/
		
		public OldGlobalTrxnSupport(PersistenceManager aPM, Logger aLogger) {
			this._pm = aPM;
			this._logger = aLogger;
		}

		/* (non-Javadoc)
		 * @see friedman.tal.IGlobalTrxnSupport#initIfLocalTrxn()
		 */
		@Override
		public Transaction initIfLocalTrxn() {
			Transaction trx = this._pm.currentTransaction();
			if (!trx.isActive()) {
				this._logger.debug("Since no transaction is active yet, and calling code has signalled that one is needed, beginning a local transaction ({}) now.", trx);
				trx.begin();
				this._isLocalTrxn = true;			
			}
			else {
				this._logger.debug("A transaction ({}) is already active, so init transaction just saves a reference to the already running transaction.", trx);
				this._isLocalTrxn = false;			
			}
			this._trxn = trx;
			
			return trx;
		}
		
		/* (non-Javadoc)
		 * @see friedman.tal.IGlobalTrxnSupport#exceptionThrown(java.lang.Exception)
		 */
		@Override
		public void exceptionThrown(Exception anException) throws Exception {
			this._logger.error("caught an exception: {} during transaction: {}", anException, this._trxn);
			this._exception = anException;
			throw anException;
		}
		
		
		
		@Override
		public boolean isLocalTrxn() {
			return this._isLocalTrxn;
		}

		/* (non-Javadoc)
		 * @see friedman.tal.IGlobalTrxnSupport#commitIfLocalTrxn()
		 */
		@Override
		public void commitIfLocalTrxn() {
			// shouldn't this._exception be null if 'commit' is called?  It would be programmer error to call it after an exception was thrown, no?
			if (this._isLocalTrxn /*&& this._exception == null*/) {
				this._logger.debug("Committing local transaction ({}).", this._trxn);
				this._trxn.commit();
			}
			else {
				this._logger.debug("Transaction ({}) is not local, so this is a noop.", this._trxn);
			}
		}
		
		// NOTE: only call this from a 'finally' block
		/* (non-Javadoc)
		 * @see friedman.tal.IGlobalTrxnSupport#cleanupIfLocalTrxn()
		 */
		@Override
		public void cleanupIfLocalTrxn() {
			if (this._isLocalTrxn) {
				if (this._trxn.isActive()) {
					this._logger.debug("Transaction ({}) is local and still active at clean up time, so it is going to be rolled back now.", this._trxn);
					this._trxn.rollback();
				}
				else {
					this._logger.debug("Transaction ({}) is local and committed.  Transaction cleanup is a noop.", this._trxn);
				}
			}
			else {
				// it's a global transaction, so any exceptions thrown are the responsibility of the caller to handle
				this._logger.debug("Transaction ({}) is not local, so cleanup is a noop; calling code must decide what to do next.", this._trxn);
			}
		}

	}

package friedman.tal.jdo;

import java.util.Stack;

import javax.jdo.PersistenceManager;
import javax.jdo.Transaction;

import org.slf4j.Logger;

import friedman.tal.IGlobalTrxnSupport;

public class GlobalTrxnSupport implements IGlobalTrxnSupport {
     //private static final Logger _logger = LoggerFactory.getLogger(GlobalTrxnSupport.class);
     private final Logger _logger;
     private final PersistenceManager _pm;
    
     private TransactionContext _currentTransactionContext;
     private Stack<IGlobalTrxnSupport> _trxnContextStack;

    
     /*public GlobalTrxnSupport(PersistenceManager aPM) {
          this._pm = aPM;
          this._logger = _logger;
     }*/
    
     public GlobalTrxnSupport(PersistenceManager aPM, Logger aLogger) {
          this._pm = aPM;
          this._logger = aLogger;
          this._currentTransactionContext = null;
          this._trxnContextStack = new Stack<IGlobalTrxnSupport>();
     }

    
     @Override
     public Transaction initIfLocalTrxn() {
          if (this._currentTransactionContext != null) {
               this._trxnContextStack.push(this._currentTransactionContext);
          }
         
          this._currentTransactionContext = new TransactionContext(_logger);
          return this._currentTransactionContext.initIfLocalTrxn();
     }

     @Override
     public void exceptionThrown(Exception anException) throws Exception {
          this._currentTransactionContext.exceptionThrown(anException);         
     }

     @Override
     public void commitIfLocalTrxn() {
          this._currentTransactionContext.commitIfLocalTrxn();

     }
     @Override
     public void cleanupIfLocalTrxn() {
          this._currentTransactionContext.cleanupIfLocalTrxn();
          if (!this._trxnContextStack.isEmpty()) {
               this._currentTransactionContext = (TransactionContext) this._trxnContextStack.pop();
          }
          else {
               this._currentTransactionContext = null;
          }
     }

     @Override
     public boolean isLocalTrxn() {
          return this._currentTransactionContext.isLocalTrxn();
     }

     private final class TransactionContext implements IGlobalTrxnSupport {
          private final Logger _logger;
         
          private boolean _isLocalTrxn;
          private Exception _exception;
          private Transaction _trxn;
         
          private TransactionContext(Logger aLogger) {
               this._logger = aLogger;
          }
         

          @Override
          public Transaction initIfLocalTrxn() {
               Transaction trx = GlobalTrxnSupport.this._pm.currentTransaction();
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
}

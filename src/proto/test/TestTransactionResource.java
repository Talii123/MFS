package proto.test;

import javax.jdo.PersistenceManager;
import javax.jdo.Transaction;
import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import friedman.tal.util.PMF;

@Path("test/trx")
public class TestTransactionResource {

	@GET
	@Path("noPM")
	@Produces("text/plain")
	public String testNoPM() {
		StringBuilder sb = new StringBuilder();
		PersistenceManager pm = PMF.getNewPM();
		Transaction trx = pm.currentTransaction();
		sb.append("initially, trx: \n");
		sb.append(trxToString(trx));
		trx.begin();
		sb.append("\n\n\n after trx.begin(): \n");
		sb.append(trxToString(trx));
		
		trx.commit();
		sb.append("\n\n\n after trx.commit(): \n");
		sb.append(trxToString(trx));
		
		return sb.toString();
	}
	
	@GET
	@Path("pm")
	@Produces("text/plain")
	public String testPM() {
		StringBuilder sb = new StringBuilder();
		PersistenceManager pm = PMF.getNewPM();
		Transaction trx = pm.currentTransaction();
		
		sb.append("\n before anything: ").append(trxToString(trx));
		
		pm.makePersistent(new TestJDO("PM"));
		sb.append("\n after makePersistent: ").append(trxToString(trx));

		pm.close();
		sb.append("\n after close: ").append(trxToString(trx));		
		
		return sb.toString();
	}
	
	private String trxToString(Transaction trx) {
		StringBuilder sb = new StringBuilder();
		sb.append("isActive? ").append(trx.isActive());
		sb.append("\n toString(): ").append(trx.toString());
		return sb.toString();
	}
	
	@PersistenceCapable
	private static class TestJDO {
		
		@PrimaryKey
		@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
		private Long ID;
		
		@Persistent
		private String value;
		
		private TestJDO(String aValue) {
			value = aValue;
		}
		
	}
}

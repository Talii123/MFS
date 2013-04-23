package proto.test;

import javax.jdo.PersistenceManager;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import friedman.tal.util.PMF;

@Path("/test")
public class TestNullResource {

	@Path("simpleNull")
	@Produces("text/plain")
	@GET
	public String createResourceWithNullField(@QueryParam("key") String key, @QueryParam("create") boolean isCreateRequested) {
		ValueJDO jdo;
		if (isCreateRequested) {
			jdo = createSimpleJDO(key);
		}
		else {
			jdo = loadSimpleJDO(key);
		}
		
		return jdo.toString() + "\n jdo.getBooleanValue() : "+jdo.getBooleanValue();//.replaceAll("\\n", "<br/>");
	}

	private ValueJDO loadSimpleJDO(String key) {
		PersistenceManager pm = PMF.getNewPM();
		ValueJDO jdo;
		try {
			jdo = pm.getObjectById(ValueJDO.class, key);	
		} finally {
			pm.close();
		}
		return jdo;
	}

	public ValueJDO createSimpleJDO(String key) {
		PersistenceManager pm = PMF.getNewPM();
		ValueJDO jdo = new ValueJDO(key);
		try {
			pm.makePersistent(jdo);
		}
		finally {
			pm.close();
		}
		return jdo;
	}
	
	
}

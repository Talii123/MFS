package proto;

import java.io.IOException;

import javax.jdo.PersistenceManager;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

import proto.EnclosingJDO;

import friedman.tal.util.PMF;

@Path("/externalize")
public class ExternalizableExperiment {

	@GET
	@Produces("text/plain")
	@Path("get/{name}")
	public String getExternalized(@PathParam("name") String name) {
		PersistenceManager pm = PMF.getNewPM();
		EnclosingJDO result;
		try {
			result = pm.getObjectById(EnclosingJDO.class, name);
			//return result.toString();
			//return result.getExternalized().toString();
			System.out.println("getting name...");
			return result.getExternalized().getName();
		} finally {
			pm.close();
		}
	}
	
	@GET
	@Produces("text/plain")
	@Path("set/{name}")
	public String setExternalized(@PathParam("name") String name) throws IOException {
		PersistenceManager pm = PMF.getNewPM();
		EnclosingJDO newJDO = new EnclosingJDO(name);
		try {
			pm.makePersistent(newJDO);
			
		} finally {
			pm.close();
		}	
		return "created" + newJDO.toString();
	}
	
}

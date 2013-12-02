package proto.test;

import java.util.List;

import javax.jdo.PersistenceManager;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import friedman.tal.util.PMF;

@Path("test/embed")
public class TestEmbeddableResource extends BaseTestResource {

	@GET
	@Produces("text/plain")
	public String doTest() {
		PersistenceManager pm = PMF.getNewPM();
		EmployeeContacts test;
		String result;
		try {
			test = new EmployeeContacts("123 Fake Street", "Fakeville", "Fake State", "90210");
			pm.makePersistent(test);
			result = test.toString();
		} catch (Exception e){
			result = "Failed";
		} finally {
			pm.close();
		}
		
		return result;
	}
	
	/*public String doTest(@QueryParam("value") String value, @QueryParam("create") boolean isCreateRequested) {
		//_logger.info("sc: "+StringMaker.securityContextToString(this.sc));
		PersistenceManager pm = PMF.getNewPM();
		Object response = "";
		try {
			if (isCreateRequested) {
				response = createSimpleValueObject(value, pm);				
			}
			else {
				/*List<EmbeddingJDO> results = 
					(List<EmbeddingJDO>) findObjsWithValue(EmbeddingJDO.class, value, pm);
				
				if (results.size() > 1) {
					_logger.error("Error: more than one JDO has value='{}'!", value);
				}
				
				StringBuilder sb = new StringBuilder();
				for (Object jdo : results) {
					sb.append("\n").append(jdo.toString());
				}
				response = sb;
				*//*
				
				response = pm.getObjectById(EmbeddingJDO.class, value);
			}
		} catch (Throwable t) {
			LOGGER.error("caught exception while performing test; exception ={}", t);
		} finally {
			pm.close();
		}
		
		return response.toString();
	}
	
	protected EmbeddingJDO createSimpleValueObject(String value, PersistenceManager pm) {
		EmbeddingJDO jdo = new EmbeddingJDO(value);
		pm.makePersistent(jdo);
		return jdo;
	}*/
}

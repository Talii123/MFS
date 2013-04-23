package proto.test;

import java.util.List;

import javax.jdo.PersistenceManager;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.SecurityContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import friedman.tal.resources.Resource;
import friedman.tal.resources.ResourceDAO;
import friedman.tal.util.PMF;
import friedman.tal.util.StringMaker;

@Path("unique")
public class TestUniquenessResource extends BaseTestResource /*extends Resource<LongJDO>*/ {
	
	/*@Context
	private SecurityContext sc;
	
	/*as expected, this doesn't get called..
	public void setTestData(@Context SecurityContext anSc) {
		System.out.println("\n\n\n\n\nwuhoo!  I (setTestData) got called!!!\n\n\n\n\n");
		_logger.info("\n\n\n\n\nwuhoo!  I (setTestData) got called!!!\n\n\n\n\n");
		this.sc = anSc;
	}*/
	
	@GET
	@Produces("text/plain")
	public String doTest(@QueryParam("value") String value,
			@QueryParam("parent") String parentValue,
			@QueryParam("create") boolean isCreateRequested) {
		//_logger.info("sc: "+StringMaker.securityContextToString(this.sc));
		PersistenceManager pm = PMF.getNewPM();
		Object response = "";
		try {
			if (isCreateRequested) {
				if (parentValue == null)
					response = createSimpleValueObject(value, pm);
				else
					response = createChildValueObject(ParentJDO.class, parentValue, value, pm);
			}
			else {		
				List<?> results;
				if (parentValue == null) 
					 results = (List<LongJDO>) findObjsWithValue(LongJDO.class, value, pm);
				else
					results = (List<EncodedStringJDO>) findObjsWithValue(ParentJDO.class, parentValue, /*EncodedStringJDO.class,*/ value, pm);
				
				if (results.size() > 1) {
					LOGGER.error("Error: more than one JDO has value='{}'!", value);
				}
				
				StringBuilder sb = new StringBuilder();
				for (Object jdo : results) {
					sb.append("\n").append(jdo.toString());
				}
				response = sb;
			}			
		} catch (Throwable t) {
			LOGGER.error("caught exception while performing test; exception ={}", t);
		} finally {
			pm.close();
		}
		
		return response.toString();
	}


	protected LongJDO createSimpleValueObject(String value, PersistenceManager pm) {
		LongJDO jdo = new LongJDO(value);
		pm.makePersistent(jdo);
		return jdo;
	}


	/*@Override
	protected <U extends ResourceDAO<LongJDO>> U getDAO() {
		// TODO Auto-generated method stub
		return null;
	}*/
	

	/*public <T extends LongJDO> T createSimpleValueObject(Class<T> simpleValueClass, String value, PersistenceManager pm) {
		LongJDO jdo = new LongJDO(value);
		pm.makePersistent(jdo);
		return (T) jdo;
	}*/
}

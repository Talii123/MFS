package proto.test;

import javax.jdo.PersistenceManager;
import javax.jdo.Transaction;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import friedman.tal.mfs.SharingOption;
import friedman.tal.mfs.timelines.ITimeline;
import friedman.tal.mfs.timelines.TimelineJDO;
import friedman.tal.mfs.users.UserAccountJDO;
import friedman.tal.util.PMF;

@Path("/test")
public class TestJDOResource {

	public static final Logger LOGGER = LoggerFactory.getLogger(TestJDOResource.class);
	
	
	@GET
	@Path("usjdo")
	@Produces("text/plain")
	public String setJDO(@QueryParam("key") String aStringKey, @QueryParam("create") boolean isCreateRequested) {
		if (isCreateRequested) {
			return createJDO(aStringKey).toString();
			
		}
		else {
			return getJDOString(aStringKey).toString();
		}
	}

	
	@GET
	@Path("tl3")
	@Produces("text/plain")
	public String makeTimeline3(@QueryParam("userID") String userID) {
		LOGGER.debug("starting makeTimeline3");
		PersistenceManager pm = PMF.getNewPM();
		Transaction trxn = pm.currentTransaction();
		String result = "";
		
		try {
			trxn.begin();
			LOGGER.debug("started trxn2");
			
			UserAccountJDO userJDO = new UserAccountJDO(userID);
			pm.makePersistent(userJDO);  // using JDO3/DatanucluesV2, this should be atomic
			trxn.commit();
			LOGGER.debug("finished trxn1");
			trxn.begin();
			LOGGER.debug("started trxn2");
			ITimeline timelineJDO = new TimelineJDO(userJDO, SharingOption.PUBLIC);
			// redundant
			//userJDO.setTimeline(timelineJDO);

			trxn.commit();
			LOGGER.debug("finished trxn2");
			
			result = userJDO.toString();
		} finally {
			if (trxn.isActive()) trxn.rollback();
		}
		
		LOGGER.debug("ending makeTimeline3");
		
		return result;		
	}	
	
	@GET
	@Path("tl2")
	@Produces("text/plain")
	public String makeTimeline2(@QueryParam("userID") String userID) {
		LOGGER.debug("starting makeTimeline2");
		PersistenceManager pm = PMF.getNewPM();
		Transaction trxn = pm.currentTransaction();
		String result = "";
		try {
			trxn.begin();
			UserAccountJDO userJDO = new UserAccountJDO(userID);
			pm.makePersistent(userJDO);  // using JDO3/DatanucluesV2, this should be atomic
			
			ITimeline timelineJDO = new TimelineJDO(userJDO, SharingOption.PUBLIC);
			userJDO.setTimeline(timelineJDO);

			trxn.commit();
			result = userJDO.toString();
		} finally {
			if (trxn.isActive()) trxn.rollback();
		}
		
		LOGGER.debug("ending makeTimeline2");
		return result;		
	}
	
	@GET
	@Path("tl1")
	@Produces("text/plain")
	public String makeTimeline1(@QueryParam("userID") String userID) {
		LOGGER.debug("starting makeTimeline1");
		PersistenceManager pm = PMF.getNewPM();
		String result = "";
		try {
			UserAccountJDO userJDO = new UserAccountJDO(userID);		
			ITimeline timelineJDO = new TimelineJDO(userJDO, SharingOption.PUBLIC);
			userJDO.setTimeline(timelineJDO);			
			
			pm.makePersistent(userJDO);
			result = userJDO.toString();
		} finally {
			pm.close();
		}
		
		LOGGER.debug("ending makeTimeline1");
		return result;		
	}	

	private UnencodedStringJDO createJDO(String aStringKey) {
		UnencodedStringJDO jdo = new UnencodedStringJDO(aStringKey);
		PersistenceManager pm = PMF.getNewPM();
		try {
			pm.makePersistent(jdo);
		} finally {
			pm.close();
		}
		return jdo;
	}
	
	private UnencodedStringJDO getJDOString(String aStringKey) {
		UnencodedStringJDO jdo = null;
		PersistenceManager pm = PMF.getNewPM();
		try {
			jdo = pm.getObjectById(UnencodedStringJDO.class, aStringKey);
		} finally {
			pm.close();
		}
		
		return jdo;
	}	
}

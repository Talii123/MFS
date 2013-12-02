package friedman.tal.mfs;

import java.util.List;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;

import com.google.appengine.api.utils.SystemProperty;


import friedman.tal.jdo.TypedKey;
import friedman.tal.mfs.agreements.AgreementJDO;
import friedman.tal.mfs.timelines.PublicTimelineID;
import friedman.tal.mfs.timelines.TimelineJDO;
import friedman.tal.mfs.timelines.events.ChapterEventJDO;
import friedman.tal.mfs.timelines.events.ChemoEventJDO;
import friedman.tal.mfs.timelines.events.DiagnosisEventJDO;
import friedman.tal.mfs.timelines.events.ImmunoEventJDO;
import friedman.tal.mfs.timelines.events.RadiationEventJDO;
import friedman.tal.mfs.timelines.events.SurgeryEventJDO;
import friedman.tal.mfs.timelines.events.TestEventJDO;
import friedman.tal.mfs.users.UserAccountJDO;
import friedman.tal.util.PMF;

@Path("/admin/do")
public class AdminResource {
	
	private static final Class<?>[] CLASSES_TO_DELETE = new Class<?>[] {
		UserAccountJDO.class, 
		TimelineJDO.class, 
		AgreementJDO.class, 
		PublicTimelineID.class, 
		TypedKey.class, 
		//EventJDO.class,		// EventJDO is an abstract base class - it does not correspond to an entity type in the DB
		ChapterEventJDO.class,
		DiagnosisEventJDO.class,
		SurgeryEventJDO.class,
		ChemoEventJDO.class,
		RadiationEventJDO.class,
		ImmunoEventJDO.class,
		TestEventJDO.class
	};
	
	@GET
	@Path("reset")
	@Produces("text/plain")
	public String reset(@Context HttpServletRequest request) {
		if (SystemProperty.environment.value() ==
			    SystemProperty.Environment.Value.Production) {
			    // The app is running on App Engine...
			return "reset is disabled in the production environment.";
		}
		
		if (!request.isUserInRole("admin")) {
			return "You are not authorized to perform a reset().";
		}
		
		PersistenceManager pm = PMF.getNewPM();
		//Transaction trxn = pm.currentTransaction();
		String result = "not done";
		StringBuilder sb = new StringBuilder();
		
		for (Class<?> classToDelete : CLASSES_TO_DELETE) {
			boolean isDeleted = deleteAllOfClass(pm, classToDelete);
			sb.append("\n").append(classToDelete.getName()).append(": ").append(isDeleted ? "deleted" : "not deleted");  
		}

		result = sb.toString();
		return result;
	}

	private <T> boolean deleteAllOfClass(PersistenceManager pm, Class<T> theClass) {
		try {
			
			Query q = pm.newQuery(theClass);
			@SuppressWarnings("unchecked")
			List<T> allObjectsOfClass = (List<T>) q.execute();
			if (allObjectsOfClass != null) {
				pm.deletePersistentAll(allObjectsOfClass);	
			}
						
			return true;
		} catch (Exception e) {
			System.err.println(String.format("caught exception while trying to delete all of type '%s'; \n", theClass.getName()));
			e.printStackTrace(System.err);
			
			return false;
		} 
		
	}
}

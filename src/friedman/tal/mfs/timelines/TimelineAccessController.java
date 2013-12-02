package friedman.tal.mfs.timelines;

import java.security.Principal;
import java.util.Map;

import javax.ws.rs.core.SecurityContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import friedman.tal.AccessRule;
import friedman.tal.IAccessController;
import friedman.tal.IOwnedResource;
import friedman.tal.mfs.SharingOption;
import friedman.tal.util.StringMaker;
import friedman.tal.util.Utils;


public enum TimelineAccessController implements IAccessController {
	
	//PUBLIC(SharingOption.PUBLIC, AccessRule.ANYONE, AccessRule.MUST_OWN),
	//ONLY_MEMBERS(SharingOption.COMMUNITY, AccessRule.MUST_BE_MEMBER, AccessRule.MUST_OWN),
	ONLY_ME(SharingOption.ONLY_ME, AccessRule.MUST_OWN, AccessRule.MUST_OWN);
	

	private TimelineAccessController(SharingOption aSharingSetting, AccessRule aReadRule, AccessRule aWriteRule) {
		this.sharingSetting = aSharingSetting;
		this.readRule = aReadRule;
		this.writeRule = aWriteRule;
	}
	
	@Override
	public boolean canRead(SecurityContext aCallingContext, IOwnedResource anOwnedResource) {
		return canDo(aCallingContext, anOwnedResource, PROTECTED_READ);
	}
	
	@Override
	public boolean canWrite(SecurityContext aCallingContext, IOwnedResource anOwnedResource) {
		return canDo(aCallingContext, anOwnedResource, PROTECTED_WRITE);
	}
	
	
	// I'm very explicit with boolean values below.  I believe it reduces the likelihood of introducing errors later.
	private boolean canDo(SecurityContext aCallingContext, IOwnedResource anOwnedResource, String aProtectedOperation) {
		boolean isDoable = false;
		LOGGER.debug("checking whether operation: '{}' is allowed on resource: '{}' \n by security context: '{}'", aProtectedOperation, anOwnedResource, StringMaker.securityContextToString(aCallingContext));
		Principal principal = aCallingContext != null ? aCallingContext.getUserPrincipal() : null;
		String callerID = principal != null ? principal.getName() : AccessRule.ANONYMOUS_ID;
		String ownerID = anOwnedResource.getOwnerId().getStringId(); 
		//try {
			if (aProtectedOperation != null) {
				if (PROTECTED_READ.equals(aProtectedOperation)) {
					this.readRule.verify(callerID, ownerID);
					isDoable = true;
				}
				else if (PROTECTED_WRITE.equals(aProtectedOperation)) {
					this.writeRule.verify(callerID, ownerID);
					isDoable = true;
				}
				else {
					LOGGER.error("Unsupported operation: '{}'; access denied. ", aProtectedOperation);
					isDoable = false;
				}
			}
			else {
				LOGGER.error("Protected operation not specified.  Access denied.");
				isDoable = false;
			}

		/*} catch (IllegalAccessException e) {
			LOGGER.info("Caller '{}' does not have permission to {} from resource with ID: {} ", callerID, aProtectedOperation, ownerID);
			isDoable = false;
		}*/
		LOGGER.info("Operation is {}", (isDoable ? "allowed" : "not allowed"));
		return isDoable;
	}
	
	private SharingOption sharingSetting;
	private AccessRule readRule;
	private AccessRule writeRule;
	
	private static final String PROTECTED_WRITE = "write";
	private static final String PROTECTED_READ = "read";
	
	private static final Map<SharingOption, TimelineAccessController> SHARING_TO_AC_MAP;
	static {
		SHARING_TO_AC_MAP = Utils.newMap();
		/*SHARING_TO_AC_MAP.put(SharingOption.PUBLIC, TimelineAccessController.PUBLIC);
		SHARING_TO_AC_MAP.put(SharingOption.COMMUNITY, TimelineAccessController.ONLY_MEMBERS);
		SHARING_TO_AC_MAP.put(SharingOption.ONLY_ME, TimelineAccessController.ONLY_ME);*/
		for (TimelineAccessController ac : TimelineAccessController.values()) {
			SHARING_TO_AC_MAP.put(ac.getSharingSetting()	, ac);
		}
	}
	
	public static final TimelineAccessController getAccessControllerFor(SharingOption aSharingOption) {
		return SHARING_TO_AC_MAP.get(aSharingOption);
	}
	
	public SharingOption getSharingSetting() {
		return this.sharingSetting;
	}
	
	private static final Logger LOGGER = LoggerFactory.getLogger(TimelineAccessController.class);
}

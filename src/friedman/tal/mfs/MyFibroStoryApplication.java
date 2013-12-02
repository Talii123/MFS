package friedman.tal.mfs;

import java.text.SimpleDateFormat;
import java.util.Set;

import javax.servlet.ServletContext;
import javax.ws.rs.core.Context;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.SerializationConfig;

import friedman.tal.BaseApplication;
import friedman.tal.mfs.agreements.AgreementFormLogicalKey;
import friedman.tal.mfs.agreements.AgreementFormResource;
import friedman.tal.mfs.exceptions.ConsentNotGivenExceptionMapper;
import friedman.tal.mfs.exceptions.URISyntaxExceptionMapper;
import friedman.tal.mfs.exceptions.UnauthorizedExceptionMapper;
import friedman.tal.mfs.exceptions.UserAlreadyHasTimelineExceptionMapper;
import friedman.tal.mfs.exceptions.UserHasNoAccountExceptionMapper;
import friedman.tal.mfs.timelines.TimelineResource;
import friedman.tal.mfs.users.UserAccountResource;
import friedman.tal.util.Utils;
import friedman.tal.views.JSPViewMessageBodyWriter;

public class MyFibroStoryApplication extends BaseApplication {
	
	private static MyFibroStoryApplication _theApplication;
	
	private static AgreementFormLogicalKey REQUIRED_AGREEMENT_KEY;

	public static final String NEW_TIMELINE_REQUIRED_AGREEMENT_FORM_NAME = "newTLRequiredAgreementFormName";
	public static final String NEW_TIMELINE_REQUIRED_AGREEMENT_FORM_REVISION_NUM = "newTLRequiredAgreementFormRevisionNum";

	public static AgreementFormLogicalKey getRequiredKey() {
		return REQUIRED_AGREEMENT_KEY;
	}
	
	public static final MyFibroStoryApplication getApplication() {
		if (_theApplication == null) {
			// this really never should happen
			throw new IllegalAccessError("getApplication() called before the application was initialized!");
		}
		
		return _theApplication;
	}
	
	// don't want to use public constructor as part of Singleton pattern, but JAX-RS requires this
	public MyFibroStoryApplication(@Context ServletContext context) {
		super(context);
		
		if (_theApplication == null) {
			synchronized (MyFibroStoryApplication.class) {
				if (_theApplication == null) {
					_theApplication = this;
					
					Set<Object> singletons = Utils.newSet();
					//singletons.add(new AgreementFormResource());			
					//singletons.add(new TestUniquenessResource());
					/*singletons.add(new TestTransactionResource());
					singletons.add(new TestEmbeddableResource());
					singletons.add(new TestJDOResource());
					singletons.add(new TestNullResource());*/
					
					//singletons.add(new HomeResource());
					//singletons.add(new ExternalizableExperiment());
					
					singletons.add(new AdminResource());
					
					singletons.add(new ConfiguredJacksonProvider());
					
					singletons.add(new JSPViewMessageBodyWriter());
					
					singletons.add(new UnauthorizedExceptionMapper());
					singletons.add(new UserHasNoAccountExceptionMapper());
					singletons.add(new UserAlreadyHasTimelineExceptionMapper());
					
					singletons.add(new ConsentNotGivenExceptionMapper());
					singletons.add(new URISyntaxExceptionMapper());
					
					setSingletons(singletons);
					
					Set<Class<?>> perResourceClasses = Utils.newSet();
					perResourceClasses.add(AgreementFormResource.class);
					perResourceClasses.add(UserAccountResource.class);
					perResourceClasses.add(TimelineResource.class);
					
					//perResourceClasses.add(TestUniquenessResource.class);
					
					setClasses(perResourceClasses);
					
					String requiredAgreementFormName = getSetting(NEW_TIMELINE_REQUIRED_AGREEMENT_FORM_NAME);
					String requiredAgreementFormRevisionNum = getSetting(NEW_TIMELINE_REQUIRED_AGREEMENT_FORM_REVISION_NUM);
					REQUIRED_AGREEMENT_KEY = new AgreementFormLogicalKey(requiredAgreementFormName, Integer.parseInt(requiredAgreementFormRevisionNum));

				}
			}			
		}		
	}

	public static ObjectMapper getMapper() {
		ObjectMapper mapper = new ObjectMapper();
		//SerializationConfig.Feature.
		
		mapper.configure(SerializationConfig.Feature.FAIL_ON_EMPTY_BEANS, false);
		mapper.configure(SerializationConfig.Feature.WRITE_NULL_PROPERTIES, false);
		//mapper.setSerializationInclusion(Inclusion.NON_NULL);
		mapper.setDateFormat(new SimpleDateFormat("MMM dd yyyy HH:mm:ss Z"));
		return mapper;
	}
	
}

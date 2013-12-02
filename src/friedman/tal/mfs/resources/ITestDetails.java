package friedman.tal.mfs.resources;

import javax.validation.constraints.NotNull;


import friedman.tal.mfs.timelines.events.IEventDetails;
import friedman.tal.mfs.timelines.events.details.TestType;

public interface ITestDetails extends IEventDetails {

	public enum Field {
		testType;
	}

	@NotNull 
	public TestType getTestType();
}


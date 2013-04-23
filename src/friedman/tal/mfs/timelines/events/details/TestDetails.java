package friedman.tal.mfs.timelines.events.details;

import java.util.Map;

import javax.jdo.annotations.EmbeddedOnly;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;

import friedman.tal.mfs.NotSet;
import friedman.tal.mfs.resources.ITestDetails;
import friedman.tal.mfs.timelines.events.EventDetails;
import friedman.tal.mfs.timelines.events.EventType;
import friedman.tal.util.Utils;


@PersistenceCapable
@EmbeddedOnly
public class TestDetails extends EventDetails implements ITestDetails {
	
	@Persistent
	private TestType _testType;

	@Override
	public TestType getTestType() {
		return this._testType;
	}
	
	private TestDetails(Map<String, String> aMap) {		
		// this check cannot be moved to the super class constructor
		if (aMap == null) return;
		
		String value;
		
		value = Utils.getValueOrEmptyString(aMap.get(Field.testType.name()));
		this._testType = value.length() > 0 ? TestType.valueOf(value) : NotSet.TEST_TYPE;	
	}	
	
	static TestDetails fromMap(Map<String, String> aMap) {
		return new TestDetails(aMap);
	}
	
	/*@Override
	public final EventType getType() {
		return EventType.TEST;
	}*/

}

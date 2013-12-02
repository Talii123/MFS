package test.friedman.tal;

import proto.test.TimelineEventTypeDefinition;

import org.junit.Test;

import static org.junit.Assert.*;


public class TimelineEventTypeDefinitionTest {

	public static final String NEW_VALUE = "newValue";
	
	@Test
	public void testImmutableExpectedFields() {
		String initValue;
		
		TimelineEventTypeDefinitio surgeryDef = TimelineEventTypeDefinition.SURGERY;
		String[] fields = surgeryDef.getExpectedFields();
		
		initValue = fields[0];
		fields[0] = NEW_VALUE;
		
		assertTrue("write to field[0] was unsuccessful", NEW_VALUE.equals(fields[0]));
		assertEquals("surgery's first expected field got overwritten", initValue, TimelineEventTypeDefinition.SURGERY.getExpectedFields()[0]);
	}
}

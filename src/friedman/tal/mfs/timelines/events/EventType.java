package friedman.tal.mfs.timelines.events;

public enum EventType {
	CHAPTER(-1), DIAGNOSIS(0), SURGERY(1), CHEMO(2), RADIATION(3), IMMUNO(4), TEST(5);
	
	private EventType(int anIndex) {
		this.typeIndex = anIndex;
	}
	private final int typeIndex;
	
	public int getTypeIndex() {
		return this.typeIndex;
	}
	
}

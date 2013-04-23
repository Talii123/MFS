package friedman.tal.util;

import java.security.SecureRandom;


public enum GUIDMaker {
	INSTANCE;
	
	private GUIDMaker() {
		this._randomizer = new SecureRandom();
	}
	
	/*public Long getUnique() {
		return this._randomizer.nextLong();
	}*/
	
	private SecureRandom _randomizer;
	
	public static Long getUniqueLong() {
		return INSTANCE._randomizer.nextLong();
	}
}

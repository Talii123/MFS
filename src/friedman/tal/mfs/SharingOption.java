package friedman.tal.mfs;

public enum SharingOption {

	//PUBLIC("Everyone"),
	//COMMUNITY("Community"),
	ONLY_ME("Only Me");
	
	// TODO: I18n this by returning a resource key and mapping that key to a string using resource bundles
	private SharingOption(String aLocalString) {
		this._localString = aLocalString;
	}
	
	public String getLocalString() {
		return this._localString;
	}
	
	@Override
	public String toString() {
		return this._localString;
	}

	public static SharingOption[] getValues() {
		return SharingOption.values();
	}

	private final String _localString;
	
}

package friedman.tal.mfs;

public enum PermissionCheck {
	NONE {
		public boolean check() {
			return true;
		}
	};
	
	public abstract boolean check();
}

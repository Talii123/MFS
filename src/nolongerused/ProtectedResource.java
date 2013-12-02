package friedman.tal.mfs;

public abstract class ProtectedResource {

	public ProtectedResource() {
		checkPermission(getResourceProtector());
	}

	abstract void checkPermission(PermissionCheck theResourcePermissionChecker);
	abstract PermissionCheck getResourceProtector();
}

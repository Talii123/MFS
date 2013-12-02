package friedman.tal.mfs.users;

import javax.jdo.annotations.PersistenceCapable;

@PersistenceCapable
public interface IUserInfo {

	public String getAddr();

	public String getHost();

	public int getPort();

	public String getUser();

}
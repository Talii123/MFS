package friedman.tal.mfs.users;

import javax.jdo.annotations.EmbeddedOnly;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;

import friedman.tal.jdo.IJDO;

//TODO: write unit tests for equals() and hashcode()
//TODO: validate inputs to constructor?

@PersistenceCapable
@EmbeddedOnly
public class UserInfo implements IUserInfo {
	
	@Persistent
	private String _addr;
	
	@Persistent
	private String _host;
	
	@Persistent
	private int _port;
	
	@Persistent
	private String _user;	
	
	
	public UserInfo(String anAddr, String aHost, int aPort, String aUser) {
		this._addr = anAddr;
		this._host = aHost;
		this._port = aPort;
		this._user = aUser;
	}
	
	public UserInfo(IUserInfo aUserInfo) {
		this._addr = aUserInfo.getAddr();
		this._host = aUserInfo.getHost();
		this._port = aUserInfo.getPort();
		this._user = aUserInfo.getUser();
	}
	
	@Override
	public boolean equals(Object other) {
		if (this == other) return true;
		if (!(other instanceof IUserInfo)) return false;
		IUserInfo otherUserInfo = (IUserInfo)other;
		return this._user.equals(otherUserInfo.getUser())  && 
				this._addr.equals(otherUserInfo.getAddr()) &&
				this._host.equals(otherUserInfo.getHost())  &&
				this._port == otherUserInfo.getPort();
	}

	@Override
	public int hashCode() {
		int result = 17;
		result = 31 * result + this._user.hashCode();
		result = 31 * result + this._addr.hashCode();
		result = 31 * result + this._host.hashCode();
		result = 31 * result + this._port;
		return result;
	}

	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append(IJDO.JDO_STR_START_TOKEN).append(this.getClass()).append(": ")
			.append("_user=").append(_user).append(IJDO.JDO_PROPERTY_DELIMITER)
			.append("_addr=").append(_addr).append(IJDO.JDO_PROPERTY_DELIMITER)
			.append("_host=").append(_host).append(IJDO.JDO_PROPERTY_DELIMITER)
			.append("_port=").append(_port).append(IJDO.JDO_PROPERTY_DELIMITER)
			.append(IJDO.JDO_STR_END_TOKEN);
				
		return sb.toString();
	}	
	
	@Override
	public String getAddr() {
		return _addr;
	}

	@Override
	public String getHost() {
		return _host;
	}

	@Override
	public int getPort() {
		return _port;
	}

	@Override
	public String getUser() {
		return _user;
	}
	
}

package proto.test;

import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.PrimaryKey;

@PersistenceCapable
public class UnencodedStringJDO {

	@PrimaryKey
	private String _keyName;
	
	public UnencodedStringJDO(String aKeyName) {
		this._keyName = aKeyName;
	}
	
	public String getKeyName() {
		return this._keyName;
	}

	@Override
	public boolean equals(Object other) {
		if (this == other) return true;
		if (!(other instanceof UnencodedStringJDO)) return false;
		UnencodedStringJDO otherUSJDO = (UnencodedStringJDO)other;
		
		return this._keyName == otherUSJDO._keyName || (this._keyName != null && this._keyName.equals(otherUSJDO._keyName));  
	}

	@Override
	public int hashCode() {
		int result = 17;
		result = result * 31 + (this._keyName != null ? this._keyName.hashCode() : 0);
		return result;
	}

	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		
		sb.append("{")
			.append("\n\t class: ").append(this.getClass().getName())
			.append("\n\t _keyName: ").append(this._keyName != null ? this._keyName : "[null]")
		.append("\n}");
		
		return sb.toString();
	}
	
	
}

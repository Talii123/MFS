package proto.test;

import javax.jdo.annotations.Inheritance;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;

@PersistenceCapable
@Inheritance(customStrategy = "complete-table")
public class ValueJDO extends UnencodedStringJDO {

	@Persistent
	private String _stringValue;
	
	@Persistent
	private Boolean _booleanValue;
	
	public ValueJDO(String aKeyName) {
		super(aKeyName);
	}

	
	public String getStringValue() {
		return this._stringValue;
	}
	
	public void setStringValue(String aString) {
		this._stringValue = aString;
	}


	public Boolean getBooleanValue() {
		return _booleanValue;
	}


	public void setBooleanValue(Boolean aBooleanValue) {
		this._booleanValue = aBooleanValue;
	}
	
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("{")
			.append("\n").append("class: ").append(this.getClass())
			.append("\n").append("_stringValue: ").append(_stringValue)
			.append("\n").append("_booleanValue: ").append(_booleanValue)
		.append("\n}");
		
		return sb.toString();
	}
}

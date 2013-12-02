package proto.test;

import javax.jdo.annotations.Inheritance;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;

@PersistenceCapable 
@Inheritance(customStrategy = "complete-table")
public class ParentJDO extends LongJDO {

	@Persistent 
	private EncodedStringJDO _child;
	
	public ParentJDO(String aName, String aChildName) {
		super(aName);
		
		this._child = new EncodedStringJDO(aChildName);
	}
	
	public void setChild(EncodedStringJDO aChild) {
		this._child = aChild;
	}
	
	public EncodedStringJDO getChild() {
		return this._child;
	}

	@Override 
	public String toString() {
		StringBuilder sb = new StringBuilder(super.toString());
		sb.delete(sb.indexOf("}"), sb.length());
		sb.append("\n\t").append("_child = ").append(this._child != null ? this._child.toString() : "[null]");
		sb.append("\n}");
		return sb.toString();
	}
	
}

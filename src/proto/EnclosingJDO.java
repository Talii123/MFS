package proto;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.io.PrintWriter;
import java.io.StringWriter;

import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

@PersistenceCapable
public class EnclosingJDO {

	@PrimaryKey
	@Persistent
	private String _name;
	
	@Persistent(serialized = "true")
	private ExternalizableClass _externalized;
	
	@Persistent
	private String _manuallyExternal;
	
	public EnclosingJDO(String aName) throws IOException {
		this._name = aName;
		ExternalizableClass toExternalize = new ExternalizableClass("external:name="+aName); 
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		
		ObjectOutputStream out = new ObjectOutputStream(baos);
		toExternalize.writeExternal(out);
		out.close();
		this._manuallyExternal = baos.toString("UTF-8");
		
		this._externalized = toExternalize;
	}
	
	public ExternalizableClass getExternalized() {
		return this._externalized;
	}
	
	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder(this.getClass().getName());
		sb.append("(_name=").append(this._name);
		sb.append("\n , externalized = ").append(this._externalized.toString());
		sb.append("\n manuallyExternalized = ").append(this._manuallyExternal);
		return  sb.toString();	
	}
}

package proto;

import java.io.Externalizable;
import java.io.IOException;
import java.io.ObjectInput;
import java.io.ObjectOutput;

public class ExternalizableClass implements Externalizable {

	private String name;
	
	public ExternalizableClass(String aName) {
		this.name = aName;
	}
	
	// needed for Externalization process
	public ExternalizableClass() {
		
	}
	
	@Override
	public String toString() {
		return this.getClass().getName() + "(name=" + this.name +")";
	}
	
	public String getName() {
		return this.name;
	}
	
	@Override
	public void readExternal(ObjectInput in) throws IOException,
			ClassNotFoundException {
		System.out.println("\n\n\n\n readExternal called!!! \n\n\n");
		this.name = in.readUTF();
		System.out.println("my ID: "+ this.name+"\n\n\n");
	}

	@Override
	public void writeExternal(ObjectOutput out) throws IOException {
		System.out.println("\n\n\n\n writeExternal called!!! \n\n\n");
		out.writeUTF(this.name);
	}

}

package proto.test;

import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.PrimaryKey;
import javax.persistence.Embeddable;
@Embeddable
@PersistenceCapable
public class LongJDO {
	 
	@PrimaryKey
	/*@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	private Long _tal;
	
	@Persistent*/
	// this does not work: @Unique
	private String _field; 
	
	public LongJDO(String aFieldValue) {
		this._field = aFieldValue;
	}
	
	public String getValue() {
		return this._field;
	}

	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("{")
			//.append("\n\t").append("_tal=").append(this._tal)
			.append("\n\t").append("_field=").append(this._field)
		.append("\n}");
		
		return sb.toString();
	}
	
	
}

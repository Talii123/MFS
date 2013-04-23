package proto.test;

import javax.jdo.annotations.Embedded;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;

@PersistenceCapable
public class EmbeddingJDO {

	@Embedded
	@Persistent
	private LongJDO _embedded;
	
	public EmbeddingJDO(String aFieldValue) {
		this._embedded = new LongJDO(aFieldValue);
	}
	
	public String getValue() {
		return this._embedded.getValue();
	}
	
	@Override
	public String toString() {
		return "EmbeddingJDO("+(getValue() != null ? getValue() : "[null]")+")";
	}
	
}

package proto.test;

import javax.jdo.annotations.Extension;
import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;

@PersistenceCapable
public class EncodedStringJDO {

    @PrimaryKey
    @Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
    @Extension(vendorName="datanucleus", key="gae.encoded-pk", value="true")
    private String encodedKey;

    @Persistent
    @Extension(vendorName="datanucleus", key="gae.pk-name", value="true")
    private String keyName;
    
    
    public EncodedStringJDO(String aKeyName) {
    	this.keyName = aKeyName;
    }
    
    public String getValue() {
    	return this.keyName;
    }
    
    @Override
    public String toString() {
    	StringBuilder sb = new StringBuilder();
    	
    	sb.append("{")
    		.append("\n\t").append("className: ").append(this.getClass().getName());
    		if (this.encodedKey != null) {
        		Key key = KeyFactory.stringToKey(this.encodedKey);
        		sb.append("\n\t").append("encodedKey: ").append(this.encodedKey)        	
        		.append("\n\t").append("key: ").append(key)
        		.append("\n\t").append("keyName: ").append(this.keyName);    			
    		}
    		else {
    			sb.append("\n\t").append("encodedKey: [null]")
    			.append("\n\t").append("key: [null]");
    		}
    	sb.append("\n}");
    	
    	return sb.toString();
    }

}

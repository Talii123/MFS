package proto.test;

import javax.jdo.annotations.EmbeddedOnly;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;

@PersistenceCapable
@EmbeddedOnly
public class ContactInfo {
    @Persistent
    private String streetAddress;

    @Persistent
    private String city;

    @Persistent
    private String stateOrProvince;

    @Persistent
    private String zipCode;
    
    public ContactInfo(String aStreetAddress, String aCity, String aStateOrProvince, String aZipCode) {
    	this.streetAddress = aStreetAddress;
    	this.city = aCity;
    	this.stateOrProvince = aStateOrProvince;
    	this.zipCode = aZipCode;
    }
    
    public String toString() {
    	StringBuilder sb = new StringBuilder();
    	sb.append("{")
    		.append("\n\t").append("class: ").append(this.getClass())
    		.append("\n\t").append("streetAddress: ").append(this.streetAddress)
    		.append("\n\t").append("city: ").append(this.city)
    		.append("\n\t").append("stateOrProvince: ").append(this.stateOrProvince)
    		.append("\n\t").append("zipCode: ").append(this.zipCode)
    		.append("\n")
    	.append("}");
    	
    	return sb.toString();
    }

    // ... accessors ...
}

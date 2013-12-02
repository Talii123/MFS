package proto.test;

import javax.jdo.annotations.Embedded;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;

@PersistenceCapable
public class EmployeeContacts extends AbstractEmployeeContacts {

    public EmployeeContacts(String aStreetAddress, String aCity, String aStateOrProvince, String aZipCode) {
    	this.homeContactInfo = new ContactInfo(aStreetAddress, aCity, aStateOrProvince, aZipCode);
    }
    
    
    public String toString() {
    	return super.toString() + ", homeContactInfo=" + (this.homeContactInfo != null ? this.homeContactInfo.toString() : "[null]");
    }

    @Persistent
    @Embedded
    private ContactInfo homeContactInfo;
}
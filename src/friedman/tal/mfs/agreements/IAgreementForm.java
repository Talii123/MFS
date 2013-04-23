package friedman.tal.mfs.agreements;

import java.util.Date;

import friedman.tal.jdo.TypedKey;

public interface IAgreementForm {

	public String getID();
	public String getName();
	public Date getCreatedDate();
	public int getRevisionNum();
	public String getFirstRelease();	
	public String getText();
	public abstract String getCreator();
	public TypedKey<? extends IAgreementForm, Long> getKey();
}

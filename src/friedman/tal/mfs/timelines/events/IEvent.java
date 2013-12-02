package friedman.tal.mfs.timelines.events;

import java.util.Date;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.hibernate.validator.constraints.NotBlank;

import friedman.tal.mfs.timelines.EventTO;
import friedman.tal.validation.NoHTML;
import friedman.tal.validation.ValidDateRange;

@JsonDeserialize(as = EventTO.class)
@ValidDateRange
public interface IEvent /*extends IProtectableResource*/ {
	
	public enum Field {
		ID,
		start,
		end,
		title,
		description,
		type,
		typeDetails;
	}

	@NotBlank
	public String getID();
	
	public Date getStart();
	public Date getEnd();
	
	@NotBlank
	public String getTitle();
	
	
	//public String getIcon();
	

	//@SafeHtml
	@NoHTML
	public String getDescription();
	
	/*@Range(min=-1, max=5)
	public byte getTypeIndex();*/
	
	@NotNull
	public EventType getType();
	
    @Valid
	public <T extends IEventDetails> T getTypeDetails();
	//public Map<String, String> getTypeDetails();
	
}

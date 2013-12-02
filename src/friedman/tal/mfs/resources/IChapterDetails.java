package friedman.tal.mfs.resources;

import org.hibernate.validator.constraints.NotBlank;

import friedman.tal.mfs.timelines.events.IEventDetails;
import friedman.tal.validation.NoHTML;

public interface IChapterDetails extends IEventDetails {
	public enum Field implements IField {
		text;
	}
	
	@NotBlank
	@NoHTML
	public String getText();
}

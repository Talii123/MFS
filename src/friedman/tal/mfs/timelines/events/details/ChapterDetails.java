package friedman.tal.mfs.timelines.events.details;

import java.util.Map;

import javax.jdo.annotations.EmbeddedOnly;
import javax.jdo.annotations.NotPersistent;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.appengine.api.datastore.Text;

import friedman.tal.mfs.resources.IChapterDetails;
import friedman.tal.mfs.timelines.events.EventDetails;
import friedman.tal.util.Utils;

@PersistenceCapable
@EmbeddedOnly
public class ChapterDetails extends EventDetails implements IChapterDetails {

	@NotPersistent
	private static final Logger LOGGER = LoggerFactory.getLogger(ChapterDetails.class);
	
	@Persistent
	private Text _text;
			
	
	private ChapterDetails(Map<String, String> aMap) {
		// this check cannot be moved to the super class constructor
		if (aMap == null) return;
		
		String value;
		
		value = Utils.getValueOrEmptyString(aMap.get(IChapterDetails.Field.text.name()));
		//value = Utils.getValueOrEmptyString(aMap.get("text"));
//		this._text = new Text( value.length() > 0 ? value.trim() : NotSet.STRING );		
		
		// don't store a value if none was supplied
		if (value != null) value = value.trim();
		
		if (value.length() > 0) {
			this._text = new Text(value);
		}
	}

	
	static ChapterDetails fromMap(Map<String, String> aMap) {
		return new ChapterDetails(aMap);
	}
	

	@Override
	public String getText() {
		if (this._text == null) return "";
		
		return this._text.getValue();
	}
	
	/*@Override
	public final EventType getType() {
		return EventType.CHAPTER;
	}*/

}

package friedman.tal.mfs.timelines.events.details;

import java.util.Map;

import javax.jdo.annotations.EmbeddedOnly;
import javax.jdo.annotations.NotPersistent;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import friedman.tal.mfs.resources.IChemoDetails;
import friedman.tal.mfs.NotSet;
import friedman.tal.mfs.timelines.events.EventDetails;
import friedman.tal.util.Utils;

@PersistenceCapable
@EmbeddedOnly
public class ChemoDetails extends EventDetails implements IChemoDetails {
	
	@NotPersistent
	private static final Logger LOGGER = LoggerFactory.getLogger(ChemoDetails.class);
	
	@Persistent
	private String _oncologist;

	@Persistent
	private String _chemo;
	
	@Persistent
	private ChemoResult _result;
	
	@Persistent
	private Boolean _isRecommended;
	
	private ChemoDetails(Map<String, String> aMap) {		
		// this check cannot be moved to the super class constructor
		if (aMap == null) return;
		
		String value;
		
		value = Utils.getValueOrEmptyString(aMap.get(Field.oncologist.name()));
		//value = Utils.getValueOrEmptyString(aMap.get("oncologist"));
		this._oncologist = value.length() > 0 ? value : NotSet.STRING;
		
		value = Utils.getValueOrEmptyString(aMap.get(Field.chemo.name()));
		this._chemo = value.length() > 0 ? value : NotSet.STRING;		
		
		value = Utils.getValueOrEmptyString(aMap.get(Field.result.name()));
		this._result = value.length() > 0 ? ChemoResult.valueOf(value) : NotSet.CHEMO_RESULT;
		
		value = Utils.getValueOrEmptyString(aMap.get(Field.recommended.name()));
		this._isRecommended = value.length() > 0 ? Boolean.valueOf(value) : NotSet.BOOLEAN;
		
	}
	
	@Override
	public String getOncologist() {
		return this._oncologist;
	}
	
	@Override
	public String getChemo() {
		return this._chemo;
	}
	
	@Override
	public ChemoResult getResult() {
		return this._result;
	}

	@Override
	public Boolean isRecommended() {
		return this._isRecommended;
	}

	static ChemoDetails fromMap(Map<String, String> aMap) {
		return new ChemoDetails(aMap);
	}

	/*@Override
	public final EventType getType() {
		return EventType.CHEMO;
	}*/

	
}

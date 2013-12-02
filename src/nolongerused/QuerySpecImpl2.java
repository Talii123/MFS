package nolongerused;

import java.util.HashMap;
import java.util.Map;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;

import friedman.tal.util.Utils;

public class QuerySpecImpl2<T> {
	private static final String FILTER_PROPERTY_NAME = "_filter";
	private static final String PARAMETERS_PROPERTY_NAME = "_parameters";
	private static final String ORDERING_PROPERTY_NAME = "_orderingString";
	private static  final String RANGE_PROPERTY_NAME = "_rangeString";
	
	private final Map<String, String> _properties;
	private final Class<T> _theJDOClass;
	
	private QuerySpecImpl2(Class<T> aJDOClass) {
		this._properties = Utils.newMap();
		this._theJDOClass = aJDOClass;
	}
	
	public static <T> QuerySpecImpl2<T> makeQuerySpec(Class<T> aJDOClass, String aFilterString, String aParametersString, String anOrderingString, String aRangeString) {
		QuerySpecImpl2<T> qSpec = new QuerySpecImpl2<T>(aJDOClass);
		
		qSpec.setFilter(aFilterString);
		qSpec.setParameters(aParametersString);
		qSpec.setOrdering(anOrderingString);
		qSpec.setRange(aRangeString);
		
		return qSpec;
	}
	
	public Query prepareQuery(PersistenceManager pm) {
		Query query = pm.newQuery(this._theJDOClass);
		if (this.hasFilter()) {
			query.setFilter(this.getFilter());
		/*
		 * if the query has a filter, it must have parameters; if it doesn't have a filter, it doesn't need parameters
		 * }
		if (aQuerySpec.hasParameters()) {*/
			query.declareParameters(this.getParameters());
		}
		if (this.hasOrdering()) {
			query.setOrdering(this.getOrdering());
		}
		if (this.hasRange()) {
			query.setRange(this.getRange());
		}		
		
		return query;
	}
	
	public boolean hasFilter() {
		return has(FILTER_PROPERTY_NAME);
	}
	
	public boolean hasParameters() {
		return has(PARAMETERS_PROPERTY_NAME);
	}
	
	public boolean hasOrdering() {
		return has(ORDERING_PROPERTY_NAME);
	}
	
	public boolean hasRange() {
		return has(RANGE_PROPERTY_NAME);
	}
	
	public String getFilter() {
		return this._properties.get(FILTER_PROPERTY_NAME);
	}
	
	public String getParameters() {
		return this._properties.get(PARAMETERS_PROPERTY_NAME);
	}
	
	public String getOrdering() {
		return this._properties.get(ORDERING_PROPERTY_NAME);
	}
	
	public String getRange() {
		return this._properties.get(RANGE_PROPERTY_NAME);
	}
	
	private boolean has(String aPropteryName) {
		return this._properties.containsKey(aPropteryName);
	}
	
	private void setFilter(String aFilterString) {
		this._properties.put(FILTER_PROPERTY_NAME, aFilterString);
	}
	
	private void setParameters(String aParametersString) {
		this._properties.put(PARAMETERS_PROPERTY_NAME, aParametersString);
	}
	
	private void setOrdering(String anOrderingString) {
		this._properties.put(ORDERING_PROPERTY_NAME, anOrderingString);
	}
	
	private void setRange(String aRangeString) {
		this._properties.put(RANGE_PROPERTY_NAME, aRangeString);
	}
}
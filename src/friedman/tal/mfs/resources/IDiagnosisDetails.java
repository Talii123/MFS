package friedman.tal.mfs.resources;

import javax.validation.constraints.Min;

import friedman.tal.mfs.timelines.events.IEventDetails;
import friedman.tal.mfs.timelines.events.details.CancerStage;
import friedman.tal.validation.EncodedStringArray;

public interface IDiagnosisDetails extends IEventDetails {

	public enum Field implements IField {
		age,
		stage,
		diseaseSites
		/*metastatic,
		lymphNodes,
		majorVascularInvasion,
		microVascularInvasion
		/*age("age"),
		stage("stage"),
		isMetastatic("metastatic"),
		isLymphNodeInvolvement("lymphNodeInvolvement"),
		majorVascularInvasion("majorVascularInvasion"),
		microVascularInvasion("minorVascularInvasion");
		
		private final String paramName;
		
		private Field(String aParamName) {
			this.paramName = aParamName;
		}
		
		public String getParamName() {
			return this.paramName;
		}
		
		public static Field valueByParamName(String aParamName) {
			return mapping.get(aParamName);
		}
		
		private static final Map<String, Field> mapping;
		static {
			mapping = Utils.newMap();
			for (Field field : Field.values()) {
				mapping.put(field.getParamName(), field);
			}
		}*/
	}
	
	@Min(0)
	public Byte getAge();
		
	public CancerStage getStage();
	
	@EncodedStringArray
	public String getDiseaseSites();
	
	/*public Boolean isMetastatic();

	public Boolean isLymphNodes();

	public Boolean isMajorVascularInvasion();
	
	public Boolean isMicroVascularInvasion();*/


}

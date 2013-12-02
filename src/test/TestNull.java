package test;

public class TestNull {

	private String _nullField;
	
	public TestNull() {
		
	}
	
	public static void main(String[] args) {
		System.out.println(new TestNull().toString());
	}

	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		
		sb.append("_nullField").append(_nullField != null ? _nullField : "[null]");
		return sb.toString();
	}
	
	
}

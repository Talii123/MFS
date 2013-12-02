package nolongerused;

import java.util.HashSet;
import java.util.Set;

import javax.ws.rs.core.Application;

public class HelloWorldApplication extends Application {
	private Set<Object> _theSingletons;
	
	public HelloWorldApplication() {
		_theSingletons = new HashSet<Object>();
		_theSingletons.add(new HelloWorldResource());
	}
	
	@Override
	public Set<Object> getSingletons() {
		return _theSingletons;
	}
	
}

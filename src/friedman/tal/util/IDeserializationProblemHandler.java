package friedman.tal.util;

import friedman.tal.util.SavePropsDeserializationProblemHandler.UnhandledProperty;

public interface IDeserializationProblemHandler {

	public void addUnhandledProperty(UnhandledProperty anUnhandledProperty);

}

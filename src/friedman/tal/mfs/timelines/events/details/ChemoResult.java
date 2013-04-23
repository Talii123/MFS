package friedman.tal.mfs.timelines.events.details;

public enum ChemoResult {
	CR,		// complete response
	PR1,		// partial response where things only improved
	PR2,		// partial response mixed with growth
	SD,		// stable disease
	PD,		// progressive disease
	DK;		// don't know
}

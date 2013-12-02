package friedman.tal.validation;

import java.util.Date;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import friedman.tal.mfs.timelines.events.IEvent;

public class CheckDateRangeValidator implements ConstraintValidator<ValidDateRange, IEvent> {

	@Override
	public void initialize(ValidDateRange arg0) {
		// do nothing - it's a marker annotation
	}

	@Override
	public boolean isValid(IEvent anEvent, ConstraintValidatorContext arg1) {
		Date startDate = anEvent.getStart();
		Date endDate = anEvent.getEnd();
		
		// RULES:
		// 1) startDate must be a valid date
		// 2) endDate, if it exists, represents a time at or after startDate
		return startDate != null &&  (endDate == null || endDate.getTime() >= startDate.getTime()); 
	}

}

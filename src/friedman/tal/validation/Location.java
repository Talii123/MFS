package friedman.tal.validation;

import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;
import javax.validation.constraints.Pattern;

@Target({METHOD, FIELD})
@Retention(RUNTIME)
@Pattern(regexp = ValidationUtils.LOCATION_REGEX_PATTERN)
@Constraint(validatedBy = {})
@Documented
public @interface Location {
    String message() default "{friedman.tal.constraints.alpha}";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

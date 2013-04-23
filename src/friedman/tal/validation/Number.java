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
@Pattern(regexp = "^(0|[1-9][0-9]*)?$")
@Constraint(validatedBy = {})
@Documented
public @interface Number {
    String message() default "{friedman.tal.constraints.number}";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

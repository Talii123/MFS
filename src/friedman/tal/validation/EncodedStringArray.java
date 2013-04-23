package friedman.tal.validation;

import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;
import javax.validation.constraints.Pattern;

@Target({METHOD})
@Retention(RUNTIME)
@Pattern(regexp = ValidationUtils.ENCODED_STRING_ARRAY_REGEX_PATTERN)
@Constraint(validatedBy = {})
@Documented
public @interface EncodedStringArray {
    String message() default "{friedman.tal.constraints.encodedStringArrayPattern}";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

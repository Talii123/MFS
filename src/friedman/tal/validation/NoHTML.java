package friedman.tal.validation;

import static java.lang.annotation.RetentionPolicy.RUNTIME;
import static java.lang.annotation.ElementType.METHOD;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;

import org.hibernate.validator.constraints.SafeHtml;
import org.hibernate.validator.constraints.SafeHtml.WhiteListType;

@Target({METHOD})
@Retention(RUNTIME)
@SafeHtml(whitelistType = WhiteListType.NONE)
@Constraint(validatedBy = {})
@Documented
public @interface NoHTML {
    String message() default "{friedman.tal.constraints.nohtml}";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

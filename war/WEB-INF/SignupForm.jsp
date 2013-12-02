<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<%@page import="friedman.tal.mfs.resources.IAgreementResource"%>
<%@page import="friedman.tal.mfs.resources.IUserAccountResource"%>
<%@page import="friedman.tal.mfs.SharingOption"%>
<%@page import="com.google.appengine.api.users.UserServiceFactory"%>
<%@page import="com.google.appengine.api.users.UserService"%>
<%@page import="friedman.tal.mfs.users.UserAccountResource"%>

<%-- // TODO: confirm this is not a security vulnerability!! --%>
<c:set var="errorMsg"><%= (String)request.getParameter(IUserAccountResource.ERROR_MSG_STRING_ATTR) %></c:set>
<c:set var="loginURL"><%= (String)request.getAttribute(IUserAccountResource.LOGIN_URL_ATTR_NAME) %></c:set>

	<%
			pageContext.setAttribute("sharingOptions", SharingOption.values());
	%>
	
		
<c:if test="${empty agreementFormParamName}">
	<%-- <c:out value="Setting param name for agreementForm"/>--%>
	<c:set var="agreementFormParamName" scope="application"><%= UserAccountResource.SIGNUP_FORM_AGREEMENT_FORM_PARAM_NAME %></c:set>
	<c:set var="agreementFormParamName" scope="request"><%= UserAccountResource.SIGNUP_FORM_AGREEMENT_FORM_PARAM_NAME %></c:set>
</c:if>
<c:set var="agreementForm" value="${requestScope[agreementFormParamName]}"  />

<c:if test="${empty postSignUpFormURLParamName}">
	<%-- <c:out value="Setting param name for postSignUpURL"/>--%>
	<c:set var="postSignUpFormURLParamName" scope="application"><%= UserAccountResource.POST_SIGN_UP_FORM_URL_PARAM_NAME %></c:set>
	<c:set var="postSignUpFormURLParamName" scope="request"><%= UserAccountResource.POST_SIGN_UP_FORM_URL_PARAM_NAME %></c:set>
</c:if>
<c:set var="postSignUpFormURL" value="${requestScope[postSignUpFormURLParamName]}" />

<c:set var="consentParamName"><%= IAgreementResource.CONSENT_PARAM_NAME %></c:set>
<c:set var="consentYesValue"><%= IAgreementResource.CONSENT_YES_VALUE %></c:set>

    
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>Sign Up!!</title>
	<link type="text/css" rel="stylesheet" href="/css/app.css">
	<link type="text/css" rel="stylesheet" href="/css/editUI.css">	
	<style type="text/css">
		input[type="checkbox"] + label {
		  float: none;
		  margin-left: 1em;
		  width: 21em;
		}
		
		form, h2, .betaMsg {
			margin-left: 10%;
		}
		
		.betaMsg {
			color: #DC5151;
			font-weight:bold;
		}	
		
		form label {
			width: 20em;
		}
		
		textarea {
			margin: 0 0 1em;
		}
		
		 h1 {
		  margin: 1em 1em 0;
		}
		
		.info {
			margin: 0 1em;
		}
		
		.error {
			color: red;
			font-weight: bold;
		}
		
		img.beta {position: fixed; bottom: 0px; right: 0px;}		
		
	</style>
	<!--  as long as jQuery is not being bundled with the rest of the JS its fine to use it here too; if we bundle later on, should
	 		probably rewrite JS on this page to not use jQuery so we can avoid cache misses on it.
	 -->	 
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js" type="text/javascript"></script>
	<!--<script src="/js/jquery-1.8.0.min.js"></script>-->
	
	<%-- NOTE: ${consentYesValue} is substituted on the server --%>
	<script>
		$(function() {
				$("form").on("submit", function($event) {					
					var	$agreeToTermsCheck = $("#agreeToTermsCheck:checked"),  
							isConsented = $agreeToTermsCheck.length > 0;
							
					if (!isConsented) {
						alert("Please agree to the Terms of Service if you want to sign up.");
						$event.preventDefault();
					}
				});
		});
		
	    (function(scriptURLs) {
	    	var numScripts = scriptURLs.length;
	    
            // from jQuery website
            $.getCachedScript = function(url, options) {
                // allow user to set any option except for dataType, cache, and url
                options = $.extend(options || {}, {
	                dataType: "text",
	                cache: true,
	                url: url
                });
                // Use $.ajax() since it is more flexible than $.getScript
                // Return the jqXHR object so we can chain callbacks
                return jQuery.ajax(options);
            }; 
	    	
	    	
		        
		        for (i=0; i < numScripts; ++i) {
		            scriptURL = scriptURLs[i];
		            console.log("going to try to prefetch url: ", scriptURL);
		            $.getCachedScript(scriptURL);
		            console.log("request sent");
		        }
	    })(["/js/all-creator-beta.js", "/js/all-demo-beta.js", "/js/all-play-beta.js", "js/all-viewer-beta.js"]);
	</script>
	
</head>
<body>
	<c:if test="${!empty loginURL}">
		<div style="float: right"><a href="${loginURL}">Sign in</a></div>
	</c:if>
	<h1>Sign Up</h1>
	<c:if test="${errorMsg != 'null'}">
		<h2 class="error"><c:out  value="${errorMsg}"/></h2>
	</c:if>
	<h3 class="betaMsg">We are in<a href="//www.techterms.com/definition/beta_software" target="_blank">beta!</a>  We still have a lot more work to do but are eager for you to give the software a try!  </h3>
	<form action="${postSignUpFormURL}" method="post">
		<input type="hidden" name="next" value="${nextURL}"/>
		<input type="hidden" name="agreementName" value="${agreementForm.name}" />
		<input type="hidden" name="agreementRevision" value="${agreementForm.revisionNum}" />	
	
		<!--<label for="firstNameInput">First Name: </label><input name="firstName" type="text" id="firstNameInput" /><br/>
		<label for="lastNameInput">Last Name: </label><input name="lastName" type="text" id="lastNameInput" /><br/>
		 <label for="emailInput">Email: </label><input name="email" type="text" readonly="readonly" value="${email}" id="emailInput" /><br/> -->
		<label for="viewPermissionsSelect">Who do you want to see your timeline? </label>
		<select name="viewPermissions" id="viewPermissionsSelect">
			<!-- <option selected="selected">Everyone</option>
			<option disabled="disabled">Community</option>
			<option disabled="disabled">Only Me</option>-->
			<c:forEach items="${sharingOptions}" var="option" >
				<option value="${option}"><c:out value="${option}" /></option>
			</c:forEach>
		</select><br/>
		<%-- <label for="userNameInput">Who's name should appear on the timeline?</label><input name="userName" type="text" id="userNameInput"><span class="info">You can use a nickname if you like :)</span><br/>
		<!--  <p>You will always be able to view your personal timeline at http://fibrolamellar.appspot.com/myStory (assuming you are logged in :)</p>
		
		<p>If you want to share your timeline with others, they will use a different URL.  You can choose one by providing a timeline name below.
		If you do not choose a name for your timeline, the system will generate a funny looking one - something like "a5f2j2d"</p>--> 
		<label for="timelineIDInput">Timeline Name: </label><input name="timelineID" type="text" id="timelineIDInput"/> <span class="info">(optional)</span><br/>
		--%>
		
		<h3>Terms and Conditions</h3>
		<textarea id="agreementText" rows="20" cols="80">${agreementForm.text}</textarea><br/>
		You can read our privacy policy <a target="_blank" href="http://docs.google.com/document/d/1wyphyFWEA85cEb5b2Btkx5xGK6aSULnJyWYX4Vs53aQ/">here.</a>  We welcome your comments.<br/><br/>
		<input name="${consentParamName}" type="checkbox" id="agreeToTermsCheck" value="${consentYesValue}" /><label for="agreeToTermsCheck">I agree to the terms and conditions of this site.</label><br/>

		
		<br/>
		<input type="submit" value="Sign Up!" />
	</form>
	<a href="//www.techterms.com/definition/beta_software"><img class="beta" src="/images/betablack.png" /></a>
</body>
</html>